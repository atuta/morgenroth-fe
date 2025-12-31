import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";

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
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

// Layout & Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import CustomAlert from "../../components/CustomAlert";

// API & Config
import getLoggedInUserDetailsApi from "../../api/getLoggedInUserDetailsApi";
import uploadUserPhotoApi from "../../api/uploadUserPhotoApi";
import Configs from "../../configs/Configs";

// Child Components
import CroppingModal from "./CroppingModal";
import OwnerPayslipDownloadCard from "./OwnerPayslipDownloadCard";

const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/?d=mp&s=80";
const NOT_AVAILABLE = "Not available";

function UserProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Cropping modal
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [fileToCrop, setFileToCrop] = useState(null);

  // Avatar state
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState(DEFAULT_AVATAR);
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
                {first_name || NOT_AVAILABLE} {last_name || NOT_AVAILABLE}
              </MDTypography>
              <MDTypography variant="body2" color="text">
                {email || NOT_AVAILABLE}
              </MDTypography>
              <MDTypography variant="body2" color="text">
                {user_role || NOT_AVAILABLE} • {status || NOT_AVAILABLE}
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
              {[
                { icon: <EmailIcon />, label: "Email", value: email },
                { icon: <AccountCircleIcon />, label: "Account", value: account },
                { icon: <PhoneIcon />, label: "Phone", value: phone_number },
                { icon: <FingerprintIcon />, label: "ID Number", value: id_number },
              ].map((item, idx) => (
                <MDBox key={idx} display="flex" alignItems="center" mb={1}>
                  <MDBox sx={{ mr: 1, color: "text.secondary", display: "flex" }}>
                    {item.icon}
                  </MDBox>
                  <MDTypography variant="body2" fontWeight="bold">
                    {item.label}:
                  </MDTypography>
                  <MDTypography variant="body2" ml={0.5}>
                    {item.value || NOT_AVAILABLE}
                  </MDTypography>
                </MDBox>
              ))}
              <MDBox display="flex" alignItems="center" mb={1}>
                <EventAvailableIcon fontSize="small" sx={{ mr: 1, color: "success.main" }} />
                <MDTypography variant="body2" fontWeight="bold">
                  Present Now:
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
                  {hourly_rate ? `${hourly_rate} ${hourly_rate_currency || ""}` : NOT_AVAILABLE}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" mb={1}>
                <PaidIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                <MDTypography variant="body2" fontWeight="bold">
                  NSSF Number:
                </MDTypography>
                <MDTypography variant="body2" ml={0.5}>
                  {nssf_number || NOT_AVAILABLE}
                </MDTypography>
              </MDBox>
              <MDBox display="flex" alignItems="center" mb={1}>
                <PermIdentityIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                <MDTypography variant="body2" fontWeight="bold">
                  SHA Number:
                </MDTypography>
                <MDTypography variant="body2" ml={0.5}>
                  {shif_sha_number || NOT_AVAILABLE}
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

        {/* Extracted Payslip Download Card */}
        <OwnerPayslipDownloadCard userData={userData} onAlert={showAlert} />
      </MDBox>

      <CustomAlert
        message={alertMessage}
        severity={alertSeverity}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      />

      <Footer />

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
