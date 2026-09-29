import { defaultModulesFor, modulesForContext, REQUIRED_MODULES } from '../../data/reportModules'
import type { AccountType, PartnerPerspective, ReportModuleId } from '../../types'

export function ModuleChecklist({
  perspective,
  accountType,
  value,
  onChange,
}: {
  perspective: PartnerPerspective
  accountType: AccountType
  value: ReportModuleId[]
  onChange: (ids: ReportModuleId[]) => void
}) {
  const available = modulesForContext(perspective, accountType)

  const toggle = (id: ReportModuleId, required?: boolean) => {
    if (required) return
    if (value.includes(id)) onChange(value.filter((m) => m !== id))
    else onChange([...value, id])
  }

  const selectAll = () => onChange(available.map((m) => m.id))
  const clearOptional = () =>
    onChange(available.filter((m) => m.required || REQUIRED_MODULES.includes(m.id)).map((m) => m.id))

  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-navy-muted">
            Modules to include in client report
          </p>
          <p className="mt-1 text-xs text-navy-muted">
            Choose what hoteliers and Client preview will see. Executive summary stays on.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" className="text-[11px] font-semibold text-rg-blue" onClick={selectAll}>
            Select all
          </button>
          <button type="button" className="text-[11px] font-semibold text-navy-muted" onClick={clearOptional}>
            Clear optional
          </button>
        </div>
      </div>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {available.map((mod) => {
          const checked = value.includes(mod.id)
          return (
            <li key={mod.id} className="min-w-0">
              <label
                className={`flex h-full cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition-colors ${
                  checked ? 'border-rg-blue/40 bg-rg-blue-soft/40' : 'border-line bg-canvas/60'
                } ${mod.required ? 'cursor-default' : ''}`}
              >
                <input
                  type="checkbox"
                  className="mt-0.5"
                  checked={checked}
                  disabled={mod.required}
                  onChange={() => toggle(mod.id, mod.required)}
                />
                <span className="min-w-0">
                  <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-navy">
                    {mod.label}
                    {mod.required && (
                      <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-navy-muted">
                        Required
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-xs text-navy-muted">{mod.description}</span>
                </span>
              </label>
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        className="mt-3 text-[11px] font-semibold text-navy-muted hover:text-navy"
        onClick={() => onChange(defaultModulesFor(perspective, accountType))}
      >
        Reset to defaults for this stack
      </button>
    </div>
  )
}
