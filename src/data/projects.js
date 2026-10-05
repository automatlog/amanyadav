// Project catalog — drives the Projects section, /projects index and /projects/:slug detail pages.
// Entries marked EDIT are drafts — replace copy, links and covers with real project data.

import projectShowcase from '../images/projects-img/liveliferehabindia.png'

export const projects = [
  {
    slug: 'videsnap',
    serial: 'PRJ-001',
    name: 'VideSnap',
    tagline: 'AI-powered YouTube thumbnail generator',
    year: '2024',
    status: 'LIVE',
    roles: ['Product Design', 'Frontend'],
    stack: ['React', 'Tailwind CSS', 'AI / LLM', 'Figma'],
    cover: projectShowcase,
    kicker: 'AI · CREATIVE TOOLING',
    summary:
      'A tool that turns a video URL into click-worthy YouTube thumbnails in seconds. I designed the landing page and the generator interface — from the hero and social-proof strip down to the URL-to-thumbnail flow.',
    problem:
      'Creators spend hours designing thumbnails that decide whether a video gets clicked. VideSnap collapses that into a paste-a-URL flow, so the hard part becomes taste, not tooling.',
    highlights: [
      'Designed the full marketing landing page — hero, stats, testimonial strip and CTA.',
      'Built the generator UI: video-URL input, style presets and the results grid.',
      'Established the product’s visual language: high-contrast type, soft depth, restrained accent use.',
    ],
    metrics: [
      { value: '20×', label: 'Faster than manual design' },
      { value: '3M+', label: 'Thumbnails referenced' },
      { value: '<10s', label: 'URL to first result' },
    ],
    link: '',
    repo: '',
  },
  {
    slug: 'automatlog-portfolio',
    serial: 'PRJ-002',
    name: 'Automatlog Portfolio',
    tagline: 'This site — a techwear HUD portfolio',
    year: '2025',
    status: 'LIVE',
    roles: ['Design', 'Frontend', 'Motion'],
    stack: ['React', 'Vite', 'Tailwind CSS', 'GSAP', 'Framer Motion'],
    cover: '',
    kicker: 'DESIGN SYSTEM · FRONTEND',
    summary:
      'A dark, bezelled, HUD-inspired portfolio built from a Figma design. Every panel is coded — no flat image exports — so the interface stays crisp at any resolution and reads for screen readers.',
    problem:
      'Portfolio templates all look the same. This one commits to a single strong idea — a techwear control panel — and executes it end to end, from the preloader to the project pages you are reading now.',
    highlights: [
      'Rebuilt each Figma frame as coded, responsive components instead of flattened images.',
      'Designed a reusable HUD kit: bezel plates, barcode strips, serial tags and reticle frames.',
      'Wired GSAP scroll reveals and an orchestrated preloader-to-home transition.',
    ],
    metrics: [
      { value: '100%', label: 'Coded, zero image-only panels' },
      { value: '440kB', label: 'Home JS (down from 1.34MB)' },
      { value: 'A11y', label: 'Real headings + focus states' },
    ],
    link: '',
    repo: 'https://github.com/automatlog',
  },
  {
    slug: 'havok-ctf-platform',
    serial: 'PRJ-003',
    name: 'Penetration Pursuit',
    tagline: 'CTF event identity & scoreboard — EDIT',
    year: '2024',
    status: 'CASE STUDY',
    roles: ['Brand', 'Design', 'Event'],
    stack: ['Figma', 'Illustrator', 'Web'],
    cover: '',
    kicker: 'CYBERSECURITY · BRANDING',
    summary:
      'EDIT — Visual identity, challenge cards and scoreboard styling for HavokSecurity’s Penetration Pursuit CTF at GSFC University. Replace this copy and add real screenshots.',
    problem:
      'EDIT — describe the brief: a capture-the-flag event that needed a cohesive, intimidating identity across posters, cards and the live scoreboard.',
    highlights: [
      'EDIT — event branding across print and screen.',
      'EDIT — challenge card system.',
      'EDIT — live scoreboard visual design.',
    ],
    metrics: [
      { value: '2024', label: 'GSFC University' },
      { value: 'CTF', label: 'Capture the flag' },
      { value: '—', label: 'EDIT participants' },
    ],
    link: 'https://havoksec.in',
    repo: '',
  },
]

export const getProject = (slug) => projects.find((project) => project.slug === slug)
