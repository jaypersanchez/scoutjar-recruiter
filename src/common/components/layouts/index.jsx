import React from "react";
import PageLayout from "./PageLayout";
import AuthLayout from "./AuthLayout";
import RootLayout from "./RootLayout";

import Page404 from "./Page404"; // ✅ local file
import Footer from "./Footer";

import WidgetBox from "./WidgetBox";
import PageHeader from "./PageHeader";

// 👇 This makes it crystal clear, easy to maintain, and avoids redeclarations or undefined imports
export { default as PageLayout } from "./PageLayout";
export { default as AuthLayout } from "./AuthLayout";
export { default as RootLayout } from "./RootLayout";
//export { default as Page404 } from "./Page404";
export { default as Footer } from "./Footer";
export { default as WidgetBox } from "./WidgetBox";
export { default as PageHeader } from "./PageHeader";

/*export {
  PageLayout,
  AuthLayout,
  RootLayout,
  Page404,
  Footer,
  WidgetBox,
  PageHeader,
};*/
