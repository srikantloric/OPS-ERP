import {
  Alert,
  Box,
  Button,
  Grid,
  Input,
  Modal,
  ModalClose,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { FEE_HEADERS } from "../../constants/index";
import { Additem } from "iconsax-react";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { enqueueSnackbar } from "notistack";

interface IAddArrearInputTypes {
  examFee: number;
  annualFee: number;
  admissionFee: number;
  otherFee: number;
}
interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  challanDocId: string;
  studentId: string;
  challanData: IAddArrearInputTypes;
  paymentStatus: string;
}

interface IAddArrearInputTypes extends Record<string, number> {}

const AddFeeArrearModal: React.FC<Props> = ({
  open,
  setOpen,
  challanData,
  studentId,
  challanDocId,
  paymentStatus,
}) => {
  const [feeHeaderData, setFeeHeaderData] = useState<IAddArrearInputTypes>({
    examFee: 0,
    annualFee: 0,
    admissionFee: 0,
    otherFee: 0,
  });
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    setFeeHeaderData(challanData);
  }, [challanData]);

  useEffect(() => {
    const total =
      feeHeaderData.admissionFee +
      feeHeaderData.annualFee +
      feeHeaderData.examFee +
      feeHeaderData.otherFee;
    setTotalAmount(total);
  }, [feeHeaderData]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
   
    let pStatus = "";

    switch (paymentStatus) {
      case "PAID":
      case "PARTIAL":
        pStatus = "PARTIAL";
        break;
      case "UNPAID":
        pStatus = "UNPAID";
        break;
      default:
        pStatus = ""; 
    }

    const finalUpdateData = {
      ...feeHeaderData,
      paymentStatus: pStatus,
    };

    db.collection("STUDENTS")
      .doc(studentId)
      .collection("PAYMENTS")
      .doc(challanDocId)
      .update(finalUpdateData)
      .then(() => {
        setOpen(false)
        enqueueSnackbar("Header Added Successfully !", { variant: "success" });
      })
      .catch((e) => {
        enqueueSnackbar("Failed to update fee details!" + e, {
          variant: "error",
        });
      });
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
          Create Fee Arrear
        </Typography>
        <Typography id="modal-desc" textColor="text.tertiary">
          Using this functionality you can add fee arrear for student.
        </Typography>
        <Box mt="6px" component="form" onSubmit={handleFormSubmit}>
          <Grid container gap="0.5rem" mt="1rem" justifyContent="space-between">
            {FEE_HEADERS.map((item) => {
              return (
                <>
                  <Grid xs={5}>
                    <Typography>{item.title}</Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Input
                      value={feeHeaderData[item.field]}
                      onChange={(e) =>
                        setFeeHeaderData((prev) => ({
                          ...prev,
                          [item.field]: parseInt(e.target.value) || 0,
                        }))
                      }
                      defaultValue={0}
                      startDecorator={"Rs."}
                    />
                  </Grid>
                </>
              );
            })}
          </Grid>
          <Alert sx={{ mt: "1rem" }} color="danger">
            Total amount of Rs.{totalAmount} will be added to existing challan.
          </Alert>

          <Stack
            direction="row"
            justifyContent="end"
            alignItems="center"
            mt="16px"
          >
            <Button type="submit">Add Fee Arrear</Button>
          </Stack>
        </Box>
      </Sheet>
    </Modal>
  );
};

export default AddFeeArrearModal;
