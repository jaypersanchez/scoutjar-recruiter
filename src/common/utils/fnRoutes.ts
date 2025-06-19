import { ReactNode } from "react";
import { startCase, flatMap } from "lodash";
import { PageRouteProps } from "../types/routes.types";

export type NavigationItem = {
  path: string;
  label: string;
  icon: ReactNode;
  children?: NavigationItem[];
};

const getLabelFromPath = (path: string): string => {
  return path
    .replace(/^\/+/g, "")
    .split("/")
    .map((word) => startCase(word))
    .join(" ");
};

const getFullPath = (root: string = "", sub: string = "") => {
  const subPath = sub ? `/${sub}` : "";
  return `/${root.replace(/^\/+/, "")}${subPath}`.replace(/\/+/g, "/");
};

export function navigations(routes: PageRouteProps[], excludeIds: string[] = []): NavigationItem[] {
  return flatMap(routes, (route: PageRouteProps) => {
    // Skip if route is explicitly hidden or excluded by ID
    if (route.hidden || (route.id && excludeIds.includes(route.id))) {
      return [];
    }

    const hasChildren = Array.isArray(route.children) && route.children.length > 0;

    if (hasChildren) {
      /*const visibleChildren = route.children.filter(
        (child) => !child.hidden && !child.path?.includes(":")
      ) || [];*/
      const visibleChildren = route.children?.filter(child => true) ?? [];

      if (visibleChildren.length > 0) {
        return {
          icon: route.icon || null,
          label: route.label || getLabelFromPath(route.path || ""),
          children: visibleChildren.map((child) => ({
            icon: child.icon || null,
            label: child.label || getLabelFromPath(child.path || ""),
            path: getFullPath(route.path, child.path),
          })),
        };
      }

      return []; // Skip parent if all children are hidden
    }

    // Render any standalone route that isn’t a dynamic or hidden route
    if (!route.path?.includes(":")) {
      return {
        icon: route.icon || null,
        label: route.label || getLabelFromPath(route.path || ""),
        path: getFullPath(route.path),
      };
    }

    return [];
  });
}


/*export function navigations(routes: PageRouteProps[], excludeIds: string[] = []): NavigationItem[] {
  const filteredRoutes = routes.filter(
    (route) => !route.hidden && (!route.id || !excludeIds.includes(route.id))
  );

  return flatMap(filteredRoutes, (route: PageRouteProps) => {
    const hasChildren = Array.isArray(route.children) && route.children.length > 0;

    // ✅ Parent with visible children
    if (!route?.parentId && hasChildren) {
      const visibleChildren = route.children.filter(
        (child) => !child.hidden && !child.path?.includes(":")
      );

      if (visibleChildren.length > 0) {
        return {
          icon: route.icon || null,
          label: route.label || getLabelFromPath(route.path),
          children: visibleChildren.map((child) => ({
            icon: child.icon || null,
            label: child.label || getLabelFromPath(child.path),
            path: getFullPath(route.path, child.path),
          })),
        };
      }
    }

    // ✅ Standalone menu item with no children
    if (!route?.parentId && !hasChildren) {
      return {
        icon: route.icon || null,
        label: route.label || getLabelFromPath(route.path),
        path: getFullPath(route.path),
      };
    }

    return [];
  });
}*/
