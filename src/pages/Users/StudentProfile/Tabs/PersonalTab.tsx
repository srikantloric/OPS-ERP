import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Input,
  Option,
  Select,
  Stack,
  Typography,
} from "@mui/joy";
import { Edit } from "iconsax-react";

function PersonalTab() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ display: "flex", gap: "1.6rem", mt: "1rem" }}>
        <Box
          sx={{
            flex: "1.2",
            border: "1px solid var(--bs-gray-300)",
            borderRadius: "12px",
          }}
        >
          <Typography sx={{ m: "0.8rem" }} level="title-md">
            Personal Details
          </Typography>

          <Divider />
          <Box sx={{ p: "1rem" }}>
            <Grid container justifyContent="space-between">
              <Grid md={5} xs={7}>
                <FormControl>
                  <FormLabel>Student Name</FormLabel>
                  <Input />
                </FormControl>
              </Grid>
              <Grid md={3} xs={5}>
                <FormControl>
                  <FormLabel>Gender</FormLabel>
                  <Select>
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                  </Select>
                </FormControl>
              </Grid>
              <Grid md={3} xs={5}>
                <FormControl>
                  <FormLabel>Date Of Birth</FormLabel>
                  <Input type="date" />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container justifyContent="space-between" mt="1rem">
              <Grid md={5.8} xs={12}>
                <FormControl>
                  <FormLabel>Father Name</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Grid>

              <Grid md={5.8} xs={12}>
                <FormControl>
                  <FormLabel>Mother Name</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Box
          sx={{
            flex: "0.8",
            border: "1px solid var(--bs-gray-300)",
            borderRadius: "12px",
          }}
        >
          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            m="0.8rem"
          >
            <Typography level="title-md">Fee Details</Typography>
            <IconButton>
              <Edit size="20" />
            </IconButton>
          </Stack>
          <Divider />
          <Box sx={{ p: "1rem" }}>
            <Grid container gap="1rem" justifyContent="space-between">
              <Grid md={5.5}>
                <FormControl>
                  <FormLabel>Monthly Fee</FormLabel>
                  <Input startDecorator={"Rs."} />
                </FormControl>
              </Grid>
              <Grid md={5.5}>
                <FormControl>
                  <FormLabel>Transport Fee</FormLabel>
                  <Input startDecorator={"Rs."} />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container gap="1rem" mt="1rem" justifyContent="space-between">
              <Grid md={5.5}>
                <FormControl>
                  <FormLabel>Computer Fee</FormLabel>
                  <Input startDecorator={"Rs."} />
                </FormControl>
              </Grid>
              <Grid md={5.5}>
                <FormControl>
                  <FormLabel>Student Discount</FormLabel>
                  <Input startDecorator={"Rs."} />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box
          sx={{
            flex: "0.8",
            border: "1px solid var(--bs-gray-300)",
            borderRadius: "12px",
          }}
        >
          <Stack
            justifyContent="space-between"
            direction="row"
            alignItems="center"
            m="0.8rem"
          >
            <Typography level="title-md">Admission Details</Typography>
            <IconButton>
              <Edit size="20" />
            </IconButton>
          </Stack>
          <Divider />
          <Box sx={{ p: "1rem" }}></Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "flex-end",
          justifyContent: "end",
          mt: "1rem",
        }}
      >
        <Button variant="outlined">Cancel</Button>
        <Button variant="solid">Update Profile</Button>
      </Box>
    </Box>
  );
}

export default PersonalTab;
