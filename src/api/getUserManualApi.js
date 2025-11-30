import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const getUserManualApi = async (params = {}) => {
  try {
    // Example params: { title: "Employee Guide" }
    const response = await axiosInstance.get(Configs.apiGetUserManualEp, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getUserManualApi;
