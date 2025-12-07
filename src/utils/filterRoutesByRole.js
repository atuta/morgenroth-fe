// utils/filterRoutesByRole.js
export const filterRoutesByRole = (routes, role) => {
  return routes
    .filter((route) => {
      if (!route.roles) return true; // no role restriction
      return route.roles.includes(role);
    })
    .map((route) => {
      // recursively filter collapse items
      if (route.collapse) {
        return {
          ...route,
          collapse: filterRoutesByRole(route.collapse, role),
        };
      }
      return route;
    });
};
