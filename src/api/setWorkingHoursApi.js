// File: setWorkingHoursApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const setWorkingHoursApi = async (data) => {
  try {
    // data example:
    // {
    //   day_of_week: "Monday",
    //   start_time: "08:00",
    //   end_time: "17:00",
    //   timezone: "Africa/Nairobi"
    // }
    const response = await axiosInstance.post(Configs.apiSetWorkingHoursEp, data);

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
    throw error; // Let the caller handle network errors
  }
};

export default setWorkingHoursApi;
