// src/features/hrms/recruitment/constants/recruitment.constants.ts
import type { SelectOption } from '@/types/api.types';
import type {
  CandidateStatus,
  RequisitionStatus,
  JobType,
  InterviewType,
  InterviewStatus,
  OfferStatus,
  ApprovalStatus,
} from '../types/recruitment.types';

export const REQUISITION_STATUS_LABELS: Record<RequisitionStatus, string> = {
  draft: 'Draft',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  rejected: 'Rejected',
  closed: 'Closed',
};

export const REQUISITION_STATUS_STYLES: Record<RequisitionStatus, string> = {
  draft: 'border-slate-200 bg-slate-50 text-slate-600',
  pending_approval: 'border-amber-200 bg-amber-50 text-amber-700',
  approved: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  rejected: 'border-red-200 bg-red-50 text-red-700',
  closed: 'border-slate-200 bg-slate-100 text-slate-500',
};

export const CANDIDATE_STATUS_LABELS: Record<CandidateStatus, string> = {
  applied: 'Applied',
  screening: 'Screening',
  shortlisted: 'Shortlisted',
  interview_scheduled: 'Interview Scheduled',
  interviewed: 'Interviewed',
  evaluated: 'Evaluated',
  selected: 'Selected',
  offer_sent: 'Offer Sent',
  offer_accepted: 'Offer Accepted',
  offer_declined: 'Offer Declined',
  hired: 'Hired',
  rejected: 'Rejected',
};

export const CANDIDATE_STATUS_STYLES: Record<CandidateStatus, string> = {
  applied: 'border-blue-200 bg-blue-50 text-blue-700',
  screening: 'border-purple-200 bg-purple-50 text-purple-700',
  shortlisted: 'border-indigo-200 bg-indigo-50 text-indigo-700',
  interview_scheduled: 'border-amber-200 bg-amber-50 text-amber-700',
  interviewed: 'border-orange-200 bg-orange-50 text-orange-700',
  evaluated: 'border-teal-200 bg-teal-50 text-teal-700',
  selected: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  offer_sent: 'border-sky-200 bg-sky-50 text-sky-700',
  offer_accepted: 'border-green-200 bg-green-50 text-green-700',
  offer_declined: 'border-red-200 bg-red-50 text-red-700',
  hired: 'border-emerald-300 bg-emerald-100 text-emerald-800',
  rejected: 'border-red-200 bg-red-50 text-red-700',
};

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  full_time: 'Full Time',
  part_time: 'Part Time',
  contract: 'Contract',
  intern: 'Intern',
  temporary: 'Temporary',
};

export const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  phone: 'Phone',
  video: 'Video Call',
  in_person: 'In-Person',
  technical: 'Technical',
  panel: 'Panel',
};

export const INTERVIEW_STATUS_LABELS: Record<InterviewStatus, string> = {
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rescheduled: 'Rescheduled',
};

export const OFFER_STATUS_LABELS: Record<OfferStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  accepted: 'Accepted',
  declined: 'Declined',
  expired: 'Expired',
};

export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
};

export const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export const CANDIDATE_SOURCE_OPTIONS: SelectOption[] = [
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Naukri', value: 'naukri' },
  { label: 'Referral', value: 'referral' },
  { label: 'Career Page', value: 'career_page' },
  { label: 'Agency', value: 'agency' },
  { label: 'Other', value: 'other' },
];

export const DEPARTMENT_OPTIONS: SelectOption[] = [
  { label: 'All Departments', value: 'all' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Product', value: 'product' },
  { label: 'Design', value: 'design' },
  { label: 'Sales', value: 'sales' },
  { label: 'Human Resources', value: 'human_resources' },
  { label: 'Finance', value: 'finance' },
  { label: 'Operations', value: 'operations' },
];

export const JOB_TYPE_OPTIONS: SelectOption[] = [
  { label: 'Full Time', value: 'full_time' },
  { label: 'Part Time', value: 'part_time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Intern', value: 'intern' },
  { label: 'Temporary', value: 'temporary' },
];