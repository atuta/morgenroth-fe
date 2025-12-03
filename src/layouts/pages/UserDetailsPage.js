// File: UserDetailsPage.js

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid"; // For layout
import TextField from "@mui/material/TextField"; // For editable fields
import Paper from "@mui/material/Paper"; // For card structure

// Icons for the details section
import EmailIcon from "@mui/icons-material/EmailOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoneyOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import FingerprintIcon from "@mui/icons-material/FingerprintOutlined";
import PaidIcon from "@mui/icons-material/PaidOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailableOutlined";
import EventBusyIcon from "@mui/icons-material/EventBusyOutlined";
import PermIdentityIcon from "@mui/icons-material/PermIdentityOutlined";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import getUserDetailsApi from "../../api/getUserDetailsApi";
import CustomAlert from "../../components/CustomAlert";

const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/?d=mp&s=80";

function UserDetailsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const userIdFromUrl = searchParams.get("user_id");

  // Prefer state.user_id, fallback to URL param
  const user_id = state?.user_id || userIdFromUrl;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for editable fields
  const [editRate, setEditRate] = useState("");
  const [editNssf, setEditNssf] = useState("");
  const [editSha, setEditSha] = useState("");

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const showAlert = (msg, severity = "info") => {
    setAlertMessage(msg);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  // Helper function to set editable states after data fetch
  const initializeEditStates = (data) => {
    // Ensure numerical rate is stringified for input field
    setEditRate(String(data.hourly_rate || ""));
    setEditNssf(data.nssf_number || "");
    setEditSha(data.shif_sha_number || "");
  };

  // Fetch user details and initialize edit states
  useEffect(() => {
    if (!user_id) {
      showAlert("No user selected", "error");
      setLoading(false);
      return;
    }

    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const res = await getUserDetailsApi({ user_id });

        if (res.data.status === "success") {
          const fetchedData = res.data.data;
          setUserData(fetchedData);
          initializeEditStates(fetchedData); // Initialize editable fields
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
  }, [user_id]);

  // Save button logic placeholder
  const handleSave = () => {
    showAlert("Attempting to save changes...", "info");

    const changes = {
      hourly_rate: editRate,
      nssf_number: editNssf,
      shif_sha_number: editSha,
      // user_id is implicit for the API call
    };

    console.log("Saving changes:", changes);

    // TODO: Implement the API call to save user details (e.g., saveUserDetailsApi(user_id, changes))
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

  // If userData is not set after loading, this avoids crashes (e.g., if API failed)
  if (!userData) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="center" alignItems="center" height="70vh">
          <MDTypography variant="h6" color="error">
            Could not load user data.
          </MDTypography>
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

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox p={3}>
        {/* Back Button */}
        <MDButton variant="outlined" color="info" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back
        </MDButton>

        {/* User Header */}
        <MDBox
          display="flex"
          alignItems="center"
          gap={3}
          bgColor="#fff"
          px={3}
          py={2}
          mb={3}
          borderRadius="lg"
          boxShadow="sm"
        >
          <Avatar src={userData.photo || DEFAULT_AVATAR} sx={{ width: 80, height: 80 }} />
          <MDBox>
            <MDTypography variant="h5" fontWeight="bold">
              {userData.first_name} {userData.last_name}
            </MDTypography>
            <MDTypography variant="body2" color="text">
              {userData.email}
            </MDTypography>
            <MDTypography variant="body2" color="text">
              {userData.user_role} • {userData.status}
            </MDTypography>
          </MDBox>
        </MDBox>

        {/* Staff Details Card */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: "lg" }}>
          <MDTypography variant="h6" fontWeight="bold" mb={3}>
            Staff Information
          </MDTypography>

          <Grid container spacing={3}>
            {/* Column 1: Read-Only Info (Reduced Font Size & Icons) */}
            <Grid item xs={12} md={6}>
              <MDTypography variant="body1" fontWeight="medium" mb={1}>
                General Details
              </MDTypography>

              <MDBox display="flex" alignItems="center" mb={1}>
                <EmailIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                <MDTypography component="span" variant="body2" fontWeight="bold">
                  Email:
                </MDTypography>
                <MDTypography component="span" variant="body2" ml={0.5}>
                  {userData.email}
                </MDTypography>
              </MDBox>

              <MDBox display="flex" alignItems="center" mb={1}>
                <AccountCircleIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                <MDTypography component="span" variant="body2" fontWeight="bold">
                  Account:
                </MDTypography>
                <MDTypography component="span" variant="body2" ml={0.5}>
                  {userData.account || "N/A"}
                </MDTypography>
              </MDBox>

              <MDBox display="flex" alignItems="center" mb={1}>
                <PhoneIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                <MDTypography component="span" variant="body2" fontWeight="bold">
                  Phone:
                </MDTypography>
                <MDTypography component="span" variant="body2" ml={0.5}>
                  {userData.phone_number || "-"}
                </MDTypography>
              </MDBox>

              <MDBox display="flex" alignItems="center" mb={1}>
                <FingerprintIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                <MDTypography component="span" variant="body2" fontWeight="bold">
                  ID Number:
                </MDTypography>
                <MDTypography component="span" variant="body2" ml={0.5}>
                  {userData.id_number || "-"}
                </MDTypography>
              </MDBox>

              <MDBox display="flex" alignItems="center" mb={1}>
                <EventAvailableIcon fontSize="small" sx={{ mr: 1, color: "success.main" }} />
                <MDTypography component="span" variant="body2" fontWeight="bold">
                  Present Today:
                </MDTypography>
                <MDTypography component="span" variant="body2" ml={0.5}>
                  {userData.is_present_today ? "Yes" : "No"}
                </MDTypography>
              </MDBox>

              <MDBox display="flex" alignItems="center" mb={1}>
                <EventBusyIcon fontSize="small" sx={{ mr: 1, color: "error.main" }} />
                <MDTypography component="span" variant="body2" fontWeight="bold">
                  On Leave:
                </MDTypography>
                <MDTypography component="span" variant="body2" ml={0.5}>
                  {userData.is_on_leave ? "Yes" : "No"}
                </MDTypography>
              </MDBox>
            </Grid>

            {/* Column 2: Editable Info (Icons in Labels) */}
            <Grid item xs={12} md={6}>
              <MDTypography variant="body1" fontWeight="medium" mb={1}>
                Financial & Statutory
              </MDTypography>

              {/* Hourly Rate */}
              <TextField
                label={
                  <MDBox display="flex" alignItems="center">
                    <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} /> Hourly Rate (
                    {userData.hourly_rate_currency})
                  </MDBox>
                }
                fullWidth
                margin="normal"
                variant="outlined"
                value={editRate}
                onChange={(e) => setEditRate(e.target.value)}
                type="number"
                sx={{ mb: 2 }}
              />

              {/* NSSF */}
              <TextField
                label={
                  <MDBox display="flex" alignItems="center">
                    <PaidIcon fontSize="small" sx={{ mr: 1 }} /> NSSF Number
                  </MDBox>
                }
                fullWidth
                margin="normal"
                variant="outlined"
                value={editNssf}
                onChange={(e) => setEditNssf(e.target.value)}
                sx={{ mb: 2 }}
              />

              {/* SHA Number */}
              <TextField
                label={
                  <MDBox display="flex" alignItems="center">
                    <PermIdentityIcon fontSize="small" sx={{ mr: 1 }} /> SHA Number
                  </MDBox>
                }
                fullWidth
                margin="normal"
                variant="outlined"
                value={editSha}
                onChange={(e) => setEditSha(e.target.value)}
                sx={{ mb: 2 }}
              />

              {/* Save Button */}
              <MDBox mt={2} display="flex" justifyContent="flex-end">
                <MDButton variant="gradient" color="success" onClick={handleSave}>
                  Save Changes
                </MDButton>
              </MDBox>
            </Grid>
          </Grid>
        </Paper>
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

export default UserDetailsPage;
