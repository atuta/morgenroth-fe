// File: getWorkingHoursApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const getWorkingHoursApi = async (user_role, timezone = "Africa/Nairobi") => {
  try {
    if (!user_role) {
      throw new Error("user_role is required to fetch working hours");
    }

    const response = await axiosInstance.get(Configs.apiGetWorkingHoursEp, {
      params: {
        user_role,
        timezone,
      },
    });

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

export default getWorkingHoursApi;
