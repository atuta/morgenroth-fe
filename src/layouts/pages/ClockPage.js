// File: ClockPage.js

import { useState, useRef, useEffect } from "react";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import CustomAlert from "../../components/CustomAlert";

// Dialog Components for Interception
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

// NEW: option buttons for clock-out reason
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import clockInApi from "../../api/clockInApi";
import clockOutApi from "../../api/clockOutApi";
import getCurrentSessionApi from "../../api/getCurrentSessionApi";

// NEW: working hours check service
import { isWithinWorkingHoursApi } from "../../api/attendanceApi";

import { useUserContext } from "../../context/UserContext";

// --- Styled Components ---
const StyledVideo = styled("video")({
  width: "100%",
  maxHeight: "350px",
  objectFit: "cover",
  borderRadius: 8,
  backgroundColor: "black",
});

const StyledImage = styled("img")({
  width: "100%",
  maxHeight: "350px",
  objectFit: "cover",
  borderRadius: 8,
});

function ClockPage() {
  const { logout } = useUserContext();

  const [loading, setLoading] = useState(false);

  // Clock-in photo states
  const [photoBase64, setPhotoBase64] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Clock-out photo states
  const [clockOutPhotoBase64, setClockOutPhotoBase64] = useState(null);
  const [clockOutCameraActive, setClockOutCameraActive] = useState(false);

  // Working hours state: null | "yes" | "no"
  const [withinWorkingHours, setWithinWorkingHours] = useState(null);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const [currentSession, setCurrentSession] = useState(null);

  // NOTE: notes now stores API-friendly values: "end" | "break" | ""
  const [notes, setNotes] = useState("");

  const [sessionDuration, setSessionDuration] = useState("00:00:00");

  const [clockOutDisabledUntil, setClockOutDisabledUntil] = useState(null);

  // Dialog
  const [openTypeDialog, setOpenTypeDialog] = useState(false);

  // Refs for Clock-in camera
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Refs for Clock-out camera
  const clockOutVideoRef = useRef(null);
  const clockOutCanvasRef = useRef(null);

  const showAlert = (message, severity = "info") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  useEffect(() => {
    fetchCurrentSession();
    fetchWorkingHoursStatus();
  }, []);

  const fetchWorkingHoursStatus = async () => {
    try {
      const res = await isWithinWorkingHoursApi();
      if (res.ok && res.status === 200 && res.data?.status === "success") {
        setWithinWorkingHours(res.data.within_working_hours); // "yes" | "no"
      } else {
        setWithinWorkingHours(null);
      }
    } catch {
      setWithinWorkingHours(null);
    }
  };

  const fetchCurrentSession = async () => {
    try {
      setLoading(true);
      const res = await getCurrentSessionApi();
      if (res.status === 200 && res.data.status === "success") {
        setCurrentSession(res.data.session);
      } else {
        setCurrentSession(null);
      }
    } catch {
      setCurrentSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (currentSession) {
      const update = () => {
        const start = new Date(currentSession.clock_in_time);
        const now = new Date();
        const diff = now - start;
        const hrs = String(Math.floor(diff / 3600000)).padStart(2, "0");
        const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
        const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
        setSessionDuration(`${hrs}:${mins}:${secs}`);
      };
      update();
      timer = setInterval(update, 1000);
    } else {
      setSessionDuration("00:00:00");
    }
    return () => clearInterval(timer);
  }, [currentSession]);

  // -------------------------
  // CLOCK-IN camera handlers
  // -------------------------
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (cameraActive) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch(() => showAlert("Camera access denied or unavailable", "error"));
    } else {
      stopCamera();
    }
  }, [cameraActive]);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const context = canvasRef.current.getContext("2d");

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    const dataURL = canvasRef.current.toDataURL("image/jpeg", 0.8);

    setPhotoBase64(dataURL);
    stopCamera();
  };

  // -------------------------
  // CLOCK-OUT camera handlers
  // -------------------------
  const stopClockOutCamera = () => {
    if (clockOutVideoRef.current && clockOutVideoRef.current.srcObject) {
      clockOutVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      clockOutVideoRef.current.srcObject = null;
    }
    setClockOutCameraActive(false);
  };

  useEffect(() => {
    if (clockOutCameraActive) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" } })
        .then((stream) => {
          if (clockOutVideoRef.current) {
            clockOutVideoRef.current.srcObject = stream;
            clockOutVideoRef.current.play();
          }
        })
        .catch(() => showAlert("Camera access denied or unavailable", "error"));
    } else {
      stopClockOutCamera();
    }
  }, [clockOutCameraActive]);

  const handleClockOutCapture = () => {
    if (!clockOutVideoRef.current || !clockOutCanvasRef.current) return;
    const context = clockOutCanvasRef.current.getContext("2d");

    clockOutCanvasRef.current.width = clockOutVideoRef.current.videoWidth;
    clockOutCanvasRef.current.height = clockOutVideoRef.current.videoHeight;

    context.drawImage(
      clockOutVideoRef.current,
      0,
      0,
      clockOutCanvasRef.current.width,
      clockOutCanvasRef.current.height
    );

    const dataURL = clockOutCanvasRef.current.toDataURL("image/jpeg", 0.8);

    setClockOutPhotoBase64(dataURL);
    stopClockOutCamera();
  };

  // Intermediate function to trigger the Dialog
  const handleClockInInitiation = async () => {
    await fetchWorkingHoursStatus();
    setOpenTypeDialog(true);
  };

  // Modified Clock-In to enforce working-hours rule
  const handleClockIn = async (clockinType) => {
    setOpenTypeDialog(false);

    const canDecide = withinWorkingHours === "yes" || withinWorkingHours === "no";

    if (canDecide) {
      if (withinWorkingHours === "no" && clockinType === "regular") {
        showAlert(
          "You are currently outside your working hours. Regular Shift clock-in is not allowed now. Please use Overtime Session instead.",
          "warning"
        );
        return;
      }
      if (withinWorkingHours === "yes" && clockinType === "overtime") {
        showAlert(
          "You are currently within your working hours. Please use Regular Shift for clock-in.",
          "info"
        );
        return;
      }
    } else {
      showAlert(
        "We could not verify your working hours at the moment. Please proceed with the correct shift type.",
        "info"
      );
    }

    setLoading(true);
    try {
      const payload = {
        timestamp: new Date().toISOString(),
        photo_base64: photoBase64,
        clockin_type: clockinType,
      };
      const res = await clockInApi(payload);

      if ((res.status === 200 || res.status === 201) && res.data.status === "success") {
        showAlert(`✅ ${clockinType} clock-in recorded successfully!`, "success");
        setPhotoBase64(null);
        fetchCurrentSession();

        const now = new Date();
        setClockOutDisabledUntil(new Date(now.getTime() + 10 * 60 * 1000));

        setTimeout(() => {
          logout();
        }, 10000);
      } else if (res.data.message === "active_session_exists") {
        showAlert("⚠️ Already clocked in. Fetching current session...", "warning");
        fetchCurrentSession();
      } else if (res.data.message === "invalid_photo_data") {
        showAlert("❌ Invalid photo uploaded. Please retake the photo.", "error");
      } else {
        showAlert("❌ Clock-in failed. Please try again.", "error");
      }
    } catch {
      showAlert("❌ Server error. Could not connect to the API.", "error");
    } finally {
      setLoading(false);
    }
  };

  // NEW: handle selection for clock-out reason
  const handleClockOutReasonChange = (event, value) => {
    // value can be null if user deselects; keep it as "" in that case
    setNotes(value || "");
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      if (!clockOutPhotoBase64) {
        showAlert("📷 A photo is required to clock out. Please capture one.", "warning");
        setLoading(false);
        return;
      }

      // Optional: enforce picking one option (recommended)
      if (!notes) {
        showAlert("Please select a clock-out reason: End of day or Break.", "warning");
        setLoading(false);
        return;
      }

      const payload = {
        timestamp: new Date().toISOString(),
        notes, // "end" | "break"
        photo_base64: clockOutPhotoBase64,
      };

      const res = await clockOutApi(payload);

      if ((res.status === 200 || res.status === 201) && res.data.status === "success") {
        showAlert("👋 Clock-out successful! Good work.", "success");
        setNotes("");
        setCurrentSession(null);
        setClockOutPhotoBase64(null);
        stopClockOutCamera();
      } else if (res.data.message === "no_active_session") {
        showAlert("⚠️ No active session found to clock out from.", "warning");
      } else if (res.data.message === "invalid_photo_data") {
        showAlert("❌ Invalid photo uploaded. Please retake the photo.", "error");
      } else {
        showAlert("❌ Clock-out failed. Please try again.", "error");
      }
    } catch {
      showAlert("❌ Server error. Could not connect to the API.", "error");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading && !currentSession) {
      return (
        <MDBox display="flex" flexDirection="column" alignItems="center" py={5}>
          <CircularProgress color="info" />
          <MDTypography variant="body2" color="text" mt={2}>
            Loading session status...
          </MDTypography>
        </MDBox>
      );
    }

    const isClockOutDisabled =
      loading || (clockOutDisabledUntil && new Date() < clockOutDisabledUntil);

    const isClockOutBlockedByPhoto = !clockOutPhotoBase64;

    return (
      <MDBox p={3} bgColor="white" borderRadius="lg" width="100%">
        {currentSession ? (
          <MDBox>
            <MDTypography variant="h5" fontWeight="bold" color="success" mb={1}>
              Session Active ({currentSession.clockin_type || "Regular"})
            </MDTypography>
            <MDTypography variant="h1" fontWeight="light" color="text" mb={2}>
              {sessionDuration}
            </MDTypography>
            <MDTypography variant="body2" color="text" mb={2}>
              Clocked in at: {new Date(currentSession.clock_in_time).toLocaleTimeString()}
            </MDTypography>

            {/* CLOCK-OUT PHOTO CAPTURE */}
            <MDBox mb={3}>
              {!clockOutPhotoBase64 && !clockOutCameraActive && (
                <>
                  <MDButton
                    variant="gradient"
                    color="info"
                    fullWidth
                    onClick={() => setClockOutCameraActive(true)}
                    disabled={loading}
                  >
                    Start Camera for Clock-Out Photo
                  </MDButton>
                  <MDTypography variant="body2" color="text" textAlign="center" mt={1}>
                    A photo is required for clock-out.
                  </MDTypography>
                </>
              )}

              {clockOutCameraActive && (
                <MDBox display="flex" flexDirection="column" alignItems="center" gap={1}>
                  <StyledVideo ref={clockOutVideoRef} autoPlay playsInline />
                  <MDButton
                    variant="gradient"
                    color="success"
                    fullWidth
                    onClick={handleClockOutCapture}
                    sx={{ mt: 1 }}
                  >
                    Capture Clock-Out Photo
                  </MDButton>
                  <MDButton variant="text" color="error" onClick={stopClockOutCamera}>
                    Cancel Camera
                  </MDButton>
                </MDBox>
              )}

              {clockOutPhotoBase64 && (
                <MDBox display="flex" flexDirection="column" alignItems="center" gap={1}>
                  <MDTypography variant="caption" color="text">
                    Clock-out photo captured successfully:
                  </MDTypography>
                  <StyledImage src={clockOutPhotoBase64} alt="clockout-preview" />
                  <MDButton
                    variant="gradient"
                    color="warning"
                    fullWidth
                    onClick={() => {
                      setClockOutPhotoBase64(null);
                      setClockOutCameraActive(true);
                    }}
                    sx={{ mt: 1 }}
                    disabled={loading}
                  >
                    Retake Clock-Out Photo
                  </MDButton>
                </MDBox>
              )}
            </MDBox>

            {/* CLOCK-OUT REASON OPTIONS (REPLACES TEXTAREA) */}
            <MDBox mb={2}>
              <MDTypography variant="body2" color="text" mb={1}>
                Clock-out Reason
              </MDTypography>

              <ToggleButtonGroup
                value={notes}
                exclusive
                onChange={handleClockOutReasonChange}
                fullWidth
                sx={{
                  width: "100%",
                  "& .MuiToggleButton-root": {
                    flex: 1,
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                  },
                }}
                disabled={loading}
              >
                <ToggleButton value="end">End of day</ToggleButton>
                <ToggleButton value="break">Break</ToggleButton>
              </ToggleButtonGroup>

              {!notes && (
                <MDTypography variant="caption" color="text" display="block" mt={1}>
                  Please specify the clock-out reason.
                </MDTypography>
              )}
            </MDBox>

            <MDButton
              variant="gradient"
              color="error"
              fullWidth
              disabled={isClockOutDisabled || isClockOutBlockedByPhoto}
              onClick={handleClockOut}
            >
              {loading ? <CircularProgress color="inherit" size={20} /> : "Clock Out"}
            </MDButton>

            {isClockOutBlockedByPhoto && (
              <MDTypography variant="caption" color="error" mt={1} display="block">
                Clock-out photo is required.
              </MDTypography>
            )}
          </MDBox>
        ) : (
          <MDBox>
            <MDTypography variant="h5" fontWeight="bold" mb={3}>
              Clock In Now
            </MDTypography>

            <MDBox mb={2}>
              <MDTypography variant="body2" color="text" textAlign="center">
                Regular Shift clock-in is allowed only during working hours. Outside working hours,
                please use Overtime Session.
              </MDTypography>
            </MDBox>

            <MDBox mb={3}>
              <Grid container spacing={2} justifyContent="center" alignItems="center">
                <Grid item xs={12}>
                  {!photoBase64 && !cameraActive && (
                    <>
                      <MDButton
                        variant="gradient"
                        color="info"
                        fullWidth
                        onClick={() => setCameraActive(true)}
                      >
                        Start Camera for Photo
                      </MDButton>
                      <MDTypography variant="body2" color="text" textAlign="center" mt={1}>
                        A photo is required for clock-in.
                      </MDTypography>
                    </>
                  )}

                  {cameraActive && (
                    <MDBox display="flex" flexDirection="column" alignItems="center" gap={1}>
                      <StyledVideo ref={videoRef} autoPlay playsInline />
                      <MDButton
                        variant="gradient"
                        color="success"
                        fullWidth
                        onClick={handleCapture}
                        sx={{ mt: 1 }}
                      >
                        Capture Photo
                      </MDButton>
                      <MDButton variant="text" color="error" onClick={stopCamera}>
                        Cancel Camera
                      </MDButton>
                    </MDBox>
                  )}

                  {photoBase64 && (
                    <MDBox display="flex" flexDirection="column" alignItems="center" gap={1}>
                      <MDTypography variant="caption" color="text">
                        Photo captured successfully:
                      </MDTypography>
                      <StyledImage src={photoBase64} alt="preview" />
                      <MDButton
                        variant="gradient"
                        color="warning"
                        fullWidth
                        onClick={() => {
                          setPhotoBase64(null);
                          setCameraActive(true);
                        }}
                        sx={{ mt: 1 }}
                      >
                        Retake Photo
                      </MDButton>
                    </MDBox>
                  )}
                </Grid>
              </Grid>
            </MDBox>

            <MDButton
              variant="gradient"
              color="success"
              fullWidth
              disabled={loading || !photoBase64}
              onClick={handleClockInInitiation}
              sx={{ mt: 1 }}
            >
              {loading ? <CircularProgress color="inherit" size={20} /> : "Clock In"}
            </MDButton>
          </MDBox>
        )}
      </MDBox>
    );
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox width="100%" sx={{ maxWidth: "600px" }}>
          {renderContent()}
        </MDBox>
      </MDBox>

      {/* Interception Dialog for Clock-In Type */}
      <Dialog
        open={openTypeDialog}
        onClose={() => setOpenTypeDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "lg" } }}
      >
        <DialogTitle>
          <MDTypography variant="h6" fontWeight="bold">
            Confirm Shift Type
          </MDTypography>
        </DialogTitle>

        <DialogContent>
          <MDTypography variant="body2" color="text">
            Please select the type of session you are clocking in for.
          </MDTypography>

          {withinWorkingHours === "yes" && (
            <MDTypography variant="caption" color="success" display="block" mt={1}>
              You are within working hours. Regular Shift is allowed.
            </MDTypography>
          )}
          {withinWorkingHours === "no" && (
            <MDTypography variant="caption" color="error" display="block" mt={1}>
              You are outside working hours. Only Overtime Session is allowed.
            </MDTypography>
          )}
          {withinWorkingHours === null && (
            <MDTypography variant="caption" color="text" display="block" mt={1}>
              Working hours status could not be verified right now.
            </MDTypography>
          )}
        </DialogContent>

        <DialogActions sx={{ flexDirection: "column", p: 3, gap: 2 }}>
          <MDButton
            variant="gradient"
            color="info"
            fullWidth
            onClick={() => handleClockIn("regular")}
            disabled={withinWorkingHours === "no"}
          >
            Regular Shift
          </MDButton>

          <MDButton
            variant="outlined"
            color="dark"
            fullWidth
            onClick={() => handleClockIn("overtime")}
            disabled={withinWorkingHours === "yes"}
          >
            Overtime Session
          </MDButton>

          <MDButton
            variant="text"
            color="secondary"
            fullWidth
            onClick={() => setOpenTypeDialog(false)}
          >
            Cancel
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

      {/* Hidden canvases */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <canvas ref={clockOutCanvasRef} style={{ display: "none" }} />
    </DashboardLayout>
  );
}

export default ClockPage;
