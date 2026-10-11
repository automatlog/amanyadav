/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import { ThinkingOrb } from 'thinking-orbs'
import skullMark from '../../assets/obsidian_skull.png'
import { Box, Stage, Stroked, roundedPath, type } from './canvas'
import { homeNavItems } from './content'

/**
 * Navbar — Figma group "Navbar", 1229 x 174.
 * Every coordinate below is group-relative, straight from the export.
 *
 * Every bordered shape here uses <Stroked>: this file's strokes sit OUTSIDE
 * the exported box (see canvas.jsx), which the reference confirms band by
 * band down the pill — connector 30..33, stroke 33..38, bezel 38..46,
 * black 46..48, panel 48..98 — at one scale, to within a pixel.
 */

/* Label widths, and the row they sit in.

   The designer spaced the labels by their EDGES — four equal 70 gaps — and
   centred the row in the inner panel (31.95 in on the left, 30.97 on the
   right). "Skills" is 15.45 wider than the "Skill" the export was sized for,
   so both ends stay where they were and the four gaps share the difference,
   rather than one label being widened and the rhythm broken around it.

   Widths are Inter Medium 24 advances; they reproduce the export's own text
   boxes to within 0.7 for every label that kept its text. */
const ROW = { start: 251.94, end: 1097.99, y: 59, h: 28.99 }
const WIDTHS = [111.1, 80.45, 146.99, 126.1, 117]
/* WHO@Mi opens its own page; the rest scroll this one. */
const HREFS = ['/whoami', '#skills', '#experience', '#projects', '#contact']

const GAP = (ROW.end - ROW.start - WIDTHS.reduce((a, b) => a + b, 0)) / (WIDTHS.length - 1)

const MENU = WIDTHS.map((w, i) => ({
  w,
  x: ROW.start + WIDTHS.slice(0, i).reduce((a, b) => a + b, 0) + GAP * i,
  href: HREFS[i],
  label: homeNavItems[i].label,
  caps: homeNavItems[i].caps !== false,
}))

/* The @ in WHO@Mi is set in white against the red — the same treatment the
   WHO@Mi pill in the About cluster gets. One inline run, because the link is
   a flex box: bare siblings would each become a flex item and split the
   label into three pieces for anything that reads layout. */
function Label({ text }) {
  const at = text.indexOf('@')
  if (at < 0) return text
  return (
    <span>
      {text.slice(0, at)}
      <span className="hm-at">@</span>
      {text.slice(at + 1)}
    </span>
  )
}

/**
 * Rectangle 39347 — the conduit. Exported as a 263.01 x 30 box; it is a
 * hook, traced from the reference at scale 3.14:
 *
 *   - a 14.2 bar (not 12: it stacks exactly onto its plug — bar to 14.2,
 *     Rect 39349 from 14.01, Rect 39348 from 16.01, tile stroke from 18.99)
 *   - flat along the top to 188, then a diagonal falling at 0.409
 *   - a foot with a flat bottom at 30, from 189 to 250.5 — Rect 39350, the
 *     plug beneath it, centres at 219.0 against the foot's 219.75, which is
 *     what confirms the 250.5 end over the box's 263
 *   - an r14 concave fillet where the bar turns down into the foot
 *
 * [x, y, corner radius], clockwise from the top-left.
 */
const CONDUIT = roundedPath([
  [0, 0, 5],
  [188, 0, 3],
  [250.5, 25.54, 2],
  [250.5, 30, 1.5],
  [189, 30, 1],
  [189, 14.2, 14],
  [0, 14.2, 5],
])

function NavLayer() {
  return (
    <>
      {/* entrance step 1: the navbar logo, with its conduit */}
      <Stage step={0}>
        {/* --- conduit, "Group 1437252803" (263.01 x 33.01 at 78.04,0) --- */}
        <Box w={263.01} h={30} x={78.04} y={0}>
          <svg fill="none" height="100%" viewBox="0 0 263.01 30" width="100%">
            <path d={CONDUIT} fill="#515051" />
          </svg>
        </Box>
        {/* Rectangle 39349 / 39348 — the plug down into the logo tile;
            Rectangle 39350 — the plug down into the nav pill */}
        <Box style={{ background: '#2A2A2A' }} w={9.95} h={2} x={95.98} y={14.01} />
        <Box style={{ background: '#2A2A2A' }} w={20.03} h={2.99} x={90.95} y={16.01} />
        <Box style={{ background: '#2A2A2A' }} w={20.03} h={3.01} x={286.97} y={30} />

        {/* --- logo tile, "LOGO": Rectangle 39342 / 39347 + the mark --- */}
        <Stroked className="hm-bezel" r={15} stroke={[5, '#2A2A2A']} w={150.06} h={150.01} x={0} y={23.99} />
        <Stroked className="hm-inset-panel" r={10} stroke={[2, '#000000']} w={139.98} h={140} x={5.04} y={29.01} />
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

      </Stage>
      {/* entrance step 2: the navbar */}
      <Stage step={1}>
        {/* --- nav pill, Rectangle 39345 / 39341 --- */}
        <Stroked className="hm-bezel" r={40} stroke={[5, '#2A2A2A']} w={1017} h={70} x={212} y={38} />
        <Stroked className="hm-inset-panel" r={30} stroke={[2, '#000000']} w={908.97} h={49.99} x={219.99} y={48.01} />

        {MENU.map((item) => (
          <Box
            as={item.href.startsWith('/') ? Link : 'a'}
            className="hm-navlink hm-press"
            {...(item.href.startsWith('/') ? { to: item.href } : { href: item.href })}
            key={item.href}
            style={{ ...type({ size: 24, lh: 29 }), textTransform: item.caps ? 'uppercase' : 'none' }}
            w={item.w}
            h={ROW.h}
            x={item.x}
            y={ROW.y}
          >
            <Label text={item.label} />
          </Box>
        ))}

        {/* --- Rectangle 39346 — the round socket at the pill's end ---
            It held a bell that did nothing when pressed: a focusable control
            with no action. It now holds a status orb, which is not a control
            at all, so the dead tab stop goes with it. The orb is decorative,
            hence aria-hidden; it renders a still frame under reduced motion.
            theme="dark" is pinned because "auto" follows the OS — on a
            light-mode machine it would draw dark dots on this black socket. */}
        <Stroked
          className="hm-inset-panel hm-orb"
          r="full"
          stroke={[2, '#000000']}
          w={49.9}
          h={49.99}
          x={1168.04}
          y={48.01}
        >
          <ThinkingOrb aria-hidden="true" size={64} state="connecting" theme="dark" />
        </Stroked>
      </Stage>
    </>
  )
}

export default NavLayer
