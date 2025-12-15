// File: StaffListPage.js

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import Checkbox from "@mui/material/Checkbox";
import SearchIcon from "@mui/icons-material/Search";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import CustomAlert from "../../components/CustomAlert";
import getNonAdminUsersApi from "../../api/getNonAdminUsersApi";
import updateUserLeaveStatusApi from "../../api/updateUserLeaveStatusApi";
import updateUserHolidayStatusApi from "../../api/updateUserHolidayStatusApi";
import Configs from "../../configs/Configs";

const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/?d=mp&s=60";
const COLUMN_COUNT = 7;

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

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const res = await getNonAdminUsersApi();
        if (res.data?.status === "success") {
          const data = res.data.data.map((u) => ({
            ...u,
            is_on_leave: u.is_on_leave === "yes",
            is_on_holiday: u.is_on_holiday === "yes",
          }));
          setStaffList(data);
          setFilteredStaff(data);
        } else {
          showAlert(res.data?.message || "Failed to load staff.", "error");
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

  useEffect(() => {
    if (!searchTerm) return setFilteredStaff(staffList);

    const term = searchTerm.toLowerCase();
    const result = staffList.filter(
      (u) =>
        u.first_name?.toLowerCase().includes(term) ||
        u.last_name?.toLowerCase().includes(term) ||
        u.user_role?.toLowerCase().includes(term)
    );
    setFilteredStaff(result);
  }, [searchTerm, staffList]);

  const handleLeaveToggle = async (user_id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const res = await updateUserLeaveStatusApi({ user_id, is_on_leave: newStatus });
      if (res.status === "success") {
        setStaffList((prev) =>
          prev.map((u) => (u.user_id === user_id ? { ...u, is_on_leave: newStatus } : u))
        );
        setFilteredStaff((prev) =>
          prev.map((u) => (u.user_id === user_id ? { ...u, is_on_leave: newStatus } : u))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleHolidayToggle = async (user_id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const res = await updateUserHolidayStatusApi({ user_id, is_on_holiday: newStatus });
      if (res.status === "success") {
        setStaffList((prev) =>
          prev.map((u) => (u.user_id === user_id ? { ...u, is_on_holiday: newStatus } : u))
        );
        setFilteredStaff((prev) =>
          prev.map((u) => (u.user_id === user_id ? { ...u, is_on_holiday: newStatus } : u))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const mandatoryChecks = (user) => ({
    "Hourly Rate": !!user.hourly_rate,
    NSSF: !!user.nssf_number,
    SHA: !!user.shif_sha_number,
    "Lunch Start": user.lunch_start != null,
    "Lunch End": user.lunch_end != null,
  });

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox p={3} bgColor="white" borderRadius="lg">
          <MDTypography variant="h5" fontWeight="bold" mb={2}>
            Staff List
          </MDTypography>

          <MDBox mb={2}>
            <TextField
              label="Search staff by name or role"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </MDBox>

          <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
            <Table stickyHeader>
              <TableBody>
                <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                  <TableCell>Photo</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Hourly Rate</TableCell>
                  <TableCell align="center">On Leave</TableCell>
                  <TableCell align="center">On Holiday</TableCell>
                  <TableCell>Mandatory Fields</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>

                {loading ? (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} align="center">
                      <CircularProgress size={24} />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStaff.map((user) => {
                    const checks = mandatoryChecks(user);
                    const hasMissing = Object.values(checks).some((v) => !v);

                    const photoUrl = user.photo
                      ? `${Configs.baseUrl}${user.photo}`
                      : DEFAULT_AVATAR;

                    return (
                      <TableRow key={user.user_id}>
                        <TableCell>
                          <Avatar
                            src={photoUrl}
                            sx={{ cursor: "pointer" }}
                            onClick={() =>
                              navigate("/user-details", {
                                state: { user_id: user.user_id },
                              })
                            }
                          />
                        </TableCell>

                        <TableCell>
                          <MDTypography
                            fontWeight="bold"
                            sx={{ color: hasMissing ? "error.main" : "inherit" }}
                          >
                            {user.first_name} {user.last_name}
                          </MDTypography>
                        </TableCell>

                        <TableCell align="right">
                          {user.hourly_rate_currency} {user.hourly_rate}
                        </TableCell>

                        <TableCell align="center">
                          <Checkbox
                            checked={user.is_on_leave}
                            onChange={() => handleLeaveToggle(user.user_id, user.is_on_leave)}
                          />
                        </TableCell>

                        <TableCell align="center">
                          <Checkbox
                            checked={user.is_on_holiday}
                            onChange={() => handleHolidayToggle(user.user_id, user.is_on_holiday)}
                          />
                        </TableCell>

                        <TableCell>
                          {Object.entries(checks).map(([label, ok]) => (
                            <MDTypography
                              key={label}
                              variant="caption"
                              display="block"
                              sx={{ color: ok ? "inherit" : "error.main" }}
                            >
                              {ok ? "✓" : "✗"} {label}
                            </MDTypography>
                          ))}
                        </TableCell>

                        <TableCell align="center">
                          <MDButton
                            size="small"
                            color="info"
                            onClick={() =>
                              navigate("/user-details", {
                                state: { user_id: user.user_id },
                              })
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
