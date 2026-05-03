import Axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

import { apiURL } from "@/lib/consts";

const apiInstance: AxiosInstance = Axios.create({
  baseURL: apiURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000,
});

apiInstance.interceptors.request.use(
  async (config) => config,
  (error) => Promise.reject(error),
);

apiInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error.response?.data || error.message),
);


type SuccessResult<T> = readonly [T, null, string];
type ErrorResult<E> = readonly [null, E, string];
export type SafeExecResult<T, E = Error> = SuccessResult<T> | ErrorResult<E>;

export async function safeExec<T, E extends Error = Error>(
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

export interface CustomApi extends AxiosInstance {
  safeExec: typeof safeExec;
}

const api = Object.assign(apiInstance, { safeExec }) as CustomApi;
export default api;
