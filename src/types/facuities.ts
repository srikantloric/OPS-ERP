import firebase from "firebase";

export type FacultyDetailsType = {
  faculty_number: string;
  faculty_address: string;
  faculty_email: string;
  faculty_gender: string;
  faculty_pass: string;
  faculty_phone: number;
  faculty_qualification: string;
  id: string;
  faculty_image: string;
  faculty_name: string;

  created_at?: firebase.firestore.Timestamp | firebase.firestore.FieldValue;

  generated_fee: string[];
};
