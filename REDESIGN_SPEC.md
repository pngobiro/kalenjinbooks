# KaleeReads UI/UX Redesign Specification

**Document Version:** 1.0  
**Date:** January 2025  
**Project:** KaleeReads Platform Redesign  
**Purpose:** Complete design specification for handover to implementation team

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Design Philosophy](#design-philosophy)
3. [Visual Design System](#visual-design-system)
4. [Page-by-Page Specifications](#page-by-page-specifications)
5. [Component Library](#component-library)
6. [Responsive Design](#responsive-design)
7. [Accessibility Requirements](#accessibility-requirements)
8. [Performance Standards](#performance-standards)
9. [Implementation Phases](#implementation-phases)
10. [Technical Guidelines](#technical-guidelines)

---

## Executive Summary

### Current State Analysis

**Existing Issues:**
- Circular dial layout is confusing and difficult to navigate
- Poor mobile experience (complex interactions don't translate to touch)
- Inconsistent spacing and typography hierarchy
- Cluttered visual design with competing elements
- Hard to scan content quickly
- Accessibility concerns (small touch targets, poor contrast in places)

### Proposed Solution

A complete redesign focusing on:
- **Clarity**: Simple, linear layouts that are easy to understand
- **Content-first**: Books, authors, and blog posts are the heroes
- **Accessibility**: WCAG AA compliant throughout
- **Mobile-first**: Designed for touch, scales up beautifully
- **Performance**: Fast load times, optimized assets
- **Cultural authenticity**: Design reflects Kalenjin heritage tastefully


---

## Design Philosophy

### Core Principles

1. **Simplicity Over Complexity**
   - Remove the circular dial entirely
   - Use familiar UI patterns (grids, carousels, cards)
   - Clear visual hierarchy
   - One primary action per section

2. **Content is King**
   - Book covers and author photos are prominent
   - White space allows content to breathe
   - Typography enhances readability
   - Images are high-quality and properly sized

3. **Cultural Connection**
   - Warm, earthy color palette inspired by Kenyan landscapes
   - Subtle geometric patterns from Kalenjin beadwork
   - Photography that represents the community
   - Authentic, not stereotypical

4. **Accessible by Default**
   - WCAG AA compliance minimum
   - Keyboard navigation support
   - Screen reader friendly
   - High contrast ratios
   - Clear focus indicators

5. **Mobile-First Thinking**
   - Design for 375px width first
   - Touch targets minimum 44x44px
   - Thumb-friendly navigation
   - Progressive enhancement for larger screens


---

## Visual Design System

### Color Palette

#### Primary Colors

```
Primary Coral: #D97846
- Use for: Primary CTAs, links, active states
- RGB: 217, 120, 70
- HSL: 20, 66%, 56%
- Accessibility: AA on white, AAA on dark backgrounds

Primary Dark: #B8603A
- Use for: Hover states, pressed buttons
- RGB: 184, 96, 58

Secondary Green: #7A9B76
- Use for: Secondary CTAs, badges, author section accents
- RGB: 122, 155, 118
- Accessibility: AA on white

Secondary Dark: #5C7A59
- Use for: Hover states on secondary elements
```

#### Neutral Colors

```
Cream Background: #F5F1E8
- Use for: Page background, card backgrounds
- RGB: 245, 241, 232

Warm White: #FFFCF5
- Use for: Card overlays, form inputs
- RGB: 255, 252, 245

Dark Brown: #2C2416
- Use for: Primary text, headings
- RGB: 44, 36, 22
- Contrast ratio: 14.5:1 on cream (AAA)

Medium Brown: #5B4F42
- Use for: Secondary text, metadata
- RGB: 91, 79, 66
- Contrast ratio: 7.2:1 on cream (AA)

Light Brown: #A89888
- Use for: Borders, dividers, disabled states
- RGB: 168, 152, 136

Accent Gold: #C9A354
- Use for: Premium badges, ratings, highlights
- RGB: 201, 163, 84
```


#### Usage Guidelines

**Background Combinations:**
```
✓ Cream (#F5F1E8) + Dark Brown text (#2C2416)
✓ Warm White (#FFFCF5) + Dark Brown text
✓ Dark Brown (#2C2416) + Warm White text
✓ Primary Coral (#D97846) + Warm White text
✗ Never: Light text on light background
✗ Never: Medium contrast combinations
```

**Button Colors:**
```
Primary Button:
  - Background: #D97846
  - Text: #FFFCF5
  - Hover: #B8603A
  - Active: #9E5132

Secondary Button:
  - Background: transparent
  - Border: 2px solid #D97846
  - Text: #D97846
  - Hover: Background #D97846, Text #FFFCF5

Tertiary Button:
  - Background: #7A9B76
  - Text: #FFFCF5
  - Hover: #5C7A59
```

### Typography

#### Font Families

```css
/* Headings & Display */
--font-heading: 'Playfair Display', 'Lora', Georgia, serif;

/* Body Text */
--font-body: 'Inter', 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace (for metadata, labels) */
--font-mono: 'IBM Plex Mono', 'Courier New', monospace;
```

**Why these fonts?**
- **Playfair Display**: Elegant, readable serif for cultural sophistication
- **Inter**: Modern, highly readable sans-serif with excellent language support
- **IBM Plex Mono**: Clear monospace for technical information


#### Type Scale

```css
/* Desktop (1024px+) */
--text-h1: 48px / 56px (3rem / 3.5rem)
--text-h2: 36px / 44px (2.25rem / 2.75rem)
--text-h3: 28px / 36px (1.75rem / 2.25rem)
--text-h4: 24px / 32px (1.5rem / 2rem)
--text-body-lg: 18px / 28px (1.125rem / 1.75rem)
--text-body: 16px / 24px (1rem / 1.5rem)
--text-body-sm: 14px / 20px (0.875rem / 1.25rem)
--text-caption: 12px / 16px (0.75rem / 1rem)

/* Tablet (768px - 1023px) */
--text-h1: 40px / 48px
--text-h2: 32px / 40px
--text-h3: 24px / 32px
--text-h4: 20px / 28px

/* Mobile (320px - 767px) */
--text-h1: 32px / 40px
--text-h2: 28px / 36px
--text-h3: 20px / 28px
--text-h4: 18px / 26px
```

#### Font Weights

```css
--weight-light: 300 (Use sparingly)
--weight-normal: 400 (Body text default)
--weight-medium: 500 (Subheadings, emphasis)
--weight-semibold: 600 (Buttons, labels)
--weight-bold: 700 (Headings)
--weight-extrabold: 800 (Display text only)
```

#### Typography Rules

1. **Line Length**: 45-75 characters for optimal readability
2. **Paragraph Spacing**: 1.5em between paragraphs
3. **Letter Spacing**: 
   - Headings: -0.02em (tighter)
   - Body: 0 (normal)
   - All caps labels: 0.05em (wider)
4. **Text Alignment**: Left-aligned for body, center for hero sections only


### Spacing System

Use consistent spacing based on 8px grid:

```css
--space-1: 4px   (0.25rem)
--space-2: 8px   (0.5rem)
--space-3: 12px  (0.75rem)
--space-4: 16px  (1rem)
--space-5: 20px  (1.25rem)
--space-6: 24px  (1.5rem)
--space-8: 32px  (2rem)
--space-10: 40px (2.5rem)
--space-12: 48px (3rem)
--space-16: 64px (4rem)
--space-20: 80px (5rem)
--space-24: 96px (6rem)
```

**Usage:**
- Component padding: space-4, space-6
- Section padding: space-12, space-16, space-20
- Element margins: space-2, space-3, space-4
- Gap between items: space-4, space-6

### Border Radius

```css
--radius-sm: 4px   (Small elements like badges)
--radius-md: 8px   (Buttons, inputs)
--radius-lg: 12px  (Cards)
--radius-xl: 16px  (Large cards)
--radius-2xl: 24px (Hero sections)
--radius-full: 9999px (Pills, avatars)
```

### Shadows

```css
/* Elevation levels */
--shadow-sm: 0 1px 2px rgba(44, 36, 22, 0.08)
--shadow-md: 0 2px 8px rgba(44, 36, 22, 0.12)
--shadow-lg: 0 4px 16px rgba(44, 36, 22, 0.16)
--shadow-xl: 0 8px 32px rgba(44, 36, 22, 0.20)

/* Usage */
Cards at rest: shadow-sm
Cards on hover: shadow-lg
Modals/Popovers: shadow-xl
Buttons: No shadow (use solid colors)
```


---

## Page-by-Page Specifications

### Homepage (/)

#### Layout Structure

```
┌─────────────────────────────────────┐
│         Navigation Bar              │
├─────────────────────────────────────┤
│                                     │
│         Hero Section                │
│         (Full viewport height)      │
│                                     │
├─────────────────────────────────────┤
│                                     │
│    Featured Authors Section         │
│    (Grid: 3 columns desktop)        │
│                                     │
├─────────────────────────────────────┤
│                                     │
│    Latest Books Section             │
│    (Grid: 4 columns desktop)        │
│                                     │
├─────────────────────────────────────┤
│                                     │
│    Blog Posts Section               │
│    (Featured + Grid)                │
│                                     │
├─────────────────────────────────────┤
│                                     │
│    Stats & Social Proof             │
│                                     │
├─────────────────────────────────────┤
│                                     │
│    CTA Section                      │
│                                     │
├─────────────────────────────────────┤
│         Footer                      │
└─────────────────────────────────────┘
```

#### Hero Section Detailed Spec

**Desktop (1024px+):**
```
Height: 600px (min-height: 500px)
Background: Gradient from #2C2416 to #3A2E57
Background Image: Subtle Kenyan landscape at 15% opacity
Padding: 80px 64px

Content Layout:
- Max width: 800px centered
- Heading (H1): "Discover Authentic Kalenjin Literature"
  - Font: Playfair Display, 48px, Bold
  - Color: #FFFCF5
  - Margin bottom: 24px

- Subheading (P):
  - Font: Inter, 18px, Regular
  - Color: rgba(255, 252, 245, 0.9)
  - Max width: 600px
  - Margin bottom: 40px
  - Line height: 28px

- CTA Buttons (Row):
  - Gap: 16px
  - Button 1: "Explore Books" (Primary)
  - Button 2: "Meet Authors" (Secondary)
  - Button Height: 48px
  - Padding: 0 32px
```


**Tablet (768px - 1023px):**
```
Height: 500px
Padding: 64px 48px
Heading: 40px
Subheading: 16px
CTA Buttons: Stack on small tablets
```

**Mobile (320px - 767px):**
```
Height: auto (min-height: 400px)
Padding: 48px 24px
Heading: 32px
Subheading: 16px
CTA Buttons: Full width, stacked, gap 12px
```

#### Featured Authors Section

**Desktop Layout:**
```
Container: max-width 1280px, padding 64px
Section Header:
  - H2: "Meet Our Storytellers"
  - Font: Playfair Display, 36px, Bold
  - Color: #2C2416
  - Text align: center
  - Margin bottom: 16px

Subtext:
  - P: "Talented local authors preserving Kalenjin heritage"
  - Font: Inter, 16px, Regular
  - Color: #5B4F42
  - Text align: center
  - Margin bottom: 48px

Grid:
  - Display: grid
  - Columns: 3 (desktop), 2 (tablet), 1 (mobile)
  - Gap: 32px
  - Items: Author cards (see Component Library)
```

**Author Card Specification:**
```
Structure:
┌─────────────────────┐
│                     │
│    Profile Photo    │
│    (280x280px)      │
│                     │
├─────────────────────┤
│   Author Name       │
│   Short Bio         │
│   📚 5 Books        │
│   [View Profile]    │
└─────────────────────┘

Details:
- Background: #FFFCF5
- Border radius: 12px
- Padding: 24px
- Shadow: shadow-sm (at rest), shadow-lg (hover)
- Transition: all 300ms ease

Photo:
  - Size: 100% width, aspect ratio 1:1
  - Border radius: 12px
  - Object fit: cover
  - Margin bottom: 16px

Name:
  - Font: Playfair Display, 24px, Bold
  - Color: #2C2416
  - Margin bottom: 8px

Bio:
  - Font: Inter, 14px, Regular
  - Color: #5B4F42
  - Line height: 20px
  - Max lines: 3 (line-clamp)
  - Margin bottom: 12px

Book Count:
  - Font: Inter, 14px, Medium
  - Color: #7A9B76
  - Icon: 📚 or BookOpen icon
  - Margin bottom: 16px

Button:
  - Type: Secondary
  - Width: 100%
  - Text: "View Profile"
```


#### Latest Books Section

**Desktop Layout:**
```
Container: max-width 1280px, padding 64px
Background: #F5F1E8

Section Header:
  - H2: "Latest Books"
  - Subtext: "Fresh releases from our authors"
  - Layout: Same as Featured Authors header

Grid:
  - Columns: 4 (desktop), 3 (tablet), 2 (mobile)
  - Gap: 24px
  - Items: Book cards (see Component Library)

View All Link:
  - Position: Top right of section header
  - Text: "View All Books →"
  - Font: Inter, 16px, Semibold
  - Color: #D97846
  - Hover: #B8603A
```

**Book Card Specification:**
```
Structure:
┌─────────────────┐
│                 │
│   Book Cover    │
│   (3:4 ratio)   │
│                 │
├─────────────────┤
│  Book Title     │
│  Author Name    │
│  KES 500  ⭐4.5 │
└─────────────────┘

Details:
- Width: 100%
- Background: transparent

Cover Container:
  - Aspect ratio: 3:4
  - Border radius: 8px
  - Overflow: hidden
  - Margin bottom: 12px
  - Position: relative

Cover Image:
  - Width: 100%
  - Height: 100%
  - Object fit: cover
  - Transition: transform 400ms ease
  - Hover: scale(1.05)

Overlay (on hover):
  - Background: rgba(44, 36, 22, 0.85)
  - Display: flex, center aligned
  - Opacity: 0 → 1 on hover
  - Content: "Quick View" button

Title:
  - Font: Playfair Display, 18px, Semibold
  - Color: #2C2416
  - Line clamp: 2 lines
  - Margin bottom: 4px

Author:
  - Font: Inter, 14px, Regular
  - Color: #5B4F42
  - Margin bottom: 8px

Price & Rating Row:
  - Display: flex, space between
  - Font: Inter, 14px, Medium
  - Price color: #D97846
  - Rating color: #C9A354
```


#### Blog Posts Section

**Layout:**
```
Container: max-width 1280px, padding 64px

Structure:
┌────────────────────────────────────────┐
│                                        │
│        Featured Post (Large)           │
│        (50% height, full width)        │
│                                        │
├─────────────┬─────────────┬───────────┤
│             │             │           │
│   Post 2    │   Post 3    │  Post 4   │
│             │             │           │
└─────────────┴─────────────┴───────────┘

Featured Post:
  - Height: 400px
  - Image: Left 40%, Content: Right 60%
  - Background: #FFFCF5
  - Border radius: 12px
  - Shadow: shadow-md
  - Padding: 32px

Other Posts:
  - Grid: 3 columns
  - Gap: 24px
  - Cards: Blog post cards (see Component Library)
```

**Featured Blog Post Card:**
```
Layout: Horizontal split

Image Section (40%):
  - Background: Cover image or gradient
  - Border radius: 12px 0 0 12px
  - Object fit: cover

Content Section (60%):
  - Padding: 32px
  
  Category Badge:
    - Background: #D97846 with 10% opacity
    - Color: #D97846
    - Padding: 6px 12px
    - Border radius: 4px
    - Font: Inter, 12px, Semibold, uppercase
    - Margin bottom: 16px

  Title:
    - Font: Playfair Display, 28px, Bold
    - Color: #2C2416
    - Line clamp: 2 lines
    - Margin bottom: 12px

  Excerpt:
    - Font: Inter, 16px, Regular
    - Color: #5B4F42
    - Line height: 24px
    - Line clamp: 3 lines
    - Margin bottom: 16px

  Meta Row:
    - Author name · Read time · Date
    - Font: Inter, 14px, Regular
    - Color: #A89888
    - Gap: 12px (separated by ·)

  Read More Link:
    - Font: Inter, 16px, Semibold
    - Color: #D97846
    - Hover: underline
```


**Standard Blog Post Card:**
```
Structure:
┌───────────────┐
│               │
│  Cover Image  │
│  (16:9)       │
│               │
├───────────────┤
│ Category      │
│ Title         │
│ Excerpt       │
│ Meta info     │
└───────────────┘

Details:
- Background: #FFFCF5
- Border radius: 12px
- Shadow: shadow-sm → shadow-lg on hover
- Padding: 0 (image) + 20px (content)

Cover:
  - Aspect ratio: 16:9
  - Border radius: 12px 12px 0 0
  - Object fit: cover

Content Section:
  - Padding: 20px

Category:
  - Same as featured
  - Margin bottom: 12px

Title:
  - Font: Playfair Display, 20px, Semibold
  - Line clamp: 2
  - Margin bottom: 8px

Excerpt:
  - Font: Inter, 14px, Regular
  - Line clamp: 3
  - Margin bottom: 12px

Meta:
  - Font: Inter, 12px, Regular
  - Color: #A89888
```

#### Stats & Social Proof Section

**Layout:**
```
Container: max-width 1280px, padding 64px
Background: Gradient from #F5F1E8 to #FFFCF5

Content: Centered, max-width 900px

Stats Row:
  ┌─────────┬─────────┬─────────┬─────────┐
  │   150   │    45   │  2,500  │   98%   │
  │  Books  │ Authors │  Sold   │ Happy   │
  └─────────┴─────────┴─────────┴─────────┘

Each Stat:
  - Number:
    - Font: Playfair Display, 48px, Bold
    - Color: #D97846
    - Margin bottom: 8px
  
  - Label:
    - Font: Inter, 16px, Medium
    - Color: #5B4F42

Testimonials (Below stats):
  - 2-3 rotating testimonials
  - Cards with user photo, quote, name
  - Carousel on mobile
```


#### CTA Section

**Layout:**
```
Container: Full width
Background: #2C2416
Padding: 80px 64px
Text align: center

Content:
  Max width: 800px, centered

  Heading:
    - Font: Playfair Display, 40px, Bold
    - Color: #FFFCF5
    - Margin bottom: 16px
    - Text: "Start Your Reading Journey"

  Subtext:
    - Font: Inter, 18px, Regular
    - Color: rgba(255, 252, 245, 0.85)
    - Margin bottom: 32px
    - Text: "Join our community of readers and authors"

  Buttons:
    - Row layout, gap 16px
    - Button 1: "Browse Books" (Primary with coral)
    - Button 2: "Become an Author" (Secondary, white outline)
    - Button 3: "Contact Us" (Tertiary, subtle)
```

### Navigation Bar

**Desktop (1024px+):**
```
Structure:
┌──────────────────────────────────────────────┐
│ [Logo]    Books  Authors  Blog  About    [🔍] [👤] │
└──────────────────────────────────────────────┘

Specifications:
- Height: 64px
- Background: #FFFCF5
- Border bottom: 1px solid rgba(168, 152, 136, 0.2)
- Box shadow: 0 1px 3px rgba(44, 36, 22, 0.05)
- Position: sticky, top: 0, z-index: 50

Logo:
  - Height: 36px
  - Padding left: 32px

Nav Links:
  - Font: Inter, 15px, Medium
  - Color: #5B4F42
  - Hover: #D97846
  - Active: #D97846 with underline
  - Gap: 32px
  - Padding: 0 16px

Search Icon:
  - Size: 20px
  - Color: #5B4F42
  - Hover: #D97846
  - Click: Opens search modal

User Icon:
  - Size: 20px
  - Color: #5B4F42
  - Shows dropdown on click
```


**Mobile (< 768px):**
```
Structure:
┌────────────────────────────┐
│ [☰]  [Logo]        [🔍] [👤] │
└────────────────────────────┘

Height: 56px
Padding: 0 16px

Hamburger Menu:
  - Opens full-screen overlay
  - Background: #2C2416
  - Nav links: Vertical stack
  - Font: Playfair Display, 24px
  - Color: #FFFCF5
  - Gap: 24px
  - Close button: Top right

Bottom Navigation (Optional):
  - Fixed to bottom
  - 4 icons: Home, Books, Authors, Profile
  - Height: 60px
  - Background: #FFFCF5
  - Shadow: 0 -2px 8px rgba(44, 36, 22, 0.1)
```

### Footer

**Desktop Layout:**
```
Container: Full width
Background: #2C2416
Padding: 48px 64px 24px

Structure:
┌────────────────────────────────────────────┐
│ [Logo + Tagline]      Browse    Support    │
│                       Links     Links      │
├────────────────────────────────────────────┤
│ © 2025 KaleeReads    [Social Icons]  Terms │
└────────────────────────────────────────────┘

Top Section:
  - Grid: 3 columns (Logo 40%, Links 30%, Links 30%)
  - Gap: 48px
  - Padding bottom: 32px
  - Border bottom: 1px solid rgba(168, 152, 136, 0.2)

Logo Section:
  - Logo height: 32px
  - Tagline: "Preserving Kalenjin heritage through literature"
  - Font: Inter, 14px, Regular
  - Color: rgba(255, 252, 245, 0.7)
  - Max width: 300px

Link Columns:
  - Column title:
    - Font: Inter, 14px, Semibold
    - Color: #FFFCF5
    - Margin bottom: 16px
  
  - Links:
    - Font: Inter, 14px, Regular
    - Color: rgba(255, 252, 245, 0.7)
    - Hover: #D97846
    - Gap: 12px

Bottom Section:
  - Flex row, space between
  - Padding top: 24px
  - Font: Inter, 13px, Regular
  - Color: rgba(168, 152, 136, 0.8)

Social Icons:
  - Size: 20px
  - Color: rgba(255, 252, 245, 0.7)
  - Hover: #D97846
  - Gap: 16px
```


**Mobile Footer:**
```
- Single column layout
- Logo and tagline centered
- Link groups: Stacked with 32px gap
- Social icons: Centered row
- Copyright: Centered, smaller text
- Padding: 32px 24px
```

---

## Component Library

### Buttons

#### Primary Button

```css
.btn-primary {
  background: #D97846;
  color: #FFFCF5;
  font: Inter, 16px, Semibold;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  height: 48px;
  cursor: pointer;
  transition: all 200ms ease;
}

.btn-primary:hover {
  background: #B8603A;
  transform: translateY(-1px);
}

.btn-primary:active {
  background: #9E5132;
  transform: translateY(0);
}

.btn-primary:focus {
  outline: 2px solid #D97846;
  outline-offset: 2px;
}

.btn-primary:disabled {
  background: #A89888;
  cursor: not-allowed;
  transform: none;
}
```

#### Secondary Button

```css
.btn-secondary {
  background: transparent;
  color: #D97846;
  font: Inter, 16px, Semibold;
  padding: 12px 24px;
  border-radius: 8px;
  border: 2px solid #D97846;
  height: 48px;
  cursor: pointer;
  transition: all 200ms ease;
}

.btn-secondary:hover {
  background: #D97846;
  color: #FFFCF5;
}

.btn-secondary:focus {
  outline: 2px solid #D97846;
  outline-offset: 2px;
}
```


#### Tertiary Button

```css
.btn-tertiary {
  background: #7A9B76;
  color: #FFFCF5;
  font: Inter, 16px, Semibold;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  height: 48px;
  cursor: pointer;
  transition: all 200ms ease;
}

.btn-tertiary:hover {
  background: #5C7A59;
}
```

#### Button Sizes

```css
/* Small */
.btn-sm {
  height: 36px;
  padding: 8px 16px;
  font-size: 14px;
}

/* Medium (default) */
.btn-md {
  height: 48px;
  padding: 12px 24px;
  font-size: 16px;
}

/* Large */
.btn-lg {
  height: 56px;
  padding: 16px 32px;
  font-size: 18px;
}

/* Full width */
.btn-full {
  width: 100%;
}
```

### Input Fields

```css
.input-field {
  font: Inter, 16px, Regular;
  color: #2C2416;
  background: #FFFCF5;
  border: 1px solid #E4D9C4;
  border-radius: 8px;
  padding: 12px 16px;
  height: 48px;
  width: 100%;
  transition: all 200ms ease;
}

.input-field:hover {
  border-color: #D97846;
}

.input-field:focus {
  outline: none;
  border-color: #D97846;
  box-shadow: 0 0 0 3px rgba(217, 120, 70, 0.1);
}

.input-field::placeholder {
  color: #A89888;
}

.input-field:disabled {
  background: #F5F1E8;
  cursor: not-allowed;
}
```


### Cards

#### Basic Card

```css
.card {
  background: #FFFCF5;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(44, 36, 22, 0.12);
  transition: all 300ms ease;
}

.card:hover {
  box-shadow: 0 4px 16px rgba(44, 36, 22, 0.16);
  transform: translateY(-2px);
}
```

#### Image Card

```css
.card-image {
  background: #FFFCF5;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(44, 36, 22, 0.12);
  transition: all 300ms ease;
}

.card-image__media {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}

.card-image__content {
  padding: 20px;
}

.card-image:hover {
  box-shadow: 0 4px 16px rgba(44, 36, 22, 0.16);
  transform: translateY(-2px);
}
```

### Badges

```css
.badge {
  display: inline-block;
  font: Inter, 12px, Semibold;
  padding: 4px 12px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-primary {
  background: rgba(217, 120, 70, 0.1);
  color: #D97846;
}

.badge-success {
  background: rgba(122, 155, 118, 0.1);
  color: #7A9B76;
}

.badge-gold {
  background: rgba(201, 163, 84, 0.1);
  color: #C9A354;
}
```


### Loading States

#### Skeleton Loader

```css
.skeleton {
  background: linear-gradient(
    90deg,
    #E4D9C4 0%,
    #F5F1E8 50%,
    #E4D9C4 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 8px;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Variants */
.skeleton-text {
  height: 16px;
  margin: 8px 0;
}

.skeleton-heading {
  height: 32px;
  width: 60%;
  margin: 16px 0;
}

.skeleton-card {
  height: 300px;
  width: 100%;
}

.skeleton-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
```

#### Spinner

```css
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(217, 120, 70, 0.2);
  border-top-color: #D97846;
  border-radius: 50%;
  animation: spinner-rotate 0.8s linear infinite;
}

@keyframes spinner-rotate {
  to { transform: rotate(360deg); }
}
```

---

## Responsive Design

### Breakpoints

```css
/* Mobile First Approach */
--breakpoint-sm: 640px;   /* Large phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1536px; /* Large screens */
```


### Responsive Grid Patterns

#### Authors Grid

```css
/* Mobile: 1 column */
@media (min-width: 0) {
  .authors-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .authors-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }
}

/* Desktop: 3 columns */
@media (min-width: 1024px) {
  .authors-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
}
```

#### Books Grid

```css
/* Mobile: 2 columns */
@media (min-width: 0) {
  .books-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

/* Tablet: 3 columns */
@media (min-width: 768px) {
  .books-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
}

/* Desktop: 4 columns */
@media (min-width: 1024px) {
  .books-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
}

/* Large Desktop: 5 columns */
@media (min-width: 1280px) {
  .books-grid {
    grid-template-columns: repeat(5, 1fr);
    gap: 24px;
  }
}
```

### Mobile Optimizations

1. **Touch Targets**: Minimum 44x44px
2. **Font Scaling**: Reduce by 15-20% on mobile
3. **Padding**: Reduce by 30-40% on mobile
4. **Images**: Serve responsive images (srcset)
5. **Hamburger Menu**: Full-screen overlay
6. **Bottom Navigation**: Fixed navigation bar
7. **Swipe Gestures**: Enable for carousels


---

## Accessibility Requirements

### WCAG AA Compliance

#### Color Contrast

All text must meet WCAG AA standards:
- **Normal text (< 18px)**: Minimum 4.5:1 contrast ratio
- **Large text (≥ 18px)**: Minimum 3:1 contrast ratio
- **UI Components**: Minimum 3:1 contrast ratio

**Approved Combinations:**
```
✓ #2C2416 on #F5F1E8 (14.5:1) - AAA
✓ #5B4F42 on #F5F1E8 (7.2:1) - AA
✓ #D97846 on #FFFCF5 (3.8:1) - AA for large text
✓ #FFFCF5 on #2C2416 (14.5:1) - AAA
✗ #A89888 on #F5F1E8 (2.8:1) - Fails (use only for decorative)
```

#### Keyboard Navigation

1. **Tab Order**: Logical flow matching visual layout
2. **Focus Indicators**: 
   - Visible 2px solid outline
   - Color: #D97846
   - Offset: 2px
   - Never use `outline: none` without replacement

3. **Skip Links**:
   - "Skip to main content" at top
   - Hidden until focused
   - Jumps to main content area

4. **Keyboard Shortcuts**:
   - `/` - Focus search
   - `Esc` - Close modals/overlays
   - Arrow keys - Navigate carousels

#### Screen Reader Support

1. **Semantic HTML**:
   - Use `<nav>`, `<main>`, `<section>`, `<article>`
   - Proper heading hierarchy (h1 → h2 → h3)
   - `<button>` for interactions, not `<div>`

2. **ARIA Labels**:
   - `aria-label` for icon-only buttons
   - `aria-describedby` for form hints
   - `aria-current="page"` for active nav links
   - `role="img"` with `aria-label` for decorative images

3. **Alt Text Rules**:
   - Book covers: "Cover of [Book Title] by [Author]"
   - Author photos: "Photo of [Author Name]"
   - Decorative images: `alt=""` (empty)


#### Form Accessibility

```html
<!-- Example accessible form input -->
<div class="form-field">
  <label for="email" class="form-label">
    Email Address
    <span class="required" aria-label="required">*</span>
  </label>
  <input
    type="email"
    id="email"
    name="email"
    class="input-field"
    aria-required="true"
    aria-describedby="email-hint email-error"
    placeholder="your@email.com"
  />
  <span id="email-hint" class="form-hint">
    We'll never share your email
  </span>
  <span id="email-error" class="form-error" role="alert" hidden>
    Please enter a valid email address
  </span>
</div>
```

#### Motion & Animation

1. **Respect User Preferences**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

2. **Animation Guidelines**:
   - Keep durations under 400ms
   - Use `ease-out` for entrances
   - Use `ease-in` for exits
   - Avoid flashing (no more than 3 flashes per second)

---

## Performance Standards

### Core Web Vitals Targets

```
Largest Contentful Paint (LCP): < 2.5s
First Input Delay (FID): < 100ms
Cumulative Layout Shift (CLS): < 0.1
First Contentful Paint (FCP): < 1.5s
Time to Interactive (TTI): < 3.5s
```

### Lighthouse Score Goals

```
Performance: > 90
Accessibility: 100
Best Practices: > 95
SEO: 100
```


### Image Optimization

1. **Format Selection**:
   - WebP for all images with JPEG/PNG fallback
   - SVG for logos and icons
   - AVIF for hero images (progressive enhancement)

2. **Sizing**:
```html
<!-- Responsive images example -->
<img
  src="book-cover-400.webp"
  srcset="
    book-cover-400.webp 400w,
    book-cover-600.webp 600w,
    book-cover-800.webp 800w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    400px
  "
  alt="Cover of [Book Title]"
  loading="lazy"
  decoding="async"
/>
```

3. **Optimization Rules**:
   - Max quality: 85%
   - Compress all images
   - Use lazy loading for below-fold images
   - Preload critical images (hero, above-fold)
   - Use blur-up placeholders or skeleton loaders

### Font Loading Strategy

```html
<!-- Preload critical fonts -->
<link
  rel="preload"
  href="/fonts/playfair-display-bold.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>

<link
  rel="preload"
  href="/fonts/inter-regular.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

```css
/* Use font-display: swap for web fonts */
@font-face {
  font-family: 'Playfair Display';
  src: url('/fonts/playfair-display-bold.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}
```

### Code Splitting

1. **Route-based splitting**: Each page is a separate bundle
2. **Component lazy loading**: Below-fold components load on demand
3. **Third-party scripts**: Defer non-critical scripts
4. **CSS**: Critical CSS inlined, rest loaded async


### Caching Strategy

```
Static Assets: Cache for 1 year
API Responses: Cache with revalidation
Images: Cache for 30 days
HTML: No cache (always fresh)
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)

**Goals**: Establish design system and core infrastructure

**Tasks**:
1. Set up design tokens (colors, typography, spacing)
2. Create CSS utility classes
3. Build component library basics (buttons, inputs, cards)
4. Update global styles
5. Implement new color palette throughout

**Deliverables**:
- `styles/tokens.css` - All design tokens
- `styles/utilities.css` - Utility classes
- `components/ui/` - Basic UI components
- Updated `globals.css`

**Testing**:
- Visual regression tests for components
- Accessibility audit of components
- Cross-browser compatibility check

### Phase 2: Homepage Redesign (Week 2)

**Goals**: Complete homepage transformation

**Tasks**:
1. Remove circular dial layout
2. Implement new hero section
3. Build featured authors grid
4. Create latest books section
5. Design blog posts section
6. Add stats & social proof
7. Build CTA section

**Deliverables**:
- New `app/page.tsx`
- `components/home/` directory with all sections
- Mobile-responsive layouts

**Testing**:
- Performance testing (Lighthouse)
- Mobile usability testing
- Accessibility audit
- Cross-device testing


### Phase 3: Navigation & Footer (Week 2)

**Goals**: Modernize site-wide navigation

**Tasks**:
1. Redesign navbar (desktop & mobile)
2. Implement search functionality
3. Build mobile hamburger menu
4. Create bottom navigation (mobile)
5. Redesign footer
6. Add breadcrumbs where needed

**Deliverables**:
- Updated `components/layout/Navbar.tsx`
- Updated `components/layout/Footer.tsx`
- `components/layout/MobileMenu.tsx`
- `components/layout/SearchModal.tsx`

**Testing**:
- Keyboard navigation testing
- Screen reader testing
- Mobile gesture testing

### Phase 4: Books Page (Week 3)

**Goals**: Improve book browsing experience

**Tasks**:
1. Redesign books listing page
2. Implement filtering & sorting
3. Build search results page
4. Enhance book detail page
5. Add breadcrumbs and navigation

**Deliverables**:
- `app/books/page.tsx`
- `app/books/[id]/page.tsx`
- `components/books/` directory

### Phase 5: Authors & Blog (Week 3)

**Goals**: Complete remaining pages

**Tasks**:
1. Redesign authors listing page
2. Enhance author profile pages
3. Redesign blog listing page
4. Improve blog post detail page

**Deliverables**:
- `app/authors/page.tsx`
- `app/authors/[id]/page.tsx`
- `app/blogs/page.tsx`
- `app/blogs/[slug]/page.tsx`

### Phase 6: Polish & Optimization (Week 4)

**Goals**: Final touches and performance optimization

**Tasks**:
1. Image optimization pass
2. Performance tuning
3. Accessibility final audit
4. Browser testing
5. Bug fixes
6. Documentation updates

**Deliverables**:
- Performance report
- Accessibility report
- Browser compatibility matrix
- Updated documentation


---

## Technical Guidelines

### File Structure

```
src/
├── app/
│   ├── page.tsx                 # Homepage
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── books/
│   │   ├── page.tsx            # Books listing
│   │   └── [id]/page.tsx       # Book detail
│   ├── authors/
│   │   ├── page.tsx            # Authors listing
│   │   └── [id]/page.tsx       # Author profile
│   └── blogs/
│       ├── page.tsx            # Blog listing
│       └── [slug]/page.tsx     # Blog post
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   └── Skeleton.tsx
│   ├── layout/                  # Layout components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileMenu.tsx
│   │   └── SearchModal.tsx
│   ├── home/                    # Homepage sections
│   │   ├── HeroSection.tsx
│   │   ├── FeaturedAuthors.tsx
│   │   ├── LatestBooks.tsx
│   │   ├── BlogPosts.tsx
│   │   ├── Stats.tsx
│   │   └── CTASection.tsx
│   ├── books/                   # Book components
│   │   ├── BookCard.tsx
│   │   ├── BookGrid.tsx
│   │   └── BookFilters.tsx
│   ├── authors/                 # Author components
│   │   ├── AuthorCard.tsx
│   │   └── AuthorGrid.tsx
│   └── blog/                    # Blog components
│       ├── BlogCard.tsx
│       └── BlogGrid.tsx
├── styles/
│   ├── tokens.css               # Design tokens
│   ├── utilities.css            # Utility classes
│   └── components.css           # Component styles
└── lib/
    ├── api/                     # API clients
    └── utils/                   # Utility functions
```

### CSS Architecture

Use a combination of:
1. **CSS Modules** for component-specific styles
2. **Tailwind CSS** for utility classes (optional)
3. **CSS Variables** for design tokens
4. **Global styles** for resets and base styles


### Component Pattern

```typescript
// Example: Button.tsx
import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  ariaLabel,
}) => {
  const className = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      type={type}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
```

### Naming Conventions

**CSS Classes:**
- Use BEM (Block Element Modifier) for component classes
- Lowercase with hyphens: `.author-card__title--featured`

**Components:**
- PascalCase: `AuthorCard`, `BookGrid`
- Descriptive names: `FeaturedAuthorsSection` not `Section3`

**Files:**
- Component files: `AuthorCard.tsx`, `AuthorCard.module.css`
- Page files: `page.tsx`, `layout.tsx`
- Utility files: `formatDate.ts`, `fetchAuthors.ts`


### Testing Requirements

**Unit Tests:**
- Test all utility functions
- Test component rendering
- Test props and state changes
- Target: 80% code coverage

**Integration Tests:**
- Test user flows (browse → book detail → checkout)
- Test form submissions
- Test navigation
- Target: All critical paths covered

**Accessibility Tests:**
- Automated: axe-core, Lighthouse
- Manual: Screen reader testing
- Keyboard navigation testing
- Target: WCAG AA compliance

**Visual Regression Tests:**
- Percy or Chromatic for visual diffs
- Test all breakpoints
- Test hover/focus states
- Target: No unintended visual changes

**Performance Tests:**
- Lighthouse CI in build pipeline
- Bundle size monitoring
- Image optimization validation
- Target: Meet Core Web Vitals

### Browser Support

**Desktop:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Mobile:**
- iOS Safari 14+
- Chrome Android 90+
- Samsung Internet 14+

**Testing Matrix:**
- Latest 2 versions of major browsers
- iOS 14+ and Android 10+
- Test on real devices, not just emulators


---

## Design Rationale

### Why Remove the Circular Dial?

**Problems with circular layout:**
1. **Cognitive Load**: Users don't naturally understand circular navigation
2. **Mobile Issues**: Difficult to interact with on small screens
3. **Accessibility**: Hard to navigate with keyboard/screen reader
4. **Scalability**: Becomes cluttered with many authors
5. **Cultural Mismatch**: Circular dial feels gimmicky, not authentic

**Benefits of grid layout:**
1. **Familiar Pattern**: Users understand grids immediately
2. **Scannable**: Easy to quickly browse all authors
3. **Mobile-Friendly**: Naturally stacks into columns
4. **Accessible**: Standard tab order, clear focus indicators
5. **Scalable**: Works with 3 or 30 authors
6. **Cultural**: Clean, sophisticated design matches brand

### Color Palette Reasoning

**Warm terracotta (#D97846)**: 
- Represents Kenyan earth and landscapes
- Warm, inviting, cultural
- Strong enough for CTAs

**Sage green (#7A9B76)**:
- Represents Kenyan highlands and tea plantations
- Calming, natural
- Good for secondary actions

**Deep brown (#2C2416)**:
- Rich, sophisticated
- Excellent for text (high contrast)
- Represents strong cultural roots

**Cream (#F5F1E8)**:
- Soft, warm alternative to harsh white
- Reduces eye strain
- Creates cozy, inviting atmosphere

**Gold accent (#C9A354)**:
- Represents value and quality
- Use sparingly for premium elements
- Cultural significance (traditional jewelry)

### Typography Choices

**Playfair Display (Headings)**:
- Elegant serif conveys sophistication
- Excellent readability at large sizes
- Cultural connection without being stereotypical
- Open source, good language support

**Inter (Body)**:
- Modern, highly readable sans-serif
- Excellent for long-form reading
- Great language support (including special characters)
- Open source, optimized for screens

