import { Print } from "@mui/icons-material";
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
import { marksheetType, paperMarksType } from "types/results";
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
    console.log(marksheetList);
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
            </Stack>
          </Stack>
        </Paper>

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
      </LSPage>
    </PageContainer>
  );
}

export default PrintResult;
