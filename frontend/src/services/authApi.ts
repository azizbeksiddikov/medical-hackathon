// Get the base URL and append /api for API calls
// Always use relative URLs when on HTTPS to prevent mixed content errors
// VERSION: 2024-01-15-fix-mixed-content-v3-FINAL
const API_CODE_VERSION = "v3-final-2024-01-15";

// Verify this is the new code (fail loudly if old code is cached)
if (typeof window !== "undefined") {
  console.log("✅ API Service Code Version:", API_CODE_VERSION);
  console.log("✅ Current URL:", window.location.href);
  console.log("✅ Current Protocol:", window.location.protocol);
  
  // Add a global flag to verify new code is loaded
  (window as any).__API_SERVICE_VERSION__ = API_CODE_VERSION;
  
  // Check after a delay to see if old code overwrote it
  setTimeout(() => {
    if ((window as any).__API_SERVICE_VERSION__ !== API_CODE_VERSION) {
      console.error("🚨 WARNING: Code version mismatch detected! Browser may be using cached code.");
    }
  }, 1000);
}

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

interface LoginResponse {
  access_token: string;
  token_type: string;
  is_new_user: boolean;
  user: {
    id: number;
    email: string;
    name: string;
    picture?: string;
  };
}

export interface OnboardingData {
  language: string;
  phone: string;
  nickname: string;
  birthDate: { year: string; month: string; day: string };
  gender: string;
  profileImage: File | null;
  visitPurpose: string;
}

interface RegisterResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    email: string;
    name: string;
    picture?: string;
  };
}

export const authApi = {
  async loginWithGoogle(credential: string): Promise<LoginResponse> {
    // ULTIMATE FIX: Completely bypass URL construction on HTTPS
    // This ensures we NEVER use HTTP URLs on HTTPS pages, regardless of cache
    let fullUrl: string;
    
    if (window.location.protocol === "https:") {
      // FORCE relative URL when on HTTPS - no exceptions
      fullUrl = "/api/auth/google";
      console.log("🔒 HTTPS DETECTED: Using forced relative URL:", fullUrl);
    } else {
      // Only use dynamic URL construction for HTTP/localhost
      const apiBaseUrl = getApiBaseUrlDynamic();
      fullUrl = `${apiBaseUrl}/auth/google`;
      console.log("🌐 HTTP/Localhost: Using dynamic URL:", fullUrl);
    }
    
    // Final safety check - should never trigger, but just in case
    if (window.location.protocol === "https:" && fullUrl.startsWith("http://")) {
      console.error("🚨 CRITICAL: HTTP URL on HTTPS page detected! Forcing relative URL.");
      fullUrl = "/api/auth/google";
    }
    
    console.log("🌐 API Request Details:");
    console.log("  - Code Version:", API_CODE_VERSION);
    console.log("  - Current Protocol:", window.location.protocol);
    console.log("  - Current Host:", window.location.hostname);
    console.log("  - Final URL:", fullUrl);
    console.log("  - Env Variable:", import.meta.env.VITE_API_BASE_URL);
    
    const response = await fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: credential }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Login failed: ${response.status}`);
    }

    const data = await response.json();
    // Ensure user.id is a number (backend returns int)
    if (data.user && typeof data.user.id === 'string') {
      data.user.id = parseInt(data.user.id, 10);
    }
    return data;
  },

  async registerWithGoogle(
    credential: string,
    onboardingData: OnboardingData
  ): Promise<RegisterResponse> {
    const formData = new FormData();
    formData.append("google_token", credential);
    formData.append("language", onboardingData.language);
    formData.append("phone", onboardingData.phone);
    formData.append("nickname", onboardingData.nickname);
    formData.append("birth_year", onboardingData.birthDate.year);
    formData.append("birth_month", onboardingData.birthDate.month);
    formData.append("birth_day", onboardingData.birthDate.day);
    formData.append("gender", onboardingData.gender);
    formData.append("visit_purpose", onboardingData.visitPurpose);
    
    if (onboardingData.profileImage) {
      formData.append("profile_image", onboardingData.profileImage);
    }

    const apiBaseUrl = getApiBaseUrlDynamic();
    const response = await fetch(`${apiBaseUrl}/auth/register`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Registration failed: ${response.status}`);
    }

    const data = await response.json();
    // Ensure user.id is a number (backend returns int)
    if (data.user && typeof data.user.id === 'string') {
      data.user.id = parseInt(data.user.id, 10);
    }
    return data;
  },

  async logout(token: string): Promise<void> {
    const apiBaseUrl = getApiBaseUrlDynamic();
    await fetch(`${apiBaseUrl}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getCurrentUser(token: string) {
    const apiBaseUrl = getApiBaseUrlDynamic();
    const response = await fetch(`${apiBaseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get current user");
    }

    return response.json();
  },
};
