import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import LSContainer from "../components/Utils/LSContainer";


function DashboardLayout() {
  return (
    <LSContainer>
      <Sidebar />
      <Outlet/>
    </LSContainer>
  );
}

export default DashboardLayout;
