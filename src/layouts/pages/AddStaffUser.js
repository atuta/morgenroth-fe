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
  const [loading, setLoading] = useState(false);

  // Field errors
  const [errors, setErrors] = useState({});

  // Server alert
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
      password: "changeme123", // default password
    };

    try {
      const response = await addUserApi(data);
      if (response.status === "success") {
        showAlert("Staff user added successfully!", "success");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhoneNumber("");
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox component="form" onSubmit={handleSubmit}>
              <MDTypography variant="h5" fontWeight="medium" mb={3}>
                Add Staff User
              </MDTypography>

              {/* First Name */}
              <MDBox mb={2}>
                <MDInput
                  label="First Name"
                  fullWidth
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  error={!!errors.firstName}
                />
                {errors.firstName && (
                  <MDTypography variant="caption" color="error">
                    {errors.firstName}
                  </MDTypography>
                )}
              </MDBox>

              {/* Last Name */}
              <MDBox mb={2}>
                <MDInput
                  label="Last Name"
                  fullWidth
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  error={!!errors.lastName}
                />
                {errors.lastName && (
                  <MDTypography variant="caption" color="error">
                    {errors.lastName}
                  </MDTypography>
                )}
              </MDBox>

              {/* Email */}
              <MDBox mb={2}>
                <MDInput
                  label="Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!errors.email}
                />
                {errors.email && (
                  <MDTypography variant="caption" color="error">
                    {errors.email}
                  </MDTypography>
                )}
              </MDBox>

              {/* Phone Number */}
              <MDBox mb={2}>
                <MDInput
                  label="Phone Number"
                  fullWidth
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  error={!!errors.phoneNumber}
                />
                {errors.phoneNumber && (
                  <MDTypography variant="caption" color="error">
                    {errors.phoneNumber}
                  </MDTypography>
                )}
              </MDBox>

              {/* User Role Title */}
              <MDBox mb={1}>
                <MDTypography
                  variant="button"
                  fontWeight="bold"
                  color="dark"
                  display="block"
                  mb={1}
                >
                  User Role
                </MDTypography>
              </MDBox>

              {/* User Role Buttons */}
              <MDBox mb={2}>
                {USER_ROLE_CHOICES.map((r) => (
                  <MDButton
                    key={r.value}
                    variant={role === r.value ? "gradient" : "outlined"}
                    color="info"
                    onClick={() => setRole(r.value)}
                    sx={{ mr: 1, mt: 1 }}
                  >
                    {r.label}
                  </MDButton>
                ))}
                {errors.role && (
                  <MDTypography variant="caption" color="error" display="block">
                    {errors.role}
                  </MDTypography>
                )}
              </MDBox>

              {/* Submit Button */}
              <MDBox mt={4}>
                <MDButton
                  type="submit"
                  variant="gradient"
                  color="info"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Staff User"}
                </MDButton>
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>

      {/* Server Response Alert */}
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
