import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const authorizeOvertimeApi = async (data) => {
  try {
    // data example: { user_id: 1, date: "2025-11-30", hours: 2, reason: "Project deadline" }
    const response = await axiosInstance.post(Configs.apiAuthorizeOvertimeEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default authorizeOvertimeApi;
