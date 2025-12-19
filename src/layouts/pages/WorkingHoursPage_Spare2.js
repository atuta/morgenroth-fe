// File: WorkingHoursPage.js

import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";

// Material UI Table Components
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Layout components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Custom components
import CustomAlert from "../../components/CustomAlert";

// API service
import getAllWorkingHoursApi from "../../api/getAllWorkingHoursApi";

function WorkingHoursPage() {
  const [workingHours, setWorkingHours] = useState({});
  const [loading, setLoading] = useState(true);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const showAlert = (message, severity = "info") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    const fetchWorkingHours = async () => {
      setLoading(true);
      try {
        const res = await getAllWorkingHoursApi();
        if (res.data?.status === "success") {
          setWorkingHours(res.data.message || {});
        } else {
          showAlert(res.data?.message || "Failed to fetch working hours", "error");
        }
      } catch (err) {
        console.error("Error fetching working hours:", err);
        showAlert("Server error while fetching working hours", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkingHours();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* Left-aligned responsive card: full width on xs, half width on lg */}
        <MDBox
          sx={{
            width: { xs: "100%", lg: "50%" },
            margin: { xs: "0 auto", lg: "0 0 0 0" }, // center on small, left on large
          }}
        >
          <MDBox p={3} mb={3} bgColor="white" borderRadius="lg" sx={{ boxShadow: 1 }}>
            <MDTypography variant="h5" fontWeight="bold" mb={3}>
              Working Hours by Role
            </MDTypography>

            {loading ? (
              <MDTypography>Loading working hours...</MDTypography>
            ) : Object.keys(workingHours).length === 0 ? (
              <MDTypography>No working hours data available.</MDTypography>
            ) : (
              Object.keys(workingHours).map((role) => (
                <MDBox key={role} mb={4}>
                  <MDTypography variant="h6" fontWeight="medium" mb={1}>
                    Role: {role.charAt(0).toUpperCase() + role.slice(1)}
                  </MDTypography>
                  <TableContainer
                    component={Paper}
                    sx={{ boxShadow: "none", border: "1px solid #ddd" }}
                  >
                    <Table size="small" aria-label={`${role} working hours`}>
                      <TableBody>
                        {/* Header row */}
                        <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                          <TableCell sx={{ padding: "8px 16px", fontWeight: "bold" }}>
                            Day
                          </TableCell>
                          <TableCell
                            sx={{ padding: "8px 16px", fontWeight: "bold" }}
                            align="center"
                          >
                            Start Time
                          </TableCell>
                          <TableCell
                            sx={{ padding: "8px 16px", fontWeight: "bold" }}
                            align="center"
                          >
                            End Time
                          </TableCell>
                        </TableRow>

                        {/* Data rows */}
                        {daysOfWeek.map((day) => {
                          const dayHours = workingHours[role]?.[day.toLowerCase()];
                          return (
                            <TableRow key={day}>
                              <TableCell sx={{ padding: "8px 16px" }}>{day}</TableCell>
                              <TableCell sx={{ padding: "8px 16px" }} align="center">
                                {dayHours?.start || "-"}
                              </TableCell>
                              <TableCell sx={{ padding: "8px 16px" }} align="center">
                                {dayHours?.end || "-"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </MDBox>
              ))
            )}
          </MDBox>
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

export default WorkingHoursPage;
