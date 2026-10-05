/**
 * Isolated design harness. Renders a single section on a loop so we can
 * iterate on it without booting the whole app.
 *   npm run dev  ->  http://localhost:5173/preview.html
 */
import { AnimatePresence } from 'framer-motion'
import { StrictMode, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import Preloader from './components/preloader/Preloader'
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Loop />
  </StrictMode>,
)
