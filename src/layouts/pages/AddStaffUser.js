// File: AddStaffUser.js

import { useState } from "react";
import Grid from "@mui/material/Grid";

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
import addUserApi from "../../api/addUserApi";

// Custom alert
import CustomAlert from "../../components/CustomAlert";

const USER_ROLE_CHOICES = [
  { value: "admin", label: "Admin" },
  { value: "teacher", label: "Teacher" },
  { value: "subordinate", label: "Subordinate Staff" },
];

function AddStaffUser() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [nssfNumber, setNssfNumber] = useState("");
  const [shifShaNumber, setShifShaNumber] = useState("");
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

  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{6,15}$/;
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (!role) newErrors.role = "User role is required";
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    if (!idNumber.trim()) newErrors.idNumber = "ID number is required";

    if (firstName.length > 50) newErrors.firstName = "Max 50 characters";
    if (lastName.length > 50) newErrors.lastName = "Max 50 characters";
    if (email && !emailRegex.test(email)) newErrors.email = "Invalid email";
    if (phoneNumber && !phoneRegex.test(phoneNumber)) newErrors.phoneNumber = "Invalid phone";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    setLoading(true);
    const data = {
      email,
      first_name: firstName,
      last_name: lastName,
      role,
      phone_number: phoneNumber,
      id_number: idNumber,
      nssf_number: nssfNumber || null,
      shif_sha_number: shifShaNumber || null,
      password: "changeme123",
    };

    try {
      const response = await addUserApi(data);
      if (response.status === "success") {
        showAlert("Staff user added successfully!", "success");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhoneNumber("");
        setIdNumber("");
        setNssfNumber("");
        setShifShaNumber("");
        setRole("");
        setErrors({});
      } else {
        showAlert(response.message || "Failed to add user", "error");
      }
    } catch (err) {
      showAlert("Server error, try again", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Single Card Container */}
        <MDBox
          component="form"
          onSubmit={handleSubmit}
          sx={{ maxWidth: "600px", margin: "0 auto 0 0" }}
        >
          <MDBox p={3} bgColor="white" borderRadius="lg">
            <MDTypography variant="h5" fontWeight="bold" mb={3}>
              New Staff User Registration
            </MDTypography>

            {/* Personal & Contact Information */}
            <MDTypography variant="h6" fontWeight="medium" mb={2}>
              Personal & Contact Information
            </MDTypography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MDInput
                  label="First Name"
                  fullWidth
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={!!errors.firstName}
                />
                {errors.firstName && (
                  <MDBox mt={0.5}>
                    <MDTypography variant="caption" color="error">
                      {errors.firstName}
                    </MDTypography>
                  </MDBox>
                )}
              </Grid>
              <Grid item xs={12}>
                <MDInput
                  label="Last Name"
                  fullWidth
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  error={!!errors.lastName}
                />
                {errors.lastName && (
                  <MDBox mt={0.5}>
                    <MDTypography variant="caption" color="error">
                      {errors.lastName}
                    </MDTypography>
                  </MDBox>
                )}
              </Grid>
              <Grid item xs={12}>
                <MDInput
                  label="Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                />
                {errors.email && (
                  <MDBox mt={0.5}>
                    <MDTypography variant="caption" color="error">
                      {errors.email}
                    </MDTypography>
                  </MDBox>
                )}
              </Grid>
              <Grid item xs={12}>
                <MDInput
                  label="Phone Number"
                  fullWidth
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  error={!!errors.phoneNumber}
                />
                {errors.phoneNumber && (
                  <MDBox mt={0.5}>
                    <MDTypography variant="caption" color="error">
                      {errors.phoneNumber}
                    </MDTypography>
                  </MDBox>
                )}
              </Grid>
            </Grid>

            {/* Identification & Employment */}
            <MDBox mt={4} mb={2}>
              <MDTypography variant="h6" fontWeight="medium">
                Identification & Employment
              </MDTypography>
            </MDBox>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MDInput
                  label="ID Number"
                  fullWidth
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  error={!!errors.idNumber}
                />
                {errors.idNumber && (
                  <MDBox mt={0.5}>
                    <MDTypography variant="caption" color="error">
                      {errors.idNumber}
                    </MDTypography>
                  </MDBox>
                )}
              </Grid>
              <Grid item xs={12}>
                <MDInput
                  label="NSSF Number (optional)"
                  fullWidth
                  value={nssfNumber}
                  onChange={(e) => setNssfNumber(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <MDInput
                  label="SHIF/SHA Number (optional)"
                  fullWidth
                  value={shifShaNumber}
                  onChange={(e) => setShifShaNumber(e.target.value)}
                />
              </Grid>
            </Grid>

            {/* User Role */}
            <MDBox mt={4} mb={2}>
              <MDTypography variant="h6" fontWeight="medium">
                User Role
              </MDTypography>
            </MDBox>
            <MDBox display="flex" flexWrap="wrap" gap={1} mb={errors.role ? 0 : 2}>
              {USER_ROLE_CHOICES.map((r) => (
                <MDButton
                  key={r.value}
                  variant={role === r.value ? "gradient" : "outlined"}
                  color="info"
                  onClick={() => setRole(r.value)}
                >
                  {r.label}
                </MDButton>
              ))}
            </MDBox>
            {errors.role && (
              <MDBox mt={0.5}>
                <MDTypography variant="caption" color="error">
                  {errors.role}
                </MDTypography>
              </MDBox>
            )}

            {/* Submit Button */}
            <MDButton
              type="submit"
              variant="gradient"
              color="info"
              fullWidth
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? "Adding..." : "Add Staff User"}
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

export default AddStaffUser;
