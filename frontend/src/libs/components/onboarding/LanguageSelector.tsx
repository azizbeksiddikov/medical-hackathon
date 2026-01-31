import { useState } from "react";

interface LanguageSelectorProps {
  onSelect: (language: string) => void;
  selectedLanguage?: string;
}

const languages = [
  { id: "english", label: "English" },
  { id: "korean", label: "한국어" },
  { id: "chinese", label: "中文" },
  { id: "japanese", label: "日本語" },
  { id: "german", label: "Deutsch" },
  { id: "spanish", label: "Español" },
  { id: "others", label: "Others" },
];

function LanguageSelector({
  onSelect,
  selectedLanguage,
}: LanguageSelectorProps) {
  const [selected, setSelected] = useState(selectedLanguage || "");

  const handleSelect = (languageId: string) => {
    setSelected(languageId);
    onSelect(languageId);
  };

  return (
    <div className="flex flex-col gap-3 w-full pb-4">
      {languages.map((lang) => {
        const isSelected = selected === lang.id;
        return (
          <button
            key={lang.id}
            onClick={() => handleSelect(lang.id)}
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
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}

export default LanguageSelector;
