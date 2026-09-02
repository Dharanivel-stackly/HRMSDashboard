import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/ui/button';
import { useOnboardingStats } from '@/features/hrms/onboarding/hooks/useOnboarding';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/lib/constants/routes';
import {
  Users,
  UserCheck,
  Clock,
  FileText,
  ShieldCheck,
  CheckCircle,
  Laptop,
  UserPlus,
  AlertCircle,
  Banknote,
} from 'lucide-react';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';

export default function OnboardingDashboard() {
  const navigate = useNavigate();
  const { data: stats, isLoading, isError, refetch } = useOnboardingStats();

  if (isLoading) return <LoadingState variant="page" />;
  if (isError || !stats) return <ErrorState onRetry={refetch} />;

  const statCards = [
    {
      label: 'Total Onboarding',
      value: stats.totalEmployees,
      icon: Users,
      accent: 'blue' as const,
      subtext: 'Active onboarding processes',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      accent: 'orange' as const,
      badge: 'Active',
      badgeTone: 'warning' as const,
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      accent: 'green' as const,
      badge: 'Done',
      badgeTone: 'success' as const,
    },
    {
      label: 'Not Started',
      value: stats.notStarted,
      icon: UserPlus,
      accent: 'purple' as const,
    },
    {
      label: 'Documents Pending',
      value: stats.documentsPending,
      icon: FileText,
      accent: 'indigo' as const,
      alert: true,
    },
    {
      label: 'Verification Pending',
      value: stats.verificationPending,
      icon: ShieldCheck,
      accent: 'orange' as const,
      badge: 'Action needed',
      badgeTone: 'warning' as const,
      alert: true,
    },
    {
      label: 'Tasks Pending',
      value: stats.tasksPending,
      icon: CheckCircle,
      accent: 'pink' as const,
      alert: true,
    },
    {
      label: 'Assets Pending',
      value: stats.assetsPending,
      icon: Laptop,
      accent: 'teal' as const,
      alert: true,
    },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Onboarding Dashboard"
        description="Track new employee onboarding progress"
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/hrms/onboarding/employees')}>
              <Users className="mr-2 h-4 w-4" />
              View All
            </Button>
            <Button onClick={() => navigate('/hrms/onboarding/hr')}>
              <Banknote className="mr-2 h-4 w-4" />
              Add Bank Account
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
          <h3 className="text-base font-semibold text-[#0b3d91]">Recent Onboardings</h3>
          <div className="mt-4 space-y-3">
            {stats.totalEmployees > 0 ? (
              <p className="text-sm text-muted-foreground">
                {stats.inProgress} employees currently in onboarding process.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No active onboardings.</p>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/hrms/onboarding/employees')}
            >
              View All Onboarding Profiles
            </Button>
          </div>
        </div>

        <div className="ui-card-elevated rounded-xl border border-border/60 bg-card p-5">
          <h3 className="text-base font-semibold text-[#0b3d91]">Quick Actions</h3>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => navigate(ROUTES.HRMS.ONBOARDING.DOCUMENTS)}
            >
              <FileText className="mr-2 h-4 w-4" />
              Document Collection
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => navigate('/hrms/onboarding/documents/verify')}
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              Verify Documents
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => navigate('/hrms/onboarding/it')}
            >
              <Laptop className="mr-2 h-4 w-4" />
              IT Setup
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => navigate(ROUTES.HRMS.ONBOARDING.ASSETS)}
            >
              <Laptop className="mr-2 h-4 w-4" />
              Asset Allocation
            </Button>
            <Button
              variant="outline"
              className="justify-start col-span-2"
              onClick={() => navigate('/hrms/onboarding/hr')}
            >
              <Banknote className="mr-2 h-4 w-4" />
              Add Bank Account (HR)
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}