import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const getRateApi = async (params) => {
  try {
    // params example: { rate_type: "hourly" }
    const response = await axiosInstance.get(Configs.apiGetRateEp, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getRateApi;
