export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    // Check if it's a fetch error with response info
    if (error.message.includes("Login failed:")) {
      const statusMatch = error.message.match(/(\d+)$/);
      return {
        message: error.message,
        status: statusMatch ? parseInt(statusMatch[1], 10) : undefined,
      };
    }

    return {
      message: error.message,
    };
  }

  if (typeof error === "string") {
    return {
      message: error,
    };
  }

  if (error && typeof error === "object" && "message" in error) {
    return {
      message: String((error as { message: unknown }).message),
      details: error,
    };
  }

  return {
    message: "An unexpected error occurred",
    details: error,
  };
}

export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError && error.message === "Failed to fetch") {
    return true;
  }
  return false;
}
