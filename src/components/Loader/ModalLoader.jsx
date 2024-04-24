import { CircularProgress, Modal, ModalDialog, Typography } from '@mui/joy'
import React from 'react'

function ModalLoader({loading}) {
  return (
    <Modal open={loading}>
            <ModalDialog>
              <div
                style={{
                  display: "flex",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <CircularProgress sx={{ mr: "14px" }} />
                <Typography sx={{ display: "flex", alignItems: "center" }}>
                  Loading...
                </Typography>
              </div>
            </ModalDialog>
          </Modal>
  )
}

export default ModalLoader