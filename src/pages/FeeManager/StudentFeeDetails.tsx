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
import { Box, Button, Table, Tooltip } from "@mui/joy";
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

//main element
function StudentFeeDetails() {
  //StudentMasterData State

  const [modelOpen, setModelOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<StudentFeeDetailsType | null>(
    null
  );
  const [feeDetails, setFeeDetails] = useState<StudentFeeDetailsType[]>([]);
  const [loading, setLoading] = useState(false);
  const [paymentRemarks, setPaymentRemarks] = useState("");
  const historyRef = useNavigate();
  const location = useLocation();

  ///Sof Menu State
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

  // useEffect(() => {
  //   if (selectedRow) {
  //     setPaymentRemarks(selectedRow.payment_remarks);
  //   }
  // }, [selectedRow]);

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
        .onSnapshot((snapshot) => {
          if (snapshot.docs) {
            var feeArr: StudentFeeDetailsType[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data() as StudentFeeDetailsType;
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

        <Box>
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
                <th>RECIEPT ID</th>
                <th>TITLE</th>
                <th>FINE</th>
                <th>TRFEE</th>
                <th>COMFEE</th>
                {FEE_HEADERS.map((item) => {
                  return <th>{item.titleShort}</th>;
                })}
                <th>TOTAL</th>
                <th>REC.</th>
                <th>CONC.</th>
                <th>BAL.</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feeDetails.map((item) => {
                return (
                  <>
                    <tr>
                      <td>{item.id}</td>
                      <td>159</td>
                      <td>24</td>
                      <td>24</td>
                      <td>24</td>
                      <td>24</td>
                      <td>24</td>
                      <td>24</td>
                      <td>24</td>
                      <td>24</td>
                      <td>24</td>
                      <td>6</td>
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
