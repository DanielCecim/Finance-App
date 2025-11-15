import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useScrollAnimation } from './useScrollAnimation'

// Mock GSAP
vi.mock('gsap', () => ({
  gsap: {
    fromTo: vi.fn(() => ({
      kill: vi.fn()
    })),
    to: vi.fn(() => ({
      kill: vi.fn()
    })),
    from: vi.fn(() => ({
      kill: vi.fn()
    }))
  }
}))

import { gsap } from 'gsap'

describe('useScrollAnimation', () => {
  let mockObserve
  let mockUnobserve
  let mockDisconnect
  let observerCallback

  beforeEach(() => {
    mockObserve = vi.fn()
    mockUnobserve = vi.fn()
    mockDisconnect = vi.fn()

    // Mock IntersectionObserver as a class
    global.IntersectionObserver = class IntersectionObserver {
      constructor(callback, options) {
        observerCallback = callback
        this.callback = callback
        this.options = options
        this.observe = mockObserve
        this.unobserve = mockUnobserve
        this.disconnect = mockDisconnect
      }
    }

    // Reset matchMedia mock (no reduced motion)
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize without errors', () => {
    const ref = { current: document.createElement('div') }

    const { result } = renderHook(() => useScrollAnimation(ref))

    expect(result.current).toBeUndefined()
  })

  it('should create IntersectionObserver with ref', () => {
    const ref = { current: document.createElement('div') }

    renderHook(() => useScrollAnimation(ref))

    expect(mockObserve).toHaveBeenCalledWith(ref.current)
  })

  it('should trigger animation when element enters viewport', () => {
    const ref = { current: document.createElement('div') }

    renderHook(() => useScrollAnimation(ref))

    // Simulate element entering viewport
    observerCallback([{ isIntersecting: true, target: ref.current }])

    expect(gsap.fromTo).toHaveBeenCalledWith(
      ref.current,
      expect.objectContaining({ opacity: 0, y: 20 }),
      expect.objectContaining({ opacity: 1, y: 0 })
    )
  })

  it('should not trigger animation when element is not intersecting', () => {
    const ref = { current: document.createElement('div') }

    renderHook(() => useScrollAnimation(ref))

    // Simulate element NOT in viewport
    observerCallback([{ isIntersecting: false, target: ref.current }])

    expect(gsap.fromTo).not.toHaveBeenCalled()
  })

  it('should cleanup on unmount', () => {
    const ref = { current: document.createElement('div') }

    const { unmount } = renderHook(() => useScrollAnimation(ref))

    unmount()

    expect(mockDisconnect).toHaveBeenCalled()
  })

  it('should accept custom animation config', () => {
    const ref = { current: document.createElement('div') }
    const config = {
      from: { opacity: 0, x: -50 },
      to: { opacity: 1, x: 0, duration: 1.2 }
    }

    renderHook(() => useScrollAnimation(ref, config))

    observerCallback([{ isIntersecting: true, target: ref.current }])

    expect(gsap.fromTo).toHaveBeenCalledWith(
      ref.current,
      config.from,
      config.to
    )
  })

  it('should respect reduced motion preference', () => {
    // Enable reduced motion
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion: reduce'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))

    const ref = { current: document.createElement('div') }

    renderHook(() => useScrollAnimation(ref))

    observerCallback([{ isIntersecting: true, target: ref.current }])

    // Should animate with very short duration
    expect(gsap.fromTo).toHaveBeenCalledWith(
      ref.current,
      expect.objectContaining({ opacity: 0 }),
      expect.objectContaining({ 
        opacity: 1,
        duration: 0.01
      })
    )
  })

  it('should use custom threshold', () => {
    const ref = { current: document.createElement('div') }
    const options = { threshold: 0.5 }

    renderHook(() => useScrollAnimation(ref, null, options))

    expect(mockObserve).toHaveBeenCalledWith(ref.current)
  })

  it('should handle null ref gracefully', () => {
    const ref = { current: null }

    expect(() => {
      renderHook(() => useScrollAnimation(ref))
    }).not.toThrow()

    expect(mockObserve).not.toHaveBeenCalled()
  })

  it('should handle array of refs for stagger animation', () => {
    const refs = [
      { current: document.createElement('div') },
      { current: document.createElement('div') },
      { current: document.createElement('div') }
    ]

    renderHook(() => useScrollAnimation(refs, { stagger: true }))

    // Simulate first element entering viewport
    observerCallback([{ isIntersecting: true, target: refs[0].current }])

    // Should animate all elements with stagger
    expect(gsap.fromTo).toHaveBeenCalled()
  })

  it('should only animate once by default', () => {
    const ref = { current: document.createElement('div') }

    renderHook(() => useScrollAnimation(ref))

    // Trigger animation first time
    observerCallback([{ isIntersecting: true, target: ref.current }])
    expect(gsap.fromTo).toHaveBeenCalledTimes(1)

    // Try to trigger again
    observerCallback([{ isIntersecting: true, target: ref.current }])
    expect(gsap.fromTo).toHaveBeenCalledTimes(1) // Still just once
  })

  it('should animate multiple times if repeat option is true', () => {
    const ref = { current: document.createElement('div') }

    renderHook(() => useScrollAnimation(ref, null, { repeat: true }))

    // Trigger animation first time
    observerCallback([{ isIntersecting: true, target: ref.current }])
    expect(gsap.fromTo).toHaveBeenCalledTimes(1)

    // Trigger again
    observerCallback([{ isIntersecting: true, target: ref.current }])
    expect(gsap.fromTo).toHaveBeenCalledTimes(2)
  })

  it('should kill existing animation on cleanup', () => {
    const mockAnimation = { kill: vi.fn() }
    gsap.fromTo.mockReturnValue(mockAnimation)

    const ref = { current: document.createElement('div') }

    const { unmount } = renderHook(() => useScrollAnimation(ref))

    observerCallback([{ isIntersecting: true, target: ref.current }])

    unmount()

    expect(mockAnimation.kill).toHaveBeenCalled()
  })
})

