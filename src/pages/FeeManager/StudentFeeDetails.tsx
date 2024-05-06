import { useEffect, useState } from "react";
import PageContainer from "../../components/Utils/PageContainer";
import LSPage from "../../components/Utils/LSPage";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PrintIcon from "@mui/icons-material/Print";

import {
  Divider,
  LinearProgress,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { Delete, Edit, MoreVert } from "@mui/icons-material";
import PaymentIcon from "@mui/icons-material/Payment";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { enqueueSnackbar } from "notistack";
import { Box, Button, Table, Tooltip, Typography } from "@mui/joy";
import QuickPaymentModal from "./utilities/QuickPaymentModal";
import BreadCrumbsV3 from "components/Breadcrumbs/BreadCrumbsV3";
import Navbar from "components/Navbar/Navbar";
import AddFeeArrearModal from "components/Modals/AddFeeArrearModal";
import { FEE_HEADERS } from "../../constants/index";
import IndividualFeeDetailsHeader from "components/Headers/IndividualFeeDetailsHeader";
import { StudentFeeDetailsType } from "types/student";

const SearchAnotherButton = () => {
  const historyRef = useNavigate();
  return (
    <Button
      startDecorator={<ControlPointIcon />}
      variant="solid"
      sx={{ backgroundColor: "var(--bs-primary)" }}
      onClick={(e) => {
        historyRef("/FeeManagement");
      }}
    >
      Search Another
    </Button>
  );
};

function StudentFeeDetails() {
  const [modelOpen, setModelOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<StudentFeeDetailsType | null>(
    null
  );
  const [feeDetails, setFeeDetails] = useState<StudentFeeDetailsType[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentRemarks, setPaymentRemarks] = useState("");
  const historyRef = useNavigate();
  const location = useLocation();

  /// Menu State
  const [anchorEll, setAnchorEll] = useState<HTMLAnchorElement | null>(null);
  const menuOpen = Boolean(anchorEll);

  //Add Fee Arrear Modal
  const [addArrearModalOpen, setAddArrearModalopen] = useState(false);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    rowData: StudentFeeDetailsType
  ) => {
    setAnchorEll(event.target as HTMLAnchorElement);
    setSelectedRow(rowData);
  };

  function sum(
    column:
      | "fee_total"
      | "transportation_fee"
      | "computer_fee"
      | "exam_fee"
      | "admission_fee"
      | "other_fee"
      | "annual_fee"
      | "total_due"
      | "late_fee"
  ) {
    return feeDetails.reduce((acc, row) => acc + row[column]!, 0);
  }

  const calculatedLateFine = (lateFee: number, dueDate: string): number => {
    const dueDateFormated = new Date(dueDate);
    const currentDate = new Date();
    let lateFine = 0;
    if (dueDateFormated >= currentDate) {
      lateFine = lateFee;
    }
    return lateFine;
  };

  const handleMenuClose = () => {
    setAnchorEll(null);
  };
  //Eof Menu State

  useEffect(() => {
    setLoading(true);
    if (location.state[0]) {
      console.log("setting master data..");
    } else {
      enqueueSnackbar("Failed to load student master data!", {
        variant: "warning",
      });
    }

    //Fetching student Fee details
    if (location.state[0]) {
      const dbSubscription = db
        .collection("STUDENTS")
        .doc(location.state[0].id)
        .collection("PAYMENTS")
        .orderBy("created_at", "desc")
        .onSnapshot((snapshot) => {
          if (snapshot.docs) {
            var feeArr: StudentFeeDetailsType[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data() as StudentFeeDetailsType;
              data["late_fee"] = calculatedLateFine(
                data.late_fee,
                data.payment_due_date
              );
              data["total_due"] =
                data.fee_total +
                data.admission_fee! +
                data.annual_fee! +
                data.computer_fee +
                data.exam_fee! +
                data.other_fee! +
                data.transportation_fee +
                data.late_fee;

              feeArr.push(data);
            });
            setFeeDetails(feeArr);
            setLoading(false);
          } else {
            setLoading(false);
            enqueueSnackbar("No fee generated for student !", {
              variant: "info",
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

        <IndividualFeeDetailsHeader studentMasterData={location.state[0]} />
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
            <Button
              variant="soft"
              color="primary"
              onClick={() => setAddArrearModalopen(true)}
            >
              Add Arrear
            </Button>

            <Button variant="soft">Add Consession</Button>
          </Box>
        </Box>

        <Box sx={{ border: "1px solid var(--bs-gray-300)", padding: "8px" }}>
          <Typography level="title-lg" m="8px" color="primary">
            Due Fee Challans
          </Typography>

          <Table
            variant="outlined"
            sx={{
              "& tr > *:last-child": {
                position: "sticky",
                right: 0,
                boxShadow: "1px 0 var(--TableCell-borderColor)",
                bgcolor: "background.surface",
              },
            }}
            stripe="even"
          >
            <thead>
              <tr style={{ backgroundColor: "red" }}>
                <th style={{ width: "10%" }}>RECIEPT ID</th>
                <th>TITLE</th>
                <th>FEE</th>
                <th>FINE</th>
                <th>TRFEE</th>
                <th>COMFEE</th>
                {FEE_HEADERS.map((item) => {
                  return <th>{item.titleShort}</th>;
                })}
                <th>TOTAL DUE</th>
                <th>STATUS</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feeDetails.map((item) => {
                return (
                  <>
                    <tr>
                      <td>{item.id}</td>
                      <td>{item.fee_title}</td>
                      <td>{item.fee_total}</td>
                      <td>{item.late_fee}</td>
                      <td>{item.transportation_fee}</td>
                      <td>{item.computer_fee}</td>
                      <td>{item.exam_fee}</td>
                      <td>{item.annual_fee}</td>
                      <td>{item.admission_fee}</td>
                      <td>{item.other_fee}</td>
                      <td>{item.total_due}</td>
                      <td>
                        <Box
                          sx={{
                            background: "var(--bs-danger2)",
                            color: "#fff",
                            textAlign: "center",
                          }}
                        >
                          Due
                        </Box>
                      </td>
                      <td>
                        <Tooltip title="More options">
                          <Button
                            variant="plain"
                            onClick={(e) => handleMenuClick(e, item)}
                          >
                            <MoreVert />
                          </Button>
                        </Tooltip>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th>Grand Total</th>
                <th></th>
                <th>{sum("fee_total").toFixed(0)}</th>
                <th>{sum("late_fee").toFixed(0)}</th>
                <th>{sum("transportation_fee").toFixed(0)}</th>
                <th>{sum("computer_fee").toFixed(0)}</th>
                <th>{sum("exam_fee").toFixed(0)}</th>
                <th>{sum("annual_fee").toFixed(0)}</th>
                <th>{sum("admission_fee").toFixed(0)}</th>
                <th>{sum("other_fee").toFixed(0)}</th>
                <th>{sum("total_due").toFixed(0)}</th>
              </tr>
            </tfoot>
          </Table>
        </Box>
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
          <MenuItem>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            Edit
          </MenuItem>
          <Divider />
          <MenuItem>
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
        />

        <AddFeeArrearModal
          open={addArrearModalOpen}
          setOpen={setAddArrearModalopen}
        />
      </LSPage>
    </PageContainer>
  );
}

export default StudentFeeDetails;
