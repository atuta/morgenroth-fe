// File: AttendanceDetailedReport.js
import React, { useState, useEffect, useCallback, Fragment } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { format, startOfMonth, endOfMonth } from "date-fns";

// @mui material components
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";

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
import { getAttendanceDetailedReportApi, downloadAttendancePdfApi } from "../../api/attendanceApi";

const inputSx = { "& .MuiInputBase-root": { height: "2.5em" } };

// --- Helper Component: SummaryCard ---
const SummaryCard = ({ label, value, color }) => (
  <Grid item xs={12} sm={6} md={3}>
    <MDBox
      bgColor={color}
      variant="gradient"
      coloredShadow={color}
      borderRadius="lg"
      p={2}
      textAlign="center"
    >
      <MDTypography variant="caption" color="white" fontWeight="medium" textTransform="uppercase">
        {label}
      </MDTypography>
      <MDTypography variant="h4" color="white" fontWeight="bold">
        {Number(value).toFixed(2)}
      </MDTypography>
    </MDBox>
  </Grid>
);

SummaryCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  color: PropTypes.string.isRequired,
};

function AttendanceDetailedReport() {
  const location = useLocation();
  const { user_id, full_name } = location.state || {};

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "info" });

  const today = new Date();
  const [startMonth, setStartMonth] = useState(today.getMonth() + 1);
  const [startYear, setStartYear] = useState(today.getFullYear());
  const [endMonth, setEndMonth] = useState(today.getMonth() + 1);
  const [endYear, setEndYear] = useState(today.getFullYear());

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 5 }, (_, i) => today.getFullYear() - i);

  const fetchReport = useCallback(async () => {
    if (!user_id) {
      setAlert({ open: true, message: "No user ID provided", severity: "warning" });
      return;
    }
    setLoading(true);
    try {
      const startDate = format(startOfMonth(new Date(startYear, startMonth - 1)), "yyyy-MM-dd");
      const endDate = format(endOfMonth(new Date(endYear, endMonth - 1)), "yyyy-MM-dd");

      const res = await getAttendanceDetailedReportApi({
        user_id,
        start_date: startDate,
        end_date: endDate,
      });

      if (res.ok) {
        setReportData(res.data.message);
      } else {
        setAlert({
          open: true,
          message: res.data.message || "Failed to load report",
          severity: "error",
        });
      }
    } catch (err) {
      setAlert({ open: true, message: "Server connection error", severity: "error" });
    } finally {
      setLoading(false);
    }
  }, [user_id, startMonth, startYear, endMonth, endYear]);

  // --- PDF Download Handler ---
  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const params = {
        user_id,
        start_date: format(startOfMonth(new Date(startYear, startMonth - 1)), "yyyy-MM-dd"),
        end_date: format(endOfMonth(new Date(endYear, endMonth - 1)), "yyyy-MM-dd"),
      };

      const res = await downloadAttendancePdfApi(params);

      if (res.ok) {
        // Create a Blob from the data
        const blob = new Blob([res.data], { type: "application/pdf" });

        // Safety Check: If the blob is very small, it might be a JSON error hidden in a blob
        if (blob.size < 200) {
          const text = await blob.text();
          console.error("Server returned an error hidden in a blob:", text);
          setAlert({
            open: true,
            message: "Server error: Could not generate PDF content.",
            severity: "error",
          });
          return;
        }

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Attendance_Report_${full_name || "Staff"}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        // If the response failed, res.data is likely a Blob containing a JSON error
        const errorText = res.data instanceof Blob ? await res.data.text() : "Unknown Error";
        console.error("Download failed:", errorText);
        setAlert({ open: true, message: "Failed to generate PDF report", severity: "error" });
      }
    } catch (err) {
      console.error("PDF Download Catch:", err);
      setAlert({ open: true, message: "Error during PDF download", severity: "error" });
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox p={3} mb={3} bgColor="white" borderRadius="lg">
          <MDBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <MDTypography variant="h5" fontWeight="bold">
              Attendance Report: {full_name || reportData?.user?.full_name || "Staff Member"}
            </MDTypography>
            <MDButton
              variant="gradient"
              color="dark"
              size="small"
              onClick={handleDownloadPDF}
              disabled={downloading}
            >
              {downloading ? "Generating..." : "Download PDF"}
            </MDButton>
          </MDBox>

          <Grid container spacing={1} alignItems="center" mb={4}>
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
                onClick={fetchReport}
                sx={{ height: "2.5em" }}
              >
                GO
              </MDButton>
            </Grid>
          </Grid>

          {loading ? (
            <MDBox textAlign="center" py={5}>
              <CircularProgress color="info" />
            </MDBox>
          ) : reportData ? (
            <>
              <Grid container spacing={3} mb={5}>
                <SummaryCard
                  label="Total Work Hours"
                  value={reportData.summary.work_hours}
                  color="success"
                />
                <SummaryCard
                  label="Regular Hours"
                  value={reportData.summary.regular}
                  color="info"
                />
                <SummaryCard
                  label="Overtime Hours"
                  value={reportData.summary.overtime}
                  color="warning"
                />
                <SummaryCard
                  label="Billable Total"
                  value={reportData.summary.work_hours}
                  color="primary"
                />
              </Grid>

              <Divider sx={{ my: 4 }} />

              <TableContainer
                component={Paper}
                sx={{ boxShadow: "none", border: "1px solid #eee" }}
              >
                <Table>
                  <TableBody>
                    <TableRow sx={{ backgroundColor: "#f8f9fa" }}>
                      <TableCell sx={{ fontWeight: "bold", width: "16%" }}>Date / Day</TableCell>
                      <TableCell sx={{ fontWeight: "bold", width: "16%" }}>Shift Type</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold", width: "16%" }}>
                        Clock In
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold", width: "16%" }}>
                        Clock Out
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold", width: "16%" }}>
                        Shift Hrs
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold", width: "16%" }}>
                        Daily Total
                      </TableCell>
                    </TableRow>

                    {reportData.rows.map((row, index) => (
                      <Fragment key={index}>
                        {row.sessions.map((session, sIdx) => (
                          <TableRow key={session.session_id}>
                            <TableCell
                              sx={{
                                borderBottom:
                                  sIdx === row.sessions.length - 1 ? "1px solid #eee" : "none",
                                verticalAlign: "top",
                              }}
                            >
                              {sIdx === 0 ? (
                                <MDTypography variant="body2" fontWeight="bold">
                                  {row.date_display}
                                </MDTypography>
                              ) : (
                                ""
                              )}
                            </TableCell>
                            <TableCell>
                              <MDTypography
                                variant="caption"
                                fontWeight="bold"
                                color={session.type === "Overtime" ? "warning" : "text"}
                              >
                                {session.type.toUpperCase()}
                              </MDTypography>
                            </TableCell>
                            <TableCell align="center">
                              <MDTypography variant="body2">
                                {session.clock_in
                                  ? format(new Date(session.clock_in), "HH:mm")
                                  : "--:--"}
                              </MDTypography>
                            </TableCell>
                            <TableCell align="center">
                              <MDTypography variant="body2">
                                {session.clock_out
                                  ? format(new Date(session.clock_out), "HH:mm")
                                  : "--:--"}
                              </MDTypography>
                            </TableCell>
                            <TableCell align="center">
                              <MDTypography variant="body2">
                                {session.hours.toFixed(2)}
                              </MDTypography>
                            </TableCell>
                            <TableCell
                              align="center"
                              sx={{
                                borderBottom:
                                  sIdx === row.sessions.length - 1 ? "1px solid #eee" : "none",
                                backgroundColor: sIdx === 0 ? "#fafafa" : "transparent",
                              }}
                            >
                              {sIdx === 0 ? (
                                <MDTypography variant="body2" fontWeight="bold" color="dark">
                                  {row.day_total.toFixed(2)}
                                </MDTypography>
                              ) : (
                                ""
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <MDTypography variant="body2" color="text" textAlign="center">
              No data found.
            </MDTypography>
          )}
        </MDBox>
      </MDBox>
      <CustomAlert
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert({ ...alert, open: false })}
      />
      <Footer />
    </DashboardLayout>
  );
}

export default AttendanceDetailedReport;
