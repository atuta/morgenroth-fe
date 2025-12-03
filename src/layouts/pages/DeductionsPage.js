// File: DeductionsPage.js

import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import TextField from "@mui/material/TextField";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import CustomAlert from "../../components/CustomAlert";

import setDeductionApi from "../../api/setDeductionApi";
import getDeductionApi from "../../api/getDeductionApi";

// Deduction options with display name and API value
const deductionOptions = [
  { display: "NSSF", value: "nssf" },
  { display: "SHIF/SHA", value: "shif_sha" },
  { display: "Housing Levy", value: "housing_levy" },
];

function DeductionsPage() {
  const [selectedDeduction, setSelectedDeduction] = useState(null);
  const [percentage, setPercentage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const [deductionsList, setDeductionsList] = useState([]);

  const showAlert = (message, severity = "info") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const validateFields = () => {
    const newErrors = {};
    if (!selectedDeduction) newErrors.selectedDeduction = "Please select a deduction.";
    if (!percentage) {
      newErrors.percentage = "Percentage is required.";
    } else if (isNaN(percentage) || Number(percentage) < 0) {
      newErrors.percentage = "Enter a valid non-negative number.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showAlert("Please correct the highlighted errors.", "warning");
    }

    return Object.keys(newErrors).length === 0;
  };

  // Fetch existing deductions (optional: API could support fetching all)
  useEffect(() => {
    const fetchDeductions = async () => {
      try {
        const savedDeductions = [];
        for (const option of deductionOptions) {
          const res = await getDeductionApi({ name: option.value });
          if (res.data?.status === "success") {
            savedDeductions.push({
              name: option.display,
              value: option.value,
              percentage: res.data.data.percentage,
            });
          }
        }
        setDeductionsList(savedDeductions);
      } catch (err) {
        console.error("Failed to fetch deductions:", err);
      }
    };
    fetchDeductions();
  }, []);

  const handleSave = async () => {
    if (!validateFields()) return;

    setAlertOpen(false);
    setLoading(true);

    try {
      const res = await setDeductionApi(selectedDeduction.value, Number(percentage));

      if (res.data?.status === "success") {
        showAlert("Deduction saved successfully", "success");

        // Update or add the record in the UI
        setDeductionsList((prev) => {
          const existingIndex = prev.findIndex((item) => item.value === selectedDeduction.value);
          const newEntry = {
            name: selectedDeduction.display,
            value: selectedDeduction.value,
            percentage: Number(percentage),
          };

          if (existingIndex > -1) {
            const updated = [...prev];
            updated[existingIndex] = newEntry;
            return updated;
          } else {
            return [...prev, newEntry];
          }
        });

        // Reset percentage field (keep selection for quick edits)
        setPercentage("");
        setErrors({});
      } else {
        showAlert(res.data?.message || "Failed to save deduction.", "error");
      }
    } catch {
      showAlert("Server error. Could not connect to the API.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox sx={{ maxWidth: "600px", margin: "0 auto 0 0" }}>
          <MDBox p={3} mb={3} bgColor="white" borderRadius="lg">
            <MDTypography variant="h5" fontWeight="bold" mb={2}>
              Statutory Deductions
            </MDTypography>

            {/* Existing Deductions Table */}
            <MDBox mb={4}>
              <MDTypography variant="subtitle2" fontWeight="medium" mb={1}>
                Existing Deductions:
              </MDTypography>
              {deductionsList.length > 0 ? (
                <TableContainer
                  component={Paper}
                  sx={{ boxShadow: "none", border: "1px solid #ddd" }}
                >
                  <Table size="small" aria-label="deductions table">
                    <TableBody>
                      <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                        <TableCell sx={{ padding: "8px 16px", fontWeight: "bold" }}>Name</TableCell>
                        <TableCell sx={{ padding: "8px 16px", fontWeight: "bold" }} align="center">
                          Percentage
                        </TableCell>
                      </TableRow>

                      {deductionsList.map((ded) => (
                        <TableRow
                          key={ded.value}
                          sx={{
                            backgroundColor:
                              selectedDeduction?.value === ded.value ? "#e0f7fa" : "inherit",
                          }}
                        >
                          <TableCell sx={{ padding: "8px 16px" }}>{ded.name}</TableCell>
                          <TableCell sx={{ padding: "8px 16px" }} align="center">
                            {ded.percentage}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <MDTypography variant="caption" display="block" color="text">
                  No deductions configured yet.
                </MDTypography>
              )}
            </MDBox>

            <Grid container spacing={3}>
              {/* Deduction Selector Buttons */}
              <Grid item xs={12}>
                <MDTypography variant="caption" fontWeight="medium" color="text" sx={{ mb: 1 }}>
                  Select Deduction:
                </MDTypography>
                <MDBox display="flex" flexWrap="wrap" gap={1} mb={errors.selectedDeduction ? 0 : 1}>
                  {deductionOptions.map((option) => (
                    <MDButton
                      key={option.value}
                      variant={selectedDeduction?.value === option.value ? "gradient" : "outlined"}
                      color="info"
                      onClick={() => setSelectedDeduction(option)}
                      sx={{
                        borderColor: errors.selectedDeduction ? "error.main" : undefined,
                        borderWidth: errors.selectedDeduction ? "2px" : "1px",
                      }}
                    >
                      {option.display}
                    </MDButton>
                  ))}
                </MDBox>
                {errors.selectedDeduction && (
                  <MDBox mt={0.5} mb={2}>
                    <MDTypography variant="caption" color="error">
                      {errors.selectedDeduction}
                    </MDTypography>
                  </MDBox>
                )}
              </Grid>

              {/* Percentage Input */}
              <Grid item xs={12}>
                <TextField
                  label="Percentage (%)"
                  type="number"
                  fullWidth
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                  error={!!errors.percentage}
                  helperText={errors.percentage}
                />
              </Grid>
            </Grid>

            <MDButton
              variant="gradient"
              color="info"
              fullWidth
              disabled={loading}
              onClick={handleSave}
              sx={{ mt: 3 }}
            >
              {loading ? "Saving..." : "Save Deduction"}
            </MDButton>
          </MDBox>
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

export default DeductionsPage;
