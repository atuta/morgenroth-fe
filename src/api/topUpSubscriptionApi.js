import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const topUpSubscriptionApi = async (amount) => {
  try {
    // amount example: { days: 30 } to top up 30 days
    const response = await axiosInstance.post(Configs.apiTopUpSubscriptionEp, { days: amount });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default topUpSubscriptionApi;
