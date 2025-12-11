import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

// MUI
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";

// Core components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Breadcrumbs from "examples/Breadcrumbs";

// Styles
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Context
import { useMaterialUIController, setTransparentNavbar, setMiniSidenav } from "context";
import { useUserContext } from "context/UserContext";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, darkMode } = controller;
  const { user } = useUserContext();

  const location = useLocation();
  const navigate = useNavigate();

  const route = location.pathname.split("/").slice(1);

  useEffect(() => {
    setNavbarType(fixedNavbar ? "sticky" : "static");

    const handleTransparentNavbar = () => {
      const isTransparent = (fixedNavbar && window.scrollY === 0) || !fixedNavbar;
      setTransparentNavbar(dispatch, isTransparent);
    };

    window.addEventListener("scroll", handleTransparentNavbar);
    handleTransparentNavbar();

    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);

  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let value = light || darkMode ? white.main : dark.main;
      if (transparentNavbar && !light) value = darkMode ? rgba(text.main, 0.6) : text.main;
      return value;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Breadcrumbs
            icon="home"
            title={route[route.length - 1]}
            route={route}
            light={light}
            onHomeClick={() => navigate("/dashboard")} // << SPA HOME NAVIGATION
          />
        </MDBox>

        {!isMini && (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            {/* User Info */}
            <MDBox display="flex" alignItems="center" pr={2}>
              <MDTypography variant="button" fontWeight="medium" mr={1}>
                {user?.full_name}
              </MDTypography>
              <MDTypography variant="caption" color="text.secondary">
                {user?.user_role}
              </MDTypography>
            </MDBox>

            {/* Avatar button (SPA navigation) */}
            <IconButton
              sx={navbarIconButton}
              size="small"
              disableRipple
              onClick={() => navigate("/profile-summary")}
            >
              <Icon sx={iconsStyle}>account_circle</Icon>
            </IconButton>

            {/* Mobile Menu Toggle */}
            <IconButton
              size="small"
              disableRipple
              color="inherit"
              sx={navbarMobileMenu}
              onClick={handleMiniSidenav}
            >
              <Icon sx={iconsStyle} fontSize="medium">
                {miniSidenav ? "menu_open" : "menu"}
              </Icon>
            </IconButton>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
