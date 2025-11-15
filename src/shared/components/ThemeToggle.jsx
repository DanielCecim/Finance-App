import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useTheme } from '../hooks/useTheme'
import './ThemeToggle.css'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const containerRef = useRef(null)
  const sliderRef = useRef(null)
  const lightRef = useRef(null)
  const darkRef = useRef(null)
  const tlRef = useRef(null)

  useEffect(() => {
    // Initialize timeline
    tlRef.current = gsap.timeline()

    // Set initial position of slider
    if (containerRef.current && sliderRef.current && lightRef.current && darkRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const targetRef = theme === 'light' ? lightRef : darkRef
      const targetRect = targetRef.current.getBoundingClientRect()
      
      gsap.set(sliderRef.current, {
        left: targetRect.left - containerRect.left,
        width: targetRect.offsetWidth
      })
    }
  }, [])

  useEffect(() => {
    // Animate when theme changes
    if (!containerRef.current || !sliderRef.current || !lightRef.current || !darkRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const targetRef = theme === 'light' ? lightRef : darkRef
    const targetRect = targetRef.current.getBoundingClientRect()
    
    const animationDuration = 0.75
    const degreesToRotate = 25
    const direction = theme === 'light' ? -1 : 1

    const tl = gsap.timeline()

    // Rotate container
    tl.to(containerRef.current, animationDuration - 0.3, {
      rotateY: `${direction * degreesToRotate}deg`,
      ease: 'power2.inOut'
    })

    // Slide the focus element with bounce
    tl.to(
      sliderRef.current,
      animationDuration,
      {
        left: targetRect.left - containerRect.left,
        width: targetRect.offsetWidth,
        ease: 'bounce.out'
      },
      `-=${animationDuration - 0.3}`
    )

    // Rotate back to normal
    tl.to(
      containerRef.current,
      animationDuration - 0.3,
      {
        rotateY: '0deg',
        ease: 'power2.inOut'
      },
      '-=0.3'
    )
  }, [theme])

  const handleThemeClick = (newTheme) => {
    if (newTheme !== theme) {
      setTheme(newTheme)
    }
  }

  return (
    <div className="theme-toggle-wrapper">
      <div className="theme-toggle-container" ref={containerRef}>
        <div className="theme-toggle-slider" ref={sliderRef} />
        <button
          ref={lightRef}
          className={`theme-toggle-option ${theme === 'light' ? 'active' : ''}`}
          onClick={() => handleThemeClick('light')}
          aria-label="Switch to light mode"
        >
          <span className="theme-toggle-icon">☀️</span>
          <span className="theme-toggle-text">Light</span>
        </button>
        <button
          ref={darkRef}
          className={`theme-toggle-option ${theme === 'dark' ? 'active' : ''}`}
          onClick={() => handleThemeClick('dark')}
          aria-label="Switch to dark mode"
        >
          <span className="theme-toggle-icon">🌙</span>
          <span className="theme-toggle-text">Dark</span>
        </button>
      </div>
    </div>
  )
}

export default ThemeToggle

