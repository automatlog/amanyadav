/* eslint-disable react/prop-types */
import { isExternal, socialLinks } from '../data/social'
import { socialGlyphs as glyphs } from '../data/socialGlyphs'
import { useResumeGate } from './useResumeGate'

function SocialLinks({ className = '', iconClassName = '', tone = 'muted' }) {
  // the résumé link asks for an email the first time
  const resumeGate = useResumeGate()
  const activeTone =
    tone === 'orange'
      ? 'hover:border-[#ff5a00] hover:text-[#ff5a00]'
      : 'hover:border-[#ff0000] hover:text-white'

  return (
    <>
      <ul className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {socialLinks.filter((link) => !link.locked).map((link) => {
        const active = Boolean(link.href)
        const external = isExternal(link.href)
        const common = `flex h-11 w-11 items-center justify-center rounded-[10px] border transition-colors ${iconClassName}`
        const glyph = (
          <svg
            aria-hidden
            className="h-[22px] w-[22px]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            {glyphs[link.key]}
          </svg>
        )

        if (!active) {
          return (
            <li key={link.key}>
              <span
                aria-label={`${link.label} — link coming soon`}
                className={`${common} cursor-default border-[#2a2a2a] text-[#4a4a4a]`}
                title={`${link.label} — add a URL in src/data/social.js`}
              >
                {glyph}
              </span>
            </li>
          )
        }

        return (
          <li key={link.key}>
            <a
              aria-label={link.label}
              aria-haspopup={link.gated ? 'dialog' : undefined}
              onClick={link.gated ? resumeGate.onClick : undefined}
              className={`${common} border-[#3a3a3a] text-[#d6d6d6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff5a00] ${activeTone}`}
              href={link.href}
              rel={external ? 'noreferrer' : undefined}
              target={external ? '_blank' : undefined}
            >
              {glyph}
            </a>
          </li>
        )
      })}
      </ul>
      {resumeGate.dialog}
    </>
  )
}

export default SocialLinks
