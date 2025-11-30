import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const generateMonthlySalaryApi = async (data) => {
  try {
    // data example: { month: "2025-11", user_id: 1 }
    const response = await axiosInstance.post(Configs.apiGenerateMonthlySalaryEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default generateMonthlySalaryApi;
