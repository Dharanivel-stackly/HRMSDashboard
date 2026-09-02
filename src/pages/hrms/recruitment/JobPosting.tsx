// src/pages/hrms/recruitment/JobPosting.tsx
import { useState } from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { JOB_TYPE_LABELS } from '@/features/hrms/recruitment/constants/recruitment.constants'
import { mockJobPostings } from '@/features/hrms/recruitment/mock/recruitment.mock'
import type { JobPosting } from '@/features/hrms/recruitment/types/recruitment.types'
import { Plus, Eye, Edit, MoreHorizontal } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// Form Schema
const jobPostingSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  department: z.string().min(1, 'Department is required'),
  location: z.string().min(2, 'Location is required'),
  jobType: z.enum(['full_time', 'part_time', 'contract', 'intern', 'temporary']),
  description: z.string().min(10, 'Description is required'),
  requirements: z.string().min(10, 'Requirements are required'),
  responsibilities: z.string().min(10, 'Responsibilities are required'),
  postedDate: z.string().min(1, 'Posted date is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  isActive: z.boolean().default(true),
  source: z.enum(['internal', 'external', 'both']),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  views: z.coerce.number().default(0),
  applications: z.coerce.number().default(0),
})
type JobPostingFormData = z.infer<typeof jobPostingSchema>

// Helper to generate ID
const generateId = () => `jp-${Date.now()}`

export default function JobPosting() {
  const [postings, setPostings] = useState<JobPosting[]>(mockJobPostings)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<JobPosting | null>(null)
  const [viewingPost, setViewingPost] = useState<JobPosting | null>(null)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<JobPostingFormData>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: {
      title: '',
      department: 'Engineering',
      location: '',
      jobType: 'full_time',
      description: '',
      requirements: '',
      responsibilities: '',
      postedDate: new Date().toISOString().slice(0, 10),
      expiryDate: '',
      isActive: true,
      source: 'both',
      url: '',
      views: 0,
      applications: 0,
    }
  })

  const handleCreate = (data: JobPostingFormData) => {
    const newPost: JobPosting = {
      id: generateId(),
      requisitionId: `req-${Date.now()}`,
      title: data.title,
      department: data.department,
      location: data.location,
      jobType: data.jobType,
      description: data.description,
      requirements: data.requirements.split('\n').filter(Boolean),
      responsibilities: data.responsibilities.split('\n').filter(Boolean),
      postedDate: data.postedDate,
      expiryDate: data.expiryDate,
      isActive: data.isActive,
      views: data.views || 0,
      applications: data.applications || 0,
      source: data.source,
      url: data.url,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setPostings([newPost, ...postings])
    setDialogOpen(false)
    reset()
  }

  const handleUpdate = (data: JobPostingFormData) => {
    if (!editingPost) return
    const updatedPosts = postings.map(p => 
      p.id === editingPost.id 
        ? {
            ...p,
            title: data.title,
            department: data.department,
            location: data.location,
            jobType: data.jobType,
            description: data.description,
            requirements: data.requirements.split('\n').filter(Boolean),
            responsibilities: data.responsibilities.split('\n').filter(Boolean),
            postedDate: data.postedDate,
            expiryDate: data.expiryDate,
            isActive: data.isActive,
            views: data.views || 0,
            applications: data.applications || 0,
            source: data.source,
            url: data.url,
            updatedAt: new Date().toISOString(),
          }
        : p
    )
    setPostings(updatedPosts)
    setDialogOpen(false)
    setEditingPost(null)
    reset()
  }

  const openCreateDialog = () => {
    setEditingPost(null)
    reset({
      title: '',
      department: 'Engineering',
      location: '',
      jobType: 'full_time',
      description: '',
      requirements: '',
      responsibilities: '',
      postedDate: new Date().toISOString().slice(0, 10),
      expiryDate: '',
      isActive: true,
      source: 'both',
      url: '',
      views: 0,
      applications: 0,
    })
    setDialogOpen(true)
  }

  const openEditDialog = (post: JobPosting) => {
    setEditingPost(post)
    reset({
      title: post.title,
      department: post.department,
      location: post.location,
      jobType: post.jobType,
      description: post.description,
      requirements: post.requirements.join('\n'),
      responsibilities: post.responsibilities.join('\n'),
      postedDate: post.postedDate,
      expiryDate: post.expiryDate,
      isActive: post.isActive,
      views: post.views,
      applications: post.applications,
      source: post.source,
      url: post.url || '',
    })
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingPost(null)
    reset()
  }

  return (
    <PageContainer>
      <PageHeader
        title="Job Postings"
        description="Create and manage job postings across platforms"
        actions={
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            New Posting
          </Button>
        }
      />

      <div className="ui-card-elevated overflow-hidden rounded-xl border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-brand-soft/60 hover:bg-brand-soft/60">
              <TableHead>Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Posted</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {postings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                  No job postings found.
                </TableCell>
              </TableRow>
            ) : (
              postings.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.department}</TableCell>
                  <TableCell>{post.location}</TableCell>
                  <TableCell>{JOB_TYPE_LABELS[post.jobType]}</TableCell>
                  <TableCell>{post.postedDate}</TableCell>
                  <TableCell>{post.views}</TableCell>
                  <TableCell>{post.applications}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        post.isActive
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }
                    >
                      {post.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setViewingPost(post); setViewDialogOpen(true); }}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(post)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Posting' : 'New Posting'}</DialogTitle>
            <DialogDescription>
              {editingPost ? 'Update the job posting details.' : 'Create a new job posting to attract candidates.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(editingPost ? handleUpdate : handleCreate)}>
            <div className="grid gap-4 py-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" {...register('title')} />
                {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={watch('department')} onValueChange={(v) => setValue('department', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Engineering', 'Product', 'Design', 'Sales', 'Human Resources', 'Finance', 'Operations'].map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && <p className="text-sm text-destructive">{errors.department.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register('location')} />
                {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Job Type</Label>
                <Select value={watch('jobType')} onValueChange={(v) => setValue('jobType', v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.jobType && <p className="text-sm text-destructive">{errors.jobType.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Source</Label>
                <Select value={watch('source')} onValueChange={(v) => setValue('source', v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="external">External</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL (optional)</Label>
                <Input id="url" {...register('url')} />
                {errors.url && <p className="text-sm text-destructive">{errors.url.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="postedDate">Posted Date</Label>
                <Input id="postedDate" type="date" {...register('postedDate')} />
                {errors.postedDate && <p className="text-sm text-destructive">{errors.postedDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input id="expiryDate" type="date" {...register('expiryDate')} />
                {errors.expiryDate && <p className="text-sm text-destructive">{errors.expiryDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="views">Views</Label>
                <Input id="views" type="number" {...register('views')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="applications">Applications</Label>
                <Input id="applications" type="number" {...register('applications')} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={3} {...register('description')} />
                {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="requirements">Requirements (one per line)</Label>
                <Textarea id="requirements" rows={2} {...register('requirements')} />
                {errors.requirements && <p className="text-sm text-destructive">{errors.requirements.message}</p>}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="responsibilities">Responsibilities (one per line)</Label>
                <Textarea id="responsibilities" rows={2} {...register('responsibilities')} />
                {errors.responsibilities && <p className="text-sm text-destructive">{errors.responsibilities.message}</p>}
              </div>
              <div className="flex items-center gap-2">
                <input id="isActive" type="checkbox" className="h-4 w-4 rounded border-input" {...register('isActive')} />
                <Label htmlFor="isActive" className="font-normal">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit">{editingPost ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Job Posting Details</DialogTitle>
            <DialogDescription>Full details of the selected job posting.</DialogDescription>
          </DialogHeader>
          {viewingPost && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#0b3d91]">{viewingPost.title}</h3>
                  <p className="text-muted-foreground">{viewingPost.department} • {viewingPost.location}</p>
                </div>
                <Badge variant="outline" className={viewingPost.isActive ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-600'}>
                  {viewingPost.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 rounded-lg bg-brand-soft/60 p-4">
                <div><span className="text-sm text-muted-foreground">Type</span><p className="font-medium">{JOB_TYPE_LABELS[viewingPost.jobType]}</p></div>
                <div><span className="text-sm text-muted-foreground">Source</span><p className="font-medium capitalize">{viewingPost.source}</p></div>
                <div><span className="text-sm text-muted-foreground">Posted</span><p className="font-medium">{viewingPost.postedDate}</p></div>
                <div><span className="text-sm text-muted-foreground">Expires</span><p className="font-medium">{viewingPost.expiryDate}</p></div>
                <div><span className="text-sm text-muted-foreground">Views</span><p className="font-medium">{viewingPost.views}</p></div>
                <div><span className="text-sm text-muted-foreground">Applications</span><p className="font-medium">{viewingPost.applications}</p></div>
                {viewingPost.url && <div className="col-span-2"><span className="text-sm text-muted-foreground">URL</span><p className="font-medium break-all">{viewingPost.url}</p></div>}
              </div>
              <div><span className="text-sm font-medium text-muted-foreground">Description</span><p className="mt-1 text-sm">{viewingPost.description}</p></div>
              <div><span className="text-sm font-medium text-muted-foreground">Requirements</span><ul className="mt-1 list-disc pl-5 text-sm">{viewingPost.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
              <div><span className="text-sm font-medium text-muted-foreground">Responsibilities</span><ul className="mt-1 list-disc pl-5 text-sm">{viewingPost.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul></div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}