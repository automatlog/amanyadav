import { AnimatePresence } from 'framer-motion'
import { Suspense, lazy, useCallback, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import DesktopGate from './components/DesktopGate'
import Preloader from './components/preloader/Preloader'
import { useIsMobileViewport } from './hooks/useIsMobileViewport'
import HomePage from './pages/HomePage'
import { introAfterPreloader } from './pages/home/intro'

const ProjectsIndexPage = lazy(() => import('./pages/ProjectsIndexPage'))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'))
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'))
const WhoamiPage = lazy(() => import('./pages/WhoamiPage'))

function AppRoutes() {
  const location = useLocation()
  return (
    <Suspense fallback={<div className="fixed inset-0 z-[9998] bg-[#111]" />}>
      <AnimatePresence mode="wait">
        <Routes key={location.pathname} location={location}>
          <Route element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route element={<ProjectsIndexPage />} path="projects" />
            <Route element={<ProjectDetailPage />} path="projects/:slug" />
            <Route element={<AchievementsPage />} path="achievements" />
            <Route element={<WhoamiPage />} path="whoami" />
          </Route>
          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </AnimatePresence>
    </Suspense>
  )
}

const PRELOADER_STORAGE_KEY = 'al-preloader-shown'
const MINIMUM_PRELOADER_MS = 2200

function shouldSkipPreloader() {
  try {
    if (sessionStorage.getItem(PRELOADER_STORAGE_KEY) === '1') {
      return true
    }
  } catch {
    // Storage unavailable (privacy mode) — fall through to the media query.
  }

  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return true
    }
  } catch {
    // matchMedia unavailable — show the preloader.
  }

  return false
}

function App() {
  const [isReady, setIsReady] = useState(shouldSkipPreloader)
  const isMobile = useIsMobileViewport()

  const handleBootComplete = useCallback(() => {
    try {
      sessionStorage.setItem(PRELOADER_STORAGE_KEY, '1')
    } catch {
      // Storage unavailable — the preloader simply replays next visit.
    }
    introAfterPreloader()
    setIsReady(true)
  }, [])

  if (isMobile) {
    return <DesktopGate />
  }

  return (
    <>
      <AnimatePresence>
        {!isReady && <Preloader minDuration={MINIMUM_PRELOADER_MS} onFinish={handleBootComplete} />}
      </AnimatePresence>
      {isReady && <AppRoutes />}
    </>
  )
}

export default App
