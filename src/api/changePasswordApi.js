import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const changePasswordApi = async (data) => {
  try {
    // data example:
    // {
    //   old_password: "oldpass123",
    //   new_password: "newpass123"
    // }
    const response = await axiosInstance.post(Configs.apiChangePasswordEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default changePasswordApi;
