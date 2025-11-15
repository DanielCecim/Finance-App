import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import './LandingPage.css'

// Simple text splitter utility (free alternative to SplitText)
const splitTextToChars = (element) => {
  if (!element) return []
  const text = element.textContent
  element.innerHTML = ''
  const chars = []
  
  text.split('').forEach((char) => {
    const span = document.createElement('span')
    span.className = 'char'
    span.textContent = char === ' ' ? '\u00A0' : char
    span.style.display = 'inline-block'
    element.appendChild(span)
    chars.push(span)
  })
  
  return chars
}

function LandingPage({ onEnter }) {
  const [stockSymbol, setStockSymbol] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const logoTextRef = useRef(null)
  const taglineRef = useRef(null)
  const inputContainerRef = useRef(null)
  const preloaderRef = useRef(null)

  useEffect(() => {
    // Wait for fonts to load
    document.fonts.ready.then(() => {
      startAnimations()
    })
  }, [])

  const startAnimations = () => {
    const tl = gsap.timeline()

    // Logo animation
    if (logoTextRef.current) {
      gsap.set(logoTextRef.current, { visibility: 'visible' })
      const logoChars = splitTextToChars(logoTextRef.current)

      tl.from(logoChars, {
        opacity: 0,
        yPercent: -100,
        rotationX: -90,
        ease: 'power2.inOut',
        stagger: {
          each: 0.03,
          from: 'random'
        },
        duration: 0.6
      })
    }

    // Preloader background animation with custom ease
    tl.to('.preloader-bg', {
      scaleX: 1,
      ease: 'power4.inOut',
      duration: 2.5
    }, '-=0.3')

    // Hero content fade in
    tl.fromTo(
      '.hero-content',
      {
        opacity: 0,
        scale: 0.9,
        filter: 'blur(20px)'
      },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power2.out'
      },
      '-=1.8'
    )

    // Tagline animation
    if (taglineRef.current) {
      const taglineChars = splitTextToChars(taglineRef.current)

      tl.from(
        taglineChars,
        {
          opacity: 0,
          yPercent: 50,
          ease: 'power2.out',
          stagger: 0.02,
          duration: 0.5
        },
        '-=0.8'
      )
    }

    // Input container slide up
    tl.fromTo(
      inputContainerRef.current,
      {
        yPercent: 80,
        opacity: 0
      },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'back.out(1.7)'
      },
      '-=0.4'
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (stockSymbol.trim() && !isAnimating) {
      setIsAnimating(true)
      transitionToDashboard()
    }
  }

  const transitionToDashboard = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        onEnter(stockSymbol.toUpperCase())
      }
    })

    tl.to('.hero-content', {
      scale: 0.8,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in'
    })
      .to(
        '.preloader-bg',
        {
          scaleX: 0,
          transformOrigin: 'right',
          duration: 0.8,
          ease: 'power2.inOut'
        },
        '-=0.2'
      )
      .to(
        preloaderRef.current,
        {
          opacity: 0,
          duration: 0.3
        },
        '-=0.3'
      )
  }

  return (
    <div className="landing-page" ref={preloaderRef}>
      <div className="preloader-bg"></div>
      
      <div className="hero-content">
        <div className="logo-section">
          <h1 className="logo-text" ref={logoTextRef}>
            STOCK ANALYZER
          </h1>
        </div>

        <div className="tagline-section">
          <p className="tagline" ref={taglineRef}>
            Your intelligent financial companion
          </p>
        </div>

        <div className="input-section" ref={inputContainerRef}>
          <form onSubmit={handleSubmit} className="landing-form">
            <div className="landing-input-wrapper">
              <input
                type="text"
                value={stockSymbol}
                onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                placeholder="Enter stock symbol (e.g., AAPL)"
                className="landing-input"
                disabled={isAnimating}
                autoFocus
              />
              <button
                type="submit"
                className="landing-button"
                disabled={!stockSymbol.trim() || isAnimating}
              >
                <span className="button-text">
                  {isAnimating ? 'Loading...' : 'Get Started'}
                </span>
                <span className="button-arrow">→</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LandingPage

