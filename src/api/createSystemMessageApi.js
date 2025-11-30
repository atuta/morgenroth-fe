import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const createSystemMessageApi = async (data) => {
  try {
    // data example:
    // {
    //   recipient_id: 1,   // user ID of the recipient
    //   message: "Your password will expire in 3 days."
    // }
    const response = await axiosInstance.post(Configs.apiCreateSystemMessageEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default createSystemMessageApi;
