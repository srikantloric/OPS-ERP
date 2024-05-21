import jsPDF from "jspdf";
import {
  EMAIL_ICON,
  HOME_ICON,
  PHONE_ICON,
  POPPINS_BOLD,
  POPPINS_REGULAR,
  POPPINS_SEMIBOLD,
  SCISSOR_ICON,
} from "./Base64Url";
import {
  SCHOOL_ACCOUNTANT,
  SCHOOL_ADDRESS,
  SCHOOL_CONTACT,
  SCHOOL_EMAIL,
  SCHOOL_NAME,
} from "config/schoolConfig";
import { StudentDetailsType } from "types/student";
import { IChallanHeaderType } from "types/payment";

const fetchQrCode = async () => {
  const res = await fetch(
    "https://kqd8cfefra.execute-api.ap-south-1.amazonaws.com",
    {
      method: "POST",
      body: JSON.stringify({
        url: "www.example.com",
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );
  const data = await res.json();
  return data.qrImageBase64;
};

interface Props {
  studentMasterData: StudentDetailsType;
  feeHeaders: IChallanHeaderType[];
  challanMonths: string[];
  totalAmount: number;
  totalPaidAmount: number;
  paidAmount: number;
  discountAmount: number;
  recieptId: string;
  recieptDate: string;
}

export const GenerateFeeReciept = async ({
  studentMasterData,
  feeHeaders,
  challanMonths,
  totalAmount,
  totalPaidAmount,
  paidAmount,
  discountAmount,
  recieptDate,
  recieptId,
}: Props) => {
  console.log(studentMasterData);
  if (studentMasterData) {
    //Page Size
    const pHeight = 210;
    const pWidth = 148.5;

    //width and height office
    const pHeightOff = 210;
    const pWidthoff = 149.5;

    //Page Paddings
    const pBorderPadd = 8;

    //off
    const pBorderPaddOffsetX = 155;

    const doc = new jsPDF({
      orientation: "l",
      unit: "mm",
      format: "a4", // Half of A4
    });

    // Load fonts
    doc.addFileToVFS("Poppins-Bold", POPPINS_BOLD);
    doc.addFont("Poppins-Bold", "Poppins", "bold");

    doc.addFileToVFS("Poppins-Regular", POPPINS_REGULAR);
    doc.addFont("Poppins-Regular", "Poppins", "normal");

    doc.addFileToVFS("Poppins-Semibold", POPPINS_SEMIBOLD);
    doc.addFont("Poppins-Semibold", "Poppins", "semibold");

    // Draw border around content
    doc.setDrawColor("#949494");
    doc.rect(
      pBorderPadd,
      pBorderPadd,
      pWidth - pBorderPadd * 2,
      pHeight - pBorderPadd * 2
    ); // x, y, width, height

    //office copy
    doc.rect(
      pBorderPaddOffsetX,
      pBorderPadd,
      pWidthoff - pBorderPadd * 2,
      pHeightOff - pBorderPadd * 2
    ); // x, y, width, height

    //School logo

    const logoImg = new Image();
    logoImg.src = "/logotransparent.png";
    doc.addImage(logoImg, "PNG", 12, 10, 25, 20);
    doc.addImage(logoImg, "PNG", pBorderPaddOffsetX + 5, 10, 25, 20);

    const schoolHeaderStartX = 40;
    const schoolHeaderStartY = 18;
    //school name
    doc.setFontSize(21);
    doc.setFont("Poppins", "bold");
    doc.text(SCHOOL_NAME, schoolHeaderStartX, schoolHeaderStartY);
    doc.text(
      SCHOOL_NAME,
      pBorderPaddOffsetX + schoolHeaderStartX - 5,
      schoolHeaderStartY
    );

    //school address

    const schoolContactDetailStartY = 20;
    const schoolContactDetailStartX = schoolHeaderStartX - 5;

    doc.addImage(
      HOME_ICON,
      schoolHeaderStartX,
      schoolContactDetailStartY,
      3,
      3
    );
    doc.addImage(
      HOME_ICON,
      pBorderPaddOffsetX + schoolContactDetailStartX,
      schoolContactDetailStartY,
      3,
      3
    );

    doc.setFontSize(8);
    doc.setFont("Poppins", "normal");
    doc.text(
      SCHOOL_ADDRESS,
      schoolHeaderStartX + 4,
      schoolContactDetailStartY + 3
    );
    doc.text(
      SCHOOL_ADDRESS,
      pBorderPaddOffsetX + schoolContactDetailStartX + 4,
      schoolContactDetailStartY + 3
    );

    //school contact
    doc.addImage(
      PHONE_ICON,
      schoolHeaderStartX,
      schoolContactDetailStartY + 5,
      3,
      3
    );
    doc.addImage(
      PHONE_ICON,
      pBorderPaddOffsetX + schoolContactDetailStartX,
      schoolContactDetailStartY + 5,
      3,
      3
    );
    doc.text(
      SCHOOL_CONTACT,
      schoolHeaderStartX + 4,
      schoolContactDetailStartY + 8
    );
    doc.text(
      SCHOOL_CONTACT,
      pBorderPaddOffsetX + schoolContactDetailStartX + 4,
      schoolContactDetailStartY + 8
    );

    //school email
    doc.addImage(
      EMAIL_ICON,
      schoolHeaderStartX,
      schoolContactDetailStartY + 10,
      3,
      3
    );
    doc.addImage(
      EMAIL_ICON,
      pBorderPaddOffsetX + schoolContactDetailStartX,
      schoolContactDetailStartY + 10,
      3,
      3
    );
    doc.text(
      SCHOOL_EMAIL,
      schoolHeaderStartX + 4,
      schoolContactDetailStartY + 12.5
    );
    doc.text(
      SCHOOL_EMAIL,
      pBorderPaddOffsetX + schoolContactDetailStartX + 4,
      schoolContactDetailStartY + 12.5
    );

    //rectable1

    doc.setFillColor("#939393");
    doc.rect(pBorderPadd + 0.5, 38, pWidth - pBorderPadd * 2 - 1, 8, "F");
    doc.rect(pBorderPaddOffsetX, 38, pWidth - pBorderPadd * 2 + 1, 8, "F");

    doc.setFont("Poppins", "semibold");
    doc.setFontSize(10);
    doc.setTextColor("#fff");
    doc.text("Fee Reciept", pBorderPadd + 3, 43);
    doc.text("Fee Reciept", pBorderPaddOffsetX + 3, 43);

    doc.text("Session : 2024_25", pWidth - pBorderPadd - 2, 43, {
      align: "right",
    });
    doc.text(
      "Session : 2024_25",
      pBorderPaddOffsetX + pWidth - pBorderPadd * 2,
      43,
      {
        align: "right",
      }
    );

    ///rectangle 2
    doc.setFillColor("#cbc9c9");
    doc.rect(pBorderPadd + 0.5, 46.5, pWidth - pBorderPadd * 2 - 1, 6, "F");
    doc.rect(pBorderPaddOffsetX, 46.5, pWidth - pBorderPadd * 2 + 1, 6, "F");
    doc.setTextColor("#000");
    doc.setFontSize(8);
    doc.text("Reciept No: " + recieptId, pBorderPadd + 3, 50.5);
    doc.text("Reciept No: " + recieptId, pBorderPaddOffsetX + 3, 50.5);
    doc.text("Date : " + recieptDate, pWidth - pBorderPadd - 2, 50.5, {
      align: "right",
    });
    doc.text(
      "Date : " + recieptDate,
      pBorderPaddOffsetX + pWidth - pBorderPadd * 2,
      50.5,
      {
        align: "right",
      }
    );

    //students details
    doc.setFontSize(9);
    doc.setFont("Poppins", "normal");

    let studentDetailsStartY = 58;

    doc.text(
      "Name: " + studentMasterData.student_name.toLocaleUpperCase(),
      pBorderPadd + 3,
      studentDetailsStartY
    );
    doc.text(
      "Name: " + studentMasterData.student_name.toLocaleUpperCase(),
      pBorderPaddOffsetX + 3,
      studentDetailsStartY
    );

    doc.text(
      "Class : " + studentMasterData.class,
      pWidth - pBorderPadd - 2,
      studentDetailsStartY,
      {
        align: "right",
      }
    );
    doc.text(
      "Class : " + studentMasterData.class,
      pBorderPaddOffsetX + pWidth - (pBorderPadd * 2 + 1),
      studentDetailsStartY,
      {
        align: "right",
      }
    );

    doc.text(
      "Father Name: " + studentMasterData.father_name,
      pBorderPadd + 3,
      studentDetailsStartY + 4.5
    );
    doc.text(
      "Father Name: " + studentMasterData.father_name,
      pBorderPaddOffsetX + 3,
      studentDetailsStartY + 4.5
    );
    doc.text(
      "DOB : " + studentMasterData.dob,
      pWidth - pBorderPadd - 2,
      studentDetailsStartY + 4.5,
      {
        align: "right",
      }
    );
    doc.text(
      "DOB : " + studentMasterData.dob,
      pBorderPaddOffsetX + pWidth - (pBorderPadd * 2 + 1),
      studentDetailsStartY + 4.5,
      {
        align: "right",
      }
    );
    doc.text(
      "Phone No: " + studentMasterData.contact_number,
      pBorderPadd + 3,
      studentDetailsStartY + 8.5
    );
    doc.text(
      "Phone No: " + studentMasterData.contact_number,
      pBorderPaddOffsetX + 3,
      studentDetailsStartY + 8.5
    );
    doc.text(
      "Roll No: " + studentMasterData.class_roll,
      pWidth - pBorderPadd - 2,
      studentDetailsStartY + 8.5,
      { align: "right" }
    );
    doc.text(
      "Roll No: " + studentMasterData.class_roll,
      pBorderPaddOffsetX + pWidth - (pBorderPadd * 2 + 1),
      studentDetailsStartY + 8.5,
      { align: "right" }
    );
    doc.text(
      "Section -" + studentMasterData.section,
      pWidth - pBorderPadd - 2,
      studentDetailsStartY + 12.5,
      { align: "right" }
    );
    doc.text(
      "Section -" + studentMasterData.section,
      pBorderPaddOffsetX + pWidth - (pBorderPadd * 2 + 1),
      studentDetailsStartY + 12.5,
      { align: "right" }
    );
    doc.text(
      "Reg. No : " + studentMasterData.admission_no,
      pBorderPadd + 3,
      studentDetailsStartY + 12.5
    );
    doc.text(
      "Reg. No : " + studentMasterData.admission_no,
      pBorderPaddOffsetX + 3,
      studentDetailsStartY + 12.5
    );

    doc.text(
      "Address : " + studentMasterData.address,
      pBorderPadd + 3,
      studentDetailsStartY + 16.5
    );
    doc.text(
      "Address : " + studentMasterData.address,
      pBorderPaddOffsetX + 3,
      studentDetailsStartY + 16.5
    );

    //line before fee month details
    const feeSectionStartPointY = 88;

    doc.setDrawColor("#949494");
    doc.setFont("Poppins", "normal");
    doc.line(
      pBorderPadd,
      feeSectionStartPointY - 6,
      pWidth - pBorderPadd,
      feeSectionStartPointY - 6
    );

    doc.line(
      pBorderPaddOffsetX,
      feeSectionStartPointY - 6,
      pBorderPaddOffsetX + pWidth - pBorderPadd * 2 + 1,
      feeSectionStartPointY - 6
    );

    const feeMonthsString = challanMonths.join(", ");

    doc.text(
      "Fee Months : " + feeMonthsString,
      pBorderPadd + 3,
      feeSectionStartPointY - 2
    );

    doc.text(
      "Fee Months : " + feeMonthsString,
      pBorderPaddOffsetX + 3,
      feeSectionStartPointY - 2
    );

    ///rectangle after fee month
    doc.setFillColor("#cbc9c9");
    doc.rect(
      pBorderPadd + 0.5,
      feeSectionStartPointY,
      pWidth - pBorderPadd * 2 - 1,
      6,
      "F"
    );
    doc.rect(
      pBorderPaddOffsetX,
      feeSectionStartPointY,
      pWidth - pBorderPadd * 2 + 1,
      6,
      "F"
    );

    doc.setFillColor("#000");
    doc.rect(
      pBorderPadd + 0.5,
      feeSectionStartPointY,
      pWidth - pBorderPadd * 2 - 1,
      6,
      "S"
    );
    doc.rect(
      pBorderPaddOffsetX,
      feeSectionStartPointY,
      pWidth - pBorderPadd * 2 + 1,
      6,
      "S"
    );

    doc.setFont("Poppins", "semibold");
    doc.setTextColor("#373743");
    doc.setFontSize(10);

    doc.text("Particular", pBorderPadd + 3, feeSectionStartPointY + 4);
    doc.text("Particular", pBorderPaddOffsetX + 3, feeSectionStartPointY + 4);

    doc.text("Fee Amount", pWidth - pWidth / 4 - 35, feeSectionStartPointY + 4);
    doc.text(
      "Fee Amount",
      pBorderPaddOffsetX + pWidth - pWidth / 4 - 35,
      feeSectionStartPointY + 4
    );

    doc.text(
      "Paid Amount",
      pWidth - pBorderPadd - 3,
      feeSectionStartPointY + 4,
      {
        align: "right",
      }
    );
    doc.text(
      "Paid Amount",
      pBorderPaddOffsetX + pWidth - (pBorderPadd * 2 + 1),
      feeSectionStartPointY + 4,
      {
        align: "right",
      }
    );

    doc.setFont("Poppins", "normal");
    doc.setTextColor("#000");

    let feeTypeLayoutHeight = 1;
    // Determine the number of iterations needed to draw at least four rows
    const rowCount = Math.max(3, feeHeaders.length);

    for (let i = 0; i < rowCount; i++) {
      const item = feeHeaders[i] || {
        headerTitle: "",
        amountPaid: 0,
        amount: 0,
      };
      feeTypeLayoutHeight = feeSectionStartPointY + (i + 2) * 6;

      // Draw fee header title and amounts for each row
      doc.text(item.headerTitle, pBorderPadd + 3, feeTypeLayoutHeight);
      doc.text(item.headerTitle, pBorderPaddOffsetX + 3, feeTypeLayoutHeight);

      if (item.amountPaid) {
        doc.text(
          "Rs. " + item.amountPaid,
          pWidth - pBorderPadd - 3,
          feeTypeLayoutHeight,
          { align: "right" }
        );
        doc.text(
          "Rs. " + item.amountPaid,
          pBorderPaddOffsetX + pWidth - (pBorderPadd * 2 + 1),
          feeTypeLayoutHeight,
          { align: "right" }
        );
      } else {
        doc.text("", pWidth - pBorderPadd - 3, feeTypeLayoutHeight, {
          align: "right",
        });
        doc.text(
          "",
          pBorderPaddOffsetX + pWidth - (pBorderPadd * 2 + 1),
          feeTypeLayoutHeight,
          { align: "right" }
        );
      }
      ////amount

      if (item.amount) {
        doc.text(
          "Rs. " + item.amount.toString(),
          pBorderPadd + 22 + 29 + 38,
          feeTypeLayoutHeight,
          { align: "center" }
        );
        doc.text(
          "Rs. " + item.amount.toString(),
          pBorderPaddOffsetX + 22 + 29 + 38,
          feeTypeLayoutHeight,
          { align: "center" }
        );
      } else {
        doc.text("", pBorderPadd + 22 + 29 + 38, feeTypeLayoutHeight, {
          align: "center",
        });
        doc.text("", pBorderPaddOffsetX + 22 + 29 + 38, feeTypeLayoutHeight, {
          align: "center",
        });
      }

      // Draw horizontal lines for each row
      doc.setDrawColor("#cbc9c9");
      doc.line(
        pBorderPadd,
        feeTypeLayoutHeight + 2,
        pWidth - pBorderPadd,
        feeTypeLayoutHeight + 2
      );
      doc.line(
        pBorderPaddOffsetX,
        feeTypeLayoutHeight + 2,
        pBorderPaddOffsetX + pWidth - (pBorderPadd * 2 - 1),
        feeTypeLayoutHeight + 2
      );
    }

    doc.line(
      pWidth / 2,
      feeSectionStartPointY + 6,
      pWidth / 2,
      feeTypeLayoutHeight + 10
    );
    doc.line(
      pBorderPaddOffsetX + pWidth / 2,
      feeSectionStartPointY + 6,
      pBorderPaddOffsetX + pWidth / 2,
      feeTypeLayoutHeight + 10
    );

    doc.line(
      pWidth - pWidth / 4,
      feeSectionStartPointY + 6,
      pWidth - pWidth / 4,
      feeTypeLayoutHeight + 10
    );
    doc.line(
      pBorderPaddOffsetX + pWidth - pWidth / 4 - 7,
      feeSectionStartPointY + 6,
      pBorderPaddOffsetX + pWidth - pWidth / 4 - 7,
      feeTypeLayoutHeight + 10
    );

    doc.line(
      pBorderPadd,
      feeTypeLayoutHeight + 10,
      pWidth - pBorderPadd,
      feeTypeLayoutHeight + 10
    );

    doc.line(
      pBorderPaddOffsetX,
      feeTypeLayoutHeight + 10,
      pBorderPaddOffsetX + pWidth - (pBorderPadd * 2 - 1),
      feeTypeLayoutHeight + 10
    );

    //fee amount total
    doc.text("Grand Total", pBorderPadd + 22 + 29, feeTypeLayoutHeight + 7, {
      align: "center",
    });
    doc.text(
      "Grand Total",
      pBorderPaddOffsetX + 22 + 29,
      feeTypeLayoutHeight + 7,
      {
        align: "center",
      }
    );

    //total Amount
    doc.text(
      "Rs." + totalAmount,
      pBorderPadd + 22 + 29 + 38,
      feeTypeLayoutHeight + 7,
      {
        align: "center",
      }
    );
    doc.text(
      "Rs." + totalAmount,
      pBorderPaddOffsetX + 22 + 29 + 38,
      feeTypeLayoutHeight + 7,
      {
        align: "center",
      }
    );

    //totoal paid amount
    doc.text(
      "Rs." + paidAmount,
      pWidth - pBorderPadd - 3,
      feeTypeLayoutHeight + 7,
      {
        align: "right",
      }
    );
    doc.text(
      "Rs." + paidAmount,
      pBorderPaddOffsetX + pWidth - (pBorderPadd * 2 + 1),
      feeTypeLayoutHeight + 7,
      {
        align: "right",
      }
    );

    doc.line(
      pBorderPadd,
      feeTypeLayoutHeight + 17,
      pWidth - pBorderPadd,
      feeTypeLayoutHeight + 17
    );
    doc.line(
      pBorderPaddOffsetX,
      feeTypeLayoutHeight + 17,
      pBorderPaddOffsetX + pWidth - (pBorderPadd * 2 - 1),
      feeTypeLayoutHeight + 17
    );

    doc.text(
      "Discount: Rs." + discountAmount,
      pWidth - pBorderPadd - 3,
      feeTypeLayoutHeight + 14.5,
      { align: "right" }
    );
    doc.text(
      "Discount: Rs." + discountAmount,
      pBorderPaddOffsetX + pWidth - (pBorderPadd * 2 + 1),
      feeTypeLayoutHeight + 14.5,
      { align: "right" }
    );

    /////Total paid amount
    doc.setFont("Poppins", "semibold");
    doc.text(
      "Total Paid Amount: Rs." + totalPaidAmount,
      pWidth - pBorderPadd - 3,
      feeTypeLayoutHeight + 21,
      { align: "right" }
    );
    doc.text(
      "Total Paid Amount: Rs." + totalPaidAmount,
      pBorderPaddOffsetX + pWidth - (pBorderPadd * 2 + 1),
      feeTypeLayoutHeight + 21,
      { align: "right" }
    );
    doc.line(
      pBorderPadd,
      feeTypeLayoutHeight + 23,
      pWidth - pBorderPadd,
      feeTypeLayoutHeight + 23
    );

    doc.line(
      pBorderPaddOffsetX,
      feeTypeLayoutHeight + 23,
      pBorderPaddOffsetX + pWidth - (pBorderPadd * 2 - 1),
      feeTypeLayoutHeight + 23
    );
    //////////////

    doc.setFont("Poppins", "normal");

    const feeRemarkAndAccOffY = feeTypeLayoutHeight + 40;

    doc.setFontSize(8)
    var maxWidth = 100; // Set the maximum width in PDF units (e.g., points)
    var text =
      "This is a computer-generated document. No signature is required. The fee receipt can be easily downloaded by scanning the QR code.";

    // Split text into lines based on maxWidth
    var lines = doc.splitTextToSize(text, maxWidth);

    // Add each line to the document
    lines.forEach((line: any, index: number) => {
      doc.text(line, pBorderPadd + 25, pHeight - pBorderPadd - 17 + index * 6);
    });

    // Repeat for the second block of text
    lines.forEach((line: any, index: number) => {
      doc.text(
        line,
        pBorderPaddOffsetX + 25,
        pHeight - pBorderPadd - 17 + index * 6
      );
    });
    //Accountant Details
    doc.text(
      SCHOOL_ACCOUNTANT,
      pWidth - pBorderPadd - 10,
      feeRemarkAndAccOffY - 5,
      {
        align: "right",
      }
    );

    doc.text("Accountant", pWidth - pBorderPadd - 13, feeRemarkAndAccOffY, {
      align: "right",
    });

    doc.text(
      SCHOOL_ACCOUNTANT,
      pBorderPaddOffsetX + pWidth - pBorderPadd - 15,
      feeRemarkAndAccOffY - 5,
      { align: "right" }
    );
    doc.text(
      "Accountant",
      pBorderPaddOffsetX + pWidth - pBorderPadd - 17,
      feeRemarkAndAccOffY,
      { align: "right" }
    );

    const qr = await fetchQrCode();
    doc.addImage(
      qr,
      "jpeg",
      pBorderPadd + 3,
      pHeight - pBorderPadd - 26,
      20,
      20
    );

    doc.addImage(
      qr,
      "jpeg",
      pBorderPaddOffsetX + 3,
      pHeight - pBorderPadd - 26,
      20,
      20
    );

    // const textLines = doc.splitTextToSize(
    //   "Note : Students must pay their fees by the 10th of each month to avoid a late fine of RS. 20.00.",
    //   65
    // );

    // doc.text(textLines, pBorderPadd + 25, pHeight - 26);
    // doc.text(textLines, pBorderPaddOffsetX + 25, pHeight - 26);
    doc.setFontSize(6);
    doc.text("Scan to download.", pBorderPadd + 3, pHeight - pBorderPadd - 3);
    doc.text(
      "Scan to download.",
      pBorderPaddOffsetX + 3,
      pHeight - pBorderPadd - 3
    );

    doc.setFontSize(9);
    doc.text(
      "------ Student Copy ------",
      pWidth / 2,
      pHeight - pBorderPadd - 2,
      { align: "center" }
    );
    doc.text(
      "------ Office Copy ------",
      pBorderPaddOffsetX + pWidth / 2,
      pHeight - pBorderPadd - 2,
      { align: "center" }
    );

    //right side

    doc.setDrawColor("#000");
    doc.setLineDashPattern([3, 2], 1);
    doc.line(
      (pWidth + pBorderPaddOffsetX) / 2 - pBorderPadd / 2,
      0,
      (pWidth + pBorderPaddOffsetX) / 2 - pBorderPadd / 2,
      210
    );

    doc.addImage(
      SCISSOR_ICON,
      (pWidth + pBorderPaddOffsetX - 5) / 2 - pBorderPadd / 2,
      40,
      5,
      7
    );
    doc.addImage(
      SCISSOR_ICON,
      (pWidth + pBorderPaddOffsetX - 5) / 2 - pBorderPadd / 2,
      120,
      5,
      7
    );

    // Create blob URL for the PDF
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    return url;
  } else {
    console.log("user data not found please refresh and try again...");
  }
};
