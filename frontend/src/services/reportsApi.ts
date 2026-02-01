// Get the base URL and append /api for API calls
// Always use relative URLs when on HTTPS to prevent mixed content errors
const getApiBaseUrl = () => {
  const currentHost = window.location.hostname;
  const currentProtocol = window.location.protocol;
  const isHttps = currentProtocol === "https:";
  
  // Local development - use explicit localhost URL
  if (
    currentHost === "localhost" ||
    currentHost === "127.0.0.1"
  ) {
    return "http://localhost:9090/api";
  }
  
  // CRITICAL: When on HTTPS, ALWAYS use relative URL to prevent mixed content errors
  // This ensures the browser uses the same protocol as the current page
  if (isHttps) {
    // Force relative URL - never use absolute URLs when on HTTPS
    return "/api";
  }
  
  // HTTP page - use env URL if set, otherwise relative
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && !envUrl.startsWith("http://152.42.238.178")) {
    // Only use env URL if it's not the problematic IP
    return `${envUrl}/api`;
  }
  
  // Default to relative URL
  return "/api";
};

// Compute API base URL dynamically to ensure it's always correct
const getApiBaseUrlDynamic = () => {
  const url = getApiBaseUrl();
  const currentProtocol = window.location.protocol;
  
  // CRITICAL SAFETY CHECK: Never allow HTTP URLs on HTTPS pages
  if (currentProtocol === "https:") {
    if (url.startsWith("http://")) {
      console.error("SECURITY BLOCK: Attempted to use HTTP URL on HTTPS page:", url);
      console.error("Forcing relative URL to prevent mixed content error");
      return "/api";
    }
    // Also ensure we're using relative URLs when on HTTPS
    if (!url.startsWith("/") && !url.startsWith("https://")) {
      console.warn("Non-standard URL format on HTTPS, using relative:", url);
      return "/api";
    }
  }
  
  return url;
};

export type ReportType =
  | "prescription"
  | "medical_certificate"
  | "examination_report";

export interface ExtractedReport {
  report_type: ReportType | null; // Detected report type from image analysis
  disease_name: string | null;
  disease_icd_code: string | null;
  medicine_name: string | null;
  full_description: string | null;
  image_url: string | null; // URL where the uploaded image is saved on server
}

export interface SavedReport {
  id: string;
  report_type: ReportType;
  disease_name: string | null;
  disease_icd_code: string | null;
  medicine_name: string | null;
  full_description: string | null;
  translated_text: string | null;
  original_language: string;
  target_language: string;
  created_at: string;
  image_url?: string;
}

export const reportsApi = {
  async extractFromImage(imageFile: File): Promise<ExtractedReport> {
    const formData = new FormData();
    formData.append("file", imageFile);
    const apiBaseUrl = getApiBaseUrlDynamic();

    const response = await fetch(`${apiBaseUrl}/extract-icd`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Extraction failed: ${response.status}`
      );
    }

    return response.json();
  },

  async translateText(text: string, targetLanguage: string): Promise<string> {
    const apiBaseUrl = getApiBaseUrlDynamic();
    const response = await fetch(`${apiBaseUrl}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, target_language: targetLanguage }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Translation failed: ${response.status}`
      );
    }

    const data = await response.json();
    return data.translated_text;
  },

  async saveReport(
    report: Omit<SavedReport, "id" | "created_at">,
    token: string
  ): Promise<SavedReport> {
    const apiBaseUrl = getApiBaseUrlDynamic();
    const response = await fetch(`${apiBaseUrl}/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(report),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Save failed: ${response.status}`);
    }

    return response.json();
  },

  async getReports(token: string): Promise<SavedReport[]> {
    const apiBaseUrl = getApiBaseUrlDynamic();
    const response = await fetch(`${apiBaseUrl}/reports`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Failed to fetch reports: ${response.status}`
      );
    }

    return response.json();
  },

  async getReport(id: string, token: string): Promise<SavedReport> {
    const apiBaseUrl = getApiBaseUrlDynamic();
    const response = await fetch(`${apiBaseUrl}/reports/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `Failed to fetch report: ${response.status}`
      );
    }

    return response.json();
  },

  async deleteReport(id: string, token: string): Promise<void> {
    const apiBaseUrl = getApiBaseUrlDynamic();
    const response = await fetch(`${apiBaseUrl}/reports/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Delete failed: ${response.status}`);
    }
  },
};
