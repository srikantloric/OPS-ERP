export const FEE_TYPE_MONTHLY = "M01";
export const FEE_HEADERS = [
  {
    title: "Examination Fee",
    titleShort: "EXAM",
    field: "examFee",
  },
  {
    title: "Anual Fee",
    titleShort: "ANUAL",
    field: "annualFee",
  },
  {
    title: "Admission Fee",
    titleShort: "ADD.",
    field: "admissionFee",
  },
  {
    title: "Other Fee",
    titleShort: "OTHER",
    field: "otherFee",
  },
];

///Payment state
export const paymentStatus = {
  DEFAULT: "UNPAID",
  PARTIAL: "PARTIAL",
  PAID: "PAID",
};
