// File: UserDetailsPage.js
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";

// Icons
import AccessTimeIcon from "@mui/icons-material/AccessTimeOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailableOutlined";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Internal Components & API
import EditableFields from "./EditableFields"; // <--- Imported new component
import getUserDetailsApi from "../../api/getUserDetailsApi";
import updateUserLeaveStatusApi from "../../api/updateUserLeaveStatusApi";
import CustomAlert from "../../components/CustomAlert";
import Configs from "../../configs/Configs";
import { adminGenerateUserPayslipPdfApi } from "../../api/payrollAndCompensationApi";

const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/?d=mp&s=80";

function UserDetailsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const userIdFromUrl = searchParams.get("user_id");

  const user_id = state?.user_id || userIdFromUrl;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [togglingLeave, setTogglingLeave] = useState(false);
  const [generatingPayslip, setGeneratingPayslip] = useState(false);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  // Payslip dropdown state
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const allowedMonths = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i).reverse();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const showAlert = (msg, severity = "info") => {
    setAlertMessage(msg);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  // Fetch user details on mount
  useEffect(() => {
    if (!user_id) {
      showAlert("No user selected", "error");
      setLoading(false);
      return;
    }

    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const res = await getUserDetailsApi({ user_id });
        if (res.data.status === "success") {
          setUserData(res.data.data);
        } else {
          showAlert(res.data.message || "Failed to fetch user details", "error");
        }
      } catch (err) {
        console.error(err);
        showAlert("Server error while fetching user details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user_id]);

  const handleLeaveToggle = async (event) => {
    if (!user_id) return;
    const newLeaveStatus = event.target.checked;

    setUserData((prev) => ({ ...prev, is_on_leave: newLeaveStatus }));
    setTogglingLeave(true);

    try {
      await updateUserLeaveStatusApi({
        user_id,
        is_on_leave: newLeaveStatus,
      });

      showAlert(
        `User leave status updated to: ${newLeaveStatus ? "On Leave" : "Working"}`,
        "success"
      );
    } catch (err) {
      console.error(err);
      showAlert("Server error while updating leave status", "error");
      setUserData((prev) => ({ ...prev, is_on_leave: !newLeaveStatus }));
    } finally {
      setTogglingLeave(false);
    }
  };

  const handleGeneratePayslip = async () => {
    if (!userData || !user_id) return;

    const todayDate = new Date();
    if (
      year > todayDate.getFullYear() ||
      (year === todayDate.getFullYear() && month > todayDate.getMonth() + 1)
    ) {
      showAlert("Cannot generate payslip for a future month/year", "error");
      return;
    }

    setGeneratingPayslip(true);
    showAlert("Generating payslip...", "info");

    try {
      const params = { user_id, month, year };
      const res = await adminGenerateUserPayslipPdfApi(params);

      if (res.ok) {
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(pdfBlob);
        const userFullName = `${userData.first_name || ""} ${userData.last_name || ""}`.trim();
        const sanitizedName = userFullName.replace(/\s+/g, "_");

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `Payslip_${sanitizedName}_${month}_${year}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        showAlert(`Payslip for ${userFullName} downloaded successfully!`, "success");
      } else {
        const errorText = await res.data.text();
        showAlert(errorText || "Failed to generate payslip", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error while generating payslip", "error");
    } finally {
      setGeneratingPayslip(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <MDBox display="flex" justifyContent="center" alignItems="center" height="70vh">
          <CircularProgress />
        </MDBox>
      </DashboardLayout>
    );
  }

  if (!userData) return null;

  const { email, first_name, last_name, user_role, status, photo, is_on_leave } = userData;

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <MDBox sx={{ margin: "0 auto 0 0" }}>
          <MDButton variant="outlined" color="info" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
            Back
          </MDButton>

          <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
            <MDBox display="flex" alignItems="center" gap={3} flexWrap="wrap">
              <Avatar
                src={photo ? `${Configs.baseUrl}${photo}` : DEFAULT_AVATAR}
                sx={{ width: 80, height: 80 }}
              />
              <MDBox flexGrow={1} minWidth={200}>
                <MDTypography variant="h5" fontWeight="bold">
                  {first_name} {last_name}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {email}
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  {user_role} • {status}
                </MDTypography>

                <MDBox mt={2} display="flex" gap={2} flexWrap="wrap">
                  <MDButton
                    variant="outlined"
                    color="warning"
                    startIcon={<EventAvailableIcon />}
                    onClick={() =>
                      navigate("/record-advance-payments", {
                        state: { user_id, photo, full_name: `${first_name} ${last_name}` },
                      })
                    }
                  >
                    Record Advance Payment
                  </MDButton>

                  <MDButton
                    variant="outlined"
                    color="info"
                    startIcon={<EventAvailableIcon />}
                    onClick={() =>
                      navigate("/record-overtime-payments", {
                        state: { user_id, photo, full_name: `${first_name} ${last_name}` },
                      })
                    }
                  >
                    Record Overtime Payment
                  </MDButton>

                  <MDButton
                    variant="outlined"
                    color="secondary"
                    startIcon={<AccessTimeIcon />}
                    onClick={() =>
                      navigate("/hour-correction", {
                        state: { user_id, photo, full_name: `${first_name} ${last_name}` },
                      })
                    }
                  >
                    Record Hour Correction
                  </MDButton>
                </MDBox>
              </MDBox>
            </MDBox>
          </Paper>

          {/* New Extracted Component */}
          <EditableFields
            userData={userData}
            user_id={user_id}
            showAlert={showAlert}
            onUpdateSuccess={(updatedFields) => {
              setUserData((prev) => ({ ...prev, ...updatedFields }));
            }}
          />

          {/* Leave Status Management Card */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: "lg", mb: 3 }}>
            <MDTypography variant="h6" fontWeight="bold" mb={2}>
              Leave Status Management
            </MDTypography>

            <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
              <Grid item xs={12} sm={6}>
                <MDBox display="flex" alignItems="center">
                  <MDTypography variant="body1">
                    Current Status:
                    <MDTypography
                      component="span"
                      variant="body1"
                      fontWeight="bold"
                      color={is_on_leave ? "error" : "success"}
                      ml={1}
                    >
                      {is_on_leave ? "ON LEAVE" : "WORKING"}
                    </MDTypography>
                  </MDTypography>
                </MDBox>
              </Grid>
              <Grid item xs={12} sm={6} sx={{ textAlign: { xs: "left", sm: "right" } }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={is_on_leave}
                      onChange={handleLeaveToggle}
                      disabled={togglingLeave}
                    />
                  }
                  label={
                    togglingLeave ? (
                      <CircularProgress size={20} />
                    ) : is_on_leave ? (
                      "Set to Working"
                    ) : (
                      "Set to On Leave"
                    )
                  }
                  labelPlacement="start"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Payslip Action Card */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: "lg" }}>
            <MDBox display="flex" flexDirection="column" alignItems="flex-start">
              <MDTypography variant="h6" fontWeight="bold" mb={2}>
                Generate Payslip
              </MDTypography>

              <Grid container spacing={2} mb={2} sx={{ maxWidth: 400, width: "100%" }}>
                <Grid item xs={6}>
                  <TextField
                    select
                    label="Month"
                    fullWidth
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    size="small"
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
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    size="small"
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
                disabled={generatingPayslip}
                startIcon={generatingPayslip && <CircularProgress size={20} color="white" />}
              >
                {generatingPayslip ? "Generating..." : "Generate Payslip"}
              </MDButton>
            </MDBox>
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

export default UserDetailsPage;
