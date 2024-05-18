import {
  Avatar,
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
  SvgIcon,
  Typography,
  styled,
} from "@mui/joy";
import { SCHOOL_CLASSES, SCHOOL_SECTIONS } from "config/schoolConfig";
import { Edit } from "iconsax-react";

const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

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
            <Grid container justifyContent="space-between" mt="1rem">
              <Grid md={3} xs={12}>
                <FormControl>
                  <FormLabel>Religion</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Grid>

              <Grid md={3} xs={12}>
                <FormControl>
                  <FormLabel>Cast</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Grid>
              <Grid md={5.4} xs={12}>
                <FormControl>
                  <FormLabel>Aadhar Number</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container justifyContent="space-between" mt="1rem">
              <Grid md={3} xs={12}>
                <FormControl>
                  <FormLabel>Father Qualification</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Grid>

              <Grid md={2.6} xs={12}>
                <FormControl>
                  <FormLabel>Occupation</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Grid>
              <Grid md={3} xs={12}>
                <FormControl>
                  <FormLabel>Mother Qualification</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Grid>
              <Grid md={2.6} xs={12}>
                <FormControl>
                  <FormLabel>Occupation</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container justifyContent="space-between" mt="1rem">
              <Grid md={5.8} xs={12}>
                <FormControl>
                  <FormLabel>Phone Number (Primary)</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Grid>

              <Grid md={5.8} xs={12}>
                <FormControl>
                  <FormLabel>Phone Number 2</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container justifyContent="space-between" mt="1rem">
              <Grid md={12} xs={12}>
                <FormControl>
                  <FormLabel>Present Address</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Grid>
            </Grid>
            <Grid container justifyContent="space-between" mt="1rem">
              <Grid md={4} xs={12}>
                <FormControl>
                  <FormLabel>City</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Grid>
              <Grid md={4} xs={12}>
                <FormControl>
                  <FormLabel>State</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Grid>
              <Grid md={3} xs={12}>
                <FormControl>
                  <FormLabel>Pin Code</FormLabel>
                  <Input type="text" />
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Stack direction="column" gap="1rem" flex="0.8">
          <Box
            sx={{
              border: "1px solid var(--bs-gray-300)",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "column",
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
              <Grid
                container
                gap="1rem"
                mt="1rem"
                justifyContent="space-between"
              >
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
            <Box sx={{ p: "1rem" }}>
              <Grid container sx={{ justifyContent: "space-between" }}>
                <Grid md={4} xs={12}>
                  <FormControl>
                    <FormLabel>Class</FormLabel>
                    <Select placeholder="student current class">
                      {SCHOOL_CLASSES.map((item) => {
                        return <Option value={item.value}>{item.title}</Option>;
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid md={4} xs={12}>
                  <FormControl>
                    <FormLabel>Section</FormLabel>
                    <Select placeholder="student section">
                      {SCHOOL_SECTIONS.map((item) => {
                        return <Option value={item.value}>{item.title}</Option>;
                      })}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid md={3} xs={12}>
                  <FormControl>
                    <FormLabel>Roll Number</FormLabel>
                    <Input type="number" />
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
              <Typography level="title-md">Update Profile Picture</Typography>
            </Stack>
            <Divider />
            <Box
              sx={{
                p: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Avatar
                alt="Remy Sharp"
                sx={{ "--Avatar-size": "6rem" }}
                src="https://retratosbarcelona.com/wp-content/uploads/2022/09/Retratos-Barcelona-Linkedin-Photo-Sydney.jpg"
              />
              <Button
                component="label"
                role={undefined}
                tabIndex={-1}
                variant="outlined"
                color="neutral"
                sx={{ height: "20px" }}
                startDecorator={
                  <SvgIcon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                      />
                    </svg>
                  </SvgIcon>
                }
              >
                Choose Profile Photo
                <VisuallyHiddenInput type="file" />
              </Button>
            </Box>
          </Box>
        </Stack>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "flex-end",
          justifyContent: "end",
          mt: "2rem",
        }}
      >
        <Button variant="outlined">Cancel</Button>
        <Button variant="solid">Update Profile</Button>
      </Box>
    </Box>
  );
}

export default PersonalTab;
