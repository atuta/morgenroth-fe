import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const generatePaymentReportApi = async (data) => {
  try {
    // data example: { month: "2025-11", year: 2025 }
    const response = await axiosInstance.post(Configs.apiGeneratePaymentReportEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default generatePaymentReportApi;
