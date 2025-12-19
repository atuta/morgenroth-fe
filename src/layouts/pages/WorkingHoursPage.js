// File: WorkingHoursPage.js

import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";

// Material UI Table Components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";

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

// API services
import setWorkingHoursApi from "../../api/setWorkingHoursApi";
import getWorkingHoursApi from "../../api/getWorkingHoursApi";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const dayToNumberMap = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

const USER_ROLES = [
  { value: "super", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "office", label: "Office" },
  { value: "teaching", label: "Teaching" },
  { value: "subordinate", label: "Subordinate" },
];

const DEFAULT_TIMEZONE = "Africa/Nairobi";

function WorkingHoursPage() {
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [userRole, setUserRole] = useState("subordinate");
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

    if (startTime && endTime) {
      const startDateTime = new Date(`2000-01-01T${startTime}:00`);
      const endDateTime = new Date(`2000-01-01T${endTime}:00`);
      if (startDateTime >= endDateTime) {
        newErrors.startTime = "Start Time must be before End Time.";
        newErrors.endTime = "End Time must be after Start Time.";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0 && newErrors.dayOfWeek) {
      showAlert("Please correct the highlighted errors.", "warning");
    }

    return Object.keys(newErrors).length === 0;
  };

  // Fetch working hours when the page loads or userRole changes
  useEffect(() => {
    const fetchWorkingHours = async () => {
      try {
        const res = await getWorkingHoursApi(userRole, DEFAULT_TIMEZONE);
        if (res.data?.status === "success" && Array.isArray(res.data.data)) {
          setWorkingHoursList(res.data.data);
        } else {
          setWorkingHoursList([]);
        }
      } catch (err) {
        console.error("Failed to fetch working hours:", err);
      }
    };

    fetchWorkingHours();
  }, [userRole]);

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
        user_role: userRole,
      };

      const res = await setWorkingHoursApi(payload);

      if (res.data?.status === "success") {
        showAlert("Working hours saved successfully", "success");

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
          <MDBox p={3} mb={3} bgColor="white" borderRadius="lg">
            <MDTypography variant="h5" fontWeight="bold" mb={2}>
              Working Hours
            </MDTypography>

            {/* --- User Role Selector --- */}
            <MDBox mb={2}>
              <MDTypography variant="caption" fontWeight="medium" mb={1}>
                Select User Role:
              </MDTypography>
              <TextField
                select
                fullWidth
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                SelectProps={{ native: true }}
              >
                {USER_ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </TextField>
            </MDBox>

            {/* --- Existing Working Hours Table --- */}
            <MDBox mb={4}>
              <MDTypography variant="subtitle2" fontWeight="medium" mb={1}>
                Existing Working Hours:
              </MDTypography>
              {workingHoursList.length > 0 ? (
                <TableContainer
                  component={Paper}
                  sx={{ boxShadow: "none", border: "1px solid #ddd" }}
                >
                  <Table size="small" aria-label="working hours table">
                    <TableBody>
                      <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                        <TableCell sx={{ padding: "8px 16px", fontWeight: "bold" }}>Day</TableCell>
                        <TableCell sx={{ padding: "8px 16px", fontWeight: "bold" }} align="center">
                          Start Time
                        </TableCell>
                        <TableCell sx={{ padding: "8px 16px", fontWeight: "bold" }} align="center">
                          End Time
                        </TableCell>
                      </TableRow>

                      {workingHoursList
                        .sort((a, b) => a.day_of_week - b.day_of_week)
                        .map((cfg) => (
                          <TableRow
                            key={cfg.day_of_week}
                            sx={{
                              backgroundColor:
                                dayToNumberMap[dayOfWeek] === cfg.day_of_week
                                  ? "#e0f7fa"
                                  : "inherit",
                            }}
                          >
                            <TableCell sx={{ padding: "8px 16px" }}>{cfg.day_name}</TableCell>
                            <TableCell sx={{ padding: "8px 16px" }} align="center">
                              {cfg.start_time}
                            </TableCell>
                            <TableCell sx={{ padding: "8px 16px" }} align="center">
                              {cfg.end_time}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <MDTypography variant="caption" display="block" color="text">
                  No working hours configured yet.
                </MDTypography>
              )}
            </MDBox>

            {/* --- Form Inputs --- */}
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
                  Timezone: {DEFAULT_TIMEZONE} (EAT)
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
                  helperText={errors.startTime}
                />
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
                  helperText={errors.endTime}
                />
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
