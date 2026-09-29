import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReport } from '../context/ReportContext'
import { getPartnerScopeTree, partners } from '../data/grandMeridian'
import { defaultModulesFor } from '../data/reportModules'
import { formatCustomPeriodLabel, PRESET_PERIOD_RANGES } from '../lib/period'
import type {
  AccountType,
  CompareWith,
  Granularity,
  OutputFormat,
  PartnerPerspective,
  ReportModuleId,
  ViewPeriod,
} from '../types'
import { PrimaryButton, SecondaryButton } from './ui/Buttons'
import { Field, Select } from './ui/FilterBar'
import { ModuleChecklist } from './ui/ModuleChecklist'
import { PeriodSelector } from './ui/PeriodSelector'
import { SideDrawer } from './ui/SideDrawer'

const ALL = 'all'

const COMPARE_OPTIONS: Record<ViewPeriod, { value: CompareWith; label: string }[]> = {
  month: [
    { value: 'none', label: 'No comparison' },
    { value: 'previous', label: 'Previous month · May 2026' },
    { value: 'ly', label: 'Same month last year · June 2025' },
    { value: 'both', label: 'Both previous & last year' },
  ],
  quarter: [
    { value: 'none', label: 'No comparison' },
    { value: 'previous', label: 'Previous quarter · Q1 2026' },
    { value: 'ly', label: 'Same quarter last year · Q2 2025' },
    { value: 'both', label: 'Both previous & last year' },
  ],
  ytd: [
    { value: 'none', label: 'No comparison' },
    { value: 'previous', label: 'Prior year-to-date · YTD 2025' },
    { value: 'ly', label: 'Same YTD last year · YTD 2025' },
    { value: 'both', label: 'Both previous & last year' },
  ],
  custom: [
    { value: 'none', label: 'No comparison' },
    { value: 'previous', label: 'Previous period' },
    { value: 'ly', label: 'Same dates last year' },
    { value: 'both', label: 'Both previous & last year' },
  ],
}

const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD — US Dollar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'GBP', label: 'GBP — British Pound' },
  { value: 'AED', label: 'AED — UAE Dirham' },
  { value: 'SGD', label: 'SGD — Singapore Dollar' },
  { value: 'INR', label: 'INR — Indian Rupee' },
]

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="rounded-xl border border-line bg-[var(--ds-surface-muted)] p-4 sm:p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-navy">{title}</h3>
        {description ? <p className="mt-0.5 text-xs leading-5 text-navy-muted">{description}</p> : null}
      </div>
      {children}
    </section>
  )
}

export function GenerateReportDrawer({
  open,
  onClose,
  initialPartner,
}: {
  open: boolean
  onClose: () => void
  initialPartner?: string
}) {
  const navigate = useNavigate()
  const {
    setPerspective,
    setAccountType,
    setPartnerName,
    setViewPeriod,
    setCompareWith,
    setEnabledModules,
    setCustomRange,
    viewPeriod: ctxViewPeriod,
    customFrom: ctxCustomFrom,
    customTo: ctxCustomTo,
    compareWith: ctxCompareWith,
    openBrand,
    openProperty,
    goToScope,
    resetScope,
  } = useReport()
  const [step, setStep] = useState<'form' | 'progress'>('form')
  const [progress, setProgress] = useState(12)
  const [partner, setPartner] = useState(partners[0])
  const [perspective, setLocalPerspective] = useState<PartnerPerspective>('supply')
  const [accountType, setLocalAccount] = useState<AccountType>('full')
  const [viewPeriod, setLocalPeriod] = useState<ViewPeriod>('quarter')
  const [customFrom, setCustomFrom] = useState('2026-04-01')
  const [customTo, setCustomTo] = useState('2026-06-30')
  const [compare, setCompare] = useState<CompareWith>('none')
  const [granularity, setGranularity] = useState<Granularity>('monthly')
  const [brandId, setBrandId] = useState(ALL)
  const [propertyId, setPropertyId] = useState(ALL)
  const [currency, setCurrency] = useState('USD')
  const [output, setOutput] = useState<OutputFormat>('in_app')
  const [modules, setModules] = useState<ReportModuleId[]>(() => defaultModulesFor('supply', 'full'))

  const scopeTree = useMemo(() => getPartnerScopeTree(partner), [partner])
  /** Only when partner has multiple brands and multiple properties. */
  const showBrandAndProperty = scopeTree.brands.length > 1 && scopeTree.properties.length > 1
  const propertyOptions = useMemo(() => {
    if (!showBrandAndProperty) return []
    if (brandId === ALL) return scopeTree.properties
    return scopeTree.properties.filter((p) => p.brandId === brandId)
  }, [showBrandAndProperty, scopeTree.properties, brandId])

  const compareOptions = COMPARE_OPTIONS[viewPeriod]
  const customRangeComplete = Boolean(customFrom && customTo)
  const canGenerate = viewPeriod !== 'custom' || customRangeComplete

  useEffect(() => {
    if (!open) return
    setModules(defaultModulesFor(perspective, accountType))
  }, [perspective, accountType, open])

  useEffect(() => {
    if (!open) return
    if (initialPartner && partners.includes(initialPartner)) {
      setPartner(initialPartner)
    } else if (!initialPartner) {
      setPartner(partners[0])
    }
    setBrandId(ALL)
    setPropertyId(ALL)
    setLocalPeriod(ctxViewPeriod)
    setCustomFrom(ctxCustomFrom)
    setCustomTo(ctxCustomTo)
    setCompare(ctxCompareWith)
  }, [open, initialPartner, ctxViewPeriod, ctxCustomFrom, ctxCustomTo, ctxCompareWith])

  useEffect(() => {
    setBrandId(ALL)
    setPropertyId(ALL)
  }, [partner])

  useEffect(() => {
    setPropertyId(ALL)
  }, [brandId])

  const scopeSummary = (() => {
    if (!showBrandAndProperty) return partner
    if (propertyId !== ALL) {
      const prop = scopeTree.properties.find((p) => p.id === propertyId)
      return prop?.name ?? partner
    }
    if (brandId !== ALL) {
      const brand = scopeTree.brands.find((b) => b.id === brandId)
      return brand?.name ?? partner
    }
    return `${partner} · All brands · All properties`
  })()

  const periodSummary =
    viewPeriod === 'custom'
      ? customRangeComplete
        ? formatCustomPeriodLabel(customFrom, customTo)
        : 'Custom dates'
      : PRESET_PERIOD_RANGES[viewPeriod]

  const generate = () => {
    if (!canGenerate) return
    setStep('progress')
    setProgress(18)
    const ticks = [42, 67, 88, 100]
    ticks.forEach((value, i) => {
      window.setTimeout(() => {
        setProgress(value)
        if (value === 100) {
          window.setTimeout(() => {
            setPerspective(perspective)
            setAccountType(accountType)
            setPartnerName(partner)
            setViewPeriod(viewPeriod)
            setCompareWith(compare)
            setEnabledModules(modules)
            if (viewPeriod === 'custom') {
              setCustomRange(customFrom, customTo)
            }

            const isGrandMeridian = partner === partners[0]
            if (isGrandMeridian) {
              resetScope()
              if (
                showBrandAndProperty &&
                propertyId !== ALL &&
                scopeTree.properties.some((p) => p.id === propertyId)
              ) {
                openProperty(propertyId)
              } else if (
                showBrandAndProperty &&
                brandId !== ALL &&
                scopeTree.brands.some((b) => b.id === brandId)
              ) {
                openBrand(brandId)
              } else {
                goToScope('chain')
              }
            }

            setStep('form')
            setProgress(12)
            onClose()
            navigate('/reports/grand-meridian-q2-2026')
          }, 350)
        }
      }, 350 * (i + 1))
    })
  }

  return (
    <SideDrawer
      open={open}
      onClose={() => {
        if (step === 'form') onClose()
      }}
      title={step === 'form' ? 'Generate report' : 'Assembling report'}
      width="max-w-4xl"
      footer={
        step === 'form' ? (
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-navy-muted">
              {viewPeriod === 'custom' && !customRangeComplete
                ? 'Select a custom date range to continue.'
                : `${periodSummary} · ${granularity} · ${currency}`}
            </p>
            <div className="flex gap-2">
              <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
              <PrimaryButton onClick={generate} disabled={!canGenerate}>
                Generate Report
              </PrimaryButton>
            </div>
          </div>
        ) : null
      }
    >
      {step === 'progress' ? (
        <div className="py-12">
          <p className="text-sm text-navy-muted">
            Rolling up {scopeSummary} · {periodSummary} · {granularity} · {currency} ·{' '}
            {output.replace('_', ' ')} · {modules.length} modules
          </p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-canvas">
            <div className="h-full bg-rg-blue transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs font-medium text-rg-blue">{progress}% complete</p>
        </div>
      ) : (
        <div className="space-y-5">
          <FormSection
            title="Partner scope"
            description="Choose who this report is for and, when available, the brand or property slice."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Partner" className="sm:col-span-2">
                <Select
                  value={partner}
                  onChange={setPartner}
                  className="min-w-0 w-full"
                  searchPlaceholder="Search partners"
                  options={partners.map((p) => ({ value: p, label: p }))}
                />
              </Field>

              {showBrandAndProperty ? (
                <>
                  <Field label="Brand">
                    <Select
                      value={brandId}
                      onChange={setBrandId}
                      className="min-w-0 w-full"
                      searchPlaceholder="Search brands"
                      options={[
                        { value: ALL, label: 'All brands' },
                        ...scopeTree.brands.map((b) => ({ value: b.id, label: b.name })),
                      ]}
                    />
                  </Field>
                  <Field label="Property">
                    <Select
                      value={propertyId}
                      onChange={setPropertyId}
                      className="min-w-0 w-full"
                      searchPlaceholder="Search properties"
                      options={[
                        {
                          value: ALL,
                          label: brandId === ALL ? 'All properties' : 'All properties in brand',
                        },
                        ...propertyOptions.map((p) => ({ value: p.id, label: p.name })),
                      ]}
                    />
                  </Field>
                </>
              ) : null}

              <Field label="Partner perspective">
                <Select
                  value={perspective}
                  onChange={(v) => setLocalPerspective(v as PartnerPerspective)}
                  className="min-w-0 w-full"
                  options={[
                    { value: 'supply', label: 'Supply Partner' },
                    { value: 'demand', label: 'Demand Partner' },
                  ]}
                />
              </Field>
              <Field label="Account type">
                <Select
                  value={accountType}
                  onChange={(v) => setLocalAccount(v as AccountType)}
                  className="min-w-0 w-full"
                  options={[
                    { value: 'full', label: 'Full Stack' },
                    { value: 'direct', label: 'Direct Stack' },
                  ]}
                />
              </Field>
            </div>
          </FormSection>

          <FormSection
            title="Period & comparison"
            description="Same Period control as the report filter bar — Month, Quarter, YTD, or Custom."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <PeriodSelector
                  value={viewPeriod}
                  onPeriodChange={(next) => {
                    setLocalPeriod(next)
                    setCompare('none')
                  }}
                  customFrom={customFrom}
                  customTo={customTo}
                  onCustomRangeChange={(from, to) => {
                    setCustomFrom(from)
                    setCustomTo(to)
                    setLocalPeriod('custom')
                    setCompare('none')
                  }}
                  size="md"
                />
              </div>

              <Field label="Compare with">
                <Select
                  value={compare}
                  onChange={(v) => setCompare(v as CompareWith)}
                  className="min-w-0 w-full"
                  options={compareOptions}
                />
              </Field>
              <Field label="Granularity">
                <Select
                  value={granularity}
                  onChange={(v) => setGranularity(v as Granularity)}
                  className="min-w-0 w-full"
                  options={[
                    { value: 'daily', label: 'Daily' },
                    { value: 'weekly', label: 'Weekly' },
                    { value: 'monthly', label: 'Monthly' },
                  ]}
                />
              </Field>
            </div>
          </FormSection>

          <FormSection title="Delivery" description="Choose currency and how the report should be delivered.">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Currency">
                <Select
                  value={currency}
                  onChange={setCurrency}
                  className="min-w-0 w-full"
                  options={CURRENCY_OPTIONS}
                />
              </Field>
              <Field label="Output">
                <Select
                  value={output}
                  onChange={(v) => setOutput(v as OutputFormat)}
                  className="min-w-0 w-full"
                  options={[
                    { value: 'in_app', label: 'In-app' },
                    { value: 'pdf', label: 'PDF' },
                    { value: 'xlsx', label: 'XLSX' },
                    { value: 'email', label: 'Scheduled email' },
                  ]}
                />
              </Field>
            </div>
          </FormSection>

          <ModuleChecklist
            perspective={perspective}
            accountType={accountType}
            value={modules}
            onChange={setModules}
          />
        </div>
      )}
    </SideDrawer>
  )
}
