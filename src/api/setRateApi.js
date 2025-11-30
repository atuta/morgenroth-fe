import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const setRateApi = async (data) => {
  try {
    // data example: { rate_type: "hourly", value: 25.5 }
    const response = await axiosInstance.post(Configs.apiSetRateEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default setRateApi;
