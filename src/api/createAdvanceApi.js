import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const createAdvanceApi = async (data) => {
  try {
    // data example:
    // {
    //   user_id: 1,
    //   amount: 500.0,
    //   reason: "Medical expenses",
    //   date: "2025-11-30"
    // }
    const response = await axiosInstance.post(Configs.apiCreateAdvanceEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default createAdvanceApi;
