import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

/**
 * Service to fetch the latest organization details.
 * Returns organization name, logo URL, and contact details.
 */
const getLatestOrganizationApi = async () => {
  try {
    const response = await axiosInstance.get(Configs.apiGetLatestOrganizationEp);
    // Returns the "data" object from our Django response
    return response.data;
  } catch (error) {
    // If 404 (No organization found), we can handle it or let the component catch it
    throw error;
  }
};

export default getLatestOrganizationApi;
