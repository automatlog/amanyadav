/* eslint-disable react-refresh/only-export-components */
/**
 * Skill marks for the Skills rack — the stack from the SKILLS and EXPERIENCE
 * sections of public/Aman Yadav — Resume.pdf, grouped security -> languages
 * -> apps -> AI -> infrastructure, so related tools pass by together.
 *
 * Icons are Simple Icons (CC0), each in its brand colour. Azure and AWS are
 * on the resume but are not in the set — both brands have withdrawn their
 * logos from it — so they are not drawn here rather than imitated.
 */
import {
  siBurpsuite,
  siDocker,
  siFigma,
  siFirebase,
  siGithub,
  siGnubash,
  siGooglecloud,
  siHuggingface,
  siJavascript,
  siJenkins,
  siKalilinux,
  siLangchain,
  siLinux,
  siNodedotjs,
  siOwasp,
  siPostgresql,
  siPython,
  siPytorch,
  siReact,
  siTryhackme,
} from 'simple-icons'

const STACK = [
  // security
  [siBurpsuite, 'Burp Suite'],
  [siOwasp, 'OWASP'],
  [siKalilinux, 'Kali Linux'],
  [siTryhackme, 'TryHackMe'],
  // languages
  [siPython, 'Python'],
  [siJavascript, 'JavaScript'],
  [siGnubash, 'Bash'],
  // apps
  [siReact, 'React'],
  [siNodedotjs, 'Node.js'],
  [siFirebase, 'Firebase'],
  [siPostgresql, 'PostgreSQL'],
  // AI
  [siPytorch, 'PyTorch'],
  [siHuggingface, 'Hugging Face'],
  [siLangchain, 'LangChain'],
  // infrastructure
  [siDocker, 'Docker'],
  [siLinux, 'Linux'],
  [siGooglecloud, 'Google Cloud'],
  [siJenkins, 'Jenkins'],
  [siGithub, 'GitHub'],
  // design
  [siFigma, 'Figma'],
]

/* The tile is #1C1C1C. A brand colour that cannot reach 3:1 against it —
   OWASP's black, GitHub's near-black, TryHackMe's navy — would vanish, so
   those marks are drawn in light grey instead of their brand colour. */
const TILE_LUMINANCE = 0.0116

function luminance(hex) {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function markColour(hex) {
  const contrast = (luminance(hex) + 0.05) / (TILE_LUMINANCE + 0.05)
  return contrast >= 3 ? `#${hex}` : '#E6E6E6'
}

export const skillMarks = STACK.map(([icon, label]) => ({
  key: icon.slug,
  label,
  mark: (
    <svg aria-hidden="true" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d={icon.path} fill={markColour(icon.hex)} />
    </svg>
  ),
}))
