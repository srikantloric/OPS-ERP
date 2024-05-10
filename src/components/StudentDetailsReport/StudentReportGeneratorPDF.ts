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
  import autoTable from "jspdf-autotable";
  
  
  const AttendanceHeader = [
    "ID",
    "Student Name",
    "Father's Name",
    "Class",
    "Sec",
    "Roll",
    "Contact",
    "Address",
  ];

  const studentData = [  // Replace with your actual student data
    [ "123", "John Doe","John Daddy", "Nursary", "A",  "17", "987563269","Ratu Ranchi"],
    [ "123", "Harry Potter", "Harry Daddy","Nursary","B", "02", "983455559", "Lalpur Ranchi"],
    [ "456", "Jane Smith", "Jane Daddy", "Nursary","B", "32", "987563269","Kadru Ranchi"],
];


  
  export const StudReportPDF = async (
  ) => {
  
    return new Promise((resolve, reject) => {
      try {
        const doc = new jsPDF({
          orientation: "l",
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
  
        doc.addImage(LOGO_BASE_64, x + 45, y + 1, 30, 25);
  
        const schoolHeaderStartX = x + 75;
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
          cardXEndPoint - 200,
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
        doc.text("BALANCE SHEET", cardWidth / 2, y + 30);
  
        let tableX = x + 5;
        let tableY = y + 43.5;
  
        autoTable(doc, {
          head: [AttendanceHeader],
          body: [studentData],
          startY: tableY,
          theme: "grid",
          styles: {
            textColor: "#000",
            fontSize: 8,
            valign: "middle",
          },
          margin: { left: tableX + 20 },
          headStyles: {
            cellWidth: 30,
            fillColor: "#fff",
            textColor: "#000",
            minCellHeight: 4,
          },
        });
  
        // autoTable(doc, {
        //   head: [AttStudentDataHeader],
        //   body: AttReportArray.map((item) => {
        //     var tempArr: CellInput[] = [];
        //     const stringArr: string[] = [];
        //     stringArr.push(item.studentName);
        //     stringArr.push(item.studentFatherName);
        //     stringArr.push(item.studentContact);
        //     stringArr.push(item.attendanceStatus);
        //     stringArr.push(item.comment);
        //     // stringArr.push(item.createdAt)
        //     tempArr.push(stringArr);
        //     return tempArr;
        //   }),
        //   startY: tableY + 20,
        //   theme: "grid",
        //   styles: {
        //     textColor: "#000",
        //     fontSize: 8,
        //     valign: "middle",
        //   },
        //   margin: { left: tableX },
        //   headStyles: {
        //     cellWidth: 30,
        //     fillColor: "#fff",
        //     textColor: "#000",
        //     minCellHeight: 4,
        //   },
        // });
  
        studentData.forEach((data, index) => {
          // Draw border around content
          doc.setDrawColor("#949494");
          doc.rect(x, y, cardWidth, cardHeight);
  
          if (index === studentData.length - 1) {
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
  