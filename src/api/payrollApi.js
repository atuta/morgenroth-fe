// File: payrollApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

// ---------------------------
// User: Generate JSON Payslip
// Expected params: { month: 11, year: 2025 } (optional)
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

// ---------------------------
// User: Generate PDF Payslip
// Expected params: { month: 11, year: 2025 } (optional)
export const generateUserPayslipPdfApi = async (params = {}) => {
  try {
    const response = await axiosInstance.get(Configs.apiGenerateUserPayslipPdfEp, {
      params,
      responseType: "blob", // important for PDF download
    });
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response)
      return { ok: false, status: error.response.status, data: error.response.data };
    return { ok: false, status: null, data: { message: "network_or_unknown_error" } };
  }
};

// ---------------------------
// Admin: Generate JSON Payslip for any user
// Expected params: { user_id: "<uuid>", month: 11, year: 2025 }
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

// ---------------------------
// Admin: Generate PDF Payslip for any user
// Expected params: { user_id: "<uuid>", month: 11, year: 2025 }
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
