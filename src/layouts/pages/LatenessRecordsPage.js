// File: LatenessRecordsPage.js
import { useEffect, useMemo, useState } from "react";

import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Pagination from "@mui/material/Pagination";
import Avatar from "@mui/material/Avatar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import CustomAlert from "../../components/CustomAlert";

import Configs from "../../configs/Configs";
import { getLatenessRecordsApi } from "../../api/attendanceApi";

const COLUMN_COUNT = 8;
const DEFAULT_AVATAR = "/default-avatar.png";

export default function LatenessRecordsPage() {
  // Defaults: last 7 days
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const toISODate = (d) => {
    if (!d) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [startDate, setStartDate] = useState(toISODate(sevenDaysAgo));
  const [endDate, setEndDate] = useState(toISODate(today));

  const [session, setSession] = useState("all"); // all | first | second
  const [isExcused, setIsExcused] = useState("all"); // all | yes | no

  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const showAlert = (message, severity = "info") => {
    setAlertMessage(message);
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

    if (session !== "all") params.session = session;

    if (isExcused === "yes") params.is_excused = true;
    if (isExcused === "no") params.is_excused = false;

    return params;
  };

  const fetchRecords = async (p = 1) => {
    setLoading(true);
    try {
      const res = await getLatenessRecordsApi(buildParams(p));

      if (res.ok && res.status === 200 && res.data?.status === "success") {
        const results = res.data?.data?.results || [];
        const pagination = res.data?.data?.pagination || {};

        setRecords(results);
        setFilteredRecords(results);

        setPage(pagination.page || p);
        setTotalPages(pagination.total_pages || 1);
        setTotalRecords(pagination.total_records || 0);
      } else {
        showAlert(res.data?.message || "Failed to fetch lateness records.", "error");
        setRecords([]);
        setFilteredRecords([]);
        setPage(1);
        setTotalPages(1);
        setTotalRecords(0);
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error. Could not fetch lateness records.", "error");
      setRecords([]);
      setFilteredRecords([]);
      setPage(1);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  // Refetch when filters change
  useEffect(() => {
    fetchRecords(1);
  }, [startDate, endDate, session, isExcused]);

  // Live search (client-side on current page)
  useEffect(() => {
    if (!searchTerm) {
      setFilteredRecords(records);
      return;
    }
    const term = searchTerm.toLowerCase();

    const result = records.filter((r) => {
      const fullName = r.user?.full_name?.toLowerCase() || "";
      const role = r.user?.user_role?.toLowerCase() || "";
      const phone = r.user?.phone_number?.toLowerCase() || "";
      const reason = (r.reason || "").toLowerCase();
      const sess = (r.session || "").toLowerCase();

      return (
        fullName.includes(term) ||
        role.includes(term) ||
        phone.includes(term) ||
        reason.includes(term) ||
        sess.includes(term)
      );
    });

    setFilteredRecords(result);
  }, [searchTerm, records]);

  const handlePageChange = (event, value) => {
    fetchRecords(value);
  };

  const formatSession = (s) => {
    if (!s) return "N/A";
    if (s === "first") return "First";
    if (s === "second") return "Second";
    return s;
  };

  const safeLateness = (val) => {
    if (val === null || val === undefined) return "0.00";
    return String(val);
  };

  const showFooter = useMemo(
    () => !loading && filteredRecords.length > 0,
    [loading, filteredRecords]
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <MDBox p={3} mb={3} bgColor="white" borderRadius="lg">
          <MDTypography variant="h5" fontWeight="bold" mb={2}>
            Lateness Records
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
                sx={{ "& .MuiInputBase-root": { minHeight: 48 } }}
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
                sx={{ "& .MuiInputBase-root": { minHeight: 48 } }}
              />
            </Grid>

            <Grid item xs={6} md={2}>
              <TextField
                select
                label="Session"
                fullWidth
                value={session}
                onChange={(e) => setSession(e.target.value)}
                sx={{ "& .MuiInputBase-root": { minHeight: 48 } }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="first">First</MenuItem>
                <MenuItem value="second">Second</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={6} md={2}>
              <TextField
                select
                label="Excused"
                fullWidth
                value={isExcused}
                onChange={(e) => setIsExcused(e.target.value)}
                sx={{ "& .MuiInputBase-root": { minHeight: 48 } }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="yes">Excused</MenuItem>
                <MenuItem value="no">Not Excused</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                label="Live search (name, role, phone, reason...)"
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
                onClick={() => fetchRecords(page)}
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
          <TableContainer component={Paper} sx={{ maxHeight: 600, boxShadow: "none" }}>
            <Table stickyHeader aria-label="lateness records table">
              <TableBody>
                <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Photo</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Session</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Late (hrs)</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Excused</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Reason</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Times</TableCell>
                </TableRow>

                {loading ? (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} align="center">
                      <CircularProgress size={24} />
                      <MDTypography mt={1} variant="body2">
                        Loading lateness records...
                      </MDTypography>
                    </TableCell>
                  </TableRow>
                ) : filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} align="center">
                      <MDTypography variant="body2">
                        No lateness records found for the selected filters.
                      </MDTypography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((r) => (
                    <TableRow key={r.late_id} sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}>
                      <TableCell>
                        <Avatar
                          src={r.user?.photo ? `${Configs.baseUrl}${r.user.photo}` : DEFAULT_AVATAR}
                          alt={r.user?.full_name || "User"}
                          sx={{
                            width: 40,
                            height: 40,
                            cursor: "pointer",
                            transition: "0.2s",
                            "&:hover": { transform: "scale(1.1)" },
                          }}
                          onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                        />
                      </TableCell>

                      <TableCell>{r.date}</TableCell>

                      <TableCell>
                        <MDTypography fontWeight="bold">{r.user?.full_name || "N/A"}</MDTypography>
                        <MDTypography variant="caption" color="text">
                          {r.user?.user_role || "N/A"} • {r.user?.phone_number || "N/A"}
                        </MDTypography>
                      </TableCell>

                      <TableCell>{formatSession(r.session)}</TableCell>
                      <TableCell>{safeLateness(r.lateness_hours)}</TableCell>

                      <TableCell>
                        <MDTypography variant="body2" color={r.is_excused ? "success" : "text"}>
                          {r.is_excused ? "Yes" : "No"}
                        </MDTypography>
                      </TableCell>

                      <TableCell>{r.reason || "-"}</TableCell>

                      <TableCell>
                        <MDTypography variant="caption" color="text" display="block">
                          Expected:{" "}
                          {r.expected_start_time
                            ? new Date(r.expected_start_time).toLocaleTimeString()
                            : "—"}
                        </MDTypography>
                        <MDTypography variant="caption" color="text" display="block">
                          Actual:{" "}
                          {r.actual_clock_in_time
                            ? new Date(r.actual_clock_in_time).toLocaleTimeString()
                            : "—"}
                        </MDTypography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Footer (Pagination + Total Records) */}
          {showFooter && (
            <MDBox display="flex" flexDirection="column" alignItems="center" mt={2}>
              <Pagination count={totalPages} page={page} onChange={handlePageChange} color="info" />

              <MDTypography variant="caption" display="block" mt={1} textAlign="center">
                Total Records: {totalRecords}
              </MDTypography>
            </MDBox>
          )}
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
