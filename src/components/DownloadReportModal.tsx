import { FileSpreadsheet, FileText, Presentation } from 'lucide-react'
import { useState } from 'react'
import { ConfirmModal } from './ui/ConfirmModal'
import { PrimaryButton, SecondaryButton } from './ui/Buttons'

const formats = [
  {
    id: 'pdf',
    label: 'PDF',
    detail: 'Client-ready report for email or print.',
    Icon: FileText,
  },
  {
    id: 'xlsx',
    label: 'Excel',
    detail: 'KPI, channel and recommendation tables.',
    Icon: FileSpreadsheet,
  },
  {
    id: 'pptx',
    label: 'PowerPoint',
    detail: 'Slide pack for the business review.',
    Icon: Presentation,
  },
] as const

export function DownloadReportModal({
  open,
  onClose,
  partner,
}: {
  open: boolean
  onClose: () => void
  partner: string
}) {
  const [format, setFormat] = useState<(typeof formats)[number]['id']>('pdf')
  const [status, setStatus] = useState<'idle' | 'working' | 'ready'>('idle')

  const generate = () => {
    setStatus('working')
    window.setTimeout(() => setStatus('ready'), 700)
  }

  const close = () => {
    setStatus('idle')
    onClose()
  }

  const selected = formats.find((item) => item.id === format) ?? formats[0]

  return (
    <ConfirmModal
      open={open}
      title="Download report"
      onClose={close}
      width="max-w-xl"
      footer={
        status === 'ready' ? (
          <PrimaryButton onClick={close}>Close</PrimaryButton>
        ) : (
          <>
            <SecondaryButton onClick={close}>Cancel</SecondaryButton>
            <PrimaryButton onClick={generate} disabled={status === 'working'}>
              {status === 'working' ? 'Generating…' : `Generate ${selected.label}`}
            </PrimaryButton>
          </>
        )
      }
    >
      {status === 'ready' ? (
        <p className="text-sm text-navy-muted">
          {selected.label} for {partner} is ready in this prototype. In production the file would download to the
          account manager’s device.
        </p>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-navy-muted">Choose a format for the account manager to take into the review.</p>
          <div className="grid grid-cols-3 gap-2">
            {formats.map((item) => {
              const active = format === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormat(item.id)}
                  className={`rounded-xl border p-3 text-left ${
                    active ? 'border-rg-blue bg-rg-blue-soft' : 'border-line bg-card hover:bg-canvas'
                  }`}
                >
                  <item.Icon size={18} className={active ? 'text-rg-blue' : 'text-navy-muted'} />
                  <p className="mt-2 text-sm font-semibold text-navy">{item.label}</p>
                  <p className="mt-1 text-[11px] leading-4 text-navy-muted">{item.detail}</p>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </ConfirmModal>
  )
}
