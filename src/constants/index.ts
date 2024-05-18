export const FEE_TYPE_MONTHLY = "M01";
export const FEE_HEADERS = [
  {
    title: "Examination Fee",
    value: "E01",
    titleShort: "EXAM",
    field: "exam_fee",
  },
  {
    title: "Anual Fee",
    value: "A01",
    titleShort: "ANUAL",
    field: "annual_fee",
  },
  {
    title: "Admission Fee",
    value: "A02",
    titleShort: "ADD.",
    field: "addmission_fee",
  },
  {
    title: "Other Fee",
    value: "X01",
    titleShort: "OTHER",
    field: "other_fee",
  },
];


///Payment state
export const paymentStatus ={
  DEFAULT:"UNPAID",
  PARTIAL:"PARTIAL",
  PAID:"PAID",
}