export type PerformanceLevel =
  | 'Excellent'
  | 'Good'
  | 'Average'
  | 'Needs Improvement'

export interface PerformanceRecord {
  id: string
  employeeId: string
  employeeName: string
  department: string
  designation: string
  reviewYear: string
  reviewDate: string
  rating: number
  performanceLevel: PerformanceLevel
  goalsCompleted: number
  totalGoals: number
  reviewer: string
  comments: string
}

const MOCK_PERFORMANCE_RECORDS: PerformanceRecord[] = [
  {
    id: 'PR001',
    employeeId: 'EMP001',
    employeeName: 'Arun Kumar',
    department: 'IT',
    designation: 'Software Developer',
    reviewYear: '2026',
    reviewDate: '2026-03-31',
    rating: 4.8,
    performanceLevel: 'Excellent',
    goalsCompleted: 10,
    totalGoals: 10,
    reviewer: 'Rajesh Kumar',
    comments: 'Excellent performance throughout the review period.',
  },
  {
    id: 'PR002',
    employeeId: 'EMP002',
    employeeName: 'Priya Sharma',
    department: 'HR',
    designation: 'HR Executive',
    reviewYear: '2026',
    reviewDate: '2026-03-31',
    rating: 4.2,
    performanceLevel: 'Good',
    goalsCompleted: 8,
    totalGoals: 10,
    reviewer: 'Meena Devi',
    comments: 'Good performance with consistent results.',
  },
  {
    id: 'PR003',
    employeeId: 'EMP003',
    employeeName: 'Karthik Raj',
    department: 'Finance',
    designation: 'Accountant',
    reviewYear: '2026',
    reviewDate: '2026-03-31',
    rating: 3.6,
    performanceLevel: 'Good',
    goalsCompleted: 8,
    totalGoals: 10,
    reviewer: 'Suresh Kumar',
    comments: 'Good work with some areas for improvement.',
  },
  {
    id: 'PR004',
    employeeId: 'EMP004',
    employeeName: 'Divya Mohan',
    department: 'Marketing',
    designation: 'Marketing Executive',
    reviewYear: '2026',
    reviewDate: '2026-03-31',
    rating: 4.7,
    performanceLevel: 'Excellent',
    goalsCompleted: 9,
    totalGoals: 10,
    reviewer: 'Anitha Raj',
    comments: 'Consistently exceeded expectations.',
  },
  {
    id: 'PR005',
    employeeId: 'EMP005',
    employeeName: 'Vijay Kumar',
    department: 'IT',
    designation: 'Frontend Developer',
    reviewYear: '2026',
    reviewDate: '2026-03-31',
    rating: 3.1,
    performanceLevel: 'Average',
    goalsCompleted: 7,
    totalGoals: 10,
    reviewer: 'Rajesh Kumar',
    comments: 'Average performance with potential for improvement.',
  },
  {
    id: 'PR006',
    employeeId: 'EMP006',
    employeeName: 'Sneha Reddy',
    department: 'Operations',
    designation: 'Operations Executive',
    reviewYear: '2026',
    reviewDate: '2026-03-31',
    rating: 4.5,
    performanceLevel: 'Excellent',
    goalsCompleted: 9,
    totalGoals: 10,
    reviewer: 'Manoj Kumar',
    comments: 'Strong performance and excellent teamwork.',
  },
  {
    id: 'PR007',
    employeeId: 'EMP007',
    employeeName: 'Rahul Kumar',
    department: 'Sales',
    designation: 'Sales Executive',
    reviewYear: '2026',
    reviewDate: '2026-03-31',
    rating: 2.8,
    performanceLevel: 'Needs Improvement',
    goalsCompleted: 5,
    totalGoals: 10,
    reviewer: 'Sanjay Kumar',
    comments: 'Performance needs improvement in target achievement.',
  },
  {
    id: 'PR008',
    employeeId: 'EMP008',
    employeeName: 'Nisha Priya',
    department: 'HR',
    designation: 'HR Manager',
    reviewYear: '2026',
    reviewDate: '2026-03-31',
    rating: 4.4,
    performanceLevel: 'Good',
    goalsCompleted: 9,
    totalGoals: 10,
    reviewer: 'Meena Devi',
    comments: 'Good leadership and employee management.',
  },
  {
    id: 'PR009',
    employeeId: 'EMP009',
    employeeName: 'Sathish Kumar',
    department: 'IT',
    designation: 'Backend Developer',
    reviewYear: '2026',
    reviewDate: '2026-03-31',
    rating: 4.6,
    performanceLevel: 'Excellent',
    goalsCompleted: 10,
    totalGoals: 10,
    reviewer: 'Rajesh Kumar',
    comments: 'Excellent technical contribution.',
  },
  {
    id: 'PR010',
    employeeId: 'EMP010',
    employeeName: 'Anjali Devi',
    department: 'Finance',
    designation: 'Finance Executive',
    reviewYear: '2026',
    reviewDate: '2026-03-31',
    rating: 2.9,
    performanceLevel: 'Needs Improvement',
    goalsCompleted: 6,
    totalGoals: 10,
    reviewer: 'Suresh Kumar',
    comments: 'Requires improvement in accuracy and productivity.',
  },
]

export const getPerformanceReport = async (): Promise<
  PerformanceRecord[]
> => {
  return Promise.resolve(MOCK_PERFORMANCE_RECORDS)
}