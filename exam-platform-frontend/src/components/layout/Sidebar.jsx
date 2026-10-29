import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import QuizRoundedIcon from "@mui/icons-material/QuizRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import { Link, useLocation } from "react-router-dom";
import { getNavigationForRole } from "../../app/navigationConfig";
import useAuth from "../../hooks/useAuth";

const iconMap = {
  dashboard: DashboardRoundedIcon,
  assignment: AssignmentRoundedIcon,
  history: HistoryRoundedIcon,
  analytics: AnalyticsRoundedIcon,
  person: PersonRoundedIcon,
  groups: GroupsRoundedIcon,
  quiz: QuizRoundedIcon,
  event: EventRoundedIcon,
  mail: MailRoundedIcon,
  videocam: VideocamRoundedIcon,
  assessment: AssessmentRoundedIcon,
  notifications: NotificationsRoundedIcon,
  settings: SettingsRoundedIcon,
};

export default function Sidebar({
  open = false,
  onClose = () => {},
  mobileWidth = 280,
  desktopWidth = 260,
}) {
  const { user } = useAuth();
  const location = useLocation();
  const navigation = getNavigationForRole(user?.role);

  const content = (
    <Box
      sx={{
        width: { xs: mobileWidth, md: desktopWidth },
        height: "100%",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5} px={3} py={3}>
        <Box
          sx={{
            width: 40,
            height: 40,
            display: "grid",
            placeItems: "center",
            borderRadius: 2,
            bgcolor: "primary.main",
            color: "white",
            fontWeight: 900,
            fontSize: 21,
          }}
        >
          E
        </Box>

        <Box>
          <Typography fontWeight={900} color="text.primary">
            ExamPilot
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Examination platform
          </Typography>
        </Box>
      </Stack>

      <Divider />

      <Typography
        variant="overline"
        color="text.secondary"
        fontWeight={800}
        px={3}
        pt={3}
        pb={1}
      >
        WORKSPACE
      </Typography>

      <List sx={{ px: 1.5, flexGrow: 1 }}>
        {navigation.map((item) => {
          const Icon = iconMap[item.icon] || DashboardRoundedIcon;
          const selected = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.path}
              component={Link}
              to={item.path}
              selected={selected}
              onClick={onClose}
              sx={{
                borderRadius: 2.5,
                mb: 0.5,
                minHeight: 46,
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                  "& .MuiListItemIcon-root": { color: "white" },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: selected ? "inherit" : "text.secondary",
                }}
              >
                <Icon />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 13.5,
                  fontWeight: selected ? 750 : 550,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box p={2}>
        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: "action.hover",
          }}
        >
          <Typography variant="body2" fontWeight={750}>
            Need help?
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Contact your platform administrator for assistance.
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: mobileWidth,
            borderRight: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        {content}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", md: "block" },
          width: desktopWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: desktopWidth,
            boxSizing: "border-box",
            position: "relative",
            height: "100%",
            borderRight: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        {content}
      </Drawer>
    </>
  );
}