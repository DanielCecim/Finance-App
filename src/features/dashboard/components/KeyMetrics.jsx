import { useRef, useEffect } from 'react'
import { useDashboardStore } from '../state/dashboardStore'
import { gsap } from 'gsap'
import { shouldReduceMotion, easing } from '../../../shared/utils/animations'
import './KeyMetrics.css'

function KeyMetrics() {
  const stockData = useDashboardStore((state) => state.stockData)
  const period = useDashboardStore((state) => state.period)
  
  const metricsRef = useRef(null)
  const cardsAnimated = useRef(false)

  if (!stockData || stockData.length === 0) return null

  const currentPrice = stockData[stockData.length - 1].Close
  const periodStartPrice = stockData[0].Close
  const periodChange = currentPrice - periodStartPrice
  const periodChangePct = (periodChange / periodStartPrice) * 100

  const dailyPrevPrice = stockData.length > 1 ? stockData[stockData.length - 2].Close : currentPrice
  const dailyChange = currentPrice - dailyPrevPrice
  const dailyChangePct = (dailyChange / dailyPrevPrice) * 100

  const volume = stockData[stockData.length - 1].Volume
  const periodHigh = Math.max(...stockData.map((d) => d.Close))
  const periodLow = Math.min(...stockData.map((d) => d.Close))

  const isShortPeriod = ['1d', '5d'].includes(period)
  const displayChange = isShortPeriod ? dailyChange : periodChange
  const displayChangePct = isShortPeriod ? dailyChangePct : periodChangePct
  const changeLabel = isShortPeriod ? 'Daily Change' : 'Period Change'

  // Staggered entrance animation for metric cards
  useEffect(() => {
    if (!metricsRef.current || cardsAnimated.current || shouldReduceMotion()) return

    const cards = metricsRef.current.querySelectorAll('.metric-card')
    
    if (cards.length > 0) {
      // Add animated class first
      cards.forEach(card => card.classList.add('animated'))
      
      // Then animate
      gsap.fromTo(
        cards,
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          stagger: 0.08,
          ease: easing.smooth,
          clearProps: 'all',
          onComplete: () => {
            cards.forEach(card => card.classList.remove('animated'))
          }
        }
      )
      cardsAnimated.current = true
    }
  }, [stockData])

  return (
    <div className="key-metrics" ref={metricsRef}>
      <div className="metric-card">
        <div className="metric-label">Current Price</div>
        <div className="metric-value">${currentPrice.toFixed(2)}</div>
      </div>

      <div className="metric-card">
        <div className="metric-label">{changeLabel}</div>
        <div className={`metric-value ${displayChange >= 0 ? 'metric-positive' : 'metric-negative'}`}>
          ${displayChange.toFixed(2)}
        </div>
        <div className={`metric-change ${displayChange >= 0 ? 'metric-positive' : 'metric-negative'}`}>
          {displayChange >= 0 ? '↑' : '↓'} {Math.abs(displayChangePct).toFixed(2)}%
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-label">Volume</div>
        <div className="metric-value">{volume.toLocaleString()}</div>
      </div>

      <div className="metric-card">
        <div className="metric-label">Period High</div>
        <div className="metric-value">${periodHigh.toFixed(2)}</div>
      </div>

      <div className="metric-card">
        <div className="metric-label">Period Low</div>
        <div className="metric-value">${periodLow.toFixed(2)}</div>
      </div>
    </div>
  )
}

export default KeyMetrics

