/* eslint-disable react/prop-types */
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { downloadWithToken, rememberedEmail, rememberEmail, RESUME_API } from '../data/resumeGate'
import './resumeGate.css'

/**
 * Ask for a work email before the résumé downloads.
 *
 *   const gate = useResumeGate()   // ./useResumeGate
 *   <a href="#resume" onClick={gate.onClick}>Resume</a>
 *   {gate.dialog}
 *
 * The checks that matter run on the server (server/resume-api): no personal
 * or throwaway mailboxes, the domain must receive mail, rate limits, and a
 * single-use token for the file. This dialog only does the quick shape check
 * and shows what the server says.
 *
 * The dialog is portalled to <body> so it inherits nothing from the home
 * frame (pointer-events, design units, transforms).
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ResumeGateDialog({ open, onClose }) {
  const dialogRef = useRef(null)
  const inputRef = useRef(null)
  const id = useId()
  const [email, setEmail] = useState(rememberedEmail)
  const [error, setError] = useState('')
  const [failure, setFailure] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | downloading | mailed

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
    if (!open) {
      setStatus((s) => (s === 'sending' ? s : 'idle'))
      setFailure('')
    }
  }, [open])

  async function submit(e) {
    e.preventDefault()
    const value = email.trim()
    if (!EMAIL_RE.test(value)) {
      setError(value ? 'That email doesn’t look complete.' : 'Add your work email to download.')
      inputRef.current?.focus()
      return
    }

    setStatus('sending')
    setFailure('')
    try {
      const res = await fetch(`${RESUME_API}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: value, website: e.currentTarget.elements.website?.value || '' }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok && data.mode === 'direct' && data.token) {
        rememberEmail(value)
        setStatus('downloading')
        downloadWithToken(data.token)
        return
      }
      if (res.ok && data.mode === 'email') {
        rememberEmail(value)
        setStatus('mailed')
        return
      }

      setStatus('idle')
      // a problem with the address itself belongs on the field
      if (res.status === 422) {
        setError(data.message || 'Please use your work email.')
        inputRef.current?.focus()
      } else {
        setFailure(data.message || 'Something went wrong. Please try again in a minute.')
      }
    } catch {
      setStatus('idle')
      setFailure('Couldn’t reach the server. Check your connection and try again.')
    }
  }

  const done = status === 'downloading' || status === 'mailed'

  return createPortal(
    <dialog
      aria-labelledby={`${id}-title`}
      className="rg-dialog"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      ref={dialogRef}
    >
      <button aria-label="Close" className="rg-close" onClick={onClose} type="button">
        <svg fill="none" viewBox="0 0 24 24">
          <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        </svg>
      </button>

      {done ? (
        <div role="status">
          <h2 className="rg-title" id={`${id}-title`}>
            {status === 'mailed' ? 'Check your inbox' : 'Downloading'}
          </h2>
          <p className="rg-lede">
            {status === 'mailed' ? (
              <>
                I’ve sent a download link to <strong className="rg-strong">{email.trim()}</strong>. It works for 24 hours.
              </>
            ) : (
              'Thanks — your download has started. Each link works once; if it didn’t start, just ask again.'
            )}
          </p>
          <button className="rg-submit" onClick={onClose} type="button">
            Done
          </button>
        </div>
      ) : (
        <form noValidate onSubmit={submit}>
          <h2 className="rg-title" id={`${id}-title`}>
            Get my résumé
          </h2>
          <p className="rg-lede">Enter your work email to download it. Personal and temporary addresses aren’t accepted.</p>

          <div className="rg-field">
            <label htmlFor={`${id}-email`}>Work email</label>
            <input
              aria-describedby={error ? `${id}-error` : undefined}
              aria-invalid={error ? 'true' : undefined}
              autoComplete="email"
              id={`${id}-email`}
              inputMode="email"
              name="email"
              onChange={(e) => {
                setEmail(e.target.value)
                if (error) setError('')
              }}
              placeholder="name@company.com"
              ref={inputRef}
              spellCheck={false}
              type="email"
              value={email}
            />
            {error ? (
              <span className="rg-error" id={`${id}-error`}>
                {error}
              </span>
            ) : null}
          </div>

          {/* honeypot: hidden from people, irresistible to bots */}
          <input aria-hidden="true" autoComplete="off" className="rg-honey" name="website" tabIndex={-1} type="text" />

          {failure ? (
            <p className="rg-failed" role="alert">
              {failure}
            </p>
          ) : null}

          <button className="rg-submit" disabled={status === 'sending'} type="submit">
            {status === 'sending' ? 'Checking…' : 'Download résumé'}
          </button>
        </form>
      )}
    </dialog>,
    document.body,
  )
}
