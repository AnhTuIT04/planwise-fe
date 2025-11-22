import Axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosRequestConfig } from "axios";

import { apiBaseURL } from "@/lib/consts";
import { AuthError } from "@/types/error.type";

// Cache the server detection result
const IS_SERVER = typeof window === "undefined";

const getServerCookie = async (): Promise<string | null> => {
  if (!IS_SERVER) return null;

  try {
    const { headers } = await import("next/headers");
    const headersList = await headers();
    return headersList.get("cookie");
  } catch {
    return null;
  }
};

const apiInstance: AxiosInstance = Axios.create({
  baseURL: apiBaseURL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
  withCredentials: true,
  timeout: 30000,
});

apiInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (IS_SERVER) {
      const cookie = await getServerCookie();
      if (cookie) {
        config.headers.set("Cookie", cookie);
      }
    }
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzMDcyNzJhYi01N2FmLTRkYzMtODhhMS0zM2YwZmIzZDg2MmUiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3NjM4MDM0NDIsImV4cCI6MTc2MzgwNzA0Mn0.oWjsTizceH5-9yD5yv2YjgoIElHB4CDj9kqFrRgOFSM";
    config.headers.Authorization =`Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

apiInstance.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle auth errors
      if (status === 401) {
        throw new AuthError(data.message, status);
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
    if (error instanceof AuthError) {
      return [null, error as unknown as E, error.message] as const;
    }

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
