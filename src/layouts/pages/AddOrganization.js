import { useState } from "react";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API service
import addOrganizationApi from "../../api/addOrganizationApi";

// Custom alert
import CustomAlert from "../../components/CustomAlert";

function AddOrganization() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [physicalAddress, setPhysicalAddress] = useState("");
  const [postalAddress, setPostalAddress] = useState("");
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const showAlert = (message, severity = "info") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file)); // Create a local preview URL
    }
  };

  const validateFields = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Organization name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    setLoading(true);
    const data = {
      name,
      email: email || null,
      telephone: telephone || null,
      physical_address: physicalAddress || null,
      postal_address: postalAddress || null,
      logo: logo, // This is the file object
    };

    try {
      const response = await addOrganizationApi(data);
      if (response.status === "success") {
        showAlert("Organization details saved successfully!", "success");
        // Reset fields if needed, or leave them for editing
      } else {
        showAlert(response.message || "Failed to save details", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error, try again", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox
          component="form"
          onSubmit={handleSubmit}
          sx={{ maxWidth: "700px", margin: "0 auto 0 0" }}
        >
          <MDBox p={3} bgColor="white" borderRadius="lg" shadow="sm">
            <MDTypography variant="h5" fontWeight="bold" mb={3}>
              Organization Settings
            </MDTypography>

            <Grid container spacing={3}>
              {/* Logo Upload Section */}
              <Grid item xs={12} display="flex" flexDirection="column" alignItems="center" mb={2}>
                <MDBox
                  variant="contained"
                  bgColor="grey-100"
                  borderRadius="lg"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  sx={{
                    width: "150px",
                    height: "150px",
                    border: "2px dashed #ccc",
                    overflow: "hidden",
                    mb: 2,
                  }}
                >
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo Preview"
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    <Icon fontSize="large" color="inherit">
                      business
                    </Icon>
                  )}
                </MDBox>
                <MDButton
                  variant="outlined"
                  color="info"
                  component="label"
                  size="small"
                  startIcon={<Icon>upload</Icon>}
                >
                  Upload Logo
                  <input type="file" hidden accept="image/*" onChange={handleLogoChange} />
                </MDButton>
              </Grid>

              {/* Basic Information */}
              <Grid item xs={12}>
                <MDInput
                  label="Organization Name"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={!!errors.name}
                />
                {errors.name && (
                  <MDTypography variant="caption" color="error" mt={0.5} display="block">
                    {errors.name}
                  </MDTypography>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <MDInput
                  label="Official Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <MDInput
                  label="Telephone"
                  fullWidth
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                />
              </Grid>

              {/* Address Information */}
              <Grid item xs={12}>
                <MDInput
                  label="Physical Address"
                  multiline
                  rows={3}
                  fullWidth
                  value={physicalAddress}
                  onChange={(e) => setPhysicalAddress(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <MDInput
                  label="Postal Address"
                  fullWidth
                  value={postalAddress}
                  onChange={(e) => setPostalAddress(e.target.value)}
                />
              </Grid>
            </Grid>

            {/* Action Button */}
            <MDBox mt={4}>
              <MDButton type="submit" variant="gradient" color="info" fullWidth disabled={loading}>
                {loading ? "Saving..." : "Save Organization Details"}
              </MDButton>
            </MDBox>
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

export default AddOrganization;
