import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const getPaymentSummaryApi = async (data) => {
  try {
    // data example: { month: "11", year: 2025 }
    const response = await axiosInstance.post(Configs.apiGetPaymentSummaryEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default getPaymentSummaryApi;
