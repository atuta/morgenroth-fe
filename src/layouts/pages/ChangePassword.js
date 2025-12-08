import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";
import InputAdornment from "@mui/material/InputAdornment";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import changePasswordApi from "api/changePasswordApi";
import CustomAlert from "components/CustomAlert";

import { useUserContext } from "../../context/UserContext"; // <-- Context

function ChangePassword() {
  const { user } = useUserContext(); // Get user from context
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const showAlert = (msg, type = "info") => {
    setAlertMessage(msg);
    setAlertSeverity(type);
    setAlertOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!oldPassword) e.oldPassword = "Old password required";
    if (!newPassword) e.newPassword = "New password required";
    if (newPassword.length < 6) e.newPassword = "Minimum 6 characters";
    if (newPassword !== confirmPassword) e.confirm = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      const res = await changePasswordApi({
        old_password: oldPassword,
        new_password: newPassword,
      });

      // Success
      if (res.status === "success") {
        showAlert("Password changed successfully", "success");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setErrors({});

        if (user?.user_role === "admin") navigate("/dashboard");
        else navigate("/clock-in");
      }
    } catch (error) {
      // Axios error
      if (error.response && error.response.data) {
        const msg = error.response.data.message;

        switch (msg) {
          case "old_password_incorrect":
            showAlert("Old password is incorrect", "error");
            break;
          case "missing_old_or_new_password":
            showAlert("Please provide both old and new passwords", "error");
            break;
          default:
            showAlert(msg || "Failed to change password", "error");
        }
      } else {
        // Network or other unexpected errors
        showAlert("Server error. Try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <MDBox component="form" onSubmit={submit} sx={{ maxWidth: 450, ml: 0 }}>
          <MDBox p={3} bgColor="white" borderRadius="lg" boxShadow={2}>
            <MDTypography variant="h5" fontWeight="bold" mb={3}>
              Change Password
            </MDTypography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <MDInput
                  type={showOld ? "text" : "password"}
                  label="Old Password"
                  fullWidth
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  error={!!errors.oldPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon>lock</Icon>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon onClick={() => setShowOld(!showOld)} sx={{ cursor: "pointer" }}>
                          {showOld ? "visibility_off" : "visibility"}
                        </Icon>
                      </InputAdornment>
                    ),
                  }}
                />
                {errors.oldPassword && (
                  <MDTypography variant="caption" color="error">
                    {errors.oldPassword}
                  </MDTypography>
                )}
              </Grid>

              <Grid item xs={12}>
                <MDInput
                  type={showNew ? "text" : "password"}
                  label="New Password"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={!!errors.newPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon>lock</Icon>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon onClick={() => setShowNew(!showNew)} sx={{ cursor: "pointer" }}>
                          {showNew ? "visibility_off" : "visibility"}
                        </Icon>
                      </InputAdornment>
                    ),
                  }}
                />
                {errors.newPassword && (
                  <MDTypography variant="caption" color="error">
                    {errors.newPassword}
                  </MDTypography>
                )}
              </Grid>

              <Grid item xs={12}>
                <MDInput
                  type={showConfirm ? "text" : "password"}
                  label="Confirm New Password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!errors.confirm}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon>lock</Icon>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Icon
                          onClick={() => setShowConfirm(!showConfirm)}
                          sx={{ cursor: "pointer" }}
                        >
                          {showConfirm ? "visibility_off" : "visibility"}
                        </Icon>
                      </InputAdornment>
                    ),
                  }}
                />
                {errors.confirm && (
                  <MDTypography variant="caption" color="error">
                    {errors.confirm}
                  </MDTypography>
                )}
              </Grid>
            </Grid>

            <MDButton
              type="submit"
              fullWidth
              variant="gradient"
              color="info"
              disabled={loading}
              sx={{ mt: 3 }}
            >
              {loading ? "Updating..." : "Update Password"}
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>

      <CustomAlert
        open={alertOpen}
        message={alertMessage}
        severity={alertSeverity}
        onClose={() => setAlertOpen(false)}
      />

      <Footer />
    </DashboardLayout>
  );
}

export default ChangePassword;
