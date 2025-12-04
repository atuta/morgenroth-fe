// File: getNonAdminUsersApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const getNonAdminUsersApi = async () => {
  try {
    const response = await axiosInstance.get(Configs.apiGetNonAdminUsersEp);

    console.log("apiGetNonAdminUsersEp Response: ", response);

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

export default getNonAdminUsersApi;
