// File: getLoggedInUserDetailsApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const getLoggedInUserDetailsApi = async () => {
  console.log("[getLoggedInUserDetailsApi] Called");

  try {
    const response = await axiosInstance.get(Configs.apiGetLoggedInUserDetailsEp);
    console.log("[getLoggedInUserDetailsApi] Response data:", response.data);
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    if (error.response) {
      console.error(
        "[getLoggedInUserDetailsApi] Error response:",
        error.response.status,
        error.response.data
      );
      return {
        data: error.response.data,
        status: error.response.status,
      };
    }
    console.error("[getLoggedInUserDetailsApi] Network/other error:", error);
    throw error;
  }
};

export default getLoggedInUserDetailsApi;
