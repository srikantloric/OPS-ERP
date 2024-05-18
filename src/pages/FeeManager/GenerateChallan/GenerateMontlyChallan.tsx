import { Check, Close } from "@mui/icons-material";
import {
  Avatar,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Input,
  LinearProgress,
  Option,
  Select,
  Table,
} from "@mui/joy";
import { Box, Checkbox, FormControlLabel, Paper } from "@mui/material";
import { IconAdjustmentsExclamation } from "@tabler/icons-react";
import BreadCrumbsV2 from "components/Breadcrumbs/BreadCrumbsV2";
import HeaderTitleCard from "components/Card/HeaderTitleCard";
import Navbar from "components/Navbar/Navbar";
import LSPage from "components/Utils/LSPage";
import PageContainer from "components/Utils/PageContainer";
import { SCHOOL_CLASSES, SCHOOL_FEE_MONTHS } from "config/schoolConfig";
import { db } from "../../../firebase";
import { useState } from "react";

import { IStudentFeeChallan, StudentDetailsType } from "types/student";
import {
  generateAlphanumericUUID,
  getChallanTitle,
  getPaymentDueDate,
  makeDoubleDigit,
} from "utilities/UtilitiesFunctions";
import firebase from "firebase";
import { FEE_TYPE_MONTHLY, paymentStatus } from "constants/index";
import { enqueueSnackbar } from "notistack";

type StudentFeeDataType = {
  studentData: StudentDetailsType;
  isGenerated: boolean;
  errorLog: string;
};

function GenerateMonthlyChallan() {
  const [loading, setLoading] = useState(false);
  //form State
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>();
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [studentData, setStudentData] = useState<StudentFeeDataType[]>([]);
  const [paymentDueDate, setPaymentDueDate] = useState<string>(
    getPaymentDueDate()
  );
  const [lateFine, setLateFine] = useState<number>(0);

  const handleFetch = async (e: any) => {
    e.preventDefault();
    // //Reset old state
    setStudentData([]);

    const feeString =
      "CHALLAN" +
      makeDoubleDigit(selectedMonth!.toString()) +
      selectedYear +
      FEE_TYPE_MONTHLY;
    setLoading(true);
    db.collection("STUDENTS")
      .where("class", "==", selectedClass)
      .get()
      .then((documetSnap) => {
        if (!documetSnap.empty) {
          let tempStudentArray: StudentFeeDataType[] = [];

          documetSnap.forEach((snap) => {
            const docData = snap.data() as StudentDetailsType;
            if (docData.generatedChallans !== undefined) {
              if (!docData.generatedChallans.includes(feeString)) {
                tempStudentArray.push({
                  studentData: docData,
                  isGenerated: false,
                  errorLog: "_",
                });
              } else {
                tempStudentArray.push({
                  studentData: docData,
                  isGenerated: true,
                  errorLog: "already generated",
                });
              }
            } else {
              tempStudentArray.push({
                studentData: docData,
                isGenerated: false,
                errorLog: "_",
              });
            }
          });
          setLoading(false);
          setStudentData(tempStudentArray);
        } else {
          enqueueSnackbar("No records found !", { variant: "info" });
          setLoading(false);
        }
      })
      .catch((e: any) => {
        enqueueSnackbar("Error" + e, { variant: "error" });
      });
  };
  const generateFee = () => {
    //challan string
    const monthYear = `${makeDoubleDigit(
      selectedMonth!.toString()
    )}${selectedYear}`;

    const feeString = `CHALLAN${monthYear}`;

    const feeChallanCode = `CHALLAN${makeDoubleDigit(
      selectedMonth!.toString()
    )}${selectedYear}M01`;

    if (studentData.length > 0) {
      const tempArr: StudentFeeDataType[] = [];

      var promises: Promise<void>[] = [];

      studentData.forEach(async (student) => {
        if (!student.isGenerated) {
          // Create payment entry in subcollection 'PAYMENTS'
          const extPaymentCollDOcId = generateAlphanumericUUID(30);

          if (
            student.studentData.monthly_fee !== undefined &&
            student.studentData.transportation_fee !== undefined &&
            student.studentData.computer_fee !== undefined
          ) {
            const paymentData: IStudentFeeChallan = {
              docIdExt: extPaymentCollDOcId,
              studentId: student.studentData.id,
              challanDocId: feeString,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              createdBy: "Admin",
              paymentId: "" + Math.floor(100000 + Math.random() * 900000),
              challanTitle: getChallanTitle(selectedMonth!, selectedYear!),
              monthYear: monthYear,
              paymentStatus: paymentStatus.DEFAULT,
              paymentDueDate: paymentDueDate,
              monthlyFee: student.studentData.monthly_fee!,
              computerFee: student.studentData.computer_fee!,
              lateFine: lateFine,
              transportationFee: student.studentData.transportation_fee!,
            };

            var batch = db.batch();

            var studentPaymentRef = db
              .collection("STUDENTS")
              .doc(student.studentData.id)
              .collection("PAYMENTS")
              .doc(feeString);

            var extPaymentCollRef = db
              .collection("PAYMENTS")
              .doc(extPaymentCollDOcId);

            batch.set(studentPaymentRef, paymentData);
            batch.set(extPaymentCollRef, paymentData);

            // Update generatedFees array in STUDENTS document
            var studentDocRef = db
              .collection("STUDENTS")
              .doc(student.studentData.id);

            if (student.studentData.generatedChallans) {
              var arrT = student.studentData.generatedChallans;
              arrT.push(feeChallanCode);
              // Update the document by appending the feeChallanCode string to the generatedChallans array
              batch.update(studentDocRef, {
                generatedChallans: arrT,
              });
            } else {
              var arrTem: string[] = [];
              arrTem.push(feeChallanCode);
              batch.update(studentDocRef, {
                generatedChallans: arrTem,
              });
            }
            // Push the Promise returned by batch.commit() into the promises array
            promises.push(
              new Promise((resolve, reject) => {
                // Commit the batch
                batch
                  .commit()
                  .then(() => {
                    const successData: StudentFeeDataType = {
                      isGenerated: true,
                      studentData: student.studentData,
                      errorLog: "Generated successfully",
                    };
                    tempArr.push(successData);
                    resolve();
                  })
                  .catch((error) => {
                    console.error("Error during batch commit:", error);
                    reject(error);
                  });
              })
            );
          } else {
            const failureData: StudentFeeDataType = {
              isGenerated: false,
              studentData: student.studentData,
              errorLog: "Monthly/Computer/Trans. not found",
            };
            tempArr.push(failureData);
          }
        }
      });
      // Wait for all Promises (batch commits) to resolve
      Promise.all(promises)
        .then(() => {
          setStudentData(tempArr);
        })
        .catch((error) => {
          console.error("Error during batch commits:", error);
        });
    }
  };

  return (
    <PageContainer>
      <Navbar />
      <LSPage>
        <BreadCrumbsV2
          Icon={IconAdjustmentsExclamation}
          Path="Accountings/Generate Monthly Fee"
        />
        <HeaderTitleCard Title="Generate Monthly Fee" />
        <br />
        <Paper sx={{ pl: 2, pr: 2, pt: 2, pb: 3 }}>
          <Box component="form" onSubmit={handleFetch}>
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid xs={2}>
                <FormControl>
                  <FormLabel>Select Class</FormLabel>
                  <Select
                    defaultValue={null}
                    value={selectedClass}
                    placeholder="select class.."
                    onChange={(e, val) => setSelectedClass(val)}
                    required
                  >
                    {SCHOOL_CLASSES.map((item, index) => {
                      return (
                        <Option key={index} value={item.value}>
                          {item.title}
                        </Option>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={2}>
                <FormControl>
                  <FormLabel>Select Month</FormLabel>
                  <Select
                    defaultValue={null}
                    value={selectedMonth}
                    placeholder="select month.."
                    onChange={(e, val) => setSelectedMonth(val)}
                    required
                  >
                    {SCHOOL_FEE_MONTHS.map((item, index) => {
                      return (
                        <Option key={index} value={item.value}>
                          {item.title}
                        </Option>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={2}>
                <FormControl>
                  <FormLabel>Select Year</FormLabel>
                  <Select
                    defaultValue={null}
                    value={selectedYear}
                    placeholder="select year.."
                    onChange={(e, val) => setSelectedYear(val)}
                    required
                  >
                    <Option value="2024">2024</Option>
                    <Option value="2023">2023</Option>
                    <Option value="2022">2022</Option>
                    <Option value="2021">2021</Option>
                    <Option value="2020">2020</Option>
                    <Option value="2019">2019</Option>
                  </Select>
                </FormControl>
              </Grid>

              <Grid xs={2}>
                <FormControl>
                  <FormLabel>Due Date</FormLabel>
                  <Input
                    type="date"
                    required
                    value={paymentDueDate}
                    placeholder="select due date.."
                    onChange={(e) => setPaymentDueDate(e.currentTarget.value)}
                  />
                </FormControl>
              </Grid>
              <Grid xs={2}>
                <FormControl>
                  <FormLabel>Late Fine</FormLabel>
                  <Input
                    type="number"
                    required
                    value={lateFine}
                    onChange={(e) =>
                      setLateFine(parseInt(e.currentTarget.value))
                    }
                  />
                </FormControl>
              </Grid>
              <FormControlLabel
                sx={{ ml: 1 }}
                control={<Checkbox defaultChecked />}
                label="Include Transportation Fee"
              />
              <br />
              <Button
                type="submit"
                variant="soft"
                sx={{ ml: 1, mt: 1 }}
                loading={loading}
              >
                Fetch
              </Button>
              {studentData.length > 0 ? (
                <Button onClick={generateFee} sx={{ ml: 1, mt: 1 }}>
                  Generate Fee
                </Button>
              ) : null}
            </Grid>
          </Box>
        </Paper>
        <br />

        {loading ? (
          <LinearProgress
            sx={{
              "--LinearProgress-thickness": "4px",
            }}
          />
        ) : null}

        {studentData.length > 0 ? (
          <Table
            aria-label="basic table"
            stripe="even"
            sx={{
              "& tr > *:not(:first-child)": { textAlign: "center" },
              maxHeight: "60vh",
            }}
          >
            <thead>
              <tr>
                <th style={{ width: "50px" }}>Profile</th>
                <th>ID</th>
                <th>Name</th>
                <th>DOB</th>
                <th>Father</th>
                <th>Status</th>
                <th style={{ width: "200px" }}>message</th>
              </tr>
            </thead>
            <tbody>
              {studentData.map((student: StudentFeeDataType) => {
                return (
                  <tr>
                    <td>
                      <Avatar size="sm" src={student.studentData.profil_url} />
                    </td>
                    <td>{student.studentData.admission_no}</td>
                    <td>{student.studentData.student_name}</td>
                    <td>{student.studentData.dob}</td>
                    <td>{student.studentData.father_name}</td>
                    <td>
                      {student.isGenerated ? (
                        <Check color="success" />
                      ) : (
                        <Close color="error" />
                      )}
                    </td>
                    <td>{student.errorLog}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        ) : null}
      </LSPage>
    </PageContainer>
  );
}

export default GenerateMonthlyChallan;
