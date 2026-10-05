import { motion } from 'framer-motion'
import skullMark from '../assets/obsidian_skull.png'
import { contactInfo } from '../pages/home/content'

function DesktopGate() {
  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center overflow-hidden bg-[#111] px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,255,255,0.06),transparent_48%)]" />

      {/* Bezel plate — same language as the Figma preloader/cards */}
      <div className="relative w-full max-w-[420px] rounded-[20px] border-[4px] border-[#2a2a2a] bg-[#515051] p-[6px]">
        <div className="rounded-[14px] border border-black bg-[#1c1c1c] px-6 pb-7 pt-8 text-center">
          {/* Record dot */}
          <div className="mx-auto mb-5 flex items-center justify-center gap-2">
            <span className="relative flex h-4 w-4 items-center justify-center rounded-full border-2 border-[#ff0000]">
              <motion.span
                animate={{ opacity: [1, 0.25, 1] }}
                className="h-1.5 w-1.5 rounded-full bg-[#ff0000]"
                transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity }}
              />
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.2em] text-[#ff0000]"
              style={{ fontFamily: 'MartianMono, monospace' }}
            >
              signal notice
            </span>
          </div>

          <motion.img
            alt=""
            animate={{ scale: [0.99, 1.015, 1], opacity: [0.92, 1, 0.94] }}
            className="mx-auto w-[132px] select-none object-contain"
            draggable={false}
            src={skullMark}
            transition={{ duration: 1.7, ease: 'easeInOut', repeat: Infinity }}
          />

          <h1
            className="mt-5 text-[26px] uppercase leading-tight text-white"
            style={{ fontFamily: 'Azonix, sans-serif' }}
          >
            Desktop
            <br />
            <span className="text-[#ff0000]">Experience</span> Only
          </h1>

          <div className="mx-auto mt-4 h-px w-3/4 bg-[#2a2a2a]" />

          <p
            className="mx-auto mt-4 max-w-[300px] text-[11px] leading-relaxed text-[#d6d6d6]"
            style={{ fontFamily: 'MartianMono, monospace' }}
          >
            This portfolio is engineered for large screens. Open it on a laptop or monitor for the
            full interface.
          </p>

          {/* Escape hatches so mobile visitors aren't dead-ended */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <a
              className="rounded-full border border-[#ff0000] px-4 py-2 text-[11px] uppercase text-[#ff8f8f] transition-colors hover:bg-[rgba(255,0,0,0.1)] hover:text-white"
              href={`mailto:${contactInfo.email}`}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Email
            </a>
            <a
              className="rounded-full border border-[#ff0000] px-4 py-2 text-[11px] uppercase text-[#ff8f8f] transition-colors hover:bg-[rgba(255,0,0,0.1)] hover:text-white"
              href={contactInfo.github}
              rel="noreferrer"
              style={{ fontFamily: "'Inter', sans-serif" }}
              target="_blank"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      <p
        className="mt-6 text-[10px] text-zinc-500"
        style={{ fontFamily: 'MartianMono, monospace' }}
      >
        Copyright 2024 @automatlog
      </p>
    </div>
  )
}

export default DesktopGate
