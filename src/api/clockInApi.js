import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const clockInApi = async (data) => {
  try {
    const response = await axiosInstance.post(Configs.apiClockInEp, data);

    return {
      ok: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    if (error.response) {
      // backend responded with error status
      return {
        ok: false,
        status: error.response.status,
        data: error.response.data,
      };
    }

    // network error or something bigger exploded
    return {
      ok: false,
      status: null,
      data: { message: "network_or_unknown_error" },
    };
  }
};

export default clockInApi;
