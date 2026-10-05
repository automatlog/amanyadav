/* eslint-disable react/prop-types */
import { Box, RBox, Torx, border, type, u } from './canvas'
import { heroContent } from './content'

/**
 * About — Figma group "about", 1229 x 477. Group-relative coordinates.
 *
 * The identity card sits at (786.56, 14.98) — vertically centred in the group
 * (14.98 above / 18.98 below) rather than flush to its top. Its children are
 * given below in CARD-relative terms (export value minus the card origin).
 */

/**
 * Resume is anchored to the group's left rail, not to the pill above it.
 *
 * Figma's x for this button is 88.98 — the WHO@MI pill's edge — but the
 * reference view places it at the far left, flush with the ring and disc
 * (2.83) and so with the nav logo tile a section above. That resolves the
 * cluster's competing left edges: ring, disc and Resume now share one rail
 * instead of the button starting 86px further in.
 *
 * y returns to the Figma 413.99. Measuring the reference put it at 419.3,
 * inside the error of that reading, so the export value stands.
 */
const RESUME_X = 2.83
const RESUME_Y = 413.99

/* Corner screws. The export calls the recess "Star 1"/"Star 2" and the
   reference render shows exactly that — a six-point Torx head, not a plain
   square. Each screw keeps its own recess size and offset from the export;
   the top-right one is deliberately narrower than the other three. */
const SCREWS = [
  { x: 13.76, y: 13.88, star: { w: 28.27, h: 28.33, dx: 2.83, dy: 1.48 }, w: 32.32, h: 32.29 },
  { x: 404.22, y: 7.39, star: { w: 21.02, h: 24.23, dx: 4.55, dy: 5.53 }, w: 32.32, h: 32.29 },
  { x: 7.37, y: 404.26, star: { w: 28.39, h: 28.33, dx: 2.71, dy: 1.86 }, w: 32.2, h: 32.29 },
  { x: 404.22, y: 404.26, star: { w: 28.39, h: 28.33, dx: 2.7, dy: 1.86 }, w: 32.32, h: 32.29 },
]

function Screw({ x, y, star, w, h }) {
  return (
    <Box r="full" style={{ background: '#1F1F1F' }} w={w} h={h} x={x} y={y}>
      <Torx h={star.h} w={star.w} x={star.dx} y={star.dy} />
    </Box>
  )
}

/**
 * The identity cluster is ONE merged silhouette, not three separate shapes.
 *
 * The export's "Subtract" (85.05 x 85.38 at 46.09, 154.36, #515051) sits in
 * the gap between the avatar disc and the WHO@MI pill: it is the tapered neck
 * that unions them, with concave fillets on both flanks. Figma exports boolean
 * results as a bare bounding box, so the neck is reconstructed here as a
 * metaball join — two fillet arcs tangent to both circles. Radius 57 is set
 * from the reference: it puts the neck's waist at 23.7, and it also clears
 * the red ring by 9.2 rather than the 5.6 a wider fillet leaves.
 *
 * Coordinates are relative to the "Pointer" group (Rectangle 9) at (0, 114),
 * and each subpath is inset by the 5px border so that stroking at 2x the
 * border and filling over it lands the outer edge exactly on the Figma bounds.
 */
const CLUSTER_UNION = [
  // Rectangle 50 — pill
  'M129.00 8.58 L317.87 8.58 A35.02 35.02 0 0 1 317.87 78.62 L129.00 78.62 A35.02 35.02 0 0 1 129.00 8.58 Z',
  // Rectangle 54 — avatar disc
  'M77.84 130.11 A35.01 35.01 0 1 1 7.83 130.11 A35.01 35.01 0 1 1 77.84 130.11 Z',
  // "Subtract" — the neck
  'M40.67 95.17 A57 57 0 0 0 94.04 41.57 L131.16 78.55 A57 57 0 0 0 77.78 132.13 Z',
].join(' ')

/** Line 28 / Line 29 — hairlines at -45deg. */
function Tick({ x, y, w }) {
  return <RBox deg={-45} style={{ borderTop: border(1.85, '#FFFFFF') }} w={w} h={0} x={x} y={y} />
}

function AboutLayer() {
  return (
    <>
      {/* ---------------- left cluster — "Pointer" / Rectangle 9 ----------- */}
      <Box className="hm-pill" w={360.47} h={173.01} x={0} y={114}>
        <svg
          height="100%"
          style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
          viewBox="0 0 360.47 173.01"
          width="100%"
        >
          {/* Stroke first, fill second: the fill covers the inner half of the
              stroke AND every internal seam where the three subpaths overlap,
              so only the outer 5 of border survives — a true union outline
              without having to compute the merged boundary. */}
          <path d={CLUSTER_UNION} fill="none" stroke="#1C1C1C" strokeLinejoin="round" strokeWidth="10" />
          <path d={CLUSTER_UNION} fill="#515051" style={{ pointerEvents: 'auto' }} />
          {/* machined sheen, clipped to the merged silhouette */}
          <path d={CLUSTER_UNION} fill="url(#hm-cluster-sheen)" />
          <defs>
            <linearGradient id="hm-cluster-sheen" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="0.28" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="1" stopColor="#000000" stopOpacity="0.22" />
            </linearGradient>
          </defs>
        </svg>

        {/* Who@mi — the reference sets the @ in white against the red, and
            keeps the trailing i lowercase, so no uppercase transform here. */}
        <Box
          style={{
            ...type({ size: 30, lh: 36 }),
            color: '#FF0000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'pre',
          }}
          w={139}
          h={36.01}
          x={153.99}
          y={25}
        >
          {'WHO'}
          <span style={{ color: '#FFFFFF' }}>@</span>
          {'Mi'}
        </Box>
      </Box>

      {/* Ellipse 5 — red ring, on top of the merged silhouette */}
      <Box
        className="hm-ring"
        r="full"
        style={{ border: border(8, '#FF0000'), boxSizing: 'border-box' }}
        w={80.01}
        h={80.04}
        x={2.83}
        y={117.58}
      />

      {/* role */}
      <Box
        style={{
          ...type({ size: 16, lh: '160%' }),
          textTransform: 'uppercase',
          textAlign: 'center',
          whiteSpace: 'pre-line',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
        }}
        w={216.92}
        h={51.99}
        x={115.03}
        y={217.99}
      >
        {'Cybersecurity Engineer\nWeb Developer'}
      </Box>

      {/* Resume — Rectangle 55 + label + Arrow 1 */}
      <Box as="a" className="hm-resume" href="/resume.pdf" w={161.98} h={49.99} x={RESUME_X} y={RESUME_Y}>
        <Box
          className="hm-bezel hm-pill"
          r="full"
          style={{ border: border(5, '#1C1C1C') }}
          w={161.98}
          h={49.99}
          x={0}
          y={0}
        />
        <Box
          style={{
            ...type({ size: 20, lh: '160%' }),
            textTransform: 'uppercase',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
          }}
          w={82.96}
          h={32.01}
          x={27.04}
          y={9.01}
        >
          Resume
        </Box>
        <Box className="hm-resume-arrow" w={16} h={22} x={124.98} y={13.57}>
          <svg fill="none" height="100%" viewBox="0 0 16 22" width="100%">
            <path
              d="M8 1v19M2 14l6 6 6-6"
              stroke="#FFFFFF"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </Box>
      </Box>

      {/* ---------------- identity card, Rectangle 4 ---------------- */}
      <Box
        className="hm-bezel"
        r={18.4583}
        style={{ overflow: 'hidden' }}
        w={442.93}
        h={443.04}
        x={786.56}
        y={14.98}
      >
        {/* ONE circle, centred on the card at r = 175.38, of which only two
            opposite quadrants are drawn — that is what the export's "Subtract"
            boolean produces, and it is why the reference shows arcs rather
            than rings.

            The giveaway is in the bounding boxes: Ellipse 5908 runs
            (46.09, 46.17)->(221.47, 221.52) and Ellipse 5907 runs
            (221.47, 221.52)->(396.85, 396.87). They meet at (221.47, 221.52),
            which is the card's own centre — i.e. they are the upper-left and
            lower-right QUADRANT boxes of a single circle, not two circles.
            Ellipse 5909 then lands exactly on the lower arc's end point. */}
        <Box style={{ pointerEvents: 'none' }} w={442.93} h={443.04} x={0} y={0}>
          <svg fill="none" height="100%" viewBox="0 0 442.93 443.04" width="100%">
            {/* Ellipse 5908 — upper-left quadrant */}
            <path
              d="M221.47 46.14A175.38 175.38 0 0 0 46.09 221.52"
              stroke="#7E7E7E"
              strokeLinecap="round"
              strokeWidth="1.84583"
            />
            {/* Ellipse 5907 — lower-right quadrant */}
            <path
              d="M396.85 221.52A175.38 175.38 0 0 1 221.47 396.90"
              stroke="#FFFFFF"
              strokeLinecap="round"
              strokeWidth="1.84583"
            />
            {/* terminator beads at the open ends, as in the reference */}
            <circle cx="221.47" cy="46.14" fill="#7E7E7E" r="2.77" />
            <circle cx="396.85" cy="221.52" fill="#7E7E7E" r="2.77" />
          </svg>
        </Box>
        {/* Ellipse 5909 — bead capping the lower arc */}
        <Box r="full" style={{ background: '#515051' }} w={5.53} h={5.53} x={218.64} y={394.1} />

        {/* Rectangle 5 — diagonal capsule cut into the top-left corner. Its
            -45deg bounding box is 94.5 square, matching the size Figma gives
            the parent "Group 2" — which is how the rotation model was checked. */}
        <RBox
          deg={-45}
          r={27.6875}
          style={{
            background: '#515051',
            border: border(1.89, '#000000'),
            boxSizing: 'border-box',
            boxShadow: `inset ${u(0.95)} ${u(7.56)} ${u(3.78)} rgba(0,0,0,.25)`,
          }}
          w={41.42}
          h={92.3}
          x={0}
          y={0}
        />

        <Tick w={27.04} x={372.75} y={49.84} />
        <Tick w={26.92} x={48.91} y={378.4} />

        {/* Polygon 2 */}
        <RBox deg={15} w={18.93} h={18.89} x={373.24} y={373.3}>
          <svg fill="none" height="100%" viewBox="0 0 19 19" width="100%">
            <path
              d="M9.5 2 17 16.5H2L9.5 2Z"
              stroke="#FFFFFF"
              strokeLinejoin="round"
              strokeWidth="0.95"
            />
          </svg>
        </RBox>

        <Box
          className="hm-card-name"
          style={{
            ...type({ family: 'Azonix', weight: 400, size: 94.1375, lh: 95 }),
            color: '#FFFFFF',
            flexDirection: 'column',
          }}
          w={307.99}
          h={190.99}
          x={67.35}
          y={126.45}
        >
          {heroContent.name.replace(' ', '\n')}
        </Box>

        {SCREWS.map((s) => (
          <Screw key={`${s.x}-${s.y}`} h={s.h} star={s.star} w={s.w} x={s.x} y={s.y} />
        ))}

        {/* border painted last so the clipped children stay inside it */}
        <Box
          r={18.4583}
          style={{
            border: border(9.22917, '#2A2A2A'),
            boxSizing: 'border-box',
            pointerEvents: 'none',
          }}
          w={442.93}
          h={443.04}
          x={0}
          y={0}
        />
      </Box>
    </>
  )
}

export default AboutLayer
