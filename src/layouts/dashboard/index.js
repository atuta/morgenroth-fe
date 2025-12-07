// File: src/layouts/dashboard/index.js
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data (you can keep your charts data here)
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// API
import getAdminDashboardMetricsApi from "../../api/getAdminDashboardMetricsApi";

function Dashboard() {
  const [metrics, setMetrics] = useState({
    attendance_metrics: {
      all_users_count: 0,
      present_count: 0,
      absent_count: 0,
      on_leave_count: 0,
    },
    payroll_metrics: {
      total_salary: 0,
      total_advance: 0,
      total_net_due: 0,
    },
    loading: true,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await getAdminDashboardMetricsApi();
        if (res.status === 200 && res.data.status === "success") {
          setMetrics({ ...res.data, loading: false });
        }
      } catch (e) {
        console.error("Failed to fetch dashboard metrics", e);
      }
    };

    fetchMetrics();
  }, []);

  const { attendance_metrics, payroll_metrics } = metrics;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        {/* --- Statistics Cards --- */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Total Staff"
                count={attendance_metrics.all_users_count}
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
                count={attendance_metrics.present_count}
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
                count={attendance_metrics.absent_count}
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
                count={attendance_metrics.on_leave_count}
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
                  title={`Total Salary - KES ${payroll_metrics.total_salary.toFixed(2)}`}
                  description="Total salary computed for the month"
                  date="computed recently"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title={`Advance Payment - KES ${payroll_metrics.total_advance.toFixed(2)}`}
                  description={
                    <>
                      (
                      <strong>
                        {(
                          (payroll_metrics.total_advance / payroll_metrics.total_salary) *
                          100
                        ).toFixed(1)}
                        %
                      </strong>
                      ) of the total salary computed.
                    </>
                  }
                  date="updated recently"
                  chart={reportsLineChartData.sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title={`Total Net Due - KES ${payroll_metrics.total_net_due.toFixed(2)}`}
                  description={
                    <>
                      (
                      <strong>
                        {(
                          (payroll_metrics.total_net_due / payroll_metrics.total_salary) *
                          100
                        ).toFixed(1)}
                        %
                      </strong>
                      ) of the total salary computed.
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
