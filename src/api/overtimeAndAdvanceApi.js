// File: overtimeAndAdvanceApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

// ---------------------------
// Admin: Record Overtime
// Expected payload:
// {
//   user_id: "<uuid>",
//   hours: 2.5,
//   amount: 1500,
//   remarks: "optional notes",
//   month: 11,    // optional
//   year: 2025    // optional
// }
export const recordOvertimeAdminApi = async (data) => {
  try {
    const response = await axiosInstance.post(Configs.apiAdminRecordOvertimeEp, data);
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response)
      return { ok: false, status: error.response.status, data: error.response.data };
    return { ok: false, status: null, data: { message: "network_or_unknown_error" } };
  }
};

// ---------------------------
// User: Get Overtime by Month
// Expected params: { month: 11, year: 2025 }
export const getUserOvertimeByMonthApi = async (data) => {
  try {
    const response = await axiosInstance.get(Configs.apiGetUserOvertimeByMonthEp, { params: data });
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response)
      return { ok: false, status: error.response.status, data: error.response.data };
    return { ok: false, status: null, data: { message: "network_or_unknown_error" } };
  }
};

// ---------------------------
// User: Get All Overtime
export const getAllUserOvertimeApi = async () => {
  try {
    const response = await axiosInstance.get(Configs.apiGetAllUserOvertimeEp);
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response)
      return { ok: false, status: error.response.status, data: error.response.data };
    return { ok: false, status: null, data: { message: "network_or_unknown_error" } };
  }
};

// ---------------------------
// Admin: Get Overtime by Month for any user
// Expected params: { user_id: "<uuid>", month: 11, year: 2025 }
export const getUserOvertimeByMonthAdminApi = async (data) => {
  try {
    const response = await axiosInstance.get(Configs.apiAdminGetUserOvertimeByMonthEp, {
      params: data,
    });
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response)
      return { ok: false, status: error.response.status, data: error.response.data };
    return { ok: false, status: null, data: { message: "network_or_unknown_error" } };
  }
};

// ---------------------------
// Admin: Get All Overtime for any user
// Expected params: { user_id: "<uuid>" }
export const getAllUserOvertimeAdminApi = async (data) => {
  try {
    const response = await axiosInstance.get(Configs.apiAdminGetAllUserOvertimeEp, {
      params: data,
    });
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response)
      return { ok: false, status: error.response.status, data: error.response.data };
    return { ok: false, status: null, data: { message: "network_or_unknown_error" } };
  }
};

// ---------------------------
// Admin: Create Advance Payment
// Expected payload:
// {
//   user_id: "<uuid>",
//   amount: 1200,
//   remarks: "optional notes",
//   month: 11,    // optional
//   year: 2025    // optional
// }
export const createAdvanceAdminApi = async (data) => {
  try {
    const response = await axiosInstance.post(Configs.apiAdminCreateAdvanceEp, data);
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response)
      return { ok: false, status: error.response.status, data: error.response.data };
    return { ok: false, status: null, data: { message: "network_or_unknown_error" } };
  }
};

// ---------------------------
// User: Get Advances by Month
// Expected params: { month: 11, year: 2025 }
export const getUserAdvancesByMonthApi = async (data) => {
  try {
    const response = await axiosInstance.get(Configs.apiGetUserAdvancesByMonthEp, { params: data });
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response)
      return { ok: false, status: error.response.status, data: error.response.data };
    return { ok: false, status: null, data: { message: "network_or_unknown_error" } };
  }
};

// ---------------------------
// User: Get All Advances
export const getAllUserAdvancesApi = async () => {
  try {
    const response = await axiosInstance.get(Configs.apiGetAllUserAdvancesEp);
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response)
      return { ok: false, status: error.response.status, data: error.response.data };
    return { ok: false, status: null, data: { message: "network_or_unknown_error" } };
  }
};

// ---------------------------
// Admin: Get Advances by Month for any user
// Expected params: { user_id: "<uuid>", month: 11, year: 2025 }
export const getUserAdvancesByMonthAdminApi = async (data) => {
  try {
    const response = await axiosInstance.get(Configs.apiAdminGetUserAdvancesByMonthEp, {
      params: data,
    });
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response)
      return { ok: false, status: error.response.status, data: error.response.data };
    return { ok: false, status: null, data: { message: "network_or_unknown_error" } };
  }
};

// ---------------------------
// Admin: Get All Advances for any user
// Expected params: { user_id: "<uuid>" }
export const getAllUserAdvancesAdminApi = async (data) => {
  try {
    const response = await axiosInstance.get(Configs.apiAdminGetAllUserAdvancesEp, {
      params: data,
    });
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response)
      return { ok: false, status: error.response.status, data: error.response.data };
    return { ok: false, status: null, data: { message: "network_or_unknown_error" } };
  }
};
