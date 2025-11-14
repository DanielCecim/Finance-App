import { useState } from 'react'
import { useDashboardStore } from '../state/dashboardStore'
import Input from '../../../shared/components/Input'
import Select from '../../../shared/components/Select'
import Button from '../../../shared/components/Button'
import './StockSearch.css'

const PERIOD_OPTIONS = [
  { value: '1d', label: '1 Day' },
  { value: '5d', label: '5 Days' },
  { value: '1mo', label: '1 Month' },
  { value: '3mo', label: '3 Months' },
  { value: '6mo', label: '6 Months' },
  { value: '1y', label: '1 Year' },
  { value: '2y', label: '2 Years' },
  { value: '5y', label: '5 Years' },
  { value: '10y', label: '10 Years' },
  { value: 'ytd', label: 'Year to Date' },
  { value: 'max', label: 'All Time' },
]

function StockSearch() {
  const symbol = useDashboardStore((state) => state.symbol)
  const period = useDashboardStore((state) => state.period)
  const loading = useDashboardStore((state) => state.loading)
  const loadStockData = useDashboardStore((state) => state.loadStockData)
  
  const [localSymbol, setLocalSymbol] = useState(symbol || 'MSFT')
  const [localPeriod, setLocalPeriod] = useState(period || '1y')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (localSymbol.trim()) {
      loadStockData(localSymbol.toUpperCase(), localPeriod)
    }
  }

  return (
    <form className="stock-search" onSubmit={handleSubmit}>
      <Input
        type="text"
        value={localSymbol}
        onChange={(e) => setLocalSymbol(e.target.value.toUpperCase())}
        placeholder="Enter Stock Symbol (e.g., AAPL)"
        disabled={loading}
        className="stock-search-input"
      />
      
      <Select
        value={localPeriod}
        onChange={(e) => setLocalPeriod(e.target.value)}
        options={PERIOD_OPTIONS}
        disabled={loading}
        className="stock-search-select"
      />
      
      <Button
        type="submit"
        variant="primary"
        disabled={loading || !localSymbol.trim()}
        loading={loading}
      >
        Load Data
      </Button>
    </form>
  )
}

export default StockSearch

