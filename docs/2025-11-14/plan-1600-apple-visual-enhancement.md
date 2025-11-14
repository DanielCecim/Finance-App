# Plan: Apple-Inspired Visual Enhancement

- Date: 2025-11-14
- Time: 1600 (Europe/Madrid)
- Context: apple-visual-enhancement
- Author: Agent

## Goal

Transform the entire FinanceLocal frontend with Apple's premium design aesthetic:
- Clean, minimalist interface with ample white space
- Premium typography (SF Pro-inspired fonts)
- Sophisticated color palette with depth
- Glass morphism and blur effects
- Elegant shadows and gradients
- Modern, responsive design
- Smooth micro-interactions

## Apple Design Principles to Implement

### 1. Typography
- **Large, bold headlines** (48-64px)
- **SF Pro Display** style (use system fonts: -apple-system, BlinkMacSystemFont)
- **Weight hierarchy**: 700 for headers, 600 for subheads, 400 for body
- **Letter spacing**: Tight for headlines (-0.5px), normal for body
- **Line height**: 1.2 for headlines, 1.6 for body

### 2. Color Palette
- **Background**: Pure white (#FFFFFF) or very light gray (#F5F5F7)
- **Surface**: White with subtle shadow or glass effect
- **Text**: Near-black (#1D1D1F) for primary, gray (#86868B) for secondary
- **Accent**: Apple blue (#0071E3) or custom brand color
- **Success**: Green (#30D158)
- **Danger**: Red (#FF3B30)
- **Gradients**: Subtle, sophisticated (not bright)

### 3. Spacing & Layout
- **Generous padding**: 24-48px sections
- **Max content width**: 980-1200px centered
- **Grid gaps**: 16-24px
- **Component spacing**: 32-64px between sections

### 4. Visual Effects
- **Glass morphism**: backdrop-filter: blur(20px)
- **Soft shadows**: 0 8px 24px rgba(0,0,0,0.08)
- **Hover effects**: Subtle scale (1.02) and brightness
- **Border radius**: 12-18px for cards
- **Gradients**: Linear, subtle, directional

### 5. Components Style
- **Cards**: White background, soft shadow, rounded corners
- **Buttons**: Solid with hover lift effect
- **Inputs**: Minimal border, focus ring effect
- **Charts**: Clean, colorful, with smooth transitions

## Files to Enhance

### Global Styles
1. **src/styles/global.css** - Complete redesign with CSS variables

### Component Styles (Priority Order)
1. **Dashboard.css** - Main container, layout, hero section
2. **KeyMetrics.css** - Card design, glassmorphism
3. **PriceChart.css** - Chart container styling
4. **StockSearch.css** - Premium input field
5. **ChatSidebar.css** - Sidebar with blur effect
6. **Button.css** - Apple-style buttons
7. **Input.css** - Clean, minimal inputs

### New Visual Elements
- Gradient backgrounds
- Glass effect overlays
- Floating elements
- Smooth transitions everywhere
- Loading states with skeleton screens

## Implementation Approach

### Phase 1: Foundation (Global Styles)
- Update CSS variables with Apple-inspired palette
- Set up typography scale
- Add utility classes for common patterns

### Phase 2: Core Components
- Dashboard hero section
- KeyMetrics cards with glass effect
- Chart containers with shadows

### Phase 3: Interactive Elements
- Buttons with hover effects
- Inputs with focus states
- Sidebar with blur overlay

### Phase 4: Polish
- Add micro-animations
- Gradient accents
- Loading states
- Error states

## Success Criteria

- [ ] Premium, professional appearance
- [ ] Consistent design system
- [ ] Responsive on all devices
- [ ] 60fps animations
- [ ] Accessibility maintained
- [ ] All tests still passing
- [ ] No performance degradation

## Commands

```bash
# Run development server to preview
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Build for production
npm run build
```

## Next Steps

1. Update global CSS with Apple design system
2. Enhance Dashboard with hero section
3. Add glassmorphism to KeyMetrics
4. Update all component styles
5. Test responsive design
6. Prepare pre-commit packet

