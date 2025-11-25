import Axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosRequestConfig } from "axios";
import { toast } from "sonner";

import { apiBaseURL } from "@/lib/consts";

const apiInstance: AxiosInstance = Axios.create({
  baseURL: apiBaseURL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  withCredentials: true,
  timeout: 30000,
});



// let isRefreshing = false;

apiInstance.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    if (error.response) {
      const { status, config } = error.response;

      // Handle auth errors
      if (status === 401) {
        throw new Error("Unauthorized: Please log in to continue.");
      }
    }

    // Re-throw original error for other status codes
    throw error;
  },
);

// Define the SafeExecResult types
type SuccessResult<T> = readonly [T, null, string];
type ErrorResult<E = Error> = readonly [null, E, string];
type SafeExecResult<T, E = Error> = SuccessResult<T> | ErrorResult<E>;

// Safe execution function with method overloads
async function safeExec<T, E extends Error = Error>(
  config: AxiosRequestConfig,
  mapper: (data: any) => T = (data) => data as T,
): Promise<SafeExecResult<T, E>> {
  try {
    const response = await apiInstance.request(config);
    return [mapper(response.data), null, response.data?.message || "Operation completed successfully."] as const;
  } catch (error: any) {
    if (error.response) {
      const { status = 400, data } = error.response;
      const errorMessage = data?.message || `Request failed with status code ${status}`;
      return [null, new Error(errorMessage) as E, errorMessage] as const;
    }

    const errorMessage = error.message || "Network error: Please check your connection";
    return [null, new Error(errorMessage) as E, errorMessage] as const;
  }
}

// Extend the api object with safeExec
const api = Object.assign(apiInstance, { safeExec });
export default api;
