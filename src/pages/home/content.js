// Profile data for the home page.
// Facts below were sourced from the Automatlog Figma file (Automatlog / JDF4kTFw95DkbVepmFqEgU)
// and the public github.com/automatlog account. Entries marked EDIT are drafts — correct them freely.

// Nav mirrors the Figma design (node 1:350) — 5 items, no BLOG.
// Labels are written in normal case and uppercased in CSS. WHO@Mi is the
// exception — a stylised mark with a deliberate lowercase i (Figma 1:353) —
// so it sets `caps: false` and renders exactly as written.
export const homeNavItems = [
  { label: 'WHO@Mi', target: 'whoami', caps: false },
  { label: 'Skills', target: 'skills' },
  { label: 'Experience', target: 'experience' },
  { label: 'Projects', target: 'projects' },
  { label: 'Contact', target: 'contact' },
]

// From the header of public/Aman Yadav — Resume.pdf. The phone is not here:
// it is unlocked by the contact form (data/contactForm.js).
export const contactInfo = {
  email: 'automatlog@gmail.com',
  github: 'https://github.com/automatlog',
  linkedin: 'https://www.linkedin.com/in/amandkyadav',
  tryhackme: 'https://tryhackme.com/p/Automatlog',
}

export const heroContent = {
  name: 'AMAN YADAV',
  handle: 'who@mi',
  // From the "About Me" copy in the Figma design file.
  tagline:
    'Graphic & visual designer with a keen eye for aesthetics — cybersecurity enthusiast building creative web interfaces.',
}

export const skillTiles = [
  // EDIT: item lists are drafts based on the portfolio's stack and design profile.
  { title: 'PROGRAMMING LANG', items: ['JavaScript', 'Python', 'C', 'Bash'] },
  { title: 'WEB', items: ['HTML', 'CSS', 'React', 'Node.js'] },
  { title: 'FRAMEWORK', items: ['Tailwind CSS', 'Three.js', 'GSAP', 'Framer Motion'] },
  { title: 'DEVOPS', items: ['Git', 'GitHub Actions', 'Linux', 'Vercel'] },
  { title: 'CYBERSECURITY', items: ['CTF Challenges', 'Burp Suite', 'Nmap', 'OSINT'] },
  { title: 'TOOLS', items: ['Figma', 'Photoshop', 'Illustrator', 'Blender'] },
]

export const experienceEntries = [
  // Drawn from the community/event sections of the Figma design file. EDIT roles/dates as needed.
  {
    period: '2024',
    role: 'Designer & CTF Organizer',
    org: 'HavokSecurity',
    note: 'Penetration Pursuit CTF at GSFC University, Vadodara — event branding, cards and identity (havoksec.in).',
  },
  {
    period: '2023 — 2024',
    role: 'Design Team',
    org: 'GDSC · ITM Baroda University',
    note: 'Posts, standees and community visuals for Google Developer Student Clubs.',
  },
  {
    period: '2023 — 2024',
    role: 'Creative Team',
    org: 'ASC ITMBU · Hacktactix CTF',
    note: 'Visual identity and social creatives for the Hacktactix capture-the-flag events.',
  },
]

export const educationEntries = [
  // EDIT: draft — set your actual degree, institute and years.
  {
    period: '2021 — 2025',
    title: 'B.Tech',
    org: 'ITM (SLS) Baroda University, Vadodara',
  },
]

export const blogCards = [
  {
    nodeId: '341:244',
    date: '12 March 2023',
    title: 'TMUX : Terminal Multiplexer',
    description:
      'Split panes, persistent sessions and a keyboard-first workflow — how tmux turns one terminal into a full cockpit.',
  },
  {
    nodeId: '341:245',
    date: '05 March 2024',
    title: 'Penetration Pursuit — Running a CTF',
    description:
      "Behind HavokSecurity's CTF at GSFC University: challenge design, scoring and the artwork that set the mood.",
  },
  {
    nodeId: '341:249',
    date: '2024',
    title: 'Designing Dark Interfaces',
    description:
      'Bezels, noise and glow — the design language behind this portfolio, and how to keep dark UI readable.',
  },
]
