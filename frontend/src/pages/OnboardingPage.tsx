import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LanguageSelector,
  PhoneInput,
  NicknameInput,
  BirthDateInput,
  GenderSelector,
  ProfileImageInput,
  VisitPurposeSelector,
} from "../libs/components/onboarding";
import smallLogo from "../public/images/small_logo.svg";

const stepTexts = [
  "Choose your language.",
  "Please enter\nyour phone number.",
  "Please enter\nyour nickname.",
  "Please tell me\nthe year of your birth.",
  "Please choose\nyour gender.",
  "Set up your\nown profile.",
  "What is this\nvisit for?",
];

function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [language, setLanguage] = useState("");
  const [phone, setPhone] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState({ year: "", month: "", day: "" });
  const [gender, setGender] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imageChosen, setImageChosen] = useState(false);
  const [visitPurpose, setVisitPurpose] = useState("");

  const handleNext = () => {
    if (currentStep < stepTexts.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate("/");
    }
  };

  const trySubmit = () => {
    if (!isNextDisabled()) {
      handleNext();
    }
  };

  const renderMenu = () => {
    switch (currentStep) {
      case 0:
        return (
          <LanguageSelector
            onSelect={setLanguage}
            selectedLanguage={language}
          />
        );
      case 1:
        return (
          <PhoneInput value={phone} onChange={setPhone} onSubmit={trySubmit} />
        );
      case 2:
        return (
          <NicknameInput
            value={nickname}
            onChange={setNickname}
            onSubmit={trySubmit}
          />
        );
      case 3:
        return (
          <BirthDateInput
            value={birthDate}
            onChange={setBirthDate}
            onSubmit={trySubmit}
          />
        );
      case 4:
        return <GenderSelector onSelect={setGender} selectedGender={gender} />;
      case 5:
        return (
          <ProfileImageInput
            onImageSelect={setProfileImage}
            onImageChosen={setImageChosen}
          />
        );
      case 6:
        return (
          <VisitPurposeSelector
            onSelect={setVisitPurpose}
            selectedPurpose={visitPurpose}
          />
        );
      default:
        return null;
    }
  };

  const isPhoneValid = (value: string) => {
    if (!value) return false;
    return /^[0-9+\-\s()]+$/.test(value);
  };

  const isNicknameValid = (value: string) => {
    if (!value) return false;
    return /^[a-zA-Z0-9]+$/.test(value);
  };

  const isBirthDateValid = (date: {
    year: string;
    month: string;
    day: string;
  }) => {
    // Just check that all fields have values with correct length
    return (
      date.year.length === 4 && date.month.length >= 1 && date.day.length >= 1
    );
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 0:
        return !language;
      case 1:
        return !isPhoneValid(phone);
      case 2:
        return !isNicknameValid(nickname);
      case 3:
        return !isBirthDateValid(birthDate);
      case 4:
        return !gender;
      case 5:
        return !imageChosen;
      case 6:
        return !visitPurpose;
      default:
        return false;
    }
  };

  const isCenteredStep = currentStep === 5;

  return (
    <div className="flex flex-col items-center h-screen py-10 px-6 bg-white overflow-hidden">
      <div
        className={`flex-1 flex flex-col min-h-0 w-full max-w-md ${
          isCenteredStep ? "items-center" : "items-start"
        }`}
      >
        {/* Logo */}
        <div className="mb-6 shrink-0">
          <img src={smallLogo} alt="Logo" className="w-10 h-10" />
        </div>

        {/* Title */}
        <div
          className={`mb-6 shrink-0 ${
            isCenteredStep ? "text-center w-full" : "text-left"
          }`}
        >
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            {stepTexts[currentStep].split("\n").map((line, index) => (
              <span key={index}>
                {line}
                {index < stepTexts[currentStep].split("\n").length - 1 && (
                  <br />
                )}
              </span>
            ))}
          </h1>
        </div>

        {/* Menu - Scrollable */}
        <div className="w-full flex-1 min-h-0 overflow-y-auto">
          {renderMenu()}
        </div>
      </div>

      {/* Next Button */}
      <div className="pt-4 shrink-0 w-full max-w-md">
        <button
          onClick={handleNext}
          disabled={isNextDisabled()}
          className={`
            w-full py-4 px-6 text-lg font-semibold text-white bg-primary border-none rounded-2xl 
            cursor-pointer transition-all duration-200 shadow-primary
            ${
              isNextDisabled()
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-primary-dark active:scale-[0.98]"
            }
          `}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default OnboardingPage;
