/**
 * Animation Utilities - Apple-inspired animation configurations
 * Uses GSAP for high-performance animations
 */

/**
 * Apple-style easing functions
 */
export const easing = {
  smooth: 'power2.out',
  swift: 'power3.inOut',
  gentle: 'power1.out',
  bounce: 'back.out(1.2)'
}

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if reduced motion is preferred
 */
export const shouldReduceMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get fade-in animation configuration
 * @param {Object} options - Animation options
 * @param {number} options.duration - Animation duration in seconds
 * @param {number} options.y - Y offset for slide effect
 * @param {string} options.ease - GSAP easing function
 * @returns {Object} GSAP animation configuration
 */
export const getFadeInAnimation = (options = {}) => {
  const {
    duration = 0.3,
    y = 20,
    ease = easing.smooth
  } = options

  return {
    from: {
      opacity: 0,
      y
    },
    to: {
      opacity: 1,
      y: 0,
      duration,
      ease
    }
  }
}

/**
 * Get stagger animation configuration
 * Animates multiple elements with a delay between each
 * @param {number} staggerDelay - Delay between each element (in seconds)
 * @param {Object} options - Additional animation options
 * @returns {Object} GSAP animation configuration with stagger
 */
export const getStaggerAnimation = (staggerDelay = 0.1, options = {}) => {
  const fadeIn = getFadeInAnimation(options)
  
  return {
    ...fadeIn,
    stagger: staggerDelay
  }
}

/**
 * Get number counter animation configuration
 * Animates a number from start to end value
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {Function} onUpdate - Callback function called with interpolated value
 * @param {Object} options - Animation options
 * @param {number} options.duration - Animation duration in seconds
 * @param {string} options.ease - GSAP easing function
 * @returns {Object} GSAP animation configuration
 */
export const getNumberCounterAnimation = (start, end, onUpdate, options = {}) => {
  const {
    duration = 0.5,
    ease = easing.smooth
  } = options

  return {
    from: {
      value: start
    },
    to: {
      value: end,
      duration,
      ease,
      onUpdate: function() {
        onUpdate(this.value)
      }
    }
  }
}

/**
 * Convert animation config to reduced motion version
 * Removes transforms and shortens duration
 * @param {Object} config - Original animation configuration
 * @returns {Object} Reduced motion animation configuration
 */
export const getReducedMotionConfig = (config) => {
  const { from, to, ...rest } = config
  
  // Only keep opacity, remove all transform properties
  const reducedFrom = {
    opacity: from.opacity
  }
  
  const reducedTo = {
    opacity: to.opacity,
    duration: 0.01, // Nearly instant
    ease: 'none'
  }
  
  return {
    from: reducedFrom,
    to: reducedTo,
    ...rest
  }
}

/**
 * Get slide-in animation configuration
 * @param {string} direction - Slide direction: 'left', 'right', 'up', 'down'
 * @param {Object} options - Animation options
 * @returns {Object} GSAP animation configuration
 */
export const getSlideInAnimation = (direction = 'left', options = {}) => {
  const {
    duration = 0.25,
    ease = easing.swift,
    distance = 100
  } = options

  const directionMap = {
    left: { x: -distance },
    right: { x: distance },
    up: { y: -distance },
    down: { y: distance }
  }

  return {
    from: {
      opacity: 0,
      ...directionMap[direction]
    },
    to: {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      ease
    }
  }
}

/**
 * Get scale animation configuration
 * @param {Object} options - Animation options
 * @returns {Object} GSAP animation configuration
 */
export const getScaleAnimation = (options = {}) => {
  const {
    from = 0.95,
    to = 1,
    duration = 0.3,
    ease = easing.gentle
  } = options

  return {
    from: {
      opacity: 0,
      scale: from
    },
    to: {
      opacity: 1,
      scale: to,
      duration,
      ease
    }
  }
}

/**
 * Get hover scale animation configuration
 * @param {Object} options - Animation options
 * @returns {Object} GSAP animation configuration
 */
export const getHoverScaleAnimation = (options = {}) => {
  const {
    scale = 1.02,
    duration = 0.2,
    ease = easing.gentle
  } = options

  return {
    scale,
    duration,
    ease
  }
}

/**
 * Apply animation with reduced motion check
 * @param {Function} animationFn - GSAP animation function
 * @param {Object} config - Animation configuration
 * @returns {Object} Animation instance or null
 */
export const applyAnimation = (animationFn, config) => {
  if (shouldReduceMotion()) {
    const reducedConfig = getReducedMotionConfig(config)
    return animationFn(reducedConfig)
  }
  return animationFn(config)
}

