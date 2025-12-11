/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================
*/

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

function Breadcrumbs({ icon, title, route, light }) {
  const navigate = useNavigate();
  const routes = route.slice(0, -1);

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate("/profile-summary"); // << SPA navigation
  };

  return (
    <MDBox mr={{ xs: 0, xl: 8 }}>
      <MuiBreadcrumbs
        sx={{
          "& .MuiBreadcrumbs-separator": {
            color: ({ palette: { white, grey } }) => (light ? white.main : grey[600]),
          },
        }}
      >
        {/* HOME ICON — FIXED TO SPA NAVIGATE */}
        <MDTypography
          component="a"
          href="#"
          onClick={handleHomeClick}
          variant="body2"
          color={light ? "white" : "dark"}
          opacity={light ? 0.8 : 0.5}
          sx={{ lineHeight: 0, cursor: "pointer" }}
        >
          <Icon>{icon}</Icon>
        </MDTypography>

        {/* ROUTE SEGMENTS */}
        {routes.map((el) => (
          <Link to={`/${el}`} key={el}>
            <MDTypography
              component="span"
              variant="button"
              fontWeight="regular"
              textTransform="capitalize"
              color={light ? "white" : "dark"}
              opacity={light ? 0.8 : 0.5}
              sx={{ lineHeight: 0 }}
            >
              {el}
            </MDTypography>
          </Link>
        ))}

        {/* CURRENT PAGE TITLE */}
        <MDTypography
          variant="button"
          fontWeight="regular"
          textTransform="capitalize"
          color={light ? "white" : "dark"}
          sx={{ lineHeight: 0 }}
        >
          {title.replace("-", " ")}
        </MDTypography>
      </MuiBreadcrumbs>

      {/* PAGE HEADER TITLE */}
      <MDTypography
        fontWeight="bold"
        textTransform="capitalize"
        variant="h6"
        color={light ? "white" : "dark"}
        noWrap
      >
        {title.replace("-", " ")}
      </MDTypography>
    </MDBox>
  );
}

// Defaults
Breadcrumbs.defaultProps = {
  light: false,
};

// Prop types
Breadcrumbs.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  route: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  light: PropTypes.bool,
};

export default Breadcrumbs;
