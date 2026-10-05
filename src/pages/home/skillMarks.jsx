/* eslint-disable react-refresh/only-export-components */
/**
 * Skill tile marks. The Figma frame ships placeholder logos, so these are the
 * real stack — swap or reorder freely, the rack sizes itself from this list.
 */

const ReactMark = (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" fill="#00D8FF" r="2.05" />
    <g fill="none" stroke="#00D8FF" strokeWidth="1.1">
      <ellipse cx="12" cy="12" rx="11" ry="4.2" />
      <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(120 12 12)" />
    </g>
  </svg>
)

const JavaScriptMark = (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect fill="#F7DF1E" height="24" rx="2.4" width="24" />
    <path
      d="M6.7 19.2c-.9 0-1.6-.4-2-1.2l1.4-.85c.28.5.53.92 1.14.92.58 0 .95-.23.95-1.12V11h1.77v5.98c0 1.83-1.07 2.67-2.63 2.67h-.63Zm5.1-.3c-.7-.42-1.15-1-1.44-1.72l1.42-.82c.32.62.74 1.08 1.62 1.08.68 0 1.12-.34 1.12-.82 0-.57-.45-.77-1.2-1.1l-.42-.18c-1.2-.5-2-1.14-2-2.5 0-1.25.95-2.2 2.44-2.2 1.06 0 1.82.37 2.37 1.34l-1.3.83c-.28-.5-.59-.7-1.07-.7-.48 0-.79.31-.79.7 0 .5.31.7 1.02 1l.42.18c1.42.6 2.22 1.22 2.22 2.62 0 1.5-1.18 2.33-2.77 2.33-.68 0-1.24-.12-1.64-.34Z"
      fill="#000000"
    />
  </svg>
)

const GitHubMark = (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.34.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.14c0 .3.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
      fill="#161614"
    />
  </svg>
)

const FigmaMark = (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.5 24a3.75 3.75 0 0 1 0-7.5H12V20a4 4 0 0 1-3.5 4Z" fill="#0ACF83" />
    <path d="M8.5 16.5a3.75 3.75 0 0 1 0-7.5H12v7.5H8.5Z" fill="#A259FF" />
    <path d="M8.5 9a3.75 3.75 0 1 1 0-7.5H12V9H8.5Z" fill="#F24E1E" />
    <path d="M15.5 1.5a3.75 3.75 0 1 1 0 7.5H12V1.5h3.5Z" fill="#FF7262" />
    <path d="M19.25 12.75A3.75 3.75 0 1 1 15.5 9a3.75 3.75 0 0 1 3.75 3.75Z" fill="#1ABCFE" />
  </svg>
)

const PhotoshopMark = (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <rect fill="#001E36" height="24" rx="3.2" width="24" />
    <path
      d="M5.4 17.4V6.8c0-.14.06-.22.2-.23.95-.05 1.9-.07 2.86-.07 2.62 0 4.06 1.44 4.06 3.5 0 2.68-1.94 3.83-4.3 3.83-.36 0-.5-.02-.75-.02v3.6c0 .13-.05.19-.19.19H5.6c-.14 0-.2-.06-.2-.2Zm2.07-8.98v3.5c.18.02.33.02.66.02 1.05 0 1.98-.37 1.98-1.79 0-1.14-.7-1.75-1.85-1.75-.34 0-.63.01-.79.02Zm10.9 2.72c-.65-.34-1.34-.5-1.9-.5-.53 0-.8.2-.8.51 0 .3.16.45 1.13.95 1.52.73 2.02 1.42 2.02 2.44 0 1.52-1.16 2.35-2.73 2.35-.83 0-1.54-.17-1.96-.41-.1-.05-.12-.13-.12-.24v-1.55c0-.14.07-.19.17-.12.6.39 1.28.56 1.9.56.6 0 .85-.22.85-.55 0-.26-.17-.49-1.13-.98-1.38-.66-1.96-1.34-1.96-2.46 0-1.22 .96-2.24 2.62-2.24.82 0 1.39.13 1.7.27.09.05.11.14.11.22v1.44c0 .1-.06.16-.18.11Z"
      fill="#31A8FF"
    />
  </svg>
)

export const skillMarks = [
  { key: 'react', label: 'React', mark: ReactMark },
  { key: 'javascript', label: 'JavaScript', mark: JavaScriptMark },
  { key: 'github', label: 'GitHub', mark: GitHubMark },
  { key: 'figma', label: 'Figma', mark: FigmaMark },
  { key: 'photoshop', label: 'Photoshop', mark: PhotoshopMark },
]
