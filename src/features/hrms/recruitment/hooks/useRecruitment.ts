import { useQuery } from '@tanstack/react-query'
import { recruitmentService } from '../services/recruitmentService'

export function useRecruitmentStats() {
  return useQuery({
    queryKey: ['recruitmentStats'],
    queryFn: () => recruitmentService.getStats(),
  })
}

export function useInterviews() {
  return useQuery({
    queryKey: ['interviews'],
    queryFn: () => recruitmentService.getInterviews(),
  })
}

export function useOffers() {
  return useQuery({
    queryKey: ['offers'],
    queryFn: () => recruitmentService.getOffers(),
  })
}

export function useJobPostings() {
  return useQuery({
    queryKey: ['jobPostings'],
    queryFn: () => recruitmentService.getJobPostings(),
  })
}