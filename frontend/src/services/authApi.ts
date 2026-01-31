// Use localhost for local development, otherwise use the configured URL
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  // If running on localhost, use local backend
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:9090/api';
  }
  // Ensure the URL ends with /api
  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
  }
  return "/api";
};

const API_BASE_URL = getApiBaseUrl();

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
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
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

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
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
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getCurrentUser(token: string) {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
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
