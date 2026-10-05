/* eslint-disable react/prop-types */
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import logoAsset from '../assets/figma/home/logo.png'
import { BarcodeStrip, MonoLabel } from './hud/Hud'
import SocialLinks from './SocialIcons'

// Shared chrome for sub-pages: HUD top bar (logo + back + breadcrumb + social),
// animated page enter, and a footer with barcode + socials.
function PageShell({ crumb, code, title, children }) {
  const reduce = useReducedMotion()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="pt-6"
      exit={{ opacity: 0, y: reduce ? 0 : -12 }}
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Top HUD bar */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1c1c1c] pb-5">
        <div className="flex items-center gap-4">
          <Link
            aria-label="Back to home"
            className="flex h-12 w-12 items-center justify-center rounded-[12px] border-[3px] border-[#2a2a2a] bg-[#515051] p-[3px] transition-transform hover:scale-105"
            to="/"
          >
            <span className="flex h-full w-full items-center justify-center rounded-[8px] border border-black bg-[#1c1c1c]">
              <img alt="Home" className="w-6" src={logoAsset} />
            </span>
          </Link>
          <div className="flex flex-col gap-1">
            <MonoLabel className="text-[#ff5a00]">{code}</MonoLabel>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#8a8a8a]" style={{ fontFamily: 'MartianMono, monospace' }}>
              <Link className="transition-colors hover:text-white" to="/">
                Home
              </Link>
              <span aria-hidden>/</span>
              <span className="text-[#d6d6d6]">{crumb}</span>
            </div>
          </div>
        </div>

        <nav aria-label="Sections" className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em]" style={{ fontFamily: 'MartianMono, monospace' }}>
          <Link className="rounded-full border border-[#2a2a2a] px-4 py-2 text-[#d6d6d6] transition-colors hover:border-[#ff5a00] hover:text-[#ff5a00]" to="/projects">
            Projects
          </Link>
          <Link className="rounded-full border border-[#2a2a2a] px-4 py-2 text-[#d6d6d6] transition-colors hover:border-[#ff5a00] hover:text-[#ff5a00]" to="/achievements">
            Achievements
          </Link>
        </nav>
      </header>

      {title && (
        <h1
          className="mt-8 text-[clamp(38px,7vw,92px)] uppercase leading-[0.95] text-white"
          style={{ fontFamily: 'Azonix, sans-serif' }}
        >
          {title}
        </h1>
      )}

      <div className="mt-8">{children}</div>

      {/* Footer */}
      <footer className="mt-20 border-t border-[#1c1c1c] pt-8">
        <BarcodeStrip className="mb-6" serial="AUTOMATLOG · AMAN YADAV" />
        <div className="flex flex-wrap items-center justify-between gap-6">
          <SocialLinks tone="orange" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#5a5a5a]" style={{ fontFamily: 'MartianMono, monospace' }}>
            © 2024 @automatlog
          </p>
        </div>
      </footer>
    </motion.div>
  )
}

export default PageShell
