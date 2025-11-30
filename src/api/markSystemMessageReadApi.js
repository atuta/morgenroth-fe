import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const markSystemMessageReadApi = async (data) => {
  try {
    // data example: { message_id: 1, user_id: 1 }
    const response = await axiosInstance.post(Configs.apiMarkSystemMessageReadEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default markSystemMessageReadApi;
