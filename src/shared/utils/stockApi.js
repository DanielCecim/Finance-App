/**
 * Stock data utilities - proxied through backend to avoid CORS
 */

const API_BASE = import.meta.env.VITE_API_URL || '/v1'

/**
 * Load stock data from backend
 */
export async function loadStockData(symbol, period = '1y') {
  try {
    const url = `${API_BASE}/stocks/${symbol}/data?period=${period}`
    const response = await fetch(url)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: response.statusText }))
      throw new Error(error.detail || `Failed to fetch stock data: ${response.statusText}`)
    }

    const result = await response.json()
    
    if (!result.data || result.data.length === 0) {
      throw new Error('No data returned from API')
    }

    // Transform to expected format
    const df = result.data.map((row) => ({
      Date: new Date(row.Date),
      Open: row.Open,
      High: row.High,
      Low: row.Low,
      Close: row.Close,
      Volume: row.Volume,
    }))

    return df.filter((row) => row.Close !== null)
  } catch (error) {
    console.error('Error loading stock data:', error)
    throw error
  }
}

/**
 * Calculate technical indicators
 */
export function calculateTechnicalIndicators(df) {
  if (!df || df.length === 0) return df

  const data = [...df]

  // Calculate SMA 20
  for (let i = 0; i < data.length; i++) {
    if (i >= 19) {
      const sum = data.slice(i - 19, i + 1).reduce((acc, row) => acc + row.Close, 0)
      data[i].SMA_20 = sum / 20
    } else {
      data[i].SMA_20 = null
    }
  }

  // Calculate SMA 50
  for (let i = 0; i < data.length; i++) {
    if (i >= 49) {
      const sum = data.slice(i - 49, i + 1).reduce((acc, row) => acc + row.Close, 0)
      data[i].SMA_50 = sum / 50
    } else {
      data[i].SMA_50 = null
    }
  }

  // Calculate Bollinger Bands
  for (let i = 0; i < data.length; i++) {
    if (i >= 19) {
      const slice = data.slice(i - 19, i + 1)
      const mean = slice.reduce((acc, row) => acc + row.Close, 0) / 20
      const variance = slice.reduce((acc, row) => acc + Math.pow(row.Close - mean, 2), 0) / 20
      const std = Math.sqrt(variance)
      
      data[i].BB_Middle = mean
      data[i].BB_Upper = mean + std * 2
      data[i].BB_Lower = mean - std * 2
    } else {
      data[i].BB_Middle = null
      data[i].BB_Upper = null
      data[i].BB_Lower = null
    }
  }

  // Calculate RSI
  const rsiPeriod = 14
  for (let i = 1; i < data.length; i++) {
    const change = data[i].Close - data[i - 1].Close
    data[i].Change = change
  }

  for (let i = rsiPeriod; i < data.length; i++) {
    const gains = []
    const losses = []
    
    for (let j = i - rsiPeriod + 1; j <= i; j++) {
      const change = data[j].Change || 0
      if (change > 0) gains.push(change)
      else losses.push(Math.abs(change))
    }

    const avgGain = gains.length > 0 ? gains.reduce((a, b) => a + b, 0) / rsiPeriod : 0
    const avgLoss = losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / rsiPeriod : 0

    if (avgLoss === 0) {
      data[i].RSI = 100
    } else {
      const rs = avgGain / avgLoss
      data[i].RSI = 100 - 100 / (1 + rs)
    }
  }

  return data
}

