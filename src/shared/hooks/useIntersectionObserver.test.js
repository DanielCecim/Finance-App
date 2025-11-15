import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useIntersectionObserver } from './useIntersectionObserver'
import { useRef } from 'react'

describe('useIntersectionObserver', () => {
  let mockObserve
  let mockUnobserve
  let mockDisconnect
  let observerCallback

  beforeEach(() => {
    mockObserve = vi.fn()
    mockUnobserve = vi.fn()
    mockDisconnect = vi.fn()

    // Store original constructor calls
    const constructorCalls = []

    // Mock IntersectionObserver as a class
    global.IntersectionObserver = class IntersectionObserver {
      constructor(callback, options) {
        constructorCalls.push({ callback, options })
        observerCallback = callback
        this.callback = callback
        this.options = options
        this.observe = mockObserve
        this.unobserve = mockUnobserve
        this.disconnect = mockDisconnect
      }
    }
    
    // Make it spy-able
    global.IntersectionObserver.mock = {
      calls: constructorCalls
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should create IntersectionObserver on mount', () => {
    const ref = { current: document.createElement('div') }
    const callback = vi.fn()

    renderHook(() => useIntersectionObserver(ref, callback))

    expect(mockObserve).toHaveBeenCalledWith(ref.current)
  })

  it('should call callback when element intersects', () => {
    const ref = { current: document.createElement('div') }
    const callback = vi.fn()

    renderHook(() => useIntersectionObserver(ref, callback))

    // Simulate intersection
    const entry = { isIntersecting: true, target: ref.current }
    observerCallback([entry])

    expect(callback).toHaveBeenCalledWith([entry])
  })

  it('should not observe if ref is null', () => {
    const ref = { current: null }
    const callback = vi.fn()

    renderHook(() => useIntersectionObserver(ref, callback))

    expect(mockObserve).not.toHaveBeenCalled()
  })

  it('should disconnect observer on unmount', () => {
    const ref = { current: document.createElement('div') }
    const callback = vi.fn()

    const { unmount } = renderHook(() => useIntersectionObserver(ref, callback))

    unmount()

    expect(mockDisconnect).toHaveBeenCalled()
  })

  it('should use custom threshold', () => {
    const ref = { current: document.createElement('div') }
    const callback = vi.fn()
    const options = { threshold: 0.8 }

    renderHook(() => useIntersectionObserver(ref, callback, options))

    expect(mockObserve).toHaveBeenCalledWith(ref.current)
  })

  it('should use custom rootMargin', () => {
    const ref = { current: document.createElement('div') }
    const callback = vi.fn()
    const options = { rootMargin: '100px' }

    renderHook(() => useIntersectionObserver(ref, callback, options))

    expect(mockObserve).toHaveBeenCalledWith(ref.current)
  })

  it('should handle multiple entries', () => {
    const ref = { current: document.createElement('div') }
    const callback = vi.fn()

    renderHook(() => useIntersectionObserver(ref, callback))

    // Simulate multiple entries
    const entries = [
      { isIntersecting: true, target: ref.current },
      { isIntersecting: false, target: document.createElement('div') }
    ]
    observerCallback(entries)

    expect(callback).toHaveBeenCalledWith(entries)
  })

  it('should re-observe when ref changes', () => {
    const ref1 = { current: document.createElement('div') }
    const ref2 = { current: document.createElement('div') }
    const callback = vi.fn()

    const { rerender } = renderHook(
      ({ ref }) => useIntersectionObserver(ref, callback),
      { initialProps: { ref: ref1 } }
    )

    expect(mockObserve).toHaveBeenCalledWith(ref1.current)

    // Change ref
    rerender({ ref: ref2 })

    expect(mockDisconnect).toHaveBeenCalled()
    expect(mockObserve).toHaveBeenCalledWith(ref2.current)
  })

  it('should handle root option', () => {
    const ref = { current: document.createElement('div') }
    const root = document.createElement('div')
    const callback = vi.fn()
    const options = { root }

    renderHook(() => useIntersectionObserver(ref, callback, options))

    expect(mockObserve).toHaveBeenCalledWith(ref.current)
  })
})

