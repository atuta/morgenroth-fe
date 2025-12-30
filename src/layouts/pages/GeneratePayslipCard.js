// File: GeneratePayslipCard.jsx
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

import { adminGenerateBatchPayslipPdfApi } from "../../api/payrollAndCompensationApi";

function GeneratePayslipCard({ user_id, userData, showAlert }) {
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
    if (!userData || !user_id) return;

    const startDate = new Date(startYear, startMonth - 1);
    const endDate = new Date(endYear, endMonth - 1);
    const todayDate = new Date(currentYear, currentMonth - 1);

    if (startDate > endDate) {
      showAlert("Start period cannot be after end period", "error");
      return;
    }
    if (endDate > todayDate) {
      showAlert("Cannot generate payslips for future months", "error");
      return;
    }

    setGenerating(true);
    showAlert("Processing batch payslips...", "info");

    try {
      const payload = {
        user_ids: [user_id],
        start_month: startMonth,
        start_year: startYear,
        end_month: endMonth,
        end_year: endYear,
      };

      const res = await adminGenerateBatchPayslipPdfApi(payload);

      if (res.ok || res.status === 200) {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(pdfBlob);

        const userFullName = `${userData.first_name || ""} ${userData.last_name || ""}`.trim();
        const sanitizedName = userFullName.replace(/\s+/g, "_");

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Payslips_${sanitizedName}_${startMonth}_${startYear}_to_${endMonth}_${endYear}.pdf`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        showAlert(`Payslips for ${userFullName} generated successfully!`, "success");
      } else {
        showAlert("Failed to generate payslips. Check if data exists for this range.", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error while generating batch payslips", "error");
    } finally {
      setGenerating(false);
    }
  };

  const fieldStyles = {
    "& .MuiInputBase-root": { minHeight: "45px" },
    "& .MuiSelect-select": { display: "flex !important", alignItems: "center !important" },
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: "lg" }}>
      <MDBox display="flex" flexDirection="column" alignItems="flex-start">
        <MDTypography variant="h6" fontWeight="bold" mb={2}>
          Generate Payslip Range
        </MDTypography>

        <Grid container spacing={2} mb={2} sx={{ maxWidth: 600, width: "100%" }}>
          {/* Start Period */}
          <Grid item xs={12}>
            <MDTypography variant="caption" fontWeight="bold">
              START PERIOD
            </MDTypography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              label="Month"
              fullWidth
              value={startMonth}
              onChange={(e) => setStartMonth(Number(e.target.value))}
              size="small"
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
              size="small"
              sx={fieldStyles}
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* End Period */}
          <Grid item xs={12}>
            <MDTypography variant="caption" fontWeight="bold">
              END PERIOD
            </MDTypography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              select
              label="Month"
              fullWidth
              value={endMonth}
              onChange={(e) => setEndMonth(Number(e.target.value))}
              size="small"
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
              size="small"
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

        <MDButton
          variant="gradient"
          color="info"
          onClick={handleGeneratePayslip}
          disabled={generating}
          startIcon={generating && <CircularProgress size={20} color="white" />}
        >
          {generating ? "Generating..." : "Generate Batch PDF"}
        </MDButton>
      </MDBox>
    </Paper>
  );
}

GeneratePayslipCard.propTypes = {
  user_id: PropTypes.string.isRequired,
  userData: PropTypes.object.isRequired,
  showAlert: PropTypes.func.isRequired,
};

export default GeneratePayslipCard;
