import { ROUTES, ROLES } from "./routeConfig";

export const publicNavigation = [
  { label: "Home", path: ROUTES.HOME },
  { label: "About", path: ROUTES.ABOUT },
  { label: "Contact", path: ROUTES.CONTACT },
];

export const studentNavigation = [
  { label: "Dashboard", path: ROUTES.STUDENT, icon: "dashboard" },
  { label: "Available Exams", path: ROUTES.STUDENT_EXAMS, icon: "assignment" },
  { label: "My Attempts", path: ROUTES.STUDENT_ATTEMPTS, icon: "history" },
  { label: "My Results", path: ROUTES.STUDENT_RESULTS, icon: "analytics" },
  { label: "My Profile", path: ROUTES.STUDENT_PROFILE, icon: "person" },
];

export const employeeNavigation = [
  { label: "Dashboard", path: ROUTES.EMPLOYEE, icon: "dashboard" },
  { label: "Assigned Exams", path: ROUTES.EMPLOYEE_EXAMS, icon: "assignment" },
  { label: "Candidate Attempts", path: ROUTES.EMPLOYEE_ATTEMPTS, icon: "groups" },
  { label: "My Profile", path: ROUTES.EMPLOYEE_PROFILE, icon: "person" },
];

export const adminNavigation = [
  { label: "Dashboard", path: ROUTES.ADMIN, icon: "dashboard" },
  { label: "User Management", path: ROUTES.ADMIN_USERS, icon: "groups" },
  { label: "Exam Management", path: ROUTES.ADMIN_EXAMS, icon: "assignment" },
  { label: "Question Management", path: ROUTES.ADMIN_QUESTIONS, icon: "quiz" },
  { label: "Exam Scheduling", path: ROUTES.ADMIN_SCHEDULES, icon: "event" },
  { label: "Invitations", path: ROUTES.ADMIN_INVITATIONS, icon: "mail" },
  { label: "Live Monitoring", path: ROUTES.ADMIN_MONITORING, icon: "videocam" },
  { label: "Results", path: ROUTES.ADMIN_RESULTS, icon: "analytics" },
  { label: "Reports", path: ROUTES.ADMIN_REPORTS, icon: "assessment" },
  { label: "Notifications", path: ROUTES.ADMIN_NOTIFICATIONS, icon: "notifications" },
  { label: "Audit Logs", path: ROUTES.ADMIN_AUDIT_LOGS, icon: "history" },
  { label: "Settings", path: ROUTES.ADMIN_SETTINGS, icon: "settings" },
];

export const navigationByRole = {
  [ROLES.STUDENT]: studentNavigation,
  [ROLES.EMPLOYEE]: employeeNavigation,
  [ROLES.ADMIN]: adminNavigation,
};

export function getNavigationForRole(role) {
  return navigationByRole[role] ?? [];
}