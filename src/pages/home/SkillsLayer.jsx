import { Box, RBox, Stroked, type } from './canvas'
import { skillMarks } from './skillMarks'

/**
 * Skills — Figma group "skills", now 1444 x 260.
 *
 * The export froze this row as five static image slots on a 230 pitch. It
 * reads as a rack of parts, so the rack now runs as a marquee: the tiles
 * travel left continuously and the panel is the window they pass behind.
 *
 * The window is sized so SIX whole tiles are on screen at every moment of the
 * travel, which is not the same as fitting six. A window of 6 x PITCH fits six
 * only when the track happens to be at rest; a moment later one tile is
 * half-in at each end and just five are whole. Seven pitches is the first
 * width where the count never drops below six.
 *
 * Both strokes are OUTSIDE (no box-sizing in the export), so RACK and PANEL
 * are the fills. That puts the panel's stroke 7 inside the rack's fill edge
 * (the export's 6.95) and the conduit stubs flush against the rack's stroke,
 * as they are in the export — and the marquee window is the panel's full
 * 1190, exactly seven pitches, rather than 1186 after an inside border.
 */
const RACK = { x: 118, y: 59, w: 1208, h: 200 }
const PANEL = { x: 127, y: 69, w: 1190, h: 180 }

const TILE = 132
const GAP = 38
const PITCH = TILE + GAP /* 170 — seven of these is exactly PANEL.w */
const SPEED = 46 /* design px per second; slow enough to read each mark */

/**
 * A marquee needs its repeating run to be at least as wide as the window,
 * or a gap opens at the wrap; the run repeats the list only as often as that
 * takes (20 marks x 170 = 3400 against a 1190 window: once). Two runs then
 * sit side by side and the track slides exactly one run per cycle, which is
 * what makes the loop seamless rather than snapping back.
 */
const REPEAT = Math.max(1, Math.ceil(PANEL.w / (skillMarks.length * PITCH)))
const RUN = Array.from({ length: REPEAT }, () => skillMarks).flat()
const DURATION = (RUN.length * PITCH) / SPEED

/* conduits are centred 8 below the rack's own centre, as in the export */
const LINE_Y = RACK.y + RACK.h / 2 + 8

function SkillsLayer() {
  return (
    <>
      <Box
        style={{
          ...type({ family: 'Azonix', weight: 400, size: 40, lh: 40 }),
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        w={156.96}
        h={39.98}
        x={644.02}
        y={0}
      >
        Skills
      </Box>

      {/* Line 34 / 32 / 33 + Rectangle 39412 / 39413 — conduits into the rack.
          The lines are 0-height in the export with a 5px border, so the stroke
          straddles the stated top by 2.5 either side. They re-span the wider
          gutters the smaller rack leaves, and re-centre on its new midline. */}
      <Box style={{ background: '#2A2A2A' }} w={107} h={5} x={0} y={LINE_Y - 2.5} />
      <Box style={{ background: '#2A2A2A' }} w={9.96} h={30} x={103} y={LINE_Y - 15} />
      <Box style={{ background: '#2A2A2A' }} w={10.11} h={50} x={1331} y={LINE_Y - 25} />
      <RBox deg={0.5} style={{ background: '#2A2A2A' }} w={102.89} h={5} x={1341.11} y={LINE_Y - 10.5} />
      <RBox deg={0.5} style={{ background: '#2A2A2A' }} w={102.89} h={5} x={1341.11} y={LINE_Y + 5.5} />

      {/* Rectangle 39351 / 39352 — the rack */}
      <Stroked className="hm-bezel" r={40} stroke={[5, '#2A2A2A']} w={RACK.w} h={RACK.h} x={RACK.x} y={RACK.y} />
      <Stroked
        className="hm-inset-panel"
        r={31}
        stroke={[2, '#000000']}
        w={PANEL.w}
        h={PANEL.h}
        x={PANEL.x}
        y={PANEL.y}
      >
        <div className="hm-marquee hm-hit">
          <div className="hm-marquee-track" style={{ '--hm-marquee-dur': `${DURATION.toFixed(2)}s` }}>
            {[0, 1].map((copy) => (
              <div aria-hidden={copy === 1 || undefined} className="hm-marquee-run" key={copy}>
                {RUN.map((skill, i) => (
                  <div className="hm-skill" key={`${copy}-${i}-${skill.key}`}>
                    {skill.mark}
                    <span className="hm-skill-label">{skill.label}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Stroked>
    </>
  )
}

export default SkillsLayer
