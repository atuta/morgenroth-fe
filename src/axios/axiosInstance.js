// File: axiosInstance.js
import axios from "axios";
import Configs from "../configs/Configs";

// Helper to redirect to login with hard reload
const redirectToLogin = () => {
  console.warn("Redirecting to login page...");
  window.location.href = "/authentication/sign-in";
};

const axiosInstance = axios.create({
  baseURL: Configs.baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

// --- Request interceptor ---
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

// --- Response interceptor ---
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

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    // If neither token exists, redirect immediately
    if (!accessToken && !refreshToken) {
      redirectToLogin();
      return Promise.reject(error);
    }

    // Handle 401 errors with token refresh
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

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
          redirectToLogin();
          return Promise.reject(refreshError);
        }
      } else {
        // Refresh token missing, redirect immediately
        redirectToLogin();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
