// File: RecordAdvancePaymentPage.js
import { useState, useEffect } from "react";
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

function RecordAdvancePaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const user_id = state?.user_id;
  const photo = state?.photo;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");

  const [amountError, setAmountError] = useState("");
  const [remarksError, setRemarksError] = useState("");

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

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setAmountError("Amount must be a positive number");
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

    return valid;
  };

  const handleSave = async () => {
    if (!user_id) return;

    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        user_id,
        amount: Number(amount),
        remarks: remarks.trim(),
        month: currentMonth,
        year: currentYear,
      };

      const res = await createAdvanceAdminApi(payload);

      if (res.ok && res.data?.status === "success") {
        showAlert("Advance payment recorded successfully!", "success");
        setAmount("");
        setRemarks("");
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
                  Advance Payment to {state?.full_name || "User"}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Enter advance details for the selected user
                </MDTypography>
              </MDBox>
            </MDBox>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, borderRadius: "lg" }}>
            <MDBox mb={2}>
              <Grid container spacing={3}>
                {/* Amount */}
                <Grid item xs={12}>
                  <TextField
                    label={
                      <MDBox display="flex" alignItems="center">
                        <PaymentsIcon fontSize="small" sx={{ mr: 1 }} />
                        Amount (KES)
                      </MDBox>
                    }
                    fullWidth
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    error={Boolean(amountError)}
                    helperText={amountError}
                    InputProps={{
                      sx: {
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: amountError ? "red" : undefined,
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: amountError ? "red" : undefined,
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Remarks */}
                <Grid item xs={12}>
                  <TextField
                    label={
                      <MDBox display="flex" alignItems="center">
                        <EventNoteIcon fontSize="small" sx={{ mr: 1 }} />
                        Remarks (Required)
                      </MDBox>
                    }
                    fullWidth
                    multiline
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    error={Boolean(remarksError)}
                    helperText={remarksError}
                    InputProps={{
                      sx: {
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: remarksError ? "red" : undefined,
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: remarksError ? "red" : undefined,
                        },
                      },
                    }}
                  />
                </Grid>

                {/* Month (read-only & unclickable) */}
                <Grid item xs={6}>
                  <TextField
                    label="Month"
                    fullWidth
                    value={currentMonth}
                    InputProps={{
                      readOnly: true,
                      sx: {
                        minHeight: 56,
                        "& input": { pointerEvents: "none", color: "text.primary" }, // unclickable & normal text color
                      },
                    }}
                  />
                </Grid>

                {/* Year (read-only & unclickable) */}
                <Grid item xs={6}>
                  <TextField
                    label="Year"
                    fullWidth
                    value={currentYear}
                    InputProps={{
                      readOnly: true,
                      sx: {
                        minHeight: 56,
                        "& input": { pointerEvents: "none", color: "text.primary" }, // unclickable & normal text color
                      },
                    }}
                  />
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
