import { useEffect, useState } from "react";
import PageContainer from "../../components/Utils/PageContainer";
import LSPage from "../../components/Utils/LSPage";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PrintIcon from "@mui/icons-material/Print";

import {
  Divider,
  FormControl,
  LinearProgress,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { CurrencyRupee, Delete, Edit, MoreVert } from "@mui/icons-material";
import PaymentIcon from "@mui/icons-material/Payment";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { enqueueSnackbar } from "notistack";
import {
  Box,
  Button,
  FormLabel,
  Input,
  Option,
  Select,
  Table,
  Tooltip,
  Typography,
} from "@mui/joy";
import BreadCrumbsV3 from "components/Breadcrumbs/BreadCrumbsV3";
import Navbar from "components/Navbar/Navbar";
import AddFeeArrearModal from "components/Modals/AddFeeArrearModal";
import { FEE_HEADERS } from "../../constants/index";
import IndividualFeeDetailsHeader from "components/Headers/IndividualFeeDetailsHeader";
import { IStudentFeeChallan } from "types/student";
import AddFeeConsessionModal from "components/Modals/AddFeeConsessionModal";
import { MoneyRecive } from "iconsax-react";

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

interface IStudentFeeChallanExtended extends IStudentFeeChallan {
  admissionFee?: number;
  examFee?: number;
  annualFee?: number;
  otherFee?: number;
  totalDue?: number;
  feeConsession?: number;
  paidAmount?: number;
}

interface ITotalFeeHeader {
  totalFeeConsession: number;
  totalPaidAmount: number;
  totalDueAmount: number;
}

function StudentFeeDetails() {
  const [feeDetails, setFeeDetails] = useState<IStudentFeeChallanExtended[]>(
    []
  );
  const [selectedRow, setSelectedRow] =
    useState<IStudentFeeChallanExtended | null>(null);

  const [loading, setLoading] = useState(false);
  const historyRef = useNavigate();
  const location = useLocation();

  //Add Fee Consession Modal
  const [addFeeConsessionModalOpen, setAddFeeConsessionModalOpen] =
    useState<boolean>(false);

  /// Menu State
  const [anchorEll, setAnchorEll] = useState<HTMLAnchorElement | null>(null);
  const menuOpen = Boolean(anchorEll);

  //Add Fee Arrear Modal
  const [addArrearModalOpen, setAddArrearModalopen] = useState(false);
  const [totalFeeHeaderData, setTotalFeeHeaderData] = useState<ITotalFeeHeader>(
    {
      totalDueAmount: 0,
      totalFeeConsession: 0,
      totalPaidAmount: 0,
    }
  );

  // Calculate total feeConsession and totalPaidAmount
  const calculateTotals = () => {
    let totalConsession = 0;
    let totalPaid = 0;
    let totalDueAmount = 0;

    feeDetails.forEach((row) => {
      totalConsession += row.feeConsession || 0;
      totalPaid += row.paidAmount || 0;
      totalDueAmount += row.totalDue || 0;
    });

    setTotalFeeHeaderData({
      totalFeeConsession: totalConsession,
      totalPaidAmount: totalPaid,
      totalDueAmount: totalDueAmount,
    });
  };

  useEffect(() => {
    calculateTotals();
  }, [feeDetails]);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    rowData: IStudentFeeChallanExtended
  ) => {
    setAnchorEll(event.target as HTMLAnchorElement);
    setSelectedRow(rowData);
  };

  function sum(
    column:
      | "monthlyFee"
      | "transportationFee"
      | "computerFee"
      | "examFee"
      | "admissionFee"
      | "otherFee"
      | "annualFee"
      | "totalDue"
      | "lateFine"
      | "feeConsession"
      | "paidAmount"
  ) {
    return feeDetails.reduce((acc, row) => acc + row[column]!, 0);
  }

  const calculatedLateFine = (lateFee: number, dueDate: string): number => {
    const dueDateFormated = new Date(dueDate);
    const currentDate = new Date();
    let lateFine = 0;
    if (currentDate >= dueDateFormated) {
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
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
          if (snapshot.docs) {
            var feeArr: IStudentFeeChallanExtended[] = [];
            snapshot.forEach((doc) => {
              const data = doc.data() as IStudentFeeChallanExtended;

              if (data.admissionFee == undefined) {
                data["admissionFee"] = 0;
              }
              if (data.examFee == undefined) {
                data["examFee"] = 0;
              }
              if (data.annualFee == undefined) {
                data["annualFee"] = 0;
              }
              if (data.monthlyFee == undefined) {
                data["monthlyFee"] = 0;
              }
              if (data.computerFee == undefined) {
                data["computerFee"] = 0;
              }
              if (data.transportationFee == undefined) {
                data["transportationFee"] = 0;
              }
              if (data.otherFee == undefined) {
                data["otherFee"] = 0;
              }
              if (data.feeConsession == undefined) {
                data["feeConsession"] = 0;
              }
              if (data.paidAmount == undefined) {
                data["paidAmount"] = 0;
              }

              const totalCalculatedDue =
                data.monthlyFee +
                data.admissionFee! +
                data.annualFee! +
                data.computerFee +
                data.examFee! +
                data.otherFee! +
                data.transportationFee +
                calculatedLateFine(data.lateFine, data.paymentDueDate) -
                data.feeConsession! -
                data.paidAmount;

              //prepare data
              const queryResult: IStudentFeeChallanExtended = {
                docId: data.docId,
                studentId: data.studentId,
                challanDocId: data.challanDocId,
                createdAt: data.createdAt,
                createdBy: data.createdBy,
                paymentId: data.paymentId,
                challanTitle: data.challanTitle,
                monthYear: data.monthYear,
                paymentStatus: data.paymentStatus,
                paymentDueDate: data.paymentDueDate,
                monthlyFee: data.monthlyFee,
                lateFine: calculatedLateFine(
                  data.lateFine,
                  data.paymentDueDate
                ),
                transportationFee: data.transportationFee,
                computerFee: data.computerFee,
                admissionFee: data.admissionFee,
                examFee: data.examFee,
                annualFee: data.annualFee,
                otherFee: data.otherFee,
                paidAmount: data.paidAmount,

                totalDue: totalCalculatedDue,

                feeConsession: data.feeConsession,
              };

              console.log(queryResult);
              feeArr.push(queryResult);
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

        <IndividualFeeDetailsHeader
          studentMasterData={location.state[0]}
          totalFeeHeaderData={totalFeeHeaderData}
        />
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
          <Box component="form" sx={{display:"flex",alignItems:"bottom",gap:"10px",alignContent:"baseline"}} m="10px">
            <FormControl>
              <FormLabel sx={{color:"var(--bs-light-text)",m:"4px"}}>Fee Collection Date</FormLabel>
              <Input type="date" />
            </FormControl>
            <FormControl>
              <FormLabel sx={{color:"var(--bs-light-text)",m:"4px"}}>Select Fee Challan</FormLabel>
              <Select placeholder="fee challans.." required  sx={{width:"300px"}}>
                <Option value="CHALLAN444">Fee Challan (December-2022)</Option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel sx={{color:"var(--bs-light-text)",m:"4px"}}>Payment Method</FormLabel>
              <Select placeholder="payment methods.." required>
                <Option value="CASH">Recieved Cash</Option>
                <Option value="ONLINE">Recived Online</Option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel sx={{color:"var(--bs-light-text)",m:"4px"}}>Recived Amount</FormLabel>
              <Input type="number" placeholder="amount" startDecorator={<CurrencyRupee fontSize="small"/>}></Input>
            </FormControl>
            <FormControl sx={{display:"flex",justifyContent:"flex-end"}}>
              <Button type="submit" startDecorator={<MoneyRecive/>}>Recieve</Button>
            </FormControl>
          </Box>

            <Divider sx={{mt:"12px",mb:"12px"}}/>
          <Typography level="title-lg" mt="8px" ml="8px" color="primary">
            Fee Challans
          </Typography>
          <Typography level="body-sm" ml="8px" mb="8px">
            Student fee records starting from admission.
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
              "& th > *:last-child": {
                position: "sticky",
                right: 0,
                boxShadow: "1px 0 var(--TableCell-borderColor)",
                bgcolor: "background.surface",
              },
            }}
            borderAxis="both"
          >
            <thead>
              <tr>
                {/* <th style={{ width: "10%",backgroundColor:"var(--bs-primary-text)",color:"#fff" }}>RECIEPT ID</th> */}
                <th
                  style={{
                    width: "12%",
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  TITLE
                </th>
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  FEE
                </th>
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  FINE
                </th>
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  TRFEE
                </th>
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  COMFEE
                </th>
                {FEE_HEADERS.map((item) => {
                  return (
                    <th
                      style={{
                        backgroundColor: "var(--bs-primary-text)",
                        color: "#fff",
                      }}
                    >
                      {item.titleShort}
                    </th>
                  );
                })}

                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  PAID
                </th>
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  CONC.
                </th>
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  DUE
                </th>
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  STATUS
                </th>
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {feeDetails.map((item) => {
                return (
                  <>
                    <tr>
                      {/* <td>{item.paymentId}</td> */}
                      <td>{item.challanTitle}</td>
                      <td>{item.monthlyFee}</td>
                      <td>{item.lateFine}</td>
                      <td>{item.transportationFee}</td>
                      <td>{item.computerFee}</td>
                      <td>{item.examFee}</td>
                      <td>{item.annualFee}</td>
                      <td>{item.admissionFee}</td>
                      <td>{item.otherFee}</td>
                      <td>{item.paidAmount}</td>
                      <td>{item.feeConsession}</td>
                      <td>{item.totalDue}</td>
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
              <tr className="studentFeeDetailsTableFooter">
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  Grand Total
                </th>
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  {sum("monthlyFee").toFixed(0)}
                </th>
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  {sum("lateFine").toFixed(0)}
                </th>
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  {sum("transportationFee").toFixed(0)}
                </th>
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  {sum("computerFee").toFixed(0)}
                </th>
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  {sum("examFee").toFixed(0)}
                </th>
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  {sum("annualFee").toFixed(0)}
                </th>
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  {sum("admissionFee").toFixed(0)}
                </th>
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  {sum("otherFee").toFixed(0)}
                </th>
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  {sum("paidAmount").toFixed(0)}
                </th>
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  {sum("feeConsession").toFixed(0)}
                </th>
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                >
                  {sum("totalDue").toFixed(0)}
                </th>
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                ></th>
                <th
                  style={{
                    backgroundColor: "var(--bs-primary-text)",
                    color: "#fff",
                  }}
                ></th>
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
          <MenuItem>
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
          <MenuItem onClick={() => setAddFeeConsessionModalOpen(true)}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            Add Consession
          </MenuItem>
          <Divider />
          <MenuItem>
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            Delete
          </MenuItem>
        </Menu>

        {/* <QuickPaymentModal
          selectedRowData={selectedRow}
          userPaymentData={location.state[0]}
          modelOpen={modelOpen}
          setModelOpen={setModelOpen}
          paymentRemarks={paymentRemarks}
          setPaymentRemarks={setPaymentRemarks}
        /> */}

        <AddFeeConsessionModal
          open={addFeeConsessionModalOpen}
          setOpen={setAddFeeConsessionModalOpen}
          challanData={selectedRow!}
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
