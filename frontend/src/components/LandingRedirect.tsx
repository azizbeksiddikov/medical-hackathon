import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LandingPage from "../pages/LandingPage";

/**
 * Component that shows landing page for unauthenticated users,
 * or redirects authenticated users to the main app.
 */
function LandingRedirect() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#28D863] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show loading spinner while redirecting authenticated users
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#28D863] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <LandingPage />;
}

export default LandingRedirect;
