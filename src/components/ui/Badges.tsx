import { Eye, EyeOff, Lock } from 'lucide-react'

const INTERNAL_ONLY_HINT =
  'Visible only in RateGain view. Hidden in Client preview and when this report is shared with the hotelier.'

export function InternalOnlyBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span
      title={INTERNAL_ONLY_HINT}
      className={`inline-flex items-center gap-1 rounded-md border border-line bg-canvas font-medium normal-case tracking-normal text-navy-muted ${
        compact ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]'
      }`}
    >
      <Lock size={compact ? 9 : 10} className="shrink-0" aria-hidden />
      Internal
    </span>
  )
}

export function NotSharedBadge() {
  return (
    <span
      title="This module is turned off for the client version of the report."
      className="inline-flex items-center gap-1 rounded-full bg-warning-soft px-2 py-0.5 text-[11px] font-medium text-warning"
    >
      <EyeOff size={11} aria-hidden />
      Not shared with client
    </span>
  )
}

export function CustomerVisibleBadge({ visible }: { visible: boolean }) {
  return (
    <span
      title={
        visible
          ? 'This item appears in Client preview and on shared report links.'
          : 'This item is hidden from Client preview and shared report links.'
      }
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
        visible ? 'bg-teal-soft text-teal' : 'bg-slate-100 text-navy-muted'
      }`}
    >
      <Eye size={11} aria-hidden />
      {visible ? 'Customer visible' : 'Hidden from customer'}
    </span>
  )
}

export function DemoDataBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-warning-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-warning">
      Demo
    </span>
  )
}
