import { useDashboardStore } from '../state/dashboardStore'
import Button from '../../../shared/components/Button'
import './DataDownload.css'

function DataDownload() {
  const stockData = useDashboardStore((state) => state.stockData)
  const symbol = useDashboardStore((state) => state.symbol)
  const period = useDashboardStore((state) => state.period)

  if (!stockData) return null

  const handleDownloadCSV = () => {
    const headers = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume']
    const csvContent = [
      headers.join(','),
      ...stockData.map((row) =>
        [
          row.Date.toISOString(),
          row.Open,
          row.High,
          row.Low,
          row.Close,
          row.Volume,
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${symbol}_${period}_data.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadJSON = () => {
    const jsonContent = JSON.stringify(stockData, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${symbol}_${period}_data.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="data-download">
      <div className="download-section">
        <h3>Download Data</h3>
        <p className="download-description">
          Download the stock data in your preferred format
        </p>
        <div className="download-buttons">
          <Button onClick={handleDownloadCSV} variant="primary">
            📥 Download CSV
          </Button>
          <Button onClick={handleDownloadJSON} variant="secondary">
            📥 Download JSON
          </Button>
        </div>
      </div>

      <div className="data-preview">
        <h3>Data Preview (Last 10 rows)</h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Open</th>
                <th>High</th>
                <th>Low</th>
                <th>Close</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              {stockData.slice(-10).map((row, index) => (
                <tr key={index}>
                  <td>{row.Date.toLocaleDateString()}</td>
                  <td>${row.Open?.toFixed(2) || 'N/A'}</td>
                  <td>${row.High?.toFixed(2) || 'N/A'}</td>
                  <td>${row.Low?.toFixed(2) || 'N/A'}</td>
                  <td>${row.Close?.toFixed(2) || 'N/A'}</td>
                  <td>{row.Volume?.toLocaleString() || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DataDownload

