// File: payrollAndCompensationApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

// ---------------------------
// PAYROLL ENDPOINTS
// ---------------------------

// User: Generate JSON Payslip
// params expected:
// {
//   user_id: number,
//   month: number (1-12),
//   year: number (YYYY)
// }
export const generateUserPayslipApi = async (params = {}) => {
  try {
    const response = await axiosInstance.get(Configs.apiGenerateUserPayslipEp, { params });
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response)
      return { ok: false, status: error.response.status, data: error.response.data };
    return { ok: false, status: null, data: { message: "network_or_unknown_error" } };
  }
};

// User: Generate PDF Payslip
// params expected:
// {
//   user_id: number,
//   month: number,
//   year: number
// }
export const generateUserPayslipPdfApi = async (params = {}) => {
  try {
    const response = await axiosInstance.get(Configs.apiGenerateUserPayslipPdfEp, {
      params,
      responseType: "blob",
    });
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response)
      return { ok: false, status: error.response.status, data: error.response.data };
    return { ok: false, status: null, data: { message: "network_or_unknown_error" } };
  }
};

// Admin: Generate JSON Payslip for any user
// params expected:
// {
//   user_id: number,
//   month: number,
//   year: number
// }
export const adminGenerateUserPayslipApi = async (params) => {
  try {
    const response = await axiosInstance.get(Configs.apiAdminGenerateUserPayslipEp, { params });
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response)
      return { ok: false, status: error.response.status, data: error.response.data };
    return { ok: false, status: null, data: { message: "network_or_unknown_error" } };
  }
};

// Admin: Generate PDF Payslip for any user
// params expected:
// {
//   user_id: number,
//   month: number,
//   year: number
// }
export const adminGenerateUserPayslipPdfApi = async (params) => {
  try {
    const response = await axiosInstance.get(Configs.apiAdminGenerateUserPayslipPdfEp, {
      params,
      responseType: "blob",
    });
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response)
      return { ok: false, status: error.response.status, data: error.response.data };
    return { ok: false, status: null, data: { message: "network_or_unknown_error" } };
  }
};

// ---------------------------
// OVERTIME ENDPOINTS
// ---------------------------

// Admin: Record Overtime
// data expected:
// {
//   user_id: number,
//   hours: number,
//   rate_per_hour?: number (optional, else system rate used),
//   month: number,
//   year: number,
//   notes?: string
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

// User: Get overtime by month
// data expected:
// {
//   month: number,
//   year: number
// }
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

// User: Get all overtime (no params)
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

// Admin: Get overtime by month for user
// data expected:
// {
//   user_id: number,
//   month: number,
//   year: number
// }
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

// Admin: Get all overtime for user
// data optional:
// { user_id?: number }
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
// ADVANCE PAYMENT ENDPOINTS
// ---------------------------

// Admin: Create salary advance
// data expected:
// {
//   user_id: number,
//   amount: number,
//   month: number,
//   year: number,
//   note?: string
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

// User: Get advances by month
// data expected:
// {
//   month: number,
//   year: number
// }
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

// User: Get all advances (no params)
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

// Admin: View advances by month for user
// data expected:
// {
//   user_id: number,
//   month: number,
//   year: number
// }
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

// Admin: Get all user advances
// data optional:
// { user_id?: number }
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
