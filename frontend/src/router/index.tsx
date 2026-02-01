import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout.tsx";
import LandingRedirect from "../components/LandingRedirect.tsx";
import LandingPage from "../pages/LandingPage.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import OnboardingPage from "../pages/OnboardingPage.tsx";
// import HospitalsPage from "../pages/HospitalsPage.tsx";
// import HospitalDetailPage from "../pages/HospitalDetailPage.tsx";
import HomePage from "../pages/HomePage.tsx";
import ReportsPage from "../pages/ReportsPage.tsx";
import ReportTypePage from "../pages/ReportTypePage.tsx";
import ReportDetailPage from "../pages/ReportDetailPage.tsx";
import AddReportPage from "../pages/AddReportPage.tsx";
import ProfilePage from "../pages/ProfilePage.tsx";
import ErrorBoundary from "../components/ErrorBoundary.tsx";

export const router = createBrowserRouter([
  // Landing page - for unauthenticated users
  {
    path: "/landing",
    element: <LandingRedirect />,
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
  // Main app with navigation
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // {
      //   path: "hospitals",
      //   element: <HospitalsPage />,
      // },
      // {
      //   path: "hospital/:id",
      //   element: <HospitalDetailPage />,
      // },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "reports/type/:type",
        element: <ReportTypePage />,
      },
      {
        path: "reports/:id",
        element: <ReportDetailPage />,
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
