// File: payrollAndCompensationApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

// ---------------------------
// ---------------------------
// PAYROLL ENDPOINTS
// ---------------------------

// User: Generate JSON Payslip
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
// ---------------------------
// OVERTIME ENDPOINTS
// ---------------------------

// Admin: Record Overtime
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

// User: Get Overtime by Month
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

// Admin: Get Overtime by Month for any user
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

// Admin: Get All Overtime for any user
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
// ---------------------------
// ADVANCE ENDPOINTS
// ---------------------------

// Admin: Create Advance Payment
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

// User: Get Advances by Month
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

// Admin: Get Advances by Month for any user
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

// Admin: Get All Advances for any user
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
