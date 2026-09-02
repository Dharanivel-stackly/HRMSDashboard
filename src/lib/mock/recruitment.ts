// src/mock/recruitment.ts
import { MockMethod } from 'vite-plugin-mock'
import {
  mockRequisitions,
  mockCandidates,
  mockInterviews,
  mockOffers,
  mockApprovals,
  mockJobPostings,
} from '@/features/hrms/recruitment/mock/recruitment.mock'

// Helper for pagination
function paginate<T>(data: T[], page: number = 1, limit: number = 10) {
  const start = (page - 1) * limit
  const paginated = data.slice(start, start + limit)
  return {
    data: paginated,
    meta: {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit),
    },
  }
}

export default [
  // ---------- Requisitions ----------
  {
    url: '/api/recruitment/requisitions',
    method: 'get',
    response: ({ query }) => {
      let data = [...mockRequisitions]
      if (query.status) data = data.filter(r => r.status === query.status)
      if (query.department) data = data.filter(r => r.department === query.department)
      if (query.search) {
        const q = query.search.toLowerCase()
        data = data.filter(r => r.title.toLowerCase().includes(q))
      }
      return paginate(data, Number(query.page), Number(query.limit))
    },
  },
  {
    url: '/api/recruitment/requisitions/:id',
    method: 'get',
    response: ({ params }) => {
      const req = mockRequisitions.find(r => r.id === params.id)
      if (!req) return { data: null, message: 'Not found' }
      return { data: req }
    },
  },
  {
    url: '/api/recruitment/requisitions',
    method: 'post',
    response: ({ body }) => {
      const newReq = {
        id: `req-${Date.now()}`,
        requisitionId: `REQ-2026-${String(mockRequisitions.length + 1).padStart(3, '0')}`,
        ...body,
        filledPositions: 0,
        status: 'draft',
        requestedBy: 'Current User',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      mockRequisitions.unshift(newReq)
      return { data: newReq }
    },
  },
  {
    url: '/api/recruitment/requisitions/:id',
    method: 'put',
    response: ({ params, body }) => {
      const index = mockRequisitions.findIndex(r => r.id === params.id)
      if (index === -1) return { data: null, message: 'Not found' }
      mockRequisitions[index] = { ...mockRequisitions[index], ...body, updatedAt: new Date().toISOString() }
      return { data: mockRequisitions[index] }
    },
  },

  // ---------- Candidates ----------
  {
    url: '/api/recruitment/candidates',
    method: 'get',
    response: ({ query }) => {
      let data = [...mockCandidates]
      if (query.status) data = data.filter(c => c.status === query.status)
      if (query.position) data = data.filter(c => c.position === query.position)
      if (query.source) data = data.filter(c => c.source === query.source)
      if (query.search) {
        const q = query.search.toLowerCase()
        data = data.filter(c =>
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.position.toLowerCase().includes(q)
        )
      }
      if (query.experienceMin) data = data.filter(c => c.experienceYears >= Number(query.experienceMin))
      if (query.experienceMax) data = data.filter(c => c.experienceYears <= Number(query.experienceMax))
      return paginate(data, Number(query.page), Number(query.limit))
    },
  },
  {
    url: '/api/recruitment/candidates/:id',
    method: 'get',
    response: ({ params }) => {
      const c = mockCandidates.find(c => c.id === params.id)
      if (!c) return { data: null, message: 'Not found' }
      return { data: c }
    },
  },
  {
    url: '/api/recruitment/candidates/:id/status',
    method: 'patch',
    response: ({ params, body }) => {
      const c = mockCandidates.find(c => c.id === params.id)
      if (!c) return { data: null, message: 'Not found' }
      c.status = body.status
      c.updatedAt = new Date().toISOString()
      return { data: c }
    },
  },

  // ---------- Interviews ----------
  {
    url: '/api/recruitment/interviews',
    method: 'get',
    response: () => ({ data: mockInterviews }),
  },

  // ---------- Offers ----------
  {
    url: '/api/recruitment/offers',
    method: 'get',
    response: () => ({ data: mockOffers }),
  },

  // ---------- Approvals ----------
  {
    url: '/api/recruitment/approvals',
    method: 'get',
    response: () => ({ data: mockApprovals }),
  },
  {
    url: '/api/recruitment/approvals/:id',
    method: 'patch',
    response: ({ params, body }) => {
      const app = mockApprovals.find(a => a.id === params.id)
      if (!app) return { data: null, message: 'Not found' }
      app.status = body.status
      app.approver = 'Current User'
      app.approvalDate = new Date().toISOString()
      if (body.comments) app.comments = body.comments
      app.updatedAt = new Date().toISOString()
      return { data: app }
    },
  },

  // ---------- Job Postings ----------
  {
    url: '/api/recruitment/job-postings',
    method: 'get',
    response: () => ({ data: mockJobPostings }),
  },
] as MockMethod[]