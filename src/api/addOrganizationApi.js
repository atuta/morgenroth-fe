import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

/**
 * Service to add or update organization details.
 * Since this includes a logo (file), we use FormData.
 */
const addOrganizationApi = async (data) => {
  try {
    const formData = new FormData();

    // Append text fields
    if (data.name) formData.append("name", data.name);
    if (data.physical_address) formData.append("physical_address", data.physical_address);
    if (data.postal_address) formData.append("postal_address", data.postal_address);
    if (data.telephone) formData.append("telephone", data.telephone);
    if (data.email) formData.append("email", data.email);

    // Append the logo file if it exists
    if (data.logo) {
      formData.append("logo", data.logo);
    }

    // Send request using the formData object
    const response = await axiosInstance.post(Configs.apiUpsertOrganizationEp, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export default addOrganizationApi;
