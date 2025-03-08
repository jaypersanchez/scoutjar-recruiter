import { ReactNode } from "react";
import { omit, startCase, flatMap } from "lodash";
import { PageRouteProps } from "../types/routes.types";

/**
 * Extract routes from the routes array
 * @param routes - The routes array
 * @param excludeIds - The ids to exclude from the routes
 * @returns The extracted routes
 */
export function routers(routes: PageRouteProps[], excludeIds: string[] = []) {
  return routes
    .filter((route) => !route.id || !excludeIds.includes(route.id)) // Exclude by ID
    .map((route) => ({
      ...omit(route, ["parentId", "icon"]),
      children: route.children
        ? route.children
            .filter((child) => !child.hidden) // Remove hidden children
            .map((child) => omit(child, ["hidden", "label", "icon"])) // Remove keys
        : undefined,
    }));
}

export type NavigationItem = {
  path: string;
  label: string;
  icon: ReactNode;
};

/**
 * Get navigation items from routes
 * @param routes - The routes
 * @param excludeIds - The ids to exclude from the routes
 * @returns The navigation items
 *
 * @example
 * const PAGE_ROUTES = [
 *   {
 *     id: "users",
 *     path: "/users",
 *     children: [{ path: "profile", label: "Profile", icon: <FaUser /> }],
 *   },
 * ];
 *
 * navigations(PAGE_ROUTES) // [{ path: "/users/profile", label: "Users Profile", icon: <FaUser /> }]
 *
 */
export function navigations(
  routes: PageRouteProps[],
  excludeIds: string[] = []
) {
  const getLabelFromPath = (path: string): string => {
    return path
      .replace(/^\/+/g, "")
      .split("/") // Split by "/"
      .map((word) => startCase(word)) // Capitalize words
      .join(" "); // Join with space
  };

  const getFullPath = (root: string = "", sub: string = "") => {
    const subPath = sub ? `/${sub}` : "";
    return `/${root.replace(/^\/+/, "")}${subPath}`.replace(/\/+/g, "/");
  };

  const filteredRoutes = routes.filter(
    (route) => !route.id || !excludeIds.includes(route.id)
  );

  return flatMap(filteredRoutes, (route: PageRouteProps) => {
    if (!route?.parentId) {
      return route.children
        ?.filter((child) => !child.hidden)
        .map((child) => {
          const fullPath = getFullPath(route.path, child.path);

          return {
            icon: child.icon || null,
            label: child?.label || getLabelFromPath(fullPath),
            path: fullPath, // Ensure proper path formatting
          };
        });
    }

    const fullPath = getFullPath(route.path);

    return {
      icon: route.icon || null,
      label: getLabelFromPath(fullPath),
      children: route.children
        ?.filter((child) => !child.hidden)
        .map((child) => ({
          icon: child.icon || null,
          label: child.label,
          path: getFullPath(route.path, child.path),
        })),
    };
  });
}
