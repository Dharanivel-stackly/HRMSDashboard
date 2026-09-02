import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { ROUTES } from '@/lib/constants/routes'

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
import Recruitment from '@/pages/hrms/recruitment/Recruitment'
import Performance from '@/pages/hrms/performance/Performance'
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
        element: <Navigate to={ROUTES.DASHBOARD} replace />,
      },
      { path: 'dashboard', element: <Dashboard /> },

      { path: 'hrms', element: <HRMSDashboard /> },
      { path: 'hrms/employees', element: <Employees /> },
      { path: 'hrms/employees/new', element: <AddEmployee /> },
      { path: 'hrms/employees/:id', element: <EmployeeDetails /> },
      { path: 'hrms/employees/:id/edit', element: <EditEmployee /> },

      // Attendance module
      { path: 'hrms/attendance', element: <AttendanceDashboard /> },
      { path: 'hrms/attendance/my', element: <MyAttendance /> },
      { path: 'hrms/attendance/daily', element: <DailyAttendance /> },
      { path: 'hrms/attendance/calendar', element: <AttendanceCalendarPage /> },
      { path: 'hrms/attendance/corrections', element: <AttendanceCorrections /> },
      { path: 'hrms/attendance/shifts', element: <ShiftManagement /> },
      { path: 'hrms/attendance/overtime', element: <OvertimePage /> },
      { path: 'hrms/attendance/holidays', element: <HolidayManagement /> },
      { path: 'hrms/attendance/reports', element: <AttendanceReports /> },
      { path: 'hrms/attendance/settings', element: <AttendanceSettings /> },

      { path: 'hrms/leave', element: <Leave /> },
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
    ],
  },
])
