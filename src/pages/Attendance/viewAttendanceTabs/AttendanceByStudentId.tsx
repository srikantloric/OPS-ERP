import {
  Grid,
  Stack,
  Input,
  Button,
  Typography,
  Box,
  LinearProgress,
} from "@mui/joy";
import { Paper } from "@mui/material";
import FullAttendanceReport from "components/AttendanceReport/FullAttendanceSelected";
import AttendanceCalendar from "components/Calendar/AttendanceCalendar";
import { db } from "../../../firebase";
import { useEffect, useState } from "react";
import { StudentDetailsType } from "types/student";
import { enqueueSnackbar } from "notistack";
import { StudentAttendanceGlobalSchema } from "types/attendance";
import { Print } from "@mui/icons-material";

function AttendanceByStudentId() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [filterdata, setfilterdata] = useState<StudentDetailsType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  ///attendance state
  const [presentDates, setPresentDates] = useState<string[]>([]);
  const [absentDates, setAbsentDates] = useState<string[]>([]);
  const [halfDayDates, setHalfDayDates] = useState<string[]>([]);
  const [notMarkedDates, setNotMarkedDates] = useState([]);
  const [futureDates, setFutureDates] = useState([]);

  const [attendanceData, setAttendanceData] = useState<
    StudentAttendanceGlobalSchema[]
  >([]);

  useEffect(() => {
    setAbsentDates([]);
    setHalfDayDates([]);
    setNotMarkedDates([]);
    setFutureDates([]);
    setAttendanceData([]);
  }, []);

  const handlesearch = () => {
    // setfilterdata(undefined)
    if (searchInput === null) {
      setLoading(false);
      enqueueSnackbar("Please enter Student Id", { variant: "error" });
    } else {
      setLoading(true);
      // setfilterdata(undefined)
      console.log(searchInput);
      db.collection("STUDENTS")
        .where("admission_no", "==", searchInput)
        .get()
        .then((snapshot) => {
          if (snapshot.size > 0) {
            let tempArr: StudentDetailsType[] = [];
            snapshot.forEach((student) => {
              const resData = student.data() as StudentDetailsType;
              tempArr.push(resData);
              setfilterdata(tempArr);
            });
            db.collection("STUDENTS")
              .doc(filterdata[0].id)
              .collection("ATTENDANCE")
              .where("attendanceStatus", "==", "P")
              .get()
              .then((document) => {
                if (document.size > 0) {
                  let arrAttendance: any[] = [];
                  document.forEach((doc) => {
                    const data = doc.data().attendanceDate as any;
                    arrAttendance.push(data);
                    setPresentDates(arrAttendance);
                    console.log(presentDates);
                  });
                }
              });
            db.collection("STUDENTS")
              .doc(filterdata[0].id)
              .collection("ATTENDANCE")
              .where("attendanceStatus", "==", "H")
              .get()
              .then((document) => {
                if (document.size > 0) {
                  let arrAttendance: any[] = [];
                  document.forEach((doc) => {
                    const data = doc.data().attendanceDate as any;
                    arrAttendance.push(data);
                    setHalfDayDates(arrAttendance);
                  });
                }
              });
            db.collection("STUDENTS")
              .doc(filterdata[0].id)
              .collection("ATTENDANCE")
              .where("attendanceStatus", "==", "A")
              .get()
              .then((document) => {
                if (document.size > 0) {
                  let arrAttendance: any[] = [];
                  document.forEach((doc) => {
                    const data = doc.data().attendanceDate as any;
                    arrAttendance.push(data);
                    setAbsentDates(arrAttendance);
                    console.log(absentDates);
                  });
                }
              });
            setLoading(false);
            console.log("1=>" + filterdata);
          } else {
            setLoading(false);
            enqueueSnackbar("No student with this student ID!", {
              variant: "info",
            });
          }
        })
        .catch((e) => {
          enqueueSnackbar("Invalid Student Id!",{variant:"error"});
          setLoading(false);
        });
    }
  };

  const handlePrintAttendance = async () => {
    const pdfRes4 = await FullAttendanceReport(filterdata, attendanceData);
    const window4 =
      "width=600,height=400,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes";
    window.open(pdfRes4, "_blank", window4);
  };

  return (
    <Grid container spacing={2} marginTop={2}>
      <Paper
        sx={{
          padding: "8px",
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Stack
          direction={"row"}
          spacing={2}
          marginBottom={1.5}
          marginTop={1}
          marginLeft={0.5}
          marginRight={0.5}
          justifyContent="space-between"
        >
          <Stack direction="row" gap="8px">
            <Input
              placeholder="Student ID"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
<<<<<<< HEAD

            {/* <FormHelperText>This is a helper text.</FormHelperText> */}

            <Button sx={{ height: 20 }} onClick={handlesearch}>
=======
            <Button sx={{ height: 20 }} type="submit" onClick={handlesearch}>
>>>>>>> 51983793749319819cf64aff584f9303d43910ac
              Search
            </Button>
          </Stack>

          <Button
            sx={{ height: 20, marginLeft: "30px" }}
            type="submit"
            onClick={handlePrintAttendance}
            startDecorator={<Print />}
            color="success"
          ></Button>
        </Stack>
        {loading ? <LinearProgress /> : null}

        {filterdata &&
          filterdata.map((student, i) => {
            return (
              <>
                <br />
                <Paper sx={{ backgroundColor: "#FBFCFE", display: "flex" }}>
                  <div style={{ margin: "10px" }}>
                    <img
                      src={student.profil_url}
                      width={100}
                      height="100%"
                      style={{ objectFit: "cover" }}
                    ></img>
                  </div>
                  <div
                    style={{
                      margin: "8px 10px 8px 0px",
                      width: "50%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <div>
                      <Typography
                        level="h4"
                        sx={{ fontWeight: "500" }}
                        textTransform="uppercase"
                      >
                        {student.student_name}
                      </Typography>
                      <Typography level="body-sm">
                        Father's Name : {student.father_name}
                      </Typography>
                      <Typography level="body-sm">
                        Student's ID: {student.admission_no}
                      </Typography>
                    </div>
                    <div
                      style={{
                        backgroundColor: "#F0F4F8",
                        display: "flex",
                        borderRadius: "8px",
                        gap: "20px",
                        marginTop: "10px",
                        padding: "10px 16px",
                        width: "fit-content",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Typography level="body-sm">Class</Typography>
                        <Typography level="title-sm">
                          {student.class}
                          {/* {location.state[0].class} */}
                        </Typography>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Typography level="body-sm">Roll</Typography>
                        <Typography level="title-sm">
                          {student.class_roll}
                        </Typography>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <Typography level="body-sm">Admission Date</Typography>
                        <Typography level="title-sm">
                          {student.admission_no}
                        </Typography>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      ></div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      ></div>
                    </div>
                  </div>
                  <Box
                    sx={{
                      display: "flex",
                      border: "1px solid var(--bs-gray-400)",
                      margin: "14px",
                      flex: 1,
                      borderRadius: "8px",
                      padding: "10px",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                    }}
                  >
                    <Stack direction="column" alignItems="center">
                      <Typography level="h4" mt={1}>
                        10
                      </Typography>
                      <Typography level="body-sm">Total Present</Typography>
                    </Stack>

                    <Stack direction="column" alignItems="center">
                      <Typography level="h4" mt={1}>
                        6
                      </Typography>
                      <Typography level="body-sm">Total Absents</Typography>
                    </Stack>

                    <Stack direction="column" alignItems="center">
                      <Typography level="h4" mt={1}>
                        5
                      </Typography>
                      <Typography level="body-sm">Total Holiday</Typography>
                    </Stack>
                    <Stack direction="column" alignItems="center">
                      <Typography level="h4" mt={1}>
                        5
                      </Typography>
                      <Typography level="body-sm">Half Day</Typography>
                    </Stack>
                  </Box>
                </Paper>

                <AttendanceCalendar
                  presentDates={presentDates}
                  absentDates={absentDates}
                  halfDayDates={halfDayDates}
                  notMarkedDates={notMarkedDates}
                  futureDates={futureDates}
                />
              </>
            );
          })}
      </Paper>
    </Grid>
  );
}

export default AttendanceByStudentId;
