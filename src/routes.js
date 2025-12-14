/**
=========================================================
* Material Dashboard 2 React - Routes with Role Access
=========================================================
*/

import Icon from "@mui/material/Icon";

// Layouts / Pages
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";

import AddStaffUser from "layouts/pages/AddStaffUser";
import UserProfilePage from "layouts/pages/UserProfilePage";
import UserDetailsPage from "layouts/pages/UserDetailsPage";
import StaffListPage from "layouts/pages/StaffListPage";
import ClockPage from "layouts/pages/ClockPage";

import ChangePassword from "layouts/pages/ChangePassword";
import AdminUserAdvancePaymentsPage from "layouts/pages/AdminUserAdvancePaymentsPage";
import AdminUserOvertimesPage from "layouts/pages/AdminUserOvertimesPage";
import UserOvertimesPage from "layouts/pages/UserOvertimesPage";
import UserAdvancesPage from "layouts/pages/UserAdvancesPage";
import PayrollReportPage from "layouts/pages/PayrollReportPage";
import AllOvertimesPage from "layouts/pages/AllOvertimesPage";
import AllAdvancesPage from "layouts/pages/AllAdvancesPage";
import AdminUserAttendanceDetails from "layouts/pages/AdminUserAttendanceDetails";
import UserAttendanceHistory from "layouts/pages/UserAttendanceHistory";
import TodayAttendancePage from "layouts/pages/TodayAttendancePage";
import DeductionsPage from "layouts/pages/DeductionsPage";
import SignIn from "layouts/authentication/sign-in";

import HourCorrectionsPage from "layouts/pages/HourCorrectionsPage";
import RecordHourCorrectionPage from "layouts/pages/RecordHourCorrectionPage";
import RecordOvertimePaymentPage from "layouts/pages/RecordOvertimePaymentPage";
import RecordAdvancePaymentPage from "layouts/pages/RecordAdvancePaymentPage";
import WorkingHoursPage from "layouts/pages/WorkingHoursPage";

import AccessTimeIcon from "@mui/icons-material/AccessTimeOutlined";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const routes = [
  // Dashboard
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    userRoles: ["admin"],
  },

  //   Super Admin
  {
    type: "collapse",
    name: "Super Admin",
    key: "super-admin",
    icon: <AdminPanelSettingsIcon fontSize="small" />,
    collapse: [
      {
        type: "collapse",
        name: "Hour Corrections",
        key: "hour-corrections",
        route: "/hour-corrections",
        component: <HourCorrectionsPage />,
        userRoles: ["admin"],
      },
    ],
  },

  // Staff Management
  {
    type: "collapse",
    name: "Staff Management",
    key: "staff-management",
    icon: <Icon fontSize="small">group</Icon>,
    collapse: [
      {
        type: "collapse",
        name: "Add User",
        key: "staff-add",
        route: "/add-staff-user",
        component: <AddStaffUser />,
        userRoles: ["admin"],
      },
      {
        type: "collapse",
        name: "Users List",
        key: "users-list",
        route: "/users-list",
        component: <StaffListPage />,
        userRoles: ["admin"],
      },
      {
        key: "user-details",
        route: "/user-details",
        component: <UserDetailsPage />,
        userRoles: ["admin"],
      },
      {
        key: "hour-correction",
        route: "/hour-correction",
        component: <RecordHourCorrectionPage />,
        userRoles: ["super"],
      },
    ],
  },

  // Salary and Payments
  {
    type: "collapse",
    name: "Salary and Payments",
    key: "salary-payments",
    icon: <Icon fontSize="small">payments</Icon>,
    collapse: [
      {
        key: "record-advance-payments",
        route: "/record-advance-payments",
        component: <RecordAdvancePaymentPage />,
        userRoles: ["admin"],
      },
      {
        key: "record-overtime-payments",
        route: "/record-overtime-payments",
        component: <RecordOvertimePaymentPage />,
        userRoles: ["admin"],
      },
      {
        key: "admin-user-advance-payments",
        route: "/admin-user-advance-payments",
        component: <AdminUserAdvancePaymentsPage />,
        userRoles: ["admin"],
      },
      {
        key: "admin-user-overtime-payments",
        route: "/admin-user-overtime-payments",
        component: <AdminUserOvertimesPage />,
        userRoles: ["admin"],
      },
      {
        type: "collapse",
        name: "Advance Payments",
        key: "advance-payments",
        route: "/advance-payments",
        component: <AllAdvancesPage />,
        userRoles: ["admin"],
      },
      {
        type: "collapse",
        name: "Overtime Payments",
        key: "overtime-payments",
        route: "/overtime-payments",
        component: <AllOvertimesPage />,
        userRoles: ["admin"],
      },
      {
        type: "collapse",
        name: "Payroll Report",
        key: "payroll-report",
        route: "/payroll-report",
        component: <PayrollReportPage />,
        userRoles: ["admin"],
      },
    ],
  },

  // Attendance Reports
  {
    type: "collapse",
    name: "Attendance",
    key: "attendance-reports",
    icon: <Icon fontSize="small">summarize</Icon>,
    collapse: [
      {
        type: "collapse",
        name: "Clock In/Out",
        key: "clock-in-out",
        route: "/clock-in-out",
        component: <ClockPage />,
        userRoles: ["admin", "office", "teaching", "subordinate"],
      },
      {
        key: "admin-user-attendance-details",
        route: "/admin-user-attendance-details",
        component: <AdminUserAttendanceDetails />,
        userRoles: ["admin"],
      },
      {
        type: "collapse",
        name: "Attendance Summary",
        key: "attendance-summary",
        route: "/attendance-summary",
        component: <TodayAttendancePage />,
        userRoles: ["admin"],
      },
      {
        type: "collapse",
        name: "Verification Reports",
        key: "attendance-verification-reports",
        route: "#",
        userRoles: ["admin"],
      },
      //   {
      //     type: "collapse",
      //     name: "Late/Absence Report",
      //     key: "attendance-late-absence",
      //     route: "#",
      //     userRoles: ["admin", "office"],
      //   },
    ],
  },

  // System Settings
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
        userRoles: ["admin"],
      },
      {
        type: "collapse",
        name: "Verification Notifications",
        key: "settings-notifications",
        route: "#",
        userRoles: ["admin"],
      },
      {
        type: "collapse",
        name: "Statutory Deductions",
        key: "set-statutory-deductions",
        route: "/set-statutory-deductions",
        component: <DeductionsPage />,
        userRoles: ["admin"],
      },
    ],
  },

  // My Profile
  {
    type: "collapse",
    name: "My Profile",
    key: "my-profile",
    icon: <Icon fontSize="small">person</Icon>,
    collapse: [
      {
        type: "collapse",
        name: "Profile Summary",
        key: "profile-summary",
        route: "/profile-summary",
        component: <UserProfilePage />,
        userRoles: ["admin", "office", "teaching", "subordinate"],
      },
      {
        type: "collapse",
        name: "My Attendance",
        key: "my-attendance",
        route: "/my-attendance",
        component: <UserAttendanceHistory />,
        userRoles: ["office", "teaching", "subordinate"],
      },
      {
        type: "collapse",
        name: "My Advance Payments",
        key: "my-advance-payments",
        route: "/my-advance-payments",
        component: <UserAdvancesPage />,
        userRoles: ["office", "teaching", "subordinate"],
      },
      {
        type: "collapse",
        name: "My Overtime",
        key: "my-overtime",
        route: "/my-overtime",
        component: <UserOvertimesPage />,
        userRoles: ["office", "teaching", "subordinate"],
      },
      {
        type: "collapse",
        name: "Change Password",
        key: "profile-change-password",
        route: "/profile-change-password",
        component: <ChangePassword />,
        userRoles: ["admin", "office", "teaching", "subordinate"],
      },
    ],
  },

  // User Manuals
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
        route: "#",
        userRoles: ["admin"],
      },
      {
        type: "collapse",
        name: "User Manual",
        key: "manual-user",
        route: "#",
        userRoles: ["office", "teaching", "subordinate"],
      },
    ],
  },

  // Sign Out
  {
    type: "collapse",
    name: "Sign Out",
    key: "sign-out",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
];

export default routes;
