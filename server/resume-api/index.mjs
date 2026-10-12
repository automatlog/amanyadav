/* eslint-env node */
// Résumé API — the only way to get the PDF.
//
// The PDF is not in the website build. A visitor gives a work email; this
// service checks it and answers with a short-lived, single-use download
// token. nginx proxies /api/resume/ here and rate-limits it (see
// deploy/nginx-automatlog.conf).
//
//   POST /api/resume/request  { email }  → checks the email, then either
//        direct mode: { mode: 'direct', token }      (token valid 10 min)
//        email mode:  { mode: 'email' }              (link mailed, valid 24 h)
//   POST /api/resume/file     token=…    → the PDF, as an attachment
//   GET  /api/resume/get?t=…             → the page an emailed link opens: a
//        button that POSTs the token. Mail scanners follow links with GET,
//        so they cannot spend the token before the person clicks.
//
// Checks on every email: shape, not a personal mailbox (Gmail, Outlook…),
// not a throwaway service, and the domain must have working mail (MX)
// records. Email mode adds the real proof — the link only reaches someone
// who can read that inbox. It switches on when SMTP_* is set in the env.
//
// Config (env, kept outside the repo — see deploy/resume-api.env.example):
//   TOKEN_SECRET  required, 32+ random bytes (hex)
//   RESUME_PDF    path to the PDF            LEADS_FILE  JSONL log of requests
//   SITE_ORIGIN   https://automatlog.in       PORT        default 3107
//   SMTP_HOST SMTP_PORT SMTP_USER SMTP_PASS MAIL_FROM OWNER_EMAIL  (email mode)

import crypto from 'node:crypto'
import fs from 'node:fs'
import http from 'node:http'
import { resolveMx } from 'node:dns/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FREE_DOMAINS, FREE_FAMILIES } from './domains.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const env = process.env

const PORT = Number(env.PORT || 3107)
const SECRET = env.TOKEN_SECRET || ''
const PDF = env.RESUME_PDF || path.join(HERE, '../../private/Aman Yadav — Resume.pdf')
const PDF_NAME = 'Aman Yadav — Resume.pdf'
const LEADS = env.LEADS_FILE || ''
const ORIGIN = env.SITE_ORIGIN || 'https://automatlog.in'
const EMAIL_MODE = Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS)

const DIRECT_TTL = 10 * 60 * 1000
const MAIL_TTL = 24 * 60 * 60 * 1000
const MAIL_USES = 3 // an emailed link survives a retry or two, then dies

if (SECRET.length < 32) {
  console.error('TOKEN_SECRET is missing or too short — refusing to start')
  process.exit(1)
}
if (!fs.existsSync(PDF)) {
  console.error(`RESUME_PDF not found: ${PDF}`)
  process.exit(1)
}

const DISPOSABLE = new Set(
  fs
    .readFileSync(path.join(HERE, 'disposable_email_blocklist.conf'), 'utf8')
    .split('\n')
    .map((l) => l.trim().toLowerCase())
    .filter((l) => l && !l.startsWith('#')),
)

/* ---------------- email checks ---------------- */

const EMAIL_RE = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+)$/

/** The domain and every parent of it: a.b.example.com → …, example.com */
function domainChain(domain) {
  const parts = domain.split('.')
  return parts.slice(0, -1).map((_, i) => parts.slice(i).join('.'))
}

const MESSAGES = {
  invalid: 'That email doesn’t look complete.',
  personal: 'Please use your work email — personal addresses (Gmail, Outlook, Yahoo…) aren’t accepted.',
  disposable: 'Temporary email addresses aren’t accepted. Please use your work email.',
  'no-mail': 'That email’s domain doesn’t receive mail. Check the spelling, or use another work email.',
  'dns-error': 'Couldn’t verify that email right now. Please try again in a minute.',
}

async function checkEmail(raw) {
  const email = String(raw || '').trim().toLowerCase()
  if (email.length > 254) return { error: 'invalid' }
  const m = EMAIL_RE.exec(email)
  if (!m) return { error: 'invalid' }
  const domain = m[1]
  if (FREE_DOMAINS.has(domain) || FREE_FAMILIES.test(domain)) return { error: 'personal' }
  if (domainChain(domain).some((d) => DISPOSABLE.has(d))) return { error: 'disposable' }

  try {
    const mx = await Promise.race([
      resolveMx(domain),
      new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error('timeout'), { code: 'ETIMEOUT' })), 5000)),
    ])
    // RFC 7505 "null MX" (a single record with an empty exchange) means: no mail here
    const usable = mx.filter((r) => r.exchange && r.exchange !== '.')
    if (usable.length === 0) return { error: 'no-mail' }
  } catch (err) {
    if (err.code === 'ENOTFOUND' || err.code === 'ENODATA') return { error: 'no-mail' }
    return { error: 'dns-error' }
  }
  return { email, domain }
}

/* ---------------- tokens ---------------- */

const b64 = (buf) => Buffer.from(buf).toString('base64url')
const sign = (payload) => b64(crypto.createHmac('sha256', SECRET).update(payload).digest())

function makeToken(email, ttl, uses) {
  const payload = b64(JSON.stringify({ e: email, x: Date.now() + ttl, n: b64(crypto.randomBytes(12)), u: uses }))
  return `${payload}.${sign(payload)}`
}

const spent = new Map() // nonce → { uses, exp }; in memory, so a restart forgives

function readToken(token) {
  const [payload, sig] = String(token || '').split('.')
  if (!payload || !sig) return null
  const want = Buffer.from(sign(payload))
  const got = Buffer.from(sig)
  if (want.length !== got.length || !crypto.timingSafeEqual(want, got)) return null
  let data
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
  } catch {
    return null
  }
  if (!data || typeof data.x !== 'number' || data.x < Date.now()) return null
  return data
}

function spend(data) {
  const used = spent.get(data.n)?.uses || 0
  if (used >= (data.u || 1)) return false
  spent.set(data.n, { uses: used + 1, exp: data.x })
  return true
}

setInterval(() => {
  const now = Date.now()
  for (const [n, v] of spent) if (v.exp < now) spent.delete(n)
}, 10 * 60 * 1000).unref()

/* ---------------- rate limits (nginx limits per IP too) ---------------- */

function limiter(max, windowMs) {
  const hits = new Map()
  setInterval(() => {
    const now = Date.now()
    for (const [k, v] of hits) if (v.reset < now) hits.delete(k)
  }, windowMs).unref()
  return (key) => {
    const now = Date.now()
    const h = hits.get(key)
    if (!h || h.reset < now) {
      hits.set(key, { n: 1, reset: now + windowMs })
      return true
    }
    h.n += 1
    return h.n <= max
  }
}

const perIp = limiter(8, 15 * 60 * 1000)
const perEmail = limiter(3, 60 * 60 * 1000)
const downloadsPerIp = limiter(10, 60 * 60 * 1000)

/* ---------------- mail (email mode only) ---------------- */

let transport = null
async function mailer() {
  if (!transport) {
    const nodemailer = (await import('nodemailer')).default
    transport = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT || 465),
      secure: Number(env.SMTP_PORT || 465) === 465,
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    })
  }
  return transport
}

async function sendLink(email, token) {
  const link = `${ORIGIN}/api/resume/get?t=${encodeURIComponent(token)}`
  const t = await mailer()
  await t.sendMail({
    from: env.MAIL_FROM || env.SMTP_USER,
    to: email,
    subject: 'Aman Yadav — your résumé download link',
    text: `Hi,\n\nHere is the link to download my résumé (valid for 24 hours):\n${link}\n\nThanks for your interest — reply to this email any time.\n\nAman Yadav\n${ORIGIN}\n`,
    replyTo: env.OWNER_EMAIL || undefined,
  })
  if (env.OWNER_EMAIL) {
    t.sendMail({
      from: env.MAIL_FROM || env.SMTP_USER,
      to: env.OWNER_EMAIL,
      subject: `Résumé requested by ${email}`,
      text: `${email} requested your résumé from ${ORIGIN}.`,
    }).catch((err) => console.error('owner notify failed:', err.message))
  }
}

/* ---------------- http ---------------- */

const SECURITY = {
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
}

function send(res, status, body, headers = {}) {
  const json = typeof body !== 'string'
  res.writeHead(status, {
    ...SECURITY,
    'Content-Type': json ? 'application/json; charset=utf-8' : 'text/html; charset=utf-8',
    ...headers,
  })
  res.end(json ? JSON.stringify(body) : body)
}

function readBody(req, limit = 4096) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (c) => {
      size += c.length
      if (size > limit) {
        reject(Object.assign(new Error('too large'), { status: 413 }))
        req.destroy()
      } else chunks.push(c)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

const clientIp = (req) => req.headers['x-real-ip'] || req.socket.remoteAddress || ''

/* Only the site itself may ask for a token — blocks other origins' scripts
   and makes scripted scraping do at least a little work. (The Vite dev
   server proxies /api with this Origin set, so local dev still works.) */
function sameOrigin(req) {
  const o = req.headers.origin
  return o === ORIGIN || o === ORIGIN.replace('://', '://www.')
}

function log(entry) {
  if (!LEADS) return
  fs.appendFile(LEADS, `${JSON.stringify({ ts: new Date().toISOString(), ...entry })}\n`, { mode: 0o600 }, (err) => {
    if (err) console.error('lead log failed:', err.message)
  })
}

async function handleRequest(req, res) {
  if (!sameOrigin(req)) return send(res, 403, { error: 'forbidden' })
  const ip = clientIp(req)
  if (!perIp(ip)) return send(res, 429, { error: 'rate', message: 'Too many attempts — please try again later.' })

  let body
  try {
    body = JSON.parse(await readBody(req))
  } catch (err) {
    return send(res, err.status || 400, { error: 'bad-request' })
  }
  if (body.website) return send(res, 400, { error: 'bad-request' }) // honeypot

  const result = await checkEmail(body.email)
  if (result.error) {
    log({ ip, email: String(body.email || '').slice(0, 254), rejected: result.error })
    const status = result.error === 'dns-error' ? 503 : 422
    return send(res, status, { error: result.error, message: MESSAGES[result.error] })
  }
  if (!perEmail(result.email)) return send(res, 429, { error: 'rate', message: 'Too many requests for this email — please try again later.' })

  const ua = String(req.headers['user-agent'] || '').slice(0, 200)
  if (EMAIL_MODE) {
    try {
      await sendLink(result.email, makeToken(result.email, MAIL_TTL, MAIL_USES))
    } catch (err) {
      console.error('send failed:', err.message)
      return send(res, 502, { error: 'mail', message: 'Couldn’t send the email just now. Please try again shortly.' })
    }
    log({ ip, ua, email: result.email, mode: 'email' })
    return send(res, 200, { ok: true, mode: 'email' })
  }

  log({ ip, ua, email: result.email, mode: 'direct' })
  return send(res, 200, { ok: true, mode: 'direct', token: makeToken(result.email, DIRECT_TTL, 1) })
}

async function handleFile(req, res) {
  const ip = clientIp(req)
  if (!downloadsPerIp(ip)) return send(res, 429, page('Too many downloads', 'Please try again later.'))
  let token
  try {
    token = new URLSearchParams(await readBody(req)).get('t')
  } catch (err) {
    return send(res, err.status || 400, page('Bad request', ''))
  }
  const data = readToken(token)
  if (!data || !spend(data)) {
    return send(res, 410, page('This link has expired', `Request a new one at <a href="${ORIGIN}/">${ORIGIN.replace('https://', '')}</a>.`))
  }
  log({ ip, email: data.e, downloaded: true })
  res.writeHead(200, {
    ...SECURITY,
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="Aman-Yadav-Resume.pdf"; filename*=UTF-8''${encodeURIComponent(PDF_NAME)}`,
  })
  fs.createReadStream(PDF).pipe(res)
}

function handleLanding(req, res, url) {
  const t = url.searchParams.get('t') || ''
  if (!readToken(t)) {
    return send(res, 410, page('This link has expired', `Request a new one at <a href="${ORIGIN}/">${ORIGIN.replace('https://', '')}</a>.`))
  }
  const safe = t.replace(/[^A-Za-z0-9_.-]/g, '')
  send(
    res,
    200,
    page(
      'Your résumé download',
      `<form method="post" action="/api/resume/file"><input type="hidden" name="t" value="${safe}"><button type="submit">Download the PDF</button></form>`,
    ),
  )
}

/** A minimal standalone page, styled like the site (no external assets). */
function page(title, body) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${title} — Aman Yadav</title><style>
body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b0b0b;color:#fff;font:16px/1.5 system-ui,sans-serif;padding:16px}
main{max-width:420px;padding:32px;border-radius:24px;background:#1c1c1c;box-shadow:0 0 0 2px #000,0 0 0 7px #2a2a2a}
h1{margin:0 0 12px;font-size:22px;text-transform:uppercase;letter-spacing:.5px}p{color:#b8b8b8;margin:0 0 20px}a{color:#fff}
button{width:100%;padding:14px;border:0;border-radius:999px;background:#fff;color:#000;font:600 15px system-ui;text-transform:uppercase;cursor:pointer}
</style></head><body><main><h1>${title}</h1>${body.startsWith('<form') ? body : `<p>${body}</p>`}</main></body></html>`
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, ORIGIN)
  try {
    if (req.method === 'POST' && url.pathname === '/api/resume/request') return await handleRequest(req, res)
    if (req.method === 'POST' && url.pathname === '/api/resume/file') return await handleFile(req, res)
    if (req.method === 'GET' && url.pathname === '/api/resume/get') return handleLanding(req, res, url)
    send(res, 404, { error: 'not-found' })
  } catch (err) {
    console.error(err)
    if (!res.headersSent) send(res, 500, { error: 'server' })
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`resume-api on 127.0.0.1:${PORT} — ${EMAIL_MODE ? 'email' : 'direct'} mode, ${DISPOSABLE.size} disposable domains`)
})
