/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { motion } from 'framer-motion'
import { createContext, useContext } from 'react'

/**
 * The Home frame is a 1440 x 3427.55 Figma auto-layout:
 *
 *   display: flex; flex-direction: column; align-items: center;
 *   padding: 28px 0; gap: 134px;
 *
 * It is reproduced as a real flex column, so the vertical rhythm comes from
 * the same padding/gap the design uses rather than from hand-computed page
 * coordinates. Each section is its own positioned group, and every child keeps
 * the group-relative coordinate the Figma export gives it.
 *
 * `--u` is one design pixel (see home.css).
 */
export const FRAME_W = 1440
export const FRAME_PAD = 28
export const FRAME_GAP = 134

/** design px -> canvas units */
export const u = (n) => `calc(${n} * var(--u))`

/** shorthand for the many `Npx solid #hex` borders in the spec */
export const border = (width, color) => `${u(width)} solid ${color}`

/** type helper — sizes scale with the canvas like everything else */
export const type = ({ family = 'Inter', weight = 500, size, lh, spacing }) => ({
  fontFamily: family,
  fontWeight: weight,
  fontSize: u(size),
  ...(lh !== undefined && { lineHeight: typeof lh === 'number' ? u(lh) : lh }),
  ...(spacing !== undefined && { letterSpacing: u(spacing) }),
})

/**
 * Figma reports a rotated element's POST-transform bounding-box origin, but
 * its PRE-transform width/height. CSS needs the un-rotated box's origin, so
 * convert by centring the element inside the bounding box Figma reports.
 *
 * Verified against the export: the card's corner capsule (41.54 x 92.29 at
 * -45deg) yields a 94.63 square — exactly the size Figma gives its parent
 * "Group 2" — and the two rotated conduit pieces land exactly on their
 * group's stated 334.33 x 52.47 bounds.
 */
export function rotatedOrigin(bx, by, w, h, deg) {
  const r = (Math.abs(deg) * Math.PI) / 180
  const cos = Math.abs(Math.cos(r))
  const sin = Math.abs(Math.sin(r))
  return {
    x: bx + (w * cos + h * sin - w) / 2,
    y: by + (w * sin + h * cos - h) / 2,
  }
}

/**
 * One absolutely-positioned design rectangle.
 * x/y/w/h/r are design pixels; `r: 'full'` gives a pill/circle.
 */
export function Box({ x, y, w, h, r, as: Tag = 'div', style, ...rest }) {
  return (
    <Tag
      style={{
        position: 'absolute',
        ...(x !== undefined && { left: u(x) }),
        ...(y !== undefined && { top: u(y) }),
        ...(w !== undefined && { width: u(w) }),
        ...(h !== undefined && { height: u(h) }),
        ...(r !== undefined && { borderRadius: r === 'full' ? '9999px' : u(r) }),
        ...style,
      }}
      {...rest}
    />
  )
}

/**
 * A rotated design rectangle. x/y are the bounding-box origin Figma reports;
 * w/h are the pre-rotation size. See rotatedOrigin above.
 */
export function RBox({ x, y, w, h, deg, style, ...rest }) {
  const o = rotatedOrigin(x, y, w, h, deg)
  return (
    <Box
      style={{ transform: `rotate(${deg}deg)`, ...style }}
      w={w}
      h={h}
      x={o.x}
      y={o.y}
      {...rest}
    />
  )
}

/**
 * A Figma rectangle with an OUTSIDE stroke.
 *
 * This file draws its strokes outside the shape: the export's x/y/w/h is the
 * FILL, and the 5 (or 2) border sits beyond it. Measured on the nav, the logo
 * tile reads 160 across, not 150.06, and its outer edge lands exactly on
 * Figma's selection handle only that way. CSS draws a border inside the box,
 * so the box is grown by the stroke on every side; its radius grows with it
 * so the FILL keeps the exported radius. Children still use fill-relative
 * coordinates, because they are positioned inside the border.
 */
export function Stroked({ x, y, w, h, r, stroke, style, ...rest }) {
  const [width, color] = stroke
  return (
    <Box
      r={r === 'full' ? 'full' : r + width}
      style={{ border: border(width, color), boxSizing: 'border-box', ...style }}
      w={w + 2 * width}
      h={h + 2 * width}
      x={x - width}
      y={y - width}
      {...rest}
    />
  )
}

/**
 * Rounds every vertex of a closed polygon by the radius carried on it,
 * returning an SVG path.
 *
 * Each corner becomes a circular arc tangent to both adjacent edges, so the
 * radius is honoured exactly. The sweep flag comes from the sign of the turn,
 * which is what lets one routine fillet concave corners as well as convex
 * ones.
 *
 * Radii only shrink when two corners genuinely compete for the same edge:
 * if their tangent lengths add up to more than the edge, both are scaled
 * back in proportion. A blanket "half the shorter edge" cap would crush a
 * large fillet beside a short edge for no reason — the nav conduit's r14
 * inner corner sits on a 15.8 edge whose other corner only needs 1.
 */
export function roundedPath(pts) {
  const n = pts.length
  const corners = pts.map(([bx, by, r], i) => {
    const [ax, ay] = pts[(i - 1 + n) % n]
    const [cx, cy] = pts[(i + 1) % n]
    const l1 = Math.hypot(ax - bx, ay - by)
    const l2 = Math.hypot(cx - bx, cy - by)
    const u1 = { x: (ax - bx) / l1, y: (ay - by) / l1 }
    const u2 = { x: (cx - bx) / l2, y: (cy - by) / l2 }
    const half = Math.acos(Math.max(-1, Math.min(1, u1.x * u2.x + u1.y * u2.y))) / 2
    return {
      b: [bx, by],
      u1,
      u2,
      half,
      t: r / Math.tan(half),
      sweep: (bx - ax) * (cy - by) - (by - ay) * (cx - bx) > 0 ? 1 : 0,
    }
  })

  // edge i runs from corner i to corner i+1
  const scale = corners.map(() => 1)
  corners.forEach((c, i) => {
    const d = corners[(i + 1) % n]
    const len = Math.hypot(d.b[0] - c.b[0], d.b[1] - c.b[1])
    const need = c.t + d.t
    if (need > len) {
      const k = len / need
      scale[i] = Math.min(scale[i], k)
      scale[(i + 1) % n] = Math.min(scale[(i + 1) % n], k)
    }
  })

  const f = (v) => v.toFixed(2)
  return corners
    .map((c, i) => {
      const t = c.t * scale[i]
      const r = t * Math.tan(c.half)
      const from = [c.b[0] + c.u1.x * t, c.b[1] + c.u1.y * t]
      const to = [c.b[0] + c.u2.x * t, c.b[1] + c.u2.y * t]
      const move = i === 0 ? 'M' : 'L'
      return `${move}${f(from[0])} ${f(from[1])}A${f(r)} ${f(r)} 0 0 ${c.sweep} ${f(to[0])} ${f(to[1])}`
    })
    .concat('Z')
    .join('')
}

/**
 * Six-point Torx recess — Figma's own Star node, reproduced rather than
 * approximated. Every screw head in the frame uses it (the export names them
 * "Star 1".."Star 5").
 *
 *   - a REGULAR point-up hexagram with Figma's default inner ratio, 0.382,
 *     tip radius h/2, centred in the exported w x h. Figma puts a star's
 *     points on the ellipse inscribed in its node, so a square node (the
 *     28.39 x 28.33 screws) is a regular star only 0.866 as wide as its box;
 *     fitting the star to the whole box stretched those 2.5 too wide. Where
 *     the box is already 0.866 wide (21.02 x 24.23) both readings agree.
 *   - the export's `border-radius: 1.89` rounds all twelve corners. On tips
 *     this sharp that pulls each one back by ~4.6, which is why the visible
 *     star is only ~60% of its box and reads as stubby rounded lobes — a
 *     real Torx head — rather than the spiky star the box suggests.
 *
 * `deg` rotates it the way the export says. Like every rotated node here, the
 * exported x/y is the POST-rotation bounding-box origin with the PRE-rotation
 * w/h (see rotatedOrigin); measured on the card's TR star, that lands its
 * centre 0.9 from the reference, where ignoring it is 3.3 out.
 */
const STAR_RATIO = 0.382
const STAR_CORNER = 1.89007

export function starPath(w, h, corner = STAR_CORNER) {
  const pts = []
  for (let i = 0; i < 12; i += 1) {
    const a = ((i * 30 - 90) * Math.PI) / 180
    const k = i % 2 === 0 ? 1 : STAR_RATIO
    const r = (h / 2) * k
    pts.push([w / 2 + r * Math.cos(a), h / 2 + r * Math.sin(a), corner])
  }
  return roundedPath(pts)
}

/** A Torx recess sized and placed in design units. `corner` is the
    export's border-radius for that star where it differs from the usual 1.89. */
export function Torx({ x, y, w, h, deg = 0, corner = STAR_CORNER, fill = '#000000' }) {
  const o = deg ? rotatedOrigin(x, y, w, h, deg) : { x, y }
  return (
    <Box style={deg ? { transform: `rotate(${deg}deg)` } : undefined} w={w} h={h} x={o.x} y={o.y}>
      <svg height="100%" viewBox={`0 0 ${w} ${h}`} width="100%">
        <path d={starPath(w, h, corner)} fill={fill} />
      </svg>
    </Box>
  )
}

/**
 * One section of the frame — a flex item sized exactly as its Figma group,
 * establishing the containing block for its children.
 *
 * The reveal animates an INNER wrapper, never the section itself: the section
 * carries the `id` that in-page nav scrolls to, and translating it would make
 * the browser scroll to a displaced box and then visibly jump on settle.
 */
export function Section({ w, h, id, children, delay = 0, reveal = true }) {
  if (!reveal) {
    return (
      <section className="hm-section" id={id} style={{ width: u(w), height: u(h) }}>
        <div className="hm-section-inner">{children}</div>
      </section>
    )
  }
  return (
    <section className="hm-section" id={id} style={{ width: u(w), height: u(h) }}>
      <motion.div
        className="hm-section-inner"
        initial={{ opacity: 0, y: 30 }}
        transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, amount: 0.15 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        {children}
      </motion.div>
    </section>
  )
}

/**
 * The first screen's staged entrance. HomePage provides whether it should
 * play and when it starts; each <Stage> is one step of it, `step` apart.
 * A stage is a full-size layer over its section, so everything inside keeps
 * its group-relative coordinates. When the entrance is not playing, a stage
 * is nothing at all and its children render as they are.
 */
export const StageContext = createContext({ enabled: false, base: 0 })
const STAGE_GAP_S = 0.28

export function Stage({ step, children }) {
  const { enabled, base } = useContext(StageContext)
  if (!enabled) return children
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="hm-stage"
      initial={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.7, delay: base + step * STAGE_GAP_S, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}
