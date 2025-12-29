// File: AttendanceHistory.js

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Project specific
import CustomAlert from "../../components/CustomAlert";
import { getAttendanceHistoryRangeApi } from "../../api/attendanceApi";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";

const COLUMN_COUNT = 8;

// Shared style for input height alignment
const inputSx = {
  "& .MuiInputBase-root": {
    height: "2.5em",
  },
};

const formatTime = (isoString) => {
  if (!isoString) return "-";
  return format(parseISO(isoString), "h:mm:ss a");
};

function AttendanceHistory() {
  const navigate = useNavigate();

  // Data States
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // UI States
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [openImageModal, setOpenImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

  // Date Filter States
  const today = new Date();
  const [startMonth, setStartMonth] = useState(today.getMonth() + 1);
  const [startYear, setStartYear] = useState(today.getFullYear());
  const [endMonth, setEndMonth] = useState(today.getMonth() + 1);
  const [endYear, setEndYear] = useState(today.getFullYear());

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() - i);

  const showAlert = (msg, severity = "info") => {
    setAlertMessage(msg);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const startDate = format(startOfMonth(new Date(startYear, startMonth - 1)), "yyyy-MM-dd");
      const endDate = format(endOfMonth(new Date(endYear, endMonth - 1)), "yyyy-MM-dd");

      const res = await getAttendanceHistoryRangeApi({
        start_date: startDate,
        end_date: endDate,
      });

      if (res.ok) {
        const data = res.data.message || [];
        setAttendanceData(data);
        setFilteredData(data);
      } else {
        showAlert(res.data.message || "Failed to fetch history", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error while fetching history", "error");
    } finally {
      setLoading(false);
    }
  };

  // Client-side Live Search
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(attendanceData);
      return;
    }
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = attendanceData.filter(
      (item) =>
        item.full_name?.toLowerCase().includes(lowerTerm) ||
        item.date?.includes(lowerTerm) ||
        item.status?.toLowerCase().includes(lowerTerm) ||
        item.clockin_type?.toLowerCase().includes(lowerTerm)
    );
    setFilteredData(filtered);
  }, [searchTerm, attendanceData]);

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox p={3} mb={3} bgColor="white" borderRadius="lg">
          <MDTypography variant="h5" fontWeight="bold" mb={3}>
            Attendance History
          </MDTypography>

          {/* Row 1: Filters (Month Numbers + 2.5em height) */}
          <Grid container spacing={1} alignItems="center" mb={2}>
            <Grid item xs={6} sm={2} lg={1.5}>
              <TextField
                select
                label="S-Month"
                fullWidth
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
                sx={inputSx}
              >
                {months.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={2} lg={1.5}>
              <TextField
                select
                label="S-Year"
                fullWidth
                value={startYear}
                onChange={(e) => setStartYear(e.target.value)}
                sx={inputSx}
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={1} display="flex" justifyContent="center" lg={0.5}>
              <MDTypography variant="caption" fontWeight="bold">
                TO
              </MDTypography>
            </Grid>
            <Grid item xs={6} sm={2} lg={1.5}>
              <TextField
                select
                label="E-Month"
                fullWidth
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
                sx={inputSx}
              >
                {months.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} sm={2} lg={1.5}>
              <TextField
                select
                label="E-Year"
                fullWidth
                value={endYear}
                onChange={(e) => setEndYear(e.target.value)}
                sx={inputSx}
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={2} lg={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                onClick={fetchHistory}
                disabled={loading}
                sx={{ height: "2.5em" }}
              >
                {loading ? <CircularProgress size={15} color="white" /> : "GO"}
              </MDButton>
            </Grid>
          </Grid>

          {/* Row 2: Full Width Live Search */}
          <MDBox mb={3}>
            <TextField
              placeholder="Search by staff name, status, type or date..."
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={inputSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </MDBox>

          <TableContainer
            component={Paper}
            sx={{ maxHeight: 600, border: "1px solid #eee", boxShadow: "none" }}
          >
            <Table stickyHeader>
              <TableBody>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Staff Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Photo</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>In</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Out</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Hours</TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Status</TableCell>
                </TableRow>

                {loading ? (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={30} />
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} align="center" sx={{ py: 4 }}>
                      No records match your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((record) => (
                    <TableRow key={record.session_id}>
                      <TableCell>
                        <MDTypography variant="body2">{record.date}</MDTypography>
                      </TableCell>

                      {/* Name with Navigation to Detailed Report */}
                      <TableCell>
                        <MDBox
                          onClick={() =>
                            navigate("/attendance-detailed-report", {
                              state: { user_id: record.user_id, full_name: record.full_name },
                            })
                          }
                          sx={{
                            cursor: "pointer",
                            width: "fit-content",
                            "&:hover": { textDecoration: "underline", color: "info.main" },
                          }}
                        >
                          <MDTypography variant="body2" fontWeight="medium" color="inherit">
                            {record.full_name}
                          </MDTypography>
                        </MDBox>
                      </TableCell>

                      <TableCell align="center">
                        <MDTypography
                          variant="caption"
                          color={record.clockin_type === "overtime" ? "warning" : "info"}
                          fontWeight="bold"
                        >
                          {record.clockin_type ? record.clockin_type.toUpperCase() : "REGULAR"}
                        </MDTypography>
                      </TableCell>
                      <TableCell align="center">
                        {record.clock_in_photo_url ? (
                          <Avatar
                            src={record.clock_in_photo_url}
                            variant="rounded"
                            sx={{ width: 35, height: 35, cursor: "pointer", mx: "auto" }}
                            onClick={() => {
                              setModalImageUrl(record.clock_in_photo_url);
                              setOpenImageModal(true);
                            }}
                          />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <MDTypography variant="body2">
                          {formatTime(record.clock_in_time)}
                        </MDTypography>
                      </TableCell>
                      <TableCell align="center">
                        <MDTypography variant="body2">
                          {formatTime(record.clock_out_time)}
                        </MDTypography>
                      </TableCell>
                      <TableCell align="center">
                        <MDTypography variant="body2" fontWeight="bold">
                          {record.total_hours ? Number(record.total_hours).toFixed(2) : "0.00"}
                        </MDTypography>
                      </TableCell>
                      <TableCell align="center">
                        <MDTypography
                          variant="caption"
                          fontWeight="bold"
                          color={record.status === "closed" ? "success" : "warning"}
                        >
                          {record.status ? record.status.toUpperCase() : "OPEN"}
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

      {/* Image Modal for photo verification */}
      <Dialog
        open={openImageModal}
        onClose={() => setOpenImageModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ p: 1, textAlign: "center", position: "relative" }}>
          <IconButton
            onClick={() => setOpenImageModal(false)}
            sx={{ position: "absolute", right: 8, top: 8, bgcolor: "white" }}
          >
            <CloseIcon />
          </IconButton>
          <img
            src={modalImageUrl}
            alt="Verification"
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </DialogContent>
      </Dialog>

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

export default AttendanceHistory;
