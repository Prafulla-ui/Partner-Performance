import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import { formatChange } from '../../lib/format'
import type { ChangeKind } from '../../types'

export function TrendIndicator({
  value,
  kind,
  invert = false,
}: {
  value: number
  kind: ChangeKind
  invert?: boolean
}) {
  const positive = invert ? value < 0 : value > 0
  const negative = invert ? value > 0 : value < 0
  const color = positive ? 'text-positive' : negative ? 'text-danger' : 'text-navy-muted'
  const Icon = value === 0 ? Minus : positive ? TrendingUp : TrendingDown

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium tabular ${color}`}>
      <Icon size={12} />
      {formatChange(value, kind)}
    </span>
  )
}
