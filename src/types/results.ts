import { StudentDetailsType } from "./student";
import firebase from "firebase";
export type paperMarksType = {
  paperId: string;
  paperTitle: string;
  paperMarkObtained: number;
  paperMarkPractical: number;
  paperMarkPassing: number;
  paperMarkTheory: number;
};

export type resultType = {
  examId: string;
  examTitle: string;
  publishedOn: firebase.firestore.FieldValue;
  result: paperMarksType[];
  docId?: string;
};

export type marksheetType = {
  student: StudentDetailsType;
  result: paperMarksType[];
};
