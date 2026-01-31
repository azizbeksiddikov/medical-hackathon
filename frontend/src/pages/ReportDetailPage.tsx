import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { reportsApi, SavedReport } from "../services/reportsApi";
import backIcon from "../public/images/back.svg";
import { ReportDetailSkeleton } from "../components/LoadingStates";

// Get the backend base URL for static files (uploads)
// VITE_API_BASE_URL is the base URL without /api (e.g., http://localhost:9090)
const getBackendBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  // Use env variable if set
  if (envUrl) {
    return envUrl;
  }
  // Fallback for local development
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "http://localhost:9090";
  }
  return "";
};

const BACKEND_BASE_URL = getBackendBaseUrl();

const LANGUAGES = [
  { code: "original", name: "Original (원본)" },
  { code: "en", name: "English" },
  { code: "ko", name: "Korean (한국어)" },
  { code: "zh", name: "Chinese (中文)" },
  { code: "ja", name: "Japanese (日本語)" },
  { code: "es", name: "Spanish (Español)" },
  { code: "vi", name: "Vietnamese (Tiếng Việt)" },
  { code: "th", name: "Thai (ไทย)" },
  { code: "ru", name: "Russian (Русский)" },
  { code: "ar", name: "Arabic (العربية)" },
  { code: "uz", name: "Uzbek (O'zbek)" },
];

function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<SavedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("original");

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      if (token) {
        const data = await reportsApi.getReport(id, token);
        setReport(data);
        // Set default language to the translated language if available
        if (data.target_language) {
          setSelectedLanguage(data.target_language);
        }
      }
    } catch (err) {
      setError("Failed to load report");
      console.log("Error loading report:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  const getHospitalName = (report: SavedReport) => {
    return report.medicine_name || "Hospital";
  };

  const getAnalysisName = (report: SavedReport) => {
    return report.disease_name || "Medical Analysis";
  };

  const getTextForLanguage = () => {
    if (!report) return "";

    if (selectedLanguage === "original") {
      return report.full_description || "";
    }

    // If the selected language matches the translated language, show translation
    if (selectedLanguage === report.target_language && report.translated_text) {
      return report.translated_text;
    }

    // Otherwise show original with a note
    return report.full_description || "";
  };

  const handleDownloadPDF = async () => {
    if (!report) return;

    // Create a simple PDF-like content (in real app, use a PDF library)
    const content = `
MEDICAL REPORT
==============

Hospital: ${getHospitalName(report)}
Analysis: ${getAnalysisName(report)}
Date: ${formatDate(report.created_at)}

Code: ${report.disease_icd_code || "-"}
Diagnosis: ${report.disease_name || "-"}

Description:
${report.full_description || "-"}

${
  report.translated_text
    ? `\nTranslation (${report.target_language?.toUpperCase()}):\n${
        report.translated_text
      }`
    : ""
}
    `.trim();

    // Create blob and download
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report_${report.id}_${formatDate(report.created_at)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-24">
        <div className="p-6 max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate(-1)}
              className="bg-transparent border-none p-2 cursor-pointer flex items-center justify-center"
            >
              <img src={backIcon} alt="Back" className="w-6 h-6" />
            </button>
            <span className="text-xl font-semibold text-gray-800">
              Report Details
            </span>
            <div className="w-10" />
          </div>

          <ReportDetailSkeleton />
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-6 max-w-3xl mx-auto min-h-[80vh]">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-transparent border-none p-2 cursor-pointer flex items-center justify-center"
          >
            <img src={backIcon} alt="Back" className="w-6 h-6" />
          </button>
          <span className="text-xl font-semibold text-gray-800">
            Report Details
          </span>
          <div className="w-10" />
        </div>
        <div className="flex justify-center items-center min-h-[200px]">
          <p className="text-red-500 text-base">
            {error || "Report not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="p-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-transparent border-none p-2 cursor-pointer flex items-center justify-center"
          >
            <img src={backIcon} alt="Back" className="w-6 h-6" />
          </button>
          <span className="text-xl font-semibold text-gray-800">
            Report Details
          </span>
          <div className="w-10" />
        </div>

        {/* Gray Cloud - Hospital, Analysis, Date */}
        <div className="bg-[#f2f2f2] rounded-2xl p-5 mb-6">
          <div className="text-lg font-semibold text-gray-800 mb-1">
            {getHospitalName(report)}
          </div>
          <div className="text-base text-gray-600 mb-1">
            {getAnalysisName(report)}
          </div>
          <div className="text-sm text-gray-500">
            {formatDate(report.created_at)}
          </div>
        </div>

        {/* Info Lines with Bottom Border */}
        <div className="mb-6 space-y-2">
          {/* Code */}
          <div className="py-4 border-b border-gray-200">
            <div className="text-gray-500 text-sm mb-2">Code</div>
            <div className="text-gray-800 font-medium text-base">
              {report.disease_icd_code || "-"}
            </div>
          </div>

          {/* 진단 내역 (Diagnosis) */}
          <div className="py-4 border-b border-gray-200">
            <div className="text-gray-500 text-sm mb-2">진단 내역</div>
            <div className="text-gray-800 font-medium text-base">
              {report.disease_name || "-"}
            </div>
          </div>

          {/* 추가 정보 (Additional Info) */}
          <div className="py-4 border-b border-gray-200">
            <div className="text-gray-500 text-sm mb-2">추가 정보</div>
            <div className="text-gray-800 font-medium text-base leading-relaxed">
              {report.full_description?.slice(0, 100) || "-"}
            </div>
          </div>
        </div>
      </div>

      {/* Original Document Modal */}
      {showOriginal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div
            className="bg-white w-full max-w-3xl rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <button
                onClick={() => setShowOriginal(false)}
                className="text-gray-500 text-base font-medium"
              >
                닫기
              </button>
              <span className="text-lg font-semibold text-gray-800">
                진단서 원문
              </span>
              <div className="w-10" />
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Original Image */}
              {report.image_url && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                    Original Document
                  </h3>
                  <div className="bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={`${BACKEND_BASE_URL}${report.image_url}`}
                      alt="Original Report"
                      className="w-full max-h-[300px] object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Language Selector */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                  Text Language
                </h3>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl text-base bg-white cursor-pointer"
                >
                  {LANGUAGES.map((lang) => (
                    <option
                      key={lang.code}
                      value={lang.code}
                      disabled={
                        lang.code !== "original" &&
                        lang.code !== report.target_language
                      }
                    >
                      {lang.name}
                      {lang.code === report.target_language && " ✓"}
                    </option>
                  ))}
                </select>
                {selectedLanguage !== "original" &&
                  selectedLanguage !== report.target_language && (
                    <p className="text-sm text-orange-500 mt-2">
                      Translation not available for this language
                    </p>
                  )}
              </div>

              {/* Text Content */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                  {selectedLanguage === "original"
                    ? "Original Text"
                    : `Translated Text (${selectedLanguage.toUpperCase()})`}
                </h3>
                <div className="bg-[#f8f9fa] rounded-xl p-4">
                  <p className="text-gray-700 leading-relaxed text-base whitespace-pre-wrap">
                    {getTextForLanguage() || "No text available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer - Download Button */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleDownloadPDF}
                className="w-full bg-green-500 hover:bg-green-600 text-white text-center py-4 px-6 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2"
              >
                <span>📥</span>
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent pt-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => setShowOriginal(true)}
            className="w-full bg-green-500 hover:bg-green-600 text-white text-center py-4 px-6 rounded-xl font-semibold text-base transition-all"
          >
            진단서 원문 보기
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportDetailPage;
