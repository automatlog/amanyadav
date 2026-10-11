/* eslint-disable react/prop-types */
import { useState } from 'react'
import { isPhoneUnlocked, rememberPhoneUnlocked, revealPhone } from '../../data/contactForm'
import { isExternal, socialLinks } from '../../data/social'
import { socialGlyphs } from '../../data/socialGlyphs'
import { Box, Stroked, type } from './canvas'
import ContactForm from './ContactForm'

/**
 * Contact — Figma group "Contact", 1294 x 315. Group-relative coordinates.
 * The panel interiors are empty in the design; the content is the contact
 * details from the resume (data/social.js).
 */

/* The contact list in the right panel — just email and phone; the profiles
   (GitHub, LinkedIn, TryHackMe) and the résumé live in the sockets. */
const LIST = socialLinks.filter((l) => l.key === 'email' || l.key === 'phone')
const EMAIL = socialLinks.find((l) => l.key === 'email')

const LOCK = (
  <path d="M7 10V7a5 5 0 0 1 10 0v3h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h1Zm2 0h6V7a3 3 0 0 0-6 0v3Z" />
)

/**
 * A row of the contact list: icon, what it is, and the handle itself. The
 * phone row is a button until the contact form unlocks it, then an ordinary
 * tel: link like the rest.
 */
function ContactRow({ link, unlocked, onLocked }) {
  if (link.locked && !unlocked) {
    return (
      <li>
        <button className="hm-contact-row hm-contact-row--locked" onClick={onLocked} type="button">
          <svg aria-hidden="true" className="hm-contact-icon" viewBox="0 0 24 24">
            {socialGlyphs[link.key]}
          </svg>
          <span className="hm-contact-label">{link.label}</span>
          <span className="hm-contact-value">Send a message to unlock</span>
          <svg aria-hidden="true" className="hm-contact-go" viewBox="0 0 24 24">
            {LOCK}
          </svg>
        </button>
      </li>
    )
  }
  if (link.locked) {
    const phone = revealPhone()
    link = { ...link, handle: phone.display, href: phone.href }
  }
  const external = isExternal(link.href)
  return (
    <li>
      <a
        className="hm-contact-row"
        href={link.href}
        rel={external ? 'noreferrer noopener' : undefined}
        target={external ? '_blank' : undefined}
      >
        <svg aria-hidden="true" className="hm-contact-icon" viewBox="0 0 24 24">
          {socialGlyphs[link.key]}
        </svg>
        <span className="hm-contact-label">{link.label}</span>
        <span className="hm-contact-value">{link.handle}</span>
        <svg aria-hidden="true" className="hm-contact-go" fill="none" viewBox="0 0 24 24">
          <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      </a>
    </li>
  )
}

/* Rectangle 39404..39410 — seven 70x70 sockets. */
const SLOT_X = [24.97, 115.04, 204.97, 295.03, 384.96, 475.03, 564.96]
const SLOT_Y = 222.01
const SLOT = 70.01
const TILE = 53.05
const TILE_R = 5.25
const SOCKET_BORDER = 1

/* Every stroke in this group is OUTSIDE (no box-sizing in the export), so
   each box below is a fill and its stroke is drawn beyond it with <Stroked>.
   That is also what makes the export's radii concentric: the inner panels'
   strokes end 3.05 inside the r30 bezels, and 30 - 3.05 - 2 = 24.95 — the
   exported 25.

   The tile sits 8.48 inside the socket's fill. <Stroked> positions children
   from the fill, so that is the inset as-is. Concentric: the socket's fill
   corner is 5.25 + 8.48 = 13.73 — at the design's r10 the ring between
   socket and tile pinched at every corner. */
const SOCKET_PAD = (SLOT - TILE) / 2
const SOCKET_R = TILE_R + SOCKET_PAD

function Socket({ x, link, unlocked, onLocked }) {
  const shared = {
    r: SOCKET_R,
    stroke: [SOCKET_BORDER, '#515051'],
    w: SLOT,
    h: 69.99,
    x,
    y: SLOT_Y,
  }
  const inset = SOCKET_PAD

  /* The phone, still locked: a button that opens the contact form. */
  if (link?.locked && !unlocked) {
    return (
      <Stroked
        aria-label="Phone — send a message to unlock"
        as="button"
        className="hm-social hm-social--locked hm-press"
        onClick={onLocked}
        title="Phone — send a message to unlock"
        type="button"
        {...shared}
      >
        <Box className="hm-social-tile" r={TILE_R} w={TILE} h={TILE} x={inset} y={inset}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            {socialGlyphs[link.key]}
          </svg>
          <span aria-hidden className="hm-social-lock">
            <svg viewBox="0 0 24 24">{LOCK}</svg>
          </span>
        </Box>
      </Stroked>
    )
  }
  if (link?.locked) {
    const phone = revealPhone()
    link = { ...link, href: phone.href }
  }

  /* No entry for this socket — leave it empty, as the design does. */
  if (!link) {
    return <Stroked className="hm-social hm-social--empty hm-hit" {...shared} />
  }

  /* Entry with no URL yet: show it dimmed rather than as a dead link.
     hm-hit is required or the title tooltip could never appear. */
  if (!link.href) {
    return (
      <Stroked
        className="hm-social hm-social--empty hm-hit"
        title={`${link.label} — soon`}
        {...shared}
      >
        <Box
          r={TILE_R}
          style={{ background: 'rgba(255,255,255,.14)', display: 'grid', placeItems: 'center' }}
          w={TILE}
          h={TILE}
          x={inset}
          y={inset}
        >
          <svg
            style={{ width: '72.6%', height: '72.6%', fill: 'rgba(255,255,255,.35)' }}
            viewBox="0 0 24 24"
          >
            {socialGlyphs[link.key]}
          </svg>
        </Box>
      </Stroked>
    )
  }

  return (
    <Stroked
      as="a"
      className="hm-social hm-press"
      aria-label={link.label}
      download={link.download}
      href={link.href}
      rel={isExternal(link.href) ? 'noreferrer noopener' : undefined}
      target={isExternal(link.href) ? '_blank' : undefined}
      title={link.label}
      {...shared}
    >
      <Box className="hm-social-tile" r={TILE_R} w={TILE} h={TILE} x={inset} y={inset}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {socialGlyphs[link.key]}
        </svg>
      </Box>
    </Stroked>
  )
}

function ContactLayer() {
  const [unlocked, setUnlocked] = useState(isPhoneUnlocked)
  const [formOpen, setFormOpen] = useState(false)
  const openForm = () => setFormOpen(true)

  return (
    <>
      {/* Group 1437252802 — left panel */}
      <Stroked className="hm-bezel" r={30} stroke={[5, '#2A2A2A']} w={659.94} h={150} x={0} y={0} />
      <Stroked className="hm-inset-panel" r={25} stroke={[2, '#000000']} w={649.98} h={139.99} x={5.05} y={5.01} />
      <Box
        as="h2"
        style={{ ...type({ family: 'Azonix', weight: 400, size: 30, lh: 36 }), color: '#FFFFFF', margin: 0 }}
        w={360}
        h={36}
        x={36}
        y={36}
      >
        Let&rsquo;s talk
      </Box>
      <Box as="p" style={{ ...type({ weight: 400, size: 16, lh: 24 }), color: '#B8B8B8', margin: 0 }} w={360} h={24} x={36} y={84}>
        Email is the fastest way to reach me.
      </Box>
      {/* the Resume pill's construction: outside stroke, label + arrow */}
      <Box as="a" className="hm-resume hm-press" href={EMAIL.href} w={210} h={62} x={414} y={44}>
        <Stroked className="hm-bezel hm-pill" r="full" stroke={[5, '#1C1C1C']} w={200} h={52} x={5} y={5} />
        <Box
          style={{ ...type({ size: 18, lh: 24 }), color: '#FFFFFF', display: 'flex', alignItems: 'center', textTransform: 'uppercase' }}
          w={110}
          h={24}
          x={36}
          y={19}
        >
          Email me
        </Box>
        <Box className="hm-resume-arrow" w={20} h={20} x={160} y={21}>
          <svg fill="none" height="100%" viewBox="0 0 24 24" width="100%">
            <path d="M7 17 17 7M9 7h8v8" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </Box>
      </Box>

      {/* Group 1437252801 — right panel */}
      <Stroked className="hm-bezel" r={30} stroke={[5, '#2A2A2A']} w={586.05} h={315} x={707.95} y={0} />
      <Stroked className="hm-inset-panel" r={25} stroke={[2, '#000000']} w={575.96} h={304.98} x={712.99} y={5.01} />
      <Box
        style={{
          ...type({ family: 'Azonix', weight: 400, size: 40, lh: 40 }),
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
        }}
        w={236.03}
        h={40.01}
        x={741.98}
        y={35}
      >
        Contacts
      </Box>
      <Box as="ul" className="hm-contact-list" w={518} h={200} x={741.98} y={100}>
        {LIST.map((link) => (
          <ContactRow key={link.key} link={link} onLocked={openForm} unlocked={unlocked} />
        ))}
      </Box>

      {/* Group 1437252799 — social strip */}
      <Stroked className="hm-bezel" r={20} stroke={[5, '#2A2A2A']} w={659.94} h={116.99} x={0} y={198.01} />
      <Stroked className="hm-inset-panel" r={15} stroke={[2, '#000000']} w={649.98} h={107.01} x={5.05} y={202.99} />

      {SLOT_X.map((x, index) => (
        <Socket key={x} link={socialLinks[index]} onLocked={openForm} unlocked={unlocked} x={x} />
      ))}

      <ContactForm
        onClose={() => setFormOpen(false)}
        onUnlock={() => {
          rememberPhoneUnlocked()
          setUnlocked(true)
        }}
        open={formOpen}
        unlocked={unlocked}
      />
    </>
  )
}

export default ContactLayer
