import { Download, FilePenLine, Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useReport } from '../context/ReportContext'
import type { ReportModuleId, ReportStatus } from '../types'
import { ConfirmModal } from './ui/ConfirmModal'
import { Field, Select, TextInput } from './ui/FilterBar'
import { ModuleChecklist } from './ui/ModuleChecklist'
import { PrimaryButton, SecondaryButton } from './ui/Buttons'

const steps = ['Why Edit', 'Prepare report', 'Finish']

export function EditReportModal({
  open,
  onClose,
  onDownload,
  onShare,
}: {
  open: boolean
  onClose: () => void
  onDownload: () => void
  onShare: () => void
}) {
  const {
    reportTitle,
    setReportTitle,
    reportStatus,
    setReportStatus,
    setViewMode,
    perspective,
    accountType,
    enabledModules,
    setEnabledModules,
  } = useReport()
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState(reportTitle)
  const [status, setStatus] = useState<ReportStatus>(reportStatus)
  const [modules, setModules] = useState<ReportModuleId[]>(enabledModules)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!open) return
    setStep(0)
    setSaved(false)
    setTitle(reportTitle)
    setStatus(reportStatus)
    setModules(enabledModules)
  }, [open, reportTitle, reportStatus, enabledModules])

  const close = () => {
    setStep(0)
    setSaved(false)
    setTitle(reportTitle)
    setStatus(reportStatus)
    setModules(enabledModules)
    onClose()
  }

  const save = () => {
    setReportTitle(title)
    setReportStatus(status)
    setEnabledModules(modules)
    setSaved(true)
  }

  return (
    <ConfirmModal
      open={open}
      title="Edit report"
      onClose={close}
      width="max-w-2xl"
      footer={
        step === 0 ? (
          <>
            <SecondaryButton onClick={close}>Cancel</SecondaryButton>
            <PrimaryButton onClick={() => setStep(1)}>Continue</PrimaryButton>
          </>
        ) : step === 1 ? (
          <>
            <SecondaryButton onClick={() => setStep(0)}>Back</SecondaryButton>
            <PrimaryButton onClick={() => setStep(2)}>Continue</PrimaryButton>
          </>
        ) : saved ? (
          <>
            <SecondaryButton
              onClick={() => {
                close()
                onDownload()
              }}
            >
              <Download size={14} />
              Download
            </SecondaryButton>
            <PrimaryButton
              onClick={() => {
                close()
                onShare()
              }}
            >
              <Share2 size={14} />
              Share with hotelier
            </PrimaryButton>
          </>
        ) : (
          <>
            <SecondaryButton onClick={() => setStep(1)}>Back</SecondaryButton>
            <PrimaryButton onClick={save}>Save changes</PrimaryButton>
          </>
        )
      }
    >
      <ol className="mb-4 flex gap-2 text-[11px] font-semibold uppercase tracking-wide text-navy-muted">
        {steps.map((label, i) => (
          <li
            key={label}
            className={`rounded-full px-2 py-1 ${i === step ? 'bg-rg-blue-soft text-rg-blue' : 'bg-canvas'}`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="space-y-3 text-sm text-navy">
          <p>
            <strong>Edit</strong> is for the account manager only. Use it to prepare what the hotelier will see. It does
            not change booked revenue or source-system numbers.
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-xl border border-rg-blue bg-rg-blue-soft p-3">
              <FilePenLine size={16} className="text-rg-blue" />
              <p className="mt-2 font-semibold text-navy">Edit</p>
              <p className="mt-1 text-navy-muted">Prepare narrative, modules, visibility and approval status.</p>
            </div>
            <div className="rounded-xl border border-line p-3">
              <Download size={16} className="text-navy-muted" />
              <p className="mt-2 font-semibold text-navy">Download</p>
              <p className="mt-1 text-navy-muted">Export PDF, Excel or PowerPoint after you are happy with Edit.</p>
            </div>
            <div className="rounded-xl border border-line p-3">
              <Share2 size={16} className="text-navy-muted" />
              <p className="mt-2 font-semibold text-navy">Share</p>
              <p className="mt-1 text-navy-muted">Email the hotelier a public, view-only link.</p>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <Field label="Report title">
            <TextInput value={title} onChange={setTitle} />
          </Field>
          <Field label="Review status">
            <Select
              value={status}
              onChange={(v) => setStatus(v as ReportStatus)}
              options={[
                { value: 'draft', label: 'Draft — still working' },
                { value: 'shared', label: 'Shared — sent to hotelier' },
              ]}
            />
          </Field>
          <ModuleChecklist
            perspective={perspective}
            accountType={accountType}
            value={modules}
            onChange={setModules}
          />
          <div className="rounded-xl bg-canvas p-3 text-sm text-navy">
            <p className="font-semibold">Also edit on the page</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-navy-muted">
              <li>AI narrative — use Edit on the snapshot card</li>
              <li>Recommendations — accept, defer, change owner, mark customer-visible</li>
            </ul>
            <button
              type="button"
              className="mt-3 text-xs font-semibold text-rg-blue"
              onClick={() => {
                setViewMode('internal')
                close()
                document.getElementById('recommendations')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Go to recommendations
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3 text-sm text-navy">
          {saved ? (
            <>
              <p className="font-semibold">Changes saved</p>
              <p className="text-navy-muted">
                Status is now <strong className="text-navy">{statusLabel(status)}</strong>. Client preview and hotelier
                views will show {modules.length} modules. Next, download a file for the meeting or share the public URL.
              </p>
            </>
          ) : (
            <>
              <p>
                Save title, status and shared modules, then use <strong>Download</strong> or <strong>Share</strong> in
                the header.
              </p>
              <p className="text-navy-muted">
                Suggested order: Edit → check Client preview → Download or Share.
              </p>
            </>
          )}
        </div>
      )}
    </ConfirmModal>
  )
}

function statusLabel(status: ReportStatus) {
  if (status === 'shared') return 'Shared'
  return 'Draft'
}
