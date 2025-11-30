import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const setSystemSettingApi = async (data) => {
  try {
    // data example: { key: "site_name", value: "Morgenroth Portal", description: "The site title" }
    const response = await axiosInstance.post(Configs.apiSetSystemSettingEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default setSystemSettingApi;
