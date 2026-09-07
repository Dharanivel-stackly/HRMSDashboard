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
import type { JobPosting } from '@/features/hrms/recruitment/types/recruitment.types'
import { useJobPostings } from '@/features/hrms/recruitment/hooks/useRecruitment'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import {
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  MapPin,
  Building2,
  Users,
  FileText,
  ListChecks,
  CheckCircle,
  Briefcase,
  Link,
  CalendarClock,
  BarChart3,
  Rocket,
  Calendar,
  Globe,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils/cn'

// Form Schema (unchanged)
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

const generateId = () => `jp-${Date.now()}`

export default function JobPosting() {
  const { data: postings = [], isLoading, isError, refetch} = useJobPostings()
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
    refetch()
    setDialogOpen(false)
    reset()
  }

  const handleUpdate = (data: JobPostingFormData) => {
    if (!editingPost) return
    refetch()
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

  if (isLoading) return <LoadingState variant="page" />
  if (isError) return <ErrorState onRetry={refetch} />

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

      {/* Table (unchanged) */}
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

      {/* Create/Edit Dialog (already colorful) - unchanged for brevity */}
      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl p-0">
          {/* Header with multi-color gradient */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/20 p-2">
                {editingPost ? <Edit className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  {editingPost ? 'Edit Job Posting' : 'Create New Job Posting'}
                </DialogTitle>
                <DialogDescription className="text-white/80">
                  {editingPost ? 'Update the job posting details.' : 'Fill in the details to attract top talent.'}
                </DialogDescription>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(editingPost ? handleUpdate : handleCreate)}>
            <div className="space-y-6 px-6 py-6">
              {/* Section: Basic Info */}
              <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-indigo-700">
                  <Briefcase className="h-4 w-4" />
                  <span>Basic Information</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="title" className="text-slate-700">
                      Job Title <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="e.g. Senior Software Engineer"
                      className="border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                      {...register('title')}
                    />
                    {errors.title && <p className="text-sm text-rose-500">{errors.title.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700">
                      Department <span className="text-rose-500">*</span>
                    </Label>
                    <Select value={watch('department')} onValueChange={(v) => setValue('department', v)}>
                      <SelectTrigger className="border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {['Engineering', 'Product', 'Design', 'Sales', 'Human Resources', 'Finance', 'Operations'].map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.department && <p className="text-sm text-rose-500">{errors.department.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700">
                      Job Type <span className="text-rose-500">*</span>
                    </Label>
                    <Select value={watch('jobType')} onValueChange={(v) => setValue('jobType', v as any)}>
                      <SelectTrigger className="border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20">
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(JOB_TYPE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.jobType && <p className="text-sm text-rose-500">{errors.jobType.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700">
                      Source <span className="text-rose-500">*</span>
                    </Label>
                    <Select value={watch('source')} onValueChange={(v) => setValue('source', v as any)}>
                      <SelectTrigger className="border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20">
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">Internal</SelectItem>
                        <SelectItem value="external">External</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.source && <p className="text-sm text-rose-500">{errors.source.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-slate-700">
                      Location <span className="text-rose-500">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="location"
                        placeholder="e.g. Bangalore, India"
                        className="border-slate-200 pl-10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                        {...register('location')}
                      />
                    </div>
                    {errors.location && <p className="text-sm text-rose-500">{errors.location.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url" className="text-slate-700">URL (optional)</Label>
                    <div className="relative">
                      <Link className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="url"
                        placeholder="https://company.com/careers"
                        className="border-slate-200 pl-10 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                        {...register('url')}
                      />
                    </div>
                    {errors.url && <p className="text-sm text-rose-500">{errors.url.message}</p>}
                  </div>
                </div>
              </div>

              {/* Section: Dates & Metrics */}
              <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-purple-700">
                  <CalendarClock className="h-4 w-4" />
                  <span>Dates & Metrics</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="postedDate" className="text-slate-700">
                      Posted Date <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="postedDate"
                      type="date"
                      className="border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                      {...register('postedDate')}
                    />
                    {errors.postedDate && <p className="text-sm text-rose-500">{errors.postedDate.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate" className="text-slate-700">
                      Expiry Date <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      className="border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                      {...register('expiryDate')}
                    />
                    {errors.expiryDate && <p className="text-sm text-rose-500">{errors.expiryDate.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="views" className="text-slate-700">Views</Label>
                    <div className="relative">
                      <BarChart3 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="views"
                        type="number"
                        placeholder="0"
                        className="border-slate-200 pl-10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                        {...register('views')}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="applications" className="text-slate-700">Applications</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="applications"
                        type="number"
                        placeholder="0"
                        className="border-slate-200 pl-10 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                        {...register('applications')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Description & Content */}
              <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                  <FileText className="h-4 w-4" />
                  <span>Job Description & Content</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-1">
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-700">
                      Description <span className="text-rose-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      rows={3}
                      placeholder="Describe the role, responsibilities, and impact..."
                      className="border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                      {...register('description')}
                    />
                    {errors.description && <p className="text-sm text-rose-500">{errors.description.message}</p>}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="requirements" className="text-slate-700">
                        Requirements <span className="text-rose-500">*</span> <span className="text-xs text-slate-400">(one per line)</span>
                      </Label>
                      <Textarea
                        id="requirements"
                        rows={3}
                        placeholder="e.g. React, Node.js, 5+ years experience"
                        className="border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                        {...register('requirements')}
                      />
                      {errors.requirements && <p className="text-sm text-rose-500">{errors.requirements.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responsibilities" className="text-slate-700">
                        Responsibilities <span className="text-rose-500">*</span> <span className="text-xs text-slate-400">(one per line)</span>
                      </Label>
                      <Textarea
                        id="responsibilities"
                        rows={3}
                        placeholder="e.g. Architect scalable solutions, Mentor junior devs"
                        className="border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20"
                        {...register('responsibilities')}
                      />
                      {errors.responsibilities && <p className="text-sm text-rose-500">{errors.responsibilities.message}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Active checkbox */}
              <div className="flex items-center gap-2">
                <input
                  id="isActive"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-400/20"
                  {...register('isActive')}
                />
                <Label htmlFor="isActive" className="font-normal text-slate-700">Active</Label>
              </div>
            </div>

            <DialogFooter className="border-t border-slate-100 px-6 py-4 gap-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700">
                {editingPost ? (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Update Posting
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Create Posting
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Dialog - Enhanced with colorful cards & left borders */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl p-0 animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-10 duration-300">
          {viewingPost && (
            <div className="flex flex-col">
              {/* Header with multi-color gradient */}
              <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-6 py-5 animate-in slide-in-from-top-5 duration-500">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-white/80" />
                      {viewingPost.title}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-white/80">
                      <Building2 className="h-4 w-4" />
                      <span>{viewingPost.department}</span>
                      <span className="text-white/40">•</span>
                      <MapPin className="h-4 w-4" />
                      <span>{viewingPost.location}</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      'border-2 px-3 py-1 text-sm font-semibold shadow-lg',
                      viewingPost.isActive
                        ? 'border-emerald-300 bg-emerald-100/20 text-emerald-300'
                        : 'border-slate-300 bg-slate-100/20 text-slate-300'
                    )}
                  >
                    {viewingPost.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>

              {/* Content with staggered animations */}
              <div className="space-y-5 px-6 py-5">
                {/* Metadata grid with colorful cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gradient-to-br from-sky-50 to-blue-50 p-4 border border-sky-200 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-300 delay-100">
                    <p className="text-xs font-medium uppercase tracking-wider text-sky-600">Type</p>
                    <p className="mt-1 font-semibold text-slate-800">{JOB_TYPE_LABELS[viewingPost.jobType]}</p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 p-4 border border-amber-200 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-300 delay-150">
                    <p className="text-xs font-medium uppercase tracking-wider text-amber-600">Source</p>
                    <p className="mt-1 font-semibold text-slate-800 capitalize">{viewingPost.source}</p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 p-4 border border-emerald-200 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-300 delay-200">
                    <p className="text-xs font-medium uppercase tracking-wider text-emerald-600">Posted</p>
                    <p className="mt-1 font-semibold text-slate-800">{viewingPost.postedDate}</p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-rose-50 to-red-50 p-4 border border-rose-200 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-300 delay-250">
                    <p className="text-xs font-medium uppercase tracking-wider text-rose-600">Expires</p>
                    <p className="mt-1 font-semibold text-slate-800">{viewingPost.expiryDate}</p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 p-4 border border-indigo-200 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-300 delay-300">
                    <p className="text-xs font-medium uppercase tracking-wider text-indigo-600">Views</p>
                    <p className="mt-1 font-semibold text-slate-800">{viewingPost.views}</p>
                  </div>
                  <div className="rounded-lg bg-gradient-to-br from-teal-50 to-cyan-50 p-4 border border-teal-200 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-300 delay-350">
                    <p className="text-xs font-medium uppercase tracking-wider text-teal-600">Applications</p>
                    <p className="mt-1 font-semibold text-slate-800">{viewingPost.applications}</p>
                  </div>
                  {viewingPost.url && (
                    <div className="col-span-2 rounded-lg bg-gradient-to-br from-slate-50 to-gray-50 p-4 border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-5 duration-300 delay-400">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-500">URL</p>
                      <a
                        href={viewingPost.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block text-sm font-medium text-sky-600 hover:underline hover:text-sky-800 transition-colors"
                      >
                        {viewingPost.url}
                      </a>
                    </div>
                  )}
                </div>

                {/* Description with left border accent */}
                <div className="animate-in fade-in slide-in-from-bottom-5 duration-300 delay-450">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <FileText className="h-4 w-4 text-blue-500" />
                    Description
                  </h4>
                  <div className="rounded-lg border-l-4 border-blue-500 bg-white p-3 text-sm text-slate-700 shadow-sm">
                    {viewingPost.description}
                  </div>
                </div>

                {/* Requirements with left border accent */}
                <div className="animate-in fade-in slide-in-from-bottom-5 duration-300 delay-500">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <ListChecks className="h-4 w-4 text-amber-500" />
                    Requirements
                  </h4>
                  <ul className="list-disc space-y-1 rounded-lg border-l-4 border-amber-500 bg-white p-3 pl-6 text-sm text-slate-700 shadow-sm">
                    {viewingPost.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

                {/* Responsibilities with left border accent */}
                <div className="animate-in fade-in slide-in-from-bottom-5 duration-300 delay-550">
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    Responsibilities
                  </h4>
                  <ul className="list-disc space-y-1 rounded-lg border-l-4 border-emerald-500 bg-white p-3 pl-6 text-sm text-slate-700 shadow-sm">
                    {viewingPost.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <DialogFooter className="border-t border-slate-100 px-6 py-4">
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageContainer>
  )
}