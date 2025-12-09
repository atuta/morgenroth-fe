/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
* Note: We are using basic HTML input type="checkbox" to bypass 
* event handling issues in the custom Material Dashboard components.
=========================================================
*/

import { useState } from "react";
import Grid from "@mui/material/Grid";

// NOTE: We are intentionally removing Checkbox and FormControlLabel imports
// import Checkbox from "@mui/material/Checkbox";
// import FormControlLabel from "@mui/material/FormControlLabel";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput"; // MDInput will not be used for checkboxes
import MDButton from "components/MDButton";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function AddStaffUser() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("staff");
  const [active, setActive] = useState(true);
  const [canManagePayroll, setCanManagePayroll] = useState(false);
  const [canViewReports, setCanViewReports] = useState(false);
  const [canEditProfile, setCanEditProfile] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !email.trim()) {
      alert("Username and Email are required");
      return;
    }

    const staffData = {
      username,
      email,
      role,
      active,
      permissions: { canManagePayroll, canViewReports, canEditProfile },
    };

    console.log("Staff User Data:", staffData);
    alert("Staff user added successfully!");
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

              {/* Input fields remain the same */}
              <MDBox mb={2}>
                <MDInput
                  label="Username"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </MDBox>

              <MDBox mb={2}>
                <MDInput
                  label="Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </MDBox>

              <MDBox mb={2}>
                <MDInput
                  label="Role"
                  fullWidth
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </MDBox>

              {/* Active Checkbox - SIMPLE HTML INPUT FIX */}
              <MDBox display="flex" alignItems="center" mb={2}>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => setActive(!active)}
                  style={{ marginRight: "8px", width: "20px", height: "20px" }} // Basic inline style
                />
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  sx={{ cursor: "pointer" }}
                  onClick={() => setActive(!active)}
                >
                  Active
                </MDTypography>
              </MDBox>

              <MDTypography
                variant="caption"
                fontWeight="bold"
                textTransform="uppercase"
                mt={2}
                display="block"
              >
                Permissions
              </MDTypography>

              {/* Can Manage Payroll - SIMPLE HTML INPUT FIX */}
              <MDBox display="flex" alignItems="center" mt={1}>
                <input
                  type="checkbox"
                  checked={canManagePayroll}
                  onChange={() => setCanManagePayroll(!canManagePayroll)}
                  style={{ marginRight: "8px", width: "20px", height: "20px" }}
                />
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  sx={{ cursor: "pointer" }}
                  onClick={() => setCanManagePayroll(!canManagePayroll)}
                >
                  Can Manage Payroll
                </MDTypography>
              </MDBox>

              {/* Can View Reports - SIMPLE HTML INPUT FIX */}
              <MDBox display="flex" alignItems="center" mt={1}>
                <input
                  type="checkbox"
                  checked={canViewReports}
                  onChange={() => setCanViewReports(!canViewReports)}
                  style={{ marginRight: "8px", width: "20px", height: "20px" }}
                />
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  sx={{ cursor: "pointer" }}
                  onClick={() => setCanViewReports(!canViewReports)}
                >
                  Can View Reports
                </MDTypography>
              </MDBox>

              {/* Can Edit Profile - SIMPLE HTML INPUT FIX */}
              <MDBox display="flex" alignItems="center" mt={1}>
                <input
                  type="checkbox"
                  checked={canEditProfile}
                  onChange={() => setCanEditProfile(!canEditProfile)}
                  style={{ marginRight: "8px", width: "20px", height: "20px" }}
                />
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  sx={{ cursor: "pointer" }}
                  onClick={() => setCanEditProfile(!canEditProfile)}
                >
                  Can Edit Profile
                </MDTypography>
              </MDBox>

              {/* Submit Button */}
              <MDBox mt={4}>
                <MDButton type="submit" variant="gradient" color="info" fullWidth>
                  Add Staff User
                </MDButton>
              </MDBox>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>

      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default AddStaffUser;
