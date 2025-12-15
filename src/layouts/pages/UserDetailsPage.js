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
import MenuItem from "@mui/material/MenuItem";

// Icons
import EmailIcon from "@mui/icons-material/EmailOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoneyOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import FingerprintIcon from "@mui/icons-material/FingerprintOutlined";
import PaidIcon from "@mui/icons-material/PaidOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailableOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTimeOutlined";
import EventBusyIcon from "@mui/icons-material/EventBusyOutlined";
import PermIdentityIcon from "@mui/icons-material/PermIdentityOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLongOutlined";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import getUserDetailsApi from "../../api/getUserDetailsApi";
import updateUserFieldsApi from "../../api/updateUserFieldsApi";
import updateUserLeaveStatusApi from "../../api/updateUserLeaveStatusApi"; // NEW
import CustomAlert from "../../components/CustomAlert";
import Configs from "../../configs/Configs";
import { adminGenerateUserPayslipPdfApi } from "../../api/payrollAndCompensationApi";

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
  const [editLunchStart, setEditLunchStart] = useState("");
  const [editLunchEnd, setEditLunchEnd] = useState("");

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  // Payslip dropdown state
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const allowedMonths = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i).reverse();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const showAlert = (msg, severity = "info") => {
    setAlertMessage(msg);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const initializeEditStates = (data) => {
    setEditRate(data.hourly_rate !== null ? String(data.hourly_rate) : "");
    setEditNssf(data.nssf_number || "");
    setEditSha(data.shif_sha_number || "");
    setEditLunchStart(data.lunch_start ? String(data.lunch_start) : "");
    setEditLunchEnd(data.lunch_end ? String(data.lunch_end) : "");
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

    // Only save if both lunch start and end are provided when either is set
    if (
      (editLunchStart !== "" || editLunchEnd !== "") &&
      (editLunchStart === "" || editLunchEnd === "")
    ) {
      showAlert("Both lunch start and end times must be provided", "error");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        user_id,
        ...(editRate !== "" && { hourly_rate: editRate }),
        ...(editNssf !== "" && { nssf: editNssf }),
        ...(editSha !== "" && { sha: editSha }),
        ...(editLunchStart !== "" && { lunch_start: Number(editLunchStart) }),
        ...(editLunchEnd !== "" && { lunch_end: Number(editLunchEnd) }),
      };

      const res = await updateUserFieldsApi(payload);

      if (res.status === "success") {
        showAlert("User details updated successfully!", "success");
        setUserData((prev) => ({
          ...prev,
          hourly_rate: editRate,
          nssf_number: editNssf,
          shif_sha_number: editSha,
          lunch_start: editLunchStart !== "" ? Number(editLunchStart) : prev.lunch_start,
          lunch_end: editLunchEnd !== "" ? Number(editLunchEnd) : prev.lunch_end,
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

    setUserData((prev) => ({ ...prev, is_on_leave: newLeaveStatus }));
    setTogglingLeave(true);

    try {
      await updateUserLeaveStatusApi({
        user_id,
        is_on_leave: newLeaveStatus, // service converts boolean -> "yes"/"no"
      });

      showAlert(
        `User leave status updated to: ${newLeaveStatus ? "On Leave" : "Working"}`,
        "success"
      );
    } catch (err) {
      console.error(err);
      showAlert("Server error while updating leave status", "error");
      setUserData((prev) => ({ ...prev, is_on_leave: !newLeaveStatus })); // revert
    } finally {
      setTogglingLeave(false);
    }
  };

  const handleGeneratePayslip = async () => {
    if (!userData || !user_id) return;

    const todayDate = new Date();
    if (
      year > todayDate.getFullYear() ||
      (year === todayDate.getFullYear() && month > todayDate.getMonth() + 1)
    ) {
      showAlert("Cannot generate payslip for a future month/year", "error");
      return;
    }

    setGeneratingPayslip(true);
    showAlert("Generating payslip...", "info");

    try {
      const params = { user_id, month, year };
      const res = await adminGenerateUserPayslipPdfApi(params);

      if (res.ok) {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(pdfBlob);
        const userFullName = `${userData.first_name || ""} ${userData.last_name || ""}`.trim();
        const sanitizedName = userFullName.replace(/\s+/g, "_");

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Payslip_${sanitizedName}_${month}_${year}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        showAlert(
          `Payslip for ${userData.first_name} ${userData.last_name} (${month}/${year}) downloaded successfully!`,
          "success"
        );
      } else {
        const errorText = await res.data.text();
        let errorMessage = "Failed to generate payslip";
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        showAlert(errorMessage, "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error while generating payslip", "error");
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

      <MDBox py={3}>
        <MDBox sx={{ margin: "0 auto 0 0" }}>
          <MDButton variant="outlined" color="info" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
            Back
          </MDButton>

          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <MDBox display="flex" alignItems="center" gap={3} flexWrap="wrap">
              <Avatar
                src={photo ? `${Configs.baseUrl}${photo}` : DEFAULT_AVATAR}
                sx={{ width: 80, height: 80 }}
              />
              <MDBox flexGrow={1} minWidth={200}>
                <MDTypography variant="h5" fontWeight="bold">
                  {first_name} {last_name}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {email}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {user_role} • {status}
                </MDTypography>

                <MDBox mt={2} display="flex" gap={2} flexWrap="wrap">
                  <MDButton
                    variant="outlined"
                    color="warning"
                    startIcon={<AttachMoneyIcon />}
                    onClick={() =>
                      navigate("/record-advance-payments", {
                        state: { user_id, photo, full_name: `${first_name} ${last_name}` },
                      })
                    }
                    size="medium"
                  >
                    Record Advance Payment
                  </MDButton>

                  <MDButton
                    variant="outlined"
                    color="info"
                    startIcon={<EventAvailableIcon />}
                    onClick={() =>
                      navigate("/record-overtime-payments", {
                        state: { user_id, photo, full_name: `${first_name} ${last_name}` },
                      })
                    }
                    size="medium"
                  >
                    Record Overtime Payment
                  </MDButton>

                  {/* New Hour Correction Button */}
                  <MDButton
                    variant="outlined"
                    color="secondary"
                    startIcon={<AccessTimeIcon />}
                    onClick={() =>
                      navigate("/hour-correction", {
                        state: { user_id, photo, full_name: `${first_name} ${last_name}` },
                      })
                    }
                    size="medium"
                  >
                    Record Hour Correction
                  </MDButton>
                </MDBox>
              </MDBox>
            </MDBox>
          </Paper>

          {/* Staff Details Card */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: "lg", mb: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
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
                    Present Now:
                  </MDTypography>
                  <MDTypography component="span" variant="body2" ml={0.5}>
                    {is_present_today ? "Yes" : "No"}
                  </MDTypography>
                </MDBox>

                <MDTypography variant="body1" fontWeight="medium" mb={1} mt={3}>
                  Financial & Statutory (Editable)
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

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      label="Lunch Start (24hr, e.g., 1300)"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      value={editLunchStart}
                      onChange={(e) => setEditLunchStart(e.target.value)}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Lunch End (24hr, e.g., 1400)"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      value={editLunchEnd}
                      onChange={(e) => setEditLunchEnd(e.target.value)}
                      type="number"
                    />
                  </Grid>
                </Grid>

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

                <MDBox mt={2} display="flex" justifyContent="flex-start">
                  <MDButton
                    variant="gradient"
                    color="success"
                    onClick={handleSave}
                    disabled={saving}
                    size="medium"
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

            <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
              <Grid item xs={12} sm={6}>
                <MDBox display="flex" alignItems="center">
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
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: { xs: "left", sm: "right" } }}>
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
              </Grid>
            </Grid>

            <MDTypography variant="caption" color="text.secondary" mt={1}>
              Use this switch to manually set the employee&apos;s current leave status.
            </MDTypography>
          </Paper>

          {/* Payslip Action Card */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: "lg" }}>
            <MDBox display="flex" flexDirection="column" alignItems="flex-start">
              <MDTypography variant="h6" fontWeight="bold" mb={2}>
                Generate Payslip
              </MDTypography>

              <Grid container spacing={2} mb={2} sx={{ maxWidth: 400, width: "100%" }}>
                <Grid item xs={6}>
                  <TextField
                    select
                    label="Month"
                    fullWidth
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    size="small"
                    sx={{
                      "& .MuiInputBase-root": { minHeight: 48, paddingTop: 0, paddingBottom: 0 },
                    }}
                  >
                    {allowedMonths.map((m) => (
                      <MenuItem key={m} value={m}>
                        {m}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    select
                    label="Year"
                    fullWidth
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    size="small"
                    sx={{
                      "& .MuiInputBase-root": { minHeight: 48, paddingTop: 0, paddingBottom: 0 },
                    }}
                  >
                    {years.map((y) => (
                      <MenuItem key={y} value={y}>
                        {y}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <MDButton
                variant="gradient"
                color="info"
                onClick={handleGeneratePayslip}
                disabled={generatingPayslip}
                startIcon={generatingPayslip && <CircularProgress size={20} color="white" />}
                size="medium"
                sx={{ width: "auto" }}
              >
                {generatingPayslip ? "Generating..." : "Generate Payslip"}
              </MDButton>
              <MDTypography variant="caption" color="text.secondary" mt={1}>
                Only current or previous months can be selected.
              </MDTypography>
            </MDBox>
          </Paper>
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

export default UserDetailsPage;
