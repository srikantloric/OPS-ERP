import * as XLSX from 'xlsx';
import { LOGO_BASE_64 } from 'utilities/Base64Url';

const studentData = [  // Replace with your actual student data
    { ID: 123, Name: "John Doe", Fathername: "John Daddy", Class: "Nursary", Section:"A", Roll: "17", Contact: "987563269", Address:"Ratu Ranchi"},
    { ID: 123, Name: "Harry Potter", Fathername: "Harry Daddy", Class: "Nursary", Section:"B", Roll: "02", Contact: "983455559", Address:"Lalpur Ranchi"},
    { ID: 456, Name: "Jane Smith", Fathername: "Jane Daddy", Class: "Nursary", Section:"B", Roll: "32", Contact: "987563269", Address:"Kadru Ranchi"},
];

const companyName="Company Name";


const StudDataExcel = () => {

  const worksheet = XLSX.utils.json_to_sheet([[companyName]]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.sheet_add_aoa(worksheet,[[{ t: 's', s: { fill: { fgColor: { rgb: 'FFFF00' } } }, h: '<img src="data:image/png;base64,' + LOGO_BASE_64 + '" />' }]]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Data");

    XLSX.utils.sheet_add_aoa(worksheet, [[ "ID","Name","Fathername","Class","Section","Roll","Contact","Address"]], { origin: { c: 0, r: 2 } });
    
    for (let i = 0; i < studentData.length; i++) {
      const currentRow = i + 3; 
      XLSX.utils.sheet_add_aoa(worksheet, [[ studentData[i].ID, studentData[i].Name, studentData[i].Fathername, studentData[i].Class, studentData[i].Section, studentData[i].Roll, studentData[i].Contact, studentData[i].Address]], { origin: { c: 0, r: currentRow } });
    }

    
    // Save workbook as an Excel file
    XLSX.writeFile(workbook,  'student_data.xlsx', { bookType: 'xlsx', type: 'array' });

  };



export default StudDataExcel;