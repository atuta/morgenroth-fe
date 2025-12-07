// File: TodayAttendancePage.js

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
import SearchIcon from "@mui/icons-material/Search";
// Import components for the magnification feature (Modal/Dialog)
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import CustomAlert from "../../components/CustomAlert";
import Configs from "../../configs/Configs";

import getTodayUserTimeSummaryApi from "../../api/getTodayUserTimeSummaryApi";

const DEFAULT_AVATAR = "https://www.gravatar.com/avatar/?d=mp&s=40";
const COLUMN_COUNT = 8;

const formatTime = (isoString) => {
  if (!isoString || isoString === "open") return isoString || "-";
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("default", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(date);
};

const calculateLiveHours = (clockIn) => {
  if (!clockIn) return "-";
  const start = new Date(clockIn);
  const now = new Date();
  const diffMs = now - start;
  if (diffMs < 0) return "0:00:00";
  const hours = Math.floor(diffMs / 3600000);
  const minutes = Math.floor((diffMs % 3600000) / 60000);
  const seconds = Math.floor((diffMs % 60000) / 1000);
  return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

function TodayAttendancePage() {
  const navigate = useNavigate();

  const [attendanceList, setAttendanceList] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [tick, setTick] = useState(0);

  // State for the image magnification modal
  const [openImageModal, setOpenImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

  const showAlert = (message, severity = "info") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  // Handler for opening the image modal
  const handleImageClick = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setOpenImageModal(true);
  };

  // Handler for closing the image modal
  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setModalImageUrl("");
  };

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const res = await getTodayUserTimeSummaryApi();
        let attendanceData = [];
        if (res.data?.message && Array.isArray(res.data.message)) {
          attendanceData = res.data.message;
        }

        const normalizedData = attendanceData.map((item) => ({
          user_id: item.user_id || "",
          full_name: item.full_name || "-",
          user_role: item.user_role || "-",
          earliest_clock_in: item.earliest_clock_in || null,
          latest_clock_out: item.latest_clock_out || null,
          total_hours: item.total_hours_worked != null ? item.total_hours_worked : null,
          photo: item.user_photo_url || DEFAULT_AVATAR,
          status: item.latest_session_status || "open",
          clock_in_photo: item.latest_clock_in_photo_url || null,
        }));

        setAttendanceList(normalizedData);
        setFilteredAttendance(normalizedData);
      } catch (err) {
        console.error(err);
        showAlert("Server error. Could not fetch attendance.", "error");
        setAttendanceList([]);
        setFilteredAttendance([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const needsTick = attendanceList.some((item) => item.status === "open");
      if (needsTick) {
        setTick((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [attendanceList]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredAttendance(attendanceList);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = attendanceList.filter((item) => {
      return (
        (item.full_name || "").toLowerCase().includes(term) ||
        (item.user_role || "").toLowerCase().includes(term) ||
        (item.status || "").toLowerCase().includes(term)
      );
    });
    setFilteredAttendance(filtered);
  }, [searchTerm, attendanceList]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox p={3} mb={3} width="100%" bgColor="white" borderRadius="lg">
          <MDTypography variant="h5" fontWeight="bold" mb={2}>
            Today&apos;s Attendance
          </MDTypography>

          {/* Search Field */}
          <MDBox mb={2}>
            <TextField
              label="Search by name, role, or status"
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

          {/* Attendance Table */}
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 600, border: "1px solid #ddd", boxShadow: "none" }}
          >
            <Table stickyHeader aria-label="attendance table">
              <TableBody>
                <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                  <TableCell sx={{ fontWeight: "bold", width: "8%", padding: "12px 8px" }}>
                    Photo
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Names</TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "10%", textAlign: "center" }}>
                    Clock-In Photo
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "10%", textAlign: "center" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "13%", textAlign: "center" }}>
                    Clock In
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "13%", textAlign: "center" }}>
                    Clock Out
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "13%", textAlign: "center" }}>
                    Total Hours
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", width: "13%", textAlign: "center" }}>
                    Actions
                  </TableCell>
                </TableRow>

                {loading ? (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} align="center" sx={{ py: 3 }}>
                      <CircularProgress size={24} />
                      <MDTypography variant="body2" color="text" mt={1}>
                        Loading attendance data...
                      </MDTypography>
                    </TableCell>
                  </TableRow>
                ) : filteredAttendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} align="center" sx={{ py: 3 }}>
                      <MDTypography variant="body2" color="text">
                        No attendance records found.
                      </MDTypography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAttendance.map((item) => {
                    const isOpen = item.status === "open";
                    const clockInPhotoUrl = item.clock_in_photo
                      ? `${Configs.baseUrl}${item.clock_in_photo}`
                      : null;

                    return (
                      <TableRow key={item.user_id}>
                        <TableCell sx={{ padding: "8px 8px", width: "8%" }}>
                          <Avatar
                            src={item.photo ? `${Configs.baseUrl}${item.photo}` : DEFAULT_AVATAR}
                            alt={item.full_name}
                            sx={{ width: 36, height: 36 }}
                          />
                        </TableCell>
                        <TableCell>
                          <MDBox display="flex" flexDirection="column" alignItems="flex-start">
                            <MDTypography component="span" variant="body2">
                              {item.full_name}
                            </MDTypography>
                            {item.user_role && item.user_role !== "-" && (
                              <MDTypography component="span" variant="caption" color="text">
                                ({item.user_role})
                              </MDTypography>
                            )}
                          </MDBox>
                        </TableCell>

                        {/* --- Clock-In Photo with Rounded Square and Click Feature --- */}
                        <TableCell align="center" sx={{ width: "10%" }}>
                          {clockInPhotoUrl ? (
                            <MDBox
                              component="img"
                              src={clockInPhotoUrl}
                              alt={`${item.full_name} clock in`}
                              onClick={() => handleImageClick(clockInPhotoUrl)}
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: "50%",
                                objectFit: "cover",
                                cursor: "pointer", // Indicate clickability
                                transition: "transform 0.2s",
                                "&:hover": { transform: "scale(1.05)" },
                              }}
                            />
                          ) : (
                            <MDTypography variant="caption" color="text">
                              N/A
                            </MDTypography>
                          )}
                        </TableCell>
                        {/* ----------------------------------------- */}

                        <TableCell align="center" sx={{ width: "10%" }}>
                          <MDTypography
                            variant="body2"
                            color={isOpen ? "success" : "text"}
                            fontWeight="bold"
                          >
                            {item.status}
                          </MDTypography>
                        </TableCell>
                        <TableCell align="center" sx={{ width: "13%" }}>
                          {item.earliest_clock_in ? formatTime(item.earliest_clock_in) : "-"}
                        </TableCell>
                        <TableCell align="center" sx={{ width: "13%" }}>
                          {item.latest_clock_out
                            ? item.latest_clock_out === "open"
                              ? "open"
                              : formatTime(item.latest_clock_out)
                            : "-"}
                        </TableCell>
                        <TableCell align="center" sx={{ width: "13%" }}>
                          {isOpen
                            ? calculateLiveHours(item.earliest_clock_in)
                            : item.total_hours != null
                            ? Number(item.total_hours).toFixed(2)
                            : "-"}
                        </TableCell>
                        <TableCell align="center" sx={{ width: "13%" }}>
                          <MDButton
                            variant="gradient"
                            color="info"
                            size="small"
                            sx={{ minWidth: 100 }}
                            onClick={() =>
                              navigate("/admin-user-attendance-details", {
                                state: { user_id: item.user_id, full_name: item.full_name },
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

      {/* --- Image Magnification Dialog/Modal --- */}
      <Dialog open={openImageModal} onClose={handleCloseImageModal} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 1, position: "relative" }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseImageModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
              zIndex: 10,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          {modalImageUrl && (
            <img
              src={modalImageUrl}
              alt="Magnified Clock-In"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: "4px",
              }}
            />
          )}
        </DialogContent>
      </Dialog>
      {/* --------------------------------------- */}

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

export default TodayAttendancePage;
