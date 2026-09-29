import { useReport } from '../../context/ReportContext'
import type { CompareWith } from '../../types'
import { Select } from './FilterBar'

export function ComparisonSelector() {
  const { compareWith, setCompareWith, previousCompareLabel, previousCompareName, lyCompareLabel, lyCompareName } =
    useReport()

  return (
    <div className="flex min-w-[200px] flex-col gap-0.5">
      <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-navy-muted">Compare with</span>
      <Select
        value={compareWith}
        onChange={(v) => setCompareWith(v as CompareWith)}
        size="sm"
        placeholder="Select"
        options={[
          { value: 'none', label: 'Select' },
          {
            value: 'previous',
            label: `${previousCompareLabel} · ${previousCompareName}`,
          },
          {
            value: 'ly',
            label: `${lyCompareLabel} · ${lyCompareName}`,
          },
          {
            value: 'both',
            label: `Both · ${previousCompareName} and ${lyCompareName}`,
          },
        ]}
      />
    </div>
  )
}
