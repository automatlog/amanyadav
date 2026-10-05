import { useEffect, useState } from 'react'

const MOBILE_QUERY = '(max-width: 767px)'

export function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(() => {
    try {
      return window.matchMedia(MOBILE_QUERY).matches
    } catch {
      return false
    }
  })

  useEffect(() => {
    let media
    try {
      media = window.matchMedia(MOBILE_QUERY)
    } catch {
      return undefined
    }

    const handleChange = (event) => {
      setIsMobile(event.matches)
    }

    media.addEventListener('change', handleChange)
    return () => {
      media.removeEventListener('change', handleChange)
    }
  }, [])

  return isMobile
}
