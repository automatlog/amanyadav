/* eslint-disable react/prop-types */
import { MotionConfig, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ThinkingOrb } from 'thinking-orbs'
import { collections, introLines } from '../data/whoami'
import portrait from '../images/whoami/portrait.webp'
import { Box, Stroked, roundedPath, type, u } from './home/canvas'
import './home/home.css'
import './whoami/whoami.css'

/**
 * WHO@Mi — Figma frame "Who@mi", 1440 wide on a 12-column grid: 74 columns,
 * 32 gutters, 100 margins (measured off the wireframe at 3.2727x; every
 * column edge lands to within 0.5).
 *
 * The first screen is the frame above its divider: two of the wireframe's
 * cut-corner frames side by side — the intro typed out in the left one, the
 * half-length photo in the right. They sit on the grid, columns 2-6 and 7-11,
 * one gutter apart, so the pair is centred with equal 206 margins; each is
 * 498 wide (the wireframe's single card was 478) so both land on column
 * edges. Below the divider, each collection is one of the wireframe's panels
 * — its long bar the title, its short bar the count — revealed on scroll.
 */

/* Wireframe geometry, design units. */
const HERO_H = 732
const FRAME = { w: 498, h: 584 }
const CARD = { x: 206, y: 72, ...FRAME } // text, columns 2-6
const PHOTO = { x: 736, y: 72, ...FRAME } // photo, columns 7-11
const CARD_PAD = { x: 40, y: 40 }
const DIVIDER = { x: 44, y: 730, w: 1352 }

/* One frame shape for both: the top-left corner cut as the wireframe draws
   it (~62 x 56), every corner rounded. */
const FRAME_PATH = roundedPath([
  [0, 56, 20],
  [62, 0, 20],
  [FRAME.w, 0, 20],
  [FRAME.w, FRAME.h, 20],
  [0, FRAME.h, 20],
])

/* ------------------------------------------------------------------ intro */

/**
 * Types the intro one line at a time. Each line's full text is laid out from
 * the start and only REVEALED, so nothing reflows as characters arrive.
 * Under reduced motion every line is simply there.
 */
function useTypewriter(lines, { charMs = 26, lineGapMs = 480, startMs = 450 } = {}) {
  const reduce = useReducedMotion()
  const [pos, setPos] = useState({ line: 0, char: 0 })
  const done = reduce || pos.line >= lines.length

  useEffect(() => {
    if (done) return undefined
    const len = lines[pos.line].length
    const atEnd = pos.char >= len
    const wait = pos.line === 0 && pos.char === 0 ? startMs : atEnd ? lineGapMs : charMs
    const id = setTimeout(() => {
      setPos((p) => (p.char >= lines[p.line].length ? { line: p.line + 1, char: 0 } : { ...p, char: p.char + 1 }))
    }, wait)
    return () => clearTimeout(id)
  }, [pos, done, lines, charMs, lineGapMs, startMs])

  return { line: done ? lines.length : pos.line, char: pos.char, done }
}

/** The cut-corner card, and the intro spoken from it. */
function SpeechCard() {
  const { line, char, done } = useTypewriter(introLines)
  const left = CARD.x + CARD_PAD.x
  const width = CARD.w - CARD_PAD.x * 2

  return (
    <>
      <Box w={CARD.w} h={CARD.h} x={CARD.x} y={CARD.y}>
        <svg height="100%" viewBox={`0 0 ${CARD.w} ${CARD.h}`} width="100%">
          <defs>
            <clipPath id="wm-card-clip">
              <path d={FRAME_PATH} />
            </clipPath>
          </defs>
          <path d={FRAME_PATH} fill="#1C1C1C" />
          {/* 5 edge inside the outline: stroked at 10, clipped to the shape */}
          <g clipPath="url(#wm-card-clip)">
            <path d={FRAME_PATH} fill="none" stroke="#2A2A2A" strokeWidth="10" />
          </g>
        </svg>
      </Box>

      {/* The speaking indicator: the orb works while the intro is typed, and
          settles into a slow breath once it is finished. */}
      <Box className="wm-speaking" w={width} h={28} x={left} y={CARD.y + CARD_PAD.y}>
        <span aria-hidden className="wm-speaking-orb">
          <ThinkingOrb aria-hidden="true" size={20} state={done ? 'breathing' : 'composing'} theme="dark" />
        </span>
        <span>{done ? 'Intro' : 'Speaking…'}</span>
      </Box>

      <Box
        as="h1"
        style={{ ...type({ size: 44, lh: 52 }), color: '#FF0000', margin: 0, whiteSpace: 'pre' }}
        w={width}
        h={52}
        x={left}
        y={CARD.y + CARD_PAD.y + 44}
      >
        {'WHO'}
        <span style={{ color: '#FFFFFF' }}>@</span>
        {'Mi'}
      </Box>

      <Box
        className="wm-captions"
        w={width}
        h={CARD.h - CARD_PAD.y * 2 - 120}
        x={left}
        y={CARD.y + CARD_PAD.y + 120}
      >
        {/* the whole intro, for screen readers, from the first moment */}
        <p className="wm-sr">{introLines.join(' ')}</p>
        <div aria-hidden>
          {introLines.map((text, i) => {
            const shown = i < line ? text.length : i === line ? char : 0
            const state = done ? 'done' : i < line ? 'said' : i === line ? 'saying' : 'unsaid'
            return (
              <p className={`wm-caption wm-caption--${state}`} key={text}>
                <span className="wm-caption-shown">{text.slice(0, shown)}</span>
                {i === line && !done ? <span className="wm-caret" /> : null}
                <span className="wm-caption-rest">{text.slice(shown)}</span>
              </p>
            )
          })}
        </div>
      </Box>
    </>
  )
}

/* ------------------------------------------------------------------ hero */

/** The half-length photo, background kept, in the same cut-corner frame. */
function Portrait() {
  return (
    <Box w={PHOTO.w} h={PHOTO.h} x={PHOTO.x} y={PHOTO.y}>
      <svg height="100%" role="img" viewBox={`0 0 ${PHOTO.w} ${PHOTO.h}`} width="100%">
        <title>Aman Yadav on a snowy mountain slope</title>
        <defs>
          <clipPath id="wm-portrait-clip">
            <path d={FRAME_PATH} />
          </clipPath>
        </defs>
        <image
          clipPath="url(#wm-portrait-clip)"
          height={PHOTO.h}
          href={portrait}
          preserveAspectRatio="xMidYMid slice"
          width={PHOTO.w}
        />
        <g clipPath="url(#wm-portrait-clip)">
          <path d={FRAME_PATH} fill="none" stroke="#2A2A2A" strokeWidth="10" />
        </g>
      </svg>
    </Box>
  )
}

function Hero() {
  return (
    <section className="hm-section" id="intro" style={{ width: u(1440), height: u(HERO_H) }}>
      {/* back to home, above the frames and on their left edge */}
      <Box aria-label="Back to home" as={Link} className="wm-back hm-press" to="/" w={126} h={46} x={CARD.x} y={0}>
        <Stroked className="hm-bezel" r="full" stroke={[5, '#1C1C1C']} w={116} h={36} x={5} y={5} />
        <Box className="wm-back-arrow" w={16} h={16} x={24} y={15}>
          <svg fill="none" height="100%" viewBox="0 0 18 18" width="100%">
            <path d="M16 9H2M8 3 2 9l6 6" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </Box>
        <Box
          style={{ ...type({ size: 15, lh: 20 }), color: '#FFFFFF', display: 'flex', alignItems: 'center', textTransform: 'uppercase' }}
          w={60}
          h={20}
          x={50}
          y={13}
        >
          Home
        </Box>
      </Box>

      <SpeechCard />
      <Portrait />

      {/* the wireframe's rule between the first screen and the collections */}
      <Box style={{ background: '#2A2A2A' }} w={DIVIDER.w} h={2} x={DIVIDER.x} y={DIVIDER.y} />
    </section>
  )
}

/* ------------------------------------------------------------ collections */

function Lightbox({ item, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return undefined
    if (item && !dialog.open) dialog.showModal()
    if (!item && dialog.open) dialog.close()
    return undefined
  }, [item])

  return (
    <dialog
      aria-label={item ? item.title : undefined}
      className="wm-lightbox"
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      ref={ref}
    >
      {item ? (
        <figure>
          <img alt={item.title} src={item.src} />
          <figcaption>{item.title}</figcaption>
        </figure>
      ) : null}
      <button aria-label="Close" className="wm-lightbox-close hm-press" onClick={onClose} type="button">
        <svg fill="none" viewBox="0 0 24 24">
          <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
        </svg>
      </button>
    </dialog>
  )
}

const REVEAL = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
}

/* tiles enter a row at a time, not as one block */
const PER_ROW = { lanyards: 4, certificates: 3, badges: 6 }

function Collection({ collection, onOpen }) {
  const { key, title, blurb, items, folder } = collection
  const empty = items.length === 0

  return (
    <motion.section aria-labelledby={`wm-${key}`} className={`wm-panel wm-panel--${key}`} {...REVEAL}>
      <header className="wm-panel-head">
        <h2 className="wm-panel-title" id={`wm-${key}`}>
          {title}
        </h2>
        <p className="wm-panel-meta">
          {empty ? blurb : `${items.length} ${items.length === 1 ? 'item' : 'items'} · ${blurb}`}
        </p>
      </header>

      {empty ? (
        /* only ever seen in development: production hides empty collections */
        <p className="wm-empty">
          Nothing here yet. Drop images into <code>{folder}</code> — each filename becomes its caption.
        </p>
      ) : (
        <ul className="wm-grid">
          {items.map((item, i) => (
            <motion.li
              initial={{ opacity: 0, y: 18 }}
              key={item.file}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: Math.floor(i / PER_ROW[key]) * 0.08 }}
              viewport={{ once: true, amount: 0.2 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <button
                aria-label={`View ${item.title}`}
                className="wm-tile hm-press"
                onClick={() => onOpen(item)}
                type="button"
              >
                {key === 'lanyards' ? <span aria-hidden className="wm-strap" /> : null}
                <span className="wm-tile-plate">
                  <img alt="" decoding="async" loading="lazy" src={item.src} />
                </span>
                <span className="wm-tile-caption" title={item.title}>
                  {item.title}
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.section>
  )
}

/* ------------------------------------------------------------------ page */

function WhoamiPage() {
  const [open, setOpen] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  /* in production a collection with nothing in it is left out entirely */
  const shown = collections.filter((c) => c.items.length > 0 || import.meta.env.DEV)

  return (
    <MotionConfig reducedMotion="user">
      <div className="hm-scroll">
        <div className="hm-root wm-root">
          <Hero />
          {shown.map((c) => (
            <Collection collection={c} key={c.key} onOpen={setOpen} />
          ))}
        </div>
        <div aria-hidden className="hm-grain" />
        <Lightbox item={open} onClose={() => setOpen(null)} />
      </div>
    </MotionConfig>
  )
}

export default WhoamiPage
