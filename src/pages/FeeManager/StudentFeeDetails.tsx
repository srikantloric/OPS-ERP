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
import { auth, db } from "../../firebase";
import { enqueueSnackbar } from "notistack";
import {
  Box,
  Button,
  Chip,
  FormLabel,
  IconButton,
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
import { FEE_HEADERS, paymentStatus } from "../../constants/index";
import IndividualFeeDetailsHeader from "components/Headers/IndividualFeeDetailsHeader";
import { IStudentFeeChallanExtended } from "types/student";
import AddFeeConsessionModal from "components/Modals/AddFeeConsessionModal";
import { MoneyRecive } from "iconsax-react";
import { getCurrentDate } from "utilities/UtilitiesFunctions";
import firebase from "../../firebase";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { AnimatePresence, motion } from "framer-motion";
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

  const [feeCollectionDate, setFeeCollectionDate] = useState<string | null>(
    null
  );
  const [feeChallans, setFeeChallans] = useState<IStudentFeeChallanExtended[]>(
    []
  );

  const [selectedChallan, setSelectedChallan] = useState<string | null>(null);
  const [recievedAmount, setRecievedAmount] = useState<number | null>(null);

  const [selectedChallanDetails, setSelectedChallanDetails] =
    useState<IStudentFeeChallanExtended | null>(null);

  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >("CASH");

  //Part Payment
  const [showPartPaymentOption, setShowPartPaymentOption] =
    useState<boolean>(false);
  const [recievedAmountPartPayment, setRecievedAmountPartPayment] =
    useState<number>();
  const [partPaymentComment, setPartPaymentComment] = useState<string>();

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
    var tempArr: IStudentFeeChallanExtended[] = [];
    feeDetails.map((item) => {
      if (item.paymentStatus !== "PAID") {
        tempArr.push(item);
      }
    });
    setFeeChallans(tempArr);
  }, [feeDetails]);

  useEffect(() => {
    const challanFee = feeChallans
      .filter((item, index) => item.challanDocId === selectedChallan)
      .at(0);
    setRecievedAmount(challanFee?.totalDue!);
    setSelectedChallanDetails(challanFee!);
  }, [selectedChallan, feeDetails]);

  useEffect(() => {
    //Initialize fee collection Items
    setFeeCollectionDate(getCurrentDate());

    setLoading(true);
    if (location.state[0]) {
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

              const sumOfHeaders =
                data.monthlyFee +
                data.admissionFee! +
                data.annualFee! +
                data.computerFee +
                data.examFee! +
                data.otherFee! +
                data.transportationFee +
                calculatedLateFine(data.lateFine, data.paymentDueDate) -
                data.feeConsession!;

              //prepare data
              const queryResult: IStudentFeeChallanExtended = {
                docIdExt: data.docIdExt,
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
                sumOfHeaders: sumOfHeaders,
              };

              // console.log(queryResult);
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

  const handlePaymentRecieveButton = async (
    e: React.FormEvent<HTMLFormElement>,
    partialPayment: boolean
  ) => {
    e.preventDefault();

    if (selectedChallanDetails) {
      setIsPaymentLoading(true);
      const batch = db.batch();
      //Update payment Data and save to external payment collection
      const externalPaymentCollData: IStudentFeeChallanExtended = {
        paidAmount: recievedAmount!,
        totalDue: selectedChallanDetails.totalDue,
        paymentStatus: "PAID",
        paymentRecievedBy: auth.currentUser?.email || "admin",
        paymentRecievedDate: feeCollectionDate!,
        paymentId: selectedChallanDetails.paymentId,
        studentId: selectedChallanDetails.studentId,
        challanDocId: selectedChallanDetails.challanDocId,
        challanTitle: selectedChallanDetails.challanTitle,
        docIdExt: selectedChallanDetails.docIdExt,
        monthlyFee: selectedChallanDetails.monthlyFee,
        monthYear: selectedChallanDetails.monthYear,
        transportationFee: selectedChallanDetails.transportationFee,
        computerFee: selectedChallanDetails.computerFee,
        feeConsession: selectedChallanDetails.feeConsession,
        admissionFee: selectedChallanDetails.admissionFee,
        otherFee: selectedChallanDetails.otherFee,
        paymentDueDate: selectedChallanDetails.paymentDueDate,
        challanCreationDate: selectedChallanDetails.createdAt,
        challanCreatedBy: selectedChallanDetails.createdBy,
        lateFine: selectedChallanDetails.lateFine,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      //Partial payment
      const partialPaymentData = {
        paidAmount: recievedAmountPartPayment,
        totalDue: selectedChallanDetails.totalDue,
        paymentStatus: "PARTIAL",
        paymentRecievedBy: auth.currentUser?.email || "admin",
        paymentRecievedDate: feeCollectionDate!,
        paymentId: selectedChallanDetails.paymentId,
        studentId: selectedChallanDetails.studentId,
        challanDocId: selectedChallanDetails.challanDocId,
        challanTitle: selectedChallanDetails.challanTitle,
        docIdExt: selectedChallanDetails.docIdExt,
        monthlyFee: selectedChallanDetails.monthlyFee,
        monthYear: selectedChallanDetails.monthYear,
        transportationFee: selectedChallanDetails.transportationFee,
        computerFee: selectedChallanDetails.computerFee,
        feeConsession: selectedChallanDetails.feeConsession,
        admissionFee: selectedChallanDetails.admissionFee,
        otherFee: selectedChallanDetails.otherFee,
        paymentDueDate: selectedChallanDetails.paymentDueDate,
        challanCreationDate: selectedChallanDetails.createdAt,
        challanCreatedBy: selectedChallanDetails.createdBy,
        lateFine: selectedChallanDetails.lateFine,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        partialPaymentComment: partPaymentComment,
      };

      const extPaymentCollRef = db
        .collection("PAYMENTS")
        .doc(selectedChallanDetails.docIdExt);
      batch.update(extPaymentCollRef, externalPaymentCollData);

      /// Prepare data for challan change log
      const challanChangeLogRef = db
        .collection("STUDENTS")
        .doc(selectedChallanDetails.studentId)
        .collection("PAYMENTS")
        .doc(selectedChallanDetails.challanDocId)
        .collection("PAYMENT_HISTORY")
        .doc();

      // const challanLogData = {
      //   changedOn: firebase.firestore.FieldValue.serverTimestamp(),
      //   changedBy: auth.currentUser?.email || "admin",
      // };

      if (partialPayment) {
        batch.set(challanChangeLogRef, partialPaymentData);
      } else {
        batch.set(challanChangeLogRef, externalPaymentCollData);
      }

      ///Prep data for challan data update
      const challanDetailRef = db
        .collection("STUDENTS")
        .doc(selectedChallanDetails.studentId)
        .collection("PAYMENTS")
        .doc(selectedChallanDetails.challanDocId);

      const res = await challanDetailRef.get();
      let paidAmountInDb = null;
      if (res.exists) {
        if (res.data()!.paidAmount) {
          paidAmountInDb = res.data()!.paidAmount;
        } else {
          paidAmountInDb = 0;
        }
      }
      console.log("SUm of Headers", selectedChallanDetails.sumOfHeaders);
      console.log("paid amoint", paidAmountInDb + recievedAmountPartPayment);

      const challanDetailUpdateData = {
        paidAmount: recievedAmount!,
        paymentStatus: "PAID",
        paymentRecievedBy: auth.currentUser?.email || "admin",
      };

      ///calculate total due

      //partial payment
      const challanDetailUpdateDataPartialPayment = {
        paidAmount: paidAmountInDb! + recievedAmountPartPayment!,
        paymentStatus:
          selectedChallanDetails.sumOfHeaders ===
          paidAmountInDb + recievedAmountPartPayment
            ? "PAID"
            : "PARTIAL",
        paymentRecievedBy: auth.currentUser?.email || "admin",
      };

      if (partialPayment) {
        batch.update(challanDetailRef, challanDetailUpdateDataPartialPayment);
      } else {
        batch.update(challanDetailRef, challanDetailUpdateData);
      }
      // setIsPaymentLoading(false);
      batch
        .commit()
        .then(() => {
          setRecievedAmount(null);
          enqueueSnackbar("Payment recieved successfully!", {
            variant: "success",
          });
          setIsPaymentLoading(false);
        })
        .catch((e) => {
          enqueueSnackbar("Failed to recieve payment!", { variant: "error" });
          setIsPaymentLoading(false);
        });
    } else {
      enqueueSnackbar("Something went wrong with challan !", {
        variant: "error",
      });
    }
  };

  const handlePartPaymentSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (recievedAmountPartPayment) {
      if (recievedAmountPartPayment! > selectedChallanDetails?.totalDue!) {
        enqueueSnackbar("Amount is greater than due amount!", {
          variant: "error",
        });
      } else {
        if (recievedAmountPartPayment <= 0) {
          enqueueSnackbar("Your entered amount is either 0 or negative!", {
            variant: "error",
          });
        } else {
          handlePaymentRecieveButton(e, true);
        }
      }
    }
  };

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

            <Button variant="soft" startDecorator={<SettingsIcon />}></Button>
          </Box>
        </Box>

        <Box sx={{ border: "1px solid var(--bs-gray-300)", padding: "8px" }}>
          <Box
            component="form"
            sx={{
              display: "flex",
              alignItems: "bottom",
              gap: "10px",
              alignContent: "baseline",
            }}
            m="10px"
            onSubmit={(e) => handlePaymentRecieveButton(e, false)}
          >
            <FormControl required>
              <FormLabel sx={{ color: "var(--bs-light-text)", m: "4px" }}>
                Fee Collection Date
              </FormLabel>
              <Input
                type="date"
                slotProps={{
                  input: {
                    min: "2020-01-01",
                    max: "2050-01-01",
                  },
                }}
                value={feeCollectionDate!}
                disabled={false}
                onChange={(e) => setFeeCollectionDate(e.target.value)}
              />
            </FormControl>
            <FormControl required>
              <FormLabel sx={{ color: "var(--bs-light-text)", m: "4px" }}>
                Select Fee Challan
              </FormLabel>
              <Select
                placeholder="Select fee challans.."
                required
                sx={{ width: "280px" }}
                value={selectedChallan}
                onChange={(e, val) => setSelectedChallan(val)}
              >
                {feeChallans.length > 0 ? (
                  feeChallans.map((item) => {
                    return (
                      <Option value={item.challanDocId}>
                        Fee Challan ({item.challanTitle})
                      </Option>
                    );
                  })
                ) : (
                  <Option value="none" disabled>
                    None
                  </Option>
                )}
              </Select>
            </FormControl>
            <FormControl required>
              <FormLabel sx={{ color: "var(--bs-light-text)", m: "4px" }}>
                Payment Method
              </FormLabel>
              <Select
                placeholder="select payment medthod.."
                required
                value={selectedPaymentMethod}
                onChange={(e, val) => setSelectedPaymentMethod(val)}
                defaultValue="CASH"
              >
                <Option value="CASH">Cash</Option>
                <Option value="ONLINE">Online</Option>
              </Select>
            </FormControl>

            {!showPartPaymentOption ? (
              <>
                <FormControl required>
                  <FormLabel sx={{ color: "var(--bs-light-text)", m: "4px" }}>
                    Recieved Amount
                  </FormLabel>
                  <Input
                    type="number"
                    sx={{ width: "150px" }}
                    disabled={true}
                    placeholder="enter recieved amount"
                    value={recievedAmount!}
                    startDecorator={<CurrencyRupee fontSize="small" />}
                  ></Input>
                </FormControl>
                <FormControl
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    type="submit"
                    startDecorator={<MoneyRecive />}
                    loading={isPaymentLoading}
                  >
                    Recieve
                  </Button>
                </FormControl>
              </>
            ) : null}
            <FormControl sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Tooltip title="Show part payment option">
                <IconButton
                  variant="solid"
                  color="primary"
                  onClick={() =>
                    setShowPartPaymentOption(!showPartPaymentOption)
                  }
                >
                  {showPartPaymentOption ? (
                    <ArrowDropUpIcon />
                  ) : (
                    <ArrowDropDownIcon />
                  )}
                </IconButton>
              </Tooltip>
            </FormControl>
          </Box>
          <br />
          <AnimatePresence>
            {showPartPaymentOption && selectedChallanDetails ? (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.2 }}
              >
                <Chip sx={{ p: "5px", ml: "5px", pl: "10px", pr: "10px" }}>
                  You have select{" "}
                  <span style={{ color: "var(--bs-danger2)", margin: "5px" }}>
                    Challan ID: {selectedChallanDetails?.paymentId}
                  </span>
                  for month of
                  <span style={{ color: "var(--bs-danger2)", margin: "5px" }}>
                    {selectedChallanDetails?.challanTitle}
                  </span>
                  , student total due is
                  <span style={{ color: "var(--bs-danger2)", margin: "5px" }}>
                    ₹{selectedChallanDetails?.totalDue}
                  </span>
                  . Please enter the desired amount below and click pay.
                </Chip>
                <Box
                  component="form"
                  onSubmit={handlePartPaymentSubmit}
                  sx={{ m: "10px", display: "flex", gap: "8px" }}
                >
                  <FormControl>
                    <FormLabel
                      required
                      sx={{ color: "var(--bs-light-text)", m: "4px" }}
                    >
                      Enter recieved amount.
                    </FormLabel>
                    <Input
                      variant="outlined"
                      color="primary"
                      type="number"
                      required
                      placeholder="enter amount"
                      value={recievedAmountPartPayment}
                      onChange={(e) =>
                        setRecievedAmountPartPayment(parseInt(e.target.value))
                      }
                    ></Input>
                  </FormControl>
                  <FormControl>
                    <FormLabel
                      required
                      sx={{ color: "var(--bs-light-text)", m: "4px" }}
                    >
                      Comment for part payment
                    </FormLabel>
                    <Input
                      required
                      type="text"
                      color="primary"
                      sx={{ width: "350px" }}
                      placeholder=""
                      value={partPaymentComment}
                      onChange={(e) => setPartPaymentComment(e.target.value)}
                    ></Input>
                  </FormControl>
                  <FormControl
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "end",
                    }}
                  >
                    <Button
                      type="submit"
                      startDecorator={<MoneyRecive />}
                      loading={isPaymentLoading}
                    >
                      Recieve
                    </Button>
                  </FormControl>
                </Box>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <Divider sx={{ mt: "16px", mb: "10px" }} />
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
              {feeDetails.length != 0 ? (
                feeDetails.map((item) => {
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
                              background:
                                item.paymentStatus === paymentStatus.PAID
                                  ? "var(--bs-success)"
                                  : "var(--bs-danger)",
                              color: "#fff",
                              textAlign: "center",
                            }}
                          >
                            {item.paymentStatus}
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
                })
              ) : (
                <tr>
                  <th colSpan={14}>
                    <Typography
                      level="title-md"
                      sx={{ textAlign: "center", margin: "10px" }}
                    >
                      No Challan Found for this user
                    </Typography>
                  </th>
                </tr>
              )}
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
