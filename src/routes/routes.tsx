import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleRoute'
import { HomeRedirect } from './HomeRedirect'
import { ROUTES } from '@/lib/constants/routes'
import { PERMISSIONS } from '@/lib/constants/permissions'

import Login from '@/pages/auth/Login'
import ForgotPassword from '@/pages/auth/ForgotPassword'
import Dashboard from '@/pages/dashboard/Dashboard'
import HRMSDashboard from '@/pages/hrms/HRMSDashboard'
import Employees from '@/pages/hrms/employees/Employees'
import EmployeeDetails from '@/pages/hrms/employees/EmployeeDetails'
import AddEmployee from '@/pages/hrms/employees/AddEmployee'
import EditEmployee from '@/pages/hrms/employees/EditEmployee'
import AttendanceDashboard from '@/pages/hrms/attendance/AttendanceDashboard'
import MyAttendance from '@/pages/hrms/attendance/MyAttendance'
import DailyAttendance from '@/pages/hrms/attendance/DailyAttendance'
import AttendanceCalendarPage from '@/pages/hrms/attendance/AttendanceCalendarPage'
import AttendanceCorrections from '@/pages/hrms/attendance/AttendanceCorrections'
import ShiftManagement from '@/pages/hrms/attendance/ShiftManagement'
import OvertimePage from '@/pages/hrms/attendance/OvertimePage'
import HolidayManagement from '@/pages/hrms/attendance/HolidayManagement'
import AttendanceReports from '@/pages/hrms/attendance/AttendanceReports'
import AttendanceSettings from '@/pages/hrms/attendance/AttendanceSettings'
import Leave from '@/pages/hrms/leave/Leave'
import Payroll from '@/pages/hrms/payroll/Payroll'
import Payslip from '@/pages/hrms/payroll/payslip'
import PayrollProcessing from '@/pages/hrms/payroll/payrollprocessing'
import Recruitment from '@/pages/hrms/recruitment/Recruitment'
import Performance from '@/pages/hrms/performance/Performance'
import Goals from '@/pages/hrms/performance/Goals'
import KPIs from '@/pages/hrms/performance/KPIs'
import Appraisal from '@/pages/hrms/performance/Appraisal'
import Feedback from '@/pages/hrms/performance/Feedback'
import HRMSDocuments from '@/pages/hrms/documents/Documents'
import HRMSReports from '@/pages/hrms/reports/Reports'
import JobRequisition from '@/pages/hrms/recruitment/JobRequisition'
import JobPosting from '@/pages/hrms/recruitment/JobPosting'
import CandidateApplication from '@/pages/hrms/recruitment/CandidateApplication'
import Screening from '@/pages/hrms/recruitment/Screening'
import Shortlist from '@/pages/hrms/recruitment/Shortlist'
import InterviewSchedule from '@/pages/hrms/recruitment/InterviewSchedule'
import Evaluation from '@/pages/hrms/recruitment/Evaluation'
import OfferGeneration from '@/pages/hrms/recruitment/OfferGeneration'
import Selection from '@/pages/hrms/recruitment/Selection'
import OfferAccepted from '@/pages/hrms/recruitment/OfferAccepted'
import RequisitionApproval from '@/pages/hrms/recruitment/RequisitionApproval'
import OnboardingDashboard from '@/pages/hrms/onboarding/OnboardingDashboard'
import OnboardingEmployees from '@/pages/hrms/onboarding/Employees'
//import OnboardingEmployeeProfile from '@/pages/hrms/onboarding/EmployeeProfile'
import DocumentCollection from '@/pages/hrms/onboarding/DocumentCollection'
import DocumentVerification from '@/pages/hrms/onboarding/DocumentVerification'
import BackgroundVerification from '@/pages/hrms/onboarding/BackgroundVerification'
import Orientation from '@/pages/hrms/onboarding/Orientation'
import PolicyAcceptance from '@/pages/hrms/onboarding/PolicyAcceptance'
import SystemAccess from '@/pages/hrms/onboarding/SystemAccess'
import ITTasks from '@/pages/hrms/onboarding/ITTasks'
import AssetAllocation from '@/pages/hrms/onboarding/AssetAllocation'
import ManagerTasks from '@/pages/hrms/onboarding/ManagerTasks'
import HRTasks from '@/pages/hrms/onboarding/HRTasks'
import EmployeeActive from '@/pages/hrms/onboarding/EmployeeActive'
import NewRequisition from '@/pages/hrms/recruitment/NewRequisition'
import AppliedCandidates from '@/pages/hrms/recruitment/AppliedCandidates'
import  EmployeeProfile from '@/pages/hrms/onboarding/EmployeeProfile'
import ApplyLeave from '@/pages/hrms/leave/ApplyLeave'
import MyLeaveRequests from '@/pages/hrms/leave/MyLeaveRequests'
import LeaveDetails from '@/pages/hrms/leave/LeaveDetails'
import LeaveApprovals from '@/pages/hrms/leave/LeaveApprovals'
import LeaveTypes from '@/pages/hrms/leave/LeaveTypes'
import AddLeaveType from '@/pages/hrms/leave/AddLeaveType'
import EditLeaveType from '@/pages/hrms/leave/EditLeaveType'
import UserManagement from '@/pages/settings/UserManagement'
import ScreenPrivileges from '@/pages/settings/ScreenPrivileges'

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    element: <ForgotPassword />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <HomeRedirect />,
      },
      {
        path: 'dashboard',
        element: (
          <RoleRoute permission={PERMISSIONS.DASHBOARD.VIEW}>
            <Dashboard />
          </RoleRoute>
        ),
      },

      {
        path: 'hrms',
        element: (
          <RoleRoute permission={PERMISSIONS.HRMS.DASHBOARD_VIEW}>
            <HRMSDashboard />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/employees',
        element: (
          <RoleRoute permission={PERMISSIONS.EMPLOYEES.VIEW}>
            <Employees />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/employees/new',
        element: (
          <RoleRoute permission={PERMISSIONS.EMPLOYEES.CREATE}>
            <AddEmployee />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/employees/:id',
        element: (
          <RoleRoute permission={PERMISSIONS.EMPLOYEES.VIEW}>
            <EmployeeDetails />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/employees/:id/edit',
        element: (
          <RoleRoute permission={PERMISSIONS.EMPLOYEES.UPDATE}>
            <EditEmployee />
          </RoleRoute>
        ),
      },

      {
        path: 'hrms/attendance',
        element: (
          <RoleRoute permission={PERMISSIONS.ATTENDANCE.DASHBOARD_VIEW}>
            <AttendanceDashboard />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/attendance/my',
        element: (
          <RoleRoute permission={PERMISSIONS.ATTENDANCE.MY_VIEW}>
            <MyAttendance />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/attendance/daily',
        element: (
          <RoleRoute permission={PERMISSIONS.ATTENDANCE.DAILY_VIEW}>
            <DailyAttendance />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/attendance/calendar',
        element: (
          <RoleRoute permission={PERMISSIONS.ATTENDANCE.MY_VIEW}>
            <AttendanceCalendarPage />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/attendance/corrections',
        element: (
          <RoleRoute permission={PERMISSIONS.ATTENDANCE.CORRECTIONS_MANAGE}>
            <AttendanceCorrections />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/attendance/shifts',
        element: (
          <RoleRoute permission={PERMISSIONS.ATTENDANCE.SHIFTS_MANAGE}>
            <ShiftManagement />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/attendance/overtime',
        element: (
          <RoleRoute permission={PERMISSIONS.ATTENDANCE.OVERTIME_VIEW}>
            <OvertimePage />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/attendance/holidays',
        element: (
          <RoleRoute permission={PERMISSIONS.ATTENDANCE.HOLIDAYS_MANAGE}>
            <HolidayManagement />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/attendance/reports',
        element: (
          <RoleRoute permission={PERMISSIONS.ATTENDANCE.REPORTS_VIEW}>
            <AttendanceReports />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/attendance/settings',
        element: (
          <RoleRoute permission={PERMISSIONS.ATTENDANCE.SETTINGS_MANAGE}>
            <AttendanceSettings />
          </RoleRoute>
        ),
      },

      { path: 'hrms/leave', element: <Leave /> },
      { path: 'hrms/leave/apply', element: <ApplyLeave /> },
      { path: 'hrms/leave/my', element: <MyLeaveRequests /> },
      { path: 'hrms/leave/approvals', element: <LeaveApprovals /> },
      { path: 'hrms/leave/types', element: <LeaveTypes /> },
      { path: 'hrms/leave/types/new', element: <AddLeaveType />,},
      { path: 'hrms/leave/types/:id/edit', element: <EditLeaveType />, },
      { path: 'hrms/leave/:id', element: <LeaveDetails /> },
      

      { path: 'hrms/payroll', element: <Payroll /> },
      { path: 'hrms/recruitment', element: <Recruitment /> },
      { path: 'hrms/recruitment/requisitions', element: <JobRequisition /> },
      { path: 'hrms/recruitment/requisitions/new', element: <NewRequisition /> },
      { path: 'hrms/recruitment/postings', element: <JobPosting /> },
      { path: 'hrms/recruitment/candidates', element: <CandidateApplication /> },
      { path: 'hrms/recruitment/candidates/:id', element: <CandidateApplication /> },
      { path: 'hrms/recruitment/screening', element: <Screening /> },
      { path: 'hrms/recruitment/shortlist', element: <Shortlist /> },
      { path: 'hrms/recruitment/interviews', element: <InterviewSchedule /> },
      { path: 'hrms/recruitment/evaluation', element: <Evaluation /> },
      { path: 'hrms/recruitment/selection', element: <Selection /> },
      { path: 'hrms/recruitment/offers', element: <OfferGeneration /> },
      { path: 'hrms/recruitment/offers/accepted', element: <OfferAccepted /> },
      { path: 'hrms/recruitment/approvals', element: <RequisitionApproval /> },
      { path: 'hrms/recruitment/applied', element: <AppliedCandidates /> },

      { path: 'hrms/onboarding', element: <OnboardingDashboard /> },
      { path: 'hrms/onboarding/employees', element: <OnboardingEmployees /> },
      { path: 'hrms/onboarding/employees/:id', element: <EmployeeProfile /> },
      { path: 'hrms/onboarding/documents', element: <DocumentCollection /> },
      { path: 'hrms/onboarding/documents/verify', element: <DocumentVerification /> },
      { path: 'hrms/onboarding/background', element: <BackgroundVerification /> },
      { path: 'hrms/onboarding/orientation', element: <Orientation /> },
      { path: 'hrms/onboarding/policies', element: <PolicyAcceptance /> },
      { path: 'hrms/onboarding/access', element: <SystemAccess /> },
      { path: 'hrms/onboarding/it', element: <ITTasks /> },
      { path: 'hrms/onboarding/assets', element: <AssetAllocation /> },
      { path: 'hrms/onboarding/manager', element: <ManagerTasks /> },
      { path: 'hrms/onboarding/hr', element: <HRTasks /> },
      { path: 'hrms/onboarding/active', element: <EmployeeActive /> },

      { path: 'hrms/performance', element: <Performance /> },
      { path: 'hrms/documents', element: <HRMSDocuments /> },
      { path: 'hrms/reports', element: <HRMSReports /> },

      { path: 'hrms/leave', element: <Leave /> },
      { path: 'hrms/payroll', element: <Payroll /> },
      { path: 'hrms/payroll/payslip', element: <Payslip /> },
      { path: 'hrms/payroll/process', element: <PayrollProcessing /> },
      { path: 'hrms/recruitment', element: <Recruitment /> },
      { path: 'hrms/performance', element: <Performance /> },
      { path: 'hrms/documents', element: <HRMSDocuments /> },
      { path: 'hrms/reports', element: <HRMSReports /> },

      {
        path: 'hrms/leave',
        element: (
          <RoleRoute permission={PERMISSIONS.LEAVE.VIEW}>
            <Leave />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/leave/apply',
        element: (
          <RoleRoute permission={PERMISSIONS.LEAVE.CREATE}>
            <ApplyLeave />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/leave/my',
        element: (
          <RoleRoute permission={PERMISSIONS.LEAVE.VIEW}>
            <MyLeaveRequests />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/leave/approvals',
        element: (
          <RoleRoute permission={PERMISSIONS.LEAVE.APPROVE}>
            <LeaveApprovals />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/leave/:id',
        element: (
          <RoleRoute permission={PERMISSIONS.LEAVE.VIEW}>
            <LeaveDetails />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/payroll',
        element: (
          <RoleRoute permission={PERMISSIONS.PAYROLL.VIEW}>
            <Payroll />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/recruitment',
        element: (
          <RoleRoute permission={PERMISSIONS.RECRUITMENT.VIEW}>
            <Recruitment />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/performance',
        element: (
          <RoleRoute permission={PERMISSIONS.PERFORMANCE.VIEW}>
            <Performance />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/performance/goals',
        element: (
          <RoleRoute permission={PERMISSIONS.PERFORMANCE.VIEW}>
            <Goals />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/performance/kpis',
        element: (
          <RoleRoute permission={PERMISSIONS.PERFORMANCE.VIEW}>
            <KPIs />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/performance/appraisal',
        element: (
          <RoleRoute permission={PERMISSIONS.PERFORMANCE.VIEW}>
            <Appraisal />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/performance/360-feedback',
        element: (
          <RoleRoute permission={PERMISSIONS.PERFORMANCE.VIEW}>
            <Feedback />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/documents',
        element: (
          <RoleRoute permission={PERMISSIONS.DOCUMENTS.VIEW}>
            <HRMSDocuments />
          </RoleRoute>
        ),
      },
      {
        path: 'hrms/reports',
        element: (
          <RoleRoute permission={PERMISSIONS.REPORTS.VIEW}>
            <HRMSReports />
          </RoleRoute>
        ),
      },
      {
        path: 'settings/users',
        element: (
          <RoleRoute permission={PERMISSIONS.USERS.VIEW}>
            <UserManagement />
          </RoleRoute>
        ),
      },
      {
        path: 'settings/privileges',
        element: (
          <RoleRoute permission={PERMISSIONS.PRIVILEGES.VIEW}>
            <ScreenPrivileges />
          </RoleRoute>
        ),
      },
    ],
  },
])
