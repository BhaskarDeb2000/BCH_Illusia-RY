import { toast } from "sonner";

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    toast.error("Error", {
      description: error.message,
    });
    return;
  }

  if (error instanceof Error) {
    toast.error("Error", {
      description: error.message,
    });
    return;
  }

  toast.error("Error", {
    description: "An unexpected error occurred",
  });
}

export async function fetchWithError(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(input, init);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      error.message || "An error occurred",
      response.status,
      error.code
    );
  }

  return response;
}

export function createApiErrorHandler() {
  return (error: unknown) => {
    handleApiError(error);
  };
} 