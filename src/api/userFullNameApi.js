import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const userFullNameApi = async () => {
  try {
    // No input data required; fetches full name of the logged-in user
    const response = await axiosInstance.get(Configs.apiUserFullNameEp);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default userFullNameApi;
