import type { ReactNode } from "react";
import { PortalHome } from "./PortalHome";
import { PortalBookings } from "./PortalBookings";
import { PortalProfile } from "./PortalProfile";
import { PortalAdmin } from "./PortalAdmin";

export interface PortalNavItem {
  /* Path relative to /portal; "" is the index route. */
  path: string;
  label: string;
  /* Card header used by the placeholder when no page element is given.
     Omitted on built pages, which render their own header. */
  eyebrow?: string;
  title?: string;
  /* Real page; a placeholder renders when this is omitted. */
  element?: ReactNode;
}

export interface PortalNavSection {
  /* Sidebar heading — the role this group of routes belongs to. */
  role: string;
  /* Roles allowed to see this section. Empty = every signed-in member. */
  roles: string[];
  items: PortalNavItem[];
}

/*
 * Single source of truth for the portal's navigation AND its routes.
 * App.tsx generates the nested /portal routes from this, and PortalLayout
 * renders the sidebar from it — so a new page is one entry here.
 *
 * TODO: filter sections by the viewer's roles once auth is wired. Every
 * section is currently shown so the whole portal can be previewed.
 */
export const PORTAL_NAV: PortalNavSection[] = [
  {
    role: "Member",
    roles: [],
    items: [
      {
        path: "",
        label: "Overview",
        element: <PortalHome />,
      },
      {
        path: "bookings",
        label: "Bookings",
        element: <PortalBookings />,
      },
      {
        path: "profile",
        label: "Profile",
        element: <PortalProfile />,
      },
    ],
  },
  {
    role: "Staff",
    roles: ["Staff", "Administrator"],
    items: [
      { path: "staff", label: "Staff Dashboard", eyebrow: "Staff", title: "Staff Dashboard" },
      { path: "staff/bookings", label: "Manage Bookings", eyebrow: "Staff", title: "Manage Bookings" },
      { path: "staff/events", label: "Events", eyebrow: "Staff", title: "Events" },
      { path: "staff/leagues", label: "Leagues", eyebrow: "Staff", title: "Leagues" },
      { path: "staff/announcements", label: "Announcements", eyebrow: "Staff", title: "Announcements" },
    ],
  },
  {
    role: "Team Manager",
    roles: ["Team Manager", "Administrator"],
    items: [
      { path: "players", label: "Players", eyebrow: "Team Manager", title: "Players" },
      { path: "sessions", label: "Training Sessions", eyebrow: "Team Manager", title: "Training Sessions" },
      { path: "fixtures", label: "Fixtures & Results", eyebrow: "Team Manager", title: "Fixtures & Results" },
      { path: "attendance", label: "Attendance", eyebrow: "Team Manager", title: "Attendance" },
      { path: "tournaments", label: "Tournaments", eyebrow: "Team Manager", title: "Tournaments" },
      { path: "announcements", label: "Announcements", eyebrow: "Team Manager", title: "Announcements" },
    ],
  },
  {
    role: "Administrator",
    roles: ["Administrator"],
    items: [
      {
        path: "admin",
        label: "Admin Overview",
        element: <PortalAdmin />,
      },
      { path: "admin/person-lookup", label: "Person Lookup", eyebrow: "Administrator", title: "Person Lookup" },
      { path: "admin/roles", label: "Users & Roles", eyebrow: "Administrator", title: "Users & Roles" },
      { path: "admin/seasons", label: "Seasons", eyebrow: "Administrator", title: "Seasons" },
      { path: "admin/programs", label: "Programs", eyebrow: "Administrator", title: "Programs" },
      { path: "admin/reports", label: "Reports", eyebrow: "Administrator", title: "Reports" },
      { path: "admin/tournaments", label: "Tournaments", eyebrow: "Administrator", title: "Tournaments" },
      { path: "admin/teams", label: "Teams", eyebrow: "Administrator", title: "Teams" },
      { path: "admin/events", label: "Events", eyebrow: "Administrator", title: "Events" },
      { path: "admin/leagues", label: "Leagues", eyebrow: "Administrator", title: "Leagues" },
      { path: "admin/settings", label: "Settings", eyebrow: "Administrator", title: "Settings" },
    ],
  },
];
