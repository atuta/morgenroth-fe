// File: src/layouts/dashboard/index.js
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

import getAdminDashboardMetricsApi from "api/getAdminDashboardMetricsApi";

function Dashboard() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [metrics, setMetrics] = useState(null);

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const allowedMonths = Array.from({ length: 12 }, (_, i) => i + 1);
  const allowedYears = Array.from({ length: 10 }, (_, i) => currentYear - i).reverse();

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

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* --- Month / Year Selectors --- */}
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

        {/* --- Statistics Cards --- */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Total Staff"
                count={attendance?.all_users_count || 0}
                percentage={{
                  color: "success",
                  amount: "+0%",
                  label: "this month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="leaderboard"
                title="Staff Present"
                count={attendance?.present_count || 0}
                percentage={{
                  color: "success",
                  amount: "+0%",
                  label: "present today",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="store"
                title="Staff Absent"
                count={attendance?.absent_count || 0}
                percentage={{
                  color: "success",
                  amount: "+0%",
                  label: "today",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="info"
                icon="person_add"
                title="Staff on Leave"
                count={attendance?.on_leave_count || 0}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>

        {/* --- Charts --- */}
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title={`Total Salary - KES ${payroll?.total_salary?.toLocaleString() || "0.00"}`}
                  description="Total salary computed for the month"
                  date="computed 2 hours ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title={`Advance Payment - KES ${
                    payroll?.total_advance?.toLocaleString() || "0.00"
                  }`}
                  description={
                    <>
                      (<strong>+15%</strong>) of the total salary computed.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={reportsLineChartData.sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title={`Total Net Due - KES ${
                    payroll?.total_net_due?.toLocaleString() || "0.00"
                  }`}
                  description={
                    <>
                      (<strong>+85%</strong>) of the total salary computed.
                    </>
                  }
                  date="just updated"
                  chart={reportsLineChartData.tasks}
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
