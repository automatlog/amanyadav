// The résumé is served only by the résumé API on the server
// (server/resume-api): the PDF is not part of the website build, so there
// is no public URL to share or scrape. A visitor gives a work email, the API
// checks it, and either hands back a single-use token (direct mode) or
// emails them a download link (email mode, once SMTP is configured).
export const RESUME_API = '/api/resume'

/* The email is remembered only to prefill the field next time. */
const KEY = 'al-resume-email'

export function rememberedEmail() {
  try {
    return localStorage.getItem(KEY) || ''
  } catch {
    return ''
  }
}

export function rememberEmail(email) {
  try {
    localStorage.setItem(KEY, email)
  } catch {
    // storage unavailable — nothing to prefill next time
  }
}

/** Downloads with a token: a form POST, so the token never sits in a URL or
    browser history. The API answers with the PDF as an attachment, so the
    page stays where it is. */
export function downloadWithToken(token) {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = `${RESUME_API}/file`
  const input = document.createElement('input')
  input.type = 'hidden'
  input.name = 't'
  input.value = token
  form.appendChild(input)
  document.body.appendChild(form)
  form.submit()
  form.remove()
}
