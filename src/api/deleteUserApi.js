import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

/**
 * Service to permanently delete a user and all related records.
 * @param {string} user_id - The UUID of the user to be deleted.
 */
const deleteUserApi = async (user_id) => {
  try {
    if (!user_id) {
      throw new Error("user_id is required for the deletion request");
    }

    // Following your pattern of sending the ID in the request body
    const payload = { user_id };

    const response = await axiosInstance.post(Configs.apiDeleteUserEp, payload);

    return response.data;
  } catch (error) {
    // Re-throwing the error so the calling component can handle alerts
    console.error("deleteUserApi error:", error);
    throw error;
  }
};

export default deleteUserApi;
