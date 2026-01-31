import { useRef } from "react";

interface BirthDateInputProps {
  value: { year: string; month: string; day: string };
  onChange: (value: { year: string; month: string; day: string }) => void;
  onSubmit?: () => void;
}

function BirthDateInput({ value, onChange, onSubmit }: BirthDateInputProps) {
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: "year" | "month" | "day", val: string) => {
    // Only allow digits
    const digitsOnly = val.replace(/\D/g, "");

    // Limit digits: year=4, month=2, day=2
    const maxLength = field === "year" ? 4 : 2;
    const limitedVal = digitsOnly.slice(0, maxLength);

    const newDate = { ...value, [field]: limitedVal };
    onChange(newDate);

    // Auto-focus to next input when max length reached
    if (limitedVal.length === maxLength) {
      if (field === "year") {
        monthRef.current?.focus();
      } else if (field === "month") {
        dayRef.current?.focus();
      }
    }
  };

  const inputClass = `
    min-w-0 py-3 px-2 text-base bg-gray-100 rounded-xl outline-none text-center
    transition-all duration-200 border-2 border-gray-200 focus:border-primary
  `;

  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-2 items-center w-full">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="YYYY"
          value={value.year}
          onChange={(e) => handleChange("year", e.target.value)}
          className={`${inputClass} flex-[2]`}
          maxLength={4}
        />
        <span className="text-gray-400 text-sm shrink-0">/</span>
        <input
          ref={monthRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="MM"
          value={value.month}
          onChange={(e) => handleChange("month", e.target.value)}
          className={`${inputClass} flex-1`}
          maxLength={2}
        />
        <span className="text-gray-400 text-sm shrink-0">/</span>
        <input
          ref={dayRef}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="DD"
          value={value.day}
          onChange={(e) => handleChange("day", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit?.()}
          className={`${inputClass} flex-1`}
          maxLength={2}
        />
      </div>

      <p className="mt-4 text-sm text-gray-600 text-center leading-relaxed">
        You cannot change the entered
        <br />
        information once you save it!
      </p>
    </div>
  );
}

export default BirthDateInput;
