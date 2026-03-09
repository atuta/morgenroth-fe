// File: RecordAdvancePaymentPage.js
import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";

// Icons
import PaymentsIcon from "@mui/icons-material/Payments";
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
import { createAdvanceAdminApi } from "../../api/overtimeAndAdvanceApi";
import Configs from "../../configs/Configs";

const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/?d=mp&s=80";

const sanitizeSignedInteger = (raw) => {
  if (raw == null) return "";

  // Keep only digits and '-'
  let v = String(raw).replace(/[^\d-]/g, "");

  // Only allow a single leading '-'
  const isNegative = v.startsWith("-");
  const digitsOnly = v.replace(/-/g, "");

  return (isNegative ? "-" : "") + digitsOnly;
};

const toISODate = (d) => {
  if (!d) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

function RecordAdvancePaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const user_id = state?.user_id;
  const photo = state?.photo;
  const fullName = state?.full_name || "User";

  const now = useMemo(() => new Date(), []);
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [selectedDate, setSelectedDate] = useState(toISODate(now));

  const [amountError, setAmountError] = useState("");
  const [remarksError, setRemarksError] = useState("");
  const [dateError, setDateError] = useState("");

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

    if (!amount || amount === "-" || !/^-?\d+$/.test(amount)) {
      setAmountError("Amount must be a valid number");
      valid = false;
    } else {
      setAmountError("");
    }

    if (!remarks.trim()) {
      setRemarksError("Remarks are required");
      valid = false;
    } else {
      setRemarksError("");
    }

    if (!selectedDate) {
      setDateError("Date is required");
      valid = false;
    } else {
      setDateError("");
    }

    return valid;
  };

  const handleSave = async () => {
    if (!user_id) return;
    if (!validate()) return;

    setLoading(true);
    try {
      const [yearStr, monthStr, dayStr] = selectedDate.split("-");

      const payload = {
        user_id,
        amount: Number(amount),
        remarks: remarks.trim(),
        day: Number(dayStr),
        month: Number(monthStr),
        year: Number(yearStr),
      };

      const res = await createAdvanceAdminApi(payload);

      if (res.ok && res.data?.status === "success") {
        showAlert("Advance payment recorded successfully!", "success");
        setAmount("");
        setRemarks("");
        // keep selected date as chosen
      } else {
        showAlert(res.data?.message || "Failed to record advance.", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error. Could not save advance payment.", "error");
    } finally {
      setLoading(false);
    }
  };

  const avatarSrc = photo ? `${Configs.baseUrl}${photo}` : DEFAULT_AVATAR;
  const inputSx = { "& .MuiInputBase-root": { minHeight: 56 } };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <MDBox sx={{ maxWidth: "600px", margin: "0 auto 0 0" }}>
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <MDBox display="flex" alignItems="center" gap={3} flexWrap="wrap">
              <Avatar src={avatarSrc} sx={{ width: 80, height: 80 }} />
              <MDBox flexGrow={1} minWidth={200}>
                <MDTypography variant="h5" fontWeight="bold" mb={1}>
                  Advance Payment to {fullName}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Enter advance details for the selected user
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

          <Paper elevation={0} sx={{ p: 3, borderRadius: "lg" }}>
            <MDBox mb={2}>
              <Grid container spacing={3}>
                {/* Amount */}
                <Grid item xs={12}>
                  <TextField
                    label="Amount (KES)"
                    fullWidth
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(sanitizeSignedInteger(e.target.value))}
                    error={Boolean(amountError)}
                    helperText={amountError}
                    inputProps={{
                      inputMode: "numeric",
                      pattern: "-?[0-9]*",
                    }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      sx: {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: amountError ? "red" : undefined,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: amountError ? "red" : undefined,
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
                    error={Boolean(remarksError)}
                    helperText={remarksError}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      sx: {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: remarksError ? "red" : undefined,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: remarksError ? "red" : undefined,
                        },
                        "& textarea": {
                          paddingLeft: "14px",
                          paddingTop: "14px",
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Date Picker */}
                <Grid item xs={12}>
                  <TextField
                    type="date"
                    label="Advance Date"
                    fullWidth
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    error={Boolean(dateError)}
                    helperText={dateError}
                    InputLabelProps={{ shrink: true }}
                    sx={inputSx}
                  />
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
              {loading ? <CircularProgress size={20} color="inherit" /> : "Record Advance Payment"}
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

export default RecordAdvancePaymentPage;
