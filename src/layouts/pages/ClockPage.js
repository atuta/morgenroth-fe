// File: ClockPage.js

import { useState, useRef, useEffect } from "react";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import TextField from "@mui/material/TextField";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import CustomAlert from "../../components/CustomAlert";

// Dialog Components for Interception
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import clockInApi from "../../api/clockInApi";
import clockOutApi from "../../api/clockOutApi";
import getCurrentSessionApi from "../../api/getCurrentSessionApi";

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
  const [photoBase64, setPhotoBase64] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const [currentSession, setCurrentSession] = useState(null);
  const [notes, setNotes] = useState("");
  const [sessionDuration, setSessionDuration] = useState("00:00:00");

  const [clockOutDisabledUntil, setClockOutDisabledUntil] = useState(null);

  // New State for Interception Dialogue
  const [openTypeDialog, setOpenTypeDialog] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  const showAlert = (message, severity = "info") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  useEffect(() => {
    fetchCurrentSession();
  }, []);

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

  // Intermediate function to trigger the Dialog
  const handleClockInInitiation = () => {
    setOpenTypeDialog(true);
  };

  // Modified Clock-In to accept the choice from the Dialog
  const handleClockIn = async (clockinType) => {
    setOpenTypeDialog(false); // Close dialog
    setLoading(true);
    try {
      const payload = {
        timestamp: new Date().toISOString(),
        photo_base64: photoBase64,
        clockin_type: clockinType, // Added new field
      };
      const res = await clockInApi(payload);

      if ((res.status === 200 || res.status === 201) && res.data.status === "success") {
        showAlert(`✅ ${clockinType} clock-in recorded successfully!`, "success");
        setPhotoBase64(null);
        fetchCurrentSession();

        // Disable Clock Out for 10 minutes
        const now = new Date();
        setClockOutDisabledUntil(new Date(now.getTime() + 10 * 60 * 1000));

        // Timed logout after 10 seconds
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

  const handleClockOut = async () => {
    setLoading(true);
    try {
      const payload = { timestamp: new Date().toISOString(), notes };
      const res = await clockOutApi(payload);

      if ((res.status === 200 || res.status === 201) && res.data.status === "success") {
        showAlert("👋 Clock-out successful! Good work.", "success");
        setNotes("");
        setCurrentSession(null);
      } else if (res.data.message === "no_active_session") {
        showAlert("⚠️ No active session found to clock out from.", "warning");
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
            <TextField
              label="Clock-out Notes (optional)"
              multiline
              rows={3}
              fullWidth
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              InputLabelProps={{ shrink: true, required: false }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "white",
                },
              }}
            />
            <MDButton
              variant="gradient"
              color="error"
              fullWidth
              disabled={isClockOutDisabled}
              onClick={handleClockOut}
            >
              {loading ? <CircularProgress color="inherit" size={20} /> : "Clock Out"}
            </MDButton>
          </MDBox>
        ) : (
          <MDBox>
            <MDTypography variant="h5" fontWeight="bold" mb={3}>
              Clock In Now
            </MDTypography>

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
              onClick={handleClockInInitiation} // Now triggers Dialog instead of direct API
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
        </DialogContent>
        <DialogActions sx={{ flexDirection: "column", p: 3, gap: 2 }}>
          <MDButton
            variant="gradient"
            color="info"
            fullWidth
            onClick={() => handleClockIn("regular")}
          >
            Regular Shift
          </MDButton>
          <MDButton
            variant="outlined"
            color="dark"
            fullWidth
            onClick={() => handleClockIn("overtime")}
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
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </DashboardLayout>
  );
}

export default ClockPage;
