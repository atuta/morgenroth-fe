// File: getAllWorkingHoursApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const getAllWorkingHoursApi = async () => {
  console.log("[getAllWorkingHoursApi] Called");

  try {
    const response = await axiosInstance.get(Configs.apiGetAllWorkingHoursEp);
    console.log("[getAllWorkingHoursApi] Response data:", response.data);

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    if (error.response) {
      console.error(
        "[getAllWorkingHoursApi] Error response:",
        error.response.status,
        error.response.data
      );
      return {
        data: error.response.data,
        status: error.response.status,
      };
    }

    console.error("[getAllWorkingHoursApi] Network/other error:", error);
    throw error;
  }
};

export default getAllWorkingHoursApi;
