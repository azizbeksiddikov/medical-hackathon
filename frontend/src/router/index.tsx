import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout.tsx";
import LoginPage from "../pages/LoginPage.tsx";
import OnboardingPage from "../pages/OnboardingPage.tsx";
import HospitalsPage from "../pages/HospitalsPage.tsx";
import HospitalDetailPage from "../pages/HospitalDetailPage.tsx";
import ReportsPage from "../pages/ReportsPage.tsx";
import ProfilePage from "../pages/ProfilePage.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HospitalsPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "onboarding",
        element: <OnboardingPage />,
      },
      {
        path: "hospitals",
        element: <HospitalsPage />,
      },
      {
        path: "hospital/:id",
        element: <HospitalDetailPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
]);
