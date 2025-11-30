// Sidenav.js
import { useState } from "react";
import { NavLink } from "react-router-dom";

// @mui material components
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Custom components
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";

// Routes
import routes from "routes";

function Sidenav() {
  const [controller] = useMaterialUIController();
  const { miniSidenav, transparentSidenav, whiteSidenav, darkMode, sidenavColor } = controller;

  const [openCollapse, setOpenCollapse] = useState({});

  const handleToggle = (key) => {
    setOpenCollapse((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderRoutes = (routesArray, level = 0) =>
    routesArray.map(({ type, name, icon, route, key, collapse }) => {
      if (type === "collapse" && collapse) {
        return (
          <MDBox key={key}>
            <SidenavCollapse
              icon={icon || <Icon fontSize="small">folder</Icon>}
              name={name}
              onClick={() => handleToggle(key)}
              active={!!openCollapse[key]}
              sx={{ pl: level * 2 }}
            />
            <Collapse in={!!openCollapse[key]} timeout="auto" unmountOnExit>
              {renderRoutes(collapse, level + 1)}
            </Collapse>
          </MDBox>
        );
      }

      if (type === "collapse" && route) {
        return (
          <NavLink to={route} key={key} style={{ textDecoration: "none" }}>
            <SidenavCollapse
              icon={icon || <Icon fontSize="small">chevron_right</Icon>}
              name={name}
              sx={{ pl: level * 2 }}
            />
          </NavLink>
        );
      }

      return null;
    });

  return (
    <SidenavRoot
      variant="permanent"
      ownerState={{
        miniSidenav,
        transparentSidenav,
        whiteSidenav,
        darkMode,
        sidenavColor,
      }}
    >
      <List>{renderRoutes(routes)}</List>
    </SidenavRoot>
  );
}

export default Sidenav;
