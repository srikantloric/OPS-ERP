import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import PropTypes from "prop-types";
import LSPage from "../../components/Utils/LSPage";
import PageContainer from "../../components/Utils/PageContainer";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import GrainIcon from "@mui/icons-material/Grain";
import Styles from "./FacultiesDetails.module.scss";
import PersonIcon from "@mui/icons-material/Person";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import { enqueueSnackbar } from "notistack";
import {
  Box,
  Breadcrumbs,
  Button,
  Grid,
  List,
  ListItem,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { EditLocation } from "@mui/icons-material";
import { IconEdit } from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { db } from "../../firebase";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2, pl: 1, pr: 1 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

function FacultyDetail() {
  const { id } = useParams();
  const [teacherData, setteacherData] = useState();
  const [value, setValue] = React.useState(0);
  const [feeDetails, setFeeDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const data = useSelector((state) => state.teachers.teacherArray);
  console.log(data)
  useEffect(() => {
    if (id) {
      const sigledata = data.filter((ele) => ele.id === id);
      console.log(sigledata);
      setteacherData(sigledata[0]);
    }
  }, []);
  const paymentdetail = (paymentcard, index) => {
    return (
      <div className={Styles.paymentbox}>
        <div className={Styles.paymentboxchild}>
          <div className={Styles.paymentStatus}>
            <p>Successful</p>
            <p>Rs {paymentcard.payment_amount}</p>
          </div>

          <div className={Styles.paymentDate}>
            <p>11/12/2023</p>
            <p> | TXN ID SBI00037</p>
          </div>
        </div>
        <div className={Styles.paymentBonus}>
          <p>Bonus: {paymentcard.payment_bonus}</p>
          <p>Credit by:{paymentcard.payment_by}</p>
        </div>
      </div>
    );
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setLoading(true);
    console.log(id);
    const userDocId = id;
    // console.log(location.state[0]);
    if (userDocId) {
      const dbSubscriptions = db
        .collection("FACULTIES")
        .doc(userDocId)
        .collection("Payment")
        .onSnapshot((snapshot) => {
          if (snapshot.size) {
            var paymentArr = [];
            snapshot.forEach((doc) => {
              const dataMod = {
                id: doc.data().payment_id,
              };
              paymentArr.push(doc.data());
            });
            setFeeDetails(paymentArr);

            setLoading(false);
          } else {
            enqueueSnackbar("Something went wreong !", { variant: "error" });
          }
        });

      console.log(feeDetails);
      return () => dbSubscriptions();
    } else {
      setLoading(false);
      enqueueSnackbar("User document not found !", { variant: "error" });
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
              // margin: "5px",
            }}
          >
            <Breadcrumbs aria-label="breadcrumb">
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  color: "#343a40",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <PersonIcon sx={{ color: "var(--bs-gray-500)" }} />
                <Typography sx={{ ml: "4px" }}>Faculty Management</Typography>
              </Link>

              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="text.secondary"
              >
                Faculties
              </Typography>
              <Typography
                sx={{ display: "flex", alignItems: "center" }}
                color="text.secondary"
              >
                <GrainIcon sx={{ mr: 0.3 }} fontSize="inherit" />
                {id}
              </Typography>
            </Breadcrumbs>
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
                      : {teacherData && teacherData.dob}
                    </p>
                    <p style={{ padding: 3, margin: 0, fontSize: "14px" }}>
                      : {teacherData && teacherData.doj}
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
            </div>
          </div>

          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Personal Details" {...a11yProps(0)} />
              <Tab label="Qualifications" {...a11yProps(1)} />
              <Tab label="Address" {...a11yProps(2)} />
              <Tab label="Accounts & Ledger" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Grid item xs={12}>
              <List sx={{ py: 0 }}>
                <ListItem>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack>
                        <Typography color="secondary" fontSize={15}>
                          Full Name
                        </Typography>
                        <Typography>{teacherData && teacherData.faculty_name} </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <Typography color="secondary" fontSize={15}>
                          Employ Id
                        </Typography>
                        <Typography></Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary" fontSize={15}>
                          Teacher Id
                        </Typography>
                        <Typography></Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary" fontSize={15}>
                          Birth date
                        </Typography>
                        <Typography>{teacherData && teacherData.dob}</Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary" fontSize={15}>
                          Email
                        </Typography>
                        <Typography>{teacherData && teacherData.faculty_father_name}</Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary" fontSize={15}>
                          Blood Group
                        </Typography>
                        <Typography></Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Stack spacing={0.5}>
                    <Typography color="secondary" fontSize={15}>
                      Address
                    </Typography>
                    <Typography></Typography>
                  </Stack>
                </ListItem>
              </List>
            </Grid>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Paper sx={{ padding: "1rem" }}>
              <table className={Styles.table}>
                <tr>
                  <td>Qualification:</td>
                  <td>{teacherData && teacherData.faculty_qualification}</td>
                </tr>
                <tr>
                  <td>Specification Subject:</td>
                  <td>{teacherData && teacherData.faculty_specification}</td>
                </tr>

                <tr>
                  <td>Previous Job:</td>
                  <td>{teacherData && teacherData.faculty_id}</td>
                </tr>
                <tr>
                  <td>:</td>
                  <td>{teacherData && teacherData.dob}</td>
                </tr>
                <tr>
                  <td>Cast:</td>
                  <td>{teacherData && teacherData.cast}</td>
                </tr>
              </table>
            </Paper>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <div className={Styles.address_container}>
              <div className={Styles.address_container_leftbar}></div>
              <div className={Styles.address_container_mainsection}>
                <table className={Styles.table}>
                  <tr>
                    <td>Adress:</td>
                    <td>{teacherData && teacherData.faculty_address}</td>
                  </tr>
                </table>
              </div>
            </div>
          </CustomTabPanel>
          <CustomTabPanel
            className={Styles.paymentcontain}
            value={value}
            index={3}
          >
            {/* <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Dessert (100g serving)</TableCell>
                    <TableCell align="right">Calories</TableCell>
                    <TableCell align="right">Fat&nbsp;(g)</TableCell>
                    <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                    <TableCell align="right">Protein&nbsp;(g)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.calories}</TableCell>
                      <TableCell align="right">{row.fat}</TableCell>
                      <TableCell align="right">{row.carbs}</TableCell>
                      <TableCell align="right">{row.protein}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer> */}
            {feeDetails.map(paymentdetail)}
          </CustomTabPanel>
        </LSPage>
      </PageContainer>
    </>
  );
}

export default FacultyDetail;
