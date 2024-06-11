import Navbar from "../../components/Navbar/Navbar";
import LSPage from "../../components/Utils/LSPage";
import CardDashboard from "../../components/Card/CardDashboard";
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import PageContainer from "../../components/Utils/PageContainer";
import Footer from "../../components/Footer/Footer";
import BarGraphChart from "../../components/Graph/BarGraphChart";
import AttendanceBarGraph from "../../components/Graph/AttendanceBarGraph";
import {
  Box,
  Divider,
  Grid,
  LinearProgress,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import cardBack from "../../assets/widgets/img-dropbox-bg.svg";
import {
  Card,
  Dash,
  Money,
  MoneySend,
  Profile2User,
  Simcard1,
  WalletMoney,
} from "iconsax-react";
import { Avatar } from "@mui/material";
import BreadCrumbsV2 from "components/Breadcrumbs/BreadCrumbsV2";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { enqueueSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { fetchstudent } from "store/studentSlice";
import { fetchTotalStudents } from "store/Slices/dashboardAnalytics";

Chart.register(CategoryScale);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: true,
      text: "Attendance Chart",
    },
  },
};

function Dashboard() {
  const totalStudentsCount = useSelector((state) => state.analytics.count);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTotalStudents());
  }, []);

  return (
    <>
      <PageContainer>
        <Navbar />
        <LSPage>
          <BreadCrumbsV2 Path="Dashboard/Analytics" Icon={Dash} />
          <Stack direction="row" mt="0.8rem">
            <Grid
              container
              justifyContent="space-between"
              gap="0.5rem"
              flex={1}
            >
              <Grid xs={12} md={3.9} lg={3.9}>
                <CardDashboard
                  headerTitle={totalStudentsCount}
                  subHeaderTitle="Total Students"
                  color="#81c784"
                  Icon={Profile2User}
                />
              </Grid>
              <Grid xs={12} md={3.9} lg={3.9}>
                <CardDashboard
                  headerTitle="₹5000"
                  subHeaderTitle="Total Income This Year"
                  color="#9575cd"
                  Icon={MoneySend}
                />
              </Grid>
              <Grid xs={12} md={3.9} lg={3.9}>
                <CardDashboard
                  headerTitle="27"
                  subHeaderTitle="Dues-Amount : 64750"
                  color="#4fc3f7"
                  Icon={WalletMoney}
                />
              </Grid>
              <Grid xs={12} md={3.9} lg={3.9}>
                <CardDashboard
                  headerTitle="₹5000"
                  subHeaderTitle="Income This Month"
                  color="#64b5f6"
                  Icon={Money}
                />
              </Grid>
              <Grid xs={12} md={3.9} lg={3.9}>
                <CardDashboard
                  headerTitle="0"
                  subHeaderTitle="Income Today"
                  color="#E48F45"
                  Icon={Money}
                />
              </Grid>
              <Grid xs={12} md={3.9} lg={3.9}>
                <CardDashboard
                  headerTitle="27"
                  subHeaderTitle="Profit This Month"
                  color="#ffb74d"
                  Icon={Money}
                />
              </Grid>
            </Grid>

            <Stack justifyContent="space-between">
              <Stack
                sx={{
                  width: "260px",
                  p: "1rem",
                  ml: "1rem",
                  borderRadius: "0.5rem",
                  bgcolor: "#1D2630",
                  position: "relative",
                  overflow: "hidden",
                  justifyContent: "space-between",
                  flex: 1,
                  mb: "0.5rem",
                  "&:after": {
                    content: '""',
                    backgroundImage: `url(${cardBack})`,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1,
                    opacity: 0.5,
                    backgroundPosition: "bottom right",
                    backgroundSize: "100%",
                    backgroundRepeat: "no-repeat",
                  },
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Typography level="title-lg" sx={{ color: "#fff" }}>
                    SMS Credits
                  </Typography>
                  <Typography level="h4" sx={{ color: "#fff" }}>
                    120 SMS
                  </Typography>
                </Stack>
                <Avatar
                  color="secondary"
                  variant="rounded"
                  sx={{ mt: 0.75, bgcolor: "#2F3841", opacity: "0.8" }}
                >
                  <Simcard1 color="#fff" opacity="0.6" />
                </Avatar>
                <Typography level="body-sm" mt="0.5rem" sx={{ color: "#fff" }}>
                  120SMS/1200SMS Remaining
                </Typography>
                <Box mt="0.5rem">
                  <LinearProgress
                    determinate
                    value={45}
                    color="success"
                    variant="solid"
                  />
                </Box>
              </Stack>
              <Box
                sx={{
                  bgcolor: "#3f51b5",
                  pl: "1rem",
                  pr: "1rem",
                  pt: "0.5rem",
                  pb: "0.5rem",
                  borderRadius: "0.5rem",
                  ml: "1rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Stack>
                  <Typography level="title-sm" sx={{ color: "#fff" }}>
                    Available Balance
                  </Typography>
                  <Typography level="h4" sx={{ color: "#fff" }}>
                    ₹0.0
                  </Typography>
                </Stack>
                <Card color="#fff" size={30} opacity="0.7" />
              </Box>
            </Stack>
          </Stack>
        </LSPage>
        <Divider />
        <Grid container gap="1rem" m="1rem">
          <Grid md={5.8} sm={12} xs={12}>
            <Sheet
              variant="outlined"
              sx={{ p: "1rem", borderRadius: "0.5rem" }}
            >
              <Box>
                <Typography level="title-md" textAlign="center" mb="0.5rem">
                  Month Wise Paid/Unpaid Fee Report For Current Year
                </Typography>
                <BarGraphChart />
              </Box>
            </Sheet>
          </Grid>
          <Grid md={5.8} sm={12} xs={12}>
            <Sheet
              variant="outlined"
              sx={{ p: "1rem", borderRadius: "0.5rem" }}
            >
              <Box>
                <Typography level="title-md" textAlign="center">
                  Day Wise Attendance Report of School
                </Typography>
                <AttendanceBarGraph />
              </Box>
            </Sheet>
          </Grid>
        </Grid>

        <Footer />
      </PageContainer>
    </>
  );
}

export default Dashboard;
