import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React base styles
import typography from "assets/theme/base/typography";

function Footer({ company }) {
  const { size } = typography;

  return (
    <MDBox
      width="100%"
      display="flex"
      flexDirection={{ xs: "column", lg: "row" }}
      justifyContent="space-between"
      alignItems="center"
      px={1.5}
    >
      <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        color="text"
        fontSize={size.sm}
        px={1.5}
      >
        &copy; {new Date().getFullYear()} |
        <MDTypography variant="button" fontWeight="medium" color="dark">
          &nbsp;Morgenroth Schulhaus&nbsp;
        </MDTypography>
      </MDBox>

      <MDBox display="flex" alignItems="center" mt={{ xs: 2, lg: 0 }}>
        <Icon fontSize="small" sx={{ mr: 0.5 }}>
          location_on
        </Icon>
        <MDTypography variant="button" fontWeight="regular" color="text">
          Kidongo Park Gate Rd, Shimba Hills, Kwale
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

Footer.defaultProps = {
  company: { name: "Morgenroth Schulhaus" },
};

Footer.propTypes = {
  company: PropTypes.objectOf(PropTypes.string),
};

export default Footer;
