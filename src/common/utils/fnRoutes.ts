import { ReactNode } from "react";
import { startCase, flatMap } from "lodash";
import { PageRouteProps } from "../types/routes.types";

export type NavigationItem = {
  path?: string;
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
  return flatMap(routes, (route: PageRouteProps): NavigationItem[] => {
    if (route.hidden || (route.id && excludeIds.includes(route.id))) {
      return [];
    }

    const hasChildren = Array.isArray(route.children) && route.children.length > 0;

    if (hasChildren) {
      //const visibleChildren = route.children?.filter(_ => true) ?? [];
      const visibleChildren = route.children?.filter(
  (child) => !child.hidden && !child.path?.includes(":")
) ?? [];

      if (visibleChildren.length > 0) {
        return [{
          icon: route.icon || null,
          label: route.label || getLabelFromPath(route.path || ""),
          children: visibleChildren.map((child): NavigationItem => ({
            icon: child.icon || null,
            label: child.label || getLabelFromPath(child.path || ""),
            path: getFullPath(route.path, child.path),
          })),
        }];
      }

      return [];
    }

    if (!route.path?.includes(":")) {
      return [{
        icon: route.icon || null,
        label: route.label || getLabelFromPath(route.path || ""),
        path: getFullPath(route.path),
      }];
    }

    return [];
  });
}






