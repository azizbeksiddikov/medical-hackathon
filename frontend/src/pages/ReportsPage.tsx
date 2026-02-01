import { Link } from "react-router-dom";
import { ReportType } from "../services/reportsApi";
import prescriptionIcon from "../public/images/prescription.svg";
import medicalIcon from "../public/images/medical.svg";
import examIcon from "../public/images/exam.svg";
import rightIcon from "../public/images/right.svg";

interface ReportSection {
  type: ReportType;
  titleEn: string;
  titleKr: string;
  icon: string;
}

const reportSections: ReportSection[] = [
  {
    type: "prescription",
    titleEn: "Prescription",
    titleKr: "처방전",
    icon: prescriptionIcon,
  },
  {
    type: "medical_certificate",
    titleEn: "Medical Certificate",
    titleKr: "진단서",
    icon: medicalIcon,
  },
  {
    type: "examination_report",
    titleEn: "Medical Examination Report",
    titleKr: "검진서",
    icon: examIcon,
  },
];

function ReportsPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto min-h-[80vh]">
      <h1 className="text-[1.75rem] font-bold text-gray-800 mb-8">
        MY REPORTS
      </h1>

      <div className="flex flex-col gap-4">
        {reportSections.map((section) => (
          <Link
            key={section.type}
            to={`/reports/type/${section.type}`}
            className="flex items-center justify-between bg-[#f2f2f2] rounded-2xl px-6 py-5 shadow-sm border border-gray-100 no-underline text-inherit transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <img src={section.icon} alt="" className="w-8 h-8" />
              <div className="flex flex-col gap-1">
                <span className="text-[25px] font-semibold text-gray-800">
                  {section.titleEn}
                </span>
                <span className="text-base font-normal text-gray-500">
                  {section.titleKr}
                </span>
              </div>
            </div>
            <img src={rightIcon} alt="" className="w-6 h-6 opacity-50" />
          </Link>
        ))}
      </div>

      {/* Add Report Button */}
      <Link
        to="/reports/add"
        className="block mt-8 bg-green-500 hover:bg-green-600 text-white text-center py-4 px-6 rounded-xl font-semibold text-base transition-all"
      >
        Add Report +
      </Link>
    </div>
  );
}

export default ReportsPage;
