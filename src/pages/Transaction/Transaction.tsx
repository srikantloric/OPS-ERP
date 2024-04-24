import { Button } from "@mui/joy";
import Navbar from "components/Navbar/Navbar";
import LSPage from "components/Utils/LSPage";
import PageContainer from "components/Utils/PageContainer";
import { useEffect, useState } from "react";
import { BalanceSheetType } from "types/student";
import { BalanceSheet } from "components/TransactionsReport/BalanceSheet";


function Transaction() {

    const [pdfUrl, setPdfUrl] = useState<string>("");
    const sampleObjects: BalanceSheetType[]=[
        {
            tran_id: "HISJDO689JJ",
            tran_type: "credit",
            tran_name: "Monthly Fee",
            tran_desc: "This is monthly fee submited by student",
            tran_amount: "6000"
        },
        {
            tran_id: "HISJDO689JK",
            tran_type: "credit",
            tran_name: "Monthly Fee",
            tran_desc: "This is monthly fee submited by student",
            tran_amount: "3400"
        },
        {
            tran_id: "HISJDO689JL",
            tran_type: "debit",
            tran_name: "Bill payment",
            tran_desc: "This is Bill payment of software maintenance",
            tran_amount: "10000"
        }
    ];

    const getPdfUrl = async () => {
        // const pdfRes = await generateDueReciept(sampleObjects);
        const pdfRes = await BalanceSheet(sampleObjects);
        setPdfUrl(pdfRes);
      };
    
      useEffect(() => {
        getPdfUrl();
      }, []);
    
      const handleNewWindowOpen = () => {
        const features =
          "width=600,height=400,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes";
    
        window.open(pdfUrl, "_blank", features);
      };


    return(
    <PageContainer>
      <Navbar />
      <LSPage>
        <Button onClick={handleNewWindowOpen}>Generate Balance Sheet</Button>
      </LSPage>
    </PageContainer>
    );
}

export default Transaction;