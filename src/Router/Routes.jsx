import { createBrowserRouter } from "react-router";
import Main from "../layouts/Main";
import Home from "../pages/Home";
import AdminDashboard from "../components/Dashboard";
import ProtectedRoute from "../Shared/ProtectedRoute";
import AdminLogin from "../pages/AdminLogin";
import ProjectDetails from "../components/Home/ProjectDetails";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Main,
    children: [
      {
        index: true,
        Component: Home,
      }
    ]
  },
  {
    path: "/admin",
    Component: AdminLogin,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/projects/:title",
    element: <ProjectDetails />,
  },
]);