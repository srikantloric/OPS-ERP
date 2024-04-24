import MaterialTable from "@material-table/core";
import React, { useEffect, useState } from "react";
import PageContainer from "../../components/Utils/PageContainer";
import LSPage from "../../components/Utils/LSPage";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import GrainIcon from "@mui/icons-material/Grain";
import { ExportCsv, ExportPdf } from "@material-table/exporters";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import { FEE_TABLE_COLS } from "./utilities/FeePaymentTableColumns";

import {
  Breadcrumbs,
  Divider,
  LinearProgress,
  ListItemIcon,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import PaymentIcon from "@mui/icons-material/Payment";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { enqueueSnackbar } from "notistack";
import { Button, Typography } from "@mui/joy";
import QuickPaymentModal from "./utilities/QuickPaymentModal";
import BreadCrumbsV2 from "components/Breadcrumbs/BreadCrumbsV2";
import BreadCrumbsV3 from "components/Breadcrumbs/BreadCrumbsV3";


const SearchAnotherButton = ()=>{
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
  )
}


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
    console.log(location.state[0])
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
            setLoading(false)
            enqueueSnackbar("No fee generated for student !", { variant: "error" });
          }
        });
      return () => dbSubscription();
    } else {
      setLoading(false);
      enqueueSnackbar("User document not found, please refresh and try again...", { variant: "error" });
    }
  }, []);

  return (
    <PageContainer>
      <LSPage>
        <BreadCrumbsV3 Path="Fee Management/Fee Details" Icon={AccountBalanceWalletIcon} ActionBtn={SearchAnotherButton} />
        <br />
        <Paper
          sx={{
            padding: "8px",
            background: "var(--bs-primary)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ArrowCircleRightIcon sx={{ mr: "5px" }} />
          <Typography sx={{ fontSize: "18px", color: "#fff" }}>
            Student Fee Management
          </Typography>
        </Paper>
        <br />
        <Paper sx={{ backgroundColor: "#FBFCFE", display: "flex" }}>
          <div style={{ margin: "10px" }}>
            <img
              src={location.state[0].profil_url}
              width={90}
              height="100%"
              style={{ objectFit: "cover" }}
            ></img>
          </div>
          <div
            style={{
              margin: "10px 10px 10px 0px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div>
              <h4 style={{ margin: 0, padding: 0, textTransform: "uppercase" }}>
                {location.state[0].student_name}
              </h4>
              <p
                style={{
                  margin: "10px 0px 0px 0px",
                  padding: 0,
                  fontSize: "14px",
                }}
              >
                Father's Name : {location.state[0].father_name}
              </p>
            </div>
            <div
              style={{
                backgroundColor: "#F0F4F8",
                display: "flex",
                gap: "20px",
                marginTop: "10px",
                padding: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <p style={{ margin: 0, padding: 0 }}>Class</p>
                <p style={{ margin: 0, padding: 0 }}>
                  {location.state[0].class}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <p style={{ margin: 0, padding: 0 }}>Roll</p>
                <p style={{ margin: 0, padding: 0 }}>
                  {location.state[0].class_roll}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <p style={{ margin: 0, padding: 0 }}>Admission No</p>
                <p style={{ margin: 0, padding: 0 }}>
                  {location.state[0].admission_no}
                </p>
              </div>
            </div>
          </div>
        </Paper>
        <br />
        {loading ? <LinearProgress /> : null}
        <MaterialTable
          style={{ display: "grid" }}
          columns={FEE_TABLE_COLS}
          data={feeDetails}
          title="Fee Details"
          options={{
            headerStyle: {
              backgroundColor: "var(--bs-secondary)",
              color: "#FFF",
            },
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
              icon: () => <EditIcon sx={{ color: "var(--bs-primary)" }} />,
              tooltip: "Edit Row",
              onClick: (event, rowData) => {
                // handleMenuClick(event);
              },
            },
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
          <MenuItem onClick={()=>historyRef("/feeReciept")}>
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
      </LSPage>
    </PageContainer>
  );
}

export default StudentFeeDetails;
