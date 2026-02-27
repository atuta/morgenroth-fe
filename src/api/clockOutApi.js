import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const clockOutApi = async (data) => {
  try {
    // data example:
    // {
    //   timestamp: "2025-12-02T17:00:00Z",
    //   notes: "Leaving early today",
    //   photo_base64: "data:image/jpeg;base64,..."
    // }

    const response = await axiosInstance.post(Configs.apiClockOutEp, data);

    return {
      ok: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    if (error.response) {
      return {
        ok: false,
        status: error.response.status,
        data: error.response.data,
      };
    }

    return {
      ok: false,
      status: null,
      data: { message: "network_or_unknown_error" },
    };
  }
};

export default clockOutApi;
