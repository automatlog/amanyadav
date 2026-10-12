// Social and contact links — single source of truth for every social icon on
// the site (the contact sockets, the contact list, sub-page footers).
// Taken from the header of private/Aman Yadav — Resume.pdf, with the email set
// to automatlog@gmail.com. Order is the order the contact sockets fill in.
// The phone is `locked`: it carries no number here at all — it is revealed
// only after a visitor sends the contact form (see data/contactForm.js).
// The résumé is `gated`: it opens the work-email dialog (data/resumeGate.js).

export const socialLinks = [
  { key: 'github', label: 'GitHub', handle: 'automatlog', href: 'https://github.com/automatlog' },
  { key: 'linkedin', label: 'LinkedIn', handle: 'amandkyadav', href: 'https://www.linkedin.com/in/amandkyadav' },
  { key: 'tryhackme', label: 'TryHackMe', handle: 'Automatlog', href: 'https://tryhackme.com/p/Automatlog' },
  { key: 'topmate', label: 'Topmate', handle: 'amandkyadav', href: 'https://topmate.io/amandkyadav' },
  { key: 'gdev', label: 'Google Developer Profile', handle: 'automatlog', href: 'https://g.dev/automatlog' },
  { key: 'credly', label: 'Credly', handle: 'aman-yadav', href: 'https://www.credly.com/users/aman-yadav.b530a1ef/badges/credly' },
  { key: 'x', label: 'X', handle: '@automatlog', href: 'https://x.com/automatlog' },
  { key: 'email', label: 'Email', handle: 'automatlog@gmail.com', href: 'mailto:automatlog@gmail.com' },
  { key: 'phone', label: 'Phone', locked: true },
  // no URL: the PDF is served only by the résumé API, after a work email
  { key: 'resume', label: 'Resume (PDF)', handle: 'Download', href: '#resume', gated: true },
]

export const isExternal = (href) => /^https?:/i.test(href)
