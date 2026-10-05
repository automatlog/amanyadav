import { useEffect, useRef, useState } from 'react'

/**
 * Drives a boot-style progress value.
 *
 * The bar climbs on its own toward a ceiling while the document is still
 * loading, hesitates at two points so it reads as machinery rather than a
 * linear tween, then snaps to 100 once the page has actually loaded AND the
 * minimum on-screen duration has elapsed.
 */
const CEILING_WHILE_LOADING = 92
const HOLD_AT_FULL_MS = 420

/** Slows the climb through two "working on it" bands. */
function friction(value) {
  if (value > 37 && value < 46) return 0.32
  if (value > 73 && value < 80) return 0.28
  return 1
}

export function usePreloadProgress({ minDuration = 2200, onFinish } = {}) {
  const [progress, setProgress] = useState(0)
  const onFinishRef = useRef(onFinish)
  onFinishRef.current = onFinish

  useEffect(() => {
    let frameId = null
    let holdId = null
    let cancelled = false
    let loaded = document.readyState === 'complete'
    let value = 0

    const start = performance.now()
    let last = start

    const handleLoad = () => {
      loaded = true
    }

    if (!loaded) {
      window.addEventListener('load', handleLoad, { once: true })
    }

    const tick = (now) => {
      if (cancelled) return

      const dt = Math.min(now - last, 64) / 1000
      last = now

      const ready = loaded && now - start >= minDuration
      const target = ready ? 100 : CEILING_WHILE_LOADING
      const speed = (ready ? 5.4 : 1.45) * friction(value)

      value += (target - value) * (1 - Math.exp(-speed * dt))

      if (ready && value > 99.4) {
        value = 100
      }

      setProgress(value)

      if (value >= 100) {
        holdId = setTimeout(() => {
          if (!cancelled) onFinishRef.current?.()
        }, HOLD_AT_FULL_MS)
        return
      }

      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)

    return () => {
      cancelled = true
      if (frameId) cancelAnimationFrame(frameId)
      if (holdId) clearTimeout(holdId)
      window.removeEventListener('load', handleLoad)
    }
  }, [minDuration])

  return progress
}
