import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getFadeInAnimation,
  getStaggerAnimation,
  getNumberCounterAnimation,
  shouldReduceMotion,
  getReducedMotionConfig,
  easing
} from './animations'

describe('Animation Utilities', () => {
  beforeEach(() => {
    // Reset matchMedia mock
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })

  describe('getFadeInAnimation', () => {
    it('should return default fade-in animation config', () => {
      const config = getFadeInAnimation()
      
      expect(config).toBeDefined()
      expect(config.from).toEqual({
        opacity: 0,
        y: 20
      })
      expect(config.to).toEqual({
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    it('should accept custom duration', () => {
      const config = getFadeInAnimation({ duration: 1.2 })
      
      expect(config.to.duration).toBe(1.2)
    })

    it('should accept custom y offset', () => {
      const config = getFadeInAnimation({ y: 50 })
      
      expect(config.from.y).toBe(50)
    })

    it('should accept custom easing', () => {
      const config = getFadeInAnimation({ ease: 'power3.inOut' })
      
      expect(config.to.ease).toBe('power3.inOut')
    })
  })

  describe('getStaggerAnimation', () => {
    it('should return stagger config with default delay', () => {
      const config = getStaggerAnimation()
      
      expect(config).toBeDefined()
      expect(config.stagger).toBe(0.1)
    })

    it('should accept custom stagger delay', () => {
      const config = getStaggerAnimation(0.2)
      
      expect(config.stagger).toBe(0.2)
    })

    it('should include fade-in animation properties', () => {
      const config = getStaggerAnimation()
      
      expect(config.from).toEqual({
        opacity: 0,
        y: 20
      })
      expect(config.to).toMatchObject({
        opacity: 1,
        y: 0
      })
    })
  })

  describe('getNumberCounterAnimation', () => {
    it('should animate from start to end value', () => {
      const callback = vi.fn()
      const config = getNumberCounterAnimation(0, 1000, callback)
      
      expect(config).toBeDefined()
      expect(config.from).toEqual({ value: 0 })
      expect(config.to).toMatchObject({
        value: 1000,
        duration: 0.5
      })
    })

    it('should call callback with interpolated values', () => {
      const callback = vi.fn()
      const config = getNumberCounterAnimation(0, 100, callback)
      
      expect(config.to.onUpdate).toBeDefined()
      
      // Simulate GSAP calling onUpdate
      const mockTarget = { value: 50 }
      config.to.onUpdate.call(mockTarget)
      
      expect(callback).toHaveBeenCalledWith(50)
    })

    it('should accept custom duration', () => {
      const callback = vi.fn()
      const config = getNumberCounterAnimation(0, 1000, callback, { duration: 1.5 })
      
      expect(config.to.duration).toBe(1.5)
    })

    it('should handle negative numbers', () => {
      const callback = vi.fn()
      const config = getNumberCounterAnimation(-100, 100, callback)
      
      expect(config.from.value).toBe(-100)
      expect(config.to.value).toBe(100)
    })

    it('should handle decimal numbers', () => {
      const callback = vi.fn()
      const config = getNumberCounterAnimation(0, 99.99, callback)
      
      expect(config.to.value).toBe(99.99)
    })
  })

  describe('easing constants', () => {
    it('should export smooth easing', () => {
      expect(easing.smooth).toBe('power2.out')
    })

    it('should export swift easing', () => {
      expect(easing.swift).toBe('power3.inOut')
    })

    it('should export gentle easing', () => {
      expect(easing.gentle).toBe('power1.out')
    })

    it('should export bounce easing', () => {
      expect(easing.bounce).toBe('back.out(1.2)')
    })
  })

  describe('shouldReduceMotion', () => {
    it('should return false when prefers-reduced-motion is not set', () => {
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
      }))
      
      const result = shouldReduceMotion()
      
      expect(result).toBe(false)
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-reduced-motion: reduce)')
    })

    it('should return true when prefers-reduced-motion is reduce', () => {
      window.matchMedia = vi.fn().mockImplementation(query => ({
        matches: query.includes('prefers-reduced-motion: reduce'),
        media: query,
      }))
      
      const result = shouldReduceMotion()
      
      expect(result).toBe(true)
    })
  })

  describe('getReducedMotionConfig', () => {
    it('should return instant animation config when reduced motion is needed', () => {
      const originalConfig = {
        from: { opacity: 0, y: 20 },
        to: { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      }
      
      const config = getReducedMotionConfig(originalConfig)
      
      expect(config.to.duration).toBe(0.01)
      expect(config.from).toEqual({ opacity: 0 })
      expect(config.to.opacity).toBe(1)
      expect(config.to.y).toBeUndefined()
    })

    it('should preserve opacity transitions', () => {
      const originalConfig = {
        from: { opacity: 0, scale: 0.9 },
        to: { opacity: 1, scale: 1, duration: 0.5 }
      }
      
      const config = getReducedMotionConfig(originalConfig)
      
      expect(config.from.opacity).toBe(0)
      expect(config.to.opacity).toBe(1)
      expect(config.from.scale).toBeUndefined()
    })

    it('should remove transform properties', () => {
      const originalConfig = {
        from: { opacity: 0, x: -20, y: 20, scale: 0.95, rotate: 10 },
        to: { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, duration: 0.6 }
      }
      
      const config = getReducedMotionConfig(originalConfig)
      
      expect(config.from.x).toBeUndefined()
      expect(config.from.y).toBeUndefined()
      expect(config.from.scale).toBeUndefined()
      expect(config.from.rotate).toBeUndefined()
      expect(config.to.x).toBeUndefined()
      expect(config.to.y).toBeUndefined()
      expect(config.to.scale).toBeUndefined()
      expect(config.to.rotate).toBeUndefined()
    })
  })
})

