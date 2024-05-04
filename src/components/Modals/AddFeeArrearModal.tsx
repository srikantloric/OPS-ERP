import { Box, Button, Checkbox, Modal, ModalClose, Option, Select, Sheet, Stack, Typography } from "@mui/joy";
import { FEE_HEADERS } from "../../constants/index";
import { Additem } from "iconsax-react";

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
}

const AddFeeArrearModal: React.FC<Props> = ({ open, setOpen }) => {


  const handleFormSubmit = (e:React.FormEvent<HTMLFormElement>) =>{
      e.preventDefault();
  }

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
          Using this functionality you can create instant Arrear for student.
        </Typography>
        <Box mt="6px" component="form" onSubmit={handleFormSubmit}>

          <Select placeholder="Select Fee Header.." required>
            {FEE_HEADERS.map((item) => {
              return <Option value={item.value}>{item.title}</Option>;
            })}
          </Select>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center" mt="16px">
          <Checkbox  label="Mark as paid" size="sm" />
            <Button type="submit">Create</Button>            
          </Stack>

        </Box>
      </Sheet>
    </Modal>
  );
};

export default AddFeeArrearModal;
