// File: payrollAndCompensationApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

/* ============================================================
   Shared helpers
============================================================ */

const parseBlobError = async (error) => {
  if (!error.response) {
    return { ok: false, status: null, data: { message: "network_or_unknown_error" } };
  }

  const { status, data } = error.response;

  if (data instanceof Blob) {
    try {
      const text = await data.text();
      return {
        ok: false,
        status,
        data: JSON.parse(text),
      };
    } catch {
      return {
        ok: false,
        status,
        data: { message: "invalid_blob_error_response" },
      };
    }
  }

  return { ok: false, status, data };
};

const safeRequest = async (requestFn, { isBlob = false } = {}) => {
  try {
    const response = await requestFn();
    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (isBlob) return await parseBlobError(error);

    if (error.response)
      return { ok: false, status: error.response.status, data: error.response.data };

    return { ok: false, status: null, data: { message: "network_or_unknown_error" } };
  }
};

/* ============================================================
   PAYROLL
============================================================ */

// User: Generate my PDF payslip
export const generateMyPayslipPdfApi = (params = {}) =>
  safeRequest(
    () =>
      axiosInstance.get(Configs.apiMyPayslipEp, {
        params,
        responseType: "blob",
      }),
    { isBlob: true }
  );

// Admin: Batch PDF payslips
export const adminGenerateBatchPayslipPdfApi = (data = {}) =>
  safeRequest(
    () =>
      axiosInstance.post(Configs.apiAdminPayslipEp, data, {
        responseType: "blob",
      }),
    { isBlob: true }
  );

// User: Generate JSON payslip
export const generateUserPayslipApi = (params = {}) =>
  safeRequest(() => axiosInstance.get(Configs.apiGenerateUserPayslipEp, { params }));

// User: Generate PDF payslip
export const generateUserPayslipPdfApi = (params = {}) =>
  safeRequest(
    () =>
      axiosInstance.get(Configs.apiGenerateUserPayslipPdfEp, {
        params,
        responseType: "blob",
      }),
    { isBlob: true }
  );

// Admin: Generate JSON payslip
export const adminGenerateUserPayslipApi = (params) =>
  safeRequest(() => axiosInstance.get(Configs.apiAdminGenerateUserPayslipEp, { params }));

// Admin: Generate PDF payslip
export const adminGenerateUserPayslipPdfApi = (params) =>
  safeRequest(
    () =>
      axiosInstance.get(Configs.apiAdminGenerateUserPayslipPdfEp, {
        params,
        responseType: "blob",
      }),
    { isBlob: true }
  );

/* ============================================================
   OVERTIME
============================================================ */

export const recordOvertimeAdminApi = (data) =>
  safeRequest(() => axiosInstance.post(Configs.apiAdminRecordOvertimeEp, data));

export const getUserOvertimeByMonthApi = (data) =>
  safeRequest(() => axiosInstance.get(Configs.apiGetUserOvertimeByMonthEp, { params: data }));

export const getAllUserOvertimeApi = () =>
  safeRequest(() => axiosInstance.get(Configs.apiGetAllUserOvertimeEp));

export const getUserOvertimeByMonthAdminApi = (data) =>
  safeRequest(() =>
    axiosInstance.get(Configs.apiAdminGetUserOvertimeByMonthEp, {
      params: data,
    })
  );

export const getAllUserOvertimeAdminApi = (data) =>
  safeRequest(() =>
    axiosInstance.get(Configs.apiAdminGetAllUserOvertimeEp, {
      params: data,
    })
  );

/* ============================================================
   ADVANCES
============================================================ */

export const createAdvanceAdminApi = (data) =>
  safeRequest(() => axiosInstance.post(Configs.apiAdminCreateAdvanceEp, data));

export const getUserAdvancesByMonthApi = (data) =>
  safeRequest(() => axiosInstance.get(Configs.apiGetUserAdvancesByMonthEp, { params: data }));

export const getAllUserAdvancesApi = () =>
  safeRequest(() => axiosInstance.get(Configs.apiGetAllUserAdvancesEp));

export const getUserAdvancesByMonthAdminApi = (data) =>
  safeRequest(() =>
    axiosInstance.get(Configs.apiAdminGetUserAdvancesByMonthEp, {
      params: data,
    })
  );

export const getAllUserAdvancesAdminApi = (data) =>
  safeRequest(() =>
    axiosInstance.get(Configs.apiAdminGetAllUserAdvancesEp, {
      params: data,
    })
  );
