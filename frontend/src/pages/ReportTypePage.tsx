import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { reportsApi, SavedReport, ReportType } from "../services/reportsApi";
import backIcon from "../public/images/back.svg";
import calendarSmallIcon from "../public/images/calendar_small.svg";
import prescriptionIcon from "../public/images/prescription.svg";
import medicalIcon from "../public/images/medical.svg";
import examIcon from "../public/images/exam.svg";
import { ReportsListSkeleton } from "../components/LoadingStates";

interface ReportTypeInfo {
  titleEn: string;
  titleKr: string;
  icon: string;
}

const REPORT_TYPE_INFO: Record<ReportType, ReportTypeInfo> = {
  prescription: {
    titleEn: "Prescription",
    titleKr: "처방전",
    icon: prescriptionIcon,
  },
  medical_certificate: {
    titleEn: "Medical Certificate",
    titleKr: "진단서",
    icon: medicalIcon,
  },
  examination_report: {
    titleEn: "Medical Examination Report",
    titleKr: "검진서",
    icon: examIcon,
  },
};

interface GroupedReports {
  date: string;
  formattedDate: string;
  reports: SavedReport[];
}

function ReportTypePage() {
  const { type } = useParams<{ type: ReportType }>();
  const navigate = useNavigate();
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);

  const reportType = (type as ReportType) || "prescription";
  const typeInfo =
    REPORT_TYPE_INFO[reportType] || REPORT_TYPE_INFO.prescription;

  useEffect(() => {
    loadReports();
  }, [reportType]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token");
      if (token) {
        const data = await reportsApi.getReports(token);
        const filtered = data.filter((r) => r.report_type === reportType);
        setReports(filtered);
      } else {
        setReports([]);
      }
    } catch (err) {
      console.log("Reports API not available yet:", err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDateKey = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD format for grouping
  };

  const getShortName = (report: SavedReport) => {
    if (report.disease_name) {
      const words = report.disease_name.split(" ");
      return words.slice(0, 2).join(" ");
    }
    return "Report";
  };

  const getHospitalName = (report: SavedReport) => {
    return report.medicine_name || "Hospital";
  };

  // Group reports by date
  const groupedReports: GroupedReports[] = reports.reduce((acc, report) => {
    const dateKey = getDateKey(report.created_at);
    const existingGroup = acc.find((g) => g.date === dateKey);

    if (existingGroup) {
      existingGroup.reports.push(report);
    } else {
      acc.push({
        date: dateKey,
        formattedDate: formatDate(report.created_at),
        reports: [report],
      });
    }
    return acc;
  }, [] as GroupedReports[]);

  return (
    <div className="min-h-screen pb-24">
      <div className="p-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/reports")}
            className="bg-transparent border-none p-2 cursor-pointer flex items-center justify-center"
          >
            <img src={backIcon} alt="Back" className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <img src={typeInfo.icon} alt="" className="w-7 h-7" />
            <span className="text-xl font-semibold text-gray-800">
              {typeInfo.titleEn}
            </span>
          </div>
          <div className="w-10" />
        </div>

        {/* Content */}
        {loading ? (
          <ReportsListSkeleton count={4} />
        ) : reports.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8">
            <img
              src={typeInfo.icon}
              alt=""
              className="w-20 h-20 mb-6 opacity-40"
            />
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              No {typeInfo.titleEn}s Yet
            </h2>
            <p className="text-gray-500 text-base max-w-sm mb-2">
              You haven't added any {typeInfo.titleEn.toLowerCase()} reports.
            </p>
            <p className="text-gray-400 text-sm">
              Tap the button below to add your first one.
            </p>
          </div>
        ) : (
          /* Reports List Grouped by Date */
          <div className="flex flex-col gap-6">
            {groupedReports.map((group) => (
              <div key={group.date}>
                {/* Date Header */}
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={calendarSmallIcon}
                    alt=""
                    className="w-[18px] h-[18px]"
                  />
                  <span className="text-sm font-medium text-gray-500">
                    {group.formattedDate}
                  </span>
                </div>

                {/* Reports for this date */}
                <div className="flex flex-col gap-3">
                  {group.reports.map((report) => (
                    <Link
                      key={report.id}
                      to={`/reports/${report.id}`}
                      className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 no-underline text-inherit transition-all hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <img src={typeInfo.icon} alt="" className="w-8 h-8" />
                        <div className="flex-1 flex flex-col gap-1">
                          <span className="text-base font-semibold text-gray-800">
                            {getHospitalName(report)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {getShortName(report)}
                          </span>
                        </div>
                        <div className="flex items-center justify-center">
                          <span className="text-2xl text-gray-300">›</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed Bottom Add Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent pt-8">
        <div className="flex justify-center">
          <Link
            to={`/reports/add?type=${reportType}`}
            className="inline-block bg-green-500 hover:bg-green-600 text-white text-center py-3 px-8 rounded-full font-semibold text-base transition-all shadow-lg"
          >
            Add Report +
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ReportTypePage;
