import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  Box,
  Button,
  Chip,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Input,
  Modal,
  ModalDialog,
  Option,
  Select,
  Sheet,
  Stack,
  Typography,
} from "@mui/joy";
import { Paper } from "@mui/material";
import { IconBrandTinder } from "@tabler/icons-react";
import BreadCrumbsV2 from "components/Breadcrumbs/BreadCrumbsV2";
import Navbar from "components/Navbar/Navbar";
import LSPage from "components/Utils/LSPage";
import PageContainer from "components/Utils/PageContainer";
import { SCHOOL_CLASSES } from "config/schoolConfig";
import { Delete, Search } from "@mui/icons-material";
import { useState } from "react";

function UpdateResults() {
  const [updateResultDialogOpen, setUpdateResultDialogOpen] =
    useState<boolean>(true);

  return (
    <PageContainer>
      <Navbar />
      <LSPage>
        <BreadCrumbsV2
          Icon={IconBrandTinder}
          Path="School Results/Update Results"
        />
        <Paper sx={{ p: "10px", mt: "8px" }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Typography level="title-md">Search Student</Typography>
            </Box>
            <Stack direction="row">
              <Select placeholder="choose class">
                {SCHOOL_CLASSES.map((item) => {
                  return <Option value={item.value}>{item.title}</Option>;
                })}
              </Select>
              <Button sx={{ ml: "8px" }} startDecorator={<Search />}></Button>
              <Button variant="soft" sx={{ ml: "8px" }}>
                Reset
              </Button>
            </Stack>
          </Stack>
          <Divider sx={{ mt: "12px", mb: "8px" }} />
          <Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Button startDecorator={<NavigateBeforeIcon />} variant="plain">
                Back
              </Button>
              <Box>
                <Chip size="lg" color="primary">
                  ID- OPS20240002, Name- Srikant Kumar, Roll No- 002
                </Chip>
              </Box>
              <Button endDecorator={<NavigateNextIcon />} variant="plain">
                Next
              </Button>
            </Stack>
          </Box>
          <Divider sx={{ mt: "12px", mb: "8px" }} />
          <Box padding="10px">
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              <Grid>
                <Sheet
                  variant="soft"
                  color="success"
                  sx={{
                    borderRadius: "8px",
                    p: "10px",
                    border: "1px solid var(--bs-success)",
                  }}
                >
                  <Stack
                    direction="row"
                    height="90px"
                    alignItems="center"
                    sx={{ ml: "10px" }}
                    justifyContent="space-between"
                  >
                    <Typography level="title-md">
                      Summative Exam - I (2024)
                    </Typography>
                    <Button
                      variant="plain"
                      color="success"
                      startDecorator={<EditIcon />}
                    ></Button>
                  </Stack>
                </Sheet>
              </Grid>
              <Grid>
                <Button
                  variant="outlined"
                  color="neutral"
                  onClick={() => setUpdateResultDialogOpen(true)}
                  sx={{ height: "100%", width: "90px" }}
                  startDecorator={<AddIcon />}
                ></Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        <Modal
          open={updateResultDialogOpen}
          onClose={() => setUpdateResultDialogOpen(false)}
        >
          <ModalDialog
            variant="outlined"
            role="alertdialog"
            sx={{ minWidth: "480px", minHeight: "90%" }}
          >
            <DialogTitle>
              <UpdateIcon />
              Update Exam Result
            </DialogTitle>
            <Divider />
            <DialogContent sx={{ display: "flex" }}>
              <Sheet variant="outlined">
                <Stack direction="row" p="10px" alignItems="center" gap={2}>
                  <Typography>Select Examination</Typography>
                  <Select
                    placeholder="select paper..."
                    sx={{ flex: 1 }}
                  ></Select>
                </Stack>
              </Sheet>
              <Sheet variant="outlined">
                <Stack
                  direction="row"
                  p="10px"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>Add Paper</Typography>
                  <Stack direction={"row"} gap={2}>
                    <Select placeholder="select paper..."></Select>
                    <Button
                      startDecorator={<ArrowDownwardIcon />}
                      size="sm"
                    ></Button>
                  </Stack>
                </Stack>
              </Sheet>
              <Divider sx={{ mt: "8px", mb: "8px" }} />
              <Typography level="title-sm">
                Please fill marks for respective papers.
              </Typography>

              <Sheet
                sx={{ mt: "6px", flex: 1, p: "10px" }}
                variant="soft"
                color="neutral"
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  mb={"1rem"}
                  justifyContent="space-between"
                >
                  <Typography level="title-md">1. Maths - </Typography>
                  <Stack direction={"row"} gap={2}>
                    <Input placeholder="English Marks." />
                    <Button
                      size="sm"
                      variant="solid"
                      color="danger"
                      startDecorator={<Delete />}
                    ></Button>
                  </Stack>
                </Stack>
                <Stack
                  direction="row"
                  alignItems="center"
                  mt={"4px"}
                  justifyContent="space-between"
                >
                  <Typography level="title-md">1. Maths - </Typography>
                  <Stack direction={"row"} gap={2}>
                    <Input placeholder="English Marks." />
                    <Button
                      size="sm"
                      variant="solid"
                      color="danger"
                      startDecorator={<Delete />}
                    ></Button>
                  </Stack>
                </Stack>
              </Sheet>
            </DialogContent>
            <DialogActions>
              <Button
                variant="solid"
                color="success"
                onClick={() => setUpdateResultDialogOpen(false)}
              >
                Save Result
              </Button>
              <Button
                variant="plain"
                color="neutral"
                onClick={() => setUpdateResultDialogOpen(false)}
              >
                Cancel
              </Button>
            </DialogActions>
          </ModalDialog>
        </Modal>
      </LSPage>
    </PageContainer>
  );
}

export default UpdateResults;
