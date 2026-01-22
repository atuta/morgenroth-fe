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
import PersonIcon from "@mui/icons-material/PersonOutline";

// Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import updateUserFieldsApi from "../../api/updateUserFieldsApi";

const ROLE_CHOICES = [
  { value: "office", label: "Office" },
  { value: "teaching", label: "Teaching" },
  { value: "subordinate", label: "Subordinate" },
];

function EditableFields({ userData, user_id, showAlert, onUpdateSuccess }) {
  const [saving, setSaving] = useState(false);

  // Identity
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editIdNumber, setEditIdNumber] = useState("");
  const [editRole, setEditRole] = useState("");

  // Payroll & statutory
  const [editRate, setEditRate] = useState("");
  const [editNssf, setEditNssf] = useState("");
  const [editNssfAmount, setEditNssfAmount] = useState("");
  const [editSha, setEditSha] = useState("");
  const [editKraPin, setEditKraPin] = useState(""); // ✅ NEW

  // Lunch Hour States
  const [editLunchStart, setEditLunchStart] = useState("");
  const [editLunchEnd, setEditLunchEnd] = useState("");

  // Validation States for Lunch Hours
  const [lunchStartError, setLunchStartError] = useState("");
  const [lunchEndError, setLunchEndError] = useState("");

  useEffect(() => {
    if (!userData) return;

    setEditFirstName(userData.first_name || "");
    setEditLastName(userData.last_name || "");
    setEditEmail(userData.email || "");
    setEditPhone(userData.phone_number || "");
    setEditIdNumber(userData.id_number || "");
    setEditRole(userData.user_role || "");

    setEditRate(userData.hourly_rate ?? "");
    setEditNssf(userData.nssf_number || "");
    setEditNssfAmount(userData.nssf_amount ?? "");
    setEditSha(userData.shif_sha_number || "");
    setEditKraPin(userData.kra_pin || ""); // ✅ NEW

    setEditLunchStart(userData.lunch_start ? String(userData.lunch_start) : "");
    setEditLunchEnd(userData.lunch_end ? String(userData.lunch_end) : "");
  }, [userData]);

  const handleNumericChange = (e, setter, setError) => {
    const value = e.target.value;
    const numericRegex = /^[0-9]*\.?[0-9]*$/;

    if (!numericRegex.test(value)) {
      setError("Numbers only");
      return;
    }

    setError("");
    setter(value);
  };

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
        first_name: editFirstName,
        last_name: editLastName,
        email: editEmail,
        phone_number: editPhone,
        id_number: editIdNumber,
        user_role: editRole,

        nssf: editNssf,
        nssf_amount: editNssfAmount,
        sha: editSha,
        kra_pin: editKraPin, // ✅ NEW

        hourly_rate: editRate,

        lunch_start: editLunchStart !== "" ? Number(editLunchStart) : null,
        lunch_end: editLunchEnd !== "" ? Number(editLunchEnd) : null,
      };

      const res = await updateUserFieldsApi(payload);

      if (res.status === "success") {
        showAlert("User details updated successfully!", "success");

        onUpdateSuccess({
          ...payload,
          nssf_number: editNssf,
          shif_sha_number: editSha,
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
            {/* First Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                fullWidth
                margin="normal"
                value={editFirstName}
                onChange={(e) => setEditFirstName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <PersonIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>

            {/* Last Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                fullWidth
                margin="normal"
                value={editLastName}
                onChange={(e) => setEditLastName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <PersonIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>

            {/* Email */}
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

            {/* Phone */}
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

            {/* ID Number */}
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

            {/* User Role */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="User Role"
                fullWidth
                margin="normal"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                sx={{ "& .MuiInputBase-root": { minHeight: "43px" } }}
                InputProps={{
                  startAdornment: (
                    <BadgeIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              >
                {ROLE_CHOICES.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Hourly Rate */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Hourly Rate (KES)"
                fullWidth
                margin="normal"
                type="number"
                value={editRate}
                onChange={(e) => setEditRate(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <PaidIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>

            {/* NSSF Amount */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="NSSF Amount (KES)"
                fullWidth
                margin="normal"
                type="number"
                value={editNssfAmount}
                onChange={(e) => setEditNssfAmount(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <EventAvailableIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>

            {/* Statutory Info */}
            <Grid item xs={12} sm={4}>
              <TextField
                label="NSSF Number"
                fullWidth
                margin="normal"
                value={editNssf}
                onChange={(e) => setEditNssf(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <FingerprintIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
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

            <Grid item xs={12} sm={4}>
              <TextField
                label="KRA PIN"
                fullWidth
                margin="normal"
                value={editKraPin}
                onChange={(e) => setEditKraPin(e.target.value.toUpperCase())}
                InputProps={{
                  startAdornment: (
                    <PaidIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                  ),
                }}
              />
            </Grid>

            {/* Lunch Times */}
            <Grid item xs={6}>
              <TextField
                label="Lunch Start (24hr)"
                fullWidth
                margin="normal"
                value={editLunchStart}
                onChange={(e) => handleNumericChange(e, setEditLunchStart, setLunchStartError)}
                error={!!lunchStartError}
                helperText={lunchStartError}
                inputProps={{ inputMode: "decimal" }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Lunch End (24hr)"
                fullWidth
                margin="normal"
                value={editLunchEnd}
                onChange={(e) => handleNumericChange(e, setEditLunchEnd, setLunchEndError)}
                error={!!lunchEndError}
                helperText={lunchEndError}
                inputProps={{ inputMode: "decimal" }}
              />
            </Grid>
          </Grid>

          <MDBox mt={3} display="flex" justifyContent="flex-start">
            <MDButton
              variant="gradient"
              color="success"
              onClick={handleSave}
              disabled={saving || !!lunchStartError || !!lunchEndError}
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
