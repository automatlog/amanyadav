import skullMark from '../../assets/obsidian_skull.png'
import { Box, border, type, u } from './canvas'
import { homeNavItems } from './content'

/**
 * Navbar — Figma group "Navbar", 1229 x 174.
 * Every coordinate below is group-relative, straight from the export.
 */

/* x/w per label; the labels themselves (including the lowercase i in
   WHO@Mi) come from the shared content file. */
const SLOTS = [
  { href: '#whoami', x: 251.94, w: 111.1 },
  { href: '#skills', x: 432.98, w: 65.01 },
  { href: '#experience', x: 568.04, w: 146.99 },
  { href: '#projects', x: 784.96, w: 126.1 },
  { href: '#contact', x: 980.99, w: 117 },
]

const MENU = SLOTS.map((slot, i) => ({ ...slot, label: homeNavItems[i].label }))

function BellIcon() {
  return (
    <svg fill="none" height="100%" viewBox="0 0 24 24" width="100%">
      <path
        d="M12 2.6a6.1 6.1 0 0 0-6.1 6.1v3.05L4.2 15.1a.9.9 0 0 0 .8 1.35h14a.9.9 0 0 0 .8-1.35l-1.7-3.35V8.7A6.1 6.1 0 0 0 12 2.6Z"
        fill="#FFFFFF"
      />
      <path d="M9.7 18.1a2.4 2.4 0 0 0 4.6 0H9.7Z" fill="#FFFFFF" />
    </svg>
  )
}

function NavLayer() {
  return (
    <>
      {/* --- conduit, "Group 1437252803" (263.01 x 33.01 at 78.04,0) --- */}
      <Box w={263.01} h={33.01} x={78.04} y={0}>
        <svg fill="none" height="100%" preserveAspectRatio="none" viewBox="0 0 263 33" width="100%">
          {/* Rectangle 39347 — the 263.01 x 30 conduit body */}
          <path d="M3 0h195l65 27v3h-20L188 12H3a3 3 0 0 1 0-12Z" fill="#515051" />
        </svg>
      </Box>
      {/* Rectangle 39348 / 39349 / 39350 */}
      <Box style={{ background: '#2A2A2A' }} w={20.03} h={2.99} x={90.95} y={16.01} />
      <Box style={{ background: '#2A2A2A' }} w={9.95} h={2} x={95.98} y={14.01} />
      <Box style={{ background: '#2A2A2A' }} w={20.03} h={3.01} x={286.97} y={30} />

      {/* --- logo tile, "LOGO" (150.06 x 150.01 at 0,23.99) --- */}
      <Box
        className="hm-bezel"
        r={15}
        style={{ border: border(5, '#2A2A2A') }}
        w={150.06}
        h={150.01}
        x={0}
        y={23.99}
      />
      <Box
        className="hm-inset-panel"
        r={10}
        style={{ border: border(2, '#000000') }}
        w={139.98}
        h={140}
        x={5.04}
        y={29.01}
      />
      <Box
        alt="Aman Yadav"
        as="img"
        draggable={false}
        src={skullMark}
        style={{ objectFit: 'contain' }}
        w={136.05}
        h={136}
        x={7.01}
        y={31.01}
      />

      {/* --- nav pill, Rectangle 39345 / 39341 --- */}
      <Box
        className="hm-bezel"
        r={40}
        style={{ border: border(5, '#2A2A2A') }}
        w={1017}
        h={70}
        x={212}
        y={38}
      />
      <Box
        className="hm-inset-panel"
        r={30}
        style={{ border: border(2, '#000000') }}
        w={908.97}
        h={49.99}
        x={219.99}
        y={48.01}
      />

      {MENU.map((item) => (
        <Box
          as="a"
          className="hm-navlink"
          href={item.href}
          key={item.label}
          style={{ ...type({ size: 24, lh: 29 }), textTransform: 'none' }}
          w={item.w}
          h={28.99}
          x={item.x}
          y={59}
        >
          {item.label}
        </Box>
      ))}

      {/* --- bell, Rectangle 39346 + its 29.99 x 30 icon --- */}
      <Box
        aria-label="Notifications"
        as="button"
        className="hm-bell hm-inset-panel"
        r="full"
        style={{ border: border(2, '#000000') }}
        type="button"
        w={49.9}
        h={49.99}
        x={1168.04}
        y={48.01}
      >
        <span style={{ width: u(29.99), height: u(30), display: 'block' }}>
          <BellIcon />
        </span>
      </Box>
    </>
  )
}

export default NavLayer
