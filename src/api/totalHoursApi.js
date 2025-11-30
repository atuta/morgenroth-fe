import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const totalHoursApi = async (data) => {
  try {
    // data example: { user_id: 1, date: "2025-11-30" }
    const response = await axiosInstance.post(Configs.apiTotalHoursEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default totalHoursApi;
