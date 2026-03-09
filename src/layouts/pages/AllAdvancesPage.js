// File: AllAdvancesPage.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Pagination from "@mui/material/Pagination";

import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import CustomAlert from "../../components/CustomAlert";

import { getAllAdvancesAdminApi } from "../../api/overtimeAndAdvanceApi";
import { getAdvanceByIdApi, updateAdvanceApi } from "../../api/advanceApi";

const COLUMN_COUNT = 6;

const formatNaturalDate = (day, month, year) => {
  if (!day || !month || !year) return "-";
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const toISODate = (day, month, year) => {
  if (!day || !month || !year) return "";
  return `${String(year)}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

function AllAdvancesPage() {
  const navigate = useNavigate();
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i).reverse();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [advances, setAdvances] = useState([]);
  const [filteredAdvances, setFilteredAdvances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");

  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editSaving, setEditSaving] = useState(false);

  const [selectedAdvanceId, setSelectedAdvanceId] = useState("");
  const [editRemarks, setEditRemarks] = useState("");
  const [editDate, setEditDate] = useState("");

  const [editRemarksError, setEditRemarksError] = useState("");
  const [editDateError, setEditDateError] = useState("");

  const showAlert = (message, severity = "info") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  const resetEditState = () => {
    setSelectedAdvanceId("");
    setEditRemarks("");
    setEditDate("");
    setEditRemarksError("");
    setEditDateError("");
  };

  const closeEditModal = () => {
    setEditOpen(false);
    resetEditState();
  };

  const buildParams = (p = 1) => {
    const firstDate = `${year}-${String(month).padStart(2, "0")}-01`;

    const lastDay = new Date(year, month, 0).getDate();
    const lastDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(
      2,
      "0"
    )}`;

    return {
      start_date: firstDate,
      end_date: lastDate,
      page: p,
      per_page: pageSize,
    };
  };

  const resetListState = () => {
    setAdvances([]);
    setFilteredAdvances([]);
    setPage(1);
    setTotalPages(1);
    setTotalRecords(0);
  };

  const fetchAdvances = async (p = 1) => {
    setLoading(true);

    try {
      const res = await getAllAdvancesAdminApi(buildParams(p));
      console.log("Axios Response:", res);

      if (res.ok && res.data?.status === "success") {
        const payload = res.data?.message || {};
        const results = Array.isArray(payload.results) ? payload.results : [];

        setAdvances(results);
        setFilteredAdvances(results);
        setPage(payload.current_page || p);
        setTotalPages(payload.total_pages || 1);
        setTotalRecords(payload.total_records || 0);
      } else {
        showAlert(res.data?.message || "Failed to fetch advances.", "error");
        resetListState();
      }
    } catch (err) {
      console.error(err);
      showAlert("Unable to load advance records. Please try again.", "error");
      resetListState();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchAdvances(1);
  }, [month, year]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredAdvances(advances);
      return;
    }

    const term = searchTerm.toLowerCase();
    const result = advances.filter(
      (a) =>
        (a.user_full_name || "").toLowerCase().includes(term) ||
        (a.user_email || "").toLowerCase().includes(term) ||
        (a.remarks || "").toLowerCase().includes(term) ||
        formatNaturalDate(a.day, a.month, a.year).toLowerCase().includes(term)
    );

    setFilteredAdvances(result);
  }, [searchTerm, advances]);

  const handlePageChange = (event, value) => {
    fetchAdvances(value);
  };

  const handleOpenEdit = async (advanceId) => {
    setEditOpen(true);
    setEditLoading(true);
    setSelectedAdvanceId(advanceId);
    setEditRemarks("");
    setEditDate("");
    setEditRemarksError("");
    setEditDateError("");

    try {
      const res = await getAdvanceByIdApi({ advance_id: advanceId });

      if (res.ok && res.data?.status === "success" && res.data?.message) {
        const record = res.data.message;
        setEditRemarks(record.remarks || "");
        setEditDate(toISODate(record.day, record.month, record.year));
      } else {
        showAlert(res.data?.message || "Failed to load advance details.", "error");
        closeEditModal();
      }
    } catch (err) {
      console.error(err);
      showAlert("Unable to load advance details. Please try again.", "error");
      closeEditModal();
    } finally {
      setEditLoading(false);
    }
  };

  const validateEditForm = () => {
    let valid = true;

    if (!editRemarks.trim()) {
      setEditRemarksError("Remarks are required");
      valid = false;
    } else {
      setEditRemarksError("");
    }

    if (!editDate) {
      setEditDateError("Date is required");
      valid = false;
    } else {
      setEditDateError("");
    }

    return valid;
  };

  const handleSaveEdit = async () => {
    if (!selectedAdvanceId) return;
    if (!validateEditForm()) return;

    setEditSaving(true);

    try {
      const [yearStr, monthStr, dayStr] = editDate.split("-");

      const payload = {
        advance_id: selectedAdvanceId,
        remarks: editRemarks.trim(),
        day: Number(dayStr),
        month: Number(monthStr),
        year: Number(yearStr),
      };

      const res = await updateAdvanceApi(payload);

      if (res.ok && res.data?.status === "success") {
        showAlert("Advance record updated successfully.", "success");
        closeEditModal();
        fetchAdvances(page);
      } else {
        showAlert(res.data?.message || "Failed to update advance.", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Unable to update advance. Please try again.", "error");
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox py={3}>
        <MDBox p={3} mb={3} bgColor="white" borderRadius="lg">
          <MDTypography variant="h5" fontWeight="bold" mb={2}>
            All Advances
          </MDTypography>

          <Grid container spacing={2} mb={2}>
            <Grid item xs={6} md={2}>
              <TextField
                select
                label="Month"
                fullWidth
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                sx={{ "& .MuiInputBase-root": { minHeight: 48 } }}
              >
                {months.map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={6} md={2}>
              <TextField
                select
                label="Year"
                fullWidth
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                sx={{ "& .MuiInputBase-root": { minHeight: 48 } }}
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={7}>
              <TextField
                label="Search by employee, email, remarks, or date"
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
                  sx: { backgroundColor: "white", borderRadius: 2, minHeight: 48 },
                }}
              />
            </Grid>

            <Grid item xs={12} md={1}>
              <MDButton
                variant="gradient"
                color="info"
                onClick={() => fetchAdvances(page)}
                disabled={loading}
                fullWidth
                sx={{
                  minHeight: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <RefreshIcon sx={{ fontSize: 24, color: "white" }} />
                )}
              </MDButton>
            </Grid>
          </Grid>

          <TableContainer component={Paper} sx={{ maxHeight: 600, boxShadow: "none" }}>
            <Table stickyHeader aria-label="all advances table">
              <TableBody>
                <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                  <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Approved By</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Amount (KES)</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Remarks</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                </TableRow>

                {loading ? (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} align="center">
                      <CircularProgress size={24} />
                      <MDTypography mt={1} variant="body2">
                        Loading advances...
                      </MDTypography>
                    </TableCell>
                  </TableRow>
                ) : filteredAdvances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} align="center">
                      <MDTypography variant="body2">
                        No advance records found for {month}/{year}.
                      </MDTypography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAdvances.map((advance) => (
                    <TableRow
                      key={advance.advance_id}
                      sx={{ "&:hover": { backgroundColor: "#f9f9f9" } }}
                    >
                      <TableCell>
                        {formatNaturalDate(advance.day, advance.month, advance.year)}
                      </TableCell>
                      <TableCell>{advance.user_full_name || "N/A"}</TableCell>
                      <TableCell>{advance.approved_by || "-"}</TableCell>
                      <TableCell>
                        <MDTypography variant="body2" fontWeight="bold" color="info">
                          KES {advance.amount ?? 0}
                        </MDTypography>
                      </TableCell>
                      <TableCell>{advance.remarks || "-"}</TableCell>
                      <TableCell>
                        <MDBox display="flex" gap={1} flexWrap="wrap">
                          <IconButton
                            color="default"
                            onClick={() => handleOpenEdit(advance.advance_id)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            color="info"
                            onClick={() =>
                              navigate("/admin-user-advance-payments", {
                                state: {
                                  user_id: advance.user_id,
                                  user_full_name: advance.user_full_name,
                                },
                              })
                            }
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </MDBox>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <MDBox display="flex" flexDirection="column" alignItems="center" mt={2}>
            <Pagination count={totalPages} page={page} onChange={handlePageChange} color="info" />
            <MDTypography variant="caption" display="block" mt={1} textAlign="center">
              Total Records: {totalRecords}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>

      <Dialog open={editOpen} onClose={closeEditModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pr: 6 }}>
          Edit Advance
          <IconButton onClick={closeEditModal} sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {editLoading ? (
            <MDBox display="flex" justifyContent="center" alignItems="center" py={4}>
              <CircularProgress size={28} />
            </MDBox>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Remarks"
                  fullWidth
                  multiline
                  rows={4}
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  error={Boolean(editRemarksError)}
                  helperText={editRemarksError}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  type="date"
                  label="Advance Date"
                  fullWidth
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  error={Boolean(editDateError)}
                  helperText={editDateError}
                  InputLabelProps={{ shrink: true }}
                  sx={{ "& .MuiInputBase-root": { minHeight: 48 } }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <MDButton variant="outlined" color="secondary" onClick={closeEditModal}>
            Cancel
          </MDButton>

          <MDButton
            variant="gradient"
            color="info"
            onClick={handleSaveEdit}
            disabled={editLoading || editSaving}
          >
            {editSaving ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
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
    </DashboardLayout>
  );
}

export default AllAdvancesPage;
