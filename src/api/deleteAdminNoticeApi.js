import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const deleteAdminNoticeApi = async (data) => {
  try {
    // data example:
    // {
    //   notice_id: "uuid-of-the-notice-to-delete"
    // }
    const response = await axiosInstance.post(Configs.apiDeleteAdminNoticeEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default deleteAdminNoticeApi;
