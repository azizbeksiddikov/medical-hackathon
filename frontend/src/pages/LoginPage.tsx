import mainLogo from "./public/images/main_logo.svg";

function LoginPage() {
  const handleGoogleStart = () => {
    // Placeholder for Google sign-in; backend/auth can be wired later
    console.log("Start with Google");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans antialiased">
      {/* Status bar (mobile-style) */}
      <header className="flex-shrink-0 flex items-center justify-between px-6 pt-4 pb-2 safe-area-top">
        <span className="text-[15px] font-medium text-black">9:41</span>
      </header>

      {/* Main content - centered */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-4 pb-8">
        <img
          src={mainLogo}
          alt="Medi Port"
          className="w-[193px] h-[213px] object-contain mb-8"
        />
        <h1 className="text-[28px] font-bold tracking-[0.08em] uppercase text-[#28D863] mb-2">
          MEDI PORT
        </h1>
        <p className="text-base text-black/90">Your healthcare guide</p>
      </main>

      {/* CTA button */}
      <footer className="flex-shrink-0 px-6 pb-10 pt-2 safe-area-bottom">
        <button
          type="button"
          onClick={handleGoogleStart}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-[#28D863] text-white font-medium text-base shadow-sm hover:bg-[#22c259] active:scale-[0.98] transition-all duration-200"
        >
          <GoogleIcon className="w-5 h-5 flex-shrink-0" />
          Start with Google
        </button>
      </footer>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
  },
  title: {
    fontSize: "2rem",
    color: "#1a1a2e",
  },
};

export default LoginPage;
