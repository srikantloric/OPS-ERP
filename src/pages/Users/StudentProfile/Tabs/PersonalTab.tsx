import { Box, Button, Divider, Typography } from "@mui/joy";

function PersonalTab() {
  return (
    <Box sx={{display:"flex",flexDirection:"column"}}>
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
          <Box sx={{ p: "1rem" }}></Box>
        </Box>
        <Box
          sx={{
            flex: "0.8",
            border: "1px solid var(--bs-gray-300)",
            borderRadius: "12px",
          }}
        >
          <Typography sx={{ m: "0.8rem" }} level="title-md">
            Fee Details
          </Typography>
          <Divider />
          <Box sx={{ p: "1rem" }}></Box>
        </Box>
      </Box>
      <Box sx={{display:"flex",gap:"0.5rem",alignItems:"flex-end",justifyContent:"end",mt:"1rem"}}>
        <Button variant="outlined">Cancel</Button>
        <Button variant="solid">Update Profile</Button>
      </Box>
    </Box>
  );
}

export default PersonalTab;
