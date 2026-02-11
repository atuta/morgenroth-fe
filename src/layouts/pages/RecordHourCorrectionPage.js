// File: RecordHourCorrectionPage.js
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";

// Icons
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventNoteIcon from "@mui/icons-material/EventNoteOutlined";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Custom components
import CustomAlert from "../../components/CustomAlert";

// API service
import recordHourCorrectionApi from "../../api/recordHourCorrectionApi";
import Configs from "../../configs/Configs";

const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/?d=mp&s=80";

function RecordHourCorrectionPage() {
  const { state } = useLocation();

  const user_id = state?.user_id;
  const photo = state?.photo;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [hours, setHours] = useState("");
  const [reason, setReason] = useState("");

  // NEW (same logic as previous page)
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const [hoursError, setHoursError] = useState("");
  const [reasonError, setReasonError] = useState("");

  const [loading, setLoading] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const showAlert = (msg, severity = "info") => {
    setAlertMessage(msg);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  useEffect(() => {
    if (!user_id) {
      showAlert("No user selected. Go back and select a user.", "error");
    }
  }, [user_id]);

  const validate = () => {
    let valid = true;

    if (!hours || isNaN(hours) || Number(hours) === 0) {
      setHoursError("Hours must be a non-zero number");
      valid = false;
    } else {
      setHoursError("");
    }

    if (!reason.trim()) {
      setReasonError("Reason is required");
      valid = false;
    } else {
      setReasonError("");
    }

    return valid;
  };

  const handleSave = async () => {
    if (!user_id) return;
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        user_id,
        hours: Number(hours),
        reason: reason.trim(),
        month,
        year,
      };

      const res = await recordHourCorrectionApi(payload);

      if (res?.status === "success") {
        showAlert("Hour correction recorded successfully!", "success");
        setHours("");
        setReason("");
      } else {
        showAlert(res?.message || "Failed to record hour correction.", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error. Could not save hour correction.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <MDBox sx={{ maxWidth: "600px", margin: "0 auto 0 0" }}>
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <MDBox display="flex" alignItems="center" gap={3} flexWrap="wrap">
              <Avatar
                src={photo ? `${Configs.baseUrl}${photo}` : DEFAULT_AVATAR}
                sx={{ width: 80, height: 80 }}
              />
              <MDBox flexGrow={1} minWidth={200}>
                <MDTypography variant="h5" fontWeight="bold" mb={1}>
                  Hour Correction for {state?.full_name || "User"}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Enter manual hour correction details for the selected user
                </MDTypography>
              </MDBox>
            </MDBox>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: "lg" }}>
            <MDBox mb={2}>
              <Grid container spacing={3}>
                {/* Hours */}
                <Grid item xs={12}>
                  <TextField
                    label={
                      <MDBox display="flex" alignItems="center">
                        <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                        Hours (positive or negative)
                      </MDBox>
                    }
                    fullWidth
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    error={Boolean(hoursError)}
                    helperText={hoursError}
                    InputProps={{
                      sx: {
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: hoursError ? "red" : undefined,
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: hoursError ? "red" : undefined,
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Reason */}
                <Grid item xs={12}>
                  <TextField
                    label={
                      <MDBox display="flex" alignItems="center">
                        <EventNoteIcon fontSize="small" sx={{ mr: 1 }} />
                        Reason (Required)
                      </MDBox>
                    }
                    fullWidth
                    multiline
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    error={Boolean(reasonError)}
                    helperText={reasonError}
                    InputProps={{
                      sx: {
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: reasonError ? "red" : undefined,
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: reasonError ? "red" : undefined,
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Month */}
                <Grid item xs={6}>
                  <TextField
                    select
                    label="Month"
                    fullWidth
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    InputProps={{
                      sx: {
                        minHeight: 56,
                      },
                    }}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <MenuItem key={m} value={m}>
                        {m}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Year */}
                <Grid item xs={6}>
                  <TextField
                    select
                    label="Year"
                    fullWidth
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    InputProps={{
                      sx: {
                        minHeight: 56,
                      },
                    }}
                  >
                    {Array.from({ length: 6 }, (_, i) => currentYear - i).map((y) => (
                      <MenuItem key={y} value={y}>
                        {y}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </MDBox>

            <MDButton
              variant="gradient"
              color="info"
              fullWidth
              disabled={loading}
              onClick={handleSave}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Record Hour Correction"}
            </MDButton>
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

export default RecordHourCorrectionPage;
