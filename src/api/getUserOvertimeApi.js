import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const getUserOvertimeApi = async (params) => {
  try {
    // params example: { user_id: 1, start_date: "2025-11-01", end_date: "2025-11-30" }
    const response = await axiosInstance.get(Configs.apiGetUserOvertimeEp, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getUserOvertimeApi;
