// File: HourCorrectionsPage.js
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import CustomAlert from "../../components/CustomAlert";

import getHourCorrectionsApi from "../../api/getHourCorrectionsApi";
import Configs from "../../configs/Configs";

const COLUMN_COUNT = 7;
const DEFAULT_AVATAR = "/default-avatar.png";

export default function HourCorrectionsPage() {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i).reverse();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [corrections, setCorrections] = useState([]);
  const [filteredCorrections, setFilteredCorrections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
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

  const fetchCorrections = async (p = 1) => {
    setLoading(true);
    try {
      const res = await getHourCorrectionsApi({ month, year, page: p });
      if (res.status === 200 && res.data.status === "success") {
        setCorrections(res.data.data.results || []);
        setFilteredCorrections(res.data.data.results || []);
        setPage(res.data.data.current_page || 1);
        setTotalPages(res.data.data.total_pages || 1);
        setTotalRecords(res.data.data.total_records || 0);
      } else {
        showAlert(res.data?.message || "Failed to fetch hour corrections.", "error");
        setCorrections([]);
        setFilteredCorrections([]);
        setPage(1);
        setTotalPages(1);
        setTotalRecords(0);
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error. Could not fetch hour corrections.", "error");
      setCorrections([]);
      setFilteredCorrections([]);
      setPage(1);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCorrections(1);
  }, [month, year]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredCorrections(corrections);
      return;
    }
    const term = searchTerm.toLowerCase();
    const result = corrections.filter(
      (c) => c.full_name?.toLowerCase().includes(term) || c.user_role?.toLowerCase().includes(term)
    );
    setFilteredCorrections(result);
  }, [searchTerm, corrections]);

  const handlePageChange = (event, value) => {
    fetchCorrections(value);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox p={3} mb={3} bgColor="white" borderRadius="lg">
          <MDTypography variant="h5" fontWeight="bold" mb={2}>
            Hour Corrections
          </MDTypography>

          {/* Filters */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={6} md={2}>
              <TextField
                select
                label="Month"
                fullWidth
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                sx={{ "& .MuiInputBase-root": { minHeight: 48 } }}
              >
                {months.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6} md={2}>
              <TextField
                select
                label="Year"
                fullWidth
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                sx={{ "& .MuiInputBase-root": { minHeight: 48 } }}
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Search by name or role"
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

            <Grid item xs={12} md={2}>
              <MDButton
                variant="gradient"
                color="info"
                onClick={() => fetchCorrections(page)}
                disabled={loading}
                sx={{ minHeight: 48 }}
              >
                {loading ? <CircularProgress size={20} color="white" /> : "Refresh"}
              </MDButton>
            </Grid>
          </Grid>

          {/* Table */}
          <TableContainer component={Paper} sx={{ maxHeight: 600, boxShadow: "none" }}>
            <Table stickyHeader aria-label="hour corrections table">
              <TableBody>
                <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Photo</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>User</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Hours</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Hourly Rate</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Reason</TableCell>
                </TableRow>

                {loading ? (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} align="center">
                      <CircularProgress size={24} />
                      <MDTypography mt={1} variant="body2">
                        Loading hour corrections...
                      </MDTypography>
                    </TableCell>
                  </TableRow>
                ) : filteredCorrections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} align="center">
                      <MDTypography variant="body2">
                        No hour corrections found for {month}/{year}.
                      </MDTypography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCorrections.map((c) => {
                    const photoUrl = c.photo ? `${Configs.baseUrl}${c.photo}` : DEFAULT_AVATAR;
                    return (
                      <TableRow
                        key={c.correction_id}
                        sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                      >
                        <TableCell>
                          <MDBox display="flex" alignItems="center">
                            <img
                              src={photoUrl}
                              alt={c.full_name}
                              width={40}
                              height={40}
                              style={{ borderRadius: "50%", objectFit: "cover" }}
                              onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                            />
                          </MDBox>
                        </TableCell>
                        <TableCell>{c.date}</TableCell>
                        <TableCell>
                          <MDTypography fontWeight="bold">{c.full_name}</MDTypography>
                          <MDTypography variant="caption" color="text">
                            {c.user_role || "N/A"}
                          </MDTypography>
                        </TableCell>
                        <TableCell>{c.hours}</TableCell>
                        <TableCell>
                          {c.hourly_rate_currency} {c.hourly_rate}
                        </TableCell>
                        <TableCell>{c.amount} KES</TableCell>
                        <TableCell>{c.reason}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {!loading && filteredCorrections.length > 0 && (
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
