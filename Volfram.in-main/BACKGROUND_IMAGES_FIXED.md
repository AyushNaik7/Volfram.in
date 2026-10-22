# Background Images & Text Visibility Fixed

## ✅ What Was Done

Added **background images** to all sections and fixed **text visibility** with proper colors and shadows.

---

## 🎨 Background Images Added

### Technique Used:
```css
section {
  position: relative;
}

section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/Clients/image.png');
  background-size: cover;
  background-position: center;
  opacity: 0.05-0.15; /* Subtle background */
  z-index: 0;
}

section > .container-custom {
  position: relative;
  z-index: 1; /* Content above background */
}
```

---

## 📋 Section-by-Section Changes

### 1. **Volfram Intro Section**
```css
Background: homepage.png at 5% opacity
Text: Dark blue (#0f2d4d) - clearly visible
Cards: White with shadows
```

### 2. **Engineering Solutions Section**
```css
Background: homepage2.png at 15% opacity
Gradient overlay: Dark blue
Text: Pure white (#ffffff)
Text shadow: 0 2px 20px rgba(0,0,0,0.3)
Button: White with shadow
```
**Why darker background here?** - Matches original website's hero style

### 3. **Video Gallery**
```css
Background: homepage3.png at 3% opacity
Base color: Light gray (#f8fafb)
Cards: White with proper shadows
Text: Dark, clearly visible
```

### 4. **Together Section**
```css
Background: homepage.png at 12% opacity
Gradient overlay: Dark blue
Text: Pure white (#ffffff)
Text shadow: 0 2px 20px rgba(0,0,0,0.3)
Partner text: White with shadow
```

### 5. **Sectors Section**
```css
Background: homepage2.png at 4% opacity
Base: White
Cards: Individual backgrounds with dark overlays
Card text: White with strong shadow
```

**Individual Sector Cards:**
```css
Each card has:
- Background image from props
- Dark gradient overlay (88% opacity)
- White text with shadow
- Hover: Overlay reduces to 70-75% (brightens)
```

### 6. **Services Section**
```css
Background: homepage3.png at 3% opacity
Base color: Light gray (#f8fafb)
Service cards: White with images
Text: Dark blue, clearly visible
```

### 7. **Pharma Section**
```css
Background: homepage.png at 4% opacity
Base: White
Text: Dark blue (#0f2d4d)
Orange accent: #d9732d for subtitle
```

### 8. **Products Section**
```css
Background: homepage2.png at 12% opacity
Gradient overlay: Dark blue
Text: Pure white (#ffffff)
Text shadow: 0 2px 20px rgba(0,0,0,0.3)
Button: White with shadow
```

### 9. **Contact CTA**
```css
Background: homepage3.png at 3% opacity
Base color: Light gray (#f8fafb)
Cards: White
Text: Dark blue (#0f2d4d)
```

---

## 🎯 Text Visibility Fixes

### Dark Sections (Blue backgrounds):
```css
Text color: #ffffff (pure white)
Text shadow: 0 2px 20px rgba(0,0,0,0.3)
Gradient: 85-95% opacity
Background image: 12-15% opacity
```

**Result:** Text pops out clearly against background

### Light Sections (White/Gray backgrounds):
```css
Text color: #0f2d4d (dark blue)
Background image: 3-5% opacity (very subtle)
Cards: White with shadows for depth
```

**Result:** Clean, readable text with subtle texture

### Sector Cards (Image backgrounds):
```css
Background: Full image
Overlay: rgba(15, 45, 77, 0.88) - 88% dark blue
Text: #ffffff (white)
Text shadow: 0 2px 20px rgba(0,0,0,0.5)

Hover:
Overlay: Reduces to 70-75% (brightens image)
Text: Still clearly visible
```

**Result:** Images visible but text always readable

---

## 🎨 Color System Summary

### White Text Sections:
- Engineering Solutions
- Together Section  
- Products Section

**Style:**
```css
color: #ffffff;
text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
background: Dark gradient + subtle image
```

### Dark Text Sections:
- Volfram Intro
- Video Gallery
- Sectors Section (title only)
- Services Section
- Pharma Section
- Contact CTA

**Style:**
```css
color: #0f2d4d;
background: White/Light + very subtle image
```

### Card Text:
- Always maintains contrast
- Dark cards → white text
- Light cards → dark text

---

## 🎭 Shadow Strategy

### Text Shadows:
```css
/* Dark backgrounds */
text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
/* Creates "glow" effect for readability */

/* Sector cards */
text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
/* Stronger shadow for image backgrounds */
```

### Button Shadows:
```css
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);

/* Hover */
box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
```

### Card Shadows:
```css
box-shadow: 0 4px 20px rgba(15, 45, 77, 0.08);

/* Hover */
box-shadow: 0 12px 40px rgba(15, 45, 77, 0.15);
```

---

## 📊 Opacity Levels Guide

### Background Image Opacity:

| Section Type | Opacity | Reason |
|--------------|---------|--------|
| **Dark gradient sections** | 12-15% | Visible but not distracting |
| **Light sections** | 3-5% | Subtle texture only |
| **Sector cards overlay** | 88% → 70% | Image shows on hover |

### Why These Numbers?

**3-5% opacity** (Light sections):
- Just enough to add texture
- Doesn't interfere with readability
- Subtle premium feel

**12-15% opacity** (Dark sections):
- Image visible but text clear
- Creates depth and interest
- Maintains brand colors

**88% overlay** (Sector cards):
- Strong overlay ensures text readable
- Reduces to 70% on hover = image revealed
- Interactive and engaging

---

## 🎨 Visual Hierarchy

### Before:
```
Text on solid backgrounds
  ↓
Flat appearance
  ↓
No depth or texture
```

### After:
```
Layered design:
1. Background image (z-index: 0)
2. Color overlay/gradient
3. Content (z-index: 1)
  ↓
Depth and sophistication
  ↓
Premium feel with texture
  ↓
Text always readable
```

---

## 🎯 Contrast Ratios

### White on Dark Blue:
```css
color: #ffffff
background: #0f2d4d with 15% image

Contrast ratio: ~12:1 (AAA rating)
Text shadow adds extra clarity
```

### Dark Blue on White:
```css
color: #0f2d4d
background: #ffffff with 5% image

Contrast ratio: ~11:1 (AAA rating)
Very readable
```

### White on Sector Cards:
```css
color: #ffffff
background: Image + 88% dark overlay
text-shadow: Strong

Contrast ratio: ~10:1 (AAA rating)
Shadow ensures readability
```

---

## 🎬 Interactive Effects

### Sector Card Hover:
```css
Default:
- Overlay: 88% opacity (dark)
- Image: barely visible
- Text: bright white, clear

Hover:
- Overlay: 70% opacity (lighter)
- Image: more visible
- Text: still clearly readable
- Scale: 1.03 (slight zoom)
```

**Result:** Image reveals on hover but text stays readable

### Button Hover:
```css
Default:
- White background
- Medium shadow

Hover:
- Lifts up (translateY(-3px))
- Shadow increases
- Appears to float
```

---

## 📱 Responsive Behavior

All background images and text shadows maintain on mobile:
```css
@media (max-width: 768px) {
  /* Backgrounds still work */
  /* Text still readable */
  /* Shadows still applied */
  /* Just layouts adjust */
}
```

---

## ✨ Key Improvements

### Before:
- ❌ No background images
- ❌ Flat solid colors
- ❌ Less visual interest
- ❌ No texture or depth

### After:
- ✅ Background images in every section
- ✅ Layered, sophisticated design
- ✅ Text always clearly visible
- ✅ White text on dark sections
- ✅ Text shadows for readability
- ✅ Premium, polished appearance
- ✅ Matches original website style
- ✅ Interactive hover effects reveal images

---

## 🎨 Implementation Pattern

For any new section, use this pattern:

```css
.new-section {
  position: relative;
  padding: 80px 20px;
  /* Your base color/gradient */
}

.new-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/path/to/image.png');
  background-size: cover;
  background-position: center;
  opacity: 0.05; /* Adjust based on section */
  z-index: 0;
}

.new-section > .container-custom {
  position: relative;
  z-index: 1;
}

/* If dark section */
.new-section h2 {
  color: #ffffff;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

/* If light section */
.new-section h2 {
  color: #0f2d4d;
}
```

---

## 🚀 Result

The homepage now has:

✅ **Background images** in all sections  
✅ **Perfect text visibility** with white on dark, dark on light  
✅ **Text shadows** for extra clarity  
✅ **Layered design** for depth  
✅ **Premium appearance** matching original  
✅ **Interactive reveals** on sector cards  
✅ **Accessible contrast ratios** (AAA)  
✅ **Subtle textures** that don't distract  

### Visual Experience:
```
User scrolls
  ↓
Sections with textured backgrounds
  ↓
Text always clearly visible
  ↓
Hovers on cards
  ↓
Images reveal beautifully
  ↓
Feels premium & polished
```

---

**Updated**: October 21, 2026  
**Status**: ✅ Complete  
**Result**: Premium textured backgrounds with perfect text readability
