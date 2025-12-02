// File: setDeductionApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const setDeductionApi = async (name, percentage) => {
  try {
    const response = await axiosInstance.post(Configs.apiSetDeductionEp, {
      name,
      percentage,
    });

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

export default setDeductionApi;
