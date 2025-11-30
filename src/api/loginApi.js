import axios from "axios";
import Configs from "../configs/Configs";

const loginApi = async (data) => {
  try {
    const response = await axios.post(
      Configs.loginEp,
      {
        username: data.username, // our backend expects username not email
        password: data.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = response.data;

    if (result.status === "success" && result.data) {
      const { access, refresh } = result.data;

      // Save tokens, consistent with our axios interceptor
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
    }

    return result;
  } catch (error) {
    if (error.response) {
      // server returned an error
      return error.response.data;
    }

    // network/connection error
    return {
      status: "error",
      message: "network_error",
    };
  }
};

export default loginApi;
