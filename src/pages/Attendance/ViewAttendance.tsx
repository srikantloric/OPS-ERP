import Navbar from "components/Navbar/Navbar";
import LSPage from "components/Utils/LSPage";
import PageContainer from "components/Utils/PageContainer";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import BreadCrumbsV2 from "components/Breadcrumbs/BreadCrumbsV2";
import {
  Option,
  Select,
  FormControl,
  FormLabel,
  Tab,
  TabList,
  TabPanel,
  Table,
  Tabs,
  Button,
  Avatar,
  Card,
  CardContent,
  Typography,
  Box,
  Input,
  LinearProgress,
  Stack,
  Grid,
} from "@mui/joy";
import { useEffect, useState } from "react";
import { SCHOOL_CLASSES } from "config/schoolConfig";
import {
  getAttendanceStatusByCode,
  getCurrentDate,
  makeDoubleDigit,
} from "utilities/UtilitiesFunctions";
import { enqueueSnackbar } from "notistack";
import { db } from "../../firebase";
import { StudentAttendanceGlobalSchema, StudentSatus } from "types/attendance";
import { Paper } from "@mui/material";
import { Print } from "@mui/icons-material";
import OverViewTab from "./viewAttendanceTabs/OverViewTab";
import { AttendanceReportGenerator } from "components/AttendanceReport/AttendanceReportGenerator";
import { StudentDetailsType } from "types/student";
import AttendanceIndex from "./viewAttendanceTabs/AttendanceIndex";
import FullAttendanceReport from "components/AttendanceReport/FullAttendanceSelected";
import Calender from "components/AttendanceReport/Calender";
import { Calculator, CardEdit, Moneys, Wallet } from "iconsax-react";

type AttendanceHeaderDataType = {
  totalStudent: number;
  totalAbsent: number;
  totalPresent: number;
  totalLeave: number;
  totalHoliday: number;
};

function ViewAttendance() {
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [individualAttendanceData, setIndividualAttendanceData] = useState<
    StudentAttendanceGlobalSchema[]
  >([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [filterdata, setfilterdata] = useState<StudentDetailsType[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [attendanceHeaderData, setAttendanceHeaderData] =
    useState<AttendanceHeaderDataType | null>(null);
  const [attendancedata, setattendancedata] = useState<
    StudentAttendanceGlobalSchema[]
  >([]);

  const [presentDates, setPresentDates] = useState<StudentSatus[]>([]);
  const [absentDates, setAbsentDates] = useState(["2024-05-05"]);
  const [halfDayDates, setHalfDayDates] = useState(["2024-05-07"]);
  const [notMarkedDates, setNotMarkedDates] = useState([]);
  const [futureDates, setFutureDates] = useState([]);

  function handlesearch(): void {
    // setfilterdata(undefined)
    if (searchInput) {
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
            setLoading(false);
            console.log("1=>" + filterdata);
            console.log("2=>" + attendancedata);
          } else {
            setLoading(false);
            enqueueSnackbar("No student with this student ID!", {
              variant: "info",
            });
          }
        })
        .catch((e) => {
          enqueueSnackbar("INVALID STUDENT ID", e);
          setLoading(false);
        });
    } else {
      setLoading(false);
      enqueueSnackbar("Please enter Student Id", { variant: "error" });
    }
  }
  useEffect(() => {}, []);

  const fetchStudentAtt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedClass === null) {
      enqueueSnackbar("Please select class!", { variant: "error" });
    } else {
      setLoading(true);
      const classDate = `${makeDoubleDigit(
        selectedClass!.toString()
      )}_${selectedDate}`;

      setIndividualAttendanceData([]);
      setAttendanceHeaderData(null);
      db.collection("ATTENDANCE")
        .doc(classDate)
        .onSnapshot((snapshot) => {
          if (snapshot.exists) {
            const data = snapshot.data() as any;
            const total_student = data.total_student;

            const headerData: AttendanceHeaderDataType = {
              totalStudent: data[`total_student`],
              totalAbsent: data[`total_absent`],
              totalLeave: data[`total_leave`],
              totalPresent: data[`total_present`],
              totalHoliday: data[`total_holiday`],
            };
            setAttendanceHeaderData(headerData);

            let attendanceDataTempArr: StudentAttendanceGlobalSchema[] = [];
            for (let i = 0; i < total_student; i++) {
              const dataObj: StudentAttendanceGlobalSchema = {
                studentName: data[`student_${i}_name`],
                studentId: data[`student_${i}_id`],
                studentFatherName: data[`student_${i}_father`],
                studentProfile: data[`student_${i}_profile`],
                studentRegId: data[`student_${i}_regId`],
                studentContact: data[`student_${i}_contact`],
                attendanceStatus: data[`student_${i}_status`],
                isSmartAttendance: false,
                createdAt: data[`student_${i}_timestamp`]
                  .toDate()
                  .toLocaleString(),
                comment: data[`student_${i}_comment`],
              };
              attendanceDataTempArr.push(dataObj);
            }
            setIndividualAttendanceData(attendanceDataTempArr);
            setLoading(false);
          } else {
            setLoading(false);
          }
        });
    }
  };

  const handleNewWindowOpen = async () => {
    const attendanceHeaderDataa = attendanceHeaderData!;
    const pdfRes = await AttendanceReportGenerator(
      attendanceHeaderDataa,
      individualAttendanceData
    );
    const features =
      "width=600,height=400,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes";
    window.open(pdfRes, "_blank", features);
  };

  const GetFullAttendance = async () => {
    const pdfRes4 = await FullAttendanceReport(filterdata, attendancedata);
    const window4 =
      "width=600,height=400,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes";

    window.open(pdfRes4, "_blank", window4);
  };

  return (
    <PageContainer>
      <Navbar />
      <LSPage>
        <BreadCrumbsV2
          Icon={FingerprintIcon}
          Path="Attendance/View Student Attendance"
        />
        <br />
        <Tabs aria-label="Basic tabs" defaultValue={0}>
          <TabList>
            <Tab>Overview</Tab>
            <Tab>By Class</Tab>
            <Tab>By Student ID</Tab>
          </TabList>
          <TabPanel value={0}>
            <OverViewTab />
            <AttendanceIndex />
          </TabPanel>
          <TabPanel value={2}>
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
                >
                  <Input
                    placeholder="Student ID"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />

                  {/* <FormHelperText>This is a helper text.</FormHelperText> */}

                  <Button
                    sx={{ height: 20 }}
                    type="submit"
                    onClick={handlesearch}
                  >
                    Search
                  </Button>

                  <Button
                    sx={{ height: 20, marginLeft: "30px" }}
                    type="submit"
                    onClick={GetFullAttendance}
                  >
                    Get Full Attendance
                  </Button>
                </Stack>
                {loading ? <LinearProgress /> : null}

                {filterdata &&
                  filterdata.map((student, i) => {
                    return (
                      <>
                        <br />
                        <Paper
                          sx={{ backgroundColor: "#FBFCFE", display: "flex" }}
                        >
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
                                Student's ID: {student.student_id}
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
                                <Typography level="body-sm">
                                  Admission Date
                                </Typography>
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
                              <Typography level="body-sm">
                                Total Present
                              </Typography>
                            </Stack>

                            <Stack direction="column" alignItems="center">
                              <Typography level="h4" mt={1}>
                                6
                              </Typography>
                              <Typography level="body-sm">
                                Total Absents
                              </Typography>
                            </Stack>

                            <Stack direction="column" alignItems="center">
                              <Typography level="h4" mt={1}>
                                5
                              </Typography>
                              <Typography level="body-sm">
                                Total Holiday
                              </Typography>
                            </Stack>
                            <Stack direction="column" alignItems="center">
                              <Typography level="h4" mt={1}>
                                5
                              </Typography>
                              <Typography level="body-sm">Half Day</Typography>
                            </Stack>
                          </Box>
                        </Paper>
                        {/* <Table
                        aria-label="table variants"
                        variant="plain"
                        color="neutral"
                        stripe={"odd"}
                      >
                        <thead>
                          <tr>
                            <th>STUDENT</th>
                            <th>FATHER</th>
                            <th>CONTACT</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr key={student.student_name}>
                            <td>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "10px",
                                }}
                              >
                                <Avatar src={student.profil_url} />
                                {student.student_name}
                              </div>
                            </td>
                            <td>{student.father_name}</td>
                            <td>{student.contact_number}</td>
                            {attendancedata &&
                              attendancedata.map((student, i) => {
                                return (
                                  <tr>
                                    <td>
                                      {student.attendanceStatus === null
                                        ? student.attendanceStatus
                                        : "NO RECORD FOUND"}
                                    </td>
                                    <td>{student.comment}</td>
                                  </tr>
                                );
                              })}
                          </tr>
                        </tbody>
                      </Table> */}
                        <Calender
                          presentDates={presentDates}
                          absentDates={absentDates}
                          halfDayDates={halfDayDates}
                          notMarkedDates={notMarkedDates}
                          futureDates={futureDates}
                          onChange=""
                          onDateChange=""
                        />
                      </>
                    );
                  })}
              </Paper>
            </Grid>
          </TabPanel>
          <TabPanel value={1}>
            {/* <b>Third</b> tab panel */}
            <Paper sx={{ p: 2, border: "1px solid var(--bs-gray-300)" }}>
              <Box
                component="form"
                onSubmit={fetchStudentAtt}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", gap: 10 }}>
                  <FormControl>
                    <FormLabel>Select Date</FormLabel>
                    <Input
                      required
                      placeholder="Placeholder"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                    {/* <FormHelperText>This is a helper text.</FormHelperText> */}
                  </FormControl>
                  <FormControl>
                    <FormLabel>Class</FormLabel>
                    <Select
                      required
                      placeholder="Class"
                      defaultValue={null}
                      value={selectedClass}
                      onChange={(e, val) => setSelectedClass(val)}
                      sx={{ minWidth: 200 }}
                    >
                      {SCHOOL_CLASSES.map((item, i) => {
                        return (
                          <Option value={item.value} key={item.id}>
                            {item.title}{" "}
                          </Option>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <Button sx={{ height: 20 }} type="submit">
                    Fetch
                  </Button>
                  {individualAttendanceData.length > 0 ? (
                    <Button
                      sx={{ height: 20 }}
                      endDecorator={<Print />}
                      color="primary"
                      onClick={handleNewWindowOpen}
                    >
                      Export
                    </Button>
                  ) : null}
                </div>
              </Box>
              <br />
              {loading ? <LinearProgress /> : null}

              {individualAttendanceData.length > 0 ? (
                <>
                  <Card variant="soft" color="primary" invertedColors>
                    <CardContent orientation="horizontal">
                      <CardContent>
                        <Typography level="body-md">Total Student</Typography>
                        <Typography level="h2">
                          {attendanceHeaderData?.totalStudent}
                        </Typography>
                      </CardContent>
                      <CardContent>
                        <Typography level="body-md">Total Present</Typography>
                        <Typography level="h2">
                          {attendanceHeaderData?.totalPresent}
                        </Typography>
                      </CardContent>
                      <CardContent>
                        <Typography level="body-md">Total Absent</Typography>
                        <Typography level="h2">
                          {attendanceHeaderData?.totalAbsent}
                        </Typography>
                      </CardContent>
                      <CardContent>
                        <Typography level="body-md">Total On Leave</Typography>
                        <Typography level="h2">
                          {attendanceHeaderData?.totalLeave}
                        </Typography>
                      </CardContent>
                      <CardContent>
                        <Typography level="body-md">
                          Total On Holiday
                        </Typography>
                        <Typography level="h2">
                          {attendanceHeaderData?.totalHoliday}
                        </Typography>
                      </CardContent>
                    </CardContent>
                  </Card>
                  <br />
                  <Table
                    aria-label="table variants"
                    variant="plain"
                    color="neutral"
                    stripe={"odd"}
                  >
                    <thead>
                      <tr>
                        <th>STUDENT</th>
                        <th>FATHER</th>
                        <th>CONTACT</th>
                        <th>STATUS</th>
                        <th style={{ textAlign: "center", width: "190px" }}>
                          COMMENT
                        </th>
                        <th style={{ textAlign: "end", width: "190px" }}>
                          TIMESTAMP
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {individualAttendanceData &&
                        individualAttendanceData.map((student, i) => {
                          return (
                            <tr key={student.studentRegId}>
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                  }}
                                >
                                  <Avatar src={student.studentProfile} />
                                  {student.studentName}
                                </div>
                              </td>
                              <td>{student.studentFatherName}</td>
                              <td>{student.studentContact}</td>
                              <td>
                                {getAttendanceStatusByCode(
                                  student.attendanceStatus
                                )}
                              </td>
                              <td
                                style={{ textAlign: "center", width: "190px" }}
                              >
                                {student.comment !== "" ? student.comment : "_"}
                              </td>
                              <td style={{ textAlign: "end", width: "190px" }}>
                                {"" + student.createdAt}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </>
              ) : null}
            </Paper>
          </TabPanel>
        </Tabs>
      </LSPage>
    </PageContainer>
  );
}

export default ViewAttendance;
