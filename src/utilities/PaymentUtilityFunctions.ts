import { IChallanHeaderType, IChallanNL } from "types/payment";
import { StudentDetailsType } from "types/student";

////Create Fee Header with paidAmount
export function distributePaidAmount(challan: IChallanNL, receivedAmount: number, isPartialPayment: boolean): IChallanHeaderType[] {
  const updatedFeeHeaders: IChallanHeaderType[] = challan.feeHeaders.map(header => ({
    ...header
  }));

  if (isPartialPayment) {
    let remainingAmount = receivedAmount;

    // Sort headers by priority: let's assume priority is based on the order they appear
    for (let header of updatedFeeHeaders) {
      const amountDue = header.amount - header.amountPaid;
      if (amountDue > 0) { // Only consider headers with remaining due
        if (remainingAmount >= amountDue) {
          header.amountPaid += amountDue;
          remainingAmount -= amountDue;
        } else {
          header.amountPaid += remainingAmount;
          remainingAmount = 0;
          break; // No more amount to distribute
        }
      }
    }
  } else {
    // Full payment scenario
    updatedFeeHeaders.forEach(header => {
      header.amountPaid = header.amount; // Set amountPaid to the full amount
    });
  }

  return updatedFeeHeaders;
}



///generate Monthly Fee Challan
interface StudentData {
  monthly_fee?: number;
  computer_fee?: number;
  transportation_fee?: number;
}

export function generateFeeHeadersForChallan(student: StudentDetailsType): {
  feeHeaderList: IChallanHeaderType[];
  totalFeeAmount: number;
} {
  const feeHeaderList: IChallanHeaderType[] = [];
  let totalFeeAmount: number = 0;

  const fees = [
    { key: "monthly_fee", title: "monthlyFee" },
    { key: "computer_fee", title: "computerFee" },
    { key: "transportation_fee", title: "transportationFee" },
  ];

  fees.forEach((fee) => {
    const feeAmount = student[fee.key as keyof StudentData];
    if (feeAmount !== undefined && feeAmount !== null && feeAmount !== 0) {
      feeHeaderList.push({
        headerTitle: fee.title,
        amount: feeAmount,
        amountPaid: 0,
      });
      totalFeeAmount += Number(feeAmount);
    }
  });

  return { feeHeaderList, totalFeeAmount };
}

//Flatten Challan 
interface FlattenedObject {
  [key: string]: any;
}

export function flattenObject(obj: IChallanNL): FlattenedObject {
  return Object.keys(obj).reduce((acc: FlattenedObject, key: string) => {
      const value = (obj as any)[key];

      if (key === 'feeHeaders' && Array.isArray(value)) {
          value.forEach((item: IChallanHeaderType) => {
              if (item.headerTitle && item.amount !== undefined) {
                  acc[item.headerTitle] = item.amount;
              }
          });
      
      } else {
          acc[key] = value;
      }

      return acc;
  }, {});
}


