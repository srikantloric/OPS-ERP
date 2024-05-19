import {
  Alert,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Modal,
  ModalClose,
  Option,
  Select,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { FEE_HEADERS, paymentStatus } from "../../constants/index";
import { Additem } from "iconsax-react";
import { useEffect, useState } from "react";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { SCHOOL_FEE_MONTHS, SCHOOL_FEE_YEAR } from "config/schoolConfig";
import {
  generateAlphanumericUUID,
  generateChallanDocId,
  getChallanTitle,
} from "utilities/UtilitiesFunctions";
import { IStudentFeeChallanExtended, StudentDetailsType } from "types/student";
import { enqueueSnackbar } from "notistack";
import firebase, { db } from "../../firebase";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  studentMasterData: StudentDetailsType;
}

interface IInstantPaymentDetailsType {
  monthlyFee: number;
  computerFee: number;
  transportationFee: number;
  annualFee: number;
  admissionFee: number;
  otherFee: number;
  examFee: number;
  lateFine: number;
  feeConsession: number;
  fee_discount: number;
}

interface IInstantPaymentDetailsType extends Record<string, number> {}

const InstantPaymentModal: React.FC<Props> = ({
  open,
  setOpen,
  studentMasterData,
}) => {
  const [showMoreHeader, setShowMoreHeaders] = useState<boolean>(false);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear().toString();

  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);

  const [isMarkedAsPaid, setIsMarkedAsPaid] = useState<boolean>(true);

  const [totalFee, setTotalFee] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [feeDetail, setFeeDetails] = useState<IInstantPaymentDetailsType>({
    monthlyFee: 0,
    computerFee: 0,
    transportationFee: 0,
    annualFee: 0,
    admissionFee: 0,
    otherFee: 0,
    examFee: 0,
    lateFine: 0,
    feeConsession: 0,
    fee_discount: 0,
  });

  useEffect(() => {
    if (studentMasterData) {
      const feeInitialData: IInstantPaymentDetailsType = {
        monthlyFee: studentMasterData.monthly_fee!,
        computerFee: studentMasterData.computer_fee!,
        transportationFee: studentMasterData.transportation_fee!,
        annualFee: 0,
        admissionFee: 0,
        otherFee: 0,
        examFee: 0,
        lateFine: 0,
        feeConsession: 0,
        fee_discount: studentMasterData.fee_discount!,
      };
      setFeeDetails(feeInitialData);
    }
  }, []);

  useEffect(() => {
    var totalFee =
      feeDetail.monthlyFee +
      feeDetail.computerFee +
      feeDetail.transportationFee +
      feeDetail.admissionFee +
      feeDetail.examFee +
      feeDetail.annualFee +
      feeDetail.otherFee +
      feeDetail.lateFine -
      feeDetail.feeConsession;

    setTotalFee(totalFee);
  }, [feeDetail]);

  const generateFeeChallan = () => {
    if (studentMasterData) {
      const challanString = generateChallanDocId(selectedMonth, selectedYear);

      var isAlreadyGenerated: boolean = false;

      if (studentMasterData.generatedChallans) {
        isAlreadyGenerated =
          studentMasterData.generatedChallans.includes(challanString);
      }

      const challanId = Math.floor(100000 + Math.random() * 900000).toString();

      if (!isAlreadyGenerated) {
        setLoading(true);
        const extPaymentCollDOcId = generateAlphanumericUUID(30);
        const paymentCollData: IStudentFeeChallanExtended = {
          docIdExt: extPaymentCollDOcId,
          studentId: studentMasterData.id,
          challanDocId: challanString,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          createdBy: "Admin",
          paymentId: challanId,
          challanTitle: getChallanTitle(selectedMonth!, selectedYear!),
          paymentStatus: isMarkedAsPaid
            ? paymentStatus.PAID
            : paymentStatus.DEFAULT,
          paymentDueDate: "9999/12/31",
          monthlyFee: feeDetail.monthlyFee,
          computerFee: feeDetail.computerFee,
          transportationFee: feeDetail.transportationFee,
          lateFine: feeDetail.lateFine,
          paidAmount: isMarkedAsPaid ? totalFee : 0,
        };

        if (feeDetail.admissionFee) {
          paymentCollData["admissionFee"] = feeDetail.admissionFee;
        }
        if (feeDetail.annualFee) {
          paymentCollData["annualFee"] = feeDetail.annualFee;
        }
        if (feeDetail.examFee) {
          paymentCollData["examFee"] = feeDetail.examFee;
        }
        if (feeDetail.otherFee) {
          paymentCollData["otherFee"] = feeDetail.otherFee;
        }

        //save data to db
        var batch = db.batch();

        var studentPaymentRef = db
          .collection("STUDENTS")
          .doc(studentMasterData.id)
          .collection("PAYMENTS")
          .doc(challanString);

        var extPaymentCollRef = db
          .collection("PAYMENTS")
          .doc(extPaymentCollDOcId);

        var studentDocRef = db.collection("STUDENTS").doc(studentMasterData.id);

        ///updating generatedChallans field
        if (studentMasterData.generatedChallans) {
          var arrT = studentMasterData.generatedChallans;
          arrT.push(challanString);
          // Update the document by appending the feeChallanCode string to the generatedChallans array
          batch.update(studentDocRef, {
            generatedChallans: arrT,
          });
        } else {
          var arrTem: string[] = [];
          arrTem.push(challanString);
          batch.update(studentDocRef, {
            generatedChallans: arrTem,
          });
        }

        if (feeDetail.feeConsession) {
          var feeConsessionLogRef = db
            .collection("STUDENTS")
            .doc(studentMasterData.id)
            .collection("CONSESSION_LOG")
            .doc();
          //preparing data for consession log
          const consesionLogData = {
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            createdBy: "admin",
            challanId: challanString,
            paymentId: challanId,
            consessionAmount: feeDetail.feeConsession,
            dueAmountBeforeConsession: 0,
            consessionNarration: "Not Available",
            consessionAuthPerson: "Instant Pay",
          };
          batch.set(feeConsessionLogRef, consesionLogData);
        }

        batch.set(studentPaymentRef, paymentCollData);
        batch.set(extPaymentCollRef, paymentCollData);

        batch
          .commit()
          .then(() => {
            setOpen(false);
            setLoading(false);
            enqueueSnackbar("Payment Recieved Successfully :)", {
              variant: "success",
            });
          })
          .catch((e) => {
            setLoading(false);
            enqueueSnackbar("Something went wrong!" + e, { variant: "error" });
          });
      } else {
        setLoading(false);
        enqueueSnackbar("Fee Challan Already Exist for this Month & Year .", {
          variant: "error",
        });
      }
    } else {
      enqueueSnackbar("Unable to fetch student details!", { variant: "error" });
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    generateFeeChallan();
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={() => setOpen(false)}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Sheet
        variant="outlined"
        sx={{
          width: 500,
          borderRadius: "md",
          p: 3,
          boxShadow: "sm",
        }}
      >
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <Typography
          component="h2"
          id="modal-title"
          level="h4"
          textColor="inherit"
          fontWeight="lg"
          mb={1}
          sx={{ display: "flex", alignItems: "center", gap: "5px" }}
        >
          <Additem size="20" />
          Instant Fee Payment
        </Typography>
        <Typography level="body-sm" textColor="text.tertiary">
          Using this functionality you can create instant fee and directly pay.
        </Typography>
        <Box component="form" onSubmit={handleFormSubmit} mt="1rem">
          <Grid container mb="1rem" justifyContent="space-between">
            <Grid xs={6}>
              <FormControl>
                <FormLabel>Fee Month</FormLabel>
                <Select
                  defaultValue={selectedMonth && selectedMonth}
                  onChange={(e, val) => setSelectedMonth(val!)}
                >
                  {SCHOOL_FEE_MONTHS.map((item) => (
                    <Option value={item.value} key={item.title}>
                      {item.value === currentMonth
                        ? item.title + " (Current Month)"
                        : item.title}
                    </Option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={5}>
              <FormControl>
                <FormLabel>Fee Year</FormLabel>
                <Select
                  defaultValue={selectedYear}
                  onChange={(e, val) => setSelectedYear(val!)}
                >
                  {SCHOOL_FEE_YEAR.map((item) => (
                    <Option value={item.value} key={item.title}>
                      {item.value === currentYear
                        ? item.title + " (Current Year)"
                        : item.title}
                    </Option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Divider />

          <Grid container gap="0.5rem" justifyContent="space-between" mt="1rem">
            <Grid xs={5}>
              <Typography>Monthy Fee</Typography>
            </Grid>
            <Grid xs={5}>
              <Typography>Rs. {feeDetail && feeDetail.monthlyFee}</Typography>
            </Grid>
            {studentMasterData.fee_discount ? (
              <>
                <Grid xs={5}>
                  <Typography>Fee Discount</Typography>
                </Grid>
                <Grid xs={5}>
                  <Typography>
                    Rs. {feeDetail && feeDetail.fee_discount}
                  </Typography>
                </Grid>
              </>
            ) : null}

            <Grid xs={5}>
              <Typography>Computer Fee</Typography>
            </Grid>
            <Grid xs={5}>Rs. {feeDetail && feeDetail.computerFee}</Grid>
            <Grid xs={5}>
              <Typography>Transport Fee</Typography>
            </Grid>
            <Grid xs={5}>Rs. {feeDetail && feeDetail.transportationFee}</Grid>

            <Grid xs={12}>
              <Button
                startDecorator={<ArrowDropDownIcon />}
                onClick={() => setShowMoreHeaders(!showMoreHeader)}
                variant="plain"
              >
                Show more headers
              </Button>
            </Grid>
            {showMoreHeader
              ? FEE_HEADERS.map((item) => {
                  return (
                    <>
                      <Grid xs={5}>
                        <Typography>{item.title}</Typography>
                      </Grid>
                      <Grid xs={5}>
                        <Input
                          name={item.field}
                          value={feeDetail[item.field]}
                          onChange={(e) =>
                            setFeeDetails((prev) => ({
                              ...prev,
                              [item.field]: parseInt(e.target.value) || 0,
                            }))
                          }
                          defaultValue={0}
                          startDecorator={"₹"}
                        />
                      </Grid>
                    </>
                  );
                })
              : null}
          </Grid>
          <Grid container justifyContent={"space-between"}>
            <Grid xs={5.8}>
              <FormControl>
                <FormLabel>Late Fee</FormLabel>
                <Input
                  value={feeDetail.lateFine}
                  onChange={(e) =>
                    setFeeDetails((prev) => ({
                      ...prev,
                      lateFine: parseInt(e.target.value) || 0,
                    }))
                  }
                  startDecorator={"₹"}
                />
              </FormControl>
            </Grid>
            <Grid xs={5.8}>
              <FormControl>
                <FormLabel>Consession</FormLabel>
                <Input
                  value={feeDetail.feeConsession}
                  onChange={(e) =>
                    setFeeDetails((prev) => ({
                      ...prev,
                      feeConsession: parseInt(e.target.value) || 0,
                    }))
                  }
                  startDecorator={"₹"}
                />
              </FormControl>
            </Grid>
            <Grid xs={12} md={12} mt="0.5rem">
              <Alert variant="soft" color="success">
                Total Fee Amount : {totalFee}
              </Alert>
            </Grid>
          </Grid>
          <Stack
            direction="row"
            justifyContent="end"
            alignItems="center"
            mt="16px"
            gap="1rem"
          >
            <Checkbox
              label="Mark as paid"
              size="sm"
              checked={isMarkedAsPaid}
              onChange={(e) => setIsMarkedAsPaid(e.target.checked)}
            />
            <Button type="submit" loading={loading}>
              {isMarkedAsPaid ? "Collect Payment" : "Create Challan"}
            </Button>
          </Stack>
        </Box>
      </Sheet>
    </Modal>
  );
};

export default InstantPaymentModal;
