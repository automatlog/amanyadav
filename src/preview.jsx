/* eslint-disable react/prop-types */
/**
 * Isolated design harness. Renders a single section on a loop so we can
 * iterate on it without booting the whole app.
 *   npm run dev  ->  http://localhost:5173/preview.html
 */
import { AnimatePresence } from 'framer-motion'
import { StrictMode, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import AsciiMark from './components/preloader/AsciiMark'
import Preloader from './components/preloader/Preloader'
import skullMark from './assets/obsidian_skull.png'
import './components/preloader/preloader.css'
import './index.css'

// eslint-disable-next-line react-refresh/only-export-components
function Loop() {
  const [run, setRun] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (visible) return undefined
    const id = setTimeout(() => {
      setRun((n) => n + 1)
      setVisible(true)
    }, 900)
    return () => clearTimeout(id)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && <Preloader key={run} minDuration={3000} onFinish={() => setVisible(false)} />}
    </AnimatePresence>
  )
}

/* preview.html?stages — the logo frozen at chosen progress values, side by
   side, so every stage of the ASCII build can be inspected at once. */
// eslint-disable-next-line react-refresh/only-export-components
function Stages() {
  const values = [8, 22, 40, 50, 64, 78, 92, 96, 100]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 300px)', gap: 16, padding: 16 }}>
      {values.map((v) => (
        <figure key={v} style={{ margin: 0, color: '#8a8a8a', font: '12px monospace' }}>
          <div style={{ position: 'relative', width: 300, height: 300, background: '#000' }}>
            <AsciiMark progress={v} src={skullMark} />
          </div>
          <figcaption>progress {v}</figcaption>
        </figure>
      ))}
    </div>
  )
}

/* preview.html?slow=150 — the whole preloader played over that many seconds,
   so each stage can be watched; holds the clean logo 4s, exits, repeats. */
// eslint-disable-next-line react-refresh/only-export-components
function SlowLoop({ seconds }) {
  const [run, setRun] = useState(0)
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!visible) {
      const id = setTimeout(() => {
        setProgress(0)
        setRun((n) => n + 1)
        setVisible(true)
      }, 1200)
      return () => clearTimeout(id)
    }
    const start = performance.now()
    let frame
    let hold
    const tick = (now) => {
      const p = Math.min(100, ((now - start) / (seconds * 1000)) * 100)
      setProgress(p)
      if (p < 100) frame = requestAnimationFrame(tick)
      else hold = setTimeout(() => setVisible(false), 4000)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(hold)
    }
  }, [visible, run, seconds])

  return <AnimatePresence>{visible && <Preloader key={run} progressOverride={progress} />}</AnimatePresence>
}

const params = new URLSearchParams(location.search)
const slow = Number(params.get('slow'))

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>{params.has('stages') ? <Stages /> : slow > 0 ? <SlowLoop seconds={slow} /> : <Loop />}</StrictMode>,
)
