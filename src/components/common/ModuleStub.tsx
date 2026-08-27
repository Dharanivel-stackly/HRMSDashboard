import { PageContainer } from '@/components/layout/PageContainer'
import { Construction } from 'lucide-react'

interface ModuleStubProps {
  description: string
}

export function ModuleStub({ description }: ModuleStubProps) {
  return (
    <PageContainer>
      <div className="ui-card-elevated flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-border/60 bg-card px-6 py-12 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Construction className="h-6 w-6" />
        </div>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
        <p className="mt-2 text-xs font-medium text-primary/80">UI ready — feature coming next</p>
      </div>
    </PageContainer>
  )
}
