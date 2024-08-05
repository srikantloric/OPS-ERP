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
import { DueRecieptPropsType } from "types/student";
import autoTable from "jspdf-autotable";

// const tableHeader = [
//     [{ content: "PERIODIC TEST (TERM 1)", colSpan: 4, styles: { halign: 'center' } }]
// ];
const header2 = [
    [{ content: "PERIODIC TEST (TERM 1)", colSpan: 4, styles: { halign: 'center' } }],
    [
        "Subject",
        "Theory",
        "Pract.",
        "Pass Marks",
        "Marks Obtained"
    ]
]

const tableData = [{
    Subject: "salple",
    Theory: "80",
    Pract: "20",
    Pass_Marks: "33",
    Marks_Obtaine: "41"
}, {
    Subject: "salple",
    Theory: "80",
    Pract: "20",
    Pass_Marks: "33",
    Marks_Obtaine: "41"
}, {
    Subject: "salple",
    Theory: "80",
    Pract: "20",
    Pass_Marks: "33",
    Marks_Obtaine: "41"
}, {
    Subject: "salple",
    Theory: "80",
    Pract: "20",
    Pass_Marks: "33",
    Marks_Obtaine: "100"
}, {
    Subject: "salple5",
    Theory: "80",
    Pract: "20",
    Pass_Marks: "33",
    Marks_Obtaine: "76"
}
]


export const MarksheetReportGenerator = async (recieptData: DueRecieptPropsType[]
): Promise<string> => {
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

            recieptData.forEach((data, index) => {

                // const y=cardHeight+margin;
                let startX = margin + 25;
                let totalPassMarks = 0;
                let fullMarks = 0;
                let marksObtained = 0;
                tableData.map(obj => fullMarks += (Number(obj.Theory) + Number(obj.Pract)));
                tableData.map(obj => totalPassMarks += Number(obj.Pass_Marks));
                tableData.map(obj => marksObtained += Number(obj.Marks_Obtaine));
                let percentage = (marksObtained / fullMarks) * 100;

                const rows2 = [
                    [
                        { content: 'Total', styles: { halign: 'center' } },
                        { content: fullMarks.toString(), colSpan: 2, styles: { halign: 'center' } },
                        { content: totalPassMarks.toString(), styles: { halign: 'center' } },
                        { content: marksObtained.toString(), styles: { halign: 'center' } }
                    ],
                    [
                        { content: 'Percentage(%)' },
                        { content: percentage, colSpan: 4, styles: { halign: 'center' } },
                    ],
                    [
                        { content: 'Rank' },
                        { content: '-', colSpan: 4, styles: { halign: 'center' } },
                    ],
                    [
                        { content: 'Remarks', styles: { halign: 'center' } },
                        { content: '-', colSpan: 4, rowSpan: 2, styles: { halign: 'center' } },
                    ],
                    [
                        { content: '', styles: { halign: 'center' } },
                    ]
                ];

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
                doc.addImage(LOGO_BASE_64, cardWidth - 30, y + 2, 30, 25);

                const schoolHeaderStartX = x + 40;
                const schoolHeaderStartY = y + 10;

                doc.setFontSize(20);
                doc.setFont("Poppins", "bold");
                doc.text(SCHOOL_NAME, schoolHeaderStartX + 15, schoolHeaderStartY);

                doc.setFontSize(8);
                doc.setFont("Poppins", "semibold");
                doc.text(
                    "An English Medium School Based on CBSE Syllabus",
                    schoolHeaderStartX + 12,
                    schoolHeaderStartY + 5
                );

                const schoolContactDetailStartY = schoolHeaderStartY + 2;
                // const schoolContactDetailStartX = schoolHeaderStartX - 5;

                const cardXEndPoint = cardWidth;

                doc.setFillColor("#cbc9c9");
                doc.rect(
                    schoolHeaderStartX + 10,
                    schoolContactDetailStartY + 5,
                    cardXEndPoint - 120,
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
                    schoolHeaderStartX + 5,
                    schoolContactDetailStartY + 10,
                    3,
                    3
                );

                doc.text(
                    SCHOOL_CONTACT,
                    schoolHeaderStartX + 9,
                    schoolContactDetailStartY + 12
                );

                //school email
                doc.addImage(
                    EMAIL_ICON,
                    schoolHeaderStartX + 66,
                    schoolContactDetailStartY + 10,
                    3,
                    3
                );

                doc.text(
                    SCHOOL_EMAIL,
                    schoolHeaderStartX + 70,
                    schoolContactDetailStartY + 12
                );

                doc.setFillColor("#ADD8E6");

                doc.rect(schoolHeaderStartX + 20, y + 32, schoolHeaderStartX + 28, 8);

                doc.setFont("Poppins", "semibold");
                doc.setFontSize(12);
                doc.setTextColor("#000");
                doc.text("Progress Report Card", cardWidth / 2 - 17, y + 37);

                //Marksheet Body



                //students details
                doc.setFontSize(10);
                doc.setFont("Poppins", "normal");
                doc.setTextColor("#000");

                let studentDetailsStartY = y + 49;

                doc.text("Name: " + data.student_name, x + 3, studentDetailsStartY);

                doc.text(
                    "Class : " + data.class,
                    cardWidth - 35,
                    studentDetailsStartY
                );

                doc.text(
                    "Father Name: " + data.father_name,
                    x + 3,
                    studentDetailsStartY + 5
                );

                doc.text(
                    "DOB : " + data.dob,
                    cardWidth - 35,
                    studentDetailsStartY + 5
                );

                doc.text(
                    "Phone No: " + data.phone_number,
                    x + 3,
                    studentDetailsStartY + 10
                );

                doc.text(
                    "Roll No: " + data.roll_number,
                    cardWidth - 35,
                    studentDetailsStartY + 10
                );

                doc.text(
                    "Section: " + data.section,
                    cardWidth - 35,
                    studentDetailsStartY + 15
                );

                doc.text(
                    "Reg. No : " + data.admission_no,
                    x + 3,
                    studentDetailsStartY + 15
                );

                doc.text(
                    "Address : " + data.address,
                    x + 3,
                    studentDetailsStartY + 20
                );


                //Marks Body
                doc.setFontSize(8);
                doc.setTextColor("#000");
                let tableY = studentDetailsStartY + 50;
                const combinedData = [...header2, ...tableData, ...rows2];

                doc.setFontSize(9);
                doc.setTextColor("#000");
                doc.text("Academic Session : 2024 - 25", cardWidth / 2 - 11, tableY - 13);

                let lineCount = combinedData.length;
                const rows = combinedData.map(obj => Object.values(obj));

                autoTable(doc, {
                    body: rows,
                    startY: tableY,
                    theme: "grid",
                    styles: {
                        textColor: "#000",
                        fontSize: 9,
                        halign: 'center',
                    },
                    margin: { left: 25 + margin },
                    bodyStyles: {
                        cellWidth: 40,
                        fillColor: "#fff",
                        textColor: "#000",
                        minCellHeight: 5,
                    },
                });

                //Result and Promotted Class
                let resultY = tableY + lineCount * 8;
                let resultPF = (percentage > 33.0) ? "PASS" : "FAIL";
                let promotedClass = (percentage > 33.0) ? (1 + Number(data.class)) : Number(data.class);
                doc.text("Result: " + resultPF, startX, resultY);
                doc.text("Promoted to Class: " + promotedClass, startX + cardWidth / 2, resultY);
                console.log("promotedClass: " + promotedClass.toString());



                //Signatures
                let startY = tableY + lineCount * 8;
                startY += (50 + 2 * (tableData.length));
                doc.setLineWidth(0.3);
                doc.setDrawColor(0, 0, 0);

                doc.line(startX - 3, startY - 5, startX + 35, startY - 5)
                doc.text("Class Teacher's Sign", startX, startY);
                doc.line(startX - 3 + cardWidth / 3, startY - 5, startX + 35 + cardWidth / 3, startY - 5);
                doc.text("Parents Sign", startX + cardWidth / 3, startY);
                doc.line(startX - 3 + 2 * (cardWidth / 3), startY - 5, startX + 35 + 2 * (cardWidth / 3), startY - 5);
                doc.text("Principal Sign", startX + 2 * (cardWidth / 3), startY);



                // Draw border around content
                doc.setDrawColor("#949494");
                doc.rect(x, y, cardWidth, cardHeight);

                doc.addPage();
                if (index === recieptData.length - 1) {
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


