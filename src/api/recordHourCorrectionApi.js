// File: recordHourCorrectionApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const recordHourCorrectionApi = async ({ user_id, hours, reason, month, year }) => {
  try {
    if (!user_id) {
      throw new Error("user_id is required to record hour correction");
    }
    if (hours === undefined || hours === null) {
      throw new Error("hours is required to record hour correction");
    }
    if (!reason) {
      throw new Error("reason is required to record hour correction");
    }

    const payload = {
      user_id,
      hours: Number(hours),
      reason,
    };

    if (month !== undefined && month !== null) {
      payload.month = Number(month);
    }

    if (year !== undefined && year !== null) {
      payload.year = Number(year);
    }

    console.log("Payload before API call:", payload);

    const response = await axiosInstance.post(Configs.apiAdminRecordHourCorrectionEp, payload);
    return response.data;
  } catch (error) {
    console.error("recordHourCorrectionApi error:", error);
    throw error;
  }
};

export default recordHourCorrectionApi;
