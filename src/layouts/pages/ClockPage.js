import { useState, useRef, useEffect } from "react";
import Grid from "@mui/material/Grid";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
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

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  const showAlert = (message, severity = "info") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  // Fetch current session on page load
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await getCurrentSessionApi();
        if (res.status === 200) {
          setCurrentSession(res.data.session);
        }
      } catch (err) {
        console.error("Failed to fetch current session:", err);
      }
    };
    fetchSession();
  }, []);

  // Handle camera stream
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
        .catch(() => {
          showAlert("Camera access denied or unavailable", "error");
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
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
    setCameraActive(false);
  };

  const handleClockIn = async () => {
    if (!photoBase64) {
      showAlert("Please capture a photo first", "warning");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        timestamp: new Date().toISOString(),
        photo_base64: photoBase64,
      };

      const res = await clockInApi(payload);

      if (res.status === 200 || res.status === 201) {
        showAlert("Clock in recorded", "success");
        setPhotoBase64(null);
        // Refresh current session immediately
        const sessionRes = await getCurrentSessionApi();
        if (sessionRes.status === 200) setCurrentSession(sessionRes.data.session);
      } else if (res.status === 409) {
        showAlert("Already clocked in", "warning");
        const sessionRes = await getCurrentSessionApi();
        if (sessionRes.status === 200) setCurrentSession(sessionRes.data.session);
      } else if (res.status === 422) {
        showAlert("Invalid photo uploaded", "error");
      } else {
        showAlert("Clock in failed", "error");
      }
    } catch (err) {
      showAlert("Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!currentSession) return;
    setLoading(true);
    try {
      const payload = {
        timestamp: new Date().toISOString(),
      };
      const res = await clockOutApi(payload);

      if (res.status === 200) {
        showAlert("Clock out recorded", "success");
        setCurrentSession(null); // session ended, allow new clock-in
      } else if (res.status === 409) {
        showAlert("No active session to clock out", "warning");
        setCurrentSession(null);
      } else {
        showAlert("Clock out failed", "error");
      }
    } catch (err) {
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
          {!currentSession ? (
            <>
              {/* Camera & Clock-In Section */}
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
                        <MDButton
                          variant="outlined"
                          color="error"
                          onClick={() => setCameraActive(false)}
                        >
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
              </MDBox>

              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                disabled={loading || !photoBase64}
                onClick={handleClockIn}
              >
                {loading ? "Clocking in..." : "Clock In"}
              </MDButton>
            </>
          ) : (
            <>
              {/* Active Session / Clock-Out Section */}
              <MDBox p={3} mb={3} bgColor="white" borderRadius="lg" shadow="md">
                <MDTypography variant="h5" fontWeight="bold" mb={2}>
                  Active Session
                </MDTypography>
                <MDTypography variant="body1" mb={1}>
                  Clock In Time: {new Date(currentSession.clock_in_time).toLocaleString()}
                </MDTypography>
                {currentSession.clock_in_photo && (
                  <img
                    src={currentSession.clock_in_photo}
                    alt="Clock-in photo"
                    style={{ width: "100%", borderRadius: 8, marginTop: 8 }}
                  />
                )}
              </MDBox>

              <MDButton
                variant="gradient"
                color="error"
                fullWidth
                disabled={loading}
                onClick={handleClockOut}
              >
                {loading ? "Clocking out..." : "Clock Out"}
              </MDButton>
            </>
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

      {/* Hidden canvas for capturing photo */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </DashboardLayout>
  );
}

export default ClockPage;
