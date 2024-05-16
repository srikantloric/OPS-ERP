import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab from "@mui/joy/Tab";
import ListItemDecorator from "@mui/joy/ListItemDecorator";

import PageContainer from "components/Utils/PageContainer";
import Navbar from "components/Navbar/Navbar";
import LSPage from "components/Utils/LSPage";
import BreadCrumbsV2 from "components/Breadcrumbs/BreadCrumbsV2";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Book, Moneys, Profile, Setting4, TableDocument } from "iconsax-react";
import { Box, TabPanel, Typography } from "@mui/joy";
import ProfileTab from "./Tabs/ProfileTab";
import PersonalTab from "./Tabs/PersonalTab";
function ViewStudentProfile() {
  return (
    <PageContainer>
      <Navbar />
      <LSPage>
        <BreadCrumbsV2
          Icon={AccountCircleIcon}
          Path="Students  /StudentProfile"
        />
        <Typography level="h3" m="6px">
          Student Profile
        </Typography>
        <Box
          mt="12px"
          sx={{
            backgroundColor: "#fff",
            padding: "14px",
            border: "1px solid var(--bs-gray-300)",
            borderRadius: "12px",
          }}
        >
          <Tabs
            aria-label="Icon tabs"
            defaultValue={0}
            sx={{ backgroundColor: "#fff", mt: "1rem" }}
          >
            <TabList>
              <Tab>
                <ListItemDecorator>
                  <Profile size="18" />
                </ListItemDecorator>
                Profile
              </Tab>
              <Tab>
                <ListItemDecorator>
                  <TableDocument size="18" />
                </ListItemDecorator>
                Personal
              </Tab>
              <Tab>
                <ListItemDecorator>
                  <Moneys size="18" />
                </ListItemDecorator>
                Payments
              </Tab>
              <Tab>
                <ListItemDecorator>
                  <Book size="18" />
                </ListItemDecorator>
                Exams
              </Tab>
              <Tab>
                <ListItemDecorator>
                  <Setting4 size="18" />
                </ListItemDecorator>
                Settings
              </Tab>
            </TabList>
            <TabPanel value={0}>
              <ProfileTab />
            </TabPanel>
            <TabPanel value={1}>
             <PersonalTab/>
            </TabPanel>
            <TabPanel value={2}>
              <b>Third</b> tab panel
            </TabPanel>
          </Tabs>
        </Box>
      </LSPage>
    </PageContainer>
  );
}

export default ViewStudentProfile;
