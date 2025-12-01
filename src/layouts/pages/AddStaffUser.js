/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
* Adjusted frontend validations and UI
=========================================================
*/

import { useState } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// API service
import addUserApi from "../../api/addUserApi";

const USER_ROLE_CHOICES = [
  { value: "admin", label: "Admin" },
  { value: "teacher", label: "Teacher" },
  { value: "subordinate", label: "Subordinate Staff" },
];

function AddStaffUser() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(""); // no default selection
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{6,15}$/;

    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    else if (firstName.length > 50) newErrors.firstName = "Max 50 characters";

    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    else if (lastName.length > 50) newErrors.lastName = "Max 50 characters";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(email)) newErrors.email = "Invalid email format";

    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    else if (!phoneRegex.test(phoneNumber)) newErrors.phoneNumber = "Invalid phone number";

    if (!role.trim()) newErrors.role = "User role is required";

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
        // Clear form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhoneNumber("");
        setRole("");
        setErrors({});
        alert("Staff user added successfully!");
      } else {
        alert(response.message || "Failed to add user");
      }
    } catch (error) {
      alert("Server error, try again");
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
                Add User
              </MDTypography>

              {/* First Name */}
              <MDBox mb={2}>
                <MDInput
                  label="First Name"
                  fullWidth
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{ borderColor: errors.firstName ? "red" : "" }}
                />
                {errors.firstName && (
                  <MDTypography variant="caption" color="error" sx={{ fontSize: "0.7rem" }}>
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
                  style={{ borderColor: errors.lastName ? "red" : "" }}
                />
                {errors.lastName && (
                  <MDTypography variant="caption" color="error" sx={{ fontSize: "0.7rem" }}>
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
                  style={{ borderColor: errors.email ? "red" : "" }}
                />
                {errors.email && (
                  <MDTypography variant="caption" color="error" sx={{ fontSize: "0.7rem" }}>
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
                  style={{ borderColor: errors.phoneNumber ? "red" : "" }}
                />
                {errors.phoneNumber && (
                  <MDTypography variant="caption" color="error" sx={{ fontSize: "0.7rem" }}>
                    {errors.phoneNumber}
                  </MDTypography>
                )}
              </MDBox>

              {/* User Role Buttons */}
              <MDBox mb={2}>
                <MDTypography variant="button" fontWeight="medium" display="block" mb={1}>
                  User Role
                </MDTypography>
                <MDBox display="flex" gap={1}>
                  {USER_ROLE_CHOICES.map((r) => (
                    <MDButton
                      key={r.value}
                      variant={role === r.value ? "gradient" : "outlined"}
                      color="info"
                      size="small"
                      onClick={() => setRole(r.value)}
                    >
                      {r.label}
                    </MDButton>
                  ))}
                </MDBox>
                {errors.role && (
                  <MDTypography variant="caption" color="error" sx={{ fontSize: "0.7rem" }}>
                    {errors.role}
                  </MDTypography>
                )}
              </MDBox>

              <MDBox mt={4}>
                <MDButton
                  type="submit"
                  variant="gradient"
                  color="info"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add User"}
                </MDButton>
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default AddStaffUser;
