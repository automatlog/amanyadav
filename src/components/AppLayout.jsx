import { Outlet, useLocation } from 'react-router-dom'

function AppLayout() {
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a]">
      <main className={`relative z-10 w-full ${isHomePage ? '' : 'mx-auto max-w-[1240px] px-6 pb-16'}`}>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
