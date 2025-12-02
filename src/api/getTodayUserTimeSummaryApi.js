// File: getTodayUserTimeSummaryApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const getTodayUserTimeSummaryApi = async () => {
  try {
    const response = await axiosInstance.get(Configs.apiGetTodayUserTimeSummaryEp);
    console.log("Server response:", response.data);

    return {
      data: response.data,
      status: response.status, // HTTP status code
    };
  } catch (error) {
    // Capture the HTTP status code if available
    if (error.response) {
      return {
        data: error.response.data,
        status: error.response.status,
      };
    }
    throw error;
  }
};

export default getTodayUserTimeSummaryApi;
