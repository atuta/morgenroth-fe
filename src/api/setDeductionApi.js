import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const setDeductionApi = async (data) => {
  try {
    // data example: { user_id: 1, amount: 500, description: "Late fee" }
    const response = await axiosInstance.post(Configs.apiSetDeductionEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default setDeductionApi;
