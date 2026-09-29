import { Check, Copy, Eye, Link2, Mail } from 'lucide-react'
import { useState } from 'react'
import { ConfirmModal } from './ui/ConfirmModal'
import { Field, TextInput } from './ui/FilterBar'
import { PrimaryButton, SecondaryButton } from './ui/Buttons'

function buildPublicUrl(reportId: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return `${window.location.origin}${base}/shared/${reportId}`
}

export function ShareReportModal({
  open,
  onClose,
  reportId,
  partner,
  showPreview = true,
}: {
  open: boolean
  onClose: () => void
  reportId: string
  partner: string
  /** Hide Preview when already on the public customer view. */
  showPreview?: boolean
}) {
  const publicUrl = buildPublicUrl(reportId)
  const [email, setEmail] = useState('revenue@grandmeridian.com')
  const [message, setMessage] = useState(
    `Please review the ${partner} Partner Performance & Growth Report. This link opens a read-only client view.`,
  )
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl)
    } catch {
      window.prompt('Copy public report URL', publicUrl)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const openPreview = () => {
    window.open(publicUrl, '_blank', 'noopener,noreferrer')
  }

  const send = () => {
    if (!email.trim() || !email.includes('@')) return
    setSent(true)
  }

  const close = () => {
    setSent(false)
    onClose()
  }

  return (
    <ConfirmModal
      open={open}
      title="Share report"
      onClose={close}
      width="max-w-xl"
      footer={
        sent ? (
          <PrimaryButton onClick={close}>Done</PrimaryButton>
        ) : (
          <>
            <SecondaryButton onClick={close}>Cancel</SecondaryButton>
            {showPreview ? (
              <SecondaryButton onClick={openPreview}>
                <Eye size={14} />
                Preview
              </SecondaryButton>
            ) : null}
            <PrimaryButton onClick={send} disabled={!email.includes('@')}>
              <Mail size={14} />
              Send to hotelier
            </PrimaryButton>
          </>
        )
      }
    >
      {sent ? (
        <div className="space-y-3 text-sm">
          <p className="font-semibold text-navy">Report sent</p>
          <p className="text-navy-muted">
            A public link was emailed to <strong className="text-navy">{email}</strong>. The hotelier can open the
            report without signing in. They will not see Edit, RateGain view, or Client preview.
          </p>
          <a
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-rg-blue"
          >
            <Link2 size={14} />
            Open public report
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-navy-muted">
            Preview the customer view, then send a read-only public URL. The hotelier sees customer-visible results
            only — no editing and no RateGain view toggle.
          </p>
          <Field label="Hotelier email">
            <TextInput value={email} onChange={setEmail} placeholder="name@hotel.com" />
          </Field>
          <Field label="Message">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-line px-3 py-2 text-sm text-navy outline-none focus:border-rg-blue"
            />
          </Field>
          <div>
            <p className="mb-1 text-xs font-medium text-navy-muted">Public URL</p>
            <div className="flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded-lg bg-canvas px-3 py-2 text-xs text-navy">{publicUrl}</code>
              <SecondaryButton onClick={copyLink}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy'}
              </SecondaryButton>
            </div>
          </div>
        </div>
      )}
    </ConfirmModal>
  )
}
