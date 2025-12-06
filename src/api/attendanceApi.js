// File: attendanceApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

// ---------------------------
// User: Get own attendance history
// Optional query params: { start_date: "YYYY-MM-DD", end_date: "YYYY-MM-DD" }
export const getUserAttendanceHistoryApi = async (params) => {
  try {
    const response = await axiosInstance.get(Configs.apiUserAttendanceHistoryEp, { params });
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response)
      return { ok: false, status: error.response.status, data: error.response.data };
    return { ok: false, status: null, data: { message: "network_or_unknown_error" } };
  }
};

// ---------------------------
// Admin: Get attendance history for any user
// Expected params: { user_id: "<uuid>", start_date: "YYYY-MM-DD", end_date: "YYYY-MM-DD" }
export const getUserAttendanceHistoryAdminApi = async (params) => {
  try {
    const response = await axiosInstance.get(Configs.apiAdminUserAttendanceHistoryEp, { params });
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response)
      return { ok: false, status: error.response.status, data: error.response.data };
    return { ok: false, status: null, data: { message: "network_or_unknown_error" } };
  }
};
