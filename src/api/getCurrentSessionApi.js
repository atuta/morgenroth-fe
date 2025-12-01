import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const getCurrentSessionApi = async () => {
  try {
    const response = await axiosInstance.get(Configs.apiCurrentSessionEp);

    return {
      data: response.data,
      status: response.status, // HTTP status code
    };
  } catch (error) {
    if (error.response) {
      return {
        data: error.response.data,
        status: error.response.status,
      };
    }
    throw error;
  }
};

export default getCurrentSessionApi;
