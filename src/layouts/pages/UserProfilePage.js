// File: UserProfilePage.js

import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

// Icons
import EmailIcon from "@mui/icons-material/EmailOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircleOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoneyOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import FingerprintIcon from "@mui/icons-material/FingerprintOutlined";
import PaidIcon from "@mui/icons-material/PaidOutlined";
import PermIdentityIcon from "@mui/icons-material/PermIdentityOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailableOutlined";
import EventBusyIcon from "@mui/icons-material/EventBusyOutlined";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLongOutlined";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import CustomAlert from "../../components/CustomAlert";

import getLoggedInUserDetailsApi from "../../api/getLoggedInUserDetailsApi";
import uploadUserPhotoApi from "../../api/uploadUserPhotoApi";
import { generateUserPayslipPdfApi } from "../../api/payrollAndCompensationApi";
import Configs from "../../configs/Configs";

import CroppingModal from "./CroppingModal";

const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/?d=mp&s=80";

function UserProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [generatingPayslip, setGeneratingPayslip] = useState(false);

  // Cropping modal
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [fileToCrop, setFileToCrop] = useState(null);

  // Avatar state
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(DEFAULT_AVATAR);
  const [serverPhotoUrl, setServerPhotoUrl] = useState(DEFAULT_AVATAR);

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

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await getLoggedInUserDetailsApi();
        if (res.data.status === "success") {
          const photoPath = res.data.data.photo;
          const photoUrl = photoPath ? `${Configs.baseUrl}${photoPath}` : DEFAULT_AVATAR;

          setUserData(res.data.data);
          setCurrentPhotoUrl(photoUrl);
          setServerPhotoUrl(photoUrl);
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
  }, []);

  const handlePhotoChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const tempUrl = URL.createObjectURL(file);
    setCurrentPhotoUrl(tempUrl);

    setFileToCrop(file);
    setCropModalOpen(true);

    e.target.value = null;
  };

  const handleCropConfirmAndUpload = async (croppedFile) => {
    setCropModalOpen(false);
    setUploadingPhoto(true);

    const tempUrl = URL.createObjectURL(croppedFile);
    setCurrentPhotoUrl(tempUrl);

    try {
      const res = await uploadUserPhotoApi(croppedFile);

      if (res.status === "success") {
        const finalPhotoUrl = `${Configs.baseUrl}${res.data.photo}`;

        setUserData((prev) => ({ ...prev, photo: finalPhotoUrl }));
        setCurrentPhotoUrl(finalPhotoUrl);
        setServerPhotoUrl(finalPhotoUrl);

        showAlert(res.message || "Photo uploaded successfully!", "success");
      } else {
        showAlert(res.message || "Failed to upload photo", "error");
        setCurrentPhotoUrl(serverPhotoUrl);
      }

      URL.revokeObjectURL(tempUrl);
    } catch (err) {
      console.error(err);
      showAlert("Error uploading photo", "error");
      setCurrentPhotoUrl(serverPhotoUrl);
      URL.revokeObjectURL(tempUrl);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleGeneratePayslip = async () => {
    if (!userData) return;

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
      const res = await generateUserPayslipPdfApi({ month, year });
      if (res.ok) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;

        // --- FIX STARTS HERE ---

        // 1. Construct the full name, replacing spaces with underscores (for clean filename)
        const userFullName = `${userData.first_name || ""} ${userData.last_name || ""}`.trim();
        const sanitizedName = userFullName.replace(/\s+/g, "_");

        // 2. Use the sanitized name in the download attribute
        // Example: Payslip_John_Doe_12_2025.pdf
        link.setAttribute("download", `Payslip_${sanitizedName}_${month}_${year}.pdf`);

        // --- FIX ENDS HERE ---

        document.body.appendChild(link);
        link.click();
        link.remove();
        showAlert(`Payslip for ${month}/${year} generated successfully!`, "success");
      } else {
        showAlert(res.data.message || "Failed to generate payslip", "error");
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

  const {
    email,
    first_name,
    last_name,
    user_role,
    status,
    account,
    phone_number,
    id_number,
    is_present_today,
    is_on_leave,
    hourly_rate,
    hourly_rate_currency,
    nssf_number,
    shif_sha_number,
  } = userData;

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        {/* User Info Card */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, position: "relative" }}>
          <MDBox display="flex" alignItems="center" gap={3}>
            <MDBox sx={{ position: "relative" }}>
              <Avatar src={currentPhotoUrl} sx={{ width: 80, height: 80 }} />
              {uploadingPhoto && (
                <CircularProgress
                  size={80}
                  sx={{ position: "absolute", top: 0, left: 0, color: "info.main", zIndex: 2 }}
                />
              )}
              <IconButton
                component="label"
                disabled={uploadingPhoto || cropModalOpen}
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  bgcolor: "background.paper",
                  "&:hover": { bgcolor: "grey.300" },
                  border: "1px solid",
                  borderColor: "divider",
                  width: 28,
                  height: 28,
                  p: 0,
                  zIndex: 3,
                }}
              >
                <PhotoCameraIcon fontSize="small" />
                <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
              </IconButton>
            </MDBox>

            <MDBox>
              <MDTypography variant="h5" fontWeight="bold">
                {first_name} {last_name}
              </MDTypography>
              <MDTypography variant="body2" color="text">
                {email}
              </MDTypography>
              <MDTypography variant="body2" color="text">
                {user_role} • {status}
              </MDTypography>
            </MDBox>
          </MDBox>
        </Paper>

        {/* Staff & Financial Info Cards */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, height: "100%" }}>
              <MDTypography variant="h6" fontWeight="bold" mb={2}>
                Staff Information
              </MDTypography>
              <MDBox display="flex" alignItems="center" mb={1}>
                <EmailIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                <MDTypography variant="body2" fontWeight="bold">
                  Email:
                </MDTypography>
                <MDTypography variant="body2" ml={0.5}>
                  {email}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" mb={1}>
                <AccountCircleIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                <MDTypography variant="body2" fontWeight="bold">
                  Account:
                </MDTypography>
                <MDTypography variant="body2" ml={0.5}>
                  {account || "-"}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" mb={1}>
                <PhoneIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                <MDTypography variant="body2" fontWeight="bold">
                  Phone:
                </MDTypography>
                <MDTypography variant="body2" ml={0.5}>
                  {phone_number || "-"}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" mb={1}>
                <FingerprintIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                <MDTypography variant="body2" fontWeight="bold">
                  ID Number:
                </MDTypography>
                <MDTypography variant="body2" ml={0.5}>
                  {id_number || "-"}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" mb={1}>
                <EventAvailableIcon fontSize="small" sx={{ mr: 1, color: "success.main" }} />
                <MDTypography variant="body2" fontWeight="bold">
                  Present Today:
                </MDTypography>
                <MDTypography variant="body2" ml={0.5}>
                  {is_present_today ? "Yes" : "No"}
                </MDTypography>
              </MDBox>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 2, height: "100%" }}>
              <MDTypography variant="h6" fontWeight="bold" mb={2}>
                Financial & Statutory
              </MDTypography>
              <MDBox display="flex" alignItems="center" mb={1}>
                <AttachMoneyIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                <MDTypography variant="body2" fontWeight="bold">
                  Hourly Rate:
                </MDTypography>
                <MDTypography variant="body2" ml={0.5}>
                  {hourly_rate} {hourly_rate_currency}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" mb={1}>
                <PaidIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                <MDTypography variant="body2" fontWeight="bold">
                  NSSF Number:
                </MDTypography>
                <MDTypography variant="body2" ml={0.5}>
                  {nssf_number}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" mb={1}>
                <PermIdentityIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                <MDTypography variant="body2" fontWeight="bold">
                  SHA Number:
                </MDTypography>
                <MDTypography variant="body2" ml={0.5}>
                  {shif_sha_number}
                </MDTypography>
              </MDBox>
            </Paper>
          </Grid>
        </Grid>

        {/* Leave Status */}
        <MDBox mt={3}>
          <Paper elevation={0} sx={{ p: 2 }}>
            <MDTypography variant="h6" fontWeight="bold" mb={2}>
              Leave Status
            </MDTypography>
            <MDBox display="flex" alignItems="center">
              <EventBusyIcon
                fontSize="large"
                sx={{ mr: 1, color: is_on_leave ? "error.main" : "success.main" }}
              />
              <MDTypography variant="body1" fontWeight="bold">
                {is_on_leave ? "ON LEAVE" : "WORKING"}
              </MDTypography>
            </MDBox>
          </Paper>
        </MDBox>

        {/* Payslip Card */}
        <MDBox mt={3}>
          <Paper elevation={0} sx={{ p: 2 }}>
            <MDTypography variant="h6" fontWeight="bold" mb={2}>
              Payslip
            </MDTypography>

            {/* ADDED: sx prop to limit the overall width of the dropdown container */}
            <Grid container spacing={2} mb={2} sx={{ maxWidth: 400, width: "100%" }}>
              {/* Month */}
              <Grid item xs={6}>
                <TextField
                  select
                  label="Month"
                  fullWidth
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  sx={{
                    "& .MuiInputBase-root": {
                      minHeight: 48, // Taller size retained
                      paddingTop: 0,
                      paddingBottom: 0,
                    },
                  }}
                >
                  {allowedMonths.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Year */}
              <Grid item xs={6}>
                <TextField
                  select
                  label="Year"
                  fullWidth
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  sx={{
                    "& .MuiInputBase-root": {
                      minHeight: 48, // Taller size retained
                      paddingTop: 0,
                      paddingBottom: 0,
                    },
                  }}
                >
                  {years.map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <MDBox display="flex" alignItems="center" gap={2} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                onClick={handleGeneratePayslip}
                disabled={generatingPayslip}
                startIcon={generatingPayslip && <CircularProgress size={20} color="white" />}
              >
                {generatingPayslip ? "Generating..." : "Download Payslip"}
              </MDButton>
            </MDBox>
            <MDTypography variant="caption" color="text.secondary">
              You can only download the payslip for the current or previous months. Future months
              are disabled.
            </MDTypography>
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

      {/* Cropping Modal */}
      {cropModalOpen && (
        <CroppingModal
          open={cropModalOpen}
          onClose={() => setCropModalOpen(false)}
          file={fileToCrop}
          onCropConfirm={handleCropConfirmAndUpload}
        />
      )}
    </DashboardLayout>
  );
}

export default UserProfilePage;
