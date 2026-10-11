/* eslint-disable react/prop-types */
import { useEffect, useId, useRef, useState } from 'react'
import { FORM_ENDPOINT, FORM_TO, revealPhone } from '../../data/contactForm'

/**
 * Send a message to unlock the phone number.
 *
 * A native <dialog> (focus is trapped and Esc closes it for free). The form
 * follows the usual rules: a visible label on every field, the right input
 * types, the submit button stays enabled until the request actually starts,
 * errors are checked on submit, each one tied to its field with
 * aria-describedby and aria-invalid, and focus moves to the first problem.
 * Paste is never blocked. A hidden honeypot field catches most bots.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Add your name.'
  if (!values.email.trim()) errors.email = 'Add your email so I can reply.'
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = 'That email doesn’t look complete.'
  if (values.message.trim().length < 10) errors.message = 'Write a little more — at least 10 characters.'
  return errors
}

function ContactForm({ open, unlocked, onClose, onUnlock }) {
  const dialogRef = useRef(null)
  const fieldRefs = { name: useRef(null), email: useRef(null), message: useRef(null) }
  const id = useId()
  const [values, setValues] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | failed

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
    // reopening after a send shows the number again, not "message sent"
    if (!open) setStatus((s) => (s === 'sending' ? s : 'idle'))
  }, [open])

  const phone = unlocked ? revealPhone() : null

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  async function submit(e) {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    const first = ['name', 'email', 'message'].find((k) => found[k])
    if (first) {
      fieldRefs[first].current?.focus()
      return
    }
    if (e.currentTarget.elements._honey?.value) return // a bot filled the trap

    setStatus('sending')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          _subject: `Portfolio message from ${values.name.trim()}`,
          _template: 'table',
          _captcha: 'false',
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || String(data.success) !== 'true') throw new Error(data.message || 'not sent')
      setStatus('sent')
      onUnlock()
    } catch {
      setStatus('failed')
    }
  }

  const fieldProps = (key) => ({
    id: `${id}-${key}`,
    name: key,
    ref: fieldRefs[key],
    value: values[key],
    onChange: set(key),
    'aria-invalid': errors[key] ? 'true' : undefined,
    'aria-describedby': errors[key] ? `${id}-${key}-error` : undefined,
  })

  const mailto = `mailto:${FORM_TO}?subject=${encodeURIComponent('Portfolio message')}&body=${encodeURIComponent(values.message)}`

  return (
    <dialog
      aria-labelledby={`${id}-title`}
      className="hm-cform"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      ref={dialogRef}
    >
      <button aria-label="Close" className="hm-cform-close hm-press" onClick={onClose} type="button">
        <svg fill="none" viewBox="0 0 24 24">
          <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        </svg>
      </button>

      {status === 'sent' || (unlocked && status === 'idle') ? (
        <div className="hm-cform-done" role="status">
          <h2 className="hm-cform-title" id={`${id}-title`}>
            {status === 'sent' ? 'Message sent' : 'Phone number'}
          </h2>
          <p className="hm-cform-lede">
            {status === 'sent' ? 'Thanks — I’ll reply by email. Here’s my number:' : 'You’ve already sent a message — here it is again:'}
          </p>
          <a className="hm-cform-phone" href={phone.href}>
            {phone.display}
          </a>
          <button className="hm-cform-submit hm-press" onClick={onClose} type="button">
            Done
          </button>
        </div>
      ) : (
        <form noValidate onSubmit={submit}>
          <h2 className="hm-cform-title" id={`${id}-title`}>
            Send a message
          </h2>
          <p className="hm-cform-lede">Send me a note and my phone number unlocks right here.</p>

          <div className="hm-cform-field">
            <label htmlFor={`${id}-name`}>Name</label>
            <input autoComplete="name" type="text" {...fieldProps('name')} />
            {errors.name ? (
              <span className="hm-cform-error" id={`${id}-name-error`}>
                {errors.name}
              </span>
            ) : null}
          </div>

          <div className="hm-cform-field">
            <label htmlFor={`${id}-email`}>Email</label>
            <input autoComplete="email" inputMode="email" type="email" {...fieldProps('email')} />
            {errors.email ? (
              <span className="hm-cform-error" id={`${id}-email-error`}>
                {errors.email}
              </span>
            ) : null}
          </div>

          <div className="hm-cform-field">
            <label htmlFor={`${id}-message`}>Message</label>
            <textarea rows={4} {...fieldProps('message')} />
            {errors.message ? (
              <span className="hm-cform-error" id={`${id}-message-error`}>
                {errors.message}
              </span>
            ) : null}
          </div>

          {/* honeypot: hidden from people, irresistible to bots */}
          <input aria-hidden="true" autoComplete="off" className="hm-cform-honey" name="_honey" tabIndex={-1} type="text" />

          {status === 'failed' ? (
            <p className="hm-cform-failed" role="alert">
              That didn’t send. Try again, or <a href={mailto}>email me directly</a>.
            </p>
          ) : null}

          <button className="hm-cform-submit hm-press" disabled={status === 'sending'} type="submit">
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      )}
    </dialog>
  )
}

export default ContactForm
