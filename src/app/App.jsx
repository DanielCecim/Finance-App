import { useState, useEffect } from 'react'
import ErrorBoundary from '../shared/components/ErrorBoundary'
import ChatSidebar from '../features/chat/components/ChatSidebar'
import Dashboard from '../features/dashboard/components/Dashboard'
import LandingPage from '../features/landing/components/LandingPage'
import ThemeToggle from '../shared/components/ThemeToggle'
import MobileNav from '../shared/components/MobileNav'
import DebugInfo from '../shared/components/DebugInfo'
import { useSessionStore } from '../shared/state/sessionStore'
import { useDashboardStore } from '../features/dashboard/state/dashboardStore'
import { useIsMobile } from '../shared/hooks/useMediaQuery'
import './App.css'

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [initialStock, setInitialStock] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')
  
  const isMobile = useIsMobile()
  const initSession = useSessionStore((state) => state.initSession)
  const loadStockData = useDashboardStore((state) => state.loadStockData)

  // Debug logging
  useEffect(() => {
    console.log('📱 Mobile detection:', isMobile)
    console.log('🔍 Active tab:', activeTab)
    console.log('📺 Window width:', window.innerWidth)
  }, [isMobile, activeTab])

  useEffect(() => {
    // Initialize session on mount
    initSession()
  }, [initSession])

  useEffect(() => {
    // Load initial stock when landing is complete
    if (!showLanding && initialStock) {
      loadStockData(initialStock, '1y')
    }
  }, [showLanding, initialStock, loadStockData])

  const handleLandingComplete = (stockSymbol) => {
    setInitialStock(stockSymbol)
    setShowLanding(false)
  }

  if (showLanding) {
    return (
      <ErrorBoundary>
        <LandingPage onEnter={handleLandingComplete} />
      </ErrorBoundary>
    )
  }

  // Mobile Layout - Full screen views with bottom navigation
  if (isMobile) {
    return (
      <ErrorBoundary>
        <div className="app app-mobile">
          <DebugInfo activeTab={activeTab} />
          <ThemeToggle />
          
          {/* Mobile Views */}
          <div className={`mobile-view ${activeTab === 'dashboard' ? 'mobile-view-active' : ''}`}>
            <Dashboard />
          </div>
          
          <div className={`mobile-view ${activeTab === 'chat' ? 'mobile-view-active' : ''}`}>
            <ChatSidebar isMobile={true} />
          </div>
          
          {/* Bottom Navigation */}
          <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </ErrorBoundary>
    )
  }

  // Desktop Layout - Side-by-side
  return (
    <ErrorBoundary>
      <div className="app app-desktop">
        <ThemeToggle />
        <ChatSidebar />
        <main className="main-content">
          <Dashboard />
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default App

