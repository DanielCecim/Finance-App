import { useState, useRef } from 'react'
import { useDashboardStore } from '../state/dashboardStore'
import { useScrollAnimation } from '../../../shared/hooks/useScrollAnimation'
import StockSearch from './StockSearch'
import KeyMetrics from './KeyMetrics'
import PriceChart from './PriceChart'
import TechnicalIndicators from './TechnicalIndicators'
import DataDownload from './DataDownload'
import Spinner from '../../../shared/components/Spinner'
import './Dashboard.css'

function Dashboard() {
  const [activeTab, setActiveTab] = useState('chart')
  
  const stockData = useDashboardStore((state) => state.stockData)
  const loading = useDashboardStore((state) => state.loading)
  const error = useDashboardStore((state) => state.error)
  const symbol = useDashboardStore((state) => state.symbol)

  // Animation refs
  const dashboardRef = useRef(null)
  const headerRef = useRef(null)

  // Apply scroll animations
  useScrollAnimation(dashboardRef)
  useScrollAnimation(headerRef, { from: { opacity: 0, y: 30 }, to: { opacity: 1, y: 0, duration: 0.8 } })

  return (
    <div className="dashboard">
      <div className="dashboard-container" ref={dashboardRef}>
        <h1 className="dashboard-title"> Stock Dashboard</h1>
        
        <StockSearch />

        {loading && <Spinner size="large" text="Loading stock data..." />}

        {error && (
          <div className="dashboard-error">
            <p>❌ {error}</p>
          </div>
        )}

        {!loading && !error && stockData && (
          <>
            <div className="dashboard-header" ref={headerRef}>
              <h2>{symbol} Analysis Dashboard</h2>
            </div>

            <KeyMetrics />

            <div className="dashboard-tabs">
              <button
                className={`tab-button ${activeTab === 'chart' ? 'tab-button-active' : ''}`}
                onClick={() => setActiveTab('chart')}
              >
                Price Chart
              </button>
              <button
                className={`tab-button ${activeTab === 'indicators' ? 'tab-button-active' : ''}`}
                onClick={() => setActiveTab('indicators')}
              >
                Technical Indicators
              </button>
              <button
                className={`tab-button ${activeTab === 'download' ? 'tab-button-active' : ''}`}
                onClick={() => setActiveTab('download')}
              >
                Downloads
              </button>
            </div>

            <div className="dashboard-content">
              {activeTab === 'chart' && <PriceChart />}
              {activeTab === 'indicators' && <TechnicalIndicators />}
              {activeTab === 'download' && <DataDownload />}
            </div>
          </>
        )}

        {!loading && !error && !stockData && (
          <div className="dashboard-empty">
            <p>👆 Enter a stock symbol above to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard

