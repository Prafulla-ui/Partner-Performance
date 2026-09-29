import type { ReactNode } from 'react'
import { useReport } from '../../context/ReportContext'
import type { ReportModuleId } from '../../types'
import { NotSharedBadge } from './Badges'

export function SectionHeader({
  id,
  moduleId,
  eyebrow,
  title,
  description,
  action,
  children,
}: {
  id: string
  moduleId?: ReportModuleId
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
  children?: ReactNode
}) {
  const { isInternal, isModuleShared } = useReport()
  const showNotShared = Boolean(moduleId && isInternal && !isModuleShared(moduleId))

  return (
    <div id={id} className="mb-4 scroll-mt-[var(--report-sticky-offset,10.5rem)]">
      <div className="flex items-end justify-between gap-4 border-b border-line pb-3">
        <div className="min-w-0">
          {eyebrow && (
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-rg-blue">
              {eyebrow}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold tracking-tight text-navy sm:text-lg">{title}</h2>
            {showNotShared && <NotSharedBadge />}
          </div>
          {description && (
            <p className="mt-1 max-w-3xl text-xs leading-5 text-navy-muted">{description}</p>
          )}
          {children ? <div className="mt-1">{children}</div> : null}
        </div>
        {action}
      </div>
    </div>
  )
}
