import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const getDeductionApi = async (params) => {
  try {
    // params could be { user_id: 1, month: "2025-11" }
    const response = await axiosInstance.get(Configs.apiGetDeductionEp, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getDeductionApi;
