import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const clockInApi = async (data) => {
  try {
    // data example:
    // { notes: "Arrived on time", photo: "base64EncodedStringHere" }
    const response = await axiosInstance.post(Configs.apiClockInEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default clockInApi;
