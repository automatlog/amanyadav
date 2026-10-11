/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react'

/**
 * The skull's head as a living particle field — the "thinking" while the site
 * loads. Particles are scattered over the logo's own silhouette (sampled from
 * its alpha), so the cloud IS the head rather than an orb set into it. Each
 * one jiggles around its home spot, and soft pulses ripple outward from the
 * forehead every couple of seconds, brightening the particles they pass —
 * thoughts firing across the head.
 *
 * It runs on its own animation frame loop (the motion does not depend on load
 * progress), pauses when the tab is hidden, and is not drawn at all under
 * reduced motion.
 */
const COUNT = 1500
const FOREHEAD = { x: 303 / 607, y: 250 / 606 } // where the pulses start
const PULSE_EVERY_S = 2.2
const PULSE_SPEED = 0.42 // of the mark's width per second
const PULSE_WIDTH = 0.07

function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Home spots inside the silhouette, in 0..1 image space. */
function sample(img) {
  const W = img.naturalWidth
  const H = img.naturalHeight
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0)
  const a = ctx.getImageData(0, 0, W, H).data
  const rand = rng(0x4ead)
  const pts = []
  for (let tries = 0; pts.length < COUNT && tries < COUNT * 60; tries += 1) {
    const x = Math.floor(rand() * W)
    const y = Math.floor(rand() * H)
    if (a[(y * W + x) * 4 + 3] > 140) {
      pts.push({
        x: x / W,
        y: y / H,
        amp: 0.6 + rand() * 1.4, // jiggle radius, in design px
        f1: 1.2 + rand() * 2.2,
        f2: 2.5 + rand() * 3.5,
        p1: rand() * Math.PI * 2,
        p2: rand() * Math.PI * 2,
        size: 1.1 + rand() * 1.3,
        base: 0.3 + rand() * 0.4,
      })
    }
  }
  return pts
}

function HeadParticles({ src, opacity = 1, reduce }) {
  const ref = useRef(null)

  useEffect(() => {
    if (reduce) return undefined
    const canvas = ref.current
    if (!canvas) return undefined
    let pts = null
    let frame = 0
    let alive = true
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => {
      if (!alive) return
      pts = sample(img)
      frame = requestAnimationFrame(draw)
    }
    img.src = src

    const t0 = performance.now()
    function draw(now) {
      if (!alive) return
      const box = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = Math.round(box.width * dpr)
      const h = Math.round(box.height * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
      const ctx = canvas.getContext('2d')
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, box.width, box.height)

      // the image's contain-rect inside the box (the mark is ~square)
      const s = Math.min(box.width / img.naturalWidth, box.height / img.naturalHeight)
      const dw = img.naturalWidth * s
      const dh = img.naturalHeight * s
      const ox = (box.width - dw) / 2
      const oy = (box.height - dh) / 2
      const unit = dw / 607 // one design px of the mark
      const t = (now - t0) / 1000
      const pulseAge = t % PULSE_EVERY_S
      const pulseR = pulseAge * PULSE_SPEED

      for (let i = 0; i < pts.length; i += 1) {
        const p = pts[i]
        const jx = (Math.sin(t * p.f1 + p.p1) + 0.5 * Math.sin(t * p.f2 + p.p2)) * p.amp * unit
        const jy = (Math.cos(t * p.f1 * 0.9 + p.p2) + 0.5 * Math.cos(t * p.f2 * 1.1 + p.p1)) * p.amp * unit
        const dx = p.x - FOREHEAD.x
        const dy = p.y - FOREHEAD.y
        const d = Math.sqrt(dx * dx + dy * dy)
        const wave = Math.max(0, 1 - Math.abs(d - pulseR) / PULSE_WIDTH) * (1 - pulseAge / PULSE_EVERY_S)
        const alpha = Math.min(1, p.base + wave * 0.75)
        const r = (p.size + wave * 0.8) * unit
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`
        ctx.fillRect(ox + p.x * dw + jx - r / 2, oy + p.y * dh + jy - r / 2, r, r)
      }
      frame = requestAnimationFrame(draw)
    }

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(frame)
      else if (pts) frame = requestAnimationFrame(draw)
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      alive = false
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [src, reduce])

  if (reduce) return null
  return <canvas aria-hidden className="pl-particles" ref={ref} style={{ opacity }} />
}

export default HeadParticles
