/**
=========================================================
* Material Dashboard 2 React - Multi-Level Menu Component
=========================================================

* Purpose: Handles the recursive rendering of nested routes (sub-menus)
* and implements exclusive collapse (accordion behavior) for sibling items at the same level.
*/

import { useState } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// react-router-dom components
import { useLocation, NavLink } from "react-router-dom";

// @mui material components
import List from "@mui/material/List";
import Link from "@mui/material/Link";
import Collapse from "@mui/material/Collapse";
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";

// This component handles a list of routes and manages their collapse state
function SidenavCollapseItem({ routes }) {
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");
  // Local state for this specific list of routes (ensures exclusive collapse among siblings)
  const [openCollapse, setOpenCollapse] = useState("");

  // Recursive rendering function
  const renderRoutes = (allRoutes) =>
    allRoutes.map(({ type, name, icon, noCollapse, key, href, route, collapse }) => {
      let returnValue;

      if (type === "collapse") {
        // Logic for multi-level (parent) collapse
        if (collapse) {
          // --- Exclusive Collapse Logic (Applies to this level) ---
          const handleCollapse = () => {
            // If the key is already open, close it, otherwise open it and close others.
            setOpenCollapse((prevKey) => (prevKey === key ? "" : key));
          };
          // ---------------------------------------------------------

          // Find if any nested route is active to keep the parent open
          const isParentActive = collapse.some(({ key: nestedKey }) => nestedKey === collapseName);

          returnValue = (
            <MDBox key={key}>
              <SidenavCollapse
                name={name}
                icon={icon}
                active={isParentActive} // Active if a child route is active
                noCollapse={noCollapse}
                onClick={handleCollapse} // Toggle collapse state
                collapse={true}
                open={openCollapse === key}
              />
              <Collapse in={openCollapse === key} timeout="auto" unmountOnExit>
                {/* Recursive call for nested routes. The child SidenavCollapseItem 
                  will manage the exclusive state for the next level */}
                <List sx={{ pl: 4 }}>
                  <SidenavCollapseItem routes={collapse} />
                </List>
              </Collapse>
            </MDBox>
          );
        }
        // Logic for leaf (single-level or final) collapse
        else {
          returnValue = href ? (
            <Link
              href={href}
              key={key}
              target="_blank"
              rel="noreferrer"
              sx={{ textDecoration: "none" }}
            >
              <SidenavCollapse
                name={name}
                icon={icon}
                active={key === collapseName}
                noCollapse={noCollapse}
              />
            </Link>
          ) : (
            <NavLink key={key} to={route}>
              <SidenavCollapse name={name} icon={icon} active={key === collapseName} />
            </NavLink>
          );
        }
      }

      return returnValue;
    });

  // We wrap the rendered routes in a List. Note: MDBox padding from Sidenav/index.js is gone here.
  return <>{renderRoutes(routes)}</>;
}

// Typechecking props for the SidenavCollapseItem
SidenavCollapseItem.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default SidenavCollapseItem;
