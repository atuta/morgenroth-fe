// File: getDeductionApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const getDeductionApi = async (params) => {
  try {
    const response = await axiosInstance.get(Configs.apiGetDeductionEp, { params });
    return {
      data: response.data,
      status: response.status,
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

export default getDeductionApi;
