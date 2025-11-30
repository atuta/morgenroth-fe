import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const createAdminNoticeApi = async (data) => {
  try {
    // data example:
    // {
    //   title: "Maintenance Notice",
    //   content: "The system will be down for maintenance tonight.",
    //   recipients: [1, 2, 3], // optional, leave empty or omit for all users
    //   is_active: true
    // }
    const response = await axiosInstance.post(Configs.apiCreateAdminNoticeEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default createAdminNoticeApi;
