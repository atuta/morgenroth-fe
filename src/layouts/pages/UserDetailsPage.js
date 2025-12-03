// File: UserDetailsPage.js
import { useLocation } from "react-router-dom";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function UserDetailsPage() {
  const { state } = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const userIdFromUrl = searchParams.get("user_id");

  // Prefer state.user_id, fallback to URL param
  const user_id = state?.user_id || userIdFromUrl || "No user_id provided";

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
        flexDirection="column"
      >
        <MDTypography variant="h4" fontWeight="bold">
          Hello world
        </MDTypography>
        <MDTypography variant="h6" mt={2}>
          User ID: {user_id}
        </MDTypography>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default UserDetailsPage;
