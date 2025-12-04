// File: UserProfilePage.js
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid"; // <-- Used for responsiveness
import Paper from "@mui/material/Paper";

// Icons
import EmailIcon from "@mui/icons-material/EmailOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoneyOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import FingerprintIcon from "@mui/icons-material/FingerprintOutlined";
import PaidIcon from "@mui/icons-material/PaidOutlined";
import PermIdentityIcon from "@mui/icons-material/PermIdentityOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailableOutlined";
import EventBusyIcon from "@mui/icons-material/EventBusyOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLongOutlined";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import getLoggedInUserDetailsApi from "../../api/getLoggedInUserDetailsApi";
import CustomAlert from "../../components/CustomAlert";

const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/?d=mp&s=80";

function UserProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [generatingPayslip, setGeneratingPayslip] = useState(false);

  const showAlert = (msg, severity = "info") => {
    setAlertMessage(msg);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await getLoggedInUserDetailsApi();
        if (res.data.status === "success") {
          setUserData(res.data.data);
        } else {
          showAlert(res.data.message || "Failed to fetch user details", "error");
        }
      } catch (err) {
        console.error(err);
        showAlert("Server error while fetching user details", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchUserDetails();
  }, []);

  const handleGeneratePayslip = async () => {
    if (!userData) return;
    setGeneratingPayslip(true);
    showAlert("Generating payslip...", "info");
    try {
      // Simulating a payslip generation delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showAlert(`Payslip for ${userData.first_name} generated successfully!`, "success");
    } catch (err) {
      console.error(err);
      showAlert("Failed to generate payslip. Server error.", "error");
    } finally {
      setGeneratingPayslip(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="center" alignItems="center" height="70vh">
          <CircularProgress />
        </MDBox>
      </DashboardLayout>
    );
  }

  if (!userData) return null;

  const {
    email,
    first_name,
    last_name,
    user_role,
    status,
    photo,
    account,
    phone_number,
    id_number,
    is_present_today,
    is_on_leave,
    hourly_rate,
    hourly_rate_currency,
    nssf_number,
    shif_sha_number,
  } = userData;

  return (
    <DashboardLayout>
      <DashboardNavbar />

      {/* Main content wrapper adjusted to match StaffListPage's vertical padding */}
      <MDBox py={3}>
        <MDBox sx={{ margin: "0 auto 0 0" }}>
          {" "}
          {/* Matches StaffListPage content alignment */}
          {/* Top User Info Card (p={3} mb={3} matches card styles from StaffListPage) */}
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <MDBox display="flex" alignItems="center" gap={3}>
              <Avatar src={photo || DEFAULT_AVATAR} sx={{ width: 80, height: 80 }} />
              <MDBox>
                <MDTypography variant="h5" fontWeight="bold">
                  {first_name} {last_name}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {email}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {user_role} • {status}
                </MDTypography>
              </MDBox>
            </MDBox>
          </Paper>
          {/* Staff & Financial Info Cards - RESPONSIVE GRID */}
          <Grid container spacing={2}>
            {/* Staff Information Card */}
            <Grid item xs={12} md={6}>
              {" "}
              {/* Takes full width on small, half width on medium+ */}
              <Paper elevation={0} sx={{ p: 2, height: "100%" }}>
                <MDTypography variant="h6" fontWeight="bold" mb={2}>
                  Staff Information
                </MDTypography>
                {/* Email */}
                <MDBox display="flex" alignItems="center" mb={1}>
                  <EmailIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  <MDTypography variant="body2" fontWeight="bold">
                    Email:
                  </MDTypography>
                  <MDTypography variant="body2" ml={0.5}>
                    {email}
                  </MDTypography>
                </MDBox>
                {/* Account */}
                <MDBox display="flex" alignItems="center" mb={1}>
                  <AccountCircleIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  <MDTypography variant="body2" fontWeight="bold">
                    Account:
                  </MDTypography>
                  <MDTypography variant="body2" ml={0.5}>
                    {account || "-"}
                  </MDTypography>
                </MDBox>
                {/* Phone */}
                <MDBox display="flex" alignItems="center" mb={1}>
                  <PhoneIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  <MDTypography variant="body2" fontWeight="bold">
                    Phone:
                  </MDTypography>
                  <MDTypography variant="body2" ml={0.5}>
                    {phone_number || "-"}
                  </MDTypography>
                </MDBox>
                {/* ID Number */}
                <MDBox display="flex" alignItems="center" mb={1}>
                  <FingerprintIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  <MDTypography variant="body2" fontWeight="bold">
                    ID Number:
                  </MDTypography>
                  <MDTypography variant="body2" ml={0.5}>
                    {id_number || "-"}
                  </MDTypography>
                </MDBox>
                {/* Present Today */}
                <MDBox display="flex" alignItems="center" mb={1}>
                  <EventAvailableIcon fontSize="small" sx={{ mr: 1, color: "success.main" }} />
                  <MDTypography variant="body2" fontWeight="bold">
                    Present Today:
                  </MDTypography>
                  <MDTypography variant="body2" ml={0.5}>
                    {is_present_today ? "Yes" : "No"}
                  </MDTypography>
                </MDBox>
              </Paper>
            </Grid>

            {/* Financial & Statutory Card */}
            <Grid item xs={12} md={6}>
              {" "}
              {/* Takes full width on small, half width on medium+ */}
              <Paper elevation={0} sx={{ p: 2, height: "100%" }}>
                <MDTypography variant="h6" fontWeight="bold" mb={2}>
                  Financial & Statutory
                </MDTypography>
                {/* Hourly Rate */}
                <MDBox display="flex" alignItems="center" mb={1}>
                  <AttachMoneyIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  <MDTypography variant="body2" fontWeight="bold">
                    Hourly Rate:
                  </MDTypography>
                  <MDTypography variant="body2" ml={0.5}>
                    {hourly_rate} {hourly_rate_currency}
                  </MDTypography>
                </MDBox>
                {/* NSSF Number */}
                <MDBox display="flex" alignItems="center" mb={1}>
                  <PaidIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  <MDTypography variant="body2" fontWeight="bold">
                    NSSF Number:
                  </MDTypography>
                  <MDTypography variant="body2" ml={0.5}>
                    {nssf_number}
                  </MDTypography>
                </MDBox>
                {/* SHA Number */}
                <MDBox display="flex" alignItems="center" mb={1}>
                  <PermIdentityIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  <MDTypography variant="body2" fontWeight="bold">
                    SHA Number:
                  </MDTypography>
                  <MDTypography variant="body2" ml={0.5}>
                    {shif_sha_number}
                  </MDTypography>
                </MDBox>
              </Paper>
            </Grid>
          </Grid>
          {/* Leave Status Card */}
          <MDBox mt={3}>
            <Paper elevation={0} sx={{ p: 2 }}>
              <MDTypography variant="h6" fontWeight="bold" mb={2}>
                Leave Status
              </MDTypography>
              <MDBox display="flex" alignItems="center">
                <EventBusyIcon
                  fontSize="large"
                  sx={{ mr: 1, color: is_on_leave ? "error.main" : "success.main" }}
                />
                <MDTypography variant="body1" fontWeight="bold">
                  {is_on_leave ? "ON LEAVE" : "WORKING"}
                </MDTypography>
              </MDBox>
            </Paper>
          </MDBox>
          {/* Payslip Card */}
          <MDBox mt={3}>
            <Paper elevation={0} sx={{ p: 2 }}>
              <MDTypography variant="h6" fontWeight="bold" mb={2}>
                Payslip
              </MDTypography>
              <MDBox display="flex" alignItems="center" gap={2} mb={1}>
                <ReceiptLongIcon sx={{ fontSize: 50, color: "info.main" }} />
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={handleGeneratePayslip}
                  disabled={generatingPayslip}
                  startIcon={generatingPayslip && <CircularProgress size={20} color="white" />}
                >
                  {generatingPayslip ? "Generating..." : "Download Payslip"}
                </MDButton>
              </MDBox>
              <MDTypography variant="caption" color="text.secondary">
                You can only download the payslip for the current month.
              </MDTypography>
            </Paper>
          </MDBox>
        </MDBox>
      </MDBox>

      <CustomAlert
        message={alertMessage}
        severity={alertSeverity}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      />

      <Footer />
    </DashboardLayout>
  );
}

export default UserProfilePage;
