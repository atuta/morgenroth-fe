import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const getSystemSettingApi = async (data) => {
  try {
    // Example data: { key: "site_name" }
    const response = await axiosInstance.post(Configs.apiGetSystemSettingEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getSystemSettingApi;
