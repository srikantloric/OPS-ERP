import firebase from "../firebase";

export interface IPaymentNL {
  challanId: string;
  paymentId:string;
  studentId:string;
  challanTitle: string;
  amountPaid: number;
  breakdown: { headerTitle: string; amount: number; amountPaid: number }[];
  recievedOn: firebase.firestore.Timestamp;
  recievedBy: string;
  status: "UNPAID" | "PARTIAL" | "PAID";
}

export interface IChallanHeaderType {
  headerTitle: string;
  amount: number;
  amountPaid: number;
};

export interface IChallanNL {
  studentId:string,
  challanId:string,
  challanTitle: string;
  feeHeaders: IChallanHeaderType[];
  totalAmount: number;
  amountPaid: number;
  status: "UNPAID" | "PARTIAL" | "PAID";
  createdBy: string;
  createdOn: firebase.firestore.Timestamp;
  feeDiscount:number,
  dueDate: firebase.firestore.Timestamp;
  lateFine: number;
  feeConsession:number;
  totalDue?:number;
}


export interface IChallanFlattenNL {
  studentId: string;
  challanId: string;
  challanTitle: string;
  totalAmount: number;
  amountPaid: number;
  status: "UNPAID" | "PARTIAL" | "PAID";
  createdBy: string;
  createdOn: firebase.firestore.Timestamp;
  feeDiscount: number;
  dueDate: firebase.firestore.Timestamp;
  lateFine: number;
  feeConsession: number;
  totalDue?: number;
  [key: string]: any; // For dynamic keys from feeHeaders
}