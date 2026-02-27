// File: RecordOvertimePaymentPage.js
import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";

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
import { recordOvertimeAdminApi } from "../../api/overtimeAndAdvanceApi";
import Configs from "../../configs/Configs";

const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/?d=mp&s=80";

/**
 * Allows:
 *  - digits only (e.g. "123")
 *  - optional single leading '-' (e.g. "-123")
 * Rejects all other characters.
 */
const sanitizeSignedInteger = (raw) => {
  if (raw == null) return "";
  let v = String(raw).replace(/[^\d-]/g, "");
  const isNegative = v.startsWith("-");
  const digitsOnly = v.replace(/-/g, "");
  return (isNegative ? "-" : "") + digitsOnly;
};

function RecordOvertimePaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const user_id = state?.user_id;
  const photo = state?.photo;
  const fullName = state?.full_name || "User";

  const now = useMemo(() => new Date(), []);
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // NOTE: hours & amount are strings because we sanitize as user types
  const [hours, setHours] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const [errors, setErrors] = useState({});
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

  const validateFields = () => {
    const newErrors = {};

    // Hours: positive integer only
    if (!hours || hours === "-" || !/^\d+$/.test(hours) || Number(hours) <= 0) {
      newErrors.hours = "Please enter valid hours (positive number).";
    }

    // Amount: allow signed integers (negative allowed), but disallow empty / just "-"
    if (!amount || amount === "-" || !/^-?\d+$/.test(amount)) {
      newErrors.amount = "Please enter a valid amount.";
    }

    if (!remarks || remarks.trim() === "") {
      newErrors.remarks = "Remarks are required.";
    }

    if (year > currentYear || (year === currentYear && month > currentMonth)) {
      newErrors.date = "Cannot record overtime for future months.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!user_id) return;
    if (!validateFields()) return;

    setLoading(true);
    try {
      const payload = {
        user_id,
        hours: Number(hours),
        amount: Number(amount),
        remarks: remarks.trim(),
        month,
        year,
      };

      const res = await recordOvertimeAdminApi(payload);

      if (res.ok && res.data?.status === "success") {
        showAlert("Overtime recorded successfully!", "success");
        setHours("");
        setAmount("");
        setRemarks("");
      } else {
        showAlert(res.data?.message || "Failed to record overtime.", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error. Could not save overtime.", "error");
    } finally {
      setLoading(false);
    }
  };

  const avatarSrc = photo ? `${Configs.baseUrl}${photo}` : DEFAULT_AVATAR;

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <MDBox sx={{ maxWidth: "600px", margin: "0 auto 0 0" }}>
          {/* User Header */}
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <MDBox display="flex" alignItems="center" gap={3} flexWrap="wrap">
              <Avatar src={avatarSrc} sx={{ width: 80, height: 80 }} />
              <MDBox flexGrow={1} minWidth={200}>
                <MDTypography variant="h5" fontWeight="bold" mb={1}>
                  Overtime for {fullName}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Enter overtime details for the selected user
                </MDTypography>
              </MDBox>

              {!user_id && (
                <MDButton
                  variant="outlined"
                  color="info"
                  onClick={() => navigate(-1)}
                  sx={{ whiteSpace: "nowrap" }}
                >
                  Go Back
                </MDButton>
              )}
            </MDBox>
          </Paper>

          {/* Form */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: "lg" }}>
            <MDBox mb={2}>
              <Grid container spacing={3}>
                {/* Hours */}
                <Grid item xs={12}>
                  <TextField
                    label="Hours (Required)"
                    fullWidth
                    type="text"
                    value={hours}
                    onChange={(e) =>
                      // hours should be digits only (no minus)
                      setHours(String(e.target.value).replace(/[^\d]/g, ""))
                    }
                    error={Boolean(errors.hours)}
                    helperText={errors.hours}
                    inputProps={{
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                    }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      sx: {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: errors.hours ? "red" : undefined,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: errors.hours ? "red" : undefined,
                        },
                        "& .MuiOutlinedInput-input": {
                          paddingLeft: "14px",
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Amount */}
                <Grid item xs={12}>
                  <TextField
                    label="Lumpsum Amount (KES) (Required)"
                    fullWidth
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(sanitizeSignedInteger(e.target.value))}
                    error={Boolean(errors.amount)}
                    helperText={errors.amount}
                    inputProps={{
                      inputMode: "numeric",
                      pattern: "-?[0-9]*",
                    }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      sx: {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: errors.amount ? "red" : undefined,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: errors.amount ? "red" : undefined,
                        },
                        "& .MuiOutlinedInput-input": {
                          paddingLeft: "14px",
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Remarks */}
                <Grid item xs={12}>
                  <TextField
                    label="Remarks (Required)"
                    fullWidth
                    multiline
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    error={Boolean(errors.remarks)}
                    helperText={errors.remarks}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      sx: {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: errors.remarks ? "red" : undefined,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: errors.remarks ? "red" : undefined,
                        },
                        // Removes weird left indent for multiline
                        "& textarea": {
                          paddingLeft: "14px",
                          paddingTop: "14px",
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
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      sx: {
                        minHeight: 56,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: errors.date ? "red" : undefined,
                        },
                      },
                    }}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <MenuItem key={m} value={m}>
                        {m}
                      </MenuItem>
                    ))}
                  </TextField>
                  {errors.date && (
                    <MDTypography variant="caption" color="error">
                      {errors.date}
                    </MDTypography>
                  )}
                </Grid>

                {/* Year */}
                <Grid item xs={6}>
                  <TextField
                    select
                    label="Year"
                    fullWidth
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      sx: {
                        minHeight: 56,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: errors.date ? "red" : undefined,
                        },
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
              disabled={loading || !user_id}
              onClick={handleSave}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : "Record Overtime"}
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

export default RecordOvertimePaymentPage;
