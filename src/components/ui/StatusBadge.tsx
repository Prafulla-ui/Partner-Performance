import { AlertTriangle, CheckCircle2, Eye, TrendingUp } from 'lucide-react'
import type { ReactNode } from 'react'
import type { ActionStatus, KpiStatus, RecPriority, RecStatus, ReportStatus } from '../../types'

const kpiMap: Record<KpiStatus, { label: string; className: string; Icon: typeof Eye }> = {
  on_track: { label: 'On track', className: 'bg-positive-soft text-positive', Icon: CheckCircle2 },
  improving: { label: 'Improving', className: 'bg-rg-blue-soft text-rg-blue', Icon: TrendingUp },
  watch: { label: 'Watch', className: 'bg-warning-soft text-warning', Icon: Eye },
  action_needed: { label: 'Action needed', className: 'bg-danger-soft text-danger', Icon: AlertTriangle },
}

const reportMap: Record<ReportStatus, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-slate-100 text-navy-muted' },
  shared: { label: 'Shared', className: 'bg-rg-blue-soft text-rg-blue' },
}

const recMap: Record<RecStatus, { label: string; className: string }> = {
  proposed: { label: 'Proposed', className: 'bg-ai-soft text-ai' },
  accepted: { label: 'Accepted', className: 'bg-positive-soft text-positive' },
  deferred: { label: 'Deferred', className: 'bg-warning-soft text-warning' },
  rejected: { label: 'Rejected', className: 'bg-danger-soft text-danger' },
}

const priorityMap: Record<RecPriority, { label: string; className: string }> = {
  high: { label: 'High', className: 'bg-danger-soft text-danger' },
  medium: { label: 'Medium', className: 'bg-warning-soft text-warning' },
  low: { label: 'Low', className: 'bg-slate-100 text-navy-muted' },
}

const actionMap: Record<ActionStatus, { label: string; className: string }> = {
  open: { label: 'Open', className: 'bg-slate-100 text-navy-muted' },
  in_progress: { label: 'In progress', className: 'bg-warning-soft text-warning' },
  done: { label: 'Done', className: 'bg-positive-soft text-positive' },
}

function Chip({ label, className, icon }: { label: string; className: string; icon?: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      {icon}
      {label}
    </span>
  )
}

export function StatusBadge({ status }: { status: KpiStatus }) {
  const item = kpiMap[status]
  return <Chip label={item.label} className={item.className} icon={<item.Icon size={12} />} />
}

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const item = reportMap[status]
  return <Chip label={item.label} className={item.className} />
}

export function RecStatusBadge({ status }: { status: RecStatus }) {
  return <Chip label={recMap[status].label} className={recMap[status].className} />
}

export function PriorityBadge({ priority }: { priority: RecPriority }) {
  return <Chip label={priorityMap[priority].label} className={priorityMap[priority].className} />
}

export function ActionStatusBadge({ status }: { status: ActionStatus }) {
  return <Chip label={actionMap[status].label} className={actionMap[status].className} />
}
