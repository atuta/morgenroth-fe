// File: StaffListPage.js

import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import CustomAlert from "../../components/CustomAlert";

import getNonAdminUsersApi from "../../api/getNonAdminUsersApi";

// Default avatar image (can be local or URL)
const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/?d=mp&s=40";
const COLUMN_COUNT = 9; // Total number of columns

function StaffListPage() {
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const showAlert = (message, severity = "info") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  // Fetch staff on page load
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const res = await getNonAdminUsersApi();
        if (res.data?.status === "success") {
          setStaffList(res.data.data);
          setFilteredStaff(res.data.data);
        } else {
          showAlert(res.data?.message || "Failed to fetch staff.", "error");
        }
      } catch (err) {
        console.error(err);
        showAlert("Server error. Could not fetch staff.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Filter staff based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredStaff(staffList);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = staffList.filter(
      (user) =>
        user.first_name?.toLowerCase().includes(term) ||
        user.last_name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.account?.toLowerCase().includes(term) ||
        user.user_role?.toLowerCase().includes(term) ||
        user.status?.toLowerCase().includes(term)
    );
    setFilteredStaff(filtered);
  }, [searchTerm, staffList]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* MODIFICATION 1: Removed maxWidth to allow card holder to run end-to-end */}
        <MDBox sx={{ margin: "0 auto 0 0" }}>
          <MDBox p={3} mb={3} bgColor="white" borderRadius="lg" shadow="md">
            <MDTypography variant="h5" fontWeight="bold" mb={2}>
              Staff List
            </MDTypography>

            {/* Search bar */}
            <MDBox mb={2}>
              <TextField
                label="Search staff by name, email, or account"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </MDBox>

            {/* Staff Table */}
            <TableContainer
              component={Paper}
              sx={{ maxHeight: 600, border: "1px solid #ddd", boxShadow: "none" }}
            >
              <Table stickyHeader aria-label="staff table">
                <TableBody>
                  {/* --- MANUAL HEADER ROW --- */}
                  <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                    <TableCell sx={{ fontWeight: "bold", width: "5%", padding: "12px 8px" }}>
                      Photo
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "15%" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "20%" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "10%" }}>Account</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "10%" }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "10%" }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "10%", textAlign: "right" }}>
                      Hourly Rate
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "5%", textAlign: "center" }}>
                      Currency
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "15%", textAlign: "center" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                  {/* --- END MANUAL HEADER ROW --- */}

                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={COLUMN_COUNT} align="center" sx={{ py: 3 }}>
                        <CircularProgress size={24} />
                        <MDTypography variant="body2" color="text" mt={1}>
                          Loading staff data...
                        </MDTypography>
                      </TableCell>
                    </TableRow>
                  ) : filteredStaff.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={COLUMN_COUNT} align="center" sx={{ py: 3 }}>
                        <MDTypography variant="body2" color="text">
                          No staff found.
                        </MDTypography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStaff.map((user) => (
                      <TableRow key={user.user_id}>
                        <TableCell sx={{ padding: "8px 8px" }}>
                          <Avatar
                            src={user.photo || DEFAULT_AVATAR}
                            alt={`${user.first_name} ${user.last_name}`}
                            sx={{ width: 36, height: 36 }}
                          />
                        </TableCell>
                        {/* MODIFICATION 2: Removed asterisks for name bolding */}
                        <TableCell>{`${user.first_name || ""} ${user.last_name || ""}`}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.account || "N/A"}</TableCell>
                        <TableCell>{user.user_role}</TableCell>
                        <TableCell>
                          <MDTypography
                            variant="caption"
                            color={user.status === "active" ? "success" : "error"}
                            fontWeight="bold"
                          >
                            {user.status || "Unknown"}
                          </MDTypography>
                        </TableCell>
                        <TableCell align="right">{user.hourly_rate || "-"}</TableCell>
                        <TableCell align="center">{user.hourly_rate_currency || "-"}</TableCell>
                        <TableCell align="center">
                          <MDButton
                            variant="gradient"
                            color="info"
                            size="small"
                            sx={{ minWidth: 100 }}
                            href={`/user-details?user_id=${user.user_id}`}
                          >
                            View Details
                          </MDButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
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

export default StaffListPage;
