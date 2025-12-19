// File: setWorkingHoursApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const setWorkingHoursApi = async (data) => {
  try {
    /**
     * Expected data:
     * {
     *   day_of_week: number,   // 1–7
     *   user_role: string,    // 'admin', 'office', 'teaching', etc.
     *   start_time: "HH:MM",
     *   end_time: "HH:MM",
     *   timezone?: string
     * }
     */

    if (!data?.day_of_week || !data?.user_role || !data?.start_time || !data?.end_time) {
      throw new Error("Missing required working hours parameters");
    }

    const payload = {
      day_of_week: Number(data.day_of_week),
      user_role: data.user_role,
      start_time: data.start_time,
      end_time: data.end_time,
      timezone: data.timezone || "Africa/Nairobi",
    };

    const response = await axiosInstance.post(Configs.apiSetWorkingHoursEp, payload);

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

export default setWorkingHoursApi;
