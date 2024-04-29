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
import { jsPDF } from "jspdf";
//   import autoTable, { CellInput } from "jspdf-autotable";
import { StudentAttendanceGlobalSchema } from "types/attendance";
import { StudentDetailsType } from "types/student";


let FullAttendanceReport = async (FilterStudentData: StudentDetailsType[], FullAttArray: StudentAttendanceGlobalSchema[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });
      const cardWidth = doc.internal.pageSize.getWidth() - 15;
      const cardHeight = doc.internal.pageSize.getHeight() - 15;
      const margin = 2;

      const x = 5 + margin;
      const y = 5 + margin;
      // const y=cardHeight+margin;

      doc.setTextColor("#000");

      // Load fonts
      doc.addFileToVFS("Poppins-Bold", POPPINS_BOLD);
      doc.addFont("Poppins-Bold", "Poppins", "bold");

      doc.addFileToVFS("Poppins-Regular", POPPINS_REGULAR);
      doc.addFont("Poppins-Regular", "Poppins", "normal");

      doc.addFileToVFS("Poppins-Semibold", POPPINS_SEMIBOLD);
      doc.addFont("Poppins-Semibold", "Poppins", "semibold");
      ///Start of PDF Design

      doc.addImage(LOGO_BASE_64, x + 8, y + 2, 30, 25);

      const schoolHeaderStartX = x + 50;
      const schoolHeaderStartY = y + 5;

      doc.setFontSize(15);
      doc.setFont("Poppins", "bold");
      doc.text(SCHOOL_NAME, schoolHeaderStartX + 10, schoolHeaderStartY);

      doc.setFontSize(8);
      doc.setFont("Poppins", "semibold");
      doc.text(
        "An English Medium School Based on CBSE Syllabus",
        schoolHeaderStartX + 7,
        schoolHeaderStartY + 5
      );

      const schoolContactDetailStartY = schoolHeaderStartY + 2;
      // const schoolContactDetailStartX = schoolHeaderStartX - 5;

      const cardXStartPoint = x;
      const cardXEndPoint = cardWidth;

      doc.setFillColor("#cbc9c9");
      doc.rect(
        schoolHeaderStartX + 5,
        schoolContactDetailStartY + 5,
        cardXEndPoint - 140,
        4,
        "F"
      );

      doc.setFontSize(6);
      doc.setFont("Poppins", "normal");
      doc.text(
        SCHOOL_ADDRESS,
        schoolHeaderStartX + 12,
        schoolContactDetailStartY + 7.5
      );

      //school contact
      doc.addImage(
        PHONE_ICON,
        schoolHeaderStartX + 9,
        schoolContactDetailStartY + 10,
        3,
        3
      );

      doc.text(
        SCHOOL_CONTACT,
        schoolHeaderStartX + 13,
        schoolContactDetailStartY + 12
      );

      //school email
      doc.addImage(
        EMAIL_ICON,
        schoolHeaderStartX + 34,
        schoolContactDetailStartY + 10,
        3,
        3
      );

      doc.text(
        SCHOOL_EMAIL,
        schoolHeaderStartX + 38,
        schoolContactDetailStartY + 12
      );

      doc.setFillColor("#939393");

      doc.rect(cardXStartPoint, y + 26, cardXEndPoint, 6, "F");

      doc.setFont("Poppins", "semibold");
      doc.setFontSize(9);
      doc.setTextColor("#fff");
      doc.text("Full Attendance Report", cardWidth / 2, y + 30);

      //   let tableX = x + 5;
      //   let tableY = y + 43.5;
      console.log("FullArray->" + FullAttArray);


      //Student Details
      doc.setFont("Poppins", "semibold");
      doc.setFontSize(6);
      doc.setTextColor("#000");
      doc.setFontSize(8);
      doc.setFont("Poppins", "normal");

      let studentDetailsStartY = y + 37;
      let studentDetailsStartX=x+3;

      doc.text("Name: " + FilterStudentData[0].student_name, studentDetailsStartX, studentDetailsStartY);

      doc.text(
        "Class : " + FilterStudentData[0].class,
        studentDetailsStartX+ cardWidth/3,
        studentDetailsStartY
      );

      doc.text(
        "Father Name: " + FilterStudentData[0].father_name,
        studentDetailsStartX + 2*(cardWidth/3) ,
        studentDetailsStartY,
      );

      doc.text(
        "DOB : " + FilterStudentData[0].dob,
        studentDetailsStartX,
        studentDetailsStartY+5,
      );

      doc.text(
        "Phone No: " + FilterStudentData[0].contact_number,
        studentDetailsStartX + cardWidth/3,
        studentDetailsStartY +5
      );

      doc.text(
        "Roll No: " + FilterStudentData[0].class_roll,
        studentDetailsStartX + 2*(cardWidth/3),
        studentDetailsStartY + 5,
      );

      doc.text(
        "Section: " + FilterStudentData[0].section,
        studentDetailsStartX,
        studentDetailsStartY + 10,
      );

      doc.text(
        "Reg. No : " + FilterStudentData[0].admission_no,
        studentDetailsStartX + cardWidth/3,
        studentDetailsStartY + 10
      );





      FullAttArray.forEach((data, index) => {
        // Draw border around content
        doc.setDrawColor("#949494");
        doc.rect(x, y, cardWidth, cardHeight);

        if (index === FullAttArray.length - 1) {
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
}

export default FullAttendanceReport;