import React from "react";
import PropTypes from "prop-types";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const CustomAlert = ({ message, severity, duration = 4000, open, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

// Add prop types for validation
CustomAlert.propTypes = {
  message: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(["error", "warning", "info", "success"]),
  duration: PropTypes.number,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CustomAlert;
