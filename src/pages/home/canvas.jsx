/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { motion } from 'framer-motion'

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
 * Six-point Torx recess, on a 24x24 viewBox with alternating outer/inner
 * radius. Every screw head in the frame uses it — the export names these
 * nodes "Star 1".."Star 5", and `border-radius: ~1.9` is what rounds the
 * points, which stroke-linejoin: round reproduces.
 */
export const TORX_PATH = (() => {
  const pts = []
  for (let i = 0; i < 12; i += 1) {
    const r = i % 2 === 0 ? 10.4 : 6.4
    const a = ((i * 30 - 90) * Math.PI) / 180
    pts.push(`${(12 + r * Math.cos(a)).toFixed(2)} ${(12 + r * Math.sin(a)).toFixed(2)}`)
  }
  return `M${pts.join('L')}Z`
})()

/** A Torx recess sized and placed in design units. */
export function Torx({ x, y, w, h, fill = '#000000' }) {
  return (
    <Box w={w} h={h} x={x} y={y}>
      <svg height="100%" preserveAspectRatio="none" viewBox="0 0 24 24" width="100%">
        <path d={TORX_PATH} fill={fill} stroke={fill} strokeLinejoin="round" strokeWidth="1.6" />
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
export function Section({ w, h, id, children, delay = 0 }) {
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
