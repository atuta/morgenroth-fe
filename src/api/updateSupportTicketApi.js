import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const updateSupportTicketApi = async (data) => {
  try {
    // data example: { ticket_id: 1, status: "closed", resolved_at: "2025-12-01T12:00:00Z" }
    const response = await axiosInstance.post(Configs.apiUpdateSupportTicketEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default updateSupportTicketApi;
