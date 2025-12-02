// File: getWorkingHoursApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const getWorkingHoursApi = async (timezone = "Africa/Nairobi") => {
  try {
    const response = await axiosInstance.get(Configs.apiGetWorkingHoursEp, {
      params: { timezone },
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
