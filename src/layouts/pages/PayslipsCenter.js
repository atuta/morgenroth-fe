// File: PayslipsCenter.jsx
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// MD Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// API services
import getAllUserNamesAndIdsApi from "../../api/getAllUserNamesAndIdsApi";
import { adminGenerateBatchPayslipPdfApi } from "../../api/payrollAndCompensationApi";

// Custom alert
import CustomAlert from "../../components/CustomAlert";

function PayslipsCenter() {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [startMonth, setStartMonth] = useState(currentMonth);
  const [startYear, setStartYear] = useState(currentYear);
  const [endMonth, setEndMonth] = useState(currentMonth);
  const [endYear, setEndYear] = useState(currentYear);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const allowedMonths = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i).sort();

  const showAlert = (message, severity = "info") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const res = await getAllUserNamesAndIdsApi();
        if (res.status === 200 && res.data?.status === "success") {
          setAvailableUsers(res.data.data);
          setSelectedUsers(res.data.data); // Preselect all users
        } else {
          showAlert("Failed to fetch users", "error");
        }
      } catch (err) {
        console.error(err);
        showAlert("Server error while fetching users", "error");
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleGeneratePayslips = async () => {
    if (!selectedUsers.length) {
      showAlert("Please select at least one user", "error");
      return;
    }

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
        user_ids: selectedUsers.map((u) => u.user_id),
        start_month: startMonth,
        start_year: startYear,
        end_month: endMonth,
        end_year: endYear,
      };

      const res = await adminGenerateBatchPayslipPdfApi(payload);

      if (res.ok || res.status === 200) {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Batch_Payslips_${startMonth}_${startYear}_to_${endMonth}_${endYear}.pdf`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        showAlert("Batch payslips generated successfully!", "success");
      } else {
        showAlert("Failed to generate batch payslips for the selected users", "error");
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
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        {/* Changed margin from "0 auto" to 0 to align the card to the left */}
        <MDBox sx={{ maxWidth: "800px", margin: 0 }}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: "lg" }}>
            <MDTypography variant="h5" fontWeight="bold" mb={3}>
              Payslips Center
            </MDTypography>

            {/* User Selection */}
            <MDTypography variant="caption" fontWeight="bold" mb={1}>
              Select Users
            </MDTypography>
            {loadingUsers ? (
              <CircularProgress size={24} />
            ) : (
              <Autocomplete
                multiple
                options={availableUsers}
                getOptionLabel={(option) => option.full_name || ""}
                value={selectedUsers}
                onChange={(_, newValue) => setSelectedUsers(newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.full_name}
                      {...getTagProps({ index })}
                      key={option.user_id}
                    />
                  ))
                }
                renderInput={(params) => <TextField {...params} placeholder="Add users" />}
                sx={{ mt: 1, mb: 3 }}
              />
            )}

            {/* Date Range */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={6}>
                <TextField
                  select
                  label="Start Month"
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
                  label="Start Year"
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

              <Grid item xs={6}>
                <TextField
                  select
                  label="End Month"
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
                  label="End Year"
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

            {/* Generate Button */}
            <MDButton
              variant="gradient"
              color="info"
              onClick={handleGeneratePayslips}
              disabled={generating || loadingUsers}
              startIcon={generating && <CircularProgress size={20} color="white" />}
            >
              {generating ? "Generating..." : "Generate Batch PDF"}
            </MDButton>
          </Paper>
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

export default PayslipsCenter;
