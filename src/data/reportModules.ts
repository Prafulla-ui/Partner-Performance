import type { AccountType, PartnerPerspective, ReportModuleId } from '../types'

export interface ReportModuleMeta {
  id: ReportModuleId
  label: string
  description: string
  required?: boolean
  supplyOnly?: boolean
  demandOnly?: boolean
  fullStackOnly?: boolean
}

export const REPORT_MODULES: ReportModuleMeta[] = [
  {
    id: 'scorecard',
    label: 'Executive summary',
    description: 'Headline KPIs and AI narrative. Always included.',
    required: true,
  },
  {
    id: 'direct',
    label: 'Direct performance',
    description: 'Booking funnel, monthly trend and attribution.',
  },
  {
    id: 'indirect',
    label: 'Indirect channels / Market coverage',
    description: 'OTA mix and commission, or demand market coverage.',
    fullStackOnly: true,
  },
  {
    id: 'parity',
    label: 'Rate parity',
    description: 'Win / meet / loss and OTA loss table.',
    supplyOnly: true,
  },
  {
    id: 'marketing',
    label: 'Marketing and SEO',
    description: 'Organic traffic, paid media and campaigns.',
  },
  {
    id: 'outlook',
    label: 'Demand outlook',
    description: 'Forward demand posture by city.',
  },
  {
    id: 'content-score',
    label: 'Content score',
    description: 'Brand-website content quality card on the snapshot.',
    supplyOnly: true,
  },
  {
    id: 'ai-visibility',
    label: 'AI Visibility',
    description: 'Imagery quality score card on the snapshot.',
    supplyOnly: true,
  },
  {
    id: 'recommendations',
    label: 'Growth recommendations',
    description: 'Ranked actions with estimated upside.',
  },
]

export function modulesForContext(perspective: PartnerPerspective, accountType: AccountType) {
  return REPORT_MODULES.filter((m) => {
    if (m.supplyOnly && perspective !== 'supply') return false
    if (m.demandOnly && perspective !== 'demand') return false
    if (m.fullStackOnly && accountType !== 'full' && perspective === 'supply') return false
    return true
  })
}

export function defaultModulesFor(perspective: PartnerPerspective, accountType: AccountType): ReportModuleId[] {
  return modulesForContext(perspective, accountType).map((m) => m.id)
}

export const REQUIRED_MODULES: ReportModuleId[] = REPORT_MODULES.filter((m) => m.required).map((m) => m.id)
