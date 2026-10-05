/* eslint-disable react/prop-types */
import { isExternal, socialLinks } from '../../data/social'
import { socialGlyphs } from '../../data/socialGlyphs'
import { Box, border, type } from './canvas'

/**
 * Contact — Figma group "Contact", 1294 x 315. Group-relative coordinates.
 * The panel interiors are empty in the design; content drops straight in.
 */

/* Rectangle 39404..39410 — seven 70x70 sockets. */
const SLOT_X = [24.97, 115.04, 204.97, 295.03, 384.96, 475.03, 564.96]
const SLOT_Y = 222.01
const SLOT = 70.01
const TILE = 53.05

function Socket({ x, link }) {
  const shared = {
    r: 10,
    style: { border: border(1, '#515051'), boxSizing: 'border-box' },
    w: SLOT,
    h: 69.99,
    x,
    y: SLOT_Y,
  }
  const inset = (SLOT - TILE) / 2

  /* No entry for this socket — leave it empty, as the design does. */
  if (!link) {
    return <Box className="hm-social hm-social--empty hm-hit" {...shared} />
  }

  /* Entry with no URL yet: show it dimmed rather than as a dead link.
     hm-hit is required or the title tooltip could never appear. */
  if (!link.href) {
    return (
      <Box
        className="hm-social hm-social--empty hm-hit"
        title={`${link.label} — soon`}
        {...shared}
      >
        <Box
          r={5.25}
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
      </Box>
    )
  }

  return (
    <Box
      as="a"
      className="hm-social"
      href={link.href}
      rel={isExternal(link.href) ? 'noreferrer noopener' : undefined}
      target={isExternal(link.href) ? '_blank' : undefined}
      title={link.label}
      {...shared}
    >
      <Box className="hm-social-tile" r={5.25} w={TILE} h={TILE} x={inset} y={inset}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          {socialGlyphs[link.key]}
        </svg>
      </Box>
    </Box>
  )
}

function ContactLayer() {
  return (
    <>
      {/* Group 1437252802 — left panel */}
      <Box
        className="hm-bezel"
        r={30}
        style={{ border: border(5, '#2A2A2A'), boxSizing: 'border-box' }}
        w={659.94}
        h={150}
        x={0}
        y={0}
      />
      <Box
        className="hm-inset-panel"
        r={25}
        style={{ border: border(2, '#000000'), boxSizing: 'border-box' }}
        w={649.98}
        h={139.99}
        x={5.05}
        y={5.01}
      />

      {/* Group 1437252801 — right panel */}
      <Box
        className="hm-bezel"
        r={30}
        style={{ border: border(5, '#2A2A2A'), boxSizing: 'border-box' }}
        w={586.05}
        h={315}
        x={707.95}
        y={0}
      />
      <Box
        className="hm-inset-panel"
        r={25}
        style={{ border: border(2, '#000000'), boxSizing: 'border-box' }}
        w={575.96}
        h={304.98}
        x={712.99}
        y={5.01}
      />
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

      {/* Group 1437252799 — social strip */}
      <Box
        className="hm-bezel"
        r={20}
        style={{ border: border(5, '#2A2A2A'), boxSizing: 'border-box' }}
        w={659.94}
        h={116.99}
        x={0}
        y={198.01}
      />
      <Box
        className="hm-inset-panel"
        r={15}
        style={{ border: border(2, '#000000'), boxSizing: 'border-box' }}
        w={649.98}
        h={107.01}
        x={5.05}
        y={202.99}
      />

      {SLOT_X.map((x, index) => (
        <Socket key={x} link={socialLinks[index]} x={x} />
      ))}
    </>
  )
}

export default ContactLayer
