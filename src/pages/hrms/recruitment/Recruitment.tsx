// src/pages/hrms/recruitment/Recruitment.tsx
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Users,
  UserPlus,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  CalendarDays,
  Briefcase,
  TrendingUp,
  XCircle,
} from 'lucide-react'
import { recruitmentStats } from '@/features/hrms/recruitment/mock/recruitment.mock'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants/routes'
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Line,
} from 'recharts'

// Mock data for charts – you can replace with real API data
const departmentRequisitions = [
  { department: 'Engineering', open: 5, filled: 2, total: 7 },
  { department: 'Product', open: 2, filled: 0, total: 2 },
  { department: 'Design', open: 1, filled: 0, total: 1 },
  { department: 'Sales', open: 4, filled: 2, total: 6 },
  { department: 'HR', open: 0, filled: 1, total: 1 },
]

const hiringTrend = [
  { month: 'Apr', hired: 3, offers: 5 },
  { month: 'May', hired: 2, offers: 4 },
  { month: 'Jun', hired: 5, offers: 7 },
  { month: 'Jul', hired: 4, offers: 6 },
  { month: 'Aug', hired: 6, offers: 9 },
  { month: 'Sep', hired: 2, offers: 4 },
]

const candidateSourceData = [
  { name: 'LinkedIn', value: 45 },
  { name: 'Naukri', value: 30 },
  { name: 'Referral', value: 18 },
  { name: 'Career Page', value: 22 },
  { name: 'Agency', value: 12 },
  { name: 'Other', value: 8 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFF', '#FF6B6B']

const statusDistribution = [
  { status: 'Applied', count: 8 },
  { status: 'Screening', count: 4 },
  { status: 'Shortlisted', count: 3 },
  { status: 'Interview Scheduled', count: 2 },
  { status: 'Interviewed', count: 3 },
  { status: 'Evaluated', count: 2 },
  { status: 'Selected', count: 1 },
  { status: 'Offer Sent', count: 2 },
  { status: 'Hired', count: 2 },
  { status: 'Rejected', count: 3 },
]

export default function Recruitment() {
  const navigate = useNavigate()
  const stats = recruitmentStats

  const statusCards = [
    {
      label: 'Total Requisitions',
      value: stats.totalRequisitions,
      icon: FileText,
      accent: 'blue' as const,
      subtext: `${stats.openPositions} open positions`,
    },
    {
      label: 'Active Candidates',
      value: stats.activeCandidates,
      icon: Users,
      accent: 'purple' as const,
      badge: 'Pipeline',
      badgeTone: 'neutral' as const,
    },
    {
      label: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: Clock,
      accent: 'orange' as const,
      badge: 'Action needed',
      badgeTone: 'warning' as const,
      alert: true,
    },
    {
      label: 'Interviews This Week',
      value: stats.interviewsThisWeek,
      icon: CalendarDays,
      accent: 'indigo' as const,
    },
    {
      label: 'Offers Sent',
      value: stats.offersSent,
      icon: Briefcase,
      accent: 'teal' as const,
      badge: `${stats.offersAccepted} accepted`,
      badgeTone: 'success' as const,
    },
    {
      label: 'Hire Rate',
      value: `${stats.hireRate}%`,
      icon: TrendingUp,
      accent: 'green' as const,
      subtext: `Avg ${stats.averageTimeToHire} days to hire`,
    },
  ]

  const pipelineData = [
    { status: 'Applied', count: stats.pipelineByStatus.applied, color: 'bg-blue-500' },
    { status: 'Screening', count: stats.pipelineByStatus.screening, color: 'bg-purple-500' },
    { status: 'Shortlisted', count: stats.pipelineByStatus.shortlisted, color: 'bg-indigo-500' },
    { status: 'Interview Scheduled', count: stats.pipelineByStatus.interview_scheduled, color: 'bg-amber-500' },
    { status: 'Interviewed', count: stats.pipelineByStatus.interviewed, color: 'bg-orange-500' },
    { status: 'Evaluated', count: stats.pipelineByStatus.evaluated, color: 'bg-teal-500' },
    { status: 'Selected', count: stats.pipelineByStatus.selected, color: 'bg-emerald-500' },
    { status: 'Offer Sent', count: stats.pipelineByStatus.offer_sent, color: 'bg-sky-500' },
    { status: 'Hired', count: stats.pipelineByStatus.hired, color: 'bg-green-600' },
    { status: 'Rejected', count: stats.pipelineByStatus.rejected, color: 'bg-red-500' },
  ]

  const totalPipeline = pipelineData.reduce((sum, d) => sum + d.count, 0)

  return (
    <PageContainer>
      <PageHeader
        title="Recruitment Dashboard"
        description="Manage job requisitions, candidates, and hiring pipeline"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => navigate('/hrms/recruitment/requisitions/new')}>
              <FileText className="mr-2 h-4 w-4" />
              New Requisition
            </Button>
            <Button variant="outline" onClick={() => navigate('/hrms/recruitment/candidates')}>
              <UserPlus className="mr-2 h-4 w-4" />
              View Candidates
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statusCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="requisitions">Requisitions</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
            <h3 className="text-base font-semibold text-[#0b3d91]">Candidate Pipeline</h3>
            <p className="text-sm text-muted-foreground">
              Total: <span className="font-medium text-foreground">{totalPipeline}</span> candidates
            </p>
            <div className="mt-4 space-y-3">
              {pipelineData.map((item) => (
                <div key={item.status}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.status}</span>
                    <span className="text-muted-foreground">{item.count}</span>
                  </div>
                  <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: totalPipeline > 0 ? `${(item.count / totalPipeline) * 100}%` : '0%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="requisitions">
          <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-8 text-center">
            <p className="text-muted-foreground">Requisition management interface</p>
            <Button className="mt-4" onClick={() => navigate('/hrms/recruitment/requisitions')}>
              View All Requisitions
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="interviews">
          <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-8 text-center">
            <p className="text-muted-foreground">Interview scheduling and management</p>
            <Button className="mt-4" variant="outline">
              Schedule Interview
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Row 1: Two charts side by side */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Bar chart: Department-wise Open vs Filled */}
            <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
              <h4 className="mb-4 text-sm font-semibold text-[#0b3d91]">Open vs Filled Positions by Department</h4>
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={departmentRequisitions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="open" fill="#3b82f6" name="Open" />
                  <Bar dataKey="filled" fill="#10b981" name="Filled" />
                  <Line type="monotone" dataKey="total" stroke="#8b5cf6" name="Total" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Area chart: Hiring trend */}
            <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
              <h4 className="mb-4 text-sm font-semibold text-[#0b3d91]">Hiring Trend (Last 6 Months)</h4>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={hiringTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="hired" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="offers" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Row 2: Two charts side by side */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Pie chart: Candidate Source Distribution */}
            <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
              <h4 className="mb-4 text-sm font-semibold text-[#0b3d91]">Candidate Sources</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={candidateSourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {candidateSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar chart: Candidate Status Distribution (comparative) */}
            <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
              <h4 className="mb-4 text-sm font-semibold text-[#0b3d91]">Candidate Status Breakdown</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={statusDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="status" width={100} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#6366f1" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}