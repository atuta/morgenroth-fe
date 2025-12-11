// File: src/examples/Sidenav/index.js
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Collapse from "@mui/material/Collapse";
import Icon from "@mui/material/Icon"; // For close icon
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import SidenavCollapseItem from "examples/Sidenav/SidenavCollapseItem";
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "context";
import toast from "react-hot-toast";
import { useUserContext } from "context/UserContext";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode } = controller;
  const [openCollapse, setOpenCollapse] = useState("");
  const { user, loading, logout } = useUserContext();

  // Determine text color
  let textColor = "white";
  if (transparentSidenav || (whiteSidenav && !darkMode)) textColor = "dark";
  else if (whiteSidenav && darkMode) textColor = "inherit";

  // Handle responsive sidenav
  useEffect(() => {
    const handleMiniSidenav = () => {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(dispatch, window.innerWidth < 1200 ? false : transparentSidenav);
      setWhiteSidenav(dispatch, window.innerWidth < 1200 ? false : whiteSidenav);
    };
    window.addEventListener("resize", handleMiniSidenav);
    handleMiniSidenav();
    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, transparentSidenav, whiteSidenav]);

  // Show nothing until user is loaded
  if (loading || !user) return null;

  // Recursive filter: only include routes allowed for current user
  const filterRoutes = (routesArray) =>
    routesArray
      .map((route) => {
        if (!user) return null;

        if (route.collapse) {
          const filteredChildren = filterRoutes(route.collapse);
          if (filteredChildren.length === 0) return null;
          return { ...route, collapse: filteredChildren };
        }

        if (route.userRoles && !route.userRoles.includes(user.user_role)) return null;

        return route;
      })
      .filter(Boolean);

  const filteredRoutes = filterRoutes(routes);

  // Recursive render
  // Recursive render with console logs
  const renderRoutes = (routesArray) =>
    routesArray.map((route) => {
      const { type, name, icon, key, collapse, route: path, href, noCollapse } = route;

      if (type === "collapse") {
        // Sign-out menu item
        if (key === "sign-out") {
          return (
            <MDBox
              key={key}
              onClick={() => {
                console.log(`Clicked menu: ${name}`);
                logout();
                navigate("/authentication/sign-ins");
                toast.success("Logged out successfully", { duration: 2000 });
              }}
              sx={{ cursor: "pointer" }}
            >
              <SidenavCollapse name={name} icon={icon} />
            </MDBox>
          );
        }

        // Parent collapse with children
        if (collapse) {
          const handleCollapse = () => setOpenCollapse((prev) => (prev === key ? "" : key));
          return (
            <MDBox key={key}>
              <SidenavCollapse
                name={name}
                icon={icon}
                collapse
                onClick={handleCollapse}
                open={openCollapse === key}
              />
              <Collapse in={openCollapse === key} timeout="auto" unmountOnExit>
                {collapse.map((child) => (
                  <MDBox
                    key={child.key}
                    onClick={() => console.log(`Clicked submenu: ${child.name}`)}
                    sx={{ cursor: "pointer" }}
                  >
                    <SidenavCollapse name={child.name} icon={child.icon} />
                  </MDBox>
                ))}
              </Collapse>
            </MDBox>
          );
        }

        // Leaf menu item
        return href ? (
          <Link
            href={href}
            key={key}
            target="_blank"
            rel="noreferrer"
            sx={{ textDecoration: "none" }}
            onClick={() => console.log(`Clicked menu: ${name}`)}
          >
            <SidenavCollapse name={name} icon={icon} noCollapse={noCollapse} />
          </Link>
        ) : (
          <NavLink key={key} to={path} onClick={() => console.log(`Clicked menu: ${name}`)}>
            <SidenavCollapse name={name} icon={icon} noCollapse={noCollapse} />
          </NavLink>
        );
      }

      if (type === "title") {
        return (
          <MDTypography
            key={key}
            color={textColor}
            display="block"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {route.title}
          </MDTypography>
        );
      }

      if (type === "divider") return <Divider key={key} light />;

      return null;
    });

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        {/* Mobile Close Button */}
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={() => setMiniSidenav(dispatch, true)}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>

        <MDBox component={NavLink} to="/" display="flex" alignItems="center">
          {brand && <MDBox component="img" src={brand} alt="Brand" width="2rem" />}
          <MDBox
            width={!brandName && "100%"}
            sx={(theme) => sidenavLogoLabel(theme, { miniSidenav })}
          >
            <MDTypography component="h6" variant="button" fontWeight="medium" color={textColor}>
              {brandName}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>

      <Divider light />

      <List>{renderRoutes(filteredRoutes)}</List>

      <MDBox p={2} mt="auto">
        <MDButton
          component="a"
          href="https://morgenroth-schulhaus.org/"
          target="_blank"
          rel="noreferrer"
          variant="gradient"
          color={color}
          fullWidth
        >
          Main Website
        </MDButton>
      </MDBox>
    </SidenavRoot>
  );
}

Sidenav.defaultProps = { color: "info", brand: "" };
Sidenav.propTypes = {
  color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark"]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
