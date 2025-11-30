import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const sendSmsApi = async (data) => {
  try {
    // data example: { recipient_id: "user_id", message: "Hello" }
    const response = await axiosInstance.post(Configs.apiSendSmsEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default sendSmsApi;
