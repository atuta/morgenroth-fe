import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const getVerificationHistoryApi = async (data) => {
  try {
    // data example: { user_id: 1, date_range: ["2025-11-01", "2025-11-30"] }
    const response = await axiosInstance.get(Configs.apiGetVerificationHistoryEp, {
      params: data,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getVerificationHistoryApi;
