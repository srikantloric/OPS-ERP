import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
} from "@mui/joy";
import { Warning2 } from "iconsax-react";
import { useState } from "react";
import LockIcon from "@mui/icons-material/Lock";
import { enqueueSnackbar } from "notistack";
import { db } from "../../firebase";
interface Props {
  open: boolean;
  setOpen: (props: boolean) => void;
  studentId: string;
  challanId: string;
}

const DeleteChallanConfirmationDialog: React.FC<Props> = ({
  open,
  setOpen,
  studentId,
  challanId,
}) => {
  const [accessKeyInput, setAccessKeyInput] = useState<string>("");
  const [accessKeyError, setAccessKeyError] = useState<string>("");

  const handleConfirmButton = () => {
    if (accessKeyInput === "123456") {
      if (studentId && challanId) {
        db.collection("STUDENTS")
          .doc(studentId)
          .collection("CHALLANS")
          .doc(challanId)
          .delete()
          .then(() => {
            enqueueSnackbar("Challan deleted successfully !", {
              variant: "success",
            });
            setOpen(false)
          })
          .catch(() => {
            enqueueSnackbar("Unable to delete from server!", {
              variant: "error",
            });
          });
      } else {
        enqueueSnackbar("Unable to delete please try refreshing !", {
          variant: "error",
        });
      }
    } else {
      setAccessKeyError("Access Key is incorrect !");
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>
          <Warning2 />
          Information
        </DialogTitle>
        <Divider />
        <DialogContent>
          Warning! it seems you are going to do ciritical change, are you sure ?
          <FormControl sx={{ mt: "1rem", mb: "1rem" }}>
            <FormLabel>Enter Change Key</FormLabel>
            <Input
              placeholder="enter change key"
              value={accessKeyInput}
              onChange={(e) => setAccessKeyInput(e.target.value)}
            ></Input>
            <FormHelperText>
              Key will be required to change these values, please contact admin.
            </FormHelperText>
            {accessKeyError === "" ? null : (
              <Alert
                variant="soft"
                color="danger"
                sx={{ mt: "1rem" }}
                startDecorator={<LockIcon />}
              >
                {accessKeyError}
              </Alert>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="solid" color="danger" onClick={handleConfirmButton}>
            Agree
          </Button>
          <Button
            variant="plain"
            color="neutral"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};

export default DeleteChallanConfirmationDialog;