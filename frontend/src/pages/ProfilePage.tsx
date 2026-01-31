import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const languageLabels: Record<string, string> = {
  en: "English",
  ko: "한국어",
  zh: "中文",
  ja: "日本語",
  vi: "Tiếng Việt",
};

const genderLabels: Record<string, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
};

const visitPurposeLabels: Record<string, string> = {
  tourism: "Tourism",
  business: "Business",
  study: "Study",
  medical: "Medical Treatment",
  other: "Other",
};

function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatBirthDate = () => {
    if (!user?.birth_year) return null;
    const year = user.birth_year;
    const month = user.birth_month?.padStart(2, "0") || "01";
    const day = user.birth_day?.padStart(2, "0") || "01";
    return `${year}.${month}.${day}`;
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Please log in to view your profile
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[80vh] px-6 py-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-8">
        {/* Profile Picture */}
        <div className="relative mb-4">
          {user.picture ? (
            <img
              src={user.picture}
              alt={user.name || "Profile"}
              className="w-24 h-24 rounded-full object-cover border-4 border-primary/20 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user.nickname?.charAt(0).toUpperCase() ||
                user.name?.charAt(0).toUpperCase() ||
                user.email?.charAt(0).toUpperCase() ||
                "U"}
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        {/* Nickname / Name */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {user.nickname || user.name || "User"}
        </h1>

        {/* Email */}
        <p className="text-gray-500 text-sm">{user.email}</p>
      </div>

      {/* Profile Info Cards */}
      <div className="space-y-3 mb-8">
        {/* Language */}
        {user.language && (
          <InfoCard
            icon={
              <svg
                className="w-5 h-5 text-indigo-600"
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
            }
            iconBg="bg-indigo-100"
            label="Language"
            value={languageLabels[user.language] || user.language}
          />
        )}

        {/* Phone */}
        {user.phone && (
          <InfoCard
            icon={
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            }
            iconBg="bg-green-100"
            label="Phone Number"
            value={user.phone}
          />
        )}

        {/* Birth Date */}
        {user.birth_year && (
          <InfoCard
            icon={
              <svg
                className="w-5 h-5 text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"
                />
              </svg>
            }
            iconBg="bg-pink-100"
            label="Date of Birth"
            value={formatBirthDate() || "Not set"}
          />
        )}

        {/* Gender */}
        {user.gender && (
          <InfoCard
            icon={
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            }
            iconBg="bg-purple-100"
            label="Gender"
            value={genderLabels[user.gender] || user.gender}
          />
        )}

        {/* Visit Purpose */}
        {user.visit_purpose && (
          <InfoCard
            icon={
              <svg
                className="w-5 h-5 text-orange-600"
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
            }
            iconBg="bg-orange-100"
            label="Visit Purpose"
            value={visitPurposeLabels[user.visit_purpose] || user.visit_purpose}
          />
        )}

        {/* Email */}
        <InfoCard
          icon={
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          }
          iconBg="bg-blue-100"
          label="Email"
          value={user.email}
        />
      </div>

      {/* Actions */}
      <div className="mt-auto space-y-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-red-50 text-red-600 font-medium text-base hover:bg-red-100 active:scale-[0.98] transition-all duration-200"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Log Out
        </button>
      </div>
    </div>
  );
}

interface InfoCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
}

function InfoCard({ icon, iconBg, label, value }: InfoCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-400 uppercase tracking-wide">
            {label}
          </p>
          <p className="text-gray-800 font-medium">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
