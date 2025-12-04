// File: CroppingModal.js

import { useState, useEffect, useRef } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import PropTypes from "prop-types"; // ⬅️ ADDED: Import PropTypes

// --- Import Custom Components ---
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox"; // ⬅️ ADDED: Import MDBox (the fix for the critical error)
// --------------------------------

// --- REQUIRED react-image-crop IMPORTS ---
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
// ------------------------------------------

// --- MUI Modal Styling ---
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 600 },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: "90vh",
  overflowY: "auto",
};

/**
 * Creates a cropped image file from a selected area in the image using a Canvas API.
 * @param {HTMLImageElement} image - The image element reference.
 * @param {object} crop - The crop state object from react-image-crop (in pixels).
 * @param {string} fileName - The name for the resulting file.
 * @returns {Promise<File>} A promise that resolves with the cropped image File object.
 */
const getCroppedImage = (image, crop, fileName) => {
  const canvas = document.createElement("canvas");

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty or image processing failed."));
          return;
        }
        const file = new File([blob], fileName, { type: "image/jpeg" });
        resolve(file);
      },
      "image/jpeg",
      0.8
    );
  });
};

function CroppingModal({ open, onClose, file, onCropConfirm }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const imgRef = useRef(null);

  const [crop, setCrop] = useState();
  const ASPECT_RATIO = 1;

  // Load the selected file into a data URL for display in the cropper
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setImageSrc(reader.result.toString() || ""));
      reader.readAsDataURL(file);
    }
  }, [file]);

  // Handler for when the image element loads (used to set initial crop area)
  function onImageLoad(e) {
    if (imgRef.current) {
      const { width, height } = e.currentTarget;

      const newCrop = makeAspectCrop(
        {
          unit: "px",
          width: Math.min(width, height) * 0.9,
          height: Math.min(width, height) * 0.9,
        },
        ASPECT_RATIO,
        width,
        height
      );
      const centeredCrop = centerCrop(newCrop, width, height);
      setCrop(centeredCrop);
    }
  }

  // Handler for the "Crop & Upload" button
  const handleFinalCrop = async () => {
    if (!imgRef.current || !crop || !file || crop.width === 0 || crop.height === 0) return;

    setLoading(true);

    try {
      // Fix: Ensure file.name is accessed safely if file is null (though useEffect prevents this)
      const fileName = file ? `cropped_${file.name}` : "cropped_image.jpeg";
      const croppedFile = await getCroppedImage(imgRef.current, crop, fileName);
      onCropConfirm(croppedFile);
    } catch (error) {
      console.error("Error creating cropped image file:", error);
      alert("Failed to crop image. Check console for details.");
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="cropping-modal-title"
      aria-describedby="cropping-modal-description"
    >
      <Box sx={style}>
        <MDTypography variant="h6" id="cropping-modal-title" mb={2}>
          Crop Profile Photo (1:1 Aspect)
        </MDTypography>

        {imageSrc ? (
          <MDBox sx={{ maxWidth: "100%", maxHeight: "450px", overflow: "hidden" }}>
            {/* ReactCrop Component */}
            <ReactCrop
              crop={crop}
              onChange={(_pixelCrop, percentCrop) => setCrop(_pixelCrop)}
              onComplete={(c) => setCrop(c)}
              aspect={ASPECT_RATIO}
              circularCrop={true}
            >
              <img
                ref={imgRef}
                alt="Image to crop"
                src={imageSrc}
                onLoad={onImageLoad}
                style={{ maxWidth: "100%", maxHeight: "450px", display: "block" }}
              />
            </ReactCrop>
          </MDBox>
        ) : (
          <MDBox display="flex" justifyContent="center" py={5}>
            <CircularProgress />
          </MDBox>
        )}

        <MDBox display="flex" justifyContent="flex-end" gap={2} mt={3}>
          <MDButton variant="outlined" color="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </MDButton>
          <MDButton
            variant="gradient"
            color="success"
            onClick={handleFinalCrop}
            disabled={loading || !crop || crop.width === 0 || crop.height === 0}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Processing..." : "Crop & Upload"}
          </MDButton>
        </MDBox>
      </Box>
    </Modal>
  );
}

// ⬅️ ADDED: Prop-Types definition to satisfy ESLint warnings
CroppingModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  file: PropTypes.oneOfType([
    PropTypes.instanceOf(File),
    PropTypes.object, // To allow null initially, or File object
  ]),
  onCropConfirm: PropTypes.func.isRequired,
};

export default CroppingModal;
