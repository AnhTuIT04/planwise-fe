import Axios, { AxiosInstance } from "axios";

import { baseApiURL } from "@/lib/constants";
import { getAccessToken } from "@/lib/utils";

const axiosInstance: AxiosInstance = Axios.create({
  baseURL: baseApiURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  async (response) => response,
  async (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400 && data?.code === "USER_BANNED") {
        // return Promise.reject(new AuthError(data?.message));
      }

      if (status === 401) {
        // Token hết hạn hoặc không hợp lệ
        // Xóa token và redirect về login
        // setAccessToken("");
        // // Chỉ redirect nếu không phải đang ở trang login
        // if (typeof window !== "undefined") {
        //   window.location.href = "/login";
        // }
        // return Promise.reject(new AuthError(data?.message || "Phiên đăng nhập đã hết hạn"));
      }

      if (status === 403) {
        // if (data?.errorCode === "IPNotAllowed") {
        //   return Promise.reject(new AuthError(data?.message));
        // } else {
        //   return Promise.reject(new PermissionError(data?.message));
        // }
      }
    }

    // fallback: lỗi khác
    return Promise.reject(error);
  },
);

export default axiosInstance;
