interface GenderSelectorProps {
  onSelect: (gender: string) => void;
  selectedGender: string;
}

const genders = [
  { id: "man", label: "Man" },
  { id: "woman", label: "Woman" },
];

function GenderSelector({ onSelect, selectedGender }: GenderSelectorProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {genders.map((gender) => {
        const isSelected = selectedGender === gender.id;
        return (
          <button
            key={gender.id}
            onClick={() => onSelect(gender.id)}
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
            {gender.label}
          </button>
        );
      })}
    </div>
  );
}

export default GenderSelector;
