import { useState } from "react";

interface VisitPurposeSelectorProps {
  onSelect: (purpose: string) => void;
  selectedPurpose?: string;
}

const purposes = [
  { id: "general", label: "General check-up" },
  { id: "cancer", label: "Cancer care" },
  { id: "orthopedics", label: "Orthopedics" },
  { id: "internal", label: "Internal medicine" },
  { id: "womens", label: "Women's health" },
  { id: "mental", label: "Mental health" },
  { id: "surgery", label: "Surgery / Procedure" },
  { id: "other", label: "Other / Custom" },
];

function VisitPurposeSelector({
  onSelect,
  selectedPurpose,
}: VisitPurposeSelectorProps) {
  const [selected, setSelected] = useState(selectedPurpose || "");

  const handleSelect = (purposeId: string) => {
    setSelected(purposeId);
    onSelect(purposeId);
  };

  return (
    <div className="flex flex-col gap-3 w-full pb-4">
      {purposes.map((purpose) => {
        const isSelected = selected === purpose.id;
        return (
          <button
            key={purpose.id}
            onClick={() => handleSelect(purpose.id)}
            className={`
              w-full py-4 px-5 text-base font-medium rounded-2xl cursor-pointer text-left
              transition-all duration-200 border-2
              ${
                isSelected
                  ? "bg-primary border-primary text-white shadow-primary"
                  : "bg-gray-100 border-gray-200 text-gray-800 hover:bg-gray-200 hover:border-gray-300"
              }
            `}
          >
            {purpose.label}
          </button>
        );
      })}
    </div>
  );
}

export default VisitPurposeSelector;
