# Plan: Apple-Inspired Animations Implementation

- Date: 2025-11-14
- Time: 1530 (Europe/Madrid)
- Context: apple-animations
- Author: Agent

## Goal

Implement smooth, professional animations inspired by Apple's main website to enhance user experience in the FinanceLocal finance dashboard application. Focus on:
- Smooth scroll-based animations
- Elegant component transitions
- Micro-interactions on key UI elements
- Performance-optimized animations that don't impact dashboard functionality

## Research Findings

Based on analysis of Apple's website animation techniques:

1. **GSAP (GreenSock Animation Platform)**: Industry-standard animation library used by Apple
   - High-performance timeline-based animations
   - Scroll-triggered animations
   - Smooth easing functions

2. **CSS Animations**: Hardware-accelerated transforms and transitions
   - Transform properties (translate, scale, opacity)
   - Smooth transitions on state changes

3. **Intersection Observer API**: Trigger animations when elements enter viewport
   - Efficient performance
   - Native browser support

## Impacted Files/Modules

### New Dependencies
- `package.json`: Add GSAP and related plugins

### Components to Enhance
1. **Dashboard.jsx / Dashboard.css**
   - Fade-in animations for metric cards
   - Staggered entrance animations for dashboard elements

2. **KeyMetrics.jsx / KeyMetrics.css**
   - Number counter animations
   - Smooth card hover effects

3. **PriceChart.jsx / PriceChart.css**
   - Chart entrance animation
   - Smooth data updates

4. **StockSearch.jsx / StockSearch.css**
   - Search bar focus animations
   - Results dropdown animations

5. **ChatSidebar.jsx / ChatSidebar.css**
   - Slide-in/out animations
   - Message appearance animations

6. **ChatMessage.jsx / ChatMessage.css**
   - Message bubble entrance animations
   - Typing indicator animation

7. **App.css / global.css**
   - Base animation utilities
   - Smooth page transitions

### New Utility Files
- `src/shared/utils/animations.js`: Reusable animation configurations
- `src/shared/hooks/useScrollAnimation.js`: Custom hook for scroll-based animations
- `src/shared/hooks/useIntersectionObserver.js`: Custom hook for viewport detection

## Test Plan

### Unit Tests (Jest/Vitest)
- Test animation utility functions
- Test custom hooks with mocked Intersection Observer
- Verify animation cleanup on component unmount

### Integration Tests
- Test component rendering with animations
- Verify animations don't break existing functionality
- Test animation performance (no janky frames)

### Visual Regression Tests
- Capture screenshots of animated states
- Verify animations complete successfully

### Edge Cases
- Reduced motion preference (prefers-reduced-motion)
- Low-performance devices
- Animations with rapid component mounting/unmounting
- Multiple simultaneous animations

### Negative Paths
- Missing GSAP library (graceful degradation)
- Browser without Intersection Observer support
- Animation conflicts with existing styles

### Coverage Target
- ≥80% for new animation utilities
- Maintain existing coverage for modified components

## Implementation Phases

### Phase 1: Setup & Foundation
1. Install GSAP and plugins (`gsap`, `@gsap/react`)
2. Create animation utility functions
3. Create custom hooks for scroll animations
4. Add accessibility support (respect prefers-reduced-motion)

### Phase 2: Dashboard Animations
1. Add fade-in animations for Dashboard container
2. Staggered entrance for KeyMetrics cards
3. Number counter animations for metric values
4. Chart entrance animations

### Phase 3: Interactive Elements
1. Search bar focus/blur animations
2. Button hover and click feedback
3. Dropdown/select animations
4. Input field interactions

### Phase 4: Chat Interface
1. Sidebar slide-in/out animations
2. Message bubble entrance (staggered)
3. Typing indicator animation
4. Scroll-to-bottom smooth animation

### Phase 5: Polish & Optimization
1. Performance testing and optimization
2. Cross-browser testing
3. Accessibility audit
4. Documentation

## Animation Specifications

### Timing Functions (Apple-style)
```javascript
const easing = {
  smooth: 'power2.out',
  swift: 'power3.inOut',
  gentle: 'power1.out',
  bounce: 'back.out(1.2)'
}
```

### Duration Standards
- Quick interactions: 0.2-0.3s
- Card/component entrances: 0.4-0.6s
- Page transitions: 0.6-0.8s
- Scroll animations: 0.8-1.2s

### Key Animation Types
1. **Fade In**: Opacity 0 → 1, translateY(20px) → 0
2. **Stagger**: Sequential delays (0.1s between items)
3. **Scale**: Scale(0.95) → 1 on hover
4. **Number Counter**: Animated value interpolation
5. **Slide**: translateX(-100%) → 0 for sidebar

## Risks & Roll-back

### Risks
1. **Performance Impact**: Animations may affect dashboard performance
   - Mitigation: Use hardware-accelerated properties only (transform, opacity)
   - Mitigation: Test on low-end devices

2. **Bundle Size**: GSAP adds ~50KB gzipped
   - Mitigation: Use tree-shaking with named imports
   - Mitigation: Lazy-load animation features

3. **Accessibility**: Motion may cause discomfort for some users
   - Mitigation: Respect `prefers-reduced-motion` media query
   - Mitigation: Provide toggle in settings

4. **Browser Compatibility**: Older browsers may not support features
   - Mitigation: Feature detection and graceful degradation
   - Mitigation: Polyfills for Intersection Observer if needed

5. **Breaking Changes**: Modifying existing components may introduce bugs
   - Mitigation: Test-first approach
   - Mitigation: Incremental rollout per component

### Roll-back Plan
1. All changes are in feature branch
2. Animation utilities are isolated - can be disabled via feature flag
3. CSS animations are opt-in via classes - easy to remove
4. Git revert to commit before animation implementation
5. No database or API changes - safe to rollback

## Success Criteria

- [ ] All animations run at 60fps on target devices
- [ ] Respect user's motion preferences
- [ ] No breaking changes to existing functionality
- [ ] Test coverage ≥80% for new code
- [ ] Bundle size increase <100KB
- [ ] All animations complete smoothly without jank
- [ ] Positive user feedback on UI feel

## Commands to Run

### Install Dependencies
```bash
cd FinanceApp
npm install gsap @gsap/react
```

### Run Tests (after implementation)
```bash
npm test                  # Run test suite
npm run lint             # Check code quality
npm run build            # Verify build succeeds
```

### Development
```bash
npm run dev              # Start dev server with HMR
```

## Next Steps

1. **Approval Checkpoint**: Await explicit approval to proceed
2. **Test Design**: Create detailed test specifications
3. **Implementation**: Follow TDD approach (tests first)
4. **Validation**: Run full test suite
5. **Pre-commit Review**: Prepare packet for approval

## Questions for Review

1. Are there specific animations from Apple's site you want to prioritize?
2. Should we implement a user preference toggle for animations?
3. Any specific components that should NOT have animations?
4. Performance targets: target devices/browsers?
5. Timeline: Is this a single sprint or multiple iterations?

