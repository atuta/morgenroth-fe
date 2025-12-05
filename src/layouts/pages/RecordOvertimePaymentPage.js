// File: RecordOvertimePaymentPage.js
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";

// Icons
import PaymentsIcon from "@mui/icons-material/Payments";
import AccessTimeIcon from "@mui/icons-material/AccessTimeOutlined";
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
import { recordOvertimeAdminApi } from "../../api/overtimeAndAdvanceApi";
import Configs from "../../configs/Configs";

const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/?d=mp&s=80";

function RecordOvertimePaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const user_id = state?.user_id;
  const photo = state?.photo;
  const fullName = state?.fullName || "";

  const now = new Date();
  const currentMonth = now.getMonth() + 1; // JS months 0-11
  const currentYear = now.getFullYear();

  const [hours, setHours] = useState("");
  const [amount, setAmount] = useState("");
  const [remarks, setRemarks] = useState("");
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

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

  const handleSave = async () => {
    if (!user_id) return;

    if (!hours || isNaN(hours) || Number(hours) <= 0) {
      showAlert("Please enter valid hours.", "warning");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      showAlert("Please enter a valid amount.", "warning");
      return;
    }

    // Prevent future month/year
    if (year > currentYear || (year === currentYear && month > currentMonth)) {
      showAlert("Cannot record overtime for future months.", "warning");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        user_id,
        hours: Number(hours),
        amount: Number(amount),
        remarks: remarks || "",
        month: month ? Number(month) : undefined,
        year: year ? Number(year) : undefined,
      };

      const res = await recordOvertimeAdminApi(payload);

      if (res.ok && res.data?.status === "success") {
        showAlert("Overtime recorded successfully!", "success");
        setHours("");
        setAmount("");
        setRemarks("");
        setMonth(currentMonth);
        setYear(currentYear);
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

  // Month options dynamically based on selected year
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const allowedMonths = year === currentYear ? months.filter((m) => m <= currentMonth) : months;

  // Year options (cannot select future years)
  const years = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i).filter(
    (y) => y <= currentYear
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <MDBox sx={{ maxWidth: "600px", margin: "0 auto 0 0" }}>
          {/* User Header */}
          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <MDBox display="flex" alignItems="center" gap={3} flexWrap="wrap">
              <Avatar
                src={photo ? `${Configs.baseUrl}${photo}` : DEFAULT_AVATAR}
                sx={{ width: 80, height: 80 }}
              />
              <MDBox flexGrow={1} minWidth={200}>
                <MDTypography variant="h5" fontWeight="bold" mb={1}>
                  Overtime for {state?.full_name || "User"}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Enter overtime details for the selected user
                </MDTypography>
              </MDBox>
            </MDBox>
          </Paper>

          {/* Form */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: "lg" }}>
            <MDBox mb={2}>
              <Grid container spacing={3}>
                {/* Hours */}
                <Grid item xs={12}>
                  <TextField
                    label={
                      <MDBox display="flex" alignItems="center">
                        <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                        Hours
                      </MDBox>
                    }
                    fullWidth
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                  />
                </Grid>

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
                  />
                </Grid>

                {/* Remarks */}
                <Grid item xs={12}>
                  <TextField
                    label={
                      <MDBox display="flex" alignItems="center">
                        <EventNoteIcon fontSize="small" sx={{ mr: 1 }} />
                        Remarks
                      </MDBox>
                    }
                    fullWidth
                    multiline
                    rows={3}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
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
                    sx={{
                      "& .MuiInputBase-root": {
                        minHeight: 40,
                        paddingTop: 1,
                        paddingBottom: 1,
                      },
                    }}
                  >
                    {allowedMonths.map((m) => (
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
                    sx={{
                      "& .MuiInputBase-root": {
                        minHeight: 40,
                        paddingTop: 1,
                        paddingBottom: 1,
                      },
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
            </MDBox>

            <MDButton
              variant="gradient"
              color="info"
              fullWidth
              disabled={loading}
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
