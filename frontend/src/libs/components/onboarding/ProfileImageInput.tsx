import { useState, useRef } from "react";
import imageInputPlaceholder from "../../../public/images/image_input.svg";
import defaultUserImage from "../../../public/images/default_user.svg";

interface ProfileImageInputProps {
  onImageSelect: (file: File | null) => void;
  onImageChosen?: (chosen: boolean) => void;
}

function ProfileImageInput({
  onImageSelect,
  onImageChosen,
}: ProfileImageInputProps) {
  const [preview, setPreview] = useState<string | null>(imageInputPlaceholder);
  const [showOptions, setShowOptions] = useState(false);
  const [hasChosenImage, setHasChosenImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const markAsChosen = () => {
    setHasChosenImage(true);
    onImageChosen?.(true);
  };

  const handleImageClick = () => {
    setShowOptions(true);
  };

  const handleSelectFromAlbum = () => {
    fileInputRef.current?.click();
    setShowOptions(false);
  };

  const handleSetDefault = () => {
    setPreview(defaultUserImage);
    markAsChosen();
    onImageSelect(null);
    setShowOptions(false);
  };

  const handleClose = () => {
    setShowOptions(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        markAsChosen();
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Profile Image Circle */}
      <button
        onClick={handleImageClick}
        className="w-36 h-36 rounded-full border-4 border-gray-200 bg-gray-50 cursor-pointer flex items-center justify-center overflow-hidden transition-all duration-200 p-0 hover:border-primary hover:scale-105"
      >
        <img
          src={preview || imageInputPlaceholder}
          alt="Profile preview"
          className="w-full h-full object-cover rounded-full"
        />
      </button>

      {hasChosenImage && (
        <p className="mt-4 text-sm text-gray-500 text-center">
          It's a picture that is visible to other users.
        </p>
      )}

      {/* Options Modal */}
      {showOptions && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
          onClick={handleClose}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-3xl p-6 pb-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleSelectFromAlbum}
              className="w-full py-4 px-5 text-base font-medium bg-gray-100 border-2 border-gray-200 rounded-2xl cursor-pointer text-center mb-3 transition-all duration-200 hover:bg-gray-200 hover:border-gray-300"
            >
              Select from the album
            </button>

            <button
              onClick={handleSetDefault}
              className="w-full py-4 px-5 text-base font-medium bg-gray-100 border-2 border-gray-200 rounded-2xl cursor-pointer text-center mb-3 transition-all duration-200 hover:bg-gray-200 hover:border-gray-300"
            >
              Set to default image
            </button>

            <button
              onClick={handleClose}
              className="w-full py-4 px-5 text-base font-medium bg-white border-2 border-gray-200 rounded-2xl cursor-pointer text-center text-gray-500 transition-all duration-200 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileImageInput;
