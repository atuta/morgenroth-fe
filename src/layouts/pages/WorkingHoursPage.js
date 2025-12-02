// File: WorkingHoursPage.js

import { useState, useEffect } from "react";
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

// API services
import setWorkingHoursApi from "../../api/setWorkingHoursApi";
import getWorkingHoursApi from "../../api/getWorkingHoursApi";

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

  const [workingHoursList, setWorkingHoursList] = useState([]);

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

  // Fetch existing working hours on page load
  useEffect(() => {
    const fetchWorkingHours = async () => {
      try {
        const res = await getWorkingHoursApi(DEFAULT_TIMEZONE);
        if (res.data?.status === "success" && Array.isArray(res.data.data)) {
          setWorkingHoursList(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch working hours:", err);
      }
    };

    fetchWorkingHours();
  }, []);

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

        // Update or add the record in the UI
        setWorkingHoursList((prev) => {
          const existingIndex = prev.findIndex((item) => item.day_of_week === payload.day_of_week);
          const newEntry = {
            day_of_week: payload.day_of_week,
            day_name: dayOfWeek,
            start_time: startTime,
            end_time: endTime,
            timezone: DEFAULT_TIMEZONE,
            is_active: true,
          };

          if (existingIndex > -1) {
            const updated = [...prev];
            updated[existingIndex] = newEntry;
            return updated;
          } else {
            return [...prev, newEntry];
          }
        });

        // Reset form
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

            {/* Display existing working hours */}
            <MDBox mb={2}>
              {workingHoursList.length > 0 ? (
                <>
                  <MDTypography variant="subtitle2">Existing Working Hours:</MDTypography>
                  {workingHoursList.map((cfg) => (
                    <MDTypography key={cfg.day_of_week} variant="caption" display="block">
                      {cfg.day_name}: {cfg.start_time} - {cfg.end_time}
                    </MDTypography>
                  ))}
                </>
              ) : (
                <MDTypography variant="subtitle2">No working hours configured yet.</MDTypography>
              )}
            </MDBox>

            <Grid container spacing={3}>
              {/* Day of Week Selector Buttons */}
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

              {/* Timezone Info */}
              <Grid item xs={12}>
                <MDTypography variant="caption" color="text" fontWeight="medium">
                  Timezone: Africa/Nairobi (EAT)
                </MDTypography>
              </Grid>

              {/* Start Time */}
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

              {/* End Time */}
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
