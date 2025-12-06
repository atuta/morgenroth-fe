// File: AllAdvancesPage.js
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

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import CustomAlert from "../../components/CustomAlert";

import { getAllAdvancesAdminApi } from "../../api/overtimeAndAdvanceApi";

const COLUMN_COUNT = 5;

function AllAdvancesPage() {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i).reverse();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [advances, setAdvances] = useState([]);
  const [filteredAdvances, setFilteredAdvances] = useState([]);
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

  const fetchAdvances = async () => {
    setLoading(true);
    try {
      const res = await getAllAdvancesAdminApi({
        start_date: `${year}-${String(month).padStart(2, "0")}-01`,
        end_date: `${year}-${String(month).padStart(2, "0")}-31`,
      });
      if (res.ok && Array.isArray(res.data?.message)) {
        setAdvances(res.data.message);
        setFilteredAdvances(res.data.message);
      } else {
        showAlert(res.data?.message || "Failed to load advances.", "error");
        setAdvances([]);
        setFilteredAdvances([]);
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error. Could not fetch advances.", "error");
      setAdvances([]);
      setFilteredAdvances([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvances();
  }, [month, year]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredAdvances(advances);
      return;
    }
    const term = searchTerm.toLowerCase();
    const result = advances.filter(
      (a) =>
        (a.user_full_name || "").toLowerCase().includes(term) ||
        (a.user_email || "").toLowerCase().includes(term) ||
        (a.remarks || "").toLowerCase().includes(term)
    );
    setFilteredAdvances(result);
  }, [searchTerm, advances]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox p={3} mb={3} bgColor="white" borderRadius="lg">
          <MDTypography variant="h5" fontWeight="bold" mb={2}>
            All Advances
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
                label="Search by employee, email, or remarks"
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
                onClick={fetchAdvances}
                disabled={loading}
                sx={{ minHeight: 48 }}
              >
                {loading ? <CircularProgress size={20} color="white" /> : "Refresh"}
              </MDButton>
            </Grid>
          </Grid>

          {/* Table */}
          <TableContainer component={Paper} sx={{ maxHeight: 600, boxShadow: "none" }}>
            <Table stickyHeader aria-label="all advances table">
              <TableBody>
                <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Amount (KES)</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Month</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Year</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Remarks</TableCell>
                </TableRow>

                {loading ? (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} align="center">
                      <CircularProgress size={24} />
                      <MDTypography mt={1} variant="body2">
                        Loading advances...
                      </MDTypography>
                    </TableCell>
                  </TableRow>
                ) : filteredAdvances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} align="center">
                      <MDTypography variant="body2">
                        No advances found for {month}/{year}.
                      </MDTypography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdvances.map((advance) => (
                    <TableRow
                      key={advance.advance_id}
                      sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                    >
                      <TableCell>{advance.user_full_name || "N/A"}</TableCell>
                      <TableCell>
                        <MDTypography variant="body2" fontWeight="bold" color="info">
                          KES {advance.amount ?? 0}
                        </MDTypography>
                      </TableCell>
                      <TableCell>{advance.month}</TableCell>
                      <TableCell>{advance.year}</TableCell>
                      <TableCell>{advance.remarks || "-"}</TableCell>
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

export default AllAdvancesPage;
