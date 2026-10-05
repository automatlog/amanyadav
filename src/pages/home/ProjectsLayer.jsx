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
import { Box, RBox, Torx, border, type, u } from './canvas'

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
  { key: 'raheeb', name: "Raheeb's Perfumes", logo: raheebLogo, shot: raheebSite },
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

/* ---- Rectangle 39363, the display housing ------------------------------ */

const HOUSE = { x: 101.97, y: 2, w: 1238.03, h: 686.99 }
const HOUSE_TOP = 77.97
const HOUSE_EDGE = 5

/* [x, y, corner radius] around the outline, clockwise from the top-left. */
const HOUSE_OUTLINE = [
  [0, HOUSE_TOP, 20],
  [174.07, HOUSE_TOP, 16],
  [238.07, 0, 12],
  [438.02, 39.98, 12],
  [477.99, HOUSE_TOP, 16],
  [HOUSE.w, HOUSE_TOP, 20],
  [HOUSE.w, HOUSE.h, 20],
  [0, HOUSE.h, 20],
]

/**
 * Rounds every vertex of a closed polygon by the radius carried on it.
 *
 * Each corner becomes a circular arc tangent to both adjacent edges, so the
 * radius is honoured exactly rather than approximated with a curve. The sweep
 * flag comes from the sign of the turn, which is what lets the same routine
 * round the hump's two concave feet as well as its convex apex — a fillet in
 * the valleys, a fillet on the peaks. Radii are clamped to half the shorter
 * neighbouring edge so a generous corner can never overrun a short segment.
 */
function roundedPath(pts) {
  const n = pts.length
  const corners = pts.map(([bx, by, r], i) => {
    const [ax, ay] = pts[(i - 1 + n) % n]
    const [cx, cy] = pts[(i + 1) % n]
    const l1 = Math.hypot(ax - bx, ay - by)
    const l2 = Math.hypot(cx - bx, cy - by)
    const u1 = { x: (ax - bx) / l1, y: (ay - by) / l1 }
    const u2 = { x: (cx - bx) / l2, y: (cy - by) / l2 }
    const half = Math.acos(Math.max(-1, Math.min(1, u1.x * u2.x + u1.y * u2.y))) / 2
    const t = Math.min(r / Math.tan(half), l1 / 2, l2 / 2)
    return {
      from: [bx + u1.x * t, by + u1.y * t],
      to: [bx + u2.x * t, by + u2.y * t],
      r: t * Math.tan(half),
      sweep: (bx - ax) * (cy - by) - (by - ay) * (cx - bx) > 0 ? 1 : 0,
    }
  })

  const f = (v) => v.toFixed(2)
  const arc = (c) => `A${f(c.r)} ${f(c.r)} 0 0 ${c.sweep} ${f(c.to[0])} ${f(c.to[1])}`
  return corners
    .map((c, i) => (i === 0 ? `M${f(c.from[0])} ${f(c.from[1])}${arc(c)}` : `L${f(c.from[0])} ${f(c.from[1])}${arc(c)}`))
    .concat('Z')
    .join('')
}

const HOUSE_PATH = roundedPath(HOUSE_OUTLINE)

/**
 * The face keeps the .hm-bezel recipe — #515051 with a sheen off the top and
 * a darkened foot — but as a gradient in the shape's own space, so the sheen
 * follows the hump instead of stopping at a box edge that no longer exists.
 */
function Housing() {
  return (
    <Box
      style={{ filter: `drop-shadow(0 ${u(6)} ${u(18)} rgba(0,0,0,.55))` }}
      w={HOUSE.w}
      h={HOUSE.h}
      x={HOUSE.x}
      y={HOUSE.y}
    >
      <svg height="100%" viewBox={`0 0 ${HOUSE.w} ${HOUSE.h}`} width="100%">
        <defs>
          <linearGradient id="hm-house-face" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#666566" />
            <stop offset={HOUSE_TOP / HOUSE.h} stopColor="#515051" />
            <stop offset="0.977" stopColor="#515051" />
            <stop offset="1" stopColor="#3E3D3E" />
          </linearGradient>
          <clipPath id="hm-house-clip">
            <path d={HOUSE_PATH} />
          </clipPath>
        </defs>
        <path d={HOUSE_PATH} fill="url(#hm-house-face)" />
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
          The selection outline says otherwise: the top edge sits LOW at 77.97
          across the whole width — just above the screen's 87.97 — with a
          raised hump in the middle. y=2 is touched only at the hump's apex,
          which is all the bounding box was ever reporting.

          The hump is FIVE vertices, not three: it rises steeply from
          (174, 78) to the apex at (238, 0), falls away shallowly to
          (438, 40), then drops harder to (478, 78).

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
          colour. The reference shows what that image is — a ribbon of five
          wires, not a solid slab (21.04 tall over 5 gives a 4.21 pitch).
          The ribbon's y 11..32 clears the housing's 83 top edge, so it lies on
          black beside the device; the connector then meets the hump's rising
          diagonal, which is what the cut-away corner exists to allow. */}
      <Box
        style={{
          backgroundColor: '#2A2A2A',
          backgroundImage: `repeating-linear-gradient(180deg, #3d3c3d 0, #3d3c3d ${u(2.1)}, #151515 ${u(2.1)}, #151515 ${u(4.21)})`,
        }}
        w={308.07}
        h={21.04}
        x={0}
        y={10.98}
      />
      {/* Rectangle 39417 / 39416 — the connector head at the ribbon's end */}
      <RBox deg={-54.7} style={{ background: '#2A2A2A' }} w={51.99} h={5.99} x={285.02} y={0} />
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

      {/* Rectangle 39351 / 39366 — screen, with the slide track inside it */}
      <Box
        r={10}
        style={{ background: '#000000', border: border(2, '#000000'), boxSizing: 'border-box' }}
        w={1213.91}
        h={589.03}
        x={114.03}
        y={87.97}
      />
      <Box
        aria-label={`Project showcase — ${active.name}`}
        r={10}
        role="img"
        style={{ border: border(2, '#000000'), boxSizing: 'border-box', overflow: 'hidden' }}
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
      </Box>

      {/* --- Group 1437252798 — collaborator strip --- */}
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
      <Box
        r={10}
        style={{ background: '#111111', border: border(2, '#000000'), boxSizing: 'border-box' }}
        w={BAR.w}
        h={BAR.h}
        x={BAR.x}
        y={BAR.y}
      />

      {slots.map((slot, i) => {
        const art = slot.work.portrait || slot.work.shot
        return (
          <Box
            aria-current={slot.active ? 'true' : undefined}
            aria-label={slot.work.name}
            as="button"
            className={`hm-work ${slot.active ? 'hm-work--active' : ''}`}
            key={slot.work.key}
            onClick={() => select(i)}
            r={slot.active ? 10 : DISC / 2}
            style={{ border: border(2, '#000000'), boxSizing: 'border-box' }}
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
          </Box>
        )
      })}

      {/* Rectangle 39368/39376 — the active client's logo, badged on the card */}
      <Box
        className="hm-work-badge"
        r="full"
        style={{ background: '#111111', border: border(2, '#000000'), boxSizing: 'border-box' }}
        w={BADGE.size}
        h={BADGE.size}
        x={slots[index].x + BADGE.dx}
        y={slots[index].y + BADGE.dy}
      >
        <img alt="" draggable={false} src={active.logo} />
      </Box>
    </div>
  )
}

export default ProjectsLayer
