import { BuildingIcon } from "~/components/icons/building";
import { ChatsOutlinedIcon } from "~/components/icons/chat";
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
    label: "Contributions",
    path: "/admin/contributions",
    icon: <UserSpeakingIcon />,
  },
];
