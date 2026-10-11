import { Outlet, useLocation } from 'react-router-dom'

function AppLayout() {
  const location = useLocation()
  // Pages built on the 1440 design frame size themselves; the rest sit in
  // the narrow content column.
  const isFullBleed = location.pathname === '/' || location.pathname === '/whoami'

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a]">
      <main className={`relative z-10 w-full ${isFullBleed ? '' : 'mx-auto max-w-[1240px] px-6 pb-16'}`}>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
