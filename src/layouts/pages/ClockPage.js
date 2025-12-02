import { useState, useRef, useEffect } from "react";
import Grid from "@mui/material/Grid";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import TextField from "@mui/material/TextField";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import CustomAlert from "../../components/CustomAlert";

import clockInApi from "../../api/clockInApi";
import clockOutApi from "../../api/clockOutApi";
import getCurrentSessionApi from "../../api/getCurrentSessionApi";

function ClockPage() {
  const [loading, setLoading] = useState(false);
  const [photoBase64, setPhotoBase64] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const [currentSession, setCurrentSession] = useState(null);
  const [notes, setNotes] = useState("");
  const [sessionDuration, setSessionDuration] = useState("00:00:00");

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
      const res = await getCurrentSessionApi();
      if (res.status === 200 && res.data.status === "success") {
        setCurrentSession(res.data.session);
      } else {
        setCurrentSession(null);
      }
    } catch {
      setCurrentSession(null);
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
        .getUserMedia({ video: { facingMode: "environment" } })
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
    context.drawImage(videoRef.current, 0, 0);
    const dataURL = canvasRef.current.toDataURL("image/png");
    setPhotoBase64(dataURL);
    stopCamera();
  };

  const handleClockIn = async () => {
    setLoading(true);
    try {
      const payload = { timestamp: new Date().toISOString(), photo_base64: photoBase64 };
      const res = await clockInApi(payload);

      if ((res.status === 200 || res.status === 201) && res.data.status === "success") {
        showAlert("Clock-in recorded", "success");
        setPhotoBase64(null);
        fetchCurrentSession();
      } else if (res.data.message === "active_session_exists") {
        showAlert("Already clocked in", "warning");
        fetchCurrentSession();
      } else if (res.data.message === "invalid_photo_data") {
        showAlert("Invalid photo uploaded", "error");
      } else {
        showAlert("Clock-in failed", "error");
      }
    } catch {
      showAlert("Server error", "error");
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
        showAlert("Clock-out recorded", "success");
        setNotes("");
        setCurrentSession(null);
      } else if (res.data.message === "no_active_session") {
        showAlert("No active session found", "warning");
      } else {
        showAlert("Clock-out failed", "error");
      }
    } catch {
      showAlert("Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox sx={{ maxWidth: "600px", margin: "0 auto 0 0" }}>
          {currentSession ? (
            <MDBox p={3} mb={3} bgColor="white" borderRadius="lg" shadow="md">
              <MDTypography variant="h5" fontWeight="bold" mb={2}>
                Current Session
              </MDTypography>
              <MDTypography>
                Clocked in at: {new Date(currentSession.clock_in_time).toLocaleTimeString()}
              </MDTypography>
              <MDTypography>Duration: {sessionDuration}</MDTypography>
              <MDTypography>Notes (optional):</MDTypography>
              <MDBox mt={1}>
                <TextField
                  label="Notes"
                  multiline
                  rows={3}
                  fullWidth
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </MDBox>
              <MDButton
                variant="gradient"
                color="error"
                fullWidth
                disabled={loading}
                onClick={handleClockOut}
                sx={{ mt: 2 }}
              >
                {loading ? "Clocking out..." : "Clock Out"}
              </MDButton>
            </MDBox>
          ) : (
            <MDBox p={3} mb={3} bgColor="white" borderRadius="lg" shadow="md">
              <MDTypography variant="h5" fontWeight="bold" mb={2}>
                Clock In
              </MDTypography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  {!photoBase64 && !cameraActive && (
                    <MDButton
                      variant="gradient"
                      color="info"
                      fullWidth
                      onClick={() => setCameraActive(true)}
                    >
                      Open Camera
                    </MDButton>
                  )}
                  {cameraActive && (
                    <MDBox display="flex" flexDirection="column" alignItems="center" gap={1}>
                      <video
                        ref={videoRef}
                        style={{ width: "100%", borderRadius: 8 }}
                        autoPlay
                        playsInline
                      />
                      <MDButton variant="gradient" color="success" onClick={handleCapture}>
                        Capture Photo
                      </MDButton>
                      <MDButton variant="outlined" color="error" onClick={stopCamera}>
                        Cancel
                      </MDButton>
                    </MDBox>
                  )}
                  {photoBase64 && (
                    <img
                      src={photoBase64}
                      alt="preview"
                      style={{ width: "100%", borderRadius: 8 }}
                    />
                  )}
                </Grid>
              </Grid>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                disabled={loading || !photoBase64}
                onClick={handleClockIn}
                sx={{ mt: 2 }}
              >
                {loading ? "Clocking in..." : "Clock In"}
              </MDButton>
            </MDBox>
          )}
        </MDBox>
      </MDBox>

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
