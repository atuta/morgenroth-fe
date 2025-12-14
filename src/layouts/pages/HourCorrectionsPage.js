// File: HourCorrectionsPage.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import Pagination from "@mui/material/Pagination";
import Avatar from "@mui/material/Avatar";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import CustomAlert from "../../components/CustomAlert";
import getHourCorrectionsApi from "../../api/getHourCorrectionsApi";
import Configs from "../../configs/Configs";

// Default avatar
const DEFAULT_AVATAR = "/default-avatar.png";

// Column definitions
const columns = [
  { id: "photo", label: "Photo", align: "left", display: "table-cell" },
  { id: "date", label: "Date", align: "center", display: "table-cell" },
  { id: "user", label: "User", align: "left", display: "table-cell" },
  { id: "hours", label: "Hours", align: "right", display: { xs: "none", sm: "table-cell" } },
  {
    id: "hourly_rate",
    label: "Hourly Rate",
    align: "right",
    display: { xs: "none", sm: "table-cell" },
  },
  { id: "amount", label: "Amount", align: "right", display: "table-cell" },
  { id: "reason", label: "Reason", align: "left", display: "table-cell" },
];

// Helper to get alignment for a column
const getAlignment = (id) => columns.find((col) => col.id === id)?.align || "inherit";

export default function HourCorrectionsPage() {
  const navigate = useNavigate();
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [corrections, setCorrections] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const allowedMonths = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i).reverse();

  const showAlert = (msg, severity = "info") => {
    setAlertMessage(msg);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const fetchCorrections = async (p = 1) => {
    setLoading(true);
    try {
      const res = await getHourCorrectionsApi({ month, year, page: p });
      if (res.status === 200 && res.data.status === "success") {
        setCorrections(res.data.data.results || []);
        setTotalPages(res.data.data.total_pages || 1);
        setTotalRecords(res.data.data.total_records || 0);
        setPage(res.data.data.current_page || 1);
      } else {
        showAlert(res.data?.message || "Failed to fetch hour corrections", "error");
        setCorrections([]);
        setTotalPages(1);
        setTotalRecords(0);
        setPage(1);
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error while fetching hour corrections", "error");
      setCorrections([]);
      setTotalPages(1);
      setTotalRecords(0);
      setPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCorrections(1);
  }, [month, year]);

  const handlePageChange = (event, value) => {
    fetchCorrections(value);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <MDTypography variant="h5" fontWeight="bold" mb={2}>
            Hour Corrections
          </MDTypography>

          <Grid container spacing={2} mb={2}>
            <Grid item xs={6} md={3}>
              <TextField
                select
                label="Month"
                fullWidth
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                size="small"
              >
                {allowedMonths.map((m) => (
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
                size="small"
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <TableContainer component={Paper} sx={{ maxHeight: 600, boxShadow: "none" }}>
            <Table stickyHeader aria-label="hour corrections table">
              <TableBody>
                {/* Header */}
                <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                  {columns.map((col) => (
                    <TableCell
                      key={col.id}
                      align={col.align}
                      sx={{ fontWeight: "bold", display: col.display }}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Loading */}
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      <CircularProgress size={24} />
                      <MDTypography mt={1}>Loading...</MDTypography>
                    </TableCell>
                  </TableRow>
                ) : corrections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} align="center">
                      <MDTypography>
                        No hour corrections found for {month}/{year}.
                      </MDTypography>
                    </TableCell>
                  </TableRow>
                ) : (
                  corrections.map((c) => {
                    const photoUrl = c.photo
                      ? `${Configs.baseUrl}${c.photo}?t=${Date.now()}`
                      : DEFAULT_AVATAR;

                    return (
                      <TableRow
                        key={c.correction_id}
                        sx={{
                          "&:hover": { backgroundColor: "#f9f9f9", transform: "scale(1.01)" },
                          transition: "0.2s",
                        }}
                      >
                        {/* Photo */}
                        <TableCell>
                          <Avatar
                            src={photoUrl}
                            alt={c.full_name}
                            sx={{ width: 40, height: 40, cursor: "pointer" }}
                            onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                          />
                        </TableCell>

                        {/* Date */}
                        <TableCell align="center">{c.date}</TableCell>

                        {/* User */}
                        <TableCell>
                          <MDTypography fontWeight="bold">{c.full_name}</MDTypography>
                          <MDTypography variant="caption" color="text">
                            {c.user_role || "N/A"}
                          </MDTypography>
                        </TableCell>

                        {/* Hours */}
                        <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }} align="right">
                          {c.hours}
                        </TableCell>

                        {/* Hourly Rate */}
                        <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }} align="right">
                          {c.hourly_rate_currency} {c.hourly_rate}
                        </TableCell>

                        {/* Amount */}
                        <TableCell align="right">{c.amount}</TableCell>

                        {/* Reason */}
                        <TableCell align="left">{c.reason}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {!loading && corrections.length > 0 && (
            <>
              <MDBox display="flex" justifyContent="center" mt={2}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="info"
                />
              </MDBox>
              <MDTypography variant="caption" display="block" mt={1} textAlign="center">
                Total Records: {totalRecords}
              </MDTypography>
            </>
          )}
        </Paper>
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
