import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const createSupportTicketApi = async (data) => {
  try {
    // data example: { subject: "Issue subject", description: "Issue description" }
    const response = await axiosInstance.post(Configs.apiCreateSupportTicketEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default createSupportTicketApi;
