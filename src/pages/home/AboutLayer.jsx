/* eslint-disable react/prop-types */
import { Box, RBox, Stage, Stroked, Torx, border, roundedPath, type, u } from './canvas'
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
const RESUME_FILE = 'Aman Yadav — Resume.pdf'
const RESUME_X = 2.83
const RESUME_Y = 413.99

/* Corner screws. The export calls the recess "Star 1"/"Star 2" and the
   reference render shows exactly that — a six-point Torx head. Each screw
   keeps its own recess size and offset from the export; the top-right one is
   deliberately smaller than the other three.

   The Card group is rotated 90deg, and the three CORNER stars carry that
   rotation (`rotate(90deg)` in the export), so their lobes point left and
   right — the reference measures every one of them wider than tall (BL
   17.45 x 16.62). The capsule's star sits in "Group 2", which the export
   gives no rotation, so it stays point-up. */
const SCREWS = [
  { x: 13.76, y: 13.88, star: { w: 28.27, h: 28.33, dx: 2.83, dy: 1.48, deg: 0 }, w: 32.32, h: 32.29 },
  { x: 404.22, y: 7.39, star: { w: 21.02, h: 24.23, dx: 4.55, dy: 5.53, deg: 90 }, w: 32.32, h: 32.29 },
  { x: 7.37, y: 404.26, star: { w: 28.39, h: 28.33, dx: 2.71, dy: 1.86, deg: 90 }, w: 32.2, h: 32.29 },
  { x: 404.22, y: 404.26, star: { w: 28.39, h: 28.33, dx: 2.7, dy: 1.86, deg: 90 }, w: 32.32, h: 32.29 },
]

function Screw({ x, y, star, w, h }) {
  return (
    <Box r="full" style={{ background: '#1F1F1F' }} w={w} h={h} x={x} y={y}>
      <Torx deg={star.deg} h={star.h} w={star.w} x={star.dx} y={star.dy} />
    </Box>
  )
}

/**
 * The identity cluster — "Pointer". Three separate shapes and a bridge, not
 * one merged outline: the reference shows the pill and the disc each with
 * its own unbroken edge, and the bridge passing UNDER both.
 *
 * The bridge is the export's "Subtract", a Figma boolean whose operands the
 * export also lists, so it is reproduced exactly rather than approximated:
 *
 *   Rectangle 52  base: an 85.8 square at r49 — clamped, that is a circle
 *                 (r42.89), rotated 2deg. Placed by the rotated-origin rule,
 *                 its right and top edges land on the Subtract's own box
 *                 (131.13, 154.36) to within 0.01.
 *   Rectangle 53  minus a circle at the upper left, around the red ring
 *   Rectangle 51  minus a 304 x 79.5 stadium at the lower right
 *
 * What survives is the diagonal band between the two cut-outs; its concave
 * flanks are arcs of those two shapes. Drawn as the base circle with the
 * cut-outs masked away. Against the reference at its own scale this model
 * disagrees on 0.69% of pixels beyond a 1px anti-aliased edge.
 *
 * Paint order is the export's: ring, bridge, pill, disc. Faces are flat
 * #515051 and both 5 edges sit OUTSIDE the fills (no box-sizing in the
 * export); all coordinates are the about group's.
 */
const BRIDGE = {
  base: { cx: 88.24, cy: 197.25, r: 42.89 },
  cutCircle: { cx: 46.09, cy: 162.61, r: 42.89 },
  cutStadium: { x: 82.22, y: 196.91, w: 304.05, h: 79.51 },
  box: { x: 46.09, y: 154.36, w: 85.04, h: 85.38 },
}

/** "Subtract" — the bridge between the disc and the pill. */
function Bridge() {
  const { base, cutCircle: c, cutStadium: st, box } = BRIDGE
  return (
    <Box w={box.w} h={box.h} x={box.x} y={box.y}>
      <svg height="100%" viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`} width="100%">
        <defs>
          <mask height={box.h} id="hm-bridge-cut" maskUnits="userSpaceOnUse" width={box.w} x={box.x} y={box.y}>
            <rect fill="#FFFFFF" height={box.h} width={box.w} x={box.x} y={box.y} />
            <circle cx={c.cx} cy={c.cy} fill="#000000" r={c.r} />
            <rect fill="#000000" height={st.h} rx={st.h / 2} width={st.w} x={st.x} y={st.y} />
          </mask>
        </defs>
        <circle cx={base.cx} cy={base.cy} fill="#515051" mask="url(#hm-bridge-cut)" r={base.r} />
      </svg>
    </Box>
  )
}

/* Polygon 2's stroke centre line: see where it is drawn. */
const TRIANGLE = roundedPath(
  [-90, 30, 150].map((deg) => {
    const a = (deg * Math.PI) / 180
    const r = 18.89 / 2 - 0.945
    return [18.93 / 2 + r * Math.cos(a), 18.89 / 2 + r * Math.sin(a), 1.42]
  }),
)

/** Line 28 / Line 29 — hairlines at -45deg. */
function Tick({ x, y, w }) {
  return <RBox deg={-45} style={{ borderTop: border(1.85, '#FFFFFF') }} w={w} h={0} x={x} y={y} />
}

function AboutLayer() {
  return (
    <>
      {/* entrance step 3: status — the cluster, the roles, Resume */}
      <Stage step={2}>
        {/* ---------------- left cluster — "Pointer" ---------------- */}
        {/* Ellipse 5 — red ring (its 8 stroke is INSIDE: box-sizing in the export) */}
        <Box
          className="hm-ring"
          r="full"
          style={{ border: border(8, '#FF0000'), boxSizing: 'border-box' }}
          w={80.01}
          h={80.04}
          x={2.83}
          y={117.58}
        />

        <Bridge />

        {/* Rectangle 50 — the WHO@Mi pill */}
        <Stroked r={50} stroke={[5, '#1C1C1C']} style={{ background: '#515051' }} w={268.91} h={80.04} x={88.98} y={117.58}>
          {/* Who@mi at (153.99, 139) in the group — the reference sets the @
              in white against the red, and keeps the trailing i lowercase. */}
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
            x={153.99 - 88.98}
            y={139 - 117.58}
          >
            {'WHO'}
            <span style={{ color: '#FFFFFF' }}>@</span>
            {'Mi'}
          </Box>
        </Stroked>

        {/* Rectangle 54 — the avatar disc */}
        <Stroked r={40} stroke={[5, '#1C1C1C']} style={{ background: '#515051' }} w={80} h={79.99} x={2.83} y={204.11} />

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
        {/* Starts with the verb and keeps the visible word, so speech users can
            still say "click Resume". The arrow points down: this downloads.

            Rectangle 55's 5 stroke is OUTSIDE, so the link is the pill's full
            visual size — fill plus 5 all round — and everything inside it is
            offset by that 5. The click target and focus ring then match what
            is drawn, and the pill's outer edge shares the disc's rail. */}
        <Box
          aria-label="Download resume (PDF)"
          as="a"
          className="hm-resume hm-press"
          download={RESUME_FILE}
          href={encodeURI(`/${RESUME_FILE}`)}
          type="application/pdf"
          w={161.98 + 10}
          h={49.99 + 10}
          x={RESUME_X - 5}
          y={RESUME_Y - 5}
        >
          <Stroked className="hm-bezel hm-pill" r="full" stroke={[5, '#1C1C1C']} w={161.98} h={49.99} x={5} y={5} />
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
            x={27.04 + 5}
            y={9.01 + 5}
          >
            Resume
          </Box>
          <Box className="hm-resume-arrow" w={16} h={22} x={124.98 + 5} y={13.57 + 5}>
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

      </Stage>
      {/* entrance step 4: the hero card */}
      <Stage step={3}>
        {/* ---------------- identity card, Rectangle 4 ----------------
            The 9.23 border sits OUTSIDE the 442.93 fill: in the reference the
            dark rim lies beyond Figma's selection box on all four sides, and
            the card's outer width measures 461.0 in Home.png (fill + 2 x 9.23
            = 461.39). Drawn inside, it was eating 9.23 off every edge of the
            face — which is why the capsule used to run under the border at the
            top-left corner instead of sitting clear of it. */}
        <Stroked
          className="hm-bezel"
          r={18.4583}
          stroke={[9.22917, '#2A2A2A']}
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
              Ellipse 5909 then lands exactly on the lower arc's end point.

              Both arcs read #7E7E7E in the reference, the lower one included.
              Ellipse 5907 is white, but the grey "Subtract" sits on top of it
              and covers it — the Subtract's box overhangs 5907 by 4.92 on every
              side, which is exactly an r4.92 dot centred on each arc end. So:
              a filled dot where each arc starts, and at the lower arc's end the
              same dot with Ellipse 5909 (r2.77, card colour) punched into it —
              the hollow ring the reference shows. Measured dot diameter: 9.1-10. */}
          <Box style={{ pointerEvents: 'none' }} w={442.93} h={443.04} x={0} y={0}>
            <svg fill="none" height="100%" viewBox="0 0 442.93 443.04" width="100%">
              {/* Ellipse 5908 — upper-left quadrant */}
              <path
                d="M221.47 46.14A175.38 175.38 0 0 0 46.09 221.52"
                stroke="#7E7E7E"
                strokeLinecap="round"
                strokeWidth="1.84583"
              />
              {/* Subtract over Ellipse 5907 — lower-right quadrant, with the
                  white arc's 3.69 drop shadow still showing beneath it */}
              <g style={{ filter: 'drop-shadow(0 3.69px 3.69px rgba(0,0,0,.25))' }}>
                <path
                  d="M396.85 221.52A175.38 175.38 0 0 1 221.47 396.90"
                  stroke="#7E7E7E"
                  strokeLinecap="round"
                  strokeWidth="1.84583"
                />
                <circle cx="396.85" cy="221.52" fill="#7E7E7E" r="4.92" />
                <circle cx="221.47" cy="396.90" fill="#7E7E7E" r="4.92" />
              </g>
              <circle cx="221.47" cy="46.14" fill="#7E7E7E" r="4.92" />
            </svg>
          </Box>
          {/* Ellipse 5909 — the hole in the lower arc's end ring */}
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

          {/* Polygon 2 — Figma inscribes a polygon's points in its node's
              ellipse, so this is a regular triangle of circumradius 9.445, not
              one stretched to the 18.93 box. Its 0.945 stroke is INSIDE (the
              export says box-sizing: border-box), so the stroke's centre line
              is the triangle inset by half of it — circumradius 9.445 - 0.945 —
              and the 1.89 corner radius becomes 1.42 on that line. */}
          <RBox deg={15} w={18.93} h={18.89} x={373.24} y={373.3}>
            <svg fill="none" height="100%" viewBox="0 0 18.93 18.89" width="100%">
              <path d={TRIANGLE} stroke="#FFFFFF" strokeWidth="0.945" />
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
        </Stroked>
      </Stage>
    </>
  )
}

export default AboutLayer
