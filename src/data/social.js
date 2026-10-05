// Social links — single source of truth for every social icon on the site.
// github + email are live; paste real URLs into the EDIT ones to activate them.
// Entries with an empty href render as a dimmed "soon" icon (no dead links).

export const socialLinks = [
  { key: 'github', label: 'GitHub', href: 'https://github.com/automatlog' },
  { key: 'email', label: 'Email', href: 'mailto:automatlog@gmail.com' },
  // EDIT: paste real profile URLs to light these up.
  { key: 'linkedin', label: 'LinkedIn', href: '' },
  { key: 'instagram', label: 'Instagram', href: '' },
  { key: 'twitter', label: 'X / Twitter', href: '' },
  { key: 'behance', label: 'Behance', href: '' },
]

export const isExternal = (href) => /^https?:/i.test(href)
