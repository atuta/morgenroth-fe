// const BASE_URL = "https://api.morgenroth-schulhaus.org";
// const BASE_WS_URL = "wss://api.morgenroth-schulhaus.org";

const BASE_URL = "http://127.0.0.1:8000";
const BASE_WS_URL = "ws://127.0.0.1:8000";

const Configs = {
  baseUrl: BASE_URL,
  baseWsUrl: BASE_WS_URL,

  // Auth
  tokenEp: `${BASE_URL}/api/token/`,
  tokenRefreshEp: `${BASE_URL}/api/token/refresh/`,
  tokenVerifyEp: `${BASE_URL}/api/token/verify/`,
  loginEp: `${BASE_URL}/api/login/`,

  // User
  apiGetUserDetailsEp: `${BASE_URL}/api/get-user-details/`,
  apiUpdateUserFieldsEp: `${BASE_URL}/api/update-user-fields/`,
  apiGetNonAdminUsersEp: `${BASE_URL}/api/get-non-admin-users/`,
  apiTopUpSubscriptionEp: `${BASE_URL}/api/top-up-subscription/`,
  apiUserFullNameEp: `${BASE_URL}/api/user-full-name/`,
  apiUserHasPermissionEp: `${BASE_URL}/api/user-has-permission/`,
  apiUserHasModulePermissionEp: `${BASE_URL}/api/user-has-module-permission/`,
  apiAddUserEp: `${BASE_URL}/api/add-user/`,
  apiChangePasswordEp: `${BASE_URL}/api/change-password/`,

  // Admin notice
  apiCreateAdminNoticeEp: `${BASE_URL}/api/create-admin-notice/`,
  apiGetAdminNoticesEp: `${BASE_URL}/api/get-admin-notices/`,
  apiUpdateAdminNoticeEp: `${BASE_URL}/api/update-admin-notice/`,
  apiDeleteAdminNoticeEp: `${BASE_URL}/api/delete-admin-notice/`,

  // Attendance
  apiClockInEp: `${BASE_URL}/api/clock-in/`,
  apiClockOutEp: `${BASE_URL}/api/clock-out/`,
  apiLunchInEp: `${BASE_URL}/api/lunch-in/`,
  apiLunchOutEp: `${BASE_URL}/api/lunch-out/`,
  apiTotalHoursEp: `${BASE_URL}/api/total-hours/`,
  apiGetTodayUserTimeSummaryEp: `${BASE_URL}/api/get-today-user-time-summary/`,
  apiCurrentSessionEp: `${BASE_URL}/api/attendance/current-session/`,

  // Advance
  apiCreateAdvanceEp: `${BASE_URL}/api/create-advance/`,
  apiGetUserAdvancesEp: `${BASE_URL}/api/get-user-advances/`,

  // Deduction
  apiSetDeductionEp: `${BASE_URL}/api/set-deduction/`,
  apiGetDeductionEp: `${BASE_URL}/api/get-deduction/`,

  // Overtime
  apiAuthorizeOvertimeEp: `${BASE_URL}/api/authorize-overtime/`,
  apiGetUserOvertimeEp: `${BASE_URL}/api/get-user-overtime/`,

  // Payroll
  apiGenerateMonthlySalaryEp: `${BASE_URL}/api/generate-monthly-salary/`,
  apiCalculateNetSalaryEp: `${BASE_URL}/api/calculate-net-salary/`,
  apiGenerateSalarySlipEp: `${BASE_URL}/api/generate-salary-slip/`,
  apiGetSalarySlipEp: `${BASE_URL}/api/get-salary-slip/`,
  apiGeneratePaymentReportEp: `${BASE_URL}/api/generate-payment-report/`,
  apiGetPaymentSummaryEp: `${BASE_URL}/api/get-payment-summary/`,

  // Rate
  apiSetRateEp: `${BASE_URL}/api/set-rate/`,
  apiGetRateEp: `${BASE_URL}/api/get-rate/`,

  // SMS
  apiSendSmsEp: `${BASE_URL}/api/send-sms/`,
  apiGetSmsLogEp: `${BASE_URL}/api/get-sms-log/`,

  // Support ticket
  apiCreateSupportTicketEp: `${BASE_URL}/api/create-support-ticket/`,
  apiUpdateSupportTicketEp: `${BASE_URL}/api/update-support-ticket/`,
  apiGetUserTicketsEp: `${BASE_URL}/api/get-user-tickets/`,

  // System message
  apiCreateSystemMessageEp: `${BASE_URL}/api/create-system-message/`,
  apiMarkSystemMessageReadEp: `${BASE_URL}/api/mark-system-message-read/`,

  // System setting
  apiGetWorkingHoursEp: `${BASE_URL}/api/get-working-hours/`,
  apiSetSystemSettingEp: `${BASE_URL}/api/set-system-setting/`,
  apiGetSystemSettingEp: `${BASE_URL}/api/get-system-setting/`,
  apiSetWorkingHoursEp: `${BASE_URL}/api/set-working-hours/`,

  // Manuals
  apiAddUserManualEp: `${BASE_URL}/api/add-user-manual/`,
  apiGetUserManualEp: `${BASE_URL}/api/get-user-manual/`,

  // Verification
  apiRecordVerificationEp: `${BASE_URL}/api/record-verification/`,
  apiGetVerificationHistoryEp: `${BASE_URL}/api/get-verification-history/`,
};

export default Configs;
