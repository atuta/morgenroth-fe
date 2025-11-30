import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const recordVerificationApi = async (data) => {
  try {
    // data example: { user_id: 1, status: "success", photo: "<base64_string>", reason: null }
    const response = await axiosInstance.post(Configs.apiRecordVerificationEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default recordVerificationApi;
