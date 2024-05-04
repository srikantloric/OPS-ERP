import { Chip } from "@mui/joy";
import { SCHOOL_FEE_MONTHS } from "config/schoolConfig";
import * as qrcode from "qrcode";

export const generateQRCodeBase64 = async (text: string) => {
  try {
    // Generate QR code as a data URL
    const qrDataURL = await qrcode.toDataURL(text);
    // Extract base64 image data from the data URL
    const base64Image = qrDataURL.split(",")[1];
    return base64Image;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};

export function makeDoubleDigit(num: string) {
  // Convert the number to a string
  const numStr = num.toString();
  // Check if the number is a single digit (i.e., length is 1)
  if (numStr.length === 1) {
    // Append '0' at the start of the string
    return `0${numStr}`;
  }
  // If the number is already double-digit or greater, return the original string
  return numStr;
}

export function generateAlphanumericUUID(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charsLength = chars.length;
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charsLength);
    result += chars.charAt(randomIndex);
  }
  return result;
}

export const getMonthTitleByValue = (
  monthValue: number
): string | undefined => {
  const month = SCHOOL_FEE_MONTHS.find((month) => month.value === monthValue);
  return month ? month.title : undefined;
};

export function getClassNameByValue(classNumber: number) {
  switch (classNumber) {
    case 1:
      return "Nursery";
    case 2:
      return "LKG";
    case 3:
      return "UKG";
    case 4:
      return "STD-1";
    case 5:
      return "STD-2";
    case 6:
      return "STD-3";
    case 7:
      return "STD-4";
    case 8:
      return "STD-5";
    case 9:
      return "STD-6";
    case 10:
      return "STD-7";
    case 11:
      return "STD-8";
    case 12:
      return "STD-9";
    case 13:
      return "STD-10";
    case 14:
      return "Pre-Nursery";
    default:
      break;
  }
}

///Generate Current Date in string
export function getCurrentDate(): string {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = ("0" + (currentDate.getMonth() + 1)).slice(-2); // Adding 1 because months are zero indexed
  const day = ("0" + currentDate.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
}

export const getAttendanceStatusByCode = (code: string): any => {
  switch (code) {
    case "A":
      return <Chip color="danger">Absent</Chip>;
    case "P":
      return <Chip color="success">Present</Chip>;
    case "H":
      return <Chip color="neutral">Holiday</Chip>;
    case "L":
      return <Chip color="danger">Leave</Chip>;
    case "S":
      return <Chip color="success">Sunday</Chip>;
    default:
      return "Error Code";
  }
};

export const getFeeHeaderByCode = (code: string): string => {
  switch (code) {
    case "M01":
      
      return "Monthly Fee";
    case "E01":
      return "Examination Fee";
    case "A01":
      return "Anual Fee";
    case "X01":
      return "Other Fee";
    default:
      return "Invalid Fee Header";
  }
};

