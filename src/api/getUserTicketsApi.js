import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const getUserTicketsApi = async () => {
  try {
    // Fetch all support tickets for the authenticated user
    const response = await axiosInstance.get(Configs.apiGetUserTicketsEp);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getUserTicketsApi;
