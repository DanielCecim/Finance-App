import { useMemo } from 'react'
import Plot from 'react-plotly.js'
import { useDashboardStore } from '../state/dashboardStore'
import { calculateTechnicalIndicators } from '../../../shared/utils/stockApi'
import './TechnicalIndicators.css'

function TechnicalIndicators() {
  const stockData = useDashboardStore((state) => state.stockData)
  const symbol = useDashboardStore((state) => state.symbol)

  const chartData = useMemo(() => {
    if (!stockData) return null
    return calculateTechnicalIndicators(stockData)
  }, [stockData])

  if (!chartData) return null

  const dates = chartData.map((d) => d.Date)
  const closes = chartData.map((d) => d.Close)
  const sma20 = chartData.map((d) => d.SMA_20)
  const sma50 = chartData.map((d) => d.SMA_50)
  const rsi = chartData.map((d) => d.RSI)

  return (
    <div className="technical-indicators">
      <div className="indicator-chart">
        <h3>Moving Averages</h3>
        <Plot
          data={[
            {
              x: dates,
              y: closes,
              type: 'scatter',
              mode: 'lines',
              name: 'Close Price',
              line: { color: '#1f77b4', width: 2 },
            },
            {
              x: dates,
              y: sma20,
              type: 'scatter',
              mode: 'lines',
              name: 'SMA 20',
              line: { color: 'orange', width: 1.5 },
            },
            {
              x: dates,
              y: sma50,
              type: 'scatter',
              mode: 'lines',
              name: 'SMA 50',
              line: { color: 'purple', width: 1.5 },
            },
          ]}
          layout={{
            title: `${symbol} Moving Averages`,
            xaxis: { title: 'Date' },
            yaxis: { title: 'Price ($)' },
            hovermode: 'x unified',
            showlegend: true,
            legend: {
              orientation: 'h',
              yanchor: 'top',
              y: 1.1,
              xanchor: 'left',
              x: 0.01,
            },
            autosize: true,
          }}
          useResizeHandler
          style={{ width: '100%', height: '400px' }}
          config={{ responsive: true }}
        />
      </div>

      <div className="indicator-chart">
        <h3>RSI (Relative Strength Index)</h3>
        <Plot
          data={[
            {
              x: dates,
              y: rsi,
              type: 'scatter',
              mode: 'lines',
              name: 'RSI',
              line: { color: '#1f77b4', width: 2 },
            },
          ]}
          layout={{
            title: `${symbol} RSI`,
            xaxis: { title: 'Date' },
            yaxis: { title: 'RSI', range: [0, 100] },
            hovermode: 'x unified',
            showlegend: true,
            shapes: [
              {
                type: 'line',
                x0: dates[0],
                x1: dates[dates.length - 1],
                y0: 70,
                y1: 70,
                line: { color: 'red', width: 1, dash: 'dash' },
              },
              {
                type: 'line',
                x0: dates[0],
                x1: dates[dates.length - 1],
                y0: 30,
                y1: 30,
                line: { color: 'green', width: 1, dash: 'dash' },
              },
            ],
            annotations: [
              {
                x: dates[dates.length - 1],
                y: 70,
                text: 'Overbought (70)',
                showarrow: false,
                xanchor: 'right',
                yanchor: 'bottom',
              },
              {
                x: dates[dates.length - 1],
                y: 30,
                text: 'Oversold (30)',
                showarrow: false,
                xanchor: 'right',
                yanchor: 'top',
              },
            ],
            autosize: true,
          }}
          useResizeHandler
          style={{ width: '100%', height: '400px' }}
          config={{ responsive: true }}
        />
      </div>
    </div>
  )
}

export default TechnicalIndicators

