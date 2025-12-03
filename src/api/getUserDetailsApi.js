// File: getUserDetailsApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const getUserDetailsApi = async (params) => {
  console.log("[getUserDetailsApi] Called with params:", params);

  try {
    const response = await axiosInstance.get(Configs.apiGetUserDetailsEp, { params });
    console.log("[getUserDetailsApi] Response data:", response.data);
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    if (error.response) {
      console.error(
        "[getUserDetailsApi] Error response:",
        error.response.status,
        error.response.data
      );
      return {
        data: error.response.data,
        status: error.response.status,
      };
    }
    console.error("[getUserDetailsApi] Network/other error:", error);
    throw error;
  }
};

export default getUserDetailsApi;
