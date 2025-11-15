import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { getFadeInAnimation, shouldReduceMotion, getReducedMotionConfig } from '../utils/animations'

/**
 * Custom hook for scroll-based animations
 * Automatically animates elements when they enter the viewport
 * 
 * @param {React.RefObject|Array<React.RefObject>} elementRef - Ref(s) to animate
 * @param {Object} animationConfig - Custom animation configuration
 * @param {Object} options - Hook options
 * @param {number} options.threshold - Intersection threshold (0-1)
 * @param {string} options.rootMargin - Root margin
 * @param {boolean} options.repeat - Whether to repeat animation on re-entry
 * @param {boolean} options.stagger - Whether to stagger multiple elements
 * @returns {void}
 */
export const useScrollAnimation = (
  elementRef,
  animationConfig = null,
  options = {}
) => {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    repeat = false,
    stagger = false
  } = options

  const animationRef = useRef(null)
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    // Handle array of refs or single ref
    const isArray = Array.isArray(elementRef)
    const elements = isArray 
      ? elementRef.map(ref => ref.current).filter(Boolean)
      : elementRef.current ? [elementRef.current] : []

    if (elements.length === 0) return

    // Get animation config
    let config = animationConfig || getFadeInAnimation()

    // Apply reduced motion if needed
    if (shouldReduceMotion()) {
      config = getReducedMotionConfig(config)
    }

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Only animate if not already animated (unless repeat is true)
            if (!hasAnimatedRef.current || repeat) {
              // Animate element(s)
              if (isArray && stagger) {
                // Animate all elements with stagger
                animationRef.current = gsap.fromTo(
                  elements,
                  config.from,
                  {
                    ...config.to,
                    stagger: 0.1
                  }
                )
              } else {
                // Animate single element
                animationRef.current = gsap.fromTo(
                  entry.target,
                  config.from,
                  config.to
                )
              }

              hasAnimatedRef.current = true
            }
          }
        })
      },
      {
        threshold,
        rootMargin
      }
    )

    // Observe all elements
    elements.forEach(element => observer.observe(element))

    // Cleanup
    return () => {
      observer.disconnect()
      if (animationRef.current) {
        animationRef.current.kill()
      }
    }
  }, [elementRef, animationConfig, threshold, rootMargin, repeat, stagger])
}

export default useScrollAnimation

