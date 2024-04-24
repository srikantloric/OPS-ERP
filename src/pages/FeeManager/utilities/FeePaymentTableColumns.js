export const FEE_TABLE_COLS = [
  {
    field: "id",
    title: "Payment ID",
  },
  { field: "fee_title", title: "Fee Title" },
  { field: "fee_total", title: "Tution Fee" },
  { field: "computer_fee", title: "Computer Fee" },
  { field: "transportation_fee", title: "Transport Fee" },
  { field: "discount_amount", title: "Discount" },
  { field: "late_fee", title: "Late Fee",render:(rowData)=>{
    const currentDate = new Date();
    const lateFine = currentDate>rowData.payment_due_date.toDate()?rowData.late_fee:0;
    return <p>{lateFine}</p>
  }
 },
  { field: "paid_amount", title: "Paid" },
  {
    field: "due_amount",
    title: "Due",
    render: (rowData) => {
      const dueAmount =
      parseInt(rowData.fee_total) +
      parseInt(rowData.computer_fee) +
      parseInt(rowData.late_fee) +
      parseInt(rowData.transportation_fee) -
      parseInt(rowData.paid_amount);
      // console.log(dueAmount)
      return <p>{dueAmount}</p>;
    },
  },
  {
    field: "payment_status",
    title: "Status",
    render: (rowData) => {
      const styles = {
        width: 40,
        height: 40,
        borderRadius: "50%",
        cursor: "pointer",
        objectFit: "cover",
      };
      const dueAmount =
      parseInt(rowData.fee_total) +
      parseInt(rowData.computer_fee) +
      parseInt(rowData.late_fee) +
      parseInt(rowData.transportation_fee) -
      parseInt(rowData.paid_amount);
      if (dueAmount === 0) {
        return (
          <p
            style={{
              color: "var(--bs-white)",
              backgroundColor: "var(--bs-success)",
              textAlign: "center",
              textTransform: "capitalize",
            }}
          >
            Paid
          </p>
        );
      } else {
        return (
          <p
            style={{
              color: "var(--bs-white)",
              backgroundColor: "var(--bs-danger2)",
              textAlign: "center",
              textTransform: "capitalize",
            }}
          >
            Due
          </p>
        );
      }
    },
  },
];
