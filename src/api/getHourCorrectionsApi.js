// File: getHourCorrectionsApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

/**
 * Fetch paginated hour corrections.
 *
 * @param {Object} options
 * @param {string} [options.user_id] - Optional user UUID to filter by user
 * @param {number} [options.month] - Optional month (1-12)
 * @param {number} [options.year] - Optional year (e.g., 2025)
 * @param {number} [options.page=1] - Page number for pagination
 * @param {number} [options.per_page=20] - Items per page
 */
const getHourCorrectionsApi = async ({ user_id, month, year, page = 1, per_page = 20 } = {}) => {
  try {
    const params = { user_id, month, year, page, per_page };

    // Remove undefined/null values from params
    Object.keys(params).forEach(
      (key) => (params[key] === undefined || params[key] === null) && delete params[key]
    );

    const response = await axiosInstance.get(Configs.apiGetHourCorrectionsEp, { params });

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    if (error.response) {
      return {
        data: error.response.data,
        status: error.response.status,
      };
    }
    throw error;
  }
};

export default getHourCorrectionsApi;
