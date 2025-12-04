// File: TodayAttendancePage.js

import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import CustomAlert from "../../components/CustomAlert";
import Configs from "../../configs/Configs";

import getTodayUserTimeSummaryApi from "../../api/getTodayUserTimeSummaryApi";

const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/?d=mp&s=40";
const COLUMN_COUNT = 7;

const formatTime = (isoString) => {
  if (!isoString || isoString === "open") return isoString || "-";
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("default", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
};

const calculateLiveHours = (clockIn) => {
  if (!clockIn) return "-";
  const start = new Date(clockIn);
  const now = new Date();
  const diffMs = now - start;
  if (diffMs < 0) return "0:00:00";
  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  const seconds = Math.floor((diffMs % 60000) / 1000);
  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

function TodayAttendancePage() {
  const [attendanceList, setAttendanceList] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [tick, setTick] = useState(0);

  const showAlert = (message, severity = "info") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const res = await getTodayUserTimeSummaryApi();
        let attendanceData = [];
        if (res.data?.message && Array.isArray(res.data.message)) {
          attendanceData = res.data.message;
        }

        const normalizedData = attendanceData.map((item) => ({
          user_id: item.user_id || "",
          full_name: item.full_name || "",
          user_role: item.user_role || "-",
          earliest_clock_in: item.earliest_clock_in || "-",
          latest_clock_out: item.latest_clock_out || "open",
          total_hours: item.total_hours_worked ?? 0,
          photo: item.user_photo_url || DEFAULT_AVATAR,
          status: item.latest_session_status || "open",
        }));

        setAttendanceList(normalizedData);
        setFilteredAttendance(normalizedData);
      } catch (err) {
        console.error(err);
        showAlert("Server error. Could not fetch attendance.", "error");
        setAttendanceList([]);
        setFilteredAttendance([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredAttendance(attendanceList);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = attendanceList.filter((item) => {
      return (
        (item.full_name || "").toLowerCase().includes(term) ||
        (item.user_role || "").toLowerCase().includes(term) ||
        (item.status || "").toLowerCase().includes(term)
      );
    });
    setFilteredAttendance(filtered);
  }, [searchTerm, attendanceList]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Full-width Card Container */}
        <MDBox p={3} mb={3} width="100%" bgColor="white" borderRadius="lg">
          <MDTypography variant="h5" fontWeight="bold" mb={2}>
            Today&apos;s Attendance
          </MDTypography>

          {/* Search Field */}
          <MDBox mb={2}>
            <TextField
              // Keep the label as a simple string; MU will handle shrinking/disappearing
              label="Search by name, role, or status"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // Use 'outlined' variant. The border appears on focus (click) and disappears when blurred.
              variant="outlined"
              InputProps={{
                // Add the search icon as an adornment inside the input border
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                // Keep the styling for background and border radius
                sx: {
                  backgroundColor: "white",
                  borderRadius: 2,
                  "& input": { backgroundColor: "white" },
                },
              }}
              // Removed custom InputLabelProps to let MUI handle the label shrink/float animation
            />
          </MDBox>

          {/* Attendance Table */}
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 600, border: "1px solid #ddd", boxShadow: "none" }}
          >
            <Table stickyHeader aria-label="attendance table">
              <TableBody>
                <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                  <TableCell sx={{ fontWeight: "bold", width: "8%", padding: "12px 8px" }}>
                    Photo
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>{" "}
                  {/* Removed fixed width to allow natural expansion */}
                  <TableCell sx={{ fontWeight: "bold", width: "12%", textAlign: "center" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "15%", textAlign: "center" }}>
                    Clock In
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "15%", textAlign: "center" }}>
                    Clock Out
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "15%", textAlign: "center" }}>
                    Total Hours
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "15%", textAlign: "center" }}>
                    Actions
                  </TableCell>
                </TableRow>

                {loading ? (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={24} />
                      <MDTypography variant="body2" color="text" mt={1}>
                        Loading attendance data...
                      </MDTypography>
                    </TableCell>
                  </TableRow>
                ) : filteredAttendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} align="center" sx={{ py: 3 }}>
                      <MDTypography variant="body2" color="text">
                        No attendance records found.
                      </MDTypography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAttendance.map((item) => {
                    const isOpen = item.status === "open";
                    return (
                      <TableRow key={item.user_id}>
                        <TableCell sx={{ padding: "8px 8px", width: "8%" }}>
                          <Avatar
                            src={item.photo ? `${Configs.baseUrl}${item.photo}` : DEFAULT_AVATAR}
                            alt={item.full_name}
                            sx={{ width: 36, height: 36 }}
                          />
                        </TableCell>
                        <TableCell>
                          {/* Name content remains the same */}
                          <MDBox display="flex" flexDirection="column" alignItems="flex-start">
                            <MDTypography component="span" variant="body2">
                              {item.full_name}
                            </MDTypography>
                            {item.user_role && item.user_role !== "-" && (
                              <MDTypography component="span" variant="caption" color="text">
                                ({item.user_role})
                              </MDTypography>
                            )}
                          </MDBox>
                        </TableCell>
                        <TableCell align="center" sx={{ width: "12%" }}>
                          <MDTypography
                            variant="body2"
                            color={isOpen ? "success" : "text"}
                            fontWeight="bold"
                          >
                            {item.status}
                          </MDTypography>
                        </TableCell>
                        <TableCell align="center" sx={{ width: "15%" }}>
                          {formatTime(item.earliest_clock_in)}
                        </TableCell>
                        <TableCell align="center" sx={{ width: "15%" }}>
                          {item.latest_clock_out === "open"
                            ? "open"
                            : formatTime(item.latest_clock_out)}
                        </TableCell>
                        <TableCell align="center" sx={{ width: "15%" }}>
                          {isOpen ? calculateLiveHours(item.earliest_clock_in) : item.total_hours}
                        </TableCell>
                        <TableCell align="center" sx={{ width: "15%" }}>
                          <MDButton
                            variant="gradient"
                            color="info"
                            size="small"
                            sx={{ minWidth: 100 }}
                            href={`/user-details?user_id=${item.user_id}`}
                          >
                            View Details
                          </MDButton>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
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

export default TodayAttendancePage;
