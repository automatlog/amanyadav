/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import { roles } from '../../data/experience'
import { Box, RBox, Torx, border, roundedPath, type, u } from './canvas'

/**
 * Experience — Figma group "Experience", 1259.5 x 595.05.
 * Contains the panel ("experience", 848.53 x 555 at 0,0) and the three link
 * cards down the right. All coordinates are group-relative.
 */

/* Rectangle 39359 x3 — card y from the export; titles keep their own box. */
/* Each card's body is from the EDUCATION, CERTIFICATIONS and COMMUNITY
   sections of private/Aman Yadav — Resume.pdf. */
const CARDS = [
  {
    title: 'Education',
    y: 13.98,
    to: '/achievements',
    title_x: 20.78,
    title_w: 110.08,
    title_y: 15.65,
    lead: 'B.Tech, Computer Science & Engineering',
    detail: 'Cybersecurity & Networking — ITM SLS Baroda University',
    meta: '2020 – 2024',
  },
  {
    title: 'Achievements',
    y: 217.67,
    to: '/achievements',
    title_x: 20.03,
    title_w: 152.02,
    title_y: 16.3,
    lead: '9 certifications',
    detail: 'Azure Administrator (AZ-104), ISO/IEC 27001, TryHackMe Security Engineer',
    meta: 'and 6 more',
  },
  {
    title: 'Community',
    y: 421.35,
    to: '/achievements',
    title_x: 19.78,
    title_w: 112.1,
    title_y: 15.65,
    lead: 'Management Lead & Student Ambassador',
    detail: 'GDSC (ITMBU), AWS User Group Vadodara, DeepLearning.AI',
    meta: '3 communities',
  },
]

const CARD_X = 929.51
const CARD_W = 329.99
const CARD_H = 173.7

/**
 * Rectangle 39359 — exported as a 329.99 x 173.7 rounded rect, but it is a
 * vector with its bottom-left corner cut away. Traced from the reference at
 * scale 1.210, the cut's OUTER edge is y = 114.18 + 0.739x (36.5deg): it
 * leaves the left side at (0, 114.2) and meets the bottom at (80.5, 173.7).
 *
 * The export's 26.05 radius applies to every vertex, chamfer included; the
 * reference agrees, its rounding starting where r26.05 predicts on both ends
 * (y 102 vs 101.0, x 88 vs 89.1). The 8.68 stroke is INSIDE (box-sizing in
 * the export), so the path runs 4.34 in from that outline — the cut edge
 * moved along its own normal — and its corners take 26.05 - 4.34 = 21.71,
 * which puts the stroke's outer edge back on 26.05.
 */
const CARD_CENTRELINE = roundedPath([
  [4.34, 4.34, 21.71],
  [325.65, 4.34, 21.71],
  [325.65, 169.36, 21.71],
  [81.98, 169.36, 21.71],
  [4.34, 111.99, 21.71],
])

/**
 * Arrow 2 — a 22.42 line at -55deg with Figma's line-arrow head; its legs are
 * 6.9 long at 45deg either side of the shaft, measured from the reference.
 * Placed by the rotated-origin rule it runs parallel to the capsule's long
 * axis (54.32deg) and centred in it to within 0.4 — so it is drawn INSIDE the
 * capsule, in the capsule's own frame, pointing straight along it, with the
 * 0.68deg between the two axes restored. Drawn that way, the capsule is the
 * arrow's window: on hover the arrow leaves through the top and a fresh one
 * arrives from the bottom, clipped to the pill.
 */
const CAPSULE = { w: 26.07, h: 43.44 }
const ARROW = (() => {
  const cx = CAPSULE.w / 2
  const cy = CAPSULE.h / 2
  const tip = cy - 22.42 / 2
  const leg = 6.9 / Math.SQRT2
  return `M${cx} ${cy + 22.42 / 2}V${tip}M${cx - leg} ${tip + leg}L${cx} ${tip}L${cx + leg} ${tip + leg}`
})()

function ArrowGlyph({ next = false }) {
  return (
    <Box
      className={`hm-linkcard-arrow${next ? ' hm-linkcard-arrow--next' : ''}`}
      w={CAPSULE.w}
      h={CAPSULE.h}
      x={-0.868}
      y={-0.868}
    >
      <svg
        fill="none"
        height="100%"
        style={{ transform: 'rotate(-0.68deg)' }}
        viewBox={`0 0 ${CAPSULE.w} ${CAPSULE.h}`}
        width="100%"
      >
        <path d={ARROW} stroke="#FFFFFF" strokeWidth="1.73684" />
      </svg>
    </Box>
  )
}

/**
 * Subtract + Ellipse 5907 + Ellipse 5909 — the hairline under the title.
 * "Subtract" is a boolean, not the solid 107.56 x 5.3 bar its box suggests:
 * a 1px #7E7E7E line with a filled r2.65 dot at its right end and a ring at
 * its left — the box overhangs the line by exactly that 2.65 at each end.
 * Ellipse 5909 (r2.02) is the ring's hole. The card has no fill, so in the
 * reference that hole shows the black behind it, not #515051; the line stops
 * at the ring rather than running through it.
 */
const LINE_Y = 41.66
const LINE_X0 = 25.69
const LINE_X1 = 127.97
const DOT_R = 2.65
const HOLE_R = 2.02

function CardOutline() {
  return (
    <svg
      fill="none"
      height="100%"
      preserveAspectRatio="none"
      style={{ position: 'absolute', inset: 0 }}
      viewBox="0 0 330 173.7"
      width="100%"
    >
      <path className="hm-linkcard-outline" d={CARD_CENTRELINE} stroke="#2A2A2A" strokeWidth="8.68421" />
    </svg>
  )
}

function LinkCard({ title, y, to, title_x, title_w, title_y, lead, detail, meta }) {
  return (
    <Box as={Link} className="hm-linkcard hm-press" to={to} w={CARD_W} h={CARD_H} x={CARD_X} y={y}>
      <CardOutline />

      <Box
        className="hm-linkcard-title"
        style={{
          ...type({ family: 'Azonix', weight: 400, size: 17.3684, lh: '160%' }),
          color: '#D6D6D6',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
        }}
        w={title_w}
        h={28.03}
        x={title_x}
        y={title_y}
      >
        {title}
      </Box>

      {/* The card's content, under the hairline: a lead line and two lines of
          detail, ending above y~118 where the cut corner starts to close in
          on the left. The short meta line sits bottom-RIGHT instead, in the
          corner the cut leaves clear. */}
      <Box className="hm-linkcard-body" w={276} h={64} x={24} y={56}>
        <span className="hm-linkcard-lead">{lead}</span>
        <span className="hm-linkcard-detail">{detail}</span>
      </Box>
      <Box className="hm-linkcard-meta" w={200} h={14} x={100} y={140}>
        {meta}
      </Box>

      {/* Subtract + Ellipse 5907 + Ellipse 5909 — see LINE_Y. The 3.21 drop
          shadow is Ellipse 5907's, which the grey sits on top of. */}
      <Box w={107.56} h={5.3} x={23.05} y={39.04}>
        <svg
          fill="none"
          height="100%"
          style={{ overflow: 'visible', filter: `drop-shadow(0 ${u(3.21)} ${u(3.21)} rgba(0,0,0,.25))` }}
          viewBox="23.05 39.04 107.56 5.3"
          width="100%"
        >
          <path d={`M${LINE_X0 + DOT_R} ${LINE_Y}H${LINE_X1}`} stroke="#7E7E7E" strokeWidth="1" />
          <circle cx={LINE_X1} cy={LINE_Y} fill="#7E7E7E" r={DOT_R} />
          <circle cx={LINE_X0} cy={LINE_Y} r={(DOT_R + HOLE_R) / 2} stroke="#7E7E7E" strokeWidth={DOT_R - HOLE_R} />
        </svg>
      </Box>

      {/* Rectangle 39372 — the angled capsule, and Arrow 2 inside it (see ARROW) */}
      <RBox
        className="hm-linkcard-capsule"
        deg={35.68}
        r={26.0526}
        style={{
          background: '#1F1F1F',
          border: border(0.868, '#000000'),
          boxSizing: 'border-box',
        }}
        w={CAPSULE.w}
        h={CAPSULE.h}
        x={273.44}
        y={10.42}
      >
        <ArrowGlyph />
        <ArrowGlyph next />
      </RBox>
    </Box>
  )
}

/**
 * Rectangle 39369 — the banner. One vector, 694.5 x 311, traced from the
 * reference at scale 1.211; the export gives only its box and
 * `border-radius: 10`, which Figma applies to EVERY vertex.
 *
 * It is one continuous shape, which is why the box is 311 tall:
 *   - a head across the top: a slanted brow rising from (0, 8.6) to the
 *     y=0 crown (78..165), a step down to the ~12 line, and a raised tab
 *     peaking at (647.1, 3.7) before it runs into the panel's top border
 *   - an underside that steps up twice: a 0.30 diagonal (345, 98.7) to
 *     (420, 76.3), and a 0.95 diagonal (615, 78.6) up to the panel's inner
 *     top edge at (672.7, 24)
 *   - a band running down the panel's left border (19.52..29.52) — invisible
 *     there, being the border's own colour — out into the nub housing, whose
 *     two lower diagonals meet at (24.34, 311.15): the box's bottom, 311.
 * The inner corner where the underside turns down into the band is r20
 * (fitted from three samples); every other corner is the export's 10.
 *
 * [x, y, corner radius], clockwise from the brow.
 */
const BANNER = roundedPath([
  [0, 8.6, 10],
  [78, 0, 10],
  [165, 0, 10],
  [191, 11.4, 10],
  [629.8, 12.6, 10],
  [647.1, 3.7, 10],
  [694.5, 15.8, 0],
  [694.5, 23.98, 0],
  [672.7, 23.98, 10],
  [615, 78.6, 10],
  [419.7, 76.3, 10],
  [345, 98.7, 10],
  [29.52, 93.17, 20],
  [29.52, 178.4, 10],
  [47.2, 192.9, 10],
  [47, 293.3, 10],
  [24.34, 311.15, 10],
  [5.04, 281.9, 10],
  [0, 186.1, 10],
  [19.52, 178.1, 10],
  [19.52, 91.3, 10],
  [0, 71.1, 10],
])

function ExperienceLayer() {
  return (
    <>
      {/* Rectangle 39357 — the black panel */}
      <Box
        r={30}
        style={{
          background: '#000000',
          border: border(10, '#2A2A2A'),
          boxSizing: 'border-box',
          boxShadow: `inset 0 ${u(4)} ${u(24)} rgba(0,0,0,.9)`,
        }}
        w={829}
        h={541.02}
        x={19.52}
        y={13.98}
      />

      {/* Rectangle 39369 — the banner (see BANNER). Painted after the panel. */}
      <Box w={694.5} h={311} x={0} y={0}>
        <svg fill="none" height="100%" viewBox="0 0 694.5 311" width="100%">
          <path d={BANNER} fill="#2A2A2A" />
        </svg>
      </Box>

      {/* Ellipse 5909 + Star 3 — the banner screw. Star 3 carries the group's
          rotate(90deg) and its own 2.05 corner radius. */}
      <Box r="full" style={{ background: '#1F1F1F' }} w={35.01} h={35.05} x={549.52} y={23.98} />
      <Torx corner={2.04793} deg={90} h={26.24} w={22.67} x={553.8} y={29.99} />

      {/* Rectangle 39374 — left-edge nub, with its Torx at the top and
          Ellipse 5910 as the bead at the bottom */}
      <Box
        r={30}
        style={{ background: '#1F1F1F', border: border(1, '#000000'), boxSizing: 'border-box' }}
        w={19.4}
        h={53.26}
        x={13.48}
        y={206.01}
      />
      {/* Star 4 — rotate(90deg), 0.76 corner radius */}
      <Torx corner={0.76066} deg={90} h={12.02} w={11.96} x={17.51} y={209.99} />
      <Box r="full" style={{ background: '#515051' }} w={12.97} h={12.97} x={16.5} y={243.02} />

      {/* headings */}
      <Box
        style={{
          ...type({ family: 'Azonix', weight: 400, size: 40, lh: 40 }),
          color: '#D6D6D6',
          display: 'flex',
          alignItems: 'center',
        }}
        w={289.06}
        h={39.99}
        x={83.5}
        y={31}
      >
        Experience
      </Box>
      <Box
        style={{
          ...type({ family: 'Azonix', weight: 400, size: 20, lh: '160%' }),
          color: '#D6D6D6',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
        }}
        w={169.91}
        h={31.95}
        x={74.56}
        y={115.02}
      >
        Professional
      </Box>

      {/* The roles, as a timeline under the heading: a rail on the left with a
          node per role — a ring for the current one, filled dots for the rest
          (the same ring / dot pair the link cards' hairlines use). Laid out in
          the panel's open area, clear of the nub housing on the left edge. */}
      <Box as="ol" className="hm-timeline" w={736} h={372} x={74.56} y={166}>
        {roles.map((r) => (
          <li className={`hm-role${r.current ? ' hm-role--current' : ''}`} key={`${r.company}-${r.period}`}>
            <div className="hm-role-head">
              <h3 className="hm-role-title">
                {r.role} <span className="hm-role-company">· {r.company}</span>
              </h3>
              <span className="hm-role-period">{r.period}</span>
            </div>
            <p className="hm-role-summary">{r.summary}</p>
            <ul aria-label="Focus" className="hm-role-tags">
              {r.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </li>
        ))}
      </Box>

      {CARDS.map((card) => (
        <LinkCard key={card.title} {...card} />
      ))}
    </>
  )
}

export default ExperienceLayer
