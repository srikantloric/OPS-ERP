import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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


let DueRecieptListHeader = [
    "S No",
    "Due Month",
    "Due Date",
    "Name",
    "Ad no",
    "Class",
    "Roll",
    "Father's Name",
    "Contact",
    "Due Amount",
    "Remark",
];

// type ListArr={
//     sl:String,
//     session:String,
//     due_month:String,
//     due_date:String,
//     stud_name:String,
//     stud_adno:String,
//     stud_class:String,
//     stud_sec:String,
//     stud_rol:String,
//     stud_contact:String,
//     due_amount:String,
//     remark:String,
// };

export const DueRecieptList = async (
    recieptData: DueRecieptPropsType[]
): Promise<string> => {

    let tempArr:any[] = [];
    let DueRecieptListArr = recieptData.map((item, index) => {
            const stringArr = [];
            stringArr.push((index + 1).toString());
            stringArr.push(item.due_month);
            stringArr.push(item.due_date);
            stringArr.push(item.student_name);
            stringArr.push(item.admission_no);
            stringArr.push(item.class+" "+item.section);
            stringArr.push(item.roll_number.toString());
            stringArr.push(item.father_name);
            stringArr.push(item.phone_number.toString());
            stringArr.push(item.fee_heads[0].value+item.fee_heads[1].value+item.fee_heads[2].value);
            stringArr.push("");
            tempArr.push(stringArr);
            return tempArr;
        });

    console.log("DueArr=" + DueRecieptListArr);


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
            doc.text("Due Reciept List", cardWidth / 2 - 8, y + 30);


            doc.setFontSize(7);
            let tableX = x - 7;
            let tableY = y + 43.5;
            doc.text("Session - "+recieptData[0].current_session,tableX,tableY);

            tableX = x - 7;
            tableY = y + 53.5;

            autoTable(doc, {
                head: [DueRecieptListHeader],
                body: tempArr,
                startY: tableY,
                theme: "grid",
                styles: {
                    textColor: "#000",
                    fontSize: 8,
                },
                margin: { left: tableX + 10 },
                headStyles: {
                    fillColor: "#fff",
                    textColor: "#000",
                    minCellHeight: 4,
                },
                columnStyles:{
                    0:{cellWidth:9}, //Sl no
                    1:{cellWidth:20}, //Due Month
                    2:{cellWidth:17}, //Due Date
                    3:{cellWidth:25}, //Name
                    4:{cellWidth:20}, //Admission no
                    5:{cellWidth:20}, //Class
                    6:{cellWidth:13}, //Roll
                    7:{cellWidth:25}, //Father's Name
                    8:{cellWidth:23}, //Contact
                    9:{cellWidth:20}, //Due Amount
                    10:{cellWidth:40}, //Remark
                },
            });


            ///End Of PDF DESIGN
            // Draw border around content
            doc.setDrawColor("#949494");
            doc.rect(x, y, cardWidth, cardHeight);

            recieptData.forEach((data, index) => {
                // Draw border around content
                doc.setDrawColor("#949494");
                doc.rect(x, y, cardWidth, cardHeight);

                if (index === recieptData.length - 1) {
                    // Save PDF and update state with URL
                    const blob = doc.output("blob");
                    // doc.save("save.pdf")
                    var blobUrl = URL.createObjectURL(blob);

                    resolve(blobUrl);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
};
