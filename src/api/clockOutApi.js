import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const clockOutApi = async (data) => {
  try {
    // data example:
    // { notes: "Leaving early today", photo: "base64EncodedStringHere" }
    const response = await axiosInstance.post(Configs.apiClockOutEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default clockOutApi;
