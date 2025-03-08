import { IconType } from "react-icons/lib";

import {
  RouteObject,
  IndexRouteObject,
  NonIndexRouteObject,
} from "react-router-dom";

export interface PageIndexRoutePath extends IndexRouteObject {
  icon?: IconType;
  label?: string;
  hidden: boolean;
}

export interface PageNonIndexRoutePath extends NonIndexRouteObject {
  icon?: IconType;
  label?: string;
  hidden: boolean;
}

export type PageRouteProps = Omit<RouteObject, "children"> & {
  children?: Array<PageIndexRoutePath | PageNonIndexRoutePath>;
  parentId?: string;
  icon?: IconType;
};
