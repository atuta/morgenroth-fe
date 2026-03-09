// File: advanceApi.js
import axiosInstance from "../axios/axiosInstance";
import Configs from "../configs/Configs";

// ---------------------------
// Get a single advance by ID
// Targets: path('api/advances/get/')
// Expected params: { advance_id: "<uuid>" }
export const getAdvanceByIdApi = async (params) => {
  try {
    const response = await axiosInstance.get(Configs.apiGetAdvanceByIdEp, { params });
    console.log("Get Advance By ID API Response:", response);

    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response) {
      return {
        ok: false,
        status: error.response.status,
        data: error.response.data,
      };
    }

    return {
      ok: false,
      status: null,
      data: { message: "network_or_unknown_error" },
    };
  }
};

// ---------------------------
// Update advance record
// Targets: path('api/advances/update/')
// Expected payload:
// {
//   advance_id: "<uuid>",
//   remarks?: "string",
//   day?: number,
//   month?: number,
//   year?: number
// }
export const updateAdvanceApi = async (payload) => {
  try {
    const response = await axiosInstance.post(Configs.apiUpdateAdvanceEp, payload);

    console.log("Update Advance API Response:", response);

    return { ok: true, status: response.status, data: response.data };
  } catch (error) {
    if (error.response) {
      return {
        ok: false,
        status: error.response.status,
        data: error.response.data,
      };
    }

    return {
      ok: false,
      status: null,
      data: { message: "network_or_unknown_error" },
    };
  }
};
