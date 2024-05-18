import Navbar from "components/Navbar/Navbar";
import FingerprintIcon from "@mui/icons-material/Fingerprint";

import { Divider, LinearProgress, Paper } from "@mui/material";
import PageContainer from "components/Utils/PageContainer";
import firebase from "firebase";
import SaveIcon from "@mui/icons-material/Save";

import {
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  FormLabel,
  Input,
  Option,
  Radio,
  RadioGroup,
  Select,
  Sheet,
  Table,
} from "@mui/joy";
import { useState } from "react";
import { getCurrentDate, makeDoubleDigit } from "utilities/UtilitiesFunctions";
import Search from "@mui/icons-material/Search";
import BreadCrumbsV2 from "components/Breadcrumbs/BreadCrumbsV2";
import HeaderTitleCard from "components/Card/HeaderTitleCard";
import LSPage from "components/Utils/LSPage";
import { StudentDetailsType } from "types/student";
import { StudentAttendanceSchema } from "types/attendance";
import { SCHOOL_CLASSES } from "config/schoolConfig";
import { enqueueSnackbar } from "notistack";
import { db } from "../../firebase";

interface StudentAttendanceType extends StudentDetailsType {
  selected_option?: string | null;
  comment?: string;
}

export const FacultyAttendance = () => {
  const [selectedClass, setSelectedClass] = useState<number | null>(null);

  const [studentData, setStudentData] = useState<StudentAttendanceType[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentDate());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSavingDone, setSavingDone] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>("");

  const filteredStudents = studentData.filter((student) => {
    const isMatchedByName = student.student_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return isMatchedByName;
  });

  

  const handleRadioSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    student: StudentAttendanceType
  ) => {
    const updatedStudents = studentData.map((item) =>
      item.id === student.id
        ? { ...student, selected_option: e.target.value }
        : item
    );
    setStudentData(updatedStudents);
  };

  const handleMarkAll = (val: string | null) => {
    const updatedStudent = studentData.map((item) => {
      return { ...item, selected_option: val };
    });
    setStudentData(updatedStudent);
  };

  const handleAttendanceComment = (comment: string, studentId: string) => {
    const updatedStudents = studentData.map((item) =>
      item.id === studentId ? { ...item, comment } : item
    );
    setStudentData(updatedStudents);
  };
  return (
    <>
      <PageContainer>
        <Navbar />
        <LSPage>
          <BreadCrumbsV2
            Icon={FingerprintIcon}
            Path="Attendance Management/Facuities Attendence"
          />

          <HeaderTitleCard Title="Mark Attendance Manually" />
          <Paper sx={{ p: 2, border: "1px solid var(--bs-gray-300)" }}>
            <Box
              component="form"
              //               onSubmit={fetchstudent}
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
                  <FormLabel>Facuities</FormLabel>
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
                {studentData.length > 0 ? (
                  <Button
                    startDecorator={<SaveIcon />}
                    sx={{ height: 20 }}
                    //   onClick={handleSaveAttendance}
                    color="success"
                    loading={isSaving}
                    disabled={isSavingDone}
                  >
                    Save
                  </Button>
                ) : null}
              </div>
            </Box>

            {messageText != "" ? (
              <>
                <br />
                <Chip color="warning" variant="soft">
                  Info: {messageText}
                </Chip>
                <br />
              </>
            ) : null}
            <br />
            {loading ? <LinearProgress /> : null}
            {studentData.length !== 0 ? (
              <>
                <Divider />
                <br />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Input
                    startDecorator={<Search />}
                    sx={{ flex: 0.6 }}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Select
                    defaultValue="P"
                    placeholder="Mark all as"
                    sx={{ minWidth: "200px" }}
                    //   onChange={(e, val) => handleMarkAll(val)}
                  >
                    <Option value="none">None </Option>
                    <Option value="P">Present</Option>
                    <Option value="A">Absent </Option>
                    <Option value="H">Holiday</Option>
                    <Option value="S">Sunday</Option>
                  </Select>
                </div>
                <br />
                <div>
                  <Table
                    aria-label="table variants"
                    variant="plain"
                    color="neutral"
                  >
                    <thead>
                      <tr>
                        <th style={{ width: "150px" }}>ID</th>
                        <th>Students</th>
                        <th>Action</th>
                        <th style={{ textAlign: "right", width: "190px" }}>
                          Comments
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents &&
                        filteredStudents.map((student, i) => {
                          return (
                            <tr key={student.id}>
                              <td>{student.admission_no}</td>
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
                              <td>
                                <RadioGroup
                                  aria-labelledby="storage-label"
                                  value={student.selected_option}
                                  defaultValue="P"
                                  //                 onChange={(e) =>
                                  //                   handleRadioSelect(e, student)
                                  //                 }
                                  size="sm"
                                  sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    gap: 3,
                                  }}
                                >
                                  {["P", "A", "H", "L", "S"].map((value) => (
                                    <Sheet
                                      key={value}
                                      sx={{
                                        p: 1.5,
                                        borderRadius: "md",
                                        boxShadow: "sm",
                                      }}
                                    >
                                      <Radio
                                        label={value}
                                        overlay
                                        disableIcon
                                        value={value}
                                        slotProps={{
                                          label: ({ checked }) => ({
                                            sx: {
                                              fontWeight: "lg",
                                              fontSize: "sm",

                                              color: checked
                                                ? "text.primary"
                                                : "text.secondary",
                                            },
                                          }),
                                          action: ({ checked }) => ({
                                            sx: (theme) => ({
                                              ...(checked && {
                                                "--variant-borderWidth": "2px",
                                                "&&": {
                                                  // && to increase the specificity to win the base :hover styles
                                                  borderColor:
                                                    theme.vars.palette
                                                      .primary[500],
                                                },
                                              }),
                                            }),
                                          }),
                                        }}
                                      />
                                    </Sheet>
                                  ))}
                                </RadioGroup>
                              </td>
                              <td>
                                <Input
                                  type="text"
                                  //                 onChange={(e) =>
                                  //                   handleAttendanceComment(
                                  //                     e.target.value,
                                  //                     student.id
                                  //                   )
                                  //                 }
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </div>
              </>
            ) : null}
          </Paper>
        </LSPage>
      </PageContainer>
    </>
  );
};
