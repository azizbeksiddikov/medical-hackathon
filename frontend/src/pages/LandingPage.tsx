import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import mainLogo from "../public/images/main_logo.svg";

function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Redirect if already authenticated
    if (!isLoading && isAuthenticated) {
      navigate("/app", { replace: true });
      return;
    }

    // Trigger animation only if not authenticated
    if (!isLoading && !isAuthenticated) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleGetStarted = () => {
    navigate("/login");
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#28D863] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Don't render if authenticated (redirect should happen)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#28D863] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center font-sans antialiased overflow-hidden px-6 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#28D863]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#28D863]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#28D863]/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div
        className={`flex flex-col items-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Logo with animation */}
        <div className="mb-8 animate-fade-in-up">
          <div className="relative">
            <img
              src={mainLogo}
              alt="Medi Port"
              className="w-[193px] h-[213px] object-contain drop-shadow-lg animate-float"
            />
            {/* Glow effect */}
            <div className="absolute inset-0 bg-[#28D863]/20 blur-2xl -z-10 animate-pulse"></div>
          </div>
        </div>

        {/* App Name */}
        <h1
          className={`text-[32px] md:text-[40px] font-bold tracking-[0.08em] uppercase text-[#28D863] mb-3 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          MEDI PORT
        </h1>

        {/* Tagline */}
        <p
          className={`text-lg md:text-xl text-black/70 mb-8 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          Your healthcare guide in Korea
        </p>

        {/* Intro Text */}
        <div
          className={`max-w-md text-center mb-12 space-y-4 transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <p className="text-base md:text-lg text-black/80 leading-relaxed">
            Navigate Korea's healthcare system with confidence. Get instant translations of your medical reports, find halal-friendly hospitals, and manage your health information—all in one place.
          </p>
          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#28D863] rounded-full animate-pulse"></div>
              <span className="text-sm text-black/60">Instant Translation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#28D863] rounded-full animate-pulse delay-300"></div>
              <span className="text-sm text-black/60">Halal Hospitals</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#28D863] rounded-full animate-pulse delay-500"></div>
              <span className="text-sm text-black/60">Secure & Private</span>
            </div>
          </div>
        </div>

        {/* Get Started Button */}
        <button
          onClick={handleGetStarted}
          className={`group relative px-10 py-4 bg-[#28D863] text-white font-semibold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:bg-[#22c259] active:scale-[0.98] transition-all duration-300 overflow-hidden transition-all duration-1000 delay-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <span className="relative z-10 flex items-center gap-2">
            Get Started
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
          {/* Button shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </button>

        {/* Features preview */}
        <div
          className={`mt-16 grid grid-cols-3 gap-8 max-w-md transition-all duration-1000 delay-1200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-[#28D863]/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-[#28D863]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                />
              </svg>
            </div>
            <p className="text-xs text-black/50">Translate</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#28D863]/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-[#28D863]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <p className="text-xs text-black/50">Hospitals</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#28D863]/10 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-6 h-6 text-[#28D863]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <p className="text-xs text-black/50">Secure</p>
          </div>
        </div>
      </div>

      {/* Bottom navigation indicator (matching the image) */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-32 h-1.5 bg-black/20 rounded-full flex items-center justify-center">
          <div className="w-16 h-1 bg-black/40 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

