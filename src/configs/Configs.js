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
  apiAdminDashboardMetricsEp: `${BASE_URL}/api/admin-dashboard-metrics/`,
  apiUploadUserPhotoEp: `${BASE_URL}/api/upload-user-photo/`,
  apiUpdateUserHolidayStatusEp: `${BASE_URL}/api/update-user-holiday-status/`,
  apiUpdateUserLeaveStatusEp: `${BASE_URL}/api/update-user-leave-status/`,
  apiGetLoggedInUserDetailsEp: `${BASE_URL}/api/get-logged-in-user-details/`,
  apiGetUserDetailsEp: `${BASE_URL}/api/get-user-details/`,
  apiUpdateUserFieldsEp: `${BASE_URL}/api/update-user-fields/`,
  apiGetNonAdminUsersEp: `${BASE_URL}/api/get-non-admin-users/`,
  apiTopUpSubscriptionEp: `${BASE_URL}/api/top-up-subscription/`,
  apiUserFullNameEp: `${BASE_URL}/api/user-full-name/`,
  apiUserHasPermissionEp: `${BASE_URL}/api/user-has-permission/`,
  apiUserHasModulePermissionEp: `${BASE_URL}/api/user-has-module-permission/`,
  apiAddUserEp: `${BASE_URL}/api/add-user/`,
  apiChangePasswordEp: `${BASE_URL}/api/change-password/`,

  // Organization
  apiUpsertOrganizationEp: `${BASE_URL}/api/upsert-organization/`,
  apiGetLatestOrganizationEp: `${BASE_URL}/api/get-latest-organization/`,

  // Working hours
  apiGetAllWorkingHoursEp: `${BASE_URL}/api/get-all-working-hours/`,

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
  // New endpoints
  apiUserAttendanceHistoryEp: `${BASE_URL}/api/attendance/history/`,
  apiAdminUserAttendanceHistoryEp: `${BASE_URL}/api/attendance/admin/history/`,
  apiAttendanceHistoryRangeEp: `${BASE_URL}/api/attendance/history/range/`,
  apiAttendanceDetailedReportEp: `${BASE_URL}/api/attendance/report/detailed/`,
  apiAttendanceDetailedPdfEp: `${BASE_URL}/api/attendance/report/pdf/`,

  // Advance
  apiAdminCreateAdvanceEp: `${BASE_URL}/api/admin/advance/create/`,
  apiGetUserAdvancesByMonthEp: `${BASE_URL}/api/advance/get-by-month/`,
  apiGetAllUserAdvancesEp: `${BASE_URL}/api/advance/get-all/`,
  apiAdminGetUserAdvancesByMonthEp: `${BASE_URL}/api/admin/advance/get-by-month/`,
  apiAdminGetAllUserAdvancesEp: `${BASE_URL}/api/admin/advance/get-all/`,
  // New endpoints
  apiAllAdvancesEp: `${BASE_URL}/api/advances/all/`,
  apiUserAdvancesEp: `${BASE_URL}/api/advances/user/`,
  apiAdminUserAdvancesEp: `${BASE_URL}/api/advances/admin/user/`,

  // Overtime
  apiAdminRecordOvertimeEp: `${BASE_URL}/api/overtime/record/`,
  apiGetUserOvertimeByMonthEp: `${BASE_URL}/api/overtime/get-by-month/`,
  apiGetAllUserOvertimeEp: `${BASE_URL}/api/overtime/get-all/`,
  apiAdminGetUserOvertimeByMonthEp: `${BASE_URL}/api/admin/overtime/get-by-month/`,
  apiAdminGetAllUserOvertimeEp: `${BASE_URL}/api/admin/overtime/get-all/`,
  // New endpoints
  apiAllOvertimesEp: `${BASE_URL}/api/overtimes/all/`,
  apiUserOvertimesEp: `${BASE_URL}/api/overtimes/user/`,
  apiAdminUserOvertimesEp: `${BASE_URL}/api/overtimes/admin/user/`,

  // Deduction
  apiSetDeductionEp: `${BASE_URL}/api/set-deduction/`,
  apiGetDeductionEp: `${BASE_URL}/api/get-deduction/`,

  // Payroll
  apiGenerateUserPayslipEp: `${BASE_URL}/api/generate-user-payslip/`,
  apiGenerateUserPayslipPdfEp: `${BASE_URL}/api/generate-user-payslip-pdf/`,
  apiAdminGenerateUserPayslipEp: `${BASE_URL}/api/admin/generate-user-payslip/`,
  apiAdminGenerateUserPayslipPdfEp: `${BASE_URL}/api/admin/generate-user-payslip-pdf/`,
  apiAdminGeneratePayrollReportEp: `${BASE_URL}/api/admin/generate-payroll-report/`,
  apiAdminRecordHourCorrectionEp: `${BASE_URL}/api/admin/record-hour-correction/`,
  apiGetHourCorrectionsEp: `${BASE_URL}/api/hour-corrections/`,

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
