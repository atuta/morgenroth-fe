// File: src/layouts/dashboard/index.js
import React, { useEffect, useState } from "react";
// Import PropTypes for prop validation
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// Import Typography and Icon components
import Typography from "@mui/material/Typography";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
// Renamed/Custom component is imported
import ReportsStatCard from "./ReportsStatCard";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

import getAdminDashboardMetricsApi from "api/getAdminDashboardMetricsApi";

// --- REMOVED: IconDescriptionContent / BlankChartContent components ---
// We no longer need these components as ReportsStatCard now handles rendering the icon/text internally.
// --- END REMOVED SECTION ---

function Dashboard() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [metrics, setMetrics] = useState(null);

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const allowedMonths = Array.from({ length: 12 }, (_, i) => i + 1);
  const allowedYears = Array.from({ length: 10 }, (_, i) => currentYear - i).sort((a, b) => a - b);

  // Handle month/year change
  const handleMonthChange = (e) => setMonth(Number(e.target.value));
  const handleYearChange = (e) => setYear(Number(e.target.value));

  const fetchMetrics = async () => {
    try {
      const res = await getAdminDashboardMetricsApi({ month, year });
      if (res.status === 200) setMetrics(res.data);
    } catch (err) {
      console.error("Failed to fetch admin dashboard metrics:", err);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [month, year]);

  // Filter future months dynamically
  const filteredMonths = allowedMonths.map((m) => ({
    value: m,
    disabled: year === currentYear && m > currentMonth,
  }));

  const filteredYears = allowedYears.map((y) => ({
    value: y,
    disabled: y > currentYear,
  }));

  const attendance = metrics?.attendance_metrics || {};
  const payroll = metrics?.payroll_metrics || {};

  // --- Percentage Calculation Logic (Retained) ---
  const totalStaff = attendance?.all_users_count || 0;

  const calculatePercentage = (count) => {
    if (totalStaff === 0) return 0;
    return ((count / totalStaff) * 100).toFixed(1);
  };

  const presentPercentage = calculatePercentage(attendance?.present_count || 0);
  const absentPercentage = calculatePercentage(attendance?.absent_count || 0);
  const leavePercentage = calculatePercentage(attendance?.on_leave_count || 0);
  // --- End of Percentage Calculation Logic ---

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* --- Month / Year Selectors (Retained) --- */}
        <MDBox mb={3} display="flex" gap={2} flexWrap="wrap">
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={month}
              label="Month"
              onChange={handleMonthChange}
              sx={{ height: 50, display: "flex", alignItems: "center", fontSize: 16 }}
            >
              {filteredMonths.map((m) => (
                <MenuItem key={m.value} value={m.value} disabled={m.disabled}>
                  {m.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={year}
              label="Year"
              onChange={handleYearChange}
              sx={{ height: 50, display: "flex", alignItems: "center", fontSize: 16 }}
            >
              {filteredYears.map((y) => (
                <MenuItem key={y.value} value={y.value} disabled={y.disabled}>
                  {y.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </MDBox>

        {/* --- Statistics Cards (Retained) --- */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="group"
                title="Total Staff"
                count={totalStaff}
                percentage={{
                  color: "dark",
                  amount: "100%",
                  label: "Total Employee Base",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="check_circle"
                title="Staff Present"
                count={attendance?.present_count || 0}
                percentage={{
                  color: "success",
                  amount: `${presentPercentage}%`,
                  label: "present today",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="cancel"
                title="Staff Absent"
                count={attendance?.absent_count || 0}
                percentage={{
                  color: "error",
                  amount: `${absentPercentage}%`,
                  label: "absent today",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="flight_takeoff"
                title="Staff on Leave"
                count={attendance?.on_leave_count || 0}
                percentage={{
                  color: "info",
                  amount: `${leavePercentage}%`,
                  label: "on scheduled leave",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>

        {/* --- Payroll Summary Cards (Using new ReportsStatCard props) --- */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            {/* 1. Total Salary Card */}
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsStatCard
                  color="info"
                  title="Total Salary"
                  description="Monthly computed salary metrics."
                  date="Updated just now"
                  // NEW PROPS
                  icon="paid"
                  amount={`KES ${payroll?.total_salary?.toLocaleString() || "0.00"}`}
                  headerDescription="Gross amount before advance payment deductions."
                />
              </MDBox>
            </Grid>

            {/* 2. Advance Payment Card */}
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsStatCard
                  color="success"
                  title="Advance Payment"
                  description={
                    <>
                      (<strong>+15%</strong>) of the total salary computed.
                    </>
                  }
                  date="Updated just now"
                  // NEW PROPS
                  icon="receipt_long"
                  amount={`KES ${payroll?.total_advance?.toLocaleString() || "0.00"}`}
                  headerDescription="Total advance payments disbursed this month."
                />
              </MDBox>
            </Grid>

            {/* 3. Total Net Due Card */}
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsStatCard
                  color="dark"
                  title="Total Net Due"
                  description={
                    <>
                      (<strong>+85%</strong>) of the total salary computed.
                    </>
                  }
                  date="Updated just now"
                  // NEW PROPS
                  icon="payments"
                  amount={`KES ${payroll?.total_net_due?.toLocaleString() || "0.00"}`}
                  headerDescription="The final amount payable to employees."
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
