// File: StaffListPage.js

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import CustomAlert from "../../components/CustomAlert";

import getNonAdminUsersApi from "../../api/getNonAdminUsersApi";

// Default avatar image
const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/?d=mp&s=40";
// COLUMN_COUNT is 8 (max) but will be 5 on mobile
const COLUMN_COUNT = 8;

function StaffListPage() {
  const navigate = useNavigate();

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
        <MDBox sx={{ margin: "0 auto 0 0" }}>
          {/* Shadow removed */}
          <MDBox p={3} mb={3} bgColor="white" borderRadius="lg">
            <MDTypography variant="h5" fontWeight="bold" mb={2}>
              Staff List
            </MDTypography>

            {/* Search Bar - Dynamic Outline/Icon */}
            <MDBox mb={2}>
              <TextField
                label="Search staff by name, email, or account"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: "white",
                    borderRadius: 2,
                    "& input": { backgroundColor: "white" },
                  },
                }}
              />
            </MDBox>

            {/* Staff Table */}
            <TableContainer
              component={Paper}
              sx={{ maxHeight: 600, border: "1px solid #ddd", boxShadow: "none" }}
            >
              <Table stickyHeader aria-label="staff table">
                <TableBody>
                  {/* Header Row - RESPONSIVENESS APPLIED */}
                  <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                    <TableCell sx={{ fontWeight: "bold", width: "8%", padding: "12px 8px" }}>
                      Photo
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "20%" }}>Email</TableCell>
                    {/* Account Column: Hidden on extra-small/small screens */}
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        width: "10%",
                        display: { xs: "none", sm: "table-cell" },
                      }}
                    >
                      Account
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "10%" }}>Status</TableCell>
                    {/* Hourly Rate Column: Hidden on extra-small/small screens */}
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        width: "10%",
                        textAlign: "right",
                        display: { xs: "none", sm: "table-cell" },
                      }}
                    >
                      Hourly Rate
                    </TableCell>
                    {/* Currency Column: Hidden on extra-small/small screens */}
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        width: "7%",
                        textAlign: "center",
                        display: { xs: "none", sm: "table-cell" },
                      }}
                    >
                      Currency
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", width: "15%", textAlign: "center" }}>
                      Actions
                    </TableCell>
                  </TableRow>

                  {/* Table Body */}
                  {loading ? (
                    <TableRow>
                      {/* colSpan is dynamically adjusted for mobile (5 columns visible) */}
                      <TableCell
                        colSpan={COLUMN_COUNT}
                        align="center"
                        sx={{ py: 3, "&.MuiTableCell-root": { colSpan: { xs: 5, sm: 8 } } }}
                      >
                        <CircularProgress size={24} />
                        <MDTypography variant="body2" color="text" mt={1}>
                          Loading staff data...
                        </MDTypography>
                      </TableCell>
                    </TableRow>
                  ) : filteredStaff.length === 0 ? (
                    <TableRow>
                      {/* colSpan is dynamically adjusted for mobile (5 columns visible) */}
                      <TableCell
                        colSpan={COLUMN_COUNT}
                        align="center"
                        sx={{ py: 3, "&.MuiTableCell-root": { colSpan: { xs: 5, sm: 8 } } }}
                      >
                        <MDTypography variant="body2" color="text">
                          No staff found.
                        </MDTypography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStaff.map((user) => (
                      <TableRow key={user.user_id}>
                        {/* Photo */}
                        <TableCell sx={{ padding: "8px 8px", width: "8%" }}>
                          <Avatar
                            src={user.photo || DEFAULT_AVATAR}
                            alt={`${user.first_name} ${user.last_name}`}
                            sx={{ width: 36, height: 36 }}
                          />
                        </TableCell>
                        {/* Name and Role combined */}
                        <TableCell>
                          <MDBox display="flex" flexDirection="column" alignItems="flex-start">
                            <MDTypography component="span" variant="body2" fontWeight="medium">
                              {`${user.first_name || ""} ${user.last_name || ""}`}
                            </MDTypography>
                            {user.user_role && user.user_role !== "N/A" && (
                              <MDTypography component="span" variant="caption" color="text">
                                ({user.user_role})
                              </MDTypography>
                            )}
                          </MDBox>
                        </TableCell>
                        {/* Email */}
                        <TableCell sx={{ width: "20%" }}>{user.email}</TableCell>

                        {/* Account - Hidden on mobile */}
                        <TableCell sx={{ width: "10%", display: { xs: "none", sm: "table-cell" } }}>
                          {user.account || "N/A"}
                        </TableCell>

                        {/* Status */}
                        <TableCell sx={{ width: "10%" }}>
                          <MDTypography
                            variant="caption"
                            color={user.status === "active" ? "success" : "error"}
                            fontWeight="bold"
                          >
                            {user.status || "Unknown"}
                          </MDTypography>
                        </TableCell>

                        {/* Hourly Rate - Hidden on mobile */}
                        <TableCell
                          align="right"
                          sx={{ width: "10%", display: { xs: "none", sm: "table-cell" } }}
                        >
                          {user.hourly_rate || "-"}
                        </TableCell>

                        {/* Currency - Hidden on mobile */}
                        <TableCell
                          align="center"
                          sx={{ width: "7%", display: { xs: "none", sm: "table-cell" } }}
                        >
                          {user.hourly_rate_currency || "-"}
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="center" sx={{ width: "15%" }}>
                          <MDButton
                            variant="gradient"
                            color="info"
                            size="small"
                            sx={{ minWidth: 100 }}
                            // Navigation uses the navigate function to pass state
                            onClick={() =>
                              navigate("/user-details", { state: { user_id: user.user_id } })
                            }
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
