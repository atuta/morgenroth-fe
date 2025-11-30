import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const addUserManualApi = async (data) => {
  try {
    // data example:
    // { title: "Employee Handbook", file_path: someFileObject, description: "Complete handbook" }
    // OR
    // { title: "Quick Start Guide", url: "https://example.com/quick-start-guide.pdf", description: "Online guide" }
    const response = await axiosInstance.post(Configs.apiAddUserManualEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default addUserManualApi;
