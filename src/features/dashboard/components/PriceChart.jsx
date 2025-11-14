import { useMemo } from 'react'
import Plot from 'react-plotly.js'
import { useDashboardStore } from '../state/dashboardStore'
import { calculateTechnicalIndicators } from '../../../shared/utils/stockApi'
import './PriceChart.css'

function PriceChart() {
  const stockData = useDashboardStore((state) => state.stockData)
  const symbol = useDashboardStore((state) => state.symbol)
  const period = useDashboardStore((state) => state.period)

  const chartData = useMemo(() => {
    if (!stockData) return null
    return calculateTechnicalIndicators(stockData)
  }, [stockData])

  if (!chartData) return null

  const dates = chartData.map((d) => d.Date)
  const closes = chartData.map((d) => d.Close)
  const volumes = chartData.map((d) => d.Volume)
  const sma20 = chartData.map((d) => d.SMA_20)
  const sma50 = chartData.map((d) => d.SMA_50)
  const bbUpper = chartData.map((d) => d.BB_Upper)
  const bbLower = chartData.map((d) => d.BB_Lower)

  const periodLabel = {
    '1d': '1 Day',
    '5d': '5 Days',
    '1mo': '1 Month',
    '3mo': '3 Months',
    '6mo': '6 Months',
    '1y': '1 Year',
    '2y': '2 Years',
    '5y': '5 Years',
    '10y': '10 Years',
    ytd: 'Year to Date',
    max: 'All Time',
  }[period]

  return (
    <div className="price-chart">
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
          {
            x: dates,
            y: bbUpper,
            type: 'scatter',
            mode: 'lines',
            name: 'BB Upper',
            line: { color: 'rgba(255, 0, 0, 0.3)', width: 1 },
          },
          {
            x: dates,
            y: bbLower,
            type: 'scatter',
            mode: 'lines',
            name: 'BB Lower',
            line: { color: 'rgba(255, 0, 0, 0.3)', width: 1 },
            fill: 'tonexty',
            fillcolor: 'rgba(255, 0, 0, 0.1)',
          },
        ]}
        layout={{
          title: `${symbol} Stock Analysis - ${periodLabel}`,
          xaxis: { title: 'Date' },
          yaxis: { title: 'Price ($)' },
          hovermode: 'x unified',
          showlegend: true,
          legend: {
            orientation: 'h',
            yanchor: 'bottom',
            y: 1.02,
            xanchor: 'right',
            x: 1,
          },
          autosize: true,
        }}
        useResizeHandler
        style={{ width: '100%', height: '500px' }}
        config={{ responsive: true }}
      />

      <div className="volume-chart">
        <Plot
          data={[
            {
              x: dates,
              y: volumes,
              type: 'bar',
              name: 'Volume',
              marker: {
                color: volumes.map((_, i) =>
                  i > 0 && closes[i] >= closes[i - 1] ? 'green' : 'red'
                ),
                opacity: 0.7,
              },
            },
          ]}
          layout={{
            title: 'Volume',
            xaxis: { title: 'Date' },
            yaxis: { title: 'Volume' },
            showlegend: false,
            autosize: true,
          }}
          useResizeHandler
          style={{ width: '100%', height: '200px' }}
          config={{ responsive: true }}
        />
      </div>
    </div>
  )
}

export default PriceChart

