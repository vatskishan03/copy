import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CreateSnippetForm from '../components/CreateSnippetForm';
import ReceiveSnippetForm from '../components/ReceiveSnippetForm';
import SnippetDisplay from '../components/SnippetDisplay'; // If you have a dedicated page to display the snippet

const router = createBrowserRouter([
  {
    path: "/",
    element: <CreateSnippetForm />,
  },
  {
    path: "/receive/:token",
    element: <ReceiveSnippetForm />,
  },
  {
    path: "/display/:token", 
    element: <SnippetDisplay />,
  },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
