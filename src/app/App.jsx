import { useState, useEffect } from 'react'
import ErrorBoundary from '../shared/components/ErrorBoundary'
import ChatSidebar from '../features/chat/components/ChatSidebar'
import Dashboard from '../features/dashboard/components/Dashboard'
import LandingPage from '../features/landing/components/LandingPage'
import ThemeToggle from '../shared/components/ThemeToggle'
import { useSessionStore } from '../shared/state/sessionStore'
import { useDashboardStore } from '../features/dashboard/state/dashboardStore'
import './App.css'

function App() {
  const [showLanding, setShowLanding] = useState(true)
  const [initialStock, setInitialStock] = useState(null)
  const initSession = useSessionStore((state) => state.initSession)
  const loadStockData = useDashboardStore((state) => state.loadStockData)

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

  return (
    <ErrorBoundary>
      <div className="app">
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

