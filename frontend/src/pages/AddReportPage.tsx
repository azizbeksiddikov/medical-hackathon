import { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  reportsApi,
  ExtractedReport,
  ReportType,
} from "../services/reportsApi";
import { ProcessingOverlay, ButtonLoading } from "../components/LoadingStates";

type Step = "upload" | "extract" | "translate";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ko", name: "Korean (한국어)" },
  { code: "zh", name: "Chinese (中文)" },
  { code: "ja", name: "Japanese (日本語)" },
  { code: "es", name: "Spanish (Español)" },
  { code: "vi", name: "Vietnamese (Tiếng Việt)" },
  { code: "th", name: "Thai (ไทย)" },
  { code: "ru", name: "Russian (Русский)" },
  { code: "ar", name: "Arabic (العربية)" },
  { code: "uz", name: "Uzbek (O'zbek)" },
];

const REPORT_TYPE_INFO: Record<
  ReportType,
  { titleEn: string; titleKr: string }
> = {
  prescription: { titleEn: "Prescription", titleKr: "처방전" },
  medical_certificate: { titleEn: "Medical Certificate", titleKr: "진단서" },
  examination_report: {
    titleEn: "Medical Examination Report",
    titleKr: "검진서",
  },
};

function AddReportPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get report type from URL, default to prescription (will be overridden by detection)
  const initialReportType =
    (searchParams.get("type") as ReportType) || "prescription";
  const [reportType, setReportType] = useState<ReportType>(initialReportType);
  const reportTypeInfo =
    REPORT_TYPE_INFO[reportType] || REPORT_TYPE_INFO.prescription;

  const [step, setStep] = useState<Step>("upload");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedReport | null>(
    null
  );
  const [editedText, setEditedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [showImageModal, setShowImageModal] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<
    "extract" | "translate" | "save" | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please drop an image file");
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleExtract = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setLoadingType("extract");
    setError(null);

    try {
      const data = await reportsApi.extractFromImage(selectedImage);
      console.log("Extraction response:", data);
      console.log("Image URL from server:", data.image_url);
      console.log("Local imagePreview:", imagePreview);
      setExtractedData(data);

      // Update report type if detected
      if (data.report_type) {
        console.log("Detected report type:", data.report_type);
        setReportType(data.report_type);
      }

      // Build text from extracted data
      let text = "";
      if (data.disease_name) text += `Disease: ${data.disease_name}\n`;
      if (data.disease_icd_code) text += `ICD Code: ${data.disease_icd_code}\n`;
      if (data.medicine_name) text += `Medicine: ${data.medicine_name}\n`;
      if (data.full_description)
        text += `\nDescription:\n${data.full_description}`;

      setEditedText(
        text.trim() || "No text could be extracted from the image."
      );
      setStep("extract");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to extract text from image"
      );
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  const handleTranslate = async () => {
    if (!editedText.trim()) {
      setError("Please enter text to translate");
      return;
    }

    setLoading(true);
    setLoadingType("translate");
    setError(null);

    try {
      const translated = await reportsApi.translateText(
        editedText,
        targetLanguage
      );
      setTranslatedText(translated);
      setStep("translate");
    } catch (err) {
      // If translation API is not available, show a message
      setError(
        "Translation service is not available yet. You can still save your report."
      );
      setTranslatedText("");
      setStep("translate");
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setLoadingType("save");
    setError(null);

    try {
      const token = localStorage.getItem("auth_token");
      if (token && extractedData) {
        await reportsApi.saveReport(
          {
            report_type: reportType,
            disease_name: extractedData.disease_name,
            disease_icd_code: extractedData.disease_icd_code,
            medicine_name: extractedData.medicine_name,
            full_description: editedText,
            translated_text: translatedText || null,
            original_language: "auto",
            target_language: targetLanguage,
            image_url: extractedData.image_url || undefined, // Include the server-stored image URL
          },
          token
        );
      }
      navigate("/reports");
    } catch (err) {
      // Even if save fails, navigate back
      console.log("Save API not available, navigating back");
      navigate("/reports");
    } finally {
      setLoading(false);
      setLoadingType(null);
    }
  };

  const handleBack = () => {
    if (step === "extract") {
      setStep("upload");
    } else if (step === "translate") {
      setStep("extract");
    } else {
      navigate("/reports");
    }
  };

  const getLoadingInfo = () => {
    switch (loadingType) {
      case "extract":
        return {
          title: "Analyzing Image",
          subtitle:
            "Using AI to extract medical information from your document",
        };
      case "translate":
        return {
          title: "Translating",
          subtitle: `Converting to ${
            LANGUAGES.find((l) => l.code === targetLanguage)?.name ||
            "selected language"
          }`,
        };
      case "save":
        return {
          title: "Saving Report",
          subtitle: "Securely storing your medical record",
        };
      default:
        return { title: "Processing", subtitle: "Please wait..." };
    }
  };

  return (
    <div style={styles.container}>
      {/* Processing Overlay */}
      {loading && loadingType && (
        <ProcessingOverlay
          title={getLoadingInfo().title}
          subtitle={getLoadingInfo().subtitle}
        />
      )}

      <div style={styles.header}>
        <button onClick={handleBack} style={styles.backButton}>
          ← Back
        </button>
        <h1 style={styles.title}>
          {step === "upload" && `Upload ${reportTypeInfo.titleEn}`}
          {step === "extract" && "Review & Edit"}
          {step === "translate" && "Translation"}
        </h1>
        <div style={styles.placeholder} />
      </div>

      {/* Progress indicator */}
      <div style={styles.progressContainer}>
        <div style={styles.progressStep}>
          <div
            style={{
              ...styles.progressDot,
              backgroundColor: step === "upload" ? "#4CAF50" : "#4CAF50",
            }}
          >
            {step !== "upload" ? "✓" : "1"}
          </div>
          <span style={styles.progressLabel}>Upload</span>
        </div>
        <div style={styles.progressLine} />
        <div style={styles.progressStep}>
          <div
            style={{
              ...styles.progressDot,
              backgroundColor:
                step === "extract"
                  ? "#4CAF50"
                  : step === "translate"
                  ? "#4CAF50"
                  : "#ddd",
              color: step === "upload" ? "#666" : "#fff",
            }}
          >
            {step === "translate" ? "✓" : "2"}
          </div>
          <span style={styles.progressLabel}>Extract</span>
        </div>
        <div style={styles.progressLine} />
        <div style={styles.progressStep}>
          <div
            style={{
              ...styles.progressDot,
              backgroundColor: step === "translate" ? "#4CAF50" : "#ddd",
              color: step === "translate" ? "#fff" : "#666",
            }}
          >
            3
          </div>
          <span style={styles.progressLabel}>Translate</span>
        </div>
      </div>

      {error && (
        <div style={styles.errorBanner}>
          <span>{error}</span>
          <button onClick={() => setError(null)} style={styles.errorClose}>
            ×
          </button>
        </div>
      )}

      {/* Step 1: Upload */}
      {step === "upload" && (
        <div style={styles.stepContent}>
          <div
            style={styles.uploadArea}
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {imagePreview ? (
              <div style={styles.previewContainer}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={styles.previewImage}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  style={styles.removeImageButton}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div style={styles.uploadPlaceholder}>
                <div style={styles.uploadIcon}>📷</div>
                <p style={styles.uploadText}>Click or drag to upload</p>
                <p style={styles.uploadSubtext}>
                  Upload your {reportTypeInfo.titleEn.toLowerCase()} image (
                  {reportTypeInfo.titleKr})
                </p>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: "none" }}
          />

          <button
            onClick={handleExtract}
            disabled={!selectedImage || loading}
            style={{
              ...styles.primaryButton,
              opacity: !selectedImage || loading ? 0.5 : 1,
            }}
          >
            {loading && loadingType === "extract" ? (
              <ButtonLoading text="Analyzing..." />
            ) : (
              "Extract Text"
            )}
          </button>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div
          style={styles.modalOverlay}
          onClick={() => {
            console.log("Modal overlay clicked - closing");
            setShowImageModal(false);
          }}
        >
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowImageModal(false)}
              style={styles.modalCloseButton}
            >
              ×
            </button>
            {extractedData?.image_url || imagePreview ? (
              <img
                src={imagePreview || extractedData?.image_url || ""}
                alt="Full size"
                style={styles.modalImage}
                onLoad={() => console.log("Image loaded successfully in modal")}
                onError={(e) => {
                  console.error("Image failed to load in modal");
                  console.error(
                    "Attempted URL:",
                    imagePreview || extractedData?.image_url
                  );
                }}
              />
            ) : (
              <div style={{ color: "#fff", padding: "20px", fontSize: "18px" }}>
                No image available
                <br />
                <small>imagePreview: {imagePreview ? "set" : "null"}</small>
                <br />
                <small>
                  extractedData?.image_url: {extractedData?.image_url || "null"}
                </small>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Extract & Edit */}
      {step === "extract" && (
        <div style={styles.stepContent}>
          {/* Report Type Selector */}
          <div style={styles.typeSelector}>
            <label style={styles.label}>Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as ReportType)}
              style={styles.typeSelect}
            >
              <option value="prescription">Prescription (처방전)</option>
              <option value="medical_certificate">
                Medical Certificate (진단서)
              </option>
              <option value="examination_report">
                Medical Examination Report (검진서)
              </option>
            </select>
            {extractedData?.report_type &&
              extractedData.report_type === reportType && (
                <span style={styles.detectedBadge}>✓ Auto-detected</span>
              )}
          </div>

          {/* View Image button */}
          {(extractedData?.image_url || imagePreview) && (
            <button
              onClick={() => {
                console.log("View Image clicked");
                console.log("imagePreview:", imagePreview);
                console.log(
                  "extractedData?.image_url:",
                  extractedData?.image_url
                );
                setShowImageModal(true);
              }}
              style={styles.viewImageButton}
            >
              🖼️ View Uploaded Image
            </button>
          )}

          {extractedData && (
            <div style={styles.extractedInfo}>
              {extractedData.disease_name && (
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Disease:</span>
                  <span style={styles.infoValue}>
                    {extractedData.disease_name}
                  </span>
                </div>
              )}
              {extractedData.disease_icd_code && (
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>ICD Code:</span>
                  <span style={styles.icdBadge}>
                    {extractedData.disease_icd_code}
                  </span>
                </div>
              )}
              {extractedData.medicine_name && (
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Medicine:</span>
                  <span style={styles.infoValue}>
                    {extractedData.medicine_name}
                  </span>
                </div>
              )}
            </div>
          )}

          <div style={styles.textAreaContainer}>
            <label style={styles.label}>Extracted Text (editable)</label>
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              style={styles.textArea}
              placeholder="Edit the extracted text here..."
              rows={10}
            />
          </div>

          <div style={styles.languageSelector}>
            <label style={styles.label}>Translate to</label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              style={styles.select}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleTranslate}
            disabled={loading || !editedText.trim()}
            style={{
              ...styles.primaryButton,
              opacity: loading || !editedText.trim() ? 0.5 : 1,
            }}
          >
            {loading && loadingType === "translate" ? (
              <ButtonLoading text="Translating..." />
            ) : (
              "Translate"
            )}
          </button>
        </div>
      )}

      {/* Step 3: Translation Result */}
      {step === "translate" && (
        <div style={styles.stepContent}>
          <div style={styles.translationComparison}>
            <div style={styles.textBlock}>
              <label style={styles.label}>Original Text</label>
              <div style={styles.textDisplay}>{editedText}</div>
            </div>

            <div style={styles.translationArrow}>→</div>

            <div style={styles.textBlock}>
              <label style={styles.label}>
                Translated (
                {LANGUAGES.find((l) => l.code === targetLanguage)?.name})
              </label>
              <div style={styles.textDisplay}>
                {translatedText || "Translation not available"}
              </div>
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button
              onClick={() => setStep("extract")}
              style={styles.secondaryButton}
            >
              Edit Text
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              style={styles.primaryButton}
            >
              {loading && loadingType === "save" ? (
                <ButtonLoading text="Saving..." />
              ) : (
                "Save Report"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "24px",
    maxWidth: "800px",
    margin: "0 auto",
    minHeight: "80vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  backButton: {
    background: "none",
    border: "none",
    fontSize: "1rem",
    color: "#333",
    cursor: "pointer",
    padding: "8px",
    fontWeight: "500",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#333",
    margin: 0,
  },
  placeholder: {
    width: "60px",
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "32px",
    gap: "8px",
  },
  progressStep: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  progressDot: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: "0.9rem",
  },
  progressLabel: {
    fontSize: "0.85rem",
    color: "#666",
  },
  progressLine: {
    width: "60px",
    height: "2px",
    backgroundColor: "#ddd",
    marginBottom: "24px",
  },
  errorBanner: {
    backgroundColor: "#fee",
    border: "1px solid #fcc",
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#c00",
  },
  errorClose: {
    background: "none",
    border: "none",
    fontSize: "1.2rem",
    cursor: "pointer",
    color: "#c00",
  },
  stepContent: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  uploadArea: {
    border: "2px dashed #ccc",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
    cursor: "pointer",
    backgroundColor: "#fafafa",
    transition: "all 0.2s ease",
    minHeight: "250px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadPlaceholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  uploadIcon: {
    fontSize: "3rem",
  },
  uploadText: {
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#333",
    margin: 0,
  },
  uploadSubtext: {
    fontSize: "0.9rem",
    color: "#666",
    margin: 0,
  },
  previewContainer: {
    position: "relative",
    width: "100%",
  },
  previewImage: {
    maxWidth: "100%",
    maxHeight: "300px",
    borderRadius: "8px",
    objectFit: "contain",
  },
  removeImageButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },
  viewImageButton: {
    backgroundColor: "#fff",
    color: "#4CAF50",
    padding: "12px 20px",
    borderRadius: "10px",
    border: "2px solid #4CAF50",
    fontSize: "1rem",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    width: "100%",
  },
  typeSelector: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "8px",
  },
  typeSelect: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "2px solid #4CAF50",
    fontSize: "1rem",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontWeight: "500",
    color: "#333",
  },
  detectedBadge: {
    fontSize: "0.85rem",
    color: "#4CAF50",
    fontWeight: "500",
    marginTop: "4px",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modalContent: {
    position: "relative",
    maxWidth: "90vw",
    maxHeight: "90vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: "12px",
    padding: "20px",
  },
  modalCloseButton: {
    position: "absolute",
    top: "-40px",
    right: "0",
    backgroundColor: "transparent",
    color: "#fff",
    border: "none",
    fontSize: "2rem",
    cursor: "pointer",
    padding: "8px",
    lineHeight: "1",
  },
  modalImage: {
    maxWidth: "100%",
    maxHeight: "85vh",
    borderRadius: "8px",
    objectFit: "contain",
  },
  extractedInfo: {
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  infoLabel: {
    fontWeight: "600",
    color: "#444",
    minWidth: "80px",
  },
  infoValue: {
    color: "#333",
  },
  icdBadge: {
    backgroundColor: "#e8f5e9",
    color: "#2E7D32",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  textAreaContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontWeight: "600",
    color: "#444",
    fontSize: "0.95rem",
  },
  textArea: {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    lineHeight: "1.6",
    resize: "vertical",
    fontFamily: "inherit",
    boxSizing: "border-box",
  },
  languageSelector: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  select: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
    color: "#ffffff",
    padding: "16px 32px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "600",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "8px",
  },
  secondaryButton: {
    backgroundColor: "#f5f5f5",
    color: "#333",
    padding: "16px 32px",
    borderRadius: "12px",
    border: "none",
    fontWeight: "600",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  translationComparison: {
    display: "flex",
    gap: "20px",
    alignItems: "stretch",
  },
  textBlock: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  textDisplay: {
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    padding: "16px",
    fontSize: "0.95rem",
    lineHeight: "1.6",
    color: "#333",
    minHeight: "200px",
    whiteSpace: "pre-wrap",
  },
  translationArrow: {
    display: "flex",
    alignItems: "center",
    fontSize: "1.5rem",
    color: "#888",
    paddingTop: "30px",
  },
  buttonGroup: {
    display: "flex",
    gap: "16px",
    marginTop: "16px",
  },
};

export default AddReportPage;
