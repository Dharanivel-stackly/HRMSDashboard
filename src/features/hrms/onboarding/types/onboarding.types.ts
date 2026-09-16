import type { BaseEntity } from '@/types/common.types';

export type OnboardingStatus =
  | 'not_started'
  | 'document_collection'
  | 'document_verification'
  | 'background_verification'
  | 'orientation'
  | 'policy_acceptance'
  | 'system_access'
  | 'it_tasks'
  | 'asset_allocation'
  | 'manager_tasks'
  | 'hr_tasks'
  | 'completed';

export type DocumentStatus = 'pending' | 'uploaded' | 'verified' | 'rejected';
export type DocumentType =
  | 'aadhar'
  | 'pan'
  | 'passport'
  | 'driving_license'
  | 'degree_certificate'
  | 'experience_letter'
  | 'salary_slip'
  | 'offer_letter'
  | 'background_check'
  | 'medical_report'
  | 'other';

export type VerificationStatus = 'pending' | 'in_progress' | 'cleared' | 'failed';
export type PolicyStatus = 'pending' | 'accepted' | 'declined';
export type AssetType = 'laptop' | 'desktop' | 'monitor' | 'keyboard' | 'mouse' | 'headset' | 'phone' | 'access_card';
export type AssetStatus = 'allocated' | 'pending' | 'returned';

export interface OnboardingEmployee extends BaseEntity {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  status: OnboardingStatus;
  progress: number;
  manager: string;
  hrCoordinator: string;
  avatar?: string;
}

export interface Document extends BaseEntity {
  id: string;
  employeeId: string;
  employeeName: string;
  documentType: DocumentType;
  documentName: string;
  status: DocumentStatus;
  url?: string;
  uploadedDate: string;
  verifiedDate?: string;
  verifiedBy?: string;
  comments?: string;
}

export interface BackgroundVerification extends BaseEntity {
  id: string;
  employeeId: string;
  employeeName: string;
  status: VerificationStatus;
  type: 'education' | 'employment' | 'criminal' | 'reference' | 'other';
  submittedDate: string;
  completedDate?: string;
  verifiedBy?: string;
  notes?: string;
  findings?: string;
}

export interface PolicyAcceptance extends BaseEntity {
  id: string;
  employeeId: string;
  employeeName: string;
  policyName: string;
  policyVersion: string;
  status: PolicyStatus;
  acceptedDate?: string;
  signedUrl?: string;
}

export interface AssetAllocation extends BaseEntity {
  id: string;
  employeeId: string;
  employeeName: string;
  assetType: AssetType;
  assetTag: string;
  serialNumber: string;
  status: AssetStatus;
  allocatedDate: string;
  expectedReturnDate?: string;
  returnedDate?: string;
  notes?: string;
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  assignee: string;
  department: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  dueDate: string;
  completedDate?: string;
  priority: 'low' | 'medium' | 'high';
  category: 'it' | 'hr' | 'manager' | 'employee';
}

export interface OnboardingStats {
  totalEmployees: number;
  inProgress: number;
  completed: number;
  notStarted: number;
  documentsPending: number;
  verificationPending: number;
  tasksPending: number;
  assetsPending: number;
}

export interface ITTask extends BaseEntity {
  id: string;
  employeeId: string;
  employeeName: string;
  taskType: 'system_account' | 'email_setup' | 'vpn_access' | 'software_install' | 'hardware_setup';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  assignedTo: string;
  dueDate: string;
  completedDate?: string;
  notes?: string;
}

export interface ManagerTask extends BaseEntity {
  id: string;
  employeeId: string;
  employeeName: string;
  taskType: 'welcome_meeting' | 'team_introduction' | 'goal_setting' | 'training_plan' | 'project_allocation';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  completedDate?: string;
  notes?: string;
}

export interface HRTask extends BaseEntity {
  id: string;
  employeeId: string;
  employeeName: string;
  taskType: 'offer_letter' | 'policy_acknowledgement' | 'bank_account' | 'insurance' | 'pf_esi' | 'orientation';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  completedDate?: string;
  notes?: string;
}