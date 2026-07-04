# Redesign and Build NestMate Hero Section

We will redesign and build the NestMate landing page hero section as a production-quality, responsive React component. This plan aligns the design with a modern, trusted flatmate-finding startup brand.

## Proposed Changes

We will implement the following changes:

### 1. Visual Redesign
- **Background**: We will generate a premium photo of a bright shared living room using the image generation tool, copy it to assets, and apply it with a dark gradient overlay (`to-slate-950/80 via-slate-900/60 from-transparent`) for high text contrast. As a fallback/alternative, we'll support a gorgeous Tailwind-only mesh gradient.
- **Typography**: We will override `font-display` serif fonts and use only the modern sans-serif `DM Sans` (`font-sans`) in the Hero section, styling with weight and size hierarchy.
- **Heading**: The heading will have strong contrast against the dark background, and "Mumbai" (or the selected city) will be styled in a bright, modern two-tone teal gradient (`text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400`).
- **Trust Badges**: A sleek trust-signal strip will sit directly below the hero section with a subtle background, featuring:
  - `ShieldCheck` for **Verified Profiles**
  - `IndianRupee` or `Coins` for **Zero Brokerage**
  - `Users` for **10,000+ Matches**

### 2. Search Card Enhancement
- **Design**: Floating look using `shadow-2xl shadow-slate-950/20`, border `border-slate-200/80`, and increased padding (`p-6 md:p-8`). It will use a slightly translucent glassmorphic treatment (`bg-white/95 backdrop-blur-md`).
- **Icons**: Incorporate Lucide icons (`MapPin`, `IndianRupee`, `Search`) inside inputs for clear visual context.
- **Budget Inputs**: Instead of two raw number fields, we will implement:
  - Left icon: `IndianRupee`
  - A styled min/max input pair with custom rupee prefixes.
  - Quick-preset dropdown option or simple inline labels for a cleaner, modern interface.
- **CTA Differentiating**:
  - Keep the Hero **Search** button as the primary teal button.
  - Modify the navbar **Post Free Ad** button to use a darker, premium slate/navy variant (`bg-slate-900 text-white hover:bg-slate-800`) to differentiate it from the teal Search CTA.

### 3. Responsiveness & Micro-interactions
- **Mobile Layout**: The search card will stack vertically. Inputs and search button will be full-width.
- **Interactions**: Add subtle hover animations (`hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300`), focus rings for input fields, and hover transitions on buttons.

---

## File Changes

### [NEW] [Hero.jsx](file:///C:/NestMate/frontend/src/components/Hero.jsx)
Create a new self-contained React component for the Hero section.

### [MODIFY] [HomePage.jsx](file:///C:/NestMate/frontend/src/pages/HomePage.jsx)
Import and render the new `<Hero />` component instead of the inline section.

### [MODIFY] [Navbar.jsx](file:///C:/NestMate/frontend/src/components/layout/Navbar.jsx)
Update the "Post Free Ad" button style to slate/navy.

---

## Verification Plan

### Automated Tests
- Run `npm run dev` to ensure the project runs.
- Open a browser session to verify alignment, responsiveness, contrast, and interactive states.

### Manual Verification
- Visual check of desktop layout (side-by-side fields) and mobile layout (stacked fields).
- Verification of focus states, active states, and hover effects.
