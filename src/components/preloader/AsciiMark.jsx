/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * The logo, assembled from ASCII as the site loads, then resolved into the
 * clean mark. Driven entirely by `progress` (0..100), so it finishes when
 * loading does:
 *
 *   0 - 45    coarse ASCII skull fills in cell by cell, each cell scrambling
 *             through a few glyphs before it settles
 *   45 - 92   the grid sharpens in four steps (80 -> 180 columns)
 *   92        holds at the finest ASCII while the page finishes loading
 *   93 - 100  crossfades into the real image, which is what sits through the
 *             final hold before the preloader exits
 *
 * Each cell's glyph is picked by how much of the logo covers it (alpha x
 * luminance), denser glyphs for fuller cells.
 */
const RAMP = ' .:-=+*#%@'
const SCRAMBLE = '01<>/\\|[]{}#%&$@?!'
/* starts at 80 columns so even the first glyphs are small (~11px on the
   607 mark), and sharpens to 180 */
const LEVELS = [80, 100, 124, 150, 180]
const CHAR_ASPECT = 0.6 // a monospace cell is ~0.6 as wide as it is tall
const REVEAL_END = 0.45
const SHARPEN_END = 0.92
const FADE_START = 0.93

/* small seeded PRNG, so the reveal order is the same on every load */
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

/** Area-average the logo into a cols x rows grid of coverage, per level. */
function buildGrids(img) {
  const W = img.naturalWidth
  const H = img.naturalHeight
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0)
  const data = ctx.getImageData(0, 0, W, H).data

  return LEVELS.map((cols, li) => {
    const cellW = W / cols
    const cellH = cellW / CHAR_ASPECT
    const rows = Math.max(1, Math.round(H / cellH))
    const cover = new Float32Array(cols * rows)
    for (let r = 0; r < rows; r += 1) {
      const y0 = Math.floor((r * H) / rows)
      const y1 = Math.floor(((r + 1) * H) / rows)
      for (let q = 0; q < cols; q += 1) {
        const x0 = Math.floor(q * cellW)
        const x1 = Math.floor((q + 1) * cellW)
        let sum = 0
        let n = 0
        for (let y = y0; y < y1; y += 2) {
          for (let x = x0; x < x1; x += 2) {
            const i = (y * W + x) * 4
            const lum = (data[i] + data[i + 1] + data[i + 2]) / 765
            sum += (data[i + 3] / 255) * lum
            n += 1
          }
        }
        cover[r * cols + q] = n ? sum / n : 0
      }
    }
    const filled = []
    for (let i = 0; i < cover.length; i += 1) if (cover[i] > 0.035) filled.push(i)
    const rand = rng(0x5eed + li)
    for (let i = filled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rand() * (i + 1))
      ;[filled[i], filled[j]] = [filled[j], filled[i]]
    }
    return { cols, rows, cover, order: filled }
  })
}

const glyph = (c) => RAMP[Math.min(RAMP.length - 1, Math.max(1, Math.round(c * (RAMP.length - 1) * 1.15)))]

function AsciiMark({ src, progress, reduce }) {
  const canvasRef = useRef(null)
  const drawnRef = useRef('')
  const [img, setImg] = useState(null)
  const [box, setBox] = useState({ w: 0, h: 0 })
  const t = progress / 100

  useEffect(() => {
    if (reduce) return undefined
    const el = new Image()
    el.decoding = 'async'
    el.onload = () => setImg(el)
    el.src = src
    return () => {
      el.onload = null
    }
  }, [src, reduce])

  const grids = useMemo(() => (img ? buildGrids(img) : null), [img])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setBox({ w: width, h: height })
    })
    ro.observe(canvas)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !grids || !box.w || !img) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    // what this frame would draw; skip it if nothing changed. Only the coarse
    // reveal animates between steps (its scramble), so it always redraws.
    const lvl = t < REVEAL_END ? 0 : -1
    const key = `${box.w}x${box.h}:${lvl === 0 ? Math.random() : Math.min(LEVELS.length - 2, Math.floor(((t - REVEAL_END) / (SHARPEN_END - REVEAL_END)) * (LEVELS.length - 1)))}`
    if (key === drawnRef.current) return
    drawnRef.current = key
    if (canvas.width !== Math.round(box.w * dpr) || canvas.height !== Math.round(box.h * dpr)) {
      canvas.width = Math.round(box.w * dpr)
      canvas.height = Math.round(box.h * dpr)
    }
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, box.w, box.h)

    // the image's object-fit: contain rectangle inside the box
    const s = Math.min(box.w / img.naturalWidth, box.h / img.naturalHeight)
    const dw = img.naturalWidth * s
    const dh = img.naturalHeight * s
    const ox = (box.w - dw) / 2
    const oy = (box.h - dh) / 2

    let level
    let count
    if (t < REVEAL_END) {
      level = 0
      count = Math.round((t / REVEAL_END) * grids[0].order.length)
    } else {
      const step = Math.min(LEVELS.length - 2, Math.floor(((t - REVEAL_END) / (SHARPEN_END - REVEAL_END)) * (LEVELS.length - 1)))
      level = Math.min(LEVELS.length - 1, 1 + Math.max(0, step))
      count = grids[level].order.length
    }

    const g = grids[level]
    const cw = dw / g.cols
    const ch = dh / g.rows
    ctx.font = `700 ${(ch * 0.9).toFixed(2)}px MartianMono, ui-monospace, monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const scrambleFrom = level === 0 ? Math.max(0, count - Math.ceil(g.order.length * 0.06)) : count

    for (let k = 0; k < count; k += 1) {
      const idx = g.order[k]
      const c = g.cover[idx]
      const ch0 = k >= scrambleFrom ? SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0] : glyph(c)
      ctx.fillStyle = k >= scrambleFrom ? 'rgba(255,255,255,0.55)' : `rgba(255,255,255,${(0.4 + 0.6 * c).toFixed(3)})`
      ctx.fillText(ch0, ox + ((idx % g.cols) + 0.5) * cw, oy + (Math.floor(idx / g.cols) + 0.5) * ch)
    }
  }, [t, grids, box, img])

  const fade = Math.min(1, Math.max(0, (t - FADE_START) / (1 - FADE_START)))
  const asciiOpacity = reduce ? 0 : 1 - fade
  const imageOpacity = reduce ? 1 : fade

  return (
    <>
      <canvas aria-hidden className="pl-ascii" ref={canvasRef} style={{ opacity: asciiOpacity }} />
      <img alt="" className="pl-mark-img" draggable={false} src={src} style={{ opacity: imageOpacity }} />
    </>
  )
}

export default AsciiMark
