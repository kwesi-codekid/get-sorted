import { BuildingIcon } from "~/components/icons/building";
import { ChatsOutlinedIcon, RobotOutlinedIcon } from "~/components/icons/chat";
import { ClipboardIcon } from "~/components/icons/clipboard";
import { DashboardIcon } from "~/components/icons/dashboard";
import { UserBadgeIcon, UserSpeakingIcon } from "~/components/icons/user";

export const adminNavLinks = [
  { label: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
  { label: "Users", path: "/admin/users", icon: <UserBadgeIcon /> },
  { label: "Departments", path: "/admin/departments", icon: <BuildingIcon /> },
  { label: "Tickets", path: "/admin/tickets", icon: <ClipboardIcon /> },
  { label: "FAQs", path: "/admin/faqs", icon: <ChatsOutlinedIcon /> },
  {
    label: "Ask AI",
    path: "/admin/ask-ai",
    icon: <RobotOutlinedIcon />,
  },
];

export const staffNavLinks = [
  { label: "Dashboard", path: "/staff", icon: <DashboardIcon /> },
  { label: "Tickets", path: "/staff/tickets", icon: <ClipboardIcon /> },
  { label: "FAQs", path: "/staff/faqs", icon: <ChatsOutlinedIcon /> },
  {
    label: "Ask AI",
    path: "/staff/ask-ai",
    icon: <RobotOutlinedIcon />,
  },
  {
    label: "Softwares",
    path: "/staff/software",
    icon: <RobotOutlinedIcon />,
  },
  { label: "My Profile", path: "/staff/profile", icon: <UserBadgeIcon /> },
];
