import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import LSPage from "../../components/Utils/LSPage";
import PageContainer from "../../components/Utils/PageContainer";
import Card from "../../components/Card/Card";

import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import GrainIcon from "@mui/icons-material/Grain";
import { Breadcrumbs, Paper, Typography } from "@mui/material";
import { Button, LinearProgress } from "@mui/joy";
import { Download } from "@mui/icons-material";
import { RootState, useDispatch, useSelector } from "store";
import { fetchTeacher } from "store/reducers/facultiesSlice";

function Faculties() {
  const facultiesList = useSelector((state: RootState) => state.faculties.teacherArray);
  const [facultiesListNew, setFacultiesListNew] = useState(facultiesList);
  const dipatch = useDispatch()
  useEffect(() => {
    setFacultiesListNew(facultiesList);
  }, [facultiesList]);
  useEffect(() => {
    if (sessionStorage.getItem("faculties_list")) {
      const facDataFromCache = JSON.parse(
        sessionStorage.getItem("faculties_list")!
      );
      setFacultiesListNew(facDataFromCache);
      console.log("fetched faculties from cache");
    } else {
      dipatch(fetchTeacher());
    }
  }, []);


  return (
    <>
      <PageContainer>
        <Navbar />
        <LSPage>
          <Paper
            style={{
              padding: "10px",
              borderRadius: "5px",
              margin: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Breadcrumbs aria-label="breadcrumb">
              <Link to="/" style={{
                textDecoration: "none",
                color: "#343a40",
                display: "flex",
                alignItems: "center",
              }}>
                <PersonIcon sx={{ color: "var(--bs-gray-500)" }} />
                <Typography sx={{ ml: "4px" }}>Faculty Management</Typography>
              </Link>


              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="text.secondary"
              >
                <GrainIcon sx={{ mr: 0.3 }} fontSize="inherit" />
                Faculties
              </Typography>
            </Breadcrumbs>
            <Button
              variant="soft"
              startDecorator={<Download />}
            >
              Export
            </Button>
          </Paper>

          <br />
          {facultiesListNew ? null : (
            <LinearProgress thickness={2} sx={{ ml: 2, mr: 2 }} />
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            {facultiesListNew &&
              facultiesListNew.map((dta) => {
                return <Card facultyData={dta} key={dta.id} />;
              })}
          </div>
        </LSPage>
      </PageContainer>
    </>
  );
}

export default Faculties;
