import { useState, useEffect } from "react";
import PropTypes from "prop-types"; // Added for ESLint compliance
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
  { value: "admin", label: "Admin" },
  { value: "office", label: "Office" },
  { value: "teaching", label: "Teaching" },
  { value: "subordinate", label: "Subordinate" },
];

const DEFAULT_TIMEZONE = "Africa/Nairobi";

// --- Constants for Dropdowns ---
const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];

// --- Helper Component for Time Selection ---
const TimeSelector = ({ label, value, onChange, error, helperText }) => {
  const [h, m] = value && value.includes(":") ? value.split(":") : ["", ""];

  const handleHourChange = (e) => onChange(`${e.target.value}:${m || "00"}`);
  const handleMinChange = (e) => onChange(`${h || "00"}:${e.target.value}`);

  return (
    <MDBox>
      <MDTypography variant="caption" fontWeight="bold" color={error ? "error" : "text"}>
        {label}
      </MDTypography>
      <MDBox display="flex" gap={1} mt={0.5}>
        <TextField
          select
          fullWidth
          value={h}
          onChange={handleHourChange}
          SelectProps={{ native: true }}
          error={error}
        >
          <option value="" disabled>
            HH
          </option>
          {HOURS.map((hr) => (
            <option key={hr} value={hr}>
              {hr}
            </option>
          ))}
        </TextField>
        <TextField
          select
          fullWidth
          value={m}
          onChange={handleMinChange}
          SelectProps={{ native: true }}
          error={error}
        >
          <option value="" disabled>
            MM
          </option>
          {MINUTES.map((min) => (
            <option key={min} value={min}>
              {min}
            </option>
          ))}
        </TextField>
      </MDBox>
      {error && (
        <MDTypography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
          {helperText}
        </MDTypography>
      )}
    </MDBox>
  );
};

// PropTypes validation for the helper component
TimeSelector.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

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

    // Check if both HH and MM are selected
    if (!startTime || startTime.split(":").includes("") || startTime.length < 5) {
      newErrors.startTime = "Valid start time required.";
    }
    if (!endTime || endTime.split(":").includes("") || endTime.length < 5) {
      newErrors.endTime = "Valid end time required.";
    }

    if (startTime && endTime && startTime.length === 5 && endTime.length === 5) {
      const startVal = parseInt(startTime.replace(":", ""), 10);
      const endVal = parseInt(endTime.replace(":", ""), 10);
      if (startVal >= endVal) {
        newErrors.startTime = "Start must be before End.";
        newErrors.endTime = "End must be after Start.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
          }
          return [...prev, newEntry];
        });
        setStartTime("");
        setEndTime("");
        setDayOfWeek("");
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
              Working Hours
            </MDTypography>

            <MDBox mb={3}>
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

            <MDBox mb={4}>
              <MDTypography variant="subtitle2" fontWeight="medium" mb={1}>
                Existing Working Hours:
              </MDTypography>
              {workingHoursList.length > 0 ? (
                <TableContainer
                  component={Paper}
                  sx={{ boxShadow: "none", border: "1px solid #ddd" }}
                >
                  <Table size="small">
                    <TableBody>
                      <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                        <TableCell sx={{ fontWeight: "bold" }}>Day</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          Start
                        </TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold" }}>
                          End
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
                            <TableCell>{cfg.day_name}</TableCell>
                            <TableCell align="center">{cfg.start_time}</TableCell>
                            <TableCell align="center">{cfg.end_time}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <MDTypography variant="caption" color="text">
                  No working hours configured.
                </MDTypography>
              )}
            </MDBox>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MDTypography variant="caption" fontWeight="medium" color="text">
                  Select Day:
                </MDTypography>
                <MDBox display="flex" flexWrap="wrap" gap={1} mt={1}>
                  {daysOfWeek.map((day) => (
                    <MDButton
                      key={day}
                      variant={dayOfWeek === day ? "gradient" : "outlined"}
                      color="info"
                      size="small"
                      onClick={() => setDayOfWeek(day)}
                    >
                      {day}
                    </MDButton>
                  ))}
                </MDBox>
                {errors.dayOfWeek && (
                  <MDTypography variant="caption" color="error">
                    {errors.dayOfWeek}
                  </MDTypography>
                )}
              </Grid>

              <Grid item xs={6}>
                <TimeSelector
                  label="Start Time"
                  value={startTime}
                  onChange={setStartTime}
                  error={!!errors.startTime}
                  helperText={errors.startTime}
                />
              </Grid>

              <Grid item xs={6}>
                <TimeSelector
                  label="End Time"
                  value={endTime}
                  onChange={setEndTime}
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
              sx={{ mt: 4 }}
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
