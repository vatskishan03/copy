import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
