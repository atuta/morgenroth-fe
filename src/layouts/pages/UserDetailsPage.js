// File: UserDetailsPage.js
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

// Icons
import EmailIcon from "@mui/icons-material/EmailOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoneyOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import FingerprintIcon from "@mui/icons-material/FingerprintOutlined";
import PaidIcon from "@mui/icons-material/PaidOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailableOutlined";
import EventBusyIcon from "@mui/icons-material/EventBusyOutlined";
import PermIdentityIcon from "@mui/icons-material/PermIdentityOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLongOutlined"; // Icon for Payslip

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import getUserDetailsApi from "../../api/getUserDetailsApi";
import updateUserFieldsApi from "../../api/updateUserFieldsApi";
import CustomAlert from "../../components/CustomAlert";

const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/?d=mp&s=80";

function UserDetailsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const userIdFromUrl = searchParams.get("user_id");

  const user_id = state?.user_id || userIdFromUrl;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingLeave, setTogglingLeave] = useState(false);
  const [generatingPayslip, setGeneratingPayslip] = useState(false);

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

  const initializeEditStates = (data) => {
    setEditRate(data.hourly_rate !== null ? String(data.hourly_rate) : "");
    setEditNssf(data.nssf_number || "");
    setEditSha(data.shif_sha_number || "");
  };

  // Fetch user details on mount
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
          initializeEditStates(fetchedData);
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

  const handleSave = async () => {
    if (!user_id) return;

    setSaving(true);

    try {
      console.log("Captured values before API call:", {
        user_id,
        hourly_rate: editRate,
        nssf: editNssf,
        sha: editSha,
      });

      const payload = {
        user_id,
        ...(editRate !== "" && { hourly_rate: editRate }),
        ...(editNssf !== "" && { nssf: editNssf }),
        ...(editSha !== "" && { sha: editSha }),
      };

      console.log("Payload sent to API:", payload);

      const res = await updateUserFieldsApi(payload);

      if (res.status === "success") {
        showAlert("User details updated successfully!", "success");

        // Update displayed data to reflect last saved values
        setUserData((prev) => ({
          ...prev,
          hourly_rate: editRate,
          nssf_number: editNssf,
          shif_sha_number: editSha,
        }));
      } else {
        showAlert(res.message || "Failed to update user details", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error while updating user details", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLeaveToggle = async (event) => {
    if (!user_id) return;
    const newLeaveStatus = event.target.checked;

    // Optimistically update the UI
    setUserData((prev) => ({ ...prev, is_on_leave: newLeaveStatus }));
    setTogglingLeave(true);

    try {
      // NOTE: Replace this with your actual API call to update the leave status
      await new Promise((resolve) => setTimeout(resolve, 800));

      showAlert(
        `User leave status updated to: ${newLeaveStatus ? "On Leave" : "Working"}`,
        "success"
      );
    } catch (err) {
      console.error(err);
      showAlert("Server error while updating leave status", "error");
      setUserData((prev) => ({ ...prev, is_on_leave: !newLeaveStatus })); // Revert
    } finally {
      setTogglingLeave(false);
    }
  };

  const handleGeneratePayslip = async () => {
    if (!user_id) return;
    setGeneratingPayslip(true);
    showAlert("Generating payslip...", "info");
    try {
      // NOTE: Replace this with your actual API call to trigger payslip generation/download
      await new Promise((resolve) => setTimeout(resolve, 1500));

      showAlert(`Payslip for ${userData.first_name} generated successfully!`, "success");
      // Add logic here to handle the file download, if applicable.
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
  } = userData;

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

        {/* Staff Details Card (Single Column) */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: "lg", mb: 3 }}>
          <MDTypography variant="h6" fontWeight="bold" mb={3}>
            Staff Information
          </MDTypography>

          <Grid container spacing={3}>
            {/* Main Content Column (Full width, or set to a desired column size like md={8}) */}
            <Grid item xs={12} md={8}>
              {/* General Details - TOP */}
              <MDTypography variant="body1" fontWeight="medium" mb={2}>
                General Details
              </MDTypography>

              <MDBox display="flex" alignItems="center" mb={1}>
                <EmailIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                <MDTypography component="span" variant="body2" fontWeight="bold">
                  Email:
                </MDTypography>
                <MDTypography component="span" variant="body2" ml={0.5}>
                  {email}
                </MDTypography>
              </MDBox>

              <MDBox display="flex" alignItems="center" mb={1}>
                <AccountCircleIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                <MDTypography component="span" variant="body2" fontWeight="bold">
                  Account:
                </MDTypography>
                <MDTypography component="span" variant="body2" ml={0.5}>
                  {account || "N/A"}
                </MDTypography>
              </MDBox>

              <MDBox display="flex" alignItems="center" mb={1}>
                <PhoneIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                <MDTypography component="span" variant="body2" fontWeight="bold">
                  Phone:
                </MDTypography>
                <MDTypography component="span" variant="body2" ml={0.5}>
                  {phone_number || "-"}
                </MDTypography>
              </MDBox>

              <MDBox display="flex" alignItems="center" mb={1}>
                <FingerprintIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                <MDTypography component="span" variant="body2" fontWeight="bold">
                  ID Number:
                </MDTypography>
                <MDTypography component="span" variant="body2" ml={0.5}>
                  {id_number || "-"}
                </MDTypography>
              </MDBox>

              <MDBox display="flex" alignItems="center" mb={3}>
                <EventAvailableIcon fontSize="small" sx={{ mr: 1, color: "success.main" }} />
                <MDTypography component="span" variant="body2" fontWeight="bold">
                  Present Today:
                </MDTypography>
                <MDTypography component="span" variant="body2" ml={0.5}>
                  {is_present_today ? "Yes" : "No"}
                </MDTypography>
              </MDBox>

              {/* Financial & Statutory - BOTTOM */}
              <MDTypography variant="body1" fontWeight="medium" mb={1} mt={3}>
                Financial & Statutory
              </MDTypography>

              <TextField
                label={
                  <MDBox display="flex" alignItems="center">
                    <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} /> Hourly Rate
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

              {/* SAVE CHANGES BUTTON */}
              <MDBox mt={2} display="flex" justifyContent="flex-start">
                <MDButton
                  variant="gradient"
                  color="success"
                  onClick={handleSave}
                  disabled={saving}
                  size="medium" // Explicitly setting size to medium
                  startIcon={saving && <CircularProgress size={20} />}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </MDButton>
              </MDBox>
            </Grid>
          </Grid>
        </Paper>

        {/* Leave Status Management Card */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: "lg", mb: 3 }}>
          <MDTypography variant="h6" fontWeight="bold" mb={2}>
            Leave Status Management
          </MDTypography>

          <MDBox display="flex" alignItems="center" justifyContent="space-between">
            <MDBox display="flex" alignItems="center">
              <EventBusyIcon
                fontSize="large"
                sx={{ mr: 1, color: is_on_leave ? "error.main" : "text.secondary" }}
              />
              <MDTypography variant="body1">
                Current Status:
                <MDTypography
                  component="span"
                  variant="body1"
                  fontWeight="bold"
                  color={is_on_leave ? "error" : "success"}
                  ml={1}
                >
                  {is_on_leave ? "ON LEAVE" : "WORKING"}
                </MDTypography>
              </MDTypography>
            </MDBox>

            <FormControlLabel
              control={
                <Switch
                  checked={is_on_leave}
                  onChange={handleLeaveToggle}
                  disabled={togglingLeave}
                />
              }
              label={
                togglingLeave ? (
                  <CircularProgress size={20} />
                ) : is_on_leave ? (
                  "Set to Working"
                ) : (
                  "Set to On Leave"
                )
              }
              labelPlacement="start"
            />
          </MDBox>
          <MDTypography variant="caption" color="text.secondary" mt={1}>
            Use this switch to manually set the employee&apos;s current leave status.
          </MDTypography>
        </Paper>

        {/* Payslip Action Card - AT THE VERY BOTTOM */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: "lg" }}>
          <MDBox
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="flex-start"
          >
            <MDTypography variant="h6" fontWeight="bold" mb={2}>
              Payroll Actions
            </MDTypography>
            <ReceiptLongIcon sx={{ fontSize: 80, color: "info.main", mb: 2 }} />
            <MDTypography variant="body1" color="text" textAlign="left" mb={2}>
              Generate the employee&apos;s monthly payslip based on current rates.
            </MDTypography>
            <MDButton
              variant="gradient"
              color="info"
              onClick={handleGeneratePayslip}
              disabled={generatingPayslip}
              startIcon={generatingPayslip && <CircularProgress size={20} color="white" />}
              size="medium" // ✅ MODIFICATION: Set size to medium (same as Save Changes)
              sx={{ width: "auto" }}
            >
              {generatingPayslip ? "Generating..." : "Generate Payslip"}
            </MDButton>
          </MDBox>
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
