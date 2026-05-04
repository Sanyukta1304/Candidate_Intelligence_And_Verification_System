# CVIS Design System Guide

## Overview
This document outlines the complete design system for the Candidate Intelligence and Verification System (CVIS). All UI components and pages should strictly follow this system for consistency and professionalism.

---

## 1. Color Palette

### Primary Colors
- **Primary Teal**: `#0D9488` - Main brand color for CTAs, interactive elements
- **Primary Navy**: `#0F172A` - Used for headings and primary text

### Secondary Colors
- **Teal Light**: `#CCFBF1` - Background highlights, hover states
- **Slate Grey**: `#475569` - Body text and labels
- **Mild Grey**: `#F1F5F9` - Background for sections
- **White Primary**: `#FFFFFF` - Card backgrounds, primary surfaces

### Status Colors
- **Success**: Background `#DCFCE7`, Text `#15803d`
- **Warning**: Background `#FEF9C3`, Text `#ca8a04`
- **Error**: Background `#FEE2E2`, Text `#dc2626`
- **Neutral**: Background `#F1F5F9`, Text `#475569`

### Tailwind CSS Color Classes
```css
/* Primary */
bg-primary-teal, bg-primary-navy
text-primary-teal, text-primary-navy

/* Secondary */
bg-teal-light, bg-grey-mild, bg-white-primary
text-slate-grey, text-slate-300

/* Status */
bg-status-success, bg-status-warning, bg-status-error, bg-status-neutral
text-status-success-text, text-status-warning-text, text-status-error-text
```

---

## 2. Typography System

### Font Family
- **Primary**: Helvetica / Arial (system fonts as fallback)
- **Monospace**: Courier New (for code)

### Font Sizes & Styles

| Usage | Size | Weight | Color | CSS Class |
|-------|------|--------|-------|-----------|
| **H1** | 28px | 700 | Navy | `heading-1` |
| **H2** | 24px | 700 | Navy | `heading-2` |
| **H3** | 20px | 700 | Navy | `heading-3` |
| **H4** | 16px | 700 | Navy | `heading-4` |
| **Body** | 10px | 400 | Grey | `body-text` |
| **Label** | 8px | 700 | Teal | `label-text` |
| **Caption** | 9px | 400 | Grey | `caption-text` |

### Usage Examples
```jsx
// Headings
<h1 className="heading-1 text-primary-navy">Main Title</h1>
<h2 className="heading-2 text-primary-navy">Section Title</h2>
<h3 className="heading-3 text-primary-navy">Subsection</h3>
<h4 className="heading-4 text-primary-navy">Component Title</h4>

// Body Text
<p className="text-body text-slate-grey">Body content here</p>

// Labels
<label className="text-label text-primary-teal font-bold">Label text</label>

// Captions
<p className="text-caption text-slate-grey">Additional info</p>
```

---

## 3. Spacing System

### Spacing Scale
- **XS (4px)**: `gap-xs`, `p-xs`, `m-xs`
- **SM (8px)**: `gap-sm`, `p-sm`, `m-sm`
- **MD (16px)**: `gap-md`, `p-md`, `m-md`

### Usage
```jsx
// Padding
<div className="p-4">Content with padding</div>  // 16px (md)
<div className="p-2">Compact content</div>       // 8px (sm)

// Gaps
<div className="flex gap-md">Item 1 Item 2</div>

// Margins
<div className="mb-4">Item with margin below</div>
```

---

## 4. Cards

### Standard Card
```jsx
<div className="bg-white-primary rounded-card border border-slate-300 shadow-soft p-4">
  <h3 className="heading-4 text-primary-navy mb-4">Card Title</h3>
  <p className="text-body text-slate-grey">Card content</p>
</div>
```

### Card Specifications
- **Background**: White `#FFFFFF`
- **Border**: 1px `#CBD5E1` (slate-300)
- **Border Radius**: 8px
- **Padding**: 16px
- **Shadow**: `shadow-soft` (0 2px 8px rgba(0,0,0,0.06))

---

## 5. Buttons

### Button Types

#### Primary Button
```jsx
<button className="bg-primary-teal text-white-primary px-4 py-2.5 rounded-button font-semibold hover:bg-teal-600 transition">
  Primary Action
</button>
```
- **Background**: Teal `#0D9488`
- **Text**: White
- **Hover**: Darker teal `#0a7a6f`
- **Border Radius**: 6px

#### Secondary Button
```jsx
<button className="bg-transparent border border-primary-teal text-primary-teal px-4 py-2.5 rounded-button font-semibold hover:bg-teal-light transition">
  Secondary Action
</button>
```
- **Background**: Transparent (Teal on hover)
- **Border**: 1.5px Teal
- **Text**: Teal

#### Tertiary Button
```jsx
<button className="bg-transparent border border-slate-300 text-slate-grey px-4 py-2.5 rounded-button font-semibold hover:bg-grey-mild transition">
  Tertiary Action
</button>
```
- **Background**: Transparent
- **Border**: 1px Grey
- **Text**: Grey

---

## 6. Input Fields

### Standard Input
```jsx
<input
  type="text"
  placeholder="Enter text"
  className="w-full px-2.5 py-2.5 border border-slate-300 rounded-input focus:outline-none focus:ring-2 focus:ring-primary-teal focus:border-transparent"
/>
```

### Input Specifications
- **Border**: 1px `#CBD5E1`
- **Border Radius**: 6px
- **Padding**: 10px horizontal, 10px vertical
- **Focus**: 2px teal ring, transparent border
- **Placeholder**: Slate grey text

### Label
```jsx
<label className="block text-label text-primary-teal font-bold mb-2">
  Field Label
</label>
```

---

## 7. Navigation

### Navbar
```jsx
<nav className="bg-primary-navy border-b border-slate-300 sticky top-0 z-50 shadow-soft">
  <Link to="/" className="text-heading-3 font-bold text-white-primary">
    CredVerify
  </Link>
  <Link to="/dashboard" className="text-white-primary hover:text-primary-teal">
    Dashboard
  </Link>
</nav>
```

### Navbar Specifications
- **Background**: Navy `#0F172A`
- **Text**: White
- **Active Link**: Teal with underline
- **Height**: 80px (h-20)

---

## 8. Status Badges

### Badge Component
```jsx
<span className="inline-block badge badge-success px-2 py-1">Success</span>
<span className="inline-block badge badge-warning px-2 py-1">Warning</span>
<span className="inline-block badge badge-error px-2 py-1">Error</span>
<span className="inline-block badge badge-neutral px-2 py-1">Neutral</span>
```

### Badge Specifications
- **Padding**: 4px 8px
- **Border Radius**: 4px
- **Font Size**: 8px
- **Font Weight**: 600
- **Text Transform**: Uppercase

---

## 9. Common Component Patterns

### KPI Card
```jsx
<div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-card p-4 border border-blue-300">
  <p className="text-label text-blue-700 mb-1">KPI Label</p>
  <p className="text-2xl font-bold text-blue-900">85</p>
  <p className="text-caption text-blue-800 mt-2">Out of 100</p>
</div>
```

### Progress Bar
```jsx
<div className="w-full bg-slate-300 rounded-full h-2 overflow-hidden">
  <div className="h-2 bg-primary-teal rounded-full" style={{ width: '75%' }}></div>
</div>
```

### Empty State
```jsx
<div className="text-center py-8 text-slate-grey">
  <p className="heading-4 text-primary-navy mb-2">No data available</p>
  <p className="text-caption">Start by creating something new</p>
</div>
```

---

## 10. Page Layout Pattern

### Standard Page Layout
```jsx
<div className="min-h-screen bg-grey-mild">
  {/* Navbar - auto positioned */}
  
  {/* Content Container */}
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {/* Hero/Header Section */}
    <div className="bg-white-primary rounded-card border border-slate-300 shadow-soft p-4 mb-8">
      <h1 className="heading-1 text-primary-navy">Page Title</h1>
      <p className="text-body text-slate-grey mt-2">Page description</p>
    </div>
    
    {/* Main Content Grid */}
    <div className="grid md:grid-cols-2 gap-8">
      {/* Cards */}
    </div>
  </div>
</div>
```

---

## 11. CSS Variables (for Custom Styling)

All design system values are available as CSS variables:

```css
:root {
  /* Colors */
  --color-primary-teal: #0D9488;
  --color-primary-navy: #0F172A;
  --color-teal-light: #CCFBF1;
  --color-slate-grey: #475569;
  --color-grey-mild: #F1F5F9;
  --color-white-primary: #FFFFFF;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
}
```

---

## 12. Migration Checklist

### Pages to Update
- [ ] HomePage.jsx ✅
- [ ] LoginPage.jsx ✅
- [ ] RegisterPage.jsx ✅
- [ ] DashboardPage.jsx ✅
- [ ] AboutPage.jsx (pending)
- [ ] ProfilePageNew.jsx (pending)
- [ ] RecruiterCandidateViewPage.jsx (pending)
- [ ] NotificationsPage.jsx (pending)

### Components to Update
- [ ] Navbar.jsx ✅
- [ ] UI.jsx (Button, Card, Input) ✅
- [ ] ResumeScoreDashboard.jsx (pending - complex SVG)
- [ ] NotificationToast.jsx (pending)
- [ ] PrivateRoute.jsx (pending)

### Configuration
- [ ] tailwind.config.js ✅
- [ ] index.css ✅

---

## 13. Best Practices

1. **Always use design system colors** - Never use hardcoded hex values
2. **Use semantic class names** - `bg-primary-teal` not `bg-teal-600`
3. **Maintain consistent spacing** - Use gap-md, gap-sm, never arbitrary values
4. **Typography hierarchy** - Use heading classes for all titles
5. **Accessibility** - Always include color contrast ratios
6. **Responsive design** - Use Tailwind's responsive prefixes (md:, lg:, etc.)

---

## 14. Troubleshooting

### Colors Not Appearing
- Check `tailwind.config.js` for color definitions
- Verify class name uses design system naming (e.g., `bg-primary-teal`)
- Clear Tailwind cache if needed

### Typography Issues
- Use exact class names from typography system
- Check `index.css` for @layer utilities
- Verify font family in tailwind.config.js

### Shadow Issues
- Use `shadow-soft` or `shadow-soft-lg` (defined in config)
- Don't use Tailwind's default shadow classes

---

## 15. Future Enhancements

- [ ] Dark mode support
- [ ] Animation system
- [ ] Component library documentation
- [ ] Accessibility audit
- [ ] Performance optimization

---

**Last Updated**: 2024
**Version**: 1.0
**Status**: Active
