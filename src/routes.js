/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import AddStaffUser from "layouts/pages/AddStaffUser";
import ClockPage from "layouts/pages/ClockPage";
import SignIn from "layouts/authentication/sign-in";
import WorkingHoursPage from "layouts/pages/WorkingHoursPage";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  // --- ADMIN DASHBOARD Title ---
  //   {
  //     type: "title",
  //     title: "Admin Dashboard",
  //     key: "admin-dashboard-title",
  //   },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard", // ACTIVE ROUTE
    component: <Dashboard />,
  },

  // --- Staff Management (Parent Link) ---
  {
    type: "collapse",
    name: "Staff Management",
    key: "staff-management",
    icon: <Icon fontSize="small">group</Icon>,
    // NOTE: Collapsible parent links do not need a route/component
    collapse: [
      {
        type: "collapse",
        name: "Add Staff",
        key: "staff-add",
        route: "/add-staff-user",
        component: <AddStaffUser />,
      },
      {
        type: "collapse",
        name: "View Staff",
        key: "staff-view",
        route: "#", // DEAD LINK
        // component: <Tables />, // Component removed for dead link
      },
      {
        type: "collapse",
        name: "Reset Staff Password",
        key: "staff-reset-password",
        route: "#", // DEAD LINK
        // component: <Tables />, // Component removed for dead link
      },
    ],
  },

  // --- Salary and Payments (Parent Link) ---
  {
    type: "collapse",
    name: "Salary and Payments",
    key: "salary-payments",
    icon: <Icon fontSize="small">payments</Icon>,
    collapse: [
      {
        type: "collapse",
        name: "Monthly Salaries",
        key: "salary-monthly",
        route: "#", // DEAD LINK
      },
      {
        type: "collapse",
        name: "Overtime Summary",
        key: "salary-overtime",
        route: "#", // DEAD LINK
      },
      {
        type: "collapse",
        name: "View Salary Slips",
        key: "salary-slips",
        route: "#", // DEAD LINK
      },
      {
        type: "collapse",
        name: "Payment Reports",
        key: "salary-reports",
        route: "#", // DEAD LINK
      },
    ],
  },

  // --- Attendance Reports (Parent Link) ---
  {
    type: "collapse",
    name: "Attendance",
    key: "attendance-reports",
    icon: <Icon fontSize="small">summarize</Icon>,
    collapse: [
      {
        type: "collapse",
        name: "Clock In",
        key: "clock-in",
        route: "/clock-in",
        component: <ClockPage />,
      },
      {
        type: "collapse",
        name: "Daily Attendance",
        key: "attendance-daily",
        route: "#", // DEAD LINK
      },
      {
        type: "collapse",
        name: "Attendance Summary",
        key: "attendance-summary",
        route: "#", // DEAD LINK
      },
      {
        type: "collapse",
        name: "Verification Reports",
        key: "attendance-verification-reports",
        route: "#", // DEAD LINK
      },
      {
        type: "collapse",
        name: "Late/Absence Report",
        key: "attendance-late-absence",
        route: "#", // DEAD LINK
      },
    ],
  },

  // --- System Settings (Parent Link) ---
  {
    type: "collapse",
    name: "System Settings",
    key: "system-settings",
    icon: <Icon fontSize="small">settings</Icon>,
    collapse: [
      {
        type: "collapse",
        name: "Working Hours",
        key: "set-working-hours",
        route: "/set-working-hours",
        component: <WorkingHoursPage />,
      },
      {
        type: "collapse",
        name: "Verification Notifications",
        key: "settings-notifications",
        route: "#", // DEAD LINK
      },
      {
        type: "collapse",
        name: "Rate & Deductions",
        key: "settings-rate-deductions",
        route: "#", // DEAD LINK
      },
      {
        type: "collapse",
        name: "Roles & Permissions",
        key: "settings-roles-permissions",
        route: "#", // DEAD LINK
      },
      {
        type: "collapse",
        name: "Statutory Deductions",
        key: "settings-statutory-deductions",
        route: "#", // DEAD LINK
      },
    ],
  },

  // --- My Profile (Parent Link) ---
  {
    type: "collapse",
    name: "My Profile",
    key: "my-profile",
    icon: <Icon fontSize="small">person</Icon>,
    collapse: [
      {
        type: "collapse",
        name: "My Profile",
        key: "profile-view",
        route: "#", // DEAD LINK
      },
      {
        type: "collapse",
        name: "Change Password",
        key: "profile-change-password",
        route: "#", // DEAD LINK
      },
    ],
  },

  // --- User Manuals (Parent Link) ---
  {
    type: "collapse",
    name: "User Manuals",
    key: "user-manuals",
    icon: <Icon fontSize="small">menu_book</Icon>,
    collapse: [
      {
        type: "collapse",
        name: "Admin Manual",
        key: "manual-admin",
        route: "#", // DEAD LINK
      },
      {
        type: "collapse",
        name: "User Manual",
        key: "manual-user",
        route: "#", // DEAD LINK
      },
    ],
  },

  // --- Sign Out (Standalone Link) ---
  {
    type: "collapse",
    name: "Sign Out",
    key: "sign-out",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  //   {
  //     type: "collapse",
  //     name: "Sign In",
  //     key: "sign-in",
  //     icon: <Icon fontSize="small">login</Icon>,
  //     route: "/authentication/sign-in",
  //     component: <SignIn />,
  //   },
];

export default routes;
