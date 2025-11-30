import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const getUserAdvancesApi = async (params = {}) => {
  try {
    // Example params: { user_id: 1 }
    const response = await axiosInstance.get(Configs.apiGetUserAdvancesEp, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getUserAdvancesApi;
