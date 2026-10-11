/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from 'react'
import evaraLogo from '../../images/collab-png/evara.png'
import havoksecLogo from '../../images/collab-png/havoksec.png'
import liveliferehabLogo from '../../images/collab-png/liveliferehab.png'
import raheebLogo from '../../images/collab-png/raheeb_s-perfume.png'
import zophuLogo from '../../images/collab-png/zophu-white.png'
import evaraLinktree from '../../images/projects-img/Evara Linktree.png'
import liveIndia from '../../images/projects-img/liveliferehabindia.png'
import raheebSite from '../../images/projects-img/raheeb perfumes.png'
import { Box, RBox, Stroked, Torx, border, roundedPath, type, u } from './canvas'

/**
 * Projects — Figma group "projects", 1340 x 831.5. Group-relative coordinates.
 *
 * The display and the strip are one component. Picking a client in the strip
 * slides the screen to their work, and that client's disc grows into the tall
 * card while the rest of the row reflows around it — which is exactly the
 * state the Figma export captures, frozen on slot 3.
 */

/* One entry per strip slot. `shot` is the landscape screen image; `portrait`
   overrides the card art when a tall asset exists. Clients with neither fall
   back to a brand card, which is also what the screen shows for them. */
const WORKS = [
  { key: 'havoksec', name: 'HavokSec', logo: havoksecLogo },
  { key: 'zophu', name: 'Zophu', logo: zophuLogo },
  { key: 'liveliferehab', name: 'Live Life Rehab', logo: liveliferehabLogo, shot: liveIndia },
  { key: 'evara', name: 'Evara', logo: evaraLogo, shot: evaraLinktree, portrait: evaraLinktree },
  { key: 'raheeb', name: 'Raheeb’s Perfumes', logo: raheebLogo, shot: raheebSite },
]

const SLIDE_MS = 5200

/* Strip geometry, all read back out of the export's resting state. */
const BAR = { x: 683, w: 646.01, y: 721.49, h: 100.03 }
const DISC = 75
const CARD_W = 147
const CARD_H = 195.98
const CARD_BOTTOM = 807.96
const GAP = 30
const BADGE = { dx: 86.03, dy: 7.99, size: 50 }

/**
 * Lays the row out for a given selection: the active slot is a tall card, the
 * others are discs, separated by a constant 30 and centred in the bar. Solving
 * it this way rather than hard-coding the five positions is what lets the row
 * reflow — the export only ever shows one of the five arrangements.
 */
function layoutStrip(activeIndex, count) {
  const total = (count - 1) * DISC + CARD_W + (count - 1) * GAP
  let x = BAR.x + (BAR.w - total) / 2
  return WORKS.slice(0, count).map((work, i) => {
    const active = i === activeIndex
    const w = active ? CARD_W : DISC
    const slot = {
      work,
      active,
      x,
      w,
      h: active ? CARD_H : DISC,
      y: active ? CARD_BOTTOM - CARD_H : BAR.y + (BAR.h - DISC) / 2,
    }
    x += w + GAP
    return slot
  })
}

/**
 * Auto-advance, until the visitor takes over. It cycles on its own so the
 * section is alive on arrival, holds while the pointer is over it, and stops
 * for good the moment someone picks a client — their choice should not be
 * overwritten a few seconds later. It also never runs under
 * prefers-reduced-motion: content that moves with no way to stop it is
 * exactly what that setting asks us to drop.
 */
function useSlider(count) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [taken, setTaken] = useState(false)
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  useEffect(() => {
    if (count < 2 || taken) return undefined
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = setInterval(() => {
      if (!pausedRef.current) setIndex((i) => (i + 1) % count)
    }, SLIDE_MS)
    return () => clearInterval(id)
  }, [count, taken])

  const select = useCallback((i) => {
    setTaken(true)
    setIndex(i)
  }, [])

  return { index, select, setPaused }
}

/** Screen/card art for a client that has no captured screenshot yet. */
function BrandCard({ work }) {
  return (
    <div className="hm-brandcard">
      <img alt="" draggable={false} src={work.logo} />
      <span>{work.name}</span>
    </div>
  )
}

/* Rectangle 39419 — the ribbon — and Rectangle 39417, the connector plate it
   runs into. */
const RIBBON = { x: 0, y: 10.98, w: 308.07, h: 21.04 }
const PLATE = { x: 285.02, y: 0, w: 51.99, h: 5.99, deg: -54.7 }

/**
 * The ribbon ends flush against the plate's left face, so each wire stops
 * where it meets the plate: the top wire runs furthest, each one below stops
 * a little sooner. In the reference the four wire ends sit on one line at
 * 54.8deg, and the plate's face projected down to each wire row lands on its
 * end to within half a pixel (329.6/330, 316.8/317, 304.1/304, 290.0/289.5).
 *
 * Squared off at 308.07, the ribbon ran on past that face — up to ~16 of
 * wire visible beyond the plate along its lower rows.
 *
 * The face comes straight from the plate's export values: its centre is the
 * rotated-origin box's centre, and its left face sits half its thickness
 * along the rotated normal. Returned as a clip-path in the ribbon's own box.
 */
const RIBBON_CUT = (() => {
  const r = (Math.abs(PLATE.deg) * Math.PI) / 180
  const cos = Math.cos(r)
  const sin = Math.sin(r)
  const cx = PLATE.x + (PLATE.w * cos + PLATE.h * sin) / 2
  const cy = PLATE.y + (PLATE.w * sin + PLATE.h * cos) / 2
  // rotate(-deg) maps the box's y axis (its thickness) to (sin, cos)
  const fx = cx - (PLATE.h / 2) * sin
  const fy = cy - (PLATE.h / 2) * cos
  const xAt = (y) => fx + ((y - fy) * cos) / -sin
  const pct = (x) => `${(((x - RIBBON.x) / RIBBON.w) * 100).toFixed(3)}%`
  return `polygon(0 0, ${pct(xAt(RIBBON.y))} 0, ${pct(xAt(RIBBON.y + RIBBON.h))} 100%, 0 100%)`
})()

/* The ribbon's face. The reference reads the same in every column:
   a #2A2A2A band carrying four #515051 wires, centred 3.41 / 7.89 / 12.38 /
   17.48 below its top, the second one thicker (1.8 against ~1.0). Hard
   stops in design units, so the wires stay crisp at every scale. */
const RIBBON_WIRES = (() => {
  const wires = [
    [3.41, 1.0],
    [7.89, 1.8],
    [12.38, 1.0],
    [17.48, 1.1],
  ]
  const stops = wires.flatMap(([c, w]) => {
    const a = u(c - w / 2)
    const b = u(c + w / 2)
    return [`transparent ${a}`, `#515051 ${a}`, `#515051 ${b}`, `transparent ${b}`]
  })
  return `linear-gradient(180deg, transparent 0, ${stops.join(', ')}, transparent 100%)`
})()

/* ---- Rectangle 39363, the display housing ------------------------------ */

const HOUSE = { x: 101.97, y: 2, w: 1238.03, h: 686.99 }
/* Re-traced from a 2.45x reference (scale pinned on the speaker capsule,
   cross-checked on the ribbon to 0.1-0.5). The earlier, coarser read put
   the low edge 2.75 too low and the rising flank ~4.5 too far right:
   - low top edge at 75.22: the 5 edge band reads 77.22..82.12 in the group
   - rising flank 48.85deg, its OUTER edge measured row by row (the face
     edge is no use there: the inner shadow darkens it). Foot at
     (167.86, 75.22) with an r20 fillet — fitted to the curve, rms 0.19.
     The right foot is outside the reference and takes the same radius
   - apex where the flank meets the descent, (233.26, 0.40), rounded r18 —
     fitted to the reference's crown, rms 0.18 (r12 left the shoulder 1.2
     high)
   - descent at 0.1918, through the same break as before to within 0.3
   The reference stops at x~374 of the housing, so the right foot keeps the
   second descent's slope and simply lands on the raised edge. */
const HOUSE_TOP = 75.22
const HOUSE_EDGE = 5

/* [x, y, corner radius] around the outline, clockwise from the top-left. */
const HOUSE_OUTLINE = [
  [0, HOUSE_TOP, 20],
  [167.86, HOUSE_TOP, 20],
  [233.26, 0.4, 18],
  [438.02, 39.67, 12],
  [475.42, HOUSE_TOP, 20],
  [HOUSE.w, HOUSE_TOP, 20],
  [HOUSE.w, HOUSE.h, 20],
  [0, HOUSE.h, 20],
]

const HOUSE_PATH = roundedPath(HOUSE_OUTLINE)

/**
 * Flat #515051 face, as the export and the reference both have it, with the
 * export's inner shadow and the 5 edge painted over it.
 */
function Housing() {
  return (
    <Box
      w={HOUSE.w}
      h={HOUSE.h}
      x={HOUSE.x}
      y={HOUSE.y}
    >
      <svg height="100%" viewBox={`0 0 ${HOUSE.w} ${HOUSE.h}`} width="100%">
        <defs>
          <clipPath id="hm-house-clip">
            <path d={HOUSE_PATH} />
          </clipPath>
          {/* The export's inset 6 4 4 rgba(0,0,0,.25), rebuilt for a path: the
              shadow is whatever the FILL loses when shifted (6, 4), blurred
              (CSS blur 4 = std-dev 2) and kept inside it; the 5 edge is then
              painted over it. Measured in the reference, that is exactly the
              split: ~1 of shadow left below a top edge (4 - 5 + blur), a
              clear ramp inside the 48.85deg flank (6, 4 projects to 7.15). */}
          <filter
            colorInterpolationFilters="sRGB"
            height="1"
            id="hm-house-inset"
            width="1"
            x="0"
            y="0"
          >
            <feOffset dx="6" dy="4" in="SourceAlpha" result="shifted" />
            <feComposite in="SourceAlpha" in2="shifted" operator="out" result="rim" />
            <feGaussianBlur in="rim" result="soft" stdDeviation="2" />
            <feComposite in="soft" in2="SourceAlpha" operator="in" result="inside" />
            <feFlood floodColor="#000000" floodOpacity="0.25" />
            <feComposite in2="inside" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="shadow" />
            </feMerge>
          </filter>
        </defs>
        <path d={HOUSE_PATH} fill="#515051" filter="url(#hm-house-inset)" />
        {/* stroked at twice the edge width and clipped to the shape, so the
            surviving half is exactly the 5 edge, inside the bounds */}
        <g clipPath="url(#hm-house-clip)">
          <path
            d={HOUSE_PATH}
            fill="none"
            stroke="#2A2A2A"
            strokeLinejoin="round"
            strokeWidth={HOUSE_EDGE * 2}
          />
        </g>
      </svg>
    </Box>
  )
}

function ProjectsLayer() {
  const { index, select, setPaused } = useSlider(WORKS.length)
  const slots = layoutStrip(index, WORKS.length)
  const active = WORKS[index]
  const hold = useCallback(() => setPaused(true), [setPaused])
  const release = useCallback(() => setPaused(false), [setPaused])

  return (
    <div onMouseEnter={hold} onMouseLeave={release}>
      {/* --- Rectangle 39363 — display housing ---
          The export says "rounded rect, 1238.03 x 686.99 at (101.97, 2)".
          The references say otherwise: the top edge sits LOW at 75.22
          across the whole width — just above the screen — with a raised
          hump in the middle that the bounding box was reporting.

          The hump is FIVE vertices, not three: it rises steeply from
          (170, 75) to the apex at (235, 1), falls away shallowly to
          (438, 40), then drops harder to (475, 75). See HOUSE_OUTLINE.

          It is drawn as SVG rather than clip-path because clip-path could
          not carry the two things the reference actually shows. A CSS border
          is painted on the element's box, so clipping erased it everywhere
          the outline left that box — the whole hump had no edge. And
          polygon() has only straight corners, where the reference rounds
          every vertex. Stroking the path solves the first; per-vertex radii
          solve the second. Clipping the stroke to its own fill is what keeps
          the 5 edge INSIDE the stated bounds instead of straddling them. */}
      <Housing />


      {/* --- Group 1437252797 — the conduit, painted AFTER the housing ---
          Rectangle 39419 is `url(.png), #2A2A2A`: an image layer over the flat
          colour, which the reference shows is a ribbon of four wires (see
          RIBBON_WIRES). It lies on black beside the device and ends flush
          against the connector plate (see RIBBON_CUT); the connector then
          meets the hump's rising flank. */}
      <Box
        style={{
          backgroundColor: '#2A2A2A',
          backgroundImage: RIBBON_WIRES,
          clipPath: RIBBON_CUT,
        }}
        w={RIBBON.w}
        h={RIBBON.h}
        x={RIBBON.x}
        y={RIBBON.y}
      />
      {/* Rectangle 39417 / 39416 — the connector head at the ribbon's end */}
      <RBox deg={PLATE.deg} style={{ background: '#2A2A2A' }} w={PLATE.w} h={PLATE.h} x={PLATE.x} y={PLATE.y} />
      <RBox deg={-54.7} r={3} style={{ background: '#2A2A2A' }} w={34.04} h={23.03} x={295.87} y={11.39} />

      <Box
        style={{
          ...type({ family: 'Azonix', weight: 400, size: 40, lh: 40 }),
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        w={245.09}
        h={40}
        x={1072.94}
        y={32.01}
      >
        Projects
      </Box>

      {/* Rectangle 39365 — speaker capsule, and its lens */}
      <RBox
        deg={-90}
        r={20}
        style={{ background: '#2A2A2A', border: border(2, '#000000'), boxSizing: 'border-box' }}
        w={27.74}
        h={97.95}
        x={343.04}
        y={42.74}
      />
      <RBox deg={90} r="full" style={{ background: '#1F1F1F' }} w={18.09} h={18.04} x={348.94} y={47.98} />
      {/* Star 5 — same Torx family as Star 1..4 elsewhere in the frame */}
      <Torx h={13.55} w={11.66} x={351.62} y={51.05} />

      {/* Rectangle 39351 / 39366 — screen, with the slide track inside it.
          Both strokes are OUTSIDE (no box-sizing in the export), so the image
          now fills the track's whole 1194.07 x 569 instead of losing 2 to the
          border on every side. */}
      <Stroked r={10} stroke={[2, '#000000']} style={{ background: '#000000' }} w={1213.91} h={589.03} x={114.03} y={87.97} />
      {/* The image keeps the export's r10: the reference shows it rounded,
          which outranks the concentric-radius rule it was squared for. */}
      <Stroked
        aria-label={`Project showcase — ${active.name}`}
        r={10}
        role="img"
        stroke={[2, '#000000']}
        style={{ overflow: 'hidden' }}
        w={1194.07}
        h={569}
        x={123.95}
        y={98.03}
      >
        <div className="hm-slider" style={{ '--hm-slide': index }}>
          {WORKS.map((work) =>
            work.shot ? (
              <img alt="" draggable={false} key={work.key} src={work.shot} />
            ) : (
              <BrandCard key={work.key} work={work} />
            ),
          )}
        </div>
      </Stroked>

      {/* --- Group 1437252798 — collaborator strip ---
          Its bezel (Rectangle 39363) is the one INSIDE stroke here; the bar,
          the slots and the badge are all outside. */}
      <Box
        className="hm-bezel"
        r={20}
        style={{
          border: border(5, '#2A2A2A'),
          boxSizing: 'border-box',
          boxShadow: `inset ${u(6)} ${u(4)} ${u(4)} rgba(0,0,0,.25)`,
        }}
        w={667.05}
        h={119.99}
        x={672.95}
        y={711.51}
      />
      <Stroked r={10} stroke={[2, '#000000']} style={{ background: '#111111' }} w={BAR.w} h={BAR.h} x={BAR.x} y={BAR.y} />

      {slots.map((slot, i) => {
        const art = slot.work.portrait || slot.work.shot
        return (
          <Stroked
            aria-current={slot.active ? 'true' : undefined}
            aria-label={slot.work.name}
            as="button"
            className={`hm-work ${slot.active ? 'hm-work--active' : 'hm-press'}`}
            key={slot.work.key}
            onClick={() => select(i)}
            r={slot.active ? 10 : DISC / 2}
            stroke={[2, '#000000']}
            type="button"
            w={slot.w}
            h={slot.h}
            x={slot.x}
            y={slot.y}
          >
            {slot.active && art ? (
              <img alt="" className="hm-work-art" draggable={false} src={art} />
            ) : null}
            {slot.active && !art ? <BrandCard work={slot.work} /> : null}
            {!slot.active ? <img alt="" className="hm-work-logo" draggable={false} src={slot.work.logo} /> : null}
          </Stroked>
        )
      })}

      {/* Rectangle 39368/39376 — the active client's logo, badged on the card */}
      <Stroked
        className="hm-work-badge"
        r="full"
        stroke={[2, '#000000']}
        style={{ background: '#111111' }}
        w={BADGE.size}
        h={BADGE.size}
        x={slots[index].x + BADGE.dx}
        y={slots[index].y + BADGE.dy}
      >
        <img alt="" draggable={false} src={active.logo} />
      </Stroked>
    </div>
  )
}

export default ProjectsLayer
