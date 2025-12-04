// File: UserProfilePage.js

import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
// Removed unused Modal and Box imports

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

// API Imports (Assuming these paths are correct for your project structure)
import getLoggedInUserDetailsApi from "../../api/getLoggedInUserDetailsApi";
import uploadUserPhotoApi from "../../api/uploadUserPhotoApi";

// --- IMPORT YOUR NEWLY CREATED MODAL HERE ---
// Make sure this path is correct relative to UserProfilePage.js
import CroppingModal from "./CroppingModal";
// -------------------------------------------

const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/?d=mp&s=80";

function UserProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [generatingPayslip, setGeneratingPayslip] = useState(false);

  // Cropping Modal State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [fileToCrop, setFileToCrop] = useState(null); // File object for the modal

  // State for the photo URL shown in the Avatar (stable preview)
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(DEFAULT_AVATAR);
  // State for the last good server URL (used to revert on failure)
  const [serverPhotoUrl, setServerPhotoUrl] = useState(DEFAULT_AVATAR);

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
          const photoUrl = res.data.data.photo || DEFAULT_AVATAR;
          setUserData(res.data.data);
          // Initialize photo states
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

  // 1. Handler: Opens Modal
  const handlePhotoChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Set file object and open modal
    setFileToCrop(file);
    setCropModalOpen(true);

    // Clear the input field immediately
    e.target.value = null;
  };

  // 2. Handler: Called from CroppingModal on user confirmation
  const handleCropConfirmAndUpload = async (croppedFile) => {
    setCropModalOpen(false); // Close the modal
    setUploadingPhoto(true);

    // Show a temporary local preview of the cropped image while uploading
    const tempUrl = URL.createObjectURL(croppedFile);
    setCurrentPhotoUrl(tempUrl);

    try {
      const res = await uploadUserPhotoApi(croppedFile);

      if (res.status === "success") {
        showAlert("Photo uploaded successfully!", "success");
        const finalPhotoUrl = res.data.photo_url;

        // Update user data and persist the final URL in states
        setUserData((prev) => ({ ...prev, photo: finalPhotoUrl }));
        setCurrentPhotoUrl(finalPhotoUrl);
        setServerPhotoUrl(finalPhotoUrl);

        // Revoke temporary URL after successful update
        URL.revokeObjectURL(tempUrl);
      } else {
        showAlert(res.message || "Failed to upload photo", "error");
        // Revert to the last good server URL on failure
        setCurrentPhotoUrl(serverPhotoUrl);
        URL.revokeObjectURL(tempUrl);
      }
    } catch (err) {
      console.error(err);
      showAlert("Error processing or uploading photo", "error");
      // Revert to the last good server URL on error
      setCurrentPhotoUrl(serverPhotoUrl);
      URL.revokeObjectURL(tempUrl);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleGeneratePayslip = async () => {
    if (!userData) return;
    setGeneratingPayslip(true);
    showAlert("Generating payslip...", "info");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      showAlert(`Payslip for ${userData.first_name} generated successfully!`, "success");
    } catch (err) {
      console.error(err);
      showAlert("Failed to generate payslip. Server error.", "error");
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
        {/* Top User Info Card */}
        <Paper elevation={0} sx={{ p: 3, mb: 3, position: "relative" }}>
          <MDBox display="flex" alignItems="center" gap={3}>
            <MDBox sx={{ position: "relative" }}>
              {/* Use the stable currentPhotoUrl for the Avatar */}
              <Avatar src={currentPhotoUrl} sx={{ width: 80, height: 80 }} />

              {/* Show loading indicator over the avatar while uploading */}
              {uploadingPhoto && (
                <CircularProgress
                  size={80}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    color: "info.main",
                    zIndex: 2,
                  }}
                />
              )}

              <IconButton
                component="label"
                disabled={uploadingPhoto || cropModalOpen} // Disable while loading or modal is open
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
                  opacity: uploadingPhoto ? 0 : 1,
                  transition: "opacity 0.2s",
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

        {/* Staff Info & Financial Cards */}
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

        {/* Leave Status Card */}
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
            <MDBox display="flex" alignItems="center" gap={2} mb={1}>
              <ReceiptLongIcon sx={{ fontSize: 50, color: "info.main" }} />
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
              You can only download the payslip for the current month.
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

      {/* Cropping Modal Integration */}
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
