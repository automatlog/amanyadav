/* eslint-disable react/prop-types */
import { motion, useReducedMotion } from 'framer-motion'
import skullMark from '../../assets/obsidian_skull.png'
import AsciiMark from './AsciiMark'
import SegmentClock from './SegmentClock'
import HeadParticles from './HeadParticles'
import { usePreloadProgress } from './usePreloadProgress'
import './preloader.css'

/** Boot log — the label swaps as the bar crosses each threshold. */
const PHASES = [
  { at: 0, label: 'Initializing' },
  { at: 16, label: 'Mounting modules' },
  { at: 34, label: 'Decrypting assets' },
  { at: 56, label: 'Calibrating grid' },
  { at: 78, label: 'Linking interface' },
  { at: 94, label: 'Finalizing' },
  { at: 100, label: 'System ready' },
]

function phaseFor(progress) {
  let current = PHASES[0].label
  for (const phase of PHASES) {
    if (progress >= phase.at) current = phase.label
  }
  return current
}

/* `progressOverride` lets the preview harness drive the screen at its own
   pace; the real app never passes it, and while it is set the real loader
   cannot finish. */
function Preloader({ onFinish, minDuration = 2200, progressOverride }) {
  const auto = usePreloadProgress({ minDuration, onFinish: progressOverride === undefined ? onFinish : undefined })
  const progress = progressOverride ?? auto
  const reduceMotion = useReducedMotion()

  const rounded = Math.round(progress)
  const label = phaseFor(rounded)

  /* CRT power-off: flash the tube, then collapse it to a line. */
  const exit = reduceMotion
    ? { opacity: 0, transition: { duration: 0.3 } }
    : {
        opacity: [1, 1, 0],
        scaleY: [1, 1, 0.004],
        scaleX: [1, 1, 1.35],
        filter: ['brightness(1)', 'brightness(2.6)', 'brightness(1)'],
        transition: { duration: 0.62, times: [0, 0.3, 1], ease: [0.7, 0, 0.3, 1] },
      }

  return (
    <motion.div
      aria-busy="true"
      aria-label="Loading"
      className="pl-root"
      exit={exit}
      initial={false}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={rounded}
      style={{ '--p': progress / 100 }}
    >
      <div aria-hidden className="pl-atmos">
        <div className="pl-grid" />
        <div className="pl-scanlines" />
        <div className="pl-grain" />
        <div className="pl-vignette" />
        <span className="pl-tick pl-tick--tl" />
        <span className="pl-tick pl-tick--tr" />
        <span className="pl-tick pl-tick--bl" />
        <span className="pl-tick pl-tick--br" />
      </div>

      {/* --- the mark: kept minimal. No sweep, no flicker, no float — it
          assembles from ASCII as the site loads and resolves into the clean
          logo (see AsciiMark), over a particle field shaped like the whole
          head that jiggles and pulses while it thinks (see HeadParticles).
          The particles leave with the ASCII as the clean logo arrives. --- */}
      <div className="pl-mark">
        <HeadParticles opacity={1 - Math.min(1, Math.max(0, (progress - 93) / 7))} reduce={reduceMotion} src={skullMark} />
        <AsciiMark progress={progress} reduce={reduceMotion} src={skullMark} />
      </div>

      {/* --- clock module --- */}
      <div className="pl-clock pl-bezel">
        <div className="pl-display pl-inset">
          <SegmentClock reduce={reduceMotion} />
        </div>
        <div className="pl-knob pl-inset" />
      </div>

      {/* --- console --- */}
      <div className="pl-console">
        <div className="pl-status">
          <span aria-live="polite" className="pl-status-label">
            {label}
            <span className="pl-caret">_</span>
          </span>
          <span className="pl-pct">{String(rounded).padStart(3, '0')}%</span>
        </div>

        <div className="pl-rail pl-bezel">
          <div className="pl-track pl-inset">
            <div className="pl-dashes">
              <span className="pl-dash-layer pl-dash-layer--dim" />
              <span className="pl-dash-layer pl-dash-layer--lit" />
              {progress > 1 && progress < 99.9 && <span className="pl-head" />}
            </div>
          </div>
        </div>
      </div>

      {/* --- footer plate --- */}
      <div className="pl-footer pl-bezel">
        <div className="pl-plate pl-inset">
          <div className="pl-plate-row">
            <a className="pl-link" href="/privacy">
              Privacy Policy
            </a>
            <a className="pl-link" href="/cookies">
              Cookies Settings
            </a>
          </div>
          <div className="pl-plate-row">
            <span>Copyright 2024 @automatlog</span>
            <svg className="pl-tri" viewBox="0 0 10 10">
              <path d="M5 1 L9 8.5 L1 8.5 Z" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Preloader
