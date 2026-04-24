import Axios, { AxiosError, AxiosInstance } from "axios";

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

const api = apiInstance;
export default api;
