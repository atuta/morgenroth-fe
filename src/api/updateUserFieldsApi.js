// File: updateUserFieldsApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const updateUserFieldsApi = async ({ user_id, hourly_rate, nssf, sha, lunch_start, lunch_end }) => {
  try {
    if (!user_id) {
      throw new Error("user_id is required for updating user fields");
    }

    const payload = { user_id };

    // --- Hourly rate ---
    if (hourly_rate !== undefined && hourly_rate !== null && hourly_rate !== "") {
      const rate = Number(hourly_rate);
      if (!isNaN(rate)) {
        payload.hourly_rate = rate;
      }
    }

    // --- NSSF ---
    if (nssf !== undefined && nssf !== null && nssf !== "") {
      payload.nssf = nssf;
    }

    // --- SHA ---
    if (sha !== undefined && sha !== null && sha !== "") {
      payload.sha = sha;
    }

    // --- Lunch times (pass through; backend validates) ---
    if (lunch_start !== undefined && lunch_start !== null && lunch_start !== "") {
      payload.lunch_start = lunch_start;
    }

    if (lunch_end !== undefined && lunch_end !== null && lunch_end !== "") {
      payload.lunch_end = lunch_end;
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
