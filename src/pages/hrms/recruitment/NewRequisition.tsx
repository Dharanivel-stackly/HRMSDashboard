// src/pages/hrms/recruitment/NewRequisition.tsx
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { RequisitionForm, type RequisitionFormData } from '@/features/hrms/recruitment/components/RequisitionForm';

export default function NewRequisition() {
  const navigate = useNavigate();

  const handleSubmit = (data: RequisitionFormData) => {
    console.log('Requisition data:', data);
    // In a real app, this would call an API
    navigate('/hrms/recruitment/requisitions');
  };

  return (
    <PageContainer>
      <PageHeader
        title="New Requisition"
        description="Create a new job requisition"
      />
      <RequisitionForm onSubmit={handleSubmit} submitLabel="Create Requisition" />
    </PageContainer>
  );
}