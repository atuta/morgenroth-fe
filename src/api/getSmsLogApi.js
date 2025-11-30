import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const getSmsLogApi = async (params) => {
  try {
    // params example: { user_id: "123", start_date: "2025-01-01", end_date: "2025-01-31" }
    const response = await axiosInstance.get(Configs.apiGetSmsLogEp, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getSmsLogApi;
