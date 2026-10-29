export const ROUTES = Object.freeze({
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  PRIVACY: "/privacy",
  TERMS: "/terms",

  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_EMAIL: "/verify-email",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  UNAUTHORIZED: "/unauthorized",

  STUDENT: "/student",
  STUDENT_EXAMS: "/student/exams",
  STUDENT_ATTEMPTS: "/student/attempts",
  STUDENT_RESULTS: "/student/results",
  STUDENT_PROFILE: "/student/profile",

  EMPLOYEE: "/employee",
  EMPLOYEE_EXAMS: "/employee/exams",
  EMPLOYEE_ATTEMPTS: "/employee/attempts",
  EMPLOYEE_PROFILE: "/employee/profile",

  ADMIN: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_EXAMS: "/admin/exams",
  ADMIN_CREATE_EXAM: "/admin/exams/create",
  ADMIN_QUESTIONS: "/admin/questions",
  ADMIN_SCHEDULES: "/admin/schedules",
  ADMIN_INVITATIONS: "/admin/invitations",
  ADMIN_MONITORING: "/admin/monitoring",
  ADMIN_RESULTS: "/admin/results",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_NOTIFICATIONS: "/admin/notifications",
  ADMIN_AUDIT_LOGS: "/admin/audit-logs",
  ADMIN_SETTINGS: "/admin/settings",

  NOT_FOUND: "*",
});

export const ROLES = Object.freeze({
  STUDENT: "STUDENT",
  EMPLOYEE: "EMPLOYEE",
  ADMIN: "ADMIN",
});

export function getDashboardPath(role) {
  switch (role) {
    case ROLES.STUDENT:
      return ROUTES.STUDENT;
    case ROLES.EMPLOYEE:
      return ROUTES.EMPLOYEE;
    case ROLES.ADMIN:
      return ROUTES.ADMIN;
    default:
      return ROUTES.LOGIN;
  }
}