import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const lunchInApi = async (data) => {
  try {
    // data example: { user_id: 1, photo: "<base64-string>" }
    const response = await axiosInstance.post(Configs.apiLunchInEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default lunchInApi;
