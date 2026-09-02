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
import Recruitment from '@/pages/hrms/recruitment/Recruitment'
import Performance from '@/pages/hrms/performance/Performance'
import HRMSDocuments from '@/pages/hrms/documents/Documents'
import HRMSReports from '@/pages/hrms/reports/Reports'
import UserManagement from '@/pages/settings/UserManagement'

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

      {
        path: 'hrms/leave',
        element: (
          <RoleRoute permission={PERMISSIONS.LEAVE.VIEW}>
            <Leave />
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
    ],
  },
])
