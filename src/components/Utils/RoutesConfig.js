import Dashboard from "../../pages/Dashboard/Dashboard";
import Faculties from "../../pages/FacutyManagment/Faculties";
import Attendance from "../../pages/Attendance/ViewAttendance";
import {
  IconCoinRupee,
  IconDashboard,
  IconFingerprint,
  IconFriends,
  IconMail,
  IconNotes,
  IconReceipt2,
  IconUsers,
  IconMoneybag,
} from "@tabler/icons-react";
import AddStudent from "../../pages/Users/AddStudent";
import UnderConstruction from "../../pages/Extras/UnderConstruction";
import FeeManager from "../../pages/FeeManager/FeeManager";
import FeaturesConfig from "../../FeaturesConfig";
import ViewStudents from "../../pages/Users/ViewStudents";
import FeeReceipt from "pages/FeeManager/FeeReceipt";
import Transaction from "pages/Transaction/Transaction";
import GenerateMonthlyChallan from "pages/FeeManager/GenerateChallan/GenerateMontlyChallan";
import ViewStudentProfile from "pages/Users/StudentProfile/ViewStudentProfile";

export const routesConfig = [
  {
    title: "Masters",
    isHeader: true,
  },
  {
    title: "Dashboard",
    to: "/",
    icon: IconDashboard,
    isCollapsable: false,
    isHeader: false,
    Component: Dashboard,
  },
  {
    title: "Students",
    to: "/students",
    icon: IconFriends,
    isCollapsable: false,
    isHeader: false,
    Component: ViewStudents,
    childrens: [
      {
        title: "Add Student",
        to: "students/add-students",

        isCollapsable: false,
        isHeader: false,
        Component: <AddStudent />,
      },
      {
        title: "View Student",
        to: "students/view-students",
        isCollapsable: false,
        isHeader: false,
        Component: <AddStudent />,
      },
      {
        title: "Admission Enquire",
        to: "students/Admission-students",
        isCollapsable: false,
        isHeader: false,
        Component: <AddStudent />,
      },
     
    ],
  },
  {
    title: "Faculties",
    to: "/Faculties",
    icon: IconUsers,
    isCollapsable: false,
    isHeader: false,
    Component: FeaturesConfig.FACULTY_FEATURE ? Faculties : UnderConstruction,
  },
  {
    title: "Management",
    isHeader: true,
  },
  {
    title: "Fee Payments",
    to: "/FeeManagement",
    icon: IconCoinRupee,
    isCollapsable: false,
    isHeader: false,
    Component: FeaturesConfig.PAYMENT_FEATURE ? FeeManager : UnderConstruction,
  },
  {
    title: "Accountings",
    to: "/Accountings",
    icon: IconMoneybag,
    isCollapsable: false,
    isHeader: false,
    Component: GenerateMonthlyChallan,
    childrens: [
      {
        title: "Generate Montly Fee",
        to: "accountings/generate-monthly-fee",
        isCollapsable: false,
        isHeader: false,
        Component: <GenerateMonthlyChallan />,
      },
      {
        title: "Generate Custom Fee",
        to: "accountings/generate-custom-fee",
        isCollapsable: false,
        isHeader: false,
        Component: <GenerateMonthlyChallan />,
      },
    ],
  },
  {
    title: "Attendance ",
    to: "/Attendance",
    icon: IconFingerprint,
    isCollapsable: false,
    isHeader: false,
    Component: FeaturesConfig.ATTENDANCE_FEATURE
      ? Attendance
      : UnderConstruction,
    childrens: [
      {
        title: "Show Attendance",
        to: "attendance/show-student-attendance",
        isCollapsable: false,
        isHeader: false,
        Component: <Attendance />,
      },
      {
        title: "Manual Attendance",
        to: "attendance/mark-manual-attendance",
        isCollapsable: false,
        isHeader: false,
        Component: <Attendance />,
      },
      {
        title: "Generate QR Sticker",
        to: "attendance/generate-attendance-qr",
        isCollapsable: false,
        isHeader: false,
        Component: <Attendance />,
      },
      {
        title: "Facuities Attendance",
        to: "attendance/Facuities",
        isCollapsable: false,
        isHeader: false,
        Component: <Attendance />,
      },
    ],
  },

  {
    title: "Fee Receipts",
    to: "/FeeReceipt",
    icon: IconNotes,
    isCollapsable: false,
    isHeader: false,
    Component: FeeReceipt,
  },
  {
    title: "Notification",
    isHeader: true,
  },
  {
    title: "Transaction",
    to: "/Transaction",
    icon: IconReceipt2,
    isCollapsable: false,
    isHeader: false,
    Component: Transaction,
    // Component: UnderConstruction,
  },
  {
    title: "Message",
    to: "/Message",
    icon: IconMail,
    isCollapsable: false,
    isHeader: false,
    Component: ViewStudentProfile,
  },
];
