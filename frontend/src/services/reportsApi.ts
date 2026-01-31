const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export interface ExtractedReport {
  disease_name: string | null;
  disease_icd_code: string | null;
  medicine_name: string | null;
  full_description: string | null;
  image_url: string | null; // URL where the uploaded image is saved on server
}

export interface SavedReport {
  id: string;
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

    const response = await fetch(`${API_BASE_URL}/extract-icd`, {
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
    const response = await fetch(`${API_BASE_URL}/translate`, {
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
    const response = await fetch(`${API_BASE_URL}/reports`, {
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
    const response = await fetch(`${API_BASE_URL}/reports`, {
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
    const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
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
    const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
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
