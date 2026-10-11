// WHO@Mi page content.
//
// The intro is "spoken" from the cut-corner card beside the photo, typed out
// line by line. Taken from the summary at the top of the resume
// (public/Aman Yadav — Resume.pdf), put in the first person. EDIT freely: the
// layout reserves each line's full size up front, so nothing jumps as it types.
export const introLines = [
  "Hi, I'm Aman Yadav.",
  'A full-stack engineer with a security backbone — I ship AI-native features (Claude Code, RAG, MCP) and harden them.',
  "I've built unified OAuth across 6+ platforms and multi-channel CPaaS pipelines, and found critical vulnerabilities (SQLi, IDOR, auth bypass) in a production gateway.",
  'Independent MCP and agentic-security research. Azure- and Google Cloud–certified; ISO/IEC 27001.',
]

/*
 * Collections are read straight from these folders. Drop images in and they
 * appear on the page — nothing else to edit:
 *
 *   src/images/whoami/lanyards/       community, hackathon, event and club lanyards
 *   src/images/whoami/certificates/
 *   src/images/whoami/badges/
 *
 * The FILENAME is the caption: "Hack The Mountains 2025.png" is captioned
 * "Hack The Mountains 2025". Files are shown in filename order, so prefix a
 * number to set it ("01 - Hack The Mountains 2025.png"); the prefix is
 * dropped from the caption.
 */
/* Vite needs each glob pattern as a literal, so they are spelled out. */
const globs = {
  lanyards: import.meta.glob('../images/whoami/lanyards/*.{png,jpg,jpeg,webp,avif,gif,svg,PNG,JPG,JPEG,WEBP}', {
    eager: true,
    import: 'default',
  }),
  certificates: import.meta.glob('../images/whoami/certificates/*.{png,jpg,jpeg,webp,avif,gif,svg,PNG,JPG,JPEG,WEBP}', {
    eager: true,
    import: 'default',
  }),
  badges: import.meta.glob('../images/whoami/badges/*.{png,jpg,jpeg,webp,avif,gif,svg,PNG,JPG,JPEG,WEBP}', {
    eager: true,
    import: 'default',
  }),
}

function toItems(modules) {
  return Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
    .map(([path, src]) => {
      const file = path.split('/').pop()
      const title = file
        .replace(/\.[^.]+$/, '')
        .replace(/^\d+\s*[-_.)]\s*/, '')
        .trim()
      return { src, title, file }
    })
}

export const collections = [
  {
    key: 'lanyards',
    title: 'Lanyards',
    blurb: 'Communities, hackathons, events and clubs',
    folder: 'src/images/whoami/lanyards/',
    items: toItems(globs.lanyards),
  },
  {
    key: 'certificates',
    title: 'Certificates',
    blurb: 'Courses and programmes completed',
    folder: 'src/images/whoami/certificates/',
    items: toItems(globs.certificates),
  },
  {
    key: 'badges',
    title: 'Badges',
    blurb: 'Earned along the way',
    folder: 'src/images/whoami/badges/',
    items: toItems(globs.badges),
  },
]
