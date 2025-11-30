import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const calculateNetSalaryApi = async (data) => {
  try {
    // data example: { salary_id: 123 }
    const response = await axiosInstance.post(Configs.apiCalculateNetSalaryEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default calculateNetSalaryApi;
