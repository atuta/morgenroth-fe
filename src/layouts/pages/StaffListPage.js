// File: StaffListPage.js

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
  Avatar,
  CircularProgress,
  InputAdornment,
  Checkbox,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

// Icons
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";

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
import deleteUserApi from "../../api/deleteUserApi";
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

  // DELETE DIALOG STATE
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showAlert = (message, severity = "info") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  // ================= FETCH =================
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
    if (!searchTerm) {
      setFilteredStaff(staffList);
      return;
    }

    const term = searchTerm.toLowerCase();
    setFilteredStaff(
      staffList.filter(
        (u) =>
          u.first_name?.toLowerCase().includes(term) ||
          u.last_name?.toLowerCase().includes(term) ||
          u.user_role?.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, staffList]);

  // ================= TOGGLES (UNTOUCHED) =================
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

  // ================= DELETE =================
  const openDeleteConfirm = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const closeDeleteConfirm = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const res = await deleteUserApi(userToDelete.user_id);

      if (res?.status === "success") {
        showAlert("Staff deleted successfully", "success");
        setStaffList((prev) => prev.filter((u) => u.user_id !== userToDelete.user_id));
        setFilteredStaff((prev) => prev.filter((u) => u.user_id !== userToDelete.user_id));
      } else {
        showAlert("Failed to delete staff", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Failed to delete staff", "error");
    } finally {
      setIsDeleting(false);
      closeDeleteConfirm();
    }
  };

  const mandatoryChecks = (user) => ({
    "Hourly Rate": !!user.hourly_rate,
    NSSF: !!user.nssf_number,
    SHA: !!user.shif_sha_number,
    "Lunch Start": user.lunch_start != null,
    "Lunch End": user.lunch_end != null,
  });

  // ================= UI =================
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <MDBox p={3} bgColor="white" borderRadius="xl" shadow="lg">
          <MDTypography variant="h5" fontWeight="bold" mb={3}>
            Staff Management
          </MDTypography>

          <MDBox mb={3}>
            <TextField
              placeholder="Search staff by name or role"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="info" />
                  </InputAdornment>
                ),
              }}
            />
          </MDBox>

          <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
            <Table>
              <TableBody>
                <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Photo</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Staff Profile</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Rate</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Leave
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Holiday
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Configuration</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>

                {loading ? (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} align="center">
                      <CircularProgress size={28} />
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
                      <TableRow key={user.user_id} hover>
                        <TableCell>
                          <Avatar src={photoUrl} variant="rounded" sx={{ width: 46, height: 46 }} />
                        </TableCell>

                        <TableCell>
                          <MDTypography
                            fontWeight="bold"
                            sx={{
                              fontSize: "0.9rem", // 🔽 reduced
                              color: hasMissing ? "error.main" : "dark.main",
                            }}
                          >
                            {user.first_name} {user.last_name}
                          </MDTypography>
                          <MDTypography variant="caption" color="text">
                            ({user.user_role} staff)
                          </MDTypography>
                        </TableCell>

                        <TableCell>
                          <MDTypography
                            fontWeight="medium"
                            sx={{ fontSize: "0.85rem" }} // 🔽 reduced
                          >
                            {user.hourly_rate || "0.00"} KES
                          </MDTypography>
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
                              sx={{ color: ok ? "success.main" : "error.main" }}
                            >
                              {ok ? "✓" : "✕"} {label}
                            </MDTypography>
                          ))}
                        </TableCell>

                        <TableCell align="center">
                          <Tooltip title="View details">
                            <IconButton
                              color="info"
                              onClick={() =>
                                navigate("/user-details", { state: { user_id: user.user_id } })
                              }
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete staff">
                            <IconButton color="error" onClick={() => openDeleteConfirm(user)}>
                              <DeleteOutlineIcon />
                            </IconButton>
                          </Tooltip>
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

      {/* DELETE DIALOG */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteConfirm}>
        <DialogTitle sx={{ color: "error.main", fontWeight: "bold" }}>
          Confirm Permanent Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to delete{" "}
            <strong>
              {userToDelete?.first_name} {userToDelete?.last_name}
            </strong>
            .<br />
            <br />
            This will permanently remove their profile and all associated history.
            <strong> This action cannot be undone.</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MDButton onClick={closeDeleteConfirm} color="dark" variant="text">
            Cancel
          </MDButton>
          <MDButton onClick={handleDeleteUser} color="error" variant="gradient">
            {isDeleting ? "Deleting..." : "Permanently Delete"}
          </MDButton>
        </DialogActions>
      </Dialog>

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
