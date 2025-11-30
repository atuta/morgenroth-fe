import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const updateAdminNoticeApi = async (data) => {
  /**
   * data example:
   * {
   *   notice_id: "uuid-of-notice",
   *   title: "Updated title",
   *   content: "Updated content",
   *   recipients: [userId1, userId2], // optional
   *   is_active: true // optional
   * }
   */
  try {
    const response = await axiosInstance.post(Configs.apiUpdateAdminNoticeEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default updateAdminNoticeApi;
