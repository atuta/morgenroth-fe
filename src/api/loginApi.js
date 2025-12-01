import axios from "axios";
import Configs from "../configs/Configs";

const loginApi = async ({ username, password }) => {
  try {
    const response = await axios.post(
      Configs.loginEp,
      {
        username, // backend expects username not email
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    const result = response.data;

    // Strictly validate token structure
    if (result?.status === "success" && result?.data?.access && result?.data?.refresh) {
      const { access, refresh } = result.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
    }

    return result;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }

    // A generic but clearer fallback (network issues, timeout, CORS, etc.)
    return {
      status: "error",
      message: "network_error",
    };
  }
};

export default loginApi;
