// File: EditableFields.js
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";

// Icons
import EmailIcon from "@mui/icons-material/EmailOutlined";
import PhoneIcon from "@mui/icons-material/PhoneOutlined";
import FingerprintIcon from "@mui/icons-material/FingerprintOutlined";
import EventAvailableIcon from "@mui/icons-material/EventAvailableOutlined";
import PaidIcon from "@mui/icons-material/PaidOutlined";
import PermIdentityIcon from "@mui/icons-material/PermIdentityOutlined";
import BadgeIcon from "@mui/icons-material/BadgeOutlined";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import updateUserFieldsApi from "../../api/updateUserFieldsApi";

const ROLE_CHOICES = [
  { value: "super", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "office", label: "Office" },
  { value: "teaching", label: "Teaching" },
  { value: "subordinate", label: "Subordinate" },
];

function EditableFields({ userData, user_id, showAlert, onUpdateSuccess }) {
  const [saving, setSaving] = useState(false);

  // Existing state
  const [editRate, setEditRate] = useState("");
  const [editNssf, setEditNssf] = useState("");
  const [editSha, setEditSha] = useState("");
  const [editLunchStart, setEditLunchStart] = useState("");
  const [editLunchEnd, setEditLunchEnd] = useState("");

  // New state
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editIdNumber, setEditIdNumber] = useState("");
  const [editRole, setEditRole] = useState("");

  useEffect(() => {
    if (userData) {
      setEditRate(userData.hourly_rate !== null ? String(userData.hourly_rate) : "");
      setEditNssf(userData.nssf_number || "");
      setEditSha(userData.shif_sha_number || "");
      setEditLunchStart(userData.lunch_start ? String(userData.lunch_start) : "");
      setEditLunchEnd(userData.lunch_end ? String(userData.lunch_end) : "");

      // Initialize new fields
      setEditEmail(userData.email || "");
      setEditPhone(userData.phone_number || "");
      setEditIdNumber(userData.id_number || "");
      setEditRole(userData.user_role || "");
    }
  }, [userData]);

  const handleSave = async () => {
    if (!user_id) return;

    if (
      (editLunchStart !== "" || editLunchEnd !== "") &&
      (editLunchStart === "" || editLunchEnd === "")
    ) {
      showAlert("Both lunch start and end times must be provided", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        user_id,
        email: editEmail,
        phone_number: editPhone,
        id_number: editIdNumber,
        user_role: editRole,
        nssf: editNssf,
        sha: editSha,
        hourly_rate: editRate,
        lunch_start: editLunchStart !== "" ? Number(editLunchStart) : null,
        lunch_end: editLunchEnd !== "" ? Number(editLunchEnd) : null,
      };

      const res = await updateUserFieldsApi(payload);

      if (res.status === "success") {
        showAlert("User details updated successfully!", "success");
        onUpdateSuccess({
          email: editEmail,
          phone_number: editPhone,
          id_number: editIdNumber,
          user_role: editRole,
          hourly_rate: editRate,
          nssf_number: editNssf,
          shif_sha_number: editSha,
          lunch_start: editLunchStart !== "" ? Number(editLunchStart) : userData.lunch_start,
          lunch_end: editLunchEnd !== "" ? Number(editLunchEnd) : userData.lunch_end,
        });
      } else {
        showAlert(res.message || "Failed to update user details", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error while updating user details", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: "lg", mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MDTypography variant="h6" fontWeight="bold" mb={2}>
            Edit Staff Profile & Statutory Details
          </MDTypography>

          <Grid container spacing={2}>
            {/* Email Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email Address"
                fullWidth
                margin="normal"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <EmailIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>

            {/* Phone Number Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                fullWidth
                margin="normal"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <PhoneIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>

            {/* ID Number Field */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="ID Number"
                fullWidth
                margin="normal"
                value={editIdNumber}
                onChange={(e) => setEditIdNumber(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <FingerprintIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>

            {/* User Role Select */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="User Role"
                fullWidth
                margin="normal"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                // Increase vertical padding and ensure alignment
                SelectProps={{
                  sx: {
                    paddingTop: "8px",
                    paddingBottom: "8px",
                    "& .MuiSelect-select": {
                      display: "flex",
                      alignItems: "center",
                      minHeight: "2.0em", // Standard MUI height
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <BadgeIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              >
                {ROLE_CHOICES.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Hourly Rate */}
            <Grid item xs={12}>
              <TextField
                label="Hourly Rate (KES)"
                fullWidth
                margin="normal"
                type="number"
                value={editRate}
                onChange={(e) => setEditRate(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <EventAvailableIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>

            {/* Lunch Policy */}
            <Grid item xs={6}>
              <TextField
                label="Lunch Start (24hr)"
                fullWidth
                margin="normal"
                type="number"
                value={editLunchStart}
                onChange={(e) => setEditLunchStart(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Lunch End (24hr)"
                fullWidth
                margin="normal"
                type="number"
                value={editLunchEnd}
                onChange={(e) => setEditLunchEnd(e.target.value)}
              />
            </Grid>

            {/* Statutory Numbers */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="NSSF Number"
                fullWidth
                margin="normal"
                value={editNssf}
                onChange={(e) => setEditNssf(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <PaidIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="SHA Number"
                fullWidth
                margin="normal"
                value={editSha}
                onChange={(e) => setEditSha(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <PermIdentityIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>
          </Grid>

          <MDBox mt={3} display="flex" justifyContent="flex-start">
            <MDButton
              variant="gradient"
              color="success"
              onClick={handleSave}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {saving ? "Saving..." : "Save Changes"}
            </MDButton>
          </MDBox>
        </Grid>
      </Grid>
    </Paper>
  );
}

EditableFields.propTypes = {
  userData: PropTypes.object.isRequired,
  user_id: PropTypes.string.isRequired,
  showAlert: PropTypes.func.isRequired,
  onUpdateSuccess: PropTypes.func.isRequired,
};

export default EditableFields;
