import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import LSPage from "../../components/Utils/LSPage";
import PageContainer from "../../components/Utils/PageContainer";
import Card from "../../components/Card/Card";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function Faculties() {
 
  return (
    <>
      <PageContainer>
        <Navbar />
        <LSPage>
          <div style={{ display: "flex",flexWrap:'wrap' }}>
            <Card />
           
          </div>
        </LSPage>
      </PageContainer>
    </>
  );
}

export default Faculties;
