import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../App";

const router = createBrowserRouter([
  {
    path: "/",
<<<<<<< HEAD
    element: <Home />,
=======
    element: <CreateSnippetForm />,
  },
  {
    path: "/receive/:token",
    element: <ReceiveSnippetForm />,
  },
  {
    path: "/display/:token", 
    element: <SnippetDisplay />,
>>>>>>> b039659058b6e76d66b1d4b092c48f9fb8f20636
  },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
