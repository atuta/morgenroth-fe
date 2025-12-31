// File: getAllUserNamesAndIdsApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

/**
 * Fetches all users with their full names and user IDs.
 * No params are required.
 */
const getAllUserNamesAndIdsApi = async () => {
  console.log("[getAllUserNamesAndIdsApi] Called");

  try {
    const response = await axiosInstance.get(Configs.apiGetUserFullnamesWithIdsEp);
    console.log("[getAllUserNamesAndIdsApi] Response data:", response.data);
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    if (error.response) {
      console.error(
        "[getAllUserNamesAndIdsApi] Error response:",
        error.response.status,
        error.response.data
      );
      return {
        data: error.response.data,
        status: error.response.status,
      };
    }
    console.error("[getAllUserNamesAndIdsApi] Network/other error:", error);
    throw error;
  }
};

export default getAllUserNamesAndIdsApi;
