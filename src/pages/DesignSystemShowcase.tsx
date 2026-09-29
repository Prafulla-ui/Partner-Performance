import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Drawer,
  EmptyState,
  FilterBar,
  FormField,
  FormSection,
  IconButton,
  Input,
  Modal,
  PageHeader,
  Select,
  Skeleton,
  Spinner,
  Switch,
  Table,
  Tabs,
  Textarea,
  Tooltip,
  colorPrimitives,
  radiusScale,
  spacingScale,
  typographyScale,
} from '@/design-system'

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-10 w-10 rounded-[var(--ds-radius-md)] border border-[var(--ds-border-default)]" style={{ background: value }} />
      <div>
        <p className="text-xs font-semibold text-[var(--ds-text-primary)]">{name}</p>
        <p className="font-mono text-[11px] text-[var(--ds-text-secondary)]">{value}</p>
      </div>
    </div>
  )
}

export function DesignSystemShowcase() {
  const [tab, setTab] = useState('tokens')
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [checked, setChecked] = useState(true)
  const [switched, setSwitched] = useState(false)

  return (
    <div className="min-h-screen bg-[var(--ds-bg-primary)] px-8 py-8">
      <div className="mx-auto max-w-5xl">
        <PageHeader
          title="UNIFI design system"
          description="Internal showcase — development only. Uses live design-system components."
          action={
            <Badge tone="warning" className="uppercase tracking-wide">
              Dev only
            </Badge>
          }
        />

        <Tabs
          value={tab}
          onChange={setTab}
          options={[
            { value: 'tokens', label: 'Tokens' },
            { value: 'actions', label: 'Actions' },
            { value: 'forms', label: 'Forms' },
            { value: 'display', label: 'Display' },
            { value: 'overlays', label: 'Overlays' },
          ]}
          className="mb-6"
        />

        {tab === 'tokens' && (
          <div className="space-y-6">
            <Card>
              <CardHeader title="Colour primitives" description="Stable palette mapped to semantic roles in tokens.css" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {Object.entries(colorPrimitives).map(([name, value]) => (
                  <Swatch key={name} name={name} value={value} />
                ))}
              </div>
            </Card>
            <Card>
              <CardHeader title="Semantic roles (live)" description="Resolved from CSS custom properties" />
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  ['bg-primary', 'var(--ds-bg-primary)'],
                  ['bg-elevated', 'var(--ds-bg-elevated)'],
                  ['text-primary', 'var(--ds-text-primary)'],
                  ['brand-primary', 'var(--ds-brand-primary)'],
                  ['border-default', 'var(--ds-border-default)'],
                  ['feedback-success', 'var(--ds-feedback-success)'],
                  ['feedback-warning', 'var(--ds-feedback-warning)'],
                  ['feedback-error', 'var(--ds-feedback-error)'],
                ].map(([name, value]) => (
                  <Swatch key={name} name={name} value={value} />
                ))}
              </div>
            </Card>
            <Card>
              <CardHeader title="Typography scale" />
              <div className="space-y-3">
                {Object.entries(typographyScale).map(([name, t]) => (
                  <p
                    key={name}
                    style={{
                      fontSize: t.size,
                      fontWeight: t.weight,
                      lineHeight: t.lineHeight,
                      letterSpacing: 'tracking' in t ? t.tracking : undefined,
                    }}
                    className="text-[var(--ds-text-primary)]"
                  >
                    {name} — The quick brown fox
                  </p>
                ))}
              </div>
            </Card>
            <Card>
              <CardHeader title="Spacing & radius" />
              <div className="flex flex-wrap items-end gap-3">
                {Object.entries(spacingScale).map(([k, v]) => (
                  <div key={k} className="text-center">
                    <div className="bg-[var(--ds-brand-primary-soft)]" style={{ width: v, height: v }} />
                    <p className="mt-1 text-[10px] text-[var(--ds-text-secondary)]">{k}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {Object.entries(radiusScale).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex h-12 w-12 items-center justify-center border border-[var(--ds-border-default)] bg-[var(--ds-surface-muted)] text-[10px]"
                    style={{ borderRadius: v }}
                  >
                    {k}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {tab === 'actions' && (
          <Card className="space-y-4">
            <CardHeader title="Buttons" />
            <div className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button leftIcon={<Plus size={14} />}>With icon</Button>
              <IconButton label="Search">
                <Search size={16} />
              </IconButton>
            </div>
          </Card>
        )}

        {tab === 'forms' && (
          <div className="space-y-4">
            <FormSection title="Form controls" description="Labels, helper text, and validation states">
              <FilterBar>
                <FormField label="Search" htmlFor="ds-search">
                  <Input id="ds-search" placeholder="Search reports…" />
                </FormField>
                <FormField label="Period" htmlFor="ds-period">
                  <Select
                    id="ds-period"
                    options={[
                      { value: 'month', label: 'Month' },
                      { value: 'quarter', label: 'Quarter' },
                      { value: 'ytd', label: 'YTD' },
                    ]}
                    defaultValue="month"
                  />
                </FormField>
              </FilterBar>
              <FormField label="Notes" htmlFor="ds-notes" helper="Optional context for the review">
                <Textarea id="ds-notes" rows={3} placeholder="Add notes…" />
              </FormField>
              <FormField label="Invalid field" htmlFor="ds-invalid" error="This field is required">
                <Input id="ds-invalid" invalid placeholder="Required" />
              </FormField>
              <div className="flex flex-wrap gap-6">
                <Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} label="Include parity module" />
                <Switch checked={switched} onChange={setSwitched} label="Notify hotelier" />
              </div>
            </FormSection>
          </div>
        )}

        {tab === 'display' && (
          <div className="space-y-4">
            <Card>
              <CardHeader title="Badges & feedback" />
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge>Neutral</Badge>
                <Badge tone="brand">Brand</Badge>
                <Badge tone="success">Success</Badge>
                <Badge tone="warning">Warning</Badge>
                <Badge tone="danger">Danger</Badge>
                <Badge tone="info">Info</Badge>
              </div>
              <div className="space-y-2">
                <Alert tone="info" title="Info">
                  Module selection is saved with the report.
                </Alert>
                <Alert tone="success" title="Success">
                  Report shared with hotelier.
                </Alert>
                <Alert tone="warning" title="Warning">
                  Custom date range exceeds 90 days.
                </Alert>
                <Alert tone="error" title="Error">
                  Unable to save changes.
                </Alert>
              </div>
            </Card>
            <Card>
              <CardHeader title="Table" />
              <Table
                headers={['Property', 'RevPAR', 'Status']}
                rows={[
                  ['Grand Plaza', '$142', <Badge key="ok" tone="success">On track</Badge>],
                  ['Harbour Inn', '$118', <Badge key="warn" tone="warning">Watch</Badge>],
                ]}
              />
            </Card>
            <div className="flex items-center gap-4">
              <Spinner />
              <Skeleton className="h-8 w-48" />
              <Tooltip text="Helpful context for this control">
                <Button variant="secondary" size="sm">
                  Hover for tooltip
                </Button>
              </Tooltip>
            </div>
            <EmptyState
              title="No reports yet"
              body="Generate a partner performance report to get started."
              action={<Button size="sm">Generate report</Button>}
            />
          </div>
        )}

        {tab === 'overlays' && (
          <Card className="space-y-4">
            <CardHeader title="Modal & drawer" />
            <div className="flex gap-2">
              <Button onClick={() => setModalOpen(true)}>Open modal</Button>
              <Button variant="secondary" onClick={() => setDrawerOpen(true)}>
                Open drawer
              </Button>
            </div>
            <Modal
              open={modalOpen}
              title="Confirm action"
              onClose={() => setModalOpen(false)}
              footer={
                <>
                  <Button variant="secondary" onClick={() => setModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setModalOpen(false)}>Confirm</Button>
                </>
              }
            >
              <p className="text-sm text-[var(--ds-text-secondary)]">
                This dialog uses Escape and backdrop click to close.
              </p>
            </Modal>
            <Drawer open={drawerOpen} title="Filter drawer" onClose={() => setDrawerOpen(false)}>
              <p className="text-sm text-[var(--ds-text-secondary)]">
                Side drawer pattern for filters and secondary flows.
              </p>
            </Drawer>
          </Card>
        )}
      </div>
    </div>
  )
}
