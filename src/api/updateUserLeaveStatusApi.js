import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

/**
 * Update a user's leave status.
 * Converts boolean or string inputs to "yes" / "no" before sending.
 * @param {Object} data - The data to send.
 *   Example:
 *   {
 *     user_id: "uuid-of-user",
 *     is_on_leave: true  // or false, "yes", "no", "1", "0"
 *   }
 * @returns {Object} Response data from the API
 */
const updateUserLeaveStatusApi = async (data) => {
  try {
    let { is_on_leave } = data;

    if (typeof is_on_leave === "boolean") {
      is_on_leave = is_on_leave ? "yes" : "no";
    } else if (typeof is_on_leave === "string") {
      const lower = is_on_leave.toLowerCase();
      if (["true", "1", "yes"].includes(lower)) is_on_leave = "yes";
      else if (["false", "0", "no"].includes(lower)) is_on_leave = "no";
      else throw new Error("Invalid is_on_leave value, must be boolean or yes/no string");
    } else {
      throw new Error("Invalid is_on_leave type, must be boolean or string");
    }

    const response = await axiosInstance.post(Configs.apiUpdateUserLeaveStatusEp, {
      ...data,
      is_on_leave,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export default updateUserLeaveStatusApi;
