// File: updateUserFieldsApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const updateUserFieldsApi = async ({ user_id, hourly_rate, nssf, sha }) => {
  try {
    if (!user_id) {
      throw new Error("user_id is required for updating user fields");
    }

    const payload = { user_id };

    if (hourly_rate !== undefined && hourly_rate !== "" && hourly_rate !== null) {
      const rate = Number(hourly_rate);
      if (!isNaN(rate)) {
        payload.hourly_rate = rate;
      }
    }

    if (nssf !== undefined && nssf !== null && nssf !== "") {
      payload.nssf = nssf;
    }

    if (sha !== undefined && sha !== null && sha !== "") {
      payload.sha = sha;
    }

    console.log("Payload before API call:", payload);

    const response = await axiosInstance.post(Configs.apiUpdateUserFieldsEp, payload);
    return response.data;
  } catch (error) {
    console.error("updateUserFieldsApi error:", error);
    throw error;
  }
};

export default updateUserFieldsApi;
