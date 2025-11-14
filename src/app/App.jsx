import { useEffect } from 'react'
import ErrorBoundary from '../shared/components/ErrorBoundary'
import ChatSidebar from '../features/chat/components/ChatSidebar'
import Dashboard from '../features/dashboard/components/Dashboard'
import { useSessionStore } from '../shared/state/sessionStore'
import './App.css'

function App() {
  const initSession = useSessionStore((state) => state.initSession)

  useEffect(() => {
    // Initialize session on mount
    initSession()
  }, [initSession])

  return (
    <ErrorBoundary>
      <div className="app">
        <ChatSidebar />
        <main className="main-content">
          <Dashboard />
        </main>
      </div>
    </ErrorBoundary>
  )
}

export default App

