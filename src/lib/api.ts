import Axios, { AxiosInstance } from "axios";

import { apiBaseURL } from "@/lib/consts";
import { getCookie } from "./utils";
import { AuthError } from "@/types/error.type";

const api: AxiosInstance = Axios.create({
  baseURL: apiBaseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getCookie("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  async (error) => Promise.reject(error),
);

api.interceptors.response.use(
  async (response) => response,
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401 || status === 403) {
        throw new AuthError(data?.message || "Unauthorized", status);
      }
    }

    throw error;
  },
);

export default api;
