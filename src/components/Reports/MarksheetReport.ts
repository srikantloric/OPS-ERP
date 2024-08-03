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

const tableHeader = [
    "Subject",
    "Theory",
    "Pract.",
    "Pass Marks",
    "Marks Obtained"
];

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
                let percentage = (marksObtained / totalPassMarks) * 100;

                const rows2 = [
                    [
                        { content: 'Total' },
                        { content: fullMarks.toString(), colSpan: 2, styles: { halign: 'center' } },
                        { content: totalPassMarks.toString() },
                        { content: marksObtained.toString() }
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

                const schoolHeaderStartX = x + 50;
                const schoolHeaderStartY = y + 5;

                doc.setFontSize(15);
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

                const cardXStartPoint = x;
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
                    schoolHeaderStartX + 70,
                    schoolContactDetailStartY + 10,
                    3,
                    3
                );

                doc.text(
                    SCHOOL_EMAIL,
                    schoolHeaderStartX + 74,
                    schoolContactDetailStartY + 12
                );

                doc.setFillColor("#939393");

                doc.rect(cardXStartPoint, y + 26, cardXEndPoint, 6, "F");

                doc.setFont("Poppins", "semibold");
                doc.setFontSize(9);
                doc.setTextColor("#fff");
                doc.text("Marksheet 20__ - 20__", cardWidth / 2 - 8, y + 30);

                //Marksheet Body
                doc.setFont("Poppins", "normal");
                doc.setFontSize(10);
                doc.setTextColor("#000");


                //students details
                doc.setFontSize(9);
                doc.setFont("Poppins", "normal");

                let studentDetailsStartY = y + 49;

                doc.text("Name: " + data.student_name, x + 3, studentDetailsStartY);

                doc.text(
                    "Class : " + data.class,
                    x + cardWidth - margin,
                    studentDetailsStartY,
                    {
                        align: "right",
                    }
                );

                doc.text(
                    "Father Name: " + data.father_name,
                    x + 3,
                    studentDetailsStartY + 4.5
                );

                doc.text(
                    "DOB : " + data.dob,
                    x + cardWidth - margin,
                    studentDetailsStartY + 4.5,
                    {
                        align: "right",
                    }
                );

                doc.text(
                    "Phone No: " + data.phone_number,
                    x + 3,
                    studentDetailsStartY + 8.5
                );

                doc.text(
                    "Roll No: " + data.roll_number,
                    x + cardWidth - margin,
                    studentDetailsStartY + 8.5,
                    {
                        align: "right",
                    }
                );

                doc.text(
                    "Section: " + data.section,
                    x + cardWidth - margin,
                    studentDetailsStartY + 12.5,
                    {
                        align: "right",
                    }
                );

                doc.text(
                    "Reg. No : " + data.admission_no,
                    x + 3,
                    studentDetailsStartY + 12.5
                );

                doc.text(
                    "Address : " + data.address,
                    x + 3,
                    studentDetailsStartY + 16.5
                );

                //Marks Body
                doc.setFontSize(8);
                doc.setTextColor("#000");
                let tableY = studentDetailsStartY + 50;
                const combinedData = [...tableData, ...rows2];

                let lineCount = combinedData.length;
                const rows = combinedData.map(obj => Object.values(obj));

                autoTable(doc, {
                    head: [tableHeader],
                    body: rows,
                    startY: tableY,
                    theme: "grid",
                    styles: {
                        textColor: "#000",
                        fontSize: 8,
                    },
                    margin: { left: 25 + margin },
                    headStyles: {
                        cellWidth: 30,
                        fillColor: "#fff",
                        textColor: "#000",
                        minCellHeight: 4,
                    },
                });


                let startY = tableY + lineCount * 8;
                //Signatures
                startY += (50 + 2 * (tableData.length));
                doc.text("Class Teacher's Sign", startX , startY);
                doc.text("Parents Sign", startX + cardWidth / 3, startY);
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


