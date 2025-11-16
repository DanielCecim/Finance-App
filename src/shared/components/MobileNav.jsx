import './MobileNav.css'

function MobileNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'chat', icon: '💬', label: 'AI Chat' },
    { id: 'settings', icon: '⚙️', label: 'Settings' },
  ]

  return (
    <nav className="mobile-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`mobile-nav-tab ${activeTab === tab.id ? 'mobile-nav-tab-active' : ''}`}
          onClick={() => onTabChange(tab.id)}
          aria-label={tab.label}
          aria-current={activeTab === tab.id ? 'page' : undefined}
        >
          <span className="mobile-nav-icon">{tab.icon}</span>
          <span className="mobile-nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}

export default MobileNav

