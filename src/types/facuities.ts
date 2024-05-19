import firebase from "firebase";

export type FacultyAttendanceShema = {
  isSmartAttendance?: boolean;

  faculty_phone?: number;
  comment?: string;
 
  faculty_image?: string;
  faculty_name: string;
  id: string;
  createdAt:
    | firebase.firestore.Timestamp
    | firebase.firestore.FieldValue
    | Date;
  attendanceDate: string;
  attendanceStatus: string;

  
};
export interface facultyAttendanceGlobalSchema {
  totalAbsent?: number;
  totalStudent?: number;
  totalPresent?: number;
  totalLeave?: number;
  isSmartAttendance: boolean;
  id: string;
  createdAt?: firebase.firestore.Timestamp | Date;
  comment: string;
  attendanceDate?: string;
  attendanceStatus: string;

  faculty_name: string;

  faculty_image: string;
  faculty_phone: number;
}
