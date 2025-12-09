// File: PayrollReportPage.js
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import CustomAlert from "../../components/CustomAlert";

import { adminGeneratePayrollReportApi } from "../../api/payrollApi";

export default function PayrollReportPage() {
  const todayStr = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const showAlert = (msg, severity = "info") => {
    setAlertMessage(msg);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      showAlert("Start date and end date are required", "error");
      return;
    }

    setLoading(true);
    showAlert("Generating report...", "info");

    try {
      const res = await adminGeneratePayrollReportApi({
        start_date: startDate,
        end_date: endDate,
      });

      if (res.ok) {
        // Download JSON as file
        const blob = new Blob([JSON.stringify(res.data, null, 2)], {
          type: "application/json",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `PayrollReport_${startDate}_${endDate}.json`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        showAlert("Payroll report generated successfully!", "success");
      } else {
        showAlert(res.data.message || "Failed to generate report", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error while generating report", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <Paper elevation={0} sx={{ p: 3 }}>
          <MDTypography variant="h6" fontWeight="bold" mb={2}>
            Generate Payroll Report (JSON)
          </MDTypography>

          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <MDBox display="flex" alignItems="center" gap={2} mb={1}>
            <MDButton
              variant="gradient"
              color="info"
              onClick={handleGenerateReport}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="white" />}
            >
              {loading ? "Generating..." : "Download Report"}
            </MDButton>
          </MDBox>
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
