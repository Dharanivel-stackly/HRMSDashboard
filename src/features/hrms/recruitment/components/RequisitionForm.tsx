// src/features/hrms/recruitment/components/RequisitionForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
    JOB_TYPE_OPTIONS,
    DEPARTMENT_OPTIONS,
} from '../constants/recruitment.constants'
import { Briefcase, MapPin, Users, Calendar, DollarSign, FileText, ListChecks, Sparkles } from 'lucide-react'

const requisitionFormSchema = z.object({
    title: z.string().min(3, 'Title is required'),
    department: z.string().min(1, 'Department is required'),
    location: z.string().min(2, 'Location is required'),
    jobType: z.enum(['full_time', 'part_time', 'contract', 'intern', 'temporary']),
    positions: z.coerce.number().min(1, 'At least 1 position'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    requirements: z.string().min(10, 'Requirements must be at least 10 characters'),
    qualifications: z.string().optional(),
    salaryMin: z.coerce.number().optional(),
    salaryMax: z.coerce.number().optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']),
    closingDate: z.string().min(1, 'Closing date is required'),
})

export type RequisitionFormData = z.infer<typeof requisitionFormSchema>

interface RequisitionFormProps {
    defaultValues?: Partial<RequisitionFormData>
    onSubmit: (data: RequisitionFormData) => void
    isLoading?: boolean
    submitLabel?: string
}

const departmentOptions = DEPARTMENT_OPTIONS.filter((d) => d.value !== 'all')

export function RequisitionForm({
    defaultValues,
    onSubmit,
    isLoading = false,
    submitLabel = 'Create Requisition',
}: RequisitionFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<RequisitionFormData>({
        resolver: zodResolver(requisitionFormSchema),
        defaultValues: {
            title: '',
            department: departmentOptions[0]?.value || '',
            location: '',
            jobType: 'full_time',
            positions: 1,
            description: '',
            requirements: '',
            qualifications: '',
            salaryMin: undefined,
            salaryMax: undefined,
            priority: 'medium',
            closingDate: '',
            ...defaultValues,
        },
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Hero / Header Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1a2e] via-[#152b44] to-[#1a3350] px-8 py-10 text-white shadow-xl">
                <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-sky-400/5 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 h-48 w-48 rounded-full bg-sky-500/10 blur-2xl" />
                <div className="relative flex items-start justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <span className="text-xs font-semibold uppercase tracking-widest text-sky-300">
                                New Requisition
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            Create Job Requisition
                        </h2>
                        <p className="mt-2 max-w-lg text-sm text-slate-300/80">
                            Fill in the details below to create a new job requisition. All fields
                            marked with <span className="text-sky-300">*</span> are required.
                        </p>
                    </div>
                    <div className="hidden rounded-xl bg-white/5 p-3 backdrop-blur-sm md:block">
                        <Briefcase className="h-8 w-8 text-sky-300" />
                    </div>
                </div>
            </div>

            {/* Main Form Card */}
            <Card className="overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50/80 shadow-xl shadow-slate-200/60 ring-1 ring-slate-200/50">
                <CardHeader className="border-b border-slate-100 bg-slate-50/80 px-7 py-5">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                        <FileText className="h-5 w-5 text-sky-500" />
                        Requisition Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-7 px-7 py-7">
                    {/* Row 1: Job Title (span 2), Department, Job Type, Priority */}
                    <div className="grid grid-cols-5 gap-5">
                        <div className="col-span-2 space-y-2">
                            <Label
                                htmlFor="title"
                                className="flex items-center gap-1 text-sm font-semibold text-slate-700"
                            >
                                Job Title <span className="text-sky-500">*</span>
                            </Label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="title"
                                    placeholder="e.g. Senior Software Engineer"
                                    className="h-11 border-slate-200 bg-white pl-10 text-slate-800 placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                                    {...register('title')}
                                />
                            </div>
                            {errors.title && (
                                <p className="text-sm text-red-500">{errors.title.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                                Department <span className="text-sky-500">*</span>
                            </Label>
                            <Select
                                value={watch('department')}
                                onValueChange={(v) => setValue('department', v)}
                            >
                                <SelectTrigger className="h-11 border-slate-200 bg-white text-slate-800 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20">
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    {departmentOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.department && (
                                <p className="text-sm text-red-500">{errors.department.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                                Job Type <span className="text-sky-500">*</span>
                            </Label>
                            <Select
                                value={watch('jobType')}
                                onValueChange={(v) => setValue('jobType', v as RequisitionFormData['jobType'])}
                            >
                                <SelectTrigger className="h-11 border-slate-200 bg-white text-slate-800 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20">
                                    <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {JOB_TYPE_OPTIONS.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.jobType && (
                                <p className="text-sm text-red-500">{errors.jobType.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                                Priority <span className="text-sky-500">*</span>
                            </Label>
                            <Select
                                value={watch('priority')}
                                onValueChange={(v) => setValue('priority', v as RequisitionFormData['priority'])}
                            >
                                <SelectTrigger className="h-11 border-slate-200 bg-white text-slate-800 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20">
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.priority && (
                                <p className="text-sm text-red-500">{errors.priority.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Row 2: Location, Positions, Salary Min, Salary Max, Closing Date */}
                    <div className="grid grid-cols-5 gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="location" className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                                Location <span className="text-sky-500">*</span>
                            </Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="location"
                                    placeholder="e.g. Head Office"
                                    className="h-11 border-slate-200 bg-white pl-10 text-slate-800 placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                                    {...register('location')}
                                />
                            </div>
                            {errors.location && (
                                <p className="text-sm text-red-500">{errors.location.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="positions" className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                                <Users className="mr-1 h-4 w-4 text-slate-400" />
                                Positions <span className="text-sky-500">*</span>
                            </Label>
                            <Input
                                id="positions"
                                type="number"
                                min={1}
                                className="h-11 border-slate-200 bg-white text-slate-800 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                                {...register('positions')}
                            />
                            {errors.positions && (
                                <p className="text-sm text-red-500">{errors.positions.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="salaryMin" className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                                <DollarSign className="mr-1 h-4 w-4 text-slate-400" />
                                Min Salary (₹)
                            </Label>
                            <Input
                                id="salaryMin"
                                type="number"
                                placeholder="e.g. 800000"
                                className="h-11 border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                                {...register('salaryMin')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="salaryMax" className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                                <DollarSign className="mr-1 h-4 w-4 text-slate-400" />
                                Max Salary (₹)
                            </Label>
                            <Input
                                id="salaryMax"
                                type="number"
                                placeholder="e.g. 1500000"
                                className="h-11 border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                                {...register('salaryMax')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="closingDate" className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                                <Calendar className="mr-1 h-4 w-4 text-slate-400" />
                                Closing Date <span className="text-sky-500">*</span>
                            </Label>
                            <Input
                                id="closingDate"
                                type="date"
                                className="h-11 border-slate-200 bg-white text-slate-800 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                                {...register('closingDate')}
                            />
                            {errors.closingDate && (
                                <p className="text-sm text-red-500">{errors.closingDate.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-gradient-to-r from-slate-50 to-white px-4 text-xs font-medium uppercase tracking-wider text-slate-400">
                                Job Description
                            </span>
                        </div>
                    </div>

                    {/* Row 3: Description, Requirements, Qualifications (all in one row) */}
                    <div className="grid grid-cols-3 gap-5">
                        <div className="space-y-2">
                            <Label htmlFor="description" className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                                Job Description <span className="text-sky-500">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                rows={4}
                                placeholder="Describe the role, responsibilities, and impact..."
                                className="min-h-[120px] border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                                {...register('description')}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">{errors.description.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="requirements" className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                                <ListChecks className="mr-1 h-4 w-4 text-slate-400" />
                                Key Requirements <span className="text-sky-500">*</span>
                            </Label>
                            <Textarea
                                id="requirements"
                                rows={4}
                                placeholder="List technical skills, experience, education..."
                                className="min-h-[120px] border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                                {...register('requirements')}
                            />
                            {errors.requirements && (
                                <p className="text-sm text-red-500">{errors.requirements.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="qualifications" className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                                <Sparkles className="mr-1 h-4 w-4 text-slate-400" />
                                Preferred Qualifications
                            </Label>
                            <Textarea
                                id="qualifications"
                                rows={4}
                                placeholder="Additional qualifications that are nice to have..."
                                className="min-h-[120px] border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                                {...register('qualifications')}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 rounded-2xl bg-white px-7 py-5 shadow-xl shadow-slate-200/60 ring-1 ring-slate-200/50">
                <Button
                    type="button"
                    variant="outline"
                    className="border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="min-w-[160px] bg-gradient-to-r from-[#0b1a2e] to-[#1a3350] text-white shadow-lg shadow-slate-300/40 transition-all hover:shadow-slate-400/60 hover:brightness-110 disabled:opacity-70"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Saving...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            {submitLabel}
                        </span>
                    )}
                </Button>
            </div>
        </form>
    )
}