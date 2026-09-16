export type RecruitmentStatus =
  | 'Applied'
  | 'Shortlisted'
  | 'Interviewed'
  | 'Hired'
  | 'Rejected'

export type RecruitmentRecord = {
  id: number
  candidateId: string
  candidateName: string
  email: string
  phone: string
  department: string
  position: string
  recruitmentMonth: string
  appliedDate: string
  interviewDate: string
  source: string
  status: RecruitmentStatus
}

const MOCK_RECRUITMENT_RECORDS: RecruitmentRecord[] = [
  {
    id: 1,
    candidateId: 'CAN001',
    candidateName: 'Arun Kumar',
    email: 'arun@example.com',
    phone: '9876543210',
    department: 'Engineering',
    position: 'Frontend Developer',
    recruitmentMonth: '2026-01',
    appliedDate: '2026-01-05',
    interviewDate: '2026-01-10',
    source: 'LinkedIn',
    status: 'Hired',
  },
  {
    id: 2,
    candidateId: 'CAN002',
    candidateName: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '9876543211',
    department: 'HR',
    position: 'HR Executive',
    recruitmentMonth: '2026-01',
    appliedDate: '2026-01-07',
    interviewDate: '2026-01-14',
    source: 'Naukri',
    status: 'Interviewed',
  },
  {
    id: 3,
    candidateId: 'CAN003',
    candidateName: 'Rahul Raj',
    email: 'rahul@example.com',
    phone: '9876543212',
    department: 'Finance',
    position: 'Accountant',
    recruitmentMonth: '2026-02',
    appliedDate: '2026-02-03',
    interviewDate: '2026-02-09',
    source: 'Indeed',
    status: 'Shortlisted',
  },
  {
    id: 4,
    candidateId: 'CAN004',
    candidateName: 'Divya Mohan',
    email: 'divya@example.com',
    phone: '9876543213',
    department: 'Engineering',
    position: 'Backend Developer',
    recruitmentMonth: '2026-02',
    appliedDate: '2026-02-08',
    interviewDate: '2026-02-15',
    source: 'LinkedIn',
    status: 'Applied',
  },
  {
    id: 5,
    candidateId: 'CAN005',
    candidateName: 'Karthik S',
    email: 'karthik@example.com',
    phone: '9876543214',
    department: 'Sales',
    position: 'Sales Executive',
    recruitmentMonth: '2026-03',
    appliedDate: '2026-03-02',
    interviewDate: '2026-03-08',
    source: 'Referral',
    status: 'Hired',
  },
  {
    id: 6,
    candidateId: 'CAN006',
    candidateName: 'Sneha R',
    email: 'sneha@example.com',
    phone: '9876543215',
    department: 'Marketing',
    position: 'Marketing Executive',
    recruitmentMonth: '2026-03',
    appliedDate: '2026-03-06',
    interviewDate: '2026-03-12',
    source: 'Naukri',
    status: 'Rejected',
  },
  {
    id: 7,
    candidateId: 'CAN007',
    candidateName: 'Vijay Kumar',
    email: 'vijay@example.com',
    phone: '9876543216',
    department: 'Engineering',
    position: 'QA Engineer',
    recruitmentMonth: '2026-04',
    appliedDate: '2026-04-04',
    interviewDate: '2026-04-11',
    source: 'Indeed',
    status: 'Shortlisted',
  },
  {
    id: 8,
    candidateId: 'CAN008',
    candidateName: 'Meena Devi',
    email: 'meena@example.com',
    phone: '9876543217',
    department: 'HR',
    position: 'Recruiter',
    recruitmentMonth: '2026-04',
    appliedDate: '2026-04-09',
    interviewDate: '2026-04-16',
    source: 'LinkedIn',
    status: 'Interviewed',
  },
  {
    id: 9,
    candidateId: 'CAN009',
    candidateName: 'Suresh B',
    email: 'suresh@example.com',
    phone: '9876543218',
    department: 'Finance',
    position: 'Financial Analyst',
    recruitmentMonth: '2026-05',
    appliedDate: '2026-05-05',
    interviewDate: '2026-05-13',
    source: 'Referral',
    status: 'Hired',
  },
  {
    id: 10,
    candidateId: 'CAN010',
    candidateName: 'Anitha K',
    email: 'anitha@example.com',
    phone: '9876543219',
    department: 'Engineering',
    position: 'UI Developer',
    recruitmentMonth: '2026-05',
    appliedDate: '2026-05-10',
    interviewDate: '2026-05-18',
    source: 'Naukri',
    status: 'Applied',
  },
]

export const getRecruitmentReport =
  async (): Promise<RecruitmentRecord[]> => {
    return Promise.resolve(
      MOCK_RECRUITMENT_RECORDS,
    )
  }