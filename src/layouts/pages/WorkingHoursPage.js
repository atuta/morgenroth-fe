import { useState } from "react";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Standard Material UI components
import TextField from "@mui/material/TextField";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Custom components
import CustomAlert from "../../components/CustomAlert";

// API service
import setWorkingHoursApi from "../../api/setWorkingHoursApi";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// Mapping day string to integer for backend
const dayToNumberMap = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

const DEFAULT_TIMEZONE = "Africa/Nairobi";

function WorkingHoursPage() {
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const showAlert = (message, severity = "info") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!dayOfWeek) newErrors.dayOfWeek = "Day of week is required.";
    if (!startTime) newErrors.startTime = "Start time is required.";
    if (!endTime) newErrors.endTime = "End time is required.";

    if (startTime && endTime && startTime >= endTime) {
      newErrors.startTime = "Start Time must be before End Time.";
      newErrors.endTime = "End Time must be after Start Time.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showAlert("Please correct the highlighted errors.", "warning");
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    setAlertOpen(false);
    setLoading(true);

    try {
      const payload = {
        day_of_week: dayToNumberMap[dayOfWeek],
        start_time: startTime,
        end_time: endTime,
        timezone: DEFAULT_TIMEZONE,
      };

      const res = await setWorkingHoursApi(payload);

      if (res.data?.status === "success") {
        showAlert("Working hours saved successfully", "success");
        setDayOfWeek("");
        setStartTime("");
        setEndTime("");
        setErrors({});
      } else {
        showAlert(res.data?.message || "Failed to save working hours.", "error");
      }
    } catch {
      showAlert("Server error. Could not connect to the API.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox sx={{ maxWidth: "600px", margin: "0 auto 0 0" }}>
          <MDBox p={3} mb={3} bgColor="white" borderRadius="lg" shadow="md">
            <MDTypography variant="h5" fontWeight="bold" mb={2}>
              Set Working Hours
            </MDTypography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MDTypography variant="caption" fontWeight="medium" color="text" sx={{ mb: 1 }}>
                  Select Day of Week:
                </MDTypography>
                <MDBox display="flex" flexWrap="wrap" gap={1} mb={errors.dayOfWeek ? 0 : 1}>
                  {daysOfWeek.map((day) => (
                    <MDButton
                      key={day}
                      variant={dayOfWeek === day ? "gradient" : "outlined"}
                      color="info"
                      onClick={() => setDayOfWeek(day)}
                      sx={{
                        borderColor: errors.dayOfWeek ? "error.main" : undefined,
                        borderWidth: errors.dayOfWeek ? "2px" : "1px",
                      }}
                    >
                      {day}
                    </MDButton>
                  ))}
                </MDBox>
                {errors.dayOfWeek && (
                  <MDBox mt={0.5} mb={2}>
                    <MDTypography variant="caption" color="error">
                      {errors.dayOfWeek}
                    </MDTypography>
                  </MDBox>
                )}
              </Grid>

              <Grid item xs={12}>
                <MDTypography variant="caption" color="text" fontWeight="medium">
                  Timezone: Africa/Nairobi (EAT)
                </MDTypography>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="Start Time"
                  type="time"
                  fullWidth
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.startTime}
                />
                {errors.startTime && (
                  <MDBox mt={0.5}>
                    <MDTypography variant="caption" color="error">
                      {errors.startTime}
                    </MDTypography>
                  </MDBox>
                )}
              </Grid>

              <Grid item xs={6}>
                <TextField
                  label="End Time"
                  type="time"
                  fullWidth
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.endTime}
                />
                {errors.endTime && (
                  <MDBox mt={0.5}>
                    <MDTypography variant="caption" color="error">
                      {errors.endTime}
                    </MDTypography>
                  </MDBox>
                )}
              </Grid>
            </Grid>

            <MDButton
              variant="gradient"
              color="info"
              fullWidth
              disabled={loading}
              onClick={handleSave}
              sx={{ mt: 3 }}
            >
              {loading ? "Saving..." : "Save Working Hours"}
            </MDButton>
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

export default WorkingHoursPage;
