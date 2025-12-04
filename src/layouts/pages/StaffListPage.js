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
import Configs from "../../configs/Configs"; // << IMPORTANT

// Default avatar
const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/?d=mp&s=60";

// Column count for loading/empty structure
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

  // Fetch staff
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const res = await getNonAdminUsersApi();
        if (res.data?.status === "success") {
          setStaffList(res.data.data);
          setFilteredStaff(res.data.data);
        } else showAlert(res.data?.message || "Failed to load staff.", "error");
      } catch (err) {
        console.error(err);
        showAlert("Server error. Could not fetch staff.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  // Search filter
  useEffect(() => {
    if (!searchTerm) return setFilteredStaff(staffList);

    const term = searchTerm.toLowerCase();
    const result = staffList.filter(
      (u) =>
        u.first_name?.toLowerCase().includes(term) ||
        u.last_name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.account?.toLowerCase().includes(term) ||
        u.user_role?.toLowerCase().includes(term) ||
        u.status?.toLowerCase().includes(term)
    );
    setFilteredStaff(result);
  }, [searchTerm, staffList]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox sx={{ margin: "0 auto 0 0" }}>
          <MDBox p={3} mb={3} bgColor="white" borderRadius="lg">
            <MDTypography variant="h5" fontWeight="bold" mb={2}>
              Staff List
            </MDTypography>

            {/* Search */}
            <MDBox mb={2}>
              <TextField
                label="Search staff by name, email or account"
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
                  sx: { backgroundColor: "white", borderRadius: 2 },
                }}
              />
            </MDBox>

            {/* Table */}
            <TableContainer component={Paper} sx={{ maxHeight: 600, boxShadow: "none" }}>
              <Table stickyHeader aria-label="staff table">
                <TableBody>
                  {/* Headers */}
                  <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                    <TableCell sx={{ fontWeight: "bold" }}>Photo</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold", display: { xs: "none", sm: "table-cell" } }}
                    >
                      Account
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        display: { xs: "none", sm: "table-cell" },
                        textAlign: "right",
                      }}
                    >
                      Hourly Rate
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        display: { xs: "none", sm: "table-cell" },
                        textAlign: "center",
                      }}
                    >
                      Currency
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>Actions</TableCell>
                  </TableRow>

                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={COLUMN_COUNT} align="center">
                        <CircularProgress size={24} />
                        <MDTypography mt={1}>Loading...</MDTypography>
                      </TableCell>
                    </TableRow>
                  ) : filteredStaff.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={COLUMN_COUNT} align="center">
                        <MDTypography>No staff found.</MDTypography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStaff.map((user) => {
                      const photoUrl = user.photo
                        ? `${Configs.baseUrl}${user.photo}?t=${Date.now()}` // Cache busting
                        : DEFAULT_AVATAR;

                      return (
                        <TableRow key={user.user_id}>
                          {/* Avatar */}
                          <TableCell>
                            <Avatar
                              src={photoUrl}
                              alt="User Photo"
                              onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                              sx={{
                                width: 40,
                                height: 40,
                                cursor: "pointer",
                                transition: "0.2s",
                                "&:hover": { transform: "scale(1.1)" },
                              }}
                              onClick={() =>
                                navigate("/user-details", { state: { user_id: user.user_id } })
                              }
                            />
                          </TableCell>

                          <TableCell>
                            <MDTypography fontWeight="bold">
                              {user.first_name} {user.last_name}
                            </MDTypography>
                            <MDTypography variant="caption" color="text">
                              ({user.user_role})
                            </MDTypography>
                          </TableCell>

                          <TableCell>{user.email}</TableCell>
                          <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                            {user.account || "N/A"}
                          </TableCell>

                          <TableCell>
                            <MDTypography
                              variant="caption"
                              fontWeight="bold"
                              color={user.status === "active" ? "success" : "error"}
                            >
                              {user.status}
                            </MDTypography>
                          </TableCell>

                          <TableCell
                            align="right"
                            sx={{ display: { xs: "none", sm: "table-cell" } }}
                          >
                            {user.hourly_rate}
                          </TableCell>

                          <TableCell
                            align="center"
                            sx={{ display: { xs: "none", sm: "table-cell" } }}
                          >
                            {user.hourly_rate_currency}
                          </TableCell>

                          <TableCell align="center">
                            <MDButton
                              variant="gradient"
                              color="info"
                              size="small"
                              onClick={() =>
                                navigate("/user-details", { state: { user_id: user.user_id } })
                              }
                            >
                              View Details
                            </MDButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
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
