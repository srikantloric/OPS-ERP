import { IChallanHeaderType, IChallanNL, IPaymentNL } from "types/payment";
import { StudentDetailsType } from "types/student";

////Create Fee Header with paidAmount
export function distributePaidAmount(
  challan: IChallanNL,
  receivedAmount: number,
  isPartialPayment: boolean
): IChallanHeaderType[] {
  const updatedFeeHeaders: IChallanHeaderType[] = challan.feeHeaders.map(
    (header) => ({
      ...header,
    })
  );

  if (isPartialPayment) {
    let remainingAmount = receivedAmount;

    // Sort headers by priority: let's assume priority is based on the order they appear
    for (let header of updatedFeeHeaders) {
      const amountDue = header.amount - header.amountPaid;
      if (amountDue > 0) {
        // Only consider headers with remaining due
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
    updatedFeeHeaders.forEach((header) => {
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

export function generateFeeHeadersForChallanWithMarkedAsPaid(
  student: StudentDetailsType,
  isMarkedAsPaid: boolean
): {
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
        amountPaid: isMarkedAsPaid ? feeAmount : 0,
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

    if (key === "feeHeaders" && Array.isArray(value)) {
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

/////

function formatChallanDate(challanId: string): string {
  // Extract month and year from the challanId
  const monthNumber = parseInt(challanId.substr(7, 2), 10);
  const year = challanId.substr(9);

  // Convert month number to month name abbreviation
  const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const monthName = monthNames[monthNumber - 1];

  // Format the result
  return `${monthName}(${year})`;
}

// Example usage of formatChallanDate function
// const formatChallanDateAnother = (challanId: string): string => {
//   // Assuming challanId includes the date in YYYYMM format or similar
//   const year = challanId.substring(0, 4);
//   const month = challanId.substring(4, 6);
//   const date = new Date(parseInt(year), parseInt(month) - 1);
//   return `${date.toLocaleString('default', { month: 'short' })} (${year})`;
// };
const formatHeaderTitle = (title: string): string => {
  switch (title) {
    case "monthlyFee":
      return "Monthly Fee";
    case "transportationFee":
      return "Transportation Fee";
    case "computerFee":
      return "Computer Fee";
    // Add other cases as necessary
    default:
      return title;
  }
};

interface ChallanIdsAndHeaders {
  challanMonthYear: string[];
  feeHeaders: IChallanHeaderType[];
  paidAmount: number;
  totalAmount: number;
  discountAmount: number;
  totalPaidAmount: number;
}
export const extractChallanIdsAndHeaders = (
  payments: IPaymentNL[]
): ChallanIdsAndHeaders => {
  const challanMonthYear: string[] = [];
  const feeHeaders: IChallanHeaderType[] = [];
  let paidAmount = 0;
  let totalAmount = 0;
  let discountAmount = 0;
  let totalPaidAmount = 0;

  payments.forEach((payment) => {
    const formattedDate = formatChallanDate(payment.challanId);
    challanMonthYear.push(formatChallanDate(payment.challanId));
    discountAmount += payment.feeConsession;
    totalPaidAmount += payment.amountPaid;

    if (payment.breakdown && Array.isArray(payment.breakdown)) {
      payment.breakdown.forEach((item) => {
        feeHeaders.push({
          headerTitle: `${formatHeaderTitle(
            item.headerTitle
          )} - ${formattedDate}`,
          amount: item.amount,
          amountPaid: item.amountPaid,
        });
        // Increment totalPaidAmount and totalAmount
        paidAmount += item.amountPaid;
        totalAmount += item.amount;
      });
    }
  });

  return {
    challanMonthYear,
    feeHeaders,
    paidAmount,
    totalAmount,
    totalPaidAmount,
    discountAmount,
  };
};


///random 6 digit no
export const generateRandomSixDigitNumber = (): number => {
  return Math.floor(100000 + Math.random() * 900000); // Generates a number between 100000 and 999999
};