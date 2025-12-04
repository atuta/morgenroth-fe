// File: uploadUserPhotoApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

const uploadUserPhotoApi = async (file) => {
  try {
    const formData = new FormData();
    formData.append("photo", file);

    const response = await axiosInstance.post(Configs.apiUploadUserPhotoEp, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export default uploadUserPhotoApi;
