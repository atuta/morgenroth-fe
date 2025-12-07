// File: getAdminDashboardMetricsApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const getAdminDashboardMetricsApi = async (params = {}) => {
  try {
    // params example: { month: 12, year: 2025 }
    const response = await axiosInstance.get(Configs.apiAdminDashboardMetricsEp, { params });
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    if (error.response) {
      return {
        data: error.response.data,
        status: error.response.status,
      };
    }
    throw error;
  }
};

export default getAdminDashboardMetricsApi;
