// File: UserDetailsPage.js
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import getUserDetailsApi from "../../api/getUserDetailsApi";
import CustomAlert from "../../components/CustomAlert";

const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/?d=mp&s=80";

function UserDetailsPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const userIdFromUrl = searchParams.get("user_id");

  // Prefer state.user_id, fallback to URL param
  const user_id = state?.user_id || userIdFromUrl;

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const showAlert = (msg, severity = "info") => {
    setAlertMessage(msg);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  useEffect(() => {
    if (!user_id) {
      showAlert("No user selected", "error");
      setLoading(false);
      return;
    }

    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        console.log("Fetching user details for:", user_id);
        const res = await getUserDetailsApi({ user_id });

        console.log("API response:", res);

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

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox p={3}>
        {/* Back Button */}
        <MDButton
          variant="outlined"
          color="info" // <-- make it blue
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Back
        </MDButton>

        {/* User Header */}
        <MDBox
          display="flex"
          alignItems="center"
          gap={3}
          bgColor="#fff"
          px={3}
          py={2}
          borderRadius="lg"
          boxShadow="sm"
        >
          <Avatar src={userData.photo || DEFAULT_AVATAR} sx={{ width: 80, height: 80 }} />
          <MDBox>
            <MDTypography variant="h5" fontWeight="bold">
              {userData.first_name} {userData.last_name}
            </MDTypography>
            <MDTypography variant="body2" color="text">
              {userData.email}
            </MDTypography>
            <MDTypography variant="body2" color="text">
              {userData.user_role} • {userData.status}
            </MDTypography>
          </MDBox>
        </MDBox>

        {/* Staff Details */}
        <MDBox mt={3} p={3} bgColor="#fff" borderRadius="lg" boxShadow="sm">
          <MDTypography variant="h6" fontWeight="bold" mb={2}>
            Staff Information
          </MDTypography>

          <MDTypography>Email: {userData.email}</MDTypography>
          <MDTypography>Account: {userData.account || "N/A"}</MDTypography>
          <MDTypography>
            Hourly Rate: {userData.hourly_rate} {userData.hourly_rate_currency}
          </MDTypography>
          <MDTypography>Phone: {userData.phone_number || "-"}</MDTypography>
          <MDTypography>ID Number: {userData.id_number || "-"}</MDTypography>
          <MDTypography>NSSF: {userData.nssf_number || "-"}</MDTypography>
          <MDTypography>SHA Number: {userData.shif_sha_number || "-"}</MDTypography>
          <MDTypography>Present Today: {userData.is_present_today ? "Yes" : "No"}</MDTypography>
          <MDTypography>On Leave: {userData.is_on_leave ? "Yes" : "No"}</MDTypography>
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
