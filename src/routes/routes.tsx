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
      { path: 'hrms/performance', element: <Performance /> },
      { path: 'hrms/documents', element: <HRMSDocuments /> },
      { path: 'hrms/reports', element: <HRMSReports /> },
    ],
  },
])
