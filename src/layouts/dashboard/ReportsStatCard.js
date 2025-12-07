// File: src/examples/Cards/ReportsStatCard/index.js (Updated)

import { useMemo } from "react";

// porp-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

/**
 * A reusable card component based on the ReportsBarChart structure,
 * designed to display key statistics (icon, amount, description) instead of a chart.
 */
function ReportsStatCard({ color, title, description, date, icon, amount, headerDescription }) {
  return (
    <Card sx={{ height: "100%" }}>
      <MDBox padding="1rem">
        {/* This useMemo block contains the colored header area */}
        {useMemo(
          () => (
            <MDBox
              variant="gradient"
              bgColor={color}
              borderRadius="lg"
              coloredShadow={color}
              mt={-5}
              height="12.5rem" // Retaining the original chart height
              // --- Custom Content for Icon/Amount/Description ---
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              color="white"
              textAlign="center"
              p={2}
            >
              {/* 1. Icon */}
              <Icon sx={{ fontSize: "60px !important", mb: 1 }}>{icon}</Icon>

              {/* 2. Amount/Metric */}
              <MDTypography variant="h4" color="white" fontWeight="bold">
                {amount}
              </MDTypography>

              {/* 3. Header Description/Context */}
              <MDTypography variant="body2" color="white" opacity={0.8} mt={1} px={2}>
                {headerDescription}
              </MDTypography>
            </MDBox>
          ),
          [color, icon, amount, headerDescription]
        )}

        {/* Card Body (Title, Description, Footer) */}
        <MDBox pt={3} pb={1} px={1}>
          <MDTypography variant="h6" textTransform="capitalize">
            {title}
          </MDTypography>
          <MDTypography component="div" variant="button" color="text" fontWeight="light">
            {description}
          </MDTypography>
          <Divider />
          <MDBox display="flex" alignItems="center">
            <MDTypography variant="button" color="text" lineHeight={1} sx={{ mt: 0.15, mr: 0.5 }}>
              <Icon>schedule</Icon>
            </MDTypography>
            <MDTypography variant="button" color="text" fontWeight="light">
              {date}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props
ReportsStatCard.defaultProps = {
  color: "info",
  description: "",
  headerDescription: "",
};

// Typechecking props for the ReportsStatCard
ReportsStatCard.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  date: PropTypes.string.isRequired,
  // New props for the header content
  icon: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  headerDescription: PropTypes.string,
};

export default ReportsStatCard;
