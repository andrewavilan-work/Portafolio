import { useState, useRef } from 'react'
import emailjs from '@emailjs/browser'
import { useLang } from '../context/LangContext'

export default function ContactForm() {
  const formRef = useRef()
  const [status, setStatus] = useState(null) // null | 'sending' | 'ok' | 'error'
  const { t } = useLang()
  const f = t.contact.form

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!serviceId || !templateId || !publicKey) {
      setStatus('error')
      return
    }

    try {
      await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey)
      setStatus('ok')
      formRef.current.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form className="contact-form" ref={formRef} onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="form-label" htmlFor="contact-name">{f.name}</label>
        <input
          id="contact-name"
          name="from_name"
          type="text"
          className="form-input"
          placeholder={f.namePlaceholder}
          required
          autoComplete="name"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="contact-email">{f.email}</label>
        <input
          id="contact-email"
          name="reply_to"
          type="email"
          className="form-input"
          placeholder={f.emailPlaceholder}
          required
          autoComplete="email"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="contact-message">{f.message}</label>
        <textarea
          id="contact-message"
          name="message"
          className="form-textarea"
          placeholder={f.messagePlaceholder}
          required
          rows={5}
        />
      </div>

      <button
        type="submit"
        className="form-submit"
        disabled={status === 'sending'}
      >
        {status === 'sending' ? f.sending : f.send}
      </button>

      {status === 'ok' && (
        <p className="form-feedback" style={{ color: 'var(--c-primary)' }}>{f.ok}</p>
      )}
      {status === 'error' && (
        <p className="form-feedback" style={{ color: 'var(--c-accent)' }}>{f.error}</p>
      )}
    </form>
  )
}
