
import Navbar from "../../components/Navbar/Navbar";
import LSPage from "../../components/Utils/LSPage";
import PageContainer from "../../components/Utils/PageContainer";

import {
  Box,
  Button,
  Paper,
} from "@mui/material";
import {  useParams } from "react-router-dom";

import { IconEdit } from "@tabler/icons-react";
import { useState } from "react";


import { FacultyType } from "types/facuities";
import { Delete } from "@mui/icons-material";


function FacultyDetail() {
  const { id } = useParams();
  const [teacherData, setteacherData] = useState<FacultyType>();

  return (
    <>
      <PageContainer>
        <Navbar />
        <LSPage>
          <Paper
            style={{
              padding: "10px",
              borderRadius: "5px",
            
            }}
          >
          </Paper>
          <br></br>
          <br></br>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "var(--bs-gray-201)",
              padding: "10px",
            }}
          >
            <div style={{ display: "flex" }}>
              <div>
                <img
                  src={teacherData && teacherData.faculty_image}
                  height="100%"
                  width={100}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div style={{ padding: "5px 15px" }}>
                <h4
                  style={{ margin: 0, padding: 0, textTransform: "uppercase" }}
                >
                  {teacherData && teacherData.faculty_name}
                </h4>

                <div style={{ marginTop: "1.1rem", display: "flex" }}>
                  <div>
                    <p style={{ padding: 3, margin: 0, fontSize: "14px" }}>
                      Date Of Birth
                    </p>
                    <p style={{ padding: 3, margin: 0, fontSize: "14px" }}>
                      Date Of Joining
                    </p>
                    <p style={{ padding: 3, margin: 0, fontSize: "14px" }}>
                      Contact
                    </p>
                  </div>
                  <div>
                    <p style={{ padding: 3, margin: 0, fontSize: "14px" }}>
                      : {teacherData && teacherData.faculty_dob}
                    </p>
                    <p style={{ padding: 3, margin: 0, fontSize: "14px" }}>
                      : {teacherData && teacherData.faculty_doj}
                    </p>
                    <p style={{ padding: 3, margin: 0, fontSize: "14px" }}>
                      : +91-{teacherData && teacherData.faculty_phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Button variant="outlined" startIcon={<IconEdit />}>
                Edit
              </Button>
              <Delete/>
            </div>
          </div>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>

          </Box>
        </LSPage>
      </PageContainer>
    </>
  );
}

export default FacultyDetail;
