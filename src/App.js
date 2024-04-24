import { Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login/Login";
import { routesConfig } from "./components/Utils/RoutesConfig";
import { useState, lazy } from "react";
import SideBarContext from "./context/SidebarContext";

//Layouts
import AuthenticationLayout from "./layouts/AuthenticationLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthProvider from "./context/AuthContext";
import { Suspense } from "react";
import UpdateStudent from "./pages/Users/Update";
import Loadable from "./components/thirdparty/Loadable";
import FeeReceiptGenerator from "components/FeeRecieptGenerator/FeeRecieptGenerator";
import FeeReceipt from "pages/FeeManager/FeeReceipt";
import GenerateCustomFee from "pages/FeeManager/GenerateCustomFee";
import GenerateMonthlyFee from "pages/FeeManager/GenerateMonthlyFee";
import GenerateQrSticker from "pages/Attendance/GenerateQrSticker";
import ManualAttendance from "pages/Attendance/ManualAttendance";
import ViewAttendance from "pages/Attendance/ViewAttendance";
import AdmissionEnquiry from "pages/Admission/AdmissionEnquiry";
import AddEnquire from "pages/Admission/AddEnquriStudent";

const StudentProfilePictureUpdater = Loadable(lazy(()=>import("pages/ProfileUpdater/StudentProfilePictureUpdater")))

const ViewStudents = Loadable(lazy(() => import("./pages/Users/ViewStudents")));
const UnderConstruction = Loadable(
  lazy(() => import("./pages/Extras/UnderConstruction"))
);
const FacultyDetail = Loadable(
  lazy(() => import("./pages/FacutyManagment/FacultyDetail"))
);
const StudentFeeDetails = Loadable(
  lazy(() => import("./pages/FeeManager/StudentFeeDetails"))
);
const AddStudent = Loadable(lazy(() => import("./pages/Users/AddStudent")));

function App() {
  const routeItems = routesConfig.map(
    ({ to, Component, isHeader, childrens }) => {
      if (!isHeader) {
        return <Route key={to} path={to} element={<Component />} />;
      }
      return "";
    }
  );

  const [isActive, setIsActive] = useState(true);
  const toggle = () => {
    setIsActive(!isActive);
  };

  const setSidebarOpen = (status) => {
    setIsActive(status);
  };

  // console.log(useFlags())

  return (
    <SideBarContext.Provider value={{ isActive, toggle, setSidebarOpen }}>
      <AuthProvider>
        <Suspense>
          <Routes>
            <Route path="/" element={<DashboardLayout />}>
              {routeItems}
              <Route path="students/add-students" element={<AddStudent />} />
              <Route
                path="students/update-student/:id"
                element={<UpdateStudent />}
              />
              <Route
                path="students/Admission-students/add-students/:id"
                element={< AddEnquire/>}
              />
              <Route
                path="students/Admission-students"
                element={<AdmissionEnquiry />}
              />
              
              <Route path="students/view-students" element={<ViewStudents />} />

              <Route path="/view-faculties" element={<UnderConstruction />} />
              <Route path="/Faculties/:id" element={<FacultyDetail />} />
              <Route path="/add-faculty" element={<UnderConstruction />} />
              <Route
                path="/FeeManagement/FeeDetails/:id"
                element={<StudentFeeDetails />}
              />
              <Route
                path="accountings/generate-monthly-fee"
                element={<GenerateMonthlyFee />}
              />
              <Route
                path="accountings/generate-custom-fee"
                element={<GenerateCustomFee />}
              />
              <Route
                path="attendance/show-student-attendance"
                element={<ViewAttendance />}
              />
              <Route
                path="attendance/mark-manual-attendance"
                element={<ManualAttendance />}
              />
              <Route
                path="attendance/generate-attendance-qr"
                element={<GenerateQrSticker />}
              />

              <Route path="feeReciept" element={<FeeReceipt />} />
            </Route>
            <Route path="update-student-profile-picture" element={<StudentProfilePictureUpdater/>}/>
            <Route path="/login" element={<AuthenticationLayout />}>
              <Route index element={<Login />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </SideBarContext.Provider>
  );
}

export default App;
