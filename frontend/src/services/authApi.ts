const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

interface LoginResponse {
  access_token: string;
  token_type: string;
  is_new_user: boolean;
  user: {
    id: string;
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
    id: string;
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

    return response.json();
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

    return response.json();
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
