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

function ClockInPage() {
  const [loading, setLoading] = useState(false);
  const [photoBase64, setPhotoBase64] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  const showAlert = (message, severity = "info") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
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
        .catch((err) => {
          showAlert("Camera access denied or unavailable", "error");
        });
    } else {
      // Stop camera when not active
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
    setCameraActive(false); // Stop camera after capture
  };

  const handleClockIn = async () => {
    setLoading(true);
    try {
      const payload = {
        timestamp: new Date().toISOString(),
        photo_base64: photoBase64,
      };

      const res = await clockInApi(payload);

      if (res.ok && res.status === 201) {
        showAlert("Clock in recorded", "success");
        setPhotoBase64(null);
      } else if (res.status === 409) {
        showAlert("Already clocked in", "warning");
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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <MDBox sx={{ maxWidth: "600px", margin: "0 auto 0 0" }}>
          {/* Camera Card */}
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
                  <img src={photoBase64} alt="preview" style={{ width: "100%", borderRadius: 8 }} />
                )}
              </Grid>
            </Grid>
          </MDBox>

          {/* Clock-In Button */}
          <MDButton
            variant="gradient"
            color="info"
            fullWidth
            disabled={loading || !photoBase64}
            onClick={handleClockIn}
          >
            {loading ? "Clocking in..." : "Clock In"}
          </MDButton>
        </MDBox>
      </MDBox>

      <CustomAlert
        message={alertMessage}
        severity={alertSeverity}
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
      />

      <Footer />

      {/* Hidden canvas to capture photo */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </DashboardLayout>
  );
}

export default ClockInPage;
