import { useState } from "react";

interface PhoneInputProps {
  value?: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
}

function PhoneInput({ value = "", onChange, onSubmit }: PhoneInputProps) {
  const [phone, setPhone] = useState(value);
  const [error, setError] = useState("");

  const validatePhone = (val: string) => {
    const phoneRegex = /^[0-9+\-\s()]*$/;
    if (val && !phoneRegex.test(val)) {
      setError("Please enter a valid phone number.");
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setPhone(newValue);
    validatePhone(newValue);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col w-full">
      <input
        type="tel"
        placeholder="Enter Phone Number"
        value={phone}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && onSubmit?.()}
        className={`
          w-full py-4 px-5 text-base bg-gray-100 rounded-2xl outline-none
          transition-all duration-200 border-2
          ${
            error
              ? "border-danger focus:border-danger"
              : "border-gray-200 focus:border-primary"
          }
        `}
      />
      <p
        className={`mt-4 text-sm text-center ${
          error ? "text-danger" : "text-gray-600"
        }`}
      >
        {error || "You cannot change the entered information once you save it!"}
      </p>
    </div>
  );
}

export default PhoneInput;
