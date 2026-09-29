import { ChevronDown, Pencil } from 'lucide-react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useReport } from '../../context/ReportContext'
import type { RecPriority, RecStatus, Recommendation } from '../../types'
import { GhostButton, SecondaryButton } from './Buttons'
import { Select } from './FilterBar'
import { PriorityBadge } from './StatusBadge'

export function RecommendationCard({ rec }: { rec: Recommendation }) {
  const { isInternal, updateRecommendation } = useReport()
  const location = useLocation()
  const isPublicShare = location.pathname.includes('/shared/')
  /** Priority edits allowed in RateGain view and in-app Client preview — not on the public share link. */
  const showPrioritySelect = !isPublicShare
  /** Visibility / accept controls only in RateGain view (never on public share). */
  const showRateGainActions = isInternal && !isPublicShare
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(rec.title)

  return (
    <article className="overflow-hidden rounded-xl border border-line bg-card">
      <button
        type="button"
        className="flex w-full items-start gap-4 px-4 py-3.5 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-400">
          {rec.rank}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-navy">{rec.title}</h3>
            <PriorityBadge priority={rec.priority} />
          </div>
          <p className="mt-1.5 text-xs text-navy-muted">
            Estimated impact <span className="font-semibold text-navy">{rec.impact}</span>
            <span className="mx-1.5 text-line">·</span>
            {rec.confidence} confidence
          </p>
        </div>
        <ChevronDown
          size={16}
          className={`mt-2 shrink-0 text-navy-muted transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="border-t border-line px-5 py-4">
          <div className="flex items-start gap-4">
            <div className="w-10 shrink-0" aria-hidden />
            <div className="min-w-0 flex-1">
              {editing ? (
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mb-3 h-8 w-full rounded-lg border border-line px-2 text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : null}
              <p className="text-sm text-navy-muted">{rec.evidence}</p>
              <div className="mt-3 flex flex-wrap items-start justify-between gap-6 text-xs">
                <div>
                  <p className="text-navy-muted">Estimated impact</p>
                  <p className="mt-0.5 font-semibold text-navy">{rec.impact}</p>
                  <p className="text-[11px] uppercase tracking-wide text-ai">Estimate</p>
                </div>
                <div className="ml-auto" onClick={(e) => e.stopPropagation()}>
                  <p className="text-navy-muted">Priority</p>
                  {showPrioritySelect ? (
                    <Select
                      value={rec.priority}
                      onChange={(v) => updateRecommendation(rec.id, { priority: v as RecPriority })}
                      size="sm"
                      className="mt-0.5 w-[120px] min-w-0"
                      options={[
                        { value: 'high', label: 'High' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'low', label: 'Low' },
                      ]}
                    />
                  ) : (
                    <p className="mt-0.5 font-semibold capitalize text-navy">{rec.priority}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-canvas p-3 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-navy-muted">Calculation assumptions</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-navy">
                  {rec.assumptions.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-navy-muted">Source metrics</p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-navy">
                  {rec.sources.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>

              {showRateGainActions && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {editing ? (
                    <SecondaryButton
                      onClick={() => {
                        updateRecommendation(rec.id, { title })
                        setEditing(false)
                      }}
                    >
                      Save title
                    </SecondaryButton>
                  ) : (
                    <GhostButton onClick={() => setEditing(true)}>
                      <Pencil size={13} />
                      Edit
                    </GhostButton>
                  )}
                  <GhostButton onClick={() => updateRecommendation(rec.id, { status: 'accepted' as RecStatus })}>
                    Accept
                  </GhostButton>
                  <GhostButton onClick={() => updateRecommendation(rec.id, { status: 'deferred' })}>Defer</GhostButton>
                  <GhostButton onClick={() => updateRecommendation(rec.id, { status: 'rejected' })}>Reject</GhostButton>
                  <label className="ml-auto flex items-center gap-2 text-xs text-navy">
                    <input
                      type="checkbox"
                      checked={rec.customerVisible}
                      onChange={(e) => updateRecommendation(rec.id, { customerVisible: e.target.checked })}
                    />
                    Mark as customer-visible
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
