import axios from "axios";
import Configs from "../configs/Configs";

const axiosInstance = axios.create({
  baseURL: Configs.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    console.log("Axios Request:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });

    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
      console.log("Authorization header set with token:", accessToken);
    } else {
      console.warn("No accessToken found in localStorage!");
    }

    return config;
  },
  (error) => {
    console.error("Axios request error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Axios Response:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.error("Axios Response Error:", {
      url: originalRequest?.url,
      status: error.response?.status,
      data: error.response?.data,
    });

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      console.log("401 detected, trying token refresh...", { refreshToken });

      if (refreshToken) {
        try {
          const response = await axiosInstance.post(Configs.tokenRefreshEp, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          console.log("Token refreshed successfully:", access);

          localStorage.setItem("accessToken", access);
          originalRequest.headers["Authorization"] = `Bearer ${access}`;

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
