import { Modal, ModalClose, Sheet, Typography } from "@mui/joy"

interface Props {
    open: boolean;
    setOpen: (val:boolean)=>void;
  }

const AddFeeArrearModal:React.FC<Props>=({open,setOpen}) =>{

  return (
    <Modal
    aria-labelledby="modal-title"
    aria-describedby="modal-desc"
    open={open}
    onClose={() => setOpen(false)}
    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
  >
    <Sheet
      variant="outlined"
      sx={{
        width:500,
        borderRadius: 'md',
        p: 3,
        boxShadow: 'lg',
      }}
    >
      <ModalClose variant="plain" sx={{ m: 1 }}  />
      <Typography
        component="h2"
        id="modal-title"
        level="h4"
        textColor="inherit"
        fontWeight="lg"
        mb={1}
      >
        Create Fee Arrear
      </Typography>
      <Typography id="modal-desc" textColor="text.tertiary">
       

    
      </Typography>
    </Sheet>
  </Modal>
  )
}

export default AddFeeArrearModal