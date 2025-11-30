import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const userHasPermissionApi = async (data) => {
  try {
    // data example: { perm: "can_clock_in" }
    const response = await axiosInstance.post(Configs.apiUserHasPermissionEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default userHasPermissionApi;
