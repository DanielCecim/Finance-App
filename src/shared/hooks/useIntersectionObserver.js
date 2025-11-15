import { useEffect, useRef } from 'react'

/**
 * Custom hook for Intersection Observer API
 * Detects when an element enters the viewport
 * 
 * @param {React.RefObject} elementRef - Ref to the target element
 * @param {Function} callback - Callback function called when intersection changes
 * @param {Object} options - Intersection Observer options
 * @param {number} options.threshold - Percentage of element visibility (0-1)
 * @param {string} options.rootMargin - Margin around root
 * @param {Element} options.root - Root element for intersection
 * @returns {void}
 */
export const useIntersectionObserver = (elementRef, callback, options = {}) => {
  const observerRef = useRef(null)

  useEffect(() => {
    // Don't create observer if ref is not set
    if (!elementRef.current) return

    const {
      threshold = 0.1,
      rootMargin = '0px',
      root = null
    } = options

    // Create observer
    observerRef.current = new IntersectionObserver(callback, {
      threshold,
      rootMargin,
      root
    })

    // Start observing
    observerRef.current.observe(elementRef.current)

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [elementRef, callback, options.threshold, options.rootMargin, options.root])

  return observerRef
}

export default useIntersectionObserver

