import { Modal, ModalClose, Sheet, Typography } from "@mui/joy";
import { useSearchDialog } from "../../context/SearchDialogContext";

const SearchDialog: React.FC = () => {
  const { isOpen, closeDialog } = useSearchDialog();

  if (!isOpen) return null;

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={isOpen}
      onClose={() => closeDialog()}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "& .MuiModal-backdrop": {
          backdropFilter: "blur(3px)", // Adjust the blur value here
        },
      }}
    >
      <Sheet
        variant="outlined"
        sx={{
          maxWidth: 500,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
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
        >
          This is the modal title
        </Typography>
        <Typography id="modal-desc" textColor="text.tertiary">
          Make sure to use <code>aria-labelledby</code> on the modal dialog with
          an optional <code>aria-describedby</code> attribute.
        </Typography>
      </Sheet>
    </Modal>
  );
};

export default SearchDialog;
