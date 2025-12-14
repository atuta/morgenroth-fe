import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

/**
 * Update a user's holiday status.
 * Converts boolean or string inputs to "yes" / "no" before sending.
 * @param {Object} data - The data to send.
 *   Example:
 *   {
 *     user_id: "uuid-of-user",
 *     is_on_holiday: true  // or false, "yes", "no", "1", "0"
 *   }
 * @returns {Object} Response data from the API
 */
const updateUserHolidayStatusApi = async (data) => {
  try {
    let { is_on_holiday } = data;

    if (typeof is_on_holiday === "boolean") {
      is_on_holiday = is_on_holiday ? "yes" : "no";
    } else if (typeof is_on_holiday === "string") {
      const lower = is_on_holiday.toLowerCase();
      if (["true", "1", "yes"].includes(lower)) is_on_holiday = "yes";
      else if (["false", "0", "no"].includes(lower)) is_on_holiday = "no";
      else throw new Error("Invalid is_on_holiday value, must be boolean or yes/no string");
    } else {
      throw new Error("Invalid is_on_holiday type, must be boolean or string");
    }

    const response = await axiosInstance.post(Configs.apiUpdateUserHolidayStatusEp, {
      ...data,
      is_on_holiday,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export default updateUserHolidayStatusApi;
