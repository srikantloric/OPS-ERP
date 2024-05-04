import MaterialTable from "@material-table/core";
import { useEffect, useState } from "react";
import PageContainer from "../../components/Utils/PageContainer";
import LSPage from "../../components/Utils/LSPage";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import { FEE_TABLE_COLS } from "./utilities/FeePaymentTableColumns";

import {
  Divider,
  LinearProgress,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { Add, Delete, Edit, MoreVert } from "@mui/icons-material";
import PaymentIcon from "@mui/icons-material/Payment";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { enqueueSnackbar } from "notistack";
import { Box, Button, Stack, Tooltip, Typography } from "@mui/joy";
import QuickPaymentModal from "./utilities/QuickPaymentModal";
import BreadCrumbsV3 from "components/Breadcrumbs/BreadCrumbsV3";
import Navbar from "components/Navbar/Navbar";
import {
  AddCircle,
  Calculator,
  CardEdit,
  MinusCirlce,
  Moneys,
  More,
  Wallet,
} from "iconsax-react";
import { getClassNameByValue } from "utilities/UtilitiesFunctions";
import AddFeeArrearModal from "components/Modals/AddFeeArrearModal";
import { FEE_HEADERS } from "constants";

const SearchAnotherButton = () => {
  const historyRef = useNavigate();
  return (
    <Button
      startIcon={<ControlPointIcon />}
      variant="solid"
      disableElevation
      style={{ backgroundColor: "var(--bs-primary)" }}
      onClick={(e) => {
        historyRef("/FeeManagement");
      }}
    >
      Search Another
    </Button>
  );
};

//main element
function StudentFeeDetails() {
  const [modelOpen, setModelOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  // let selectedRow = null;
  const [feeDetails, setFeeDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentRemarks, setPaymentRemarks] = useState("");
  const historyRef = useNavigate();
  const location = useLocation();

  ///Sof Menu State
  const [anchorEll, setAnchorEll] = useState(null);
  const menuOpen = Boolean(anchorEll);

  //Add Fee Arrear Modal
  const [addArrearModalOpen,setAddArrearModalopen] = useState(false);

  const handleMenuClick = (event, rowData) => {
    setAnchorEll(event.currentTarget);
    setSelectedRow(rowData);
  };

  useEffect(() => {
    if (selectedRow) {
      setPaymentRemarks(selectedRow.payment_remarks);
    }
  }, [selectedRow]);

  const handleMenuClose = () => {
    setAnchorEll(null);
  };
  //Eof Menu State

  useEffect(() => {
    setLoading(true);
    console.log(location.state[0]);
    const userDocId = location.state[0].id;
    // console.log(location.state[0]);
    if (userDocId) {
      const dbSubscription = db
        .collection("STUDENTS")
        .doc(userDocId)
        .collection("PAYMENTS")
        .onSnapshot((snapshot) => {
          if (snapshot.docs) {
            var feeArr = [];
            snapshot.forEach((doc) => {
              const dataMod = {
                id: doc.data().payement_id,
              };
              feeArr.push(doc.data());
            });
            setFeeDetails(feeArr);
            setLoading(false);
          } else {
            setLoading(false);
            enqueueSnackbar("No fee generated for student !", {
              variant: "error",
            });
          }
        });
      return () => dbSubscription();
    } else {
      setLoading(false);
      enqueueSnackbar(
        "User document not found, please refresh and try again...",
        { variant: "error" }
      );
    }
  }, []);


  return (
    <PageContainer>
      <Navbar />
      <LSPage>
        <BreadCrumbsV3
          Path="Fee Management/Fee Details"
          Icon={AccountBalanceWalletIcon}
          ActionBtn={SearchAnotherButton}
        />
        <br />
        <Paper sx={{ backgroundColor: "#FBFCFE", display: "flex" }}>
          <div style={{ margin: "10px" }}>
            <img
              src={location.state[0].profil_url}
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
                {location.state[0].student_name}
              </Typography>
              <Typography level="body-sm">
                Father's Name : {location.state[0].father_name}
              </Typography>
              <Typography level="body-sm">
                Student's ID: {location.state[0].admission_no}
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
                  {getClassNameByValue(location.state[0].class)}
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
                  {location.state[0].class_roll}
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
                  {location.state[0].date_of_addmission}
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography level="body-sm">Fee</Typography>
                <Typography level="title-sm">
                  ₹{location.state[0].monthly_fee}
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography level="body-sm">Discount</Typography>
                <Typography level="title-sm">
                  ₹{location.state[0].fee_discount}
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography level="body-sm">Transport</Typography>
                <Typography level="title-sm">
                  ₹{location.state[0].transportation_fee}
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography level="body-sm">Computer</Typography>
                <Typography level="title-sm">
                  ₹{location.state[0].computer_fee}
                </Typography>
              </div>
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
              <Calculator size="26" color="#2ccce4" />

              <Typography level="h4" mt={1}>
                ₹94,00
              </Typography>
              <Typography level="body-sm">Total Dues</Typography>
            </Stack>

            <Stack direction="column" alignItems="center">
              <CardEdit color="#ff8a65" size="26" />
              <Typography level="h4" mt={1}>
                ₹20,00
              </Typography>
              <Typography level="body-sm">Consession</Typography>
            </Stack>

            <Stack direction="column" alignItems="center">
              <Moneys color="#37d67a" size="26" />
              <Typography level="h4" mt={1}>
                ₹100
              </Typography>
              <Typography level="body-sm">Collection</Typography>
            </Stack>
            <Stack direction="column" alignItems="center">
              <Wallet color="#f47373" size="26" />
              <Typography level="h4" mt={1}>
                ₹9400
              </Typography>
              <Typography level="body-sm">Balance</Typography>
            </Stack>
          </Box>
        </Paper>
        <br />
        {loading ? <LinearProgress /> : null}
        <Box sx={{ display: "flex", justifyContent: "end", mb: "0px" }}>
          <Box
            sx={{
              // background: "var(--bs-gray-300)",
              borderTop: "1px solid var(--bs-gray-300)",
              borderLeft: "1px solid var(--bs-gray-300)",
              borderRight: "1px solid var(--bs-gray-300)",
              borderRadius: "10px 10px 0px 0px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            padding="8px"
          >
            <Button variant="soft" color="primary" onClick={()=>setAddArrearModalopen(true)}>
              Add Arrear
            </Button>

            <Button variant="soft">Add Consession</Button>
          </Box>
        </Box>
        <MaterialTable
          style={{ display: "grid",boxShadow:"none",border:"1px solid var(--bs-gray-300)",borderRadius:"10px 0px 10px 10px",padding:"10px" }}
          columns={FEE_TABLE_COLS}

          data={feeDetails}

          // parentChildData={(row, rows) => rows.find(a => a.id === row.parentId)}

          title="Fee Details"
          options={{
            columnResizable:true,
            headerStyle: {
              backgroundColor: "var(--bs-secondary)",
              color: "#FFF",
              textAlign:"left",
              fontSize:"13px",
              paddingRight:"10px",
              paddingLeft:"5px",
            },
            rowStyle: {
              backgroundColor: '#EEE',
            },
            editCellStyle: { borderRight: '1px solid #eee' },
            exportAllData: true,
            exportMenu: [
              {
                label: "Export PDF",
                exportFunc: (cols, datas) =>
                  ExportPdf(cols, datas, "myPdfFileName"),
              },
              {
                label: "Export CSV",
                exportFunc: (cols, datas) =>
                  ExportCsv(cols, datas, "myCsvFileName"),
              },
            ],
            actionsColumnIndex: -1,
          }}
          actions={[
            {
              icon: () => (
                <MoreVert
                  aria-controls={menuOpen ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={menuOpen ? "true" : undefined}
                />
              ),
              tooltip: "More options",
              onClick: (event, rowData) => {
                // console.log(rowData);
                handleMenuClick(event, rowData);
              },
            },
          ]}
        />

        <Menu
          anchorEl={anchorEll}
          id="account-menu"
          open={menuOpen}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={() => setModelOpen(true)}>
            <ListItemIcon>
              <PaymentIcon fontSize="small" />
            </ListItemIcon>
            Quick Payment
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => historyRef("/feeReciept")}>
            <ListItemIcon>
              <PrintIcon fontSize="small" />
            </ListItemIcon>
            Print Recipt
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleMenuClick}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            Edit
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleMenuClick}>
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            Delete
          </MenuItem>
        </Menu>

        <QuickPaymentModal
          selectedRowData={selectedRow}
          userPaymentData={location.state[0]}
          modelOpen={modelOpen}
          setModelOpen={setModelOpen}
          paymentRemarks={paymentRemarks}
          setPaymentRemarks={setPaymentRemarks}
          // paymentDate={paymentDate}
          // setPaymentDate={setPaymentDate}
        />

        <AddFeeArrearModal open={addArrearModalOpen} setOpen={setAddArrearModalopen}/>
      </LSPage>
    </PageContainer>
  );
}

export default StudentFeeDetails;
