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
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import RefreshIcon from "@mui/icons-material/Refresh";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import CustomAlert from "../../components/CustomAlert";
import { getAttendanceHistoryRangeApi } from "../../api/attendanceApi";

const COLUMN_COUNT = 8;

const toISODate = (d) => {
  if (!d) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const formatTime = (isoString) => {
  if (!isoString) return "-";
  try {
    return new Date(isoString).toLocaleTimeString();
  } catch {
    return "-";
  }
};

function AttendanceHistory() {
  const navigate = useNavigate();

  // Defaults: current month range
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  // Filters
  const [startDate, setStartDate] = useState(toISODate(firstDay));
  const [endDate, setEndDate] = useState(toISODate(lastDay));

  // Server paging
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Data
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // UI
  const [loading, setLoading] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const [openImageModal, setOpenImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

  const showAlert = (msg, severity = "info") => {
    setAlertMessage(msg);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const buildParams = (p = 1) => {
    const params = {
      page: p,
      page_size: pageSize,
    };

    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    return params;
  };

  const fetchHistory = async (p = 1) => {
    setLoading(true);

    try {
      // Date validation
      if (startDate && endDate && startDate > endDate) {
        showAlert("Start date cannot be after end date.", "warning");
        setLoading(false);
        return;
      }

      const res = await getAttendanceHistoryRangeApi(buildParams(p));

      if (res.ok && res.status === 200 && res.data?.status === "success") {
        /**
         * Backend returns:
         * { status: "success", message: { results: [], current_page, total_pages, total_records ... } }
         *
         * Some endpoints elsewhere may use `data`, so support both to be safe:
         */
        const payload = res.data?.message || res.data?.data || {};

        const results = Array.isArray(payload.results) ? payload.results : [];

        setAttendanceData(results);
        setFilteredData(results);

        setPage(payload.current_page || p);
        setTotalPages(payload.total_pages || 1);
        setTotalRecords(payload.total_records || 0);
      } else {
        showAlert(res.data?.message || "Failed to fetch history.", "error");
        setAttendanceData([]);
        setFilteredData([]);
        setPage(1);
        setTotalPages(1);
        setTotalRecords(0);
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error while fetching history.", "error");
      setAttendanceData([]);
      setFilteredData([]);
      setPage(1);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  // Refetch when date filters change (also handles initial load)
  useEffect(() => {
    setPage(1);
    fetchHistory(1);
  }, [startDate, endDate]);

  // Live search (client-side, current page)
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(attendanceData);
      return;
    }

    const lower = searchTerm.toLowerCase();

    const filtered = (attendanceData || []).filter((item) => {
      const fullName = item.full_name?.toLowerCase() || "";
      const date = String(item.date || "");
      const status = String(item.status || "").toLowerCase();
      const type = String(item.clockin_type || "").toLowerCase();
      const notes = String(item.notes || "").toLowerCase();

      return (
        fullName.includes(lower) ||
        date.includes(lower) ||
        status.includes(lower) ||
        type.includes(lower) ||
        notes.includes(lower)
      );
    });

    setFilteredData(filtered);
  }, [searchTerm, attendanceData]);

  const handlePageChange = (event, value) => {
    fetchHistory(value);
  };

  const inputSx = { "& .MuiInputBase-root": { minHeight: 48 } };

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
            <Grid item xs={12} md={2}>
              <TextField
                type="date"
                label="Start Date"
                fullWidth
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={inputSx}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <TextField
                type="date"
                label="End Date"
                fullWidth
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={inputSx}
              />
            </Grid>

            <Grid item xs={12} md={7}>
              <TextField
                label="Live search (name, status, type, date, notes...)"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: { backgroundColor: "white", borderRadius: 2, minHeight: 48 },
                }}
              />
            </Grid>

            {/* Refresh */}
            <Grid item xs={12} md={1}>
              <MDButton
                variant="gradient"
                color="info"
                onClick={() => fetchHistory(page)}
                disabled={loading}
                fullWidth
                sx={{
                  minHeight: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <RefreshIcon sx={{ fontSize: 24, color: "white" }} />
                )}
              </MDButton>
            </Grid>
          </Grid>

          {/* Table */}
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
                    <TableRow
                      key={record.session_id}
                      sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                    >
                      <TableCell>
                        <MDTypography variant="body2">{record.date}</MDTypography>
                      </TableCell>

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

                        {record.notes && (
                          <MDTypography variant="caption" color="text" display="block">
                            Notes: {record.notes}
                          </MDTypography>
                        )}
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

          {/* Footer: always visible */}
          <MDBox display="flex" flexDirection="column" alignItems="center" mt={2}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} color="info" />
            <MDTypography variant="caption" display="block" mt={1} textAlign="center">
              Total Records: {totalRecords}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>

      {/* Image Modal */}
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
