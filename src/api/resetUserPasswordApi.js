import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const resetUserPasswordApi = async (data) => {
  try {
    // data example:
    // {
    //   user_id: "uuid-here"
    // }
    const response = await axiosInstance.post(Configs.apiResetUserPasswordEp, data);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export default resetUserPasswordApi;
