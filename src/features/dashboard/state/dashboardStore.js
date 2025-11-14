import { create } from 'zustand'
import { loadStockData } from '../../../shared/utils/stockApi'

/**
 * Dashboard store for managing stock data and UI state
 */
const useDashboardStore = create((set, get) => ({
  symbol: null,
  period: '1y',
  stockData: null,
  loading: false,
  error: null,

  // Load stock data
  loadStockData: async (symbol, period = '1y') => {
    set({ loading: true, error: null, symbol, period })

    try {
      const data = await loadStockData(symbol, period)
      set({ stockData: data, loading: false })
    } catch (error) {
      set({
        error: error.message || 'Failed to load stock data',
        loading: false,
        stockData: null,
      })
    }
  },

  // Clear data
  clearData: () => {
    set({
      symbol: null,
      stockData: null,
      error: null,
    })
  },
}))

export { useDashboardStore }

