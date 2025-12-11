import { useState } from "react";
import { useLocation, NavLink } from "react-router-dom";
import List from "@mui/material/List";
import Collapse from "@mui/material/Collapse";
import Link from "@mui/material/Link";
import MDBox from "components/MDBox";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import PropTypes from "prop-types";

function SidenavCollapseItem({ routes, onItemClick }) {
  const location = useLocation();
  const collapseName = location.pathname.replace("/", "");
  const [openCollapse, setOpenCollapse] = useState("");

  const renderRoutes = (allRoutes) =>
    allRoutes.map(({ type, name, icon, noCollapse, key, href, route, collapse }) => {
      let returnValue;

      if (type === "collapse") {
        if (collapse) {
          const handleCollapse = () => setOpenCollapse((prev) => (prev === key ? "" : key));
          const isParentActive = collapse.some(({ key: nestedKey }) => nestedKey === collapseName);

          returnValue = (
            <MDBox key={key}>
              <SidenavCollapse
                name={name}
                icon={icon}
                active={isParentActive}
                noCollapse={noCollapse}
                onClick={handleCollapse}
                collapse
                open={openCollapse === key}
              />
              <Collapse in={openCollapse === key} timeout="auto" unmountOnExit>
                <List sx={{ pl: 4 }}>
                  <SidenavCollapseItem
                    routes={collapse}
                    onItemClick={onItemClick} // Pass the close callback down
                  />
                </List>
              </Collapse>
            </MDBox>
          );
        } else {
          returnValue = href ? (
            <Link
              href={href}
              key={key}
              target="_blank"
              rel="noreferrer"
              sx={{ textDecoration: "none" }}
              onClick={onItemClick} // Close sidebar on leaf click
            >
              <SidenavCollapse
                name={name}
                icon={icon}
                active={key === collapseName}
                noCollapse={noCollapse}
              />
            </Link>
          ) : (
            <NavLink key={key} to={route} onClick={onItemClick}>
              <SidenavCollapse
                name={name}
                icon={icon}
                active={key === collapseName}
                noCollapse={noCollapse}
              />
            </NavLink>
          );
        }
      }

      return returnValue;
    });

  return <>{renderRoutes(routes)}</>;
}

SidenavCollapseItem.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onItemClick: PropTypes.func.isRequired,
};

export default SidenavCollapseItem;
