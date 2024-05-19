export const FEE_TYPE_MONTHLY = "M01";
export const FEE_HEADERS = [
  {
    title: "Examination Fee",
    value: "E01",
    titleShort: "EXAM",
    field: "examFee",
  },
  {
    title: "Anual Fee",
    value: "A01",
    titleShort: "ANUAL",
    field: "annualFee",
  },
  {
    title: "Admission Fee",
    value: "A02",
    titleShort: "ADD.",
    field: "admissionFee",
  },
  {
    title: "Other Fee",
    value: "X01",
    titleShort: "OTHER",
    field: "otherFee",
  },
];


///Payment state
export const paymentStatus ={
  DEFAULT:"UNPAID",
  PARTIAL:"PARTIAL",
  PAID:"PAID",
}