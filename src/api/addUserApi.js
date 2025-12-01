import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const addUserApi = async (data) => {
  try {
    // data example:
    // {
    //   email: "john.doe@example.com",
    //   first_name: "John",
    //   last_name: "Doe",
    //   role: "staff",
    //   password: "changeme123",
    //   phone_number: "0712345678"
    // }
    const response = await axiosInstance.post(Configs.apiAddUserEp, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default addUserApi;
