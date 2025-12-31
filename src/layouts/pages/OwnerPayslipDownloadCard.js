import { useState } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// We use the batch API even for the owner, passing just their own ID in the array
import { generateMyPayslipPdfApi } from "../../api/payrollAndCompensationApi";

function OwnerPayslipDownloadCard({ userData, onAlert }) {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const [startMonth, setStartMonth] = useState(currentMonth);
  const [startYear, setStartYear] = useState(currentYear);
  const [endMonth, setEndMonth] = useState(currentMonth);
  const [endYear, setEndYear] = useState(currentYear);

  const [generating, setGenerating] = useState(false);

  const allowedMonths = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i).sort();

  const handleGeneratePayslip = async () => {
    if (!userData) {
      console.error("PAYSLIP_DEBUG: No userData available in props");
      return;
    }

    const startDate = new Date(startYear, startMonth - 1);
    const endDate = new Date(endYear, endMonth - 1);
    const todayDate = new Date(currentYear, currentMonth - 1);

    if (startDate > endDate) {
      onAlert("Start period cannot be after end period", "error");
      return;
    }

    setGenerating(true);
    onAlert("Processing your payslips...", "info");

    try {
      // 1. Construct the payload
      const payload = {
        user_ids: [userData.user_id || userData.id], // Check if your backend uses .id or .user_id
        start_month: startMonth,
        start_year: startYear,
        end_month: endMonth,
        end_year: endYear,
      };

      // 2. LOG THE DATA SENT TO API
      console.log("PAYSLIP_DEBUG: Sending Payload to API:", payload);
      console.log("PAYSLIP_DEBUG: Full userData object:", userData);

      const res = await generateMyPayslipPdfApi(payload);

      // 3. LOG THE RESPONSE STATUS
      console.log("PAYSLIP_DEBUG: API Response Status:", res.status);

      if (res.ok || res.status === 200) {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(pdfBlob);

        const userFullName = `${userData.first_name || ""} ${userData.last_name || ""}`.trim();
        const sanitizedName = userFullName.replace(/\s+/g, "_");

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `My_Payslips_${sanitizedName}_${startMonth}_${startYear}_to_${endMonth}_${endYear}.pdf`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        onAlert("Your payslip range has been generated!", "success");
      } else {
        // Log the error message from backend if available
        console.warn("PAYSLIP_DEBUG: API returned non-200 status. Data:", res.data);
        onAlert("No data found for the selected range.", "error");
      }
    } catch (err) {
      console.error("PAYSLIP_DEBUG: Network/Server Error:", err);
      onAlert("Error generating payslip range", "error");
    } finally {
      setGenerating(false);
    }
  };

  const fieldStyles = {
    "& .MuiInputBase-root": { minHeight: "48px" },
  };

  return (
    <MDBox mt={3}>
      <Paper elevation={0} sx={{ p: 3 }}>
        <MDTypography variant="h6" fontWeight="bold" mb={2}>
          Download Payslip Range
        </MDTypography>

        <Grid container spacing={2} mb={3} sx={{ maxWidth: 500, width: "100%" }}>
          {/* Start Selection */}
          <Grid item xs={12}>
            <MDTypography variant="caption" color="text" fontWeight="bold">
              FROM
            </MDTypography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              label="Month"
              fullWidth
              value={startMonth}
              onChange={(e) => setStartMonth(Number(e.target.value))}
              sx={fieldStyles}
            >
              {allowedMonths.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              label="Year"
              fullWidth
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
              sx={fieldStyles}
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* End Selection */}
          <Grid item xs={12}>
            <MDTypography variant="caption" color="text" fontWeight="bold">
              TO
            </MDTypography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              label="Month"
              fullWidth
              value={endMonth}
              onChange={(e) => setEndMonth(Number(e.target.value))}
              sx={fieldStyles}
            >
              {allowedMonths.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              label="Year"
              fullWidth
              value={endYear}
              onChange={(e) => setEndYear(Number(e.target.value))}
              sx={fieldStyles}
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <MDBox display="flex" alignItems="center" gap={2}>
          <MDButton
            variant="gradient"
            color="info"
            onClick={handleGeneratePayslip}
            disabled={generating}
            startIcon={generating && <CircularProgress size={20} color="white" />}
          >
            {generating ? "Generating..." : "Download Range PDF"}
          </MDButton>
        </MDBox>
        <MDBox mt={1}>
          <MDTypography variant="caption" color="text.secondary">
            Select a range (e.g., Jan 2025 to Mar 2025) to get all payslips in one document.
          </MDTypography>
        </MDBox>
      </Paper>
    </MDBox>
  );
}

OwnerPayslipDownloadCard.propTypes = {
  userData: PropTypes.object.isRequired,
  onAlert: PropTypes.func.isRequired,
};

export default OwnerPayslipDownloadCard;
