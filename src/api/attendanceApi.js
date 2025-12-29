// File: attendanceApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

// ---------------------------
// Detailed Grouped Report: Grouped by Daily Totals and Summary Cards
// Targets: path('api/attendance/report/detailed/')
// Expected params: { user_id: "<uuid>", start_date: "YYYY-MM-DD", end_date: "YYYY-MM-DD" }
export const getAttendanceDetailedReportApi = async (params) => {
  try {
    const response = await axiosInstance.get(Configs.apiAttendanceDetailedReportEp, { params });
    console.log("Detailed Report API Response:", response);
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response) {
      return { ok: false, status: error.response.status, data: error.response.data };
    }
    return { ok: false, status: null, data: { message: "network_or_unknown_error" } };
  }
};

// ---------------------------
// Combined: Get attendance history by date range
// Targets: path('api/attendance/history/range/')
// Expected params: { start_date: "YYYY-MM-DD", end_date: "YYYY-MM-DD", user_id: "<uuid> (optional)" }
export const getAttendanceHistoryRangeApi = async (params) => {
  try {
    const response = await axiosInstance.get(Configs.apiAttendanceHistoryRangeEp, { params });
    console.log("Range API Response:", response);
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response) {
      return { ok: false, status: error.response.status, data: error.response.data };
    }
    return { ok: false, status: null, data: { message: "network_or_unknown_error" } };
  }
};

// ---------------------------
// User: Get own attendance history
// Optional query params: { start_date: "YYYY-MM-DD", end_date: "YYYY-MM-DD" }
export const getUserAttendanceHistoryApi = async (params) => {
  try {
    const response = await axiosInstance.get(Configs.apiUserAttendanceHistoryEp, { params });
    console.log("API Response:", response);
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
