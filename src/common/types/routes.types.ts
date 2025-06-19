import React from "react";
//import { IconType } from "react-icons/lib";

import {
  RouteObject,
  IndexRouteObject,
  NonIndexRouteObject,
} from "react-router-dom";

export interface PageIndexRoutePath extends IndexRouteObject {
  icon?: React.ReactNode;
  label?: string;
  hidden: boolean;
}

export interface PageNonIndexRoutePath extends NonIndexRouteObject {
  icon?: React.ReactNode;
  label?: string;
  hidden: boolean;
}

export type PageRouteProps = Omit<RouteObject, "children"> & {
  children?: Array<PageIndexRoutePath | PageNonIndexRoutePath>;
  parentId?: string;
  icon?: React.ReactNode;
  label?: string; // ✅ Add this line
  hidden?: boolean; // (also add if you're using it elsewhere)
};
