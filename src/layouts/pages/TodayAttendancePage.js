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

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import CustomAlert from "../../components/CustomAlert";

import getTodayUserTimeSummaryApi from "../../api/getTodayUserTimeSummaryApi";

// Default avatar image
const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/?d=mp&s=40";
const COLUMN_COUNT = 7;

// Utility to format ISO strings to readable local time
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

// Utility to calculate live total hours for "open" sessions
const calculateLiveHours = (clockIn) => {
  if (!clockIn) return "-";
  const clockInDate = new Date(clockIn);
  const now = new Date();
  const diffMs = now - clockInDate;
  if (diffMs < 0) return "0:00:00";
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  const seconds = Math.floor((diffMs / 1000) % 60);
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
          total_hours: item.total_hours_worked ?? "-",
          photo: item.user_photo_url || DEFAULT_AVATAR,
          status: item.latest_session_status || "open", // <-- use the correct field
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

  // Filter based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredAttendance(attendanceList);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = attendanceList.filter((item) => {
      const fullName = item.full_name || "";
      const userRole = item.user_role || "";
      const status = item.status || "";
      return (
        fullName.toLowerCase().includes(term) ||
        userRole.toLowerCase().includes(term) ||
        status.toLowerCase().includes(term)
      );
    });

    setFilteredAttendance(filtered);
  }, [searchTerm, attendanceList]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox sx={{ margin: "0 auto 0 0" }}>
          {/* Removed card background and shadow */}
          <MDBox p={3} mb={3} borderRadius="lg">
            <MDTypography variant="h5" fontWeight="bold" mb={2}>
              Today&apos;s Attendance
            </MDTypography>

            {/* Search bar */}
            <MDBox mb={2}>
              <TextField
                label="Search by name, role, or status"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </MDBox>

            {/* Attendance Table */}
            <TableContainer
              component={Paper}
              sx={{ maxHeight: 600, border: "1px solid #ddd", boxShadow: "none" }}
            >
              <Table stickyHeader aria-label="attendance table">
                <TableBody>
                  {/* Header row */}
                  <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                    <TableCell sx={{ fontWeight: "bold", width: "5%", padding: "12px 8px" }}>
                      Photo
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "25%" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "15%" }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "10%", textAlign: "center" }}>
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
                    <TableCell sx={{ fontWeight: "bold", width: "10%", textAlign: "center" }}>
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
                        <TableRow
                          key={item.user_id}
                          sx={{
                            backgroundColor: isOpen ? "#e6f4ea" : "inherit",
                          }}
                        >
                          <TableCell sx={{ padding: "8px 8px" }}>
                            <Avatar
                              src={item.photo}
                              alt={item.full_name}
                              sx={{ width: 36, height: 36 }}
                            />
                          </TableCell>
                          <TableCell>{item.full_name}</TableCell>
                          <TableCell>{item.user_role}</TableCell>
                          <TableCell align="center">
                            <MDTypography
                              variant="caption"
                              color={isOpen ? "success" : "text"}
                              fontWeight="bold"
                            >
                              {item.status}
                            </MDTypography>
                          </TableCell>
                          <TableCell align="center">{formatTime(item.earliest_clock_in)}</TableCell>
                          <TableCell align="center">
                            {item.latest_clock_out === "open"
                              ? "open"
                              : formatTime(item.latest_clock_out)}
                          </TableCell>
                          <TableCell align="center">{item.total_hours}</TableCell>
                          <TableCell align="center">
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
