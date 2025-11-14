# Test Plan: Apple-Inspired Animations

- Date: 2025-11-14
- Time: 1530 (Europe/Madrid)
- Context: apple-animations
- Author: Agent

## Overview

Comprehensive test strategy for implementing Apple-style animations in the FinanceLocal dashboard. Following TDD principles: write failing tests first, then implement to make them pass.

## Test Framework Detection

**Current Stack:**
- React 18.3.1
- Vite 5.1.4
- No test framework currently configured

**Proposed Test Setup:**
- **Vitest**: Fast Vite-native test runner (better integration than Jest)
- **@testing-library/react**: React component testing utilities
- **@testing-library/jest-dom**: Custom matchers
- **@testing-library/user-event**: User interaction simulation
- **happy-dom** or **jsdom**: DOM environment for tests

## Test Structure

```
FinanceApp/
├── src/
│   └── __tests__/              # Test files mirror source structure
│       ├── shared/
│       │   ├── utils/
│       │   │   └── animations.test.js
│       │   └── hooks/
│       │       ├── useScrollAnimation.test.js
│       │       └── useIntersectionObserver.test.js
│       └── features/
│           ├── dashboard/
│           │   └── components/
│           │       ├── Dashboard.test.jsx
│           │       ├── KeyMetrics.test.jsx
│           │       └── PriceChart.test.jsx
│           └── chat/
│               └── components/
│                   ├── ChatSidebar.test.jsx
│                   └── ChatMessage.test.jsx
└── vitest.config.js
```

## Unit Tests

### 1. Animation Utilities (`src/shared/utils/animations.test.js`)

#### Test Cases:

**TC-ANIM-001: getFadeInAnimation**
- **Given**: Default parameters
- **When**: getFadeInAnimation() is called
- **Then**: Returns GSAP animation config with opacity 0→1, y: 20→0, duration 0.6s

**TC-ANIM-002: getStaggerAnimation**
- **Given**: Array of 5 elements
- **When**: getStaggerAnimation(elements) is called
- **Then**: Returns config with stagger delay of 0.1s between items

**TC-ANIM-003: getNumberCounterAnimation**
- **Given**: Start value 0, end value 1000
- **When**: getNumberCounterAnimation(0, 1000, callback) is called
- **Then**: Callback receives interpolated values from 0 to 1000

**TC-ANIM-004: Animation easing constants**
- **Given**: Easing object imported
- **When**: Access easing.smooth, easing.swift, easing.gentle
- **Then**: Returns proper GSAP easing strings

**TC-ANIM-005: shouldReduceMotion utility**
- **Given**: prefers-reduced-motion: reduce media query matches
- **When**: shouldReduceMotion() is called
- **Then**: Returns true

**TC-ANIM-006: shouldReduceMotion utility (no preference)**
- **Given**: prefers-reduced-motion: no-preference
- **When**: shouldReduceMotion() is called
- **Then**: Returns false

**TC-ANIM-007: getReducedMotionConfig**
- **Given**: Motion reduction enabled
- **When**: getReducedMotionConfig(animationConfig) is called
- **Then**: Returns config with duration: 0.01, no transforms

### 2. useScrollAnimation Hook (`src/shared/hooks/useScrollAnimation.test.js`)

#### Test Cases:

**TC-HOOK-001: Initialize with ref**
- **Given**: Component with ref
- **When**: useScrollAnimation(ref, config) is called
- **Then**: Hook initializes without errors

**TC-HOOK-002: Trigger animation on scroll**
- **Given**: Element scrolled into view
- **When**: Intersection observer fires
- **Then**: Animation triggers on element

**TC-HOOK-003: Cleanup on unmount**
- **Given**: Component using hook
- **When**: Component unmounts
- **Then**: Intersection observer disconnects, animations killed

**TC-HOOK-004: Respect reduced motion**
- **Given**: prefers-reduced-motion: reduce
- **When**: useScrollAnimation is initialized
- **Then**: No animations are created

**TC-HOOK-005: Multiple elements with stagger**
- **Given**: Array of refs
- **When**: useScrollAnimation(refsArray, { stagger: true })
- **Then**: Elements animate with stagger delay

**TC-HOOK-006: Custom threshold**
- **Given**: threshold: 0.5 config
- **When**: Hook initializes
- **Then**: Intersection observer uses 50% threshold

### 3. useIntersectionObserver Hook (`src/shared/hooks/useIntersectionObserver.test.js`)

#### Test Cases:

**TC-IO-001: Observe single element**
- **Given**: Ref to element
- **When**: useIntersectionObserver(ref, callback) is called
- **Then**: Observer is created and observes element

**TC-IO-002: Callback fires on intersection**
- **Given**: Element intersects viewport
- **When**: Intersection occurs
- **Then**: Callback is called with entry data

**TC-IO-003: Cleanup on unmount**
- **Given**: Active observer
- **When**: Component unmounts
- **Then**: Observer disconnects

**TC-IO-004: Custom options**
- **Given**: Options { threshold: 0.8, rootMargin: '100px' }
- **When**: Hook initializes
- **Then**: Observer uses custom options

**TC-IO-005: Re-observe on ref change**
- **Given**: Ref changes to new element
- **When**: Ref updates
- **Then**: Observer stops old element, observes new one

## Integration Tests

### 4. Dashboard Component (`src/features/dashboard/components/Dashboard.test.jsx`)

#### Test Cases:

**TC-DASH-001: Dashboard renders without animation errors**
- **Given**: Dashboard component
- **When**: Mounted
- **Then**: All child components render, no console errors

**TC-DASH-002: Dashboard fade-in animation**
- **Given**: Dashboard component
- **When**: Component enters viewport
- **Then**: Dashboard container fades in over 0.6s

**TC-DASH-003: Maintains existing functionality**
- **Given**: Dashboard with animations
- **When**: User interacts with existing features
- **Then**: All features work as before (data fetch, display, etc.)

**TC-DASH-004: Reduced motion mode**
- **Given**: prefers-reduced-motion: reduce
- **When**: Dashboard renders
- **Then**: No animations play, instant display

### 5. KeyMetrics Component (`src/features/dashboard/components/KeyMetrics.test.jsx`)

#### Test Cases:

**TC-METRICS-001: Metric cards stagger animation**
- **Given**: 4 metric cards
- **When**: Component enters viewport
- **Then**: Cards animate in with 0.1s stagger between each

**TC-METRICS-002: Number counter animation**
- **Given**: Metric value changes from 100 to 500
- **When**: Data updates
- **Then**: Number animates from 100→500 over 0.8s

**TC-METRICS-003: Hover scale animation**
- **Given**: Metric card
- **When**: User hovers over card
- **Then**: Card scales to 1.02 smoothly

**TC-METRICS-004: Hover animation cleanup**
- **Given**: Hovered card
- **When**: Mouse leaves
- **Then**: Card scales back to 1.0

**TC-METRICS-005: No animation on rapid data updates**
- **Given**: Data updates every 100ms
- **When**: Multiple rapid updates occur
- **Then**: Animation doesn't restart, shows latest value

### 6. PriceChart Component (`src/features/dashboard/components/PriceChart.test.jsx`)

#### Test Cases:

**TC-CHART-001: Chart container fade-in**
- **Given**: Chart component
- **When**: Component mounts
- **Then**: Chart fades in over 0.6s

**TC-CHART-002: Chart data updates smoothly**
- **Given**: Chart with initial data
- **When**: New data arrives
- **Then**: Chart updates without jarring transitions

**TC-CHART-003: Maintain Plotly functionality**
- **Given**: Animated chart
- **When**: User interacts with Plotly controls
- **Then**: All Plotly features work normally

### 7. StockSearch Component (`src/features/dashboard/components/StockSearch.test.jsx`)

#### Test Cases:

**TC-SEARCH-001: Search input focus animation**
- **Given**: Search input
- **When**: User focuses input
- **Then**: Input border color transitions, scale: 1.01

**TC-SEARCH-002: Results dropdown animation**
- **Given**: Search results available
- **When**: Results appear
- **Then**: Dropdown slides down and fades in

**TC-SEARCH-003: Results list stagger**
- **Given**: 10 search results
- **When**: Dropdown opens
- **Then**: Results animate in with stagger

**TC-SEARCH-004: Search functionality preserved**
- **Given**: Animated search
- **When**: User types and selects result
- **Then**: Search works as before

### 8. ChatSidebar Component (`src/features/chat/components/ChatSidebar.test.jsx`)

#### Test Cases:

**TC-SIDEBAR-001: Sidebar slide-in animation**
- **Given**: Sidebar hidden
- **When**: Sidebar opens
- **Then**: Slides in from left over 0.4s

**TC-SIDEBAR-002: Sidebar slide-out animation**
- **Given**: Sidebar open
- **When**: User closes sidebar
- **Then**: Slides out to left over 0.4s

**TC-SIDEBAR-003: Chat history functionality**
- **Given**: Animated sidebar
- **When**: User interacts with chat history
- **Then**: All existing features work

**TC-SIDEBAR-004: Toggle button animation**
- **Given**: Toggle button
- **When**: User clicks
- **Then**: Button provides visual feedback

### 9. ChatMessage Component (`src/features/chat/components/ChatMessage.test.jsx`)

#### Test Cases:

**TC-MESSAGE-001: Message bubble entrance**
- **Given**: New message received
- **When**: Message added to chat
- **Then**: Message fades in and slides up

**TC-MESSAGE-002: Multiple messages stagger**
- **Given**: 5 messages arrive together
- **When**: Messages render
- **Then**: Animate in with 0.05s stagger

**TC-MESSAGE-003: Typing indicator animation**
- **Given**: Bot is typing
- **When**: Typing indicator shows
- **Then**: Dots animate in sequence (pulse effect)

**TC-MESSAGE-004: Message functionality preserved**
- **Given**: Animated messages
- **When**: Messages display
- **Then**: Content renders correctly, no layout issues

## Edge Cases

### EC-001: Rapid Component Mount/Unmount
- **Given**: Component with animation
- **When**: Mounted and unmounted rapidly (< animation duration)
- **Then**: No memory leaks, animations properly cleaned up

### EC-002: Multiple Simultaneous Animations
- **Given**: Dashboard loads with all components
- **When**: All animations trigger at once
- **Then**: No performance degradation, 60fps maintained

### EC-003: Browser Tab Backgrounded
- **Given**: Animations running
- **When**: User switches tabs
- **Then**: Animations pause/complete gracefully, no issues on return

### EC-004: Resize During Animation
- **Given**: Animation in progress
- **When**: Window resizes
- **Then**: Animation adapts or completes without visual glitches

### EC-005: Slow Network
- **Given**: Component waiting for data
- **When**: Data arrives late (after mount animation)
- **Then**: Content updates smoothly without re-triggering entrance animation

### EC-006: Very Large Datasets
- **Given**: 100+ metric cards or chat messages
- **When**: Stagger animation applies
- **Then**: Animation either limits stagger or uses batching

### EC-007: GSAP Fails to Load
- **Given**: GSAP import fails or CDN down
- **When**: Component tries to animate
- **Then**: Graceful fallback to instant display, no crashes

## Negative Paths

### NP-001: Invalid Animation Config
- **Given**: Invalid parameters passed to animation utils
- **When**: Function called with wrong types
- **Then**: Function returns safe defaults or throws descriptive error

### NP-002: Null Ref Passed to Hook
- **Given**: useScrollAnimation(null, config)
- **When**: Hook initializes
- **Then**: Hook handles gracefully, no crashes

### NP-003: Intersection Observer Unsupported
- **Given**: Browser without Intersection Observer
- **When**: useIntersectionObserver initializes
- **Then**: Polyfill loaded or graceful degradation to instant display

### NP-004: Animation on Detached Element
- **Given**: Element removed from DOM during animation
- **When**: Animation attempts to run
- **Then**: Animation fails silently, no errors

### NP-005: Conflicting CSS Animations
- **Given**: Element has both CSS and GSAP animations
- **When**: Both trigger
- **Then**: GSAP takes precedence or conflicts resolved gracefully

## Performance Tests

### PERF-001: Animation Frame Rate
- **Requirement**: All animations maintain ≥55fps (targeting 60fps)
- **Test**: Use Chrome DevTools Performance tab, record animation sequences
- **Pass Criteria**: No dropped frames during animations

### PERF-002: Memory Usage
- **Requirement**: No memory leaks from animations
- **Test**: Mount/unmount components 100 times, measure heap
- **Pass Criteria**: Memory returns to baseline ±10%

### PERF-003: Bundle Size Impact
- **Requirement**: Total bundle increase <100KB gzipped
- **Test**: Build before/after, compare dist/ sizes
- **Pass Criteria**: GSAP + utils < 100KB gzipped

### PERF-004: Initial Load Time
- **Requirement**: Animations don't delay first meaningful paint
- **Test**: Lighthouse audit before/after
- **Pass Criteria**: FCP and LCP within 5% of baseline

### PERF-005: CPU Usage During Animations
- **Requirement**: Low CPU usage on mid-range devices
- **Test**: Record CPU throttling in DevTools (4x slowdown)
- **Pass Criteria**: Animations remain smooth, no UI blocking

## Accessibility Tests

### A11Y-001: Reduced Motion Preference
- **Test**: Enable prefers-reduced-motion in browser/OS
- **Expected**: All animations disabled or reduced to <0.1s duration
- **Verify**: Manual testing + automated a11y audit

### A11Y-002: Keyboard Navigation During Animations
- **Test**: Tab through interactive elements while animating
- **Expected**: Focus states work correctly, no focus traps
- **Verify**: Manual keyboard testing

### A11Y-003: Screen Reader Compatibility
- **Test**: Use NVDA/JAWS with animations enabled
- **Expected**: Content announced correctly, no delayed announcements
- **Verify**: Manual testing with screen readers

### A11Y-004: Animation Toggle Setting
- **Test**: Provide user setting to disable animations
- **Expected**: Setting persists, fully disables animations
- **Verify**: Integration test for setting storage and application

## Coverage Targets

### Minimum Coverage Requirements:
- **Animation utilities**: ≥90% (pure functions, easy to test)
- **Custom hooks**: ≥85% (core animation logic)
- **Component animations**: ≥80% (integration with existing components)
- **Overall project**: Maintain or improve current baseline

### Coverage Reports:
```bash
npm run test:coverage
```

Report location: `coverage/lcov-report/index.html`

## Test Commands

### Install Test Dependencies
```bash
cd FinanceApp
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event happy-dom @vitest/ui
```

### Run Tests
```bash
npm test                          # Run all tests
npm test -- --watch              # Watch mode
npm test -- --coverage           # With coverage
npm test -- animations.test      # Run specific test file
npm run test:ui                  # Open Vitest UI
```

### Configuration File
Create `vitest.config.js`:
```javascript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['node_modules/', 'src/test/']
    }
  }
})
```

## Test Execution Order

1. **Phase 1: Utilities & Hooks** (Foundation)
   - animations.test.js
   - useIntersectionObserver.test.js
   - useScrollAnimation.test.js

2. **Phase 2: Core Components** (Dashboard)
   - Dashboard.test.jsx
   - KeyMetrics.test.jsx
   - PriceChart.test.jsx

3. **Phase 3: Interactive Elements** (Search & Inputs)
   - StockSearch.test.jsx
   - Button.test.jsx (if animated)

4. **Phase 4: Chat Components**
   - ChatSidebar.test.jsx
   - ChatMessage.test.jsx

5. **Phase 5: Integration & Performance**
   - Full app integration tests
   - Performance benchmarks
   - Accessibility audits

## Mock Requirements

### GSAP Mocks
```javascript
// For unit tests where GSAP behavior isn't critical
vi.mock('gsap', () => ({
  gsap: {
    to: vi.fn(),
    from: vi.fn(),
    fromTo: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn(),
      from: vi.fn()
    }))
  }
}))
```

### Intersection Observer Mock
```javascript
// Mock for browsers/test environments without IO
class IntersectionObserverMock {
  constructor(callback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.IntersectionObserver = IntersectionObserverMock
```

### matchMedia Mock (for prefers-reduced-motion)
```javascript
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: query.includes('prefers-reduced-motion: reduce'),
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

## Success Criteria

- [ ] All test files created following naming conventions
- [ ] 100% of test cases have clear Given/When/Then structure
- [ ] Edge cases and negative paths covered
- [ ] Performance benchmarks defined
- [ ] Accessibility requirements specified
- [ ] Mock requirements documented
- [ ] Test commands verified
- [ ] Coverage targets set (≥80% for new code)
- [ ] All tests initially failing (TDD: red phase)

## Next Steps After Approval

1. Install test dependencies
2. Create test configuration (vitest.config.js, setup files)
3. Write failing tests for Phase 1 (utilities & hooks)
4. Implement utilities to make tests pass
5. Continue TDD cycle for each phase
6. Run full test suite before pre-commit

## Notes

- Tests will initially FAIL (red phase of TDD)
- This is expected and desired
- Implementation will make them pass (green phase)
- Then refactor for quality (refactor phase)

