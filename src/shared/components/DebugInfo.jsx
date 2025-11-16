import { useIsMobile } from '../hooks/useMediaQuery'

function DebugInfo({ activeTab }) {
  const isMobile = useIsMobile()
  
  // Only show in development
  if (import.meta.env.PROD) return null
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999,
      fontFamily: 'monospace',
      maxWidth: '200px',
      borderBottomLeftRadius: '8px'
    }}>
      <div>📱 Mobile: {isMobile ? 'YES' : 'NO'}</div>
      <div>📺 Width: {window.innerWidth}px</div>
      <div>🔍 Tab: {activeTab}</div>
      <div>🎯 Breakpoint: {window.innerWidth < 768 ? '< 768' : '≥ 768'}px</div>
    </div>
  )
}

export default DebugInfo

