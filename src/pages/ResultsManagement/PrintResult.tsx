import { Print } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  Box,
  Button,
  Chip,
  Input,
  Option,
  Select,
  Stack,
  Typography,
} from "@mui/joy";
import { Paper } from "@mui/material";
import { IconBrandTinder } from "@tabler/icons-react";
import BreadCrumbsV2 from "components/Breadcrumbs/BreadCrumbsV2";
import Navbar from "components/Navbar/Navbar";
import LSPage from "components/Utils/LSPage";
import PageContainer from "components/Utils/PageContainer";
import { SCHOOL_CLASSES } from "config/schoolConfig";
import { db } from "../../firebase";
import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { marksheetType, paperMarksType, rankType, resultType } from "types/results";
import { StudentDetailsType } from "types/student";
import { MarksheetReportGenerator } from "components/Reports/MarksheetReport";

type examType = {
  examId: string;
  examTitle: string;
};

type paperType = {
  paperId: string;
  paperTitle: string;
};
type examConfig = {
  examPapers: paperType[];
  exams: examType[];
};

function PrintResult() {
  const [studentIdInput, setStudentIdInput] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [examsList, setExamList] = useState<examType[]>([]);
  const [selectedExam, setSelectedExam] = useState<any | null>(null);

  const [marksheetList, setMarksheetList] = useState<marksheetType[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [isGeneratingRank, setIsGeneratingRank] = useState<boolean>(false);

  useEffect(() => {
    db.collection("CONFIG")
      .doc("EXAM_CONFIG")
      .get()
      .then((snap) => {
        const data = snap.data() as examConfig;
        if (data) {
          setExamList(data.exams);
        } else {
          console.log("No data retrieved from exam config..");
        }
      })
      .catch((err) => {
        console.log("Error while fetching exams / papers", err);
      });
  }, []);

  const printMarkSheet = async (marksheetList: any) => {
    const pdfUrl = await MarksheetReportGenerator(marksheetList);
    setPdfUrl(pdfUrl);
  };

  const fetchResults = () => {
    console.log(`Selected Classs:${selectedClass}`);
    console.log(`Selected Exam:${selectedExam}`);

    let studentList: StudentDetailsType[] = [];
    setMarksheetList([]);
    setLoading(true);
    db.collection("STUDENTS")
      .where("class", "==", selectedClass)
      .get()
      .then((snap) => {
        if (snap.size > 0) {
          snap.forEach((doc) => {
            studentList.push(doc.data() as StudentDetailsType);
          });

          let temMarkSheetList: marksheetType[] = [];
          for (let i = 0; i < studentList.length; i++) {
            db.collection("STUDENTS")
              .doc(studentList[i].id)
              .collection("PUBLISHED_RESULTS")
              .get()
              .then((results) => {
                if (results.size > 0) {
                  results.forEach((result) => {
                    if (result.data().examId === selectedExam) {
                      let newMarkSheet: marksheetType = {
                        student: studentList[i],
                        result: result.data().result as paperMarksType[],
                      };
                      temMarkSheetList.push(newMarkSheet);
                      setMarksheetList((prevMarksheet) => [
                        ...prevMarksheet,
                        newMarkSheet,
                      ]);
                    }
                  });
                }
              })
              .catch((err) => {
                enqueueSnackbar(err);
                setLoading(false);
              });
          }
          setLoading(false);
          //   setMarksheetList(temMarkSheetList);
          //   printMarkSheet(marksheetList);
        } else {
          setLoading(false);
          enqueueSnackbar("No result found :)", { variant: "warning" });
        }
      });
  };

  useEffect(() => {
    printMarkSheet(marksheetList);
  }, [marksheetList]);

  //Generate Student Rank
  const generateStudentRank = async () => {
    if (selectedClass) {
      if (selectedExam) {
        setIsGeneratingRank(true);
        //Fetch all student of selected class
        let allStudentList: StudentDetailsType[] = [];
        try {
          const snap = await db
            .collection("STUDENTS")
            .where("class", "==", selectedClass)
            .get();
          if (snap.size > 0) {
            snap.forEach((doc) => {
              allStudentList.push(doc.data() as StudentDetailsType);
            });
          } else {
            setIsGeneratingRank(false);
            enqueueSnackbar("No student found!", { variant: "error" });
          }
        } catch (err) {
          setIsGeneratingRank(false);
          console.log("Failed to fetch students", err);
        }

        //Fetch results of all students
      
        let markSheetTempList: rankType[] = [];

        for (let i = 0; i < allStudentList.length; i++) {
          try {
            const snap = await db
              .collection("STUDENTS")
              .doc(allStudentList[i].id)
              .collection("PUBLISHED_RESULTS")
              .get();

            if (snap.size > 0) {
              // Get Exam Marks
              snap.forEach((resDoc) => {
                const res = resDoc.data() as resultType;
                if (res.examId === selectedExam) {
                  let totalMark = 0;
                  for (let j = 0; j < res.result.length; j++) {
                    totalMark += res.result[j].paperMarkObtained;
                  }

                  const rankTemp: rankType = {
                    studentId: allStudentList[i].id,
                    rankObtained: "N/A",
                    marksObtained: totalMark,
                  };

                  markSheetTempList.push(rankTemp);
                } else {
                  console.log(
                    `Result not published for ${allStudentList[i].id}`
                  );
                }
              });
            }
          } catch (error) {
            console.error(
              `Error fetching results for student ${allStudentList[i].id}:`,
              error
            );
            setIsGeneratingRank(false);
          }
        }
        //set Rank for student
        // Sort the markSheetTempList by marksObtained in descending order
        markSheetTempList.sort((a, b) => b.marksObtained - a.marksObtained);

        // Update ranks for top 10 students
        for (let i = 0; i < Math.min(10, markSheetTempList.length); i++) {
          markSheetTempList[i].rankObtained = i + 1;
        }

        // For other students, the rank remains "N/A" or can be updated as needed
        for (let i = 10; i < markSheetTempList.length; i++) {
          markSheetTempList[i].rankObtained = "N/A";
        }
        
        //Upload Rank to DB
        const rankData = {
          class:selectedClass,
          lastUpdated:new Date(),
          studentRanks:markSheetTempList,
        }
        
        db.collection("RESULTS").doc(""+selectedClass).set(rankData).then(()=>{
          setIsGeneratingRank(false);
          enqueueSnackbar("Rank updated Succefully",{variant:"success"});
        }).catch((err)=>{
          setIsGeneratingRank(false);
          enqueueSnackbar("Failed to update rank!",{variant:"error"});
        })


        console.log("Student Rank Array", markSheetTempList);
      } else {
        enqueueSnackbar("Please select exam!", { variant: "error" });
      }
    } else {
      enqueueSnackbar("Please select class!", { variant: "error" });
    }
  };

  return (
    <PageContainer>
      <Navbar />
      <LSPage>
        <BreadCrumbsV2
          Icon={IconBrandTinder}
          Path="School Results/Print Results"
        />
        <Paper sx={{ p: "10px", mt: "8px" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography level="title-md">Print Marksheet</Typography>
            </Box>
            <Stack direction="row" alignItems="center" gap={1.5}>
              <Input
                placeholder="Search by student id.."
                value={studentIdInput!}
                onChange={(e) => setStudentIdInput(e.target.value)}
              ></Input>
              <Typography>Or</Typography>
              <Select
                placeholder="choose class"
                onChange={(e, val) => setSelectedClass(val)}
              >
                {SCHOOL_CLASSES.map((item) => {
                  return <Option value={item.value}>{item.title}</Option>;
                })}
              </Select>
              <Select
                placeholder="choose exam"
                value={selectedExam}
                onChange={(e, val) => setSelectedExam(val)}
              >
                {examsList &&
                  examsList.map((item, key) => {
                    return (
                      <Option value={item.examId}>{item.examTitle}</Option>
                    );
                  })}
              </Select>
              <Button
                sx={{ ml: "8px" }}
                startDecorator={<Print />}
                loading={loading}
                onClick={fetchResults}
              ></Button>
              <Button
                sx={{ ml: "8px" }}
                startDecorator={<RefreshIcon />}
                loading={isGeneratingRank}
                onClick={generateStudentRank}
              >
                Re-Generate Rank
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {pdfUrl && (
          <>
            <Chip sx={{ mt: "8px", mb: "8px" }}>
              Total marksheet count :{marksheetList.length}
            </Chip>
            <Paper sx={{ height: "100vh" }}>
              <iframe
                src={pdfUrl}
                title="PDF Viewer"
                width="100%"
                height="100%"
                frameBorder={0}
              />
            </Paper>
          </>
        )}
      </LSPage>
    </PageContainer>
  );
}

export default PrintResult;
