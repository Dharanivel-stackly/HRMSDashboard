// src/features/hrms/recruitment/types/recruitment.types.ts
import type { BaseEntity } from '@/types/common.types';

export type RequisitionStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'closed';
export type JobType = 'full_time' | 'part_time' | 'contract' | 'intern' | 'temporary';
export type CandidateStatus = 'applied' | 'screening' | 'shortlisted' | 'interview_scheduled' | 'interviewed' | 'evaluated' | 'selected' | 'offer_sent' | 'offer_accepted' | 'offer_declined' | 'hired' | 'rejected';
export type InterviewType = 'phone' | 'video' | 'in_person' | 'technical' | 'panel';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
export type OfferStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface Requisition extends BaseEntity {
  requisitionId: string;
  title: string;
  department: string;
  location: string;
  jobType: JobType;
  positions: number;
  filledPositions: number;
  description: string;
  requirements: string[];
  qualifications: string[];
  salaryMin?: number;
  salaryMax?: number;
  status: RequisitionStatus;
  requestedBy: string;
  approvedBy?: string;
  approvalDate?: string;
  closingDate?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface JobPosting extends BaseEntity {
  id: string;
  requisitionId: string;
  title: string;
  department: string;
  location: string;
  jobType: JobType;
  description: string;
  requirements: string[];
  responsibilities: string[];
  postedDate: string;
  expiryDate: string;
  isActive: boolean;
  views: number;
  applications: number;
  source: 'internal' | 'external' | 'both';
  url?: string;
}

export interface Candidate extends BaseEntity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  source: 'linkedin' | 'naukri' | 'referral' | 'career_page' | 'agency' | 'other';
  resumeUrl?: string;
  coverLetter?: string;
  appliedDate: string;
  status: CandidateStatus;
  currentCompany?: string;
  currentDesignation?: string;
  experienceYears: number;
  education: Education[];
  skills: string[];
  rating?: number;
  notes?: string;
  avatar?: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  grade?: string;
}

export interface Interview extends BaseEntity {
  id: string;
  candidateId: string;
  candidateName: string;
  position: string;
  interviewType: InterviewType;
  status: InterviewStatus;
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // minutes
  panel: string[];
  location: string; // or meeting link
  notes?: string;
  feedback?: string;
  rating?: number;
}

export interface Offer extends BaseEntity {
  id: string;
  candidateId: string;
  candidateName: string;
  position: string;
  department: string;
  status: OfferStatus;
  offerDate: string;
  expiryDate: string;
  joiningDate: string;
  salary: number;
  benefits: string[];
  notes?: string;
  sentDate?: string;
  acceptedDate?: string;
  declinedReason?: string;
}

export interface Approval extends BaseEntity {
  id: string;
  requisitionId: string;
  requisitionTitle: string;
  requestedBy: string;
  department: string;
  positions: number;
  status: ApprovalStatus;
  approver?: string;
  approvalDate?: string;
  comments?: string;
}

export interface RecruitmentFilters {
  search?: string;
  department?: string;
  status?: CandidateStatus | RequisitionStatus | ApprovalStatus;
  jobType?: JobType;
  dateRange?: { from: string; to: string };
}

export interface CandidateFilters {
  search?: string;
  position?: string;
  status?: CandidateStatus;
  source?: Candidate['source'];
  experienceMin?: number;
  experienceMax?: number;
}