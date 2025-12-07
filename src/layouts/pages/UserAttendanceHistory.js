// File: UserAttendanceHistory.js

import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";

import { format, parseISO } from "date-fns";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import CustomAlert from "../../components/CustomAlert";

import { getUserAttendanceHistoryApi } from "../../api/attendanceApi";

const COLUMN_COUNT = 5;

const formatTime = (isoString) => {
  if (!isoString) return "-";
  return format(parseISO(isoString), "h:mm:ss a");
};

function UserAttendanceHistory() {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i).reverse();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const showAlert = (msg, severity = "info") => {
    setAlertMessage(msg);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const startDate = format(new Date(year, month - 1, 1), "yyyy-MM-dd");
      const endDate = format(new Date(year, month, 0), "yyyy-MM-dd");

      // Assuming getUserAttendanceHistoryApi is set up correctly to handle the date range
      const res = await getUserAttendanceHistoryApi({ start_date: startDate, end_date: endDate });

      if (res.ok) {
        // Ensure data is an array before setting
        setAttendanceData(res.data.message || []);
      } else {
        showAlert(res.data.message || "Failed to fetch attendance", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error while fetching attendance", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [month, year]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox p={3} mb={3} bgColor="white" borderRadius="lg">
          <MDTypography variant="h5" fontWeight="bold" mb={2}>
            Attendance History
          </MDTypography>

          {/* Filters */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={6} md={3}>
              <TextField
                select
                label="Month"
                fullWidth
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                sx={{ "& .MuiInputBase-root": { minHeight: 40 } }}
              >
                {months.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                select
                label="Year"
                fullWidth
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                sx={{ "& .MuiInputBase-root": { minHeight: 40 } }}
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={3} display="flex" alignItems="center">
              <MDButton
                variant="gradient"
                color="info"
                onClick={fetchAttendance}
                disabled={loading}
                sx={{ minHeight: 40 }}
              >
                {loading ? <CircularProgress size={20} color="white" /> : "Refresh"}
              </MDButton>
            </Grid>
          </Grid>

          {/* Table */}
          <TableContainer component={Paper} sx={{ maxHeight: 600, boxShadow: "none" }}>
            <Table stickyHeader aria-label="attendance table">
              <TableBody>
                {/* Header Row */}
                <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    <MDTypography variant="body2">Date</MDTypography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    <MDTypography variant="body2">Status</MDTypography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    <MDTypography variant="body2">Check-In</MDTypography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    <MDTypography variant="body2">Check-Out</MDTypography>
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                    <MDTypography variant="body2">Hours</MDTypography>
                  </TableCell>
                </TableRow>

                {loading ? (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} align="center">
                      <CircularProgress size={24} />
                      <MDTypography mt={1} variant="body2">
                        Loading...
                      </MDTypography>
                    </TableCell>
                  </TableRow>
                ) : attendanceData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} align="center">
                      <MDTypography variant="body2">
                        No attendance records found for {month}/{year}.
                      </MDTypography>
                    </TableCell>
                  </TableRow>
                ) : (
                  attendanceData.map((record) => (
                    <TableRow
                      key={record.session_id}
                      sx={{
                        "&:hover": { backgroundColor: "#f9f9f9" },
                        cursor: "default",
                      }}
                    >
                      <TableCell>
                        <MDTypography variant="body2">
                          {format(new Date(record.date), "yyyy-MM-dd")}
                        </MDTypography>
                      </TableCell>
                      <TableCell>
                        <MDTypography
                          variant="caption"
                          fontWeight="bold"
                          color={record.status === "closed" ? "success" : "warning"}
                        >
                          {record.status.toUpperCase()}
                        </MDTypography>
                      </TableCell>
                      <TableCell>
                        <MDTypography variant="body2">
                          {formatTime(record.clock_in_time)}
                        </MDTypography>
                      </TableCell>
                      <TableCell>
                        <MDTypography variant="body2">
                          {formatTime(record.clock_out_time)}
                        </MDTypography>
                      </TableCell>

                      {/* --- FIX APPLIED HERE --- */}
                      <TableCell align="right">
                        <MDTypography variant="body2" fontWeight="bold" color="info">
                          {/* Only call toFixed(2) if total_hours is not null/undefined */}
                          {record.total_hours ? record.total_hours.toFixed(2) : "-"}
                        </MDTypography>
                      </TableCell>
                    </TableRow>
                  ))
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

export default UserAttendanceHistory;
