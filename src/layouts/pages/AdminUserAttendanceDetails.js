// File: AdminUserAttendanceDetails.js

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { format, parseISO } from "date-fns";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import CustomAlert from "../../components/CustomAlert";

import Configs from "../../configs/Configs";
import { getUserAttendanceHistoryAdminApi } from "../../api/attendanceApi";

const COLUMN_COUNT = 6;

const formatTime = (isoString) => {
  if (!isoString) return "-";
  return format(parseISO(isoString), "h:mm:ss a");
};

function AdminUserAttendanceDetails() {
  const location = useLocation();
  const state = location.state || {};
  const { user_id, full_name } = state;

  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const [openImageModal, setOpenImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

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

  const handleImageClick = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setOpenImageModal(true);
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setModalImageUrl("");
  };

  const fetchAttendance = async () => {
    if (!user_id) {
      showAlert("User ID is missing.", "error");
      return;
    }

    setLoading(true);
    try {
      const startDate = format(new Date(year, month - 1, 1), "yyyy-MM-dd");
      const endDate = format(new Date(year, month, 0), "yyyy-MM-dd");

      const res = await getUserAttendanceHistoryAdminApi({
        user_id,
        start_date: startDate,
        end_date: endDate,
      });

      if (res.ok) {
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
  }, [month, year, user_id]);

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <MDBox p={3} mb={3} bgColor="white" borderRadius="lg">
          <MDTypography variant="h5" fontWeight="bold" mb={3}>
            Attendance History: {full_name || ""}
          </MDTypography>

          {/* Filters */}
          <Paper elevation={0} sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <TextField
                  select
                  label="Month"
                  fullWidth
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  sx={{ "& .MuiInputBase-root": { height: 45 } }}
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
                  sx={{ "& .MuiInputBase-root": { height: 45 } }}
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
                  sx={{ height: 45 }}
                >
                  {loading ? <CircularProgress size={20} color="white" /> : "Refresh"}
                </MDButton>
              </Grid>
            </Grid>
          </Paper>

          {/* Table */}
          <Paper elevation={0} sx={{ p: 2 }}>
            <TableContainer component={Paper} sx={{ maxHeight: 600, boxShadow: "none" }}>
              <Table stickyHeader>
                <TableBody>
                  <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                    <TableCell>
                      <MDTypography variant="body2">Date</MDTypography>
                    </TableCell>
                    <TableCell>
                      <MDTypography variant="body2">Status</MDTypography>
                    </TableCell>
                    <TableCell align="center" sx={{ width: "10%" }}>
                      <MDTypography variant="body2">Photo</MDTypography>
                    </TableCell>
                    <TableCell>
                      <MDTypography variant="body2">Check-In</MDTypography>
                    </TableCell>
                    <TableCell>
                      <MDTypography variant="body2">Check-Out</MDTypography>
                    </TableCell>
                    <TableCell align="right">
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
                        <MDTypography>
                          No records found for {month}/{year}
                        </MDTypography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    attendanceData.map((record) => {
                      const clockInPhotoUrl = record.clock_in_photo_url
                        ? `${Configs.baseUrl}${record.clock_in_photo_url}`
                        : null;

                      return (
                        <TableRow key={record.session_id}>
                          <TableCell>
                            {record.date ? format(new Date(record.date), "yyyy-MM-dd") : "-"}
                          </TableCell>

                          <TableCell>
                            <MDTypography
                              variant="caption"
                              color={record.status === "closed" ? "success" : "warning"}
                            >
                              {record.status?.toUpperCase() ?? "-"}
                            </MDTypography>
                          </TableCell>

                          <TableCell align="center">
                            {clockInPhotoUrl ? (
                              <MDBox
                                component="img"
                                src={clockInPhotoUrl}
                                onClick={() => handleImageClick(clockInPhotoUrl)}
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: "50%",
                                  cursor: "pointer",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              "N/A"
                            )}
                          </TableCell>

                          <TableCell>{formatTime(record.clock_in_time)}</TableCell>
                          <TableCell>{formatTime(record.clock_out_time)}</TableCell>
                          <TableCell align="right">
                            <MDTypography fontWeight="bold">
                              {record.total_hours != null
                                ? Number(record.total_hours).toFixed(2)
                                : "-"}
                            </MDTypography>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </MDBox>
      </MDBox>

      {/* Image Modal */}
      <Dialog open={openImageModal} onClose={handleCloseImageModal} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 1, position: "relative" }}>
          <IconButton
            onClick={handleCloseImageModal}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
          {modalImageUrl && <img src={modalImageUrl} style={{ width: "100%" }} alt="Preview" />}
        </DialogContent>
      </Dialog>

      <CustomAlert
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={() => setAlertOpen(false)}
      />
      <Footer />
    </DashboardLayout>
  );
}

export default AdminUserAttendanceDetails;
