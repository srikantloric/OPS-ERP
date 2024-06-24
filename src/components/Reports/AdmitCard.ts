import jsPDF from "jspdf";
import {
  EMAIL_ICON,
  LOGO_BASE_64,
  PHONE_ICON,
  POPPINS_BOLD,
  POPPINS_REGULAR,
  POPPINS_SEMIBOLD,
} from "utilities/Base64Url";
import {
  SCHOOL_ADDRESS,
  SCHOOL_CONTACT,
  SCHOOL_EMAIL,
  SCHOOL_NAME,
} from "config/schoolConfig";
import { DueRecieptPropsType } from "types/student";

let admitCardData = [
  { name:"student1", class:"nursary", sec:"A", fatherName:"father1", roll:"2"},
  { name:"student1", class:"nursary", sec:"A", fatherName:"father1", roll:"2"},
  { name:"student1", class:"nursary", sec:"A", fatherName:"father1", roll:"2"},
  { name:"student1", class:"nursary", sec:"A", fatherName:"father1", roll:"2"},
];

export const AdmitCardGenerator = async (recieptData: DueRecieptPropsType[]
): Promise<string> =>  {
  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      const cardWidth = (doc.internal.pageSize.getWidth() - 15) / 2;
      const cardHeight = (doc.internal.pageSize.getHeight() - 15) / 2;
      const margin = 5;

      admitCardData.forEach((data, index) => {
        if (index > 0 && index % 4 === 0) {
          doc.addPage();
        }

        const columnIndex = index % 2;
        const rowIndex = Math.floor(index / 2) % 2;

        const x = columnIndex * (cardWidth + margin) + margin;
        const y = rowIndex * (cardHeight + margin) + margin;

        doc.setTextColor("#000");

        // Load fonts
        doc.addFileToVFS("Poppins-Bold", POPPINS_BOLD);
        doc.addFont("Poppins-Bold", "Poppins", "bold");

        doc.addFileToVFS("Poppins-Regular", POPPINS_REGULAR);
        doc.addFont("Poppins-Regular", "Poppins", "normal");

        doc.addFileToVFS("Poppins-Semibold", POPPINS_SEMIBOLD);
        doc.addFont("Poppins-Semibold", "Poppins", "semibold");
        ///Start of PDF Design

        doc.addImage(LOGO_BASE_64, x + 2, y + 6, 18, 16);
        doc.setFontSize(15);
        doc.setFont("Poppins", "bold");

        const schoolHeaderStartX = x + 25;
        const schoolHeaderStartY = y + 10;

        doc.text(SCHOOL_NAME, schoolHeaderStartX + 7, schoolHeaderStartY);

        doc.setFontSize(6);
        doc.setFont("Poppins", "semibold");
        doc.text(
          "An English Medium School Based on CBSE Syllabus",
          schoolHeaderStartX + 7,
          schoolHeaderStartY + 3
        );

        const schoolContactDetailStartY = schoolHeaderStartY + 2;
        // const schoolContactDetailStartX = schoolHeaderStartX - 5;

        const cardXStartPoint = x;
        const cardXEndPoint = cardWidth;

        doc.setFillColor("#cbc9c9");
        doc.rect(
          schoolHeaderStartX + 3.5,
          schoolContactDetailStartY + 3,
          cardXEndPoint - 35,
          4,
          "F"
        );

        doc.setFontSize(6);
        doc.setFont("Poppins", "normal");
        doc.text(
          SCHOOL_ADDRESS,
          schoolHeaderStartX + 6,
          schoolContactDetailStartY + 6
        );

        //school contact
        doc.addImage(
          PHONE_ICON,
          schoolHeaderStartX + 3,
          schoolContactDetailStartY + 9,
          3,
          3
        );

        doc.text(
          SCHOOL_CONTACT,
          schoolHeaderStartX + 7,
          schoolContactDetailStartY + 11
        );

        //school email
        doc.addImage(
          EMAIL_ICON,
          schoolHeaderStartX + 28,
          schoolContactDetailStartY + 9,
          3,
          3
        );

        doc.text(
          SCHOOL_EMAIL,
          schoolHeaderStartX + 32,
          schoolContactDetailStartY + 11
        );

        doc.setFillColor("#939393");

        doc.rect(cardXStartPoint, y + 32, cardXEndPoint, 6, "F");

        doc.setFont("Poppins", "semibold");
        doc.setFontSize(8);
        doc.setTextColor("#fff");
        doc.text("Due Reciept", x + 3, y + 36);

        doc.text("Session : 2024_25", x + cardWidth - margin, y + 36, {
          align: "right",
        });

        ///End Of PDF DESIGN
        // Draw border around content
        doc.setDrawColor("#949494");
        doc.rect(x, y, cardWidth, cardHeight);

        if (index === admitCardData.length - 1) {
          // Save PDF and update state with URL

          // Convert PDF to Blob
          const blob = doc.output("blob");
          const url = URL.createObjectURL(blob);

          resolve(url);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};