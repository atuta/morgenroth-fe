import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const userHasModulePermissionApi = async (data) => {
  try {
    // data example: { module: "attendance" }
    const response = await axiosInstance.post(Configs.apiUserHasModulePermissionEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default userHasModulePermissionApi;
