import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import examIcon from "../public/images/exam.svg";
import medicalIcon from "../public/images/medical.svg";
import prescriptionIcon from "../public/images/prescription.svg";

function HomePage() {
  const { user } = useAuth();

  const quickActions = [
    {
      icon: examIcon,
      label: "검사결과",
      description: "Lab Results",
      path: "/reports/type/exam",
      color: "bg-blue-50",
    },
    {
      icon: medicalIcon,
      label: "진료기록",
      description: "Medical Records",
      path: "/reports/type/medical",
      color: "bg-green-50",
    },
    {
      icon: prescriptionIcon,
      label: "처방전",
      description: "Prescriptions",
      path: "/reports/type/prescription",
      color: "bg-purple-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Section */}
      <div className="bg-primary text-white px-6 py-8 rounded-b-3xl">
        <h1 className="text-2xl font-bold mb-2">
          안녕하세요{user?.nickname ? `, ${user.nickname}` : ""}님 👋
        </h1>
        <p className="text-white/80">오늘도 건강한 하루 되세요</p>
      </div>

      {/* Quick Actions */}
      <div className="px-6 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            빠른 메뉴
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link
                key={action.path}
                to={action.path}
                className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`w-14 h-14 ${action.color} rounded-full flex items-center justify-center`}
                >
                  <img src={action.icon} alt={action.label} className="w-7 h-7" />
                </div>
                <span className="text-sm font-medium text-gray-800">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* View All Reports */}
      <div className="px-6 mt-6">
        <Link
          to="/reports"
          className="block bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                전체 리포트 보기
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                모든 의료 기록을 확인하세요
              </p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Add New Report CTA */}
      <div className="px-6 mt-6 pb-6">
        <Link
          to="/reports/add"
          className="block bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-white hover:opacity-95 transition-opacity"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold">새 리포트 추가</h3>
              <p className="text-white/80 text-sm">
                의료 기록을 업로드하세요
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
