import * as XLSX from 'xlsx';
import { LOGO_BASE_64 } from 'utilities/Base64Url';

const studentData = [  // Replace with your actual student data
    { Name: "John Doe", ID: 123, Grade: "A" },
    { Name: "Jane Smith", ID: 456, Grade: "B" },
];

const companyName="Company Name";


const StudDataExcel = () => {

  const worksheet = XLSX.utils.json_to_sheet([[companyName]]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.sheet_add_aoa(worksheet,[[{ t: 's', s: { fill: { fgColor: { rgb: 'FFFF00' } } }, h: '<img src="data:image/png;base64,' + LOGO_BASE_64 + '" />' }]]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Student Data");

    for (let i = 0; i < studentData.length; i++) {
      const currentRow = i + 2; 
      XLSX.utils.sheet_add_aoa(worksheet, [[studentData[i].Name, studentData[i].ID, studentData[i].Grade]], { origin: { c: 0, r: currentRow } });
    }

    
    // Save workbook as an Excel file
    XLSX.writeFile(workbook,  'student_data.xlsx', { bookType: 'xlsx', type: 'array' });

  };



export default StudDataExcel;