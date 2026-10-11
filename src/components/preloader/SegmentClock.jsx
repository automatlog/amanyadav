/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'

/**
 * The preloader's digital clock, as a real seven-segment display: HH:MM in
 * large slanted digits, seconds in small ones, and an AM/PM pair with the
 * current one lit. Unlit segments stay faintly visible — the "ghost 8s" of
 * an LED panel — and the colon ticks with the actual seconds.
 *
 * Drawn in SVG in the display's own units (145 x 30), so the segments stay
 * crisp at every size the frame scales to.
 */

/* which segments (a..g) light for each digit */
const DIGITS = {
  0: 'abcdef',
  1: 'bc',
  2: 'abdeg',
  3: 'abcdg',
  4: 'bcfg',
  5: 'acdfg',
  6: 'acdefg',
  7: 'abc',
  8: 'abcdefg',
  9: 'abcdfg',
}

/** Hexagonal segment polygons for a cell w x h at stroke t. */
function segments(w, h, t) {
  const g = t * 0.28 // the hairline gap between neighbouring segments
  const L = t / 2
  const R = w - t / 2
  const T = t / 2
  const M = h / 2
  const B = h - t / 2
  const hz = (x0, x1, y) =>
    `${x0},${y} ${x0 + t / 2},${y - t / 2} ${x1 - t / 2},${y - t / 2} ${x1},${y} ${x1 - t / 2},${y + t / 2} ${x0 + t / 2},${y + t / 2}`
  const vt = (x, y0, y1) =>
    `${x},${y0} ${x + t / 2},${y0 + t / 2} ${x + t / 2},${y1 - t / 2} ${x},${y1} ${x - t / 2},${y1 - t / 2} ${x - t / 2},${y0 + t / 2}`
  return {
    a: hz(L + g, R - g, T),
    b: vt(R, T + g, M - g),
    c: vt(R, M + g, B - g),
    d: hz(L + g, R - g, B),
    e: vt(L, M + g, B - g),
    f: vt(L, T + g, M - g),
    g: hz(L + g, R - g, M),
  }
}

const BIG = segments(13, 22, 2.8)
const SMALL = segments(7, 12, 1.8)

/** One digit; `null` shows only the ghost segments (a blanked leading zero). */
function Digit({ value, x, y, set }) {
  const lit = value === null ? '' : DIGITS[value]
  return (
    <g transform={`translate(${x} ${y})`}>
      {Object.entries(set).map(([name, points]) => (
        <polygon className={lit.includes(name) ? 'pl-seg pl-seg--on' : 'pl-seg'} key={name} points={points} />
      ))}
    </g>
  )
}

/** The current time, updated on each second boundary. */
function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    let id
    const tick = () => {
      setNow(new Date())
      id = setTimeout(tick, 1000 - (Date.now() % 1000))
    }
    id = setTimeout(tick, 1000 - (Date.now() % 1000))
    return () => clearTimeout(id)
  }, [])
  return now
}

function SegmentClock({ reduce }) {
  const now = useNow()
  const h24 = now.getHours()
  const h = h24 % 12 || 12
  const m = now.getMinutes()
  const s = now.getSeconds()
  const pm = h24 >= 12
  // the colon ticks once a second; held steady under reduced motion
  const colonOn = reduce || s % 2 === 0

  return (
    <svg aria-hidden="true" className="pl-seg-clock" viewBox="0 0 145 30">
      {/* a slight forward slant, as LED clock faces have */}
      <g transform="translate(19 0) skewX(-7)">
        <Digit set={BIG} value={h >= 10 ? 1 : null} x={0} y={4} />
        <Digit set={BIG} value={h % 10} x={16.5} y={4} />
        <g className={colonOn ? 'pl-seg pl-seg--on' : 'pl-seg'}>
          <rect height="2.8" width="2.8" x="34.2" y="10" />
          <rect height="2.8" width="2.8" x="34.2" y="18.2" />
        </g>
        <Digit set={BIG} value={Math.floor(m / 10)} x={41} y={4} />
        <Digit set={BIG} value={m % 10} x={57.5} y={4} />
        <Digit set={SMALL} value={Math.floor(s / 10)} x={76} y={14} />
        <Digit set={SMALL} value={s % 10} x={85.5} y={14} />
      </g>
      <text className={pm ? 'pl-seg-ampm' : 'pl-seg-ampm pl-seg-ampm--on'} x="117" y="12.4">
        AM
      </text>
      <text className={pm ? 'pl-seg-ampm pl-seg-ampm--on' : 'pl-seg-ampm'} x="117" y="23.6">
        PM
      </text>
    </svg>
  )
}

export default SegmentClock
