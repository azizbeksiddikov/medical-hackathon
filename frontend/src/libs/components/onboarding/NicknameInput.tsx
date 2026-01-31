import { useState } from "react";

interface NicknameInputProps {
  value?: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
}

function NicknameInput({ value = "", onChange, onSubmit }: NicknameInputProps) {
  const [nickname, setNickname] = useState(value);
  const [error, setError] = useState("");

  const validateNickname = (val: string) => {
    const nicknameRegex = /^[a-zA-Z0-9]*$/;
    if (val && !nicknameRegex.test(val)) {
      setError("You can only use English and numbers without spaces.");
      return false;
    }
    setError("");
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setNickname(newValue);
    validateNickname(newValue);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col w-full">
      <input
        type="text"
        placeholder="Enter Nickname"
        value={nickname}
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

export default NicknameInput;
