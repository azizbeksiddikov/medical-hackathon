import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout.tsx";
import LandingRedirect from "../components/LandingRedirect.tsx";
import LandingPage from "../pages/LandingPage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import OnboardingPage from "../pages/OnboardingPage.tsx";
import HospitalsPage from "../pages/HospitalsPage.tsx";
import HospitalDetailPage from "../pages/HospitalDetailPage.tsx";
import ReportsPage from "../pages/ReportsPage.tsx";
import AddReportPage from "../pages/AddReportPage.tsx";
import ProfilePage from "../pages/ProfilePage.tsx";
import ErrorBoundary from "../components/ErrorBoundary.tsx";

export const router = createBrowserRouter([
  // Root - shows landing page for unauthenticated, redirects authenticated users
  {
    path: "/",
    element: <LandingRedirect />,
    errorElement: <ErrorBoundary />,
  },
  // Landing page - direct access
  {
    path: "/landing",
    element: <LandingPage />,
    errorElement: <ErrorBoundary />,
  },
  // Login - no navigation
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorBoundary />,
  },
  // Onboarding - no navigation
  {
    path: "/onboarding",
    element: <OnboardingPage />,
    errorElement: <ErrorBoundary />,
  },
  // Main app with navigation (protected routes)
  {
    path: "/app",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <HospitalsPage />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "hospitals",
        element: <HospitalsPage />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "hospital/:id",
        element: <HospitalDetailPage />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "reports/add",
        element: <AddReportPage />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
        errorElement: <ErrorBoundary />,
      },
    ],
  },
]);
