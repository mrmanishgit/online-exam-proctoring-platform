import { Navigate, Route, Routes } from "react-router-dom";

import { ROUTES, ROLES, getDashboardPath } from "./routeConfig";
import useAuth from "../hooks/useAuth";

import ProtectedRoute from "../components/common/ProtectedRoute";
import RoleGuard from "../components/common/RoleGuard";

import PublicLayout from "../components/layout/PublicLayout";
import AuthLayout from "../components/layout/AuthLayout";
import StudentLayout from "../components/layout/StudentLayout";
import EmployeeLayout from "../components/layout/EmployeeLayout";
import AdminLayout from "../components/layout/AdminLayout";

import HomePage from "../pages/public/HomePage";
import AboutPage from "../pages/public/AboutPage";
import ContactPage from "../pages/public/ContactPage";
import PrivacyPolicyPage from "../pages/public/PrivacyPolicyPage";
import TermsPage from "../pages/public/TermsPage";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import VerifyEmailPage from "../pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import UnauthorizedPage from "../pages/auth/UnauthorizedPage";

import NotFoundPage from "../pages/errors/NotFoundPage";
import ServerErrorPage from "../pages/errors/ServerErrorPage";

import StudentDashboardPage from "../pages/student/StudentDashboardPage";
import AvailableExamsPage from "../pages/student/AvailableExamsPage";
import ExamDetailsPage from "../pages/student/ExamDetailsPage";
import ExamInstructionsPage from "../pages/student/ExamInstructionsPage";
import SystemCheckPage from "../pages/student/SystemCheckPage";
import AptitudeExamPage from "../pages/student/AptitudeExamPage";
import CodingExamPage from "../pages/student/CodingExamPage";
import ExamSubmissionPage from "../pages/student/ExamSubmissionPage";
import MyAttemptsPage from "../pages/student/MyAttemptsPage";
import MyResultsPage from "../pages/student/MyResultsPage";
import StudentProfilePage from "../pages/student/StudentProfilePage";

import EmployeeDashboardPage from "../pages/employee/EmployeeDashboardPage";
import AssignedExamsPage from "../pages/employee/AssignedExamsPage";
import EmployeeAttemptsPage from "../pages/employee/EmployeeAttemptsPage";
import EmployeeProfilePage from "../pages/employee/EmployeeProfilePage";

import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import UserManagementPage from "../pages/admin/UserManagementPage";
import CandidateDetailsPage from "../pages/admin/CandidateDetailsPage";
import ExamManagementPage from "../pages/admin/ExamManagementPage";
import CreateExamPage from "../pages/admin/CreateExamPage";
import EditExamPage from "../pages/admin/EditExamPage";
import QuestionManagementPage from "../pages/admin/QuestionManagementPage";
import QuestionImportPage from "../pages/admin/QuestionImportPage";
import ExamSchedulingPage from "../pages/admin/ExamSchedulingPage";
import ExamAssignmentsPage from "../pages/admin/ExamAssignmentsPage";
import InvitationsPage from "../pages/admin/InvitationsPage";
import LiveMonitoringPage from "../pages/admin/LiveMonitoringPage";
import ProctorReviewPage from "../pages/admin/ProctorReviewPage";
import ResultsManagementPage from "../pages/admin/ResultsManagementPage";
import ReportsPage from "../pages/admin/ReportsPage";
import NotificationsPage from "../pages/admin/NotificationsPage";
import AuditLogsPage from "../pages/admin/AuditLogsPage";
import SystemSettingsPage from "../pages/admin/SystemSettingsPage";

function LoginRedirect() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return null;

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <LoginPage />;
}

function RegisterRedirect() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return null;

  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <RegisterPage />;
}

function AccessDeniedRoute() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return null;

  if (isAuthenticated && user) {
    return <UnauthorizedPage />;
  }

  return <Navigate to={ROUTES.LOGIN} replace />;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public pages */}
      <Route element={<PublicLayout />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
        <Route path={ROUTES.CONTACT} element={<ContactPage />} />
        <Route path={ROUTES.PRIVACY} element={<PrivacyPolicyPage />} />
        <Route path={ROUTES.TERMS} element={<TermsPage />} />
      </Route>

      {/* Authentication pages */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginRedirect />} />
        <Route path={ROUTES.REGISTER} element={<RegisterRedirect />} />
        <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmailPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        <Route path={ROUTES.UNAUTHORIZED} element={<AccessDeniedRoute />} />
      </Route>

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        {/* Student */}
        <Route element={<RoleGuard allowedRoles={[ROLES.STUDENT]} />}>
          <Route element={<StudentLayout />}>
            <Route path={ROUTES.STUDENT} element={<StudentDashboardPage />} />
            <Route path={ROUTES.STUDENT_EXAMS} element={<AvailableExamsPage />} />
            <Route path="/student/exams/:examId" element={<ExamDetailsPage />} />
            <Route
              path="/student/exams/:examId/instructions"
              element={<ExamInstructionsPage />}
            />
            <Route path="/student/exams/:examId/system-check" element={<SystemCheckPage />} />
            <Route path="/student/exams/:examId/aptitude" element={<AptitudeExamPage />} />
            <Route path="/student/exams/:examId/coding" element={<CodingExamPage />} />
            <Route path="/student/exams/:examId/submission" element={<ExamSubmissionPage />} />
            <Route path={ROUTES.STUDENT_ATTEMPTS} element={<MyAttemptsPage />} />
            <Route path={ROUTES.STUDENT_RESULTS} element={<MyResultsPage />} />
            <Route path={ROUTES.STUDENT_PROFILE} element={<StudentProfilePage />} />
          </Route>
        </Route>

        {/* Employee / Examiner */}
        <Route element={<RoleGuard allowedRoles={[ROLES.EMPLOYEE]} />}>
          <Route element={<EmployeeLayout />}>
            <Route path={ROUTES.EMPLOYEE} element={<EmployeeDashboardPage />} />
            <Route path={ROUTES.EMPLOYEE_EXAMS} element={<AssignedExamsPage />} />
            <Route path={ROUTES.EMPLOYEE_ATTEMPTS} element={<EmployeeAttemptsPage />} />
            <Route path={ROUTES.EMPLOYEE_PROFILE} element={<EmployeeProfilePage />} />
          </Route>
        </Route>

        {/* Administrator */}
        <Route element={<RoleGuard allowedRoles={[ROLES.ADMIN]} />}>
          <Route element={<AdminLayout />}>
            <Route path={ROUTES.ADMIN} element={<AdminDashboardPage />} />
            <Route path={ROUTES.ADMIN_USERS} element={<UserManagementPage />} />
            <Route path="/admin/users/:userId" element={<CandidateDetailsPage />} />
            <Route path={ROUTES.ADMIN_EXAMS} element={<ExamManagementPage />} />
            <Route path={ROUTES.ADMIN_CREATE_EXAM} element={<CreateExamPage />} />
            <Route path="/admin/exams/:examId/edit" element={<EditExamPage />} />
            <Route path={ROUTES.ADMIN_QUESTIONS} element={<QuestionManagementPage />} />
            <Route path="/admin/questions/import" element={<QuestionImportPage />} />
            <Route path={ROUTES.ADMIN_SCHEDULES} element={<ExamSchedulingPage />} />
            <Route path="/admin/assignments" element={<ExamAssignmentsPage />} />
            <Route path={ROUTES.ADMIN_INVITATIONS} element={<InvitationsPage />} />
            <Route path={ROUTES.ADMIN_MONITORING} element={<LiveMonitoringPage />} />
            <Route path="/admin/proctor-review" element={<ProctorReviewPage />} />
            <Route path={ROUTES.ADMIN_RESULTS} element={<ResultsManagementPage />} />
            <Route path={ROUTES.ADMIN_REPORTS} element={<ReportsPage />} />
            <Route path={ROUTES.ADMIN_NOTIFICATIONS} element={<NotificationsPage />} />
            <Route path={ROUTES.ADMIN_AUDIT_LOGS} element={<AuditLogsPage />} />
            <Route path={ROUTES.ADMIN_SETTINGS} element={<SystemSettingsPage />} />
          </Route>
        </Route>
      </Route>

      {/* Error pages */}
      <Route path="/server-error" element={<ServerErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}