import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const getAdminNoticesApi = async () => {
  try {
    // No payload required for this GET request
    const response = await axiosInstance.get(Configs.apiGetAdminNoticesEp);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getAdminNoticesApi;
