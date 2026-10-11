// The contact form, and the phone number it unlocks.
//
// Messages are delivered by FormSubmit (formsubmit.co): free, no account, it
// emails each submission to the address in the endpoint. The FIRST submission
// sends a one-time activation email to that address — confirm it, and every
// message after arrives. Until then FormSubmit answers "needs activation" and
// the form says it could not send. To use another service, change
// FORM_ENDPOINT (it must accept a JSON POST and answer JSON).
export const FORM_ENDPOINT = 'https://formsubmit.co/ajax/automatlog@gmail.com'
export const FORM_TO = 'automatlog@gmail.com'

/* The phone number is not written out anywhere in the bundle: these are its
   characters reversed and base64'd, decoded only once the form is sent. That
   keeps it away from scrapers reading the page. It is a deterrent, not
   protection — anything a browser can show, a determined reader can find. */
const DISPLAY = 'NzE4NzggNTgyNDkgMTkr'
const HREF = 'NzE4Nzg1ODI0OTE5KzpsZXQ='
const decode = (s) => atob(s).split('').reverse().join('')

export function revealPhone() {
  return { display: decode(DISPLAY), href: decode(HREF) }
}

/* Once unlocked, a visitor keeps it on their next visit (this browser only). */
const KEY = 'al-phone-unlocked'

export function isPhoneUnlocked() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export function rememberPhoneUnlocked() {
  try {
    localStorage.setItem(KEY, '1')
  } catch {
    // storage unavailable — the number stays unlocked for this visit only
  }
}
