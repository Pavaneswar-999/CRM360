# CRM360 visual direction

This document turns the supplied reference images into an implementable product direction. The references are used for composition, typography, pacing, and presentation—not copied artwork or screens.

## What the references teach us

- Editorial composition: a strong display title, one dominant visual idea, small supporting labels, and generous negative space.
- Material feeling: imagery should have a deliberate surface treatment—soft light, grain, shadow, or translucency—not a random stock-photo banner.
- Information hierarchy: the large statement establishes the mood; the smaller metadata explains what the viewer is seeing.
- UI/UX clarity: visual design and interaction design are separate concerns. A beautiful presentation still needs obvious next actions, keyboard access, useful empty states, and honest system status.

## CRM360 translation

CRM360 uses a “Relationship Atlas” visual language: a calm working surface with a precise network motif. The product visual is the relationship graph, not a generic space scene.

### Brand system

- Logo: a custom relationship-node mark with a stable silhouette at 16–32px.
- Display type: Manrope for decisive, compact page and hero headlines.
- Reading type: DM Sans for forms, tables, helper text, and long descriptions.
- Palette: ink `#17263B`, navy `#142C4B`, CRM blue `#3C64D8`, active green `#209D78`, warning amber `#C18A2D`, alert red `#C95868`, mist `#F6F8FB`.
- Tagline: “Every relationship. Every next step.”
- Imagery: data-led relationship scenes, restrained WebGL nodes, soft blue-white surfaces, and quiet texture. No decorative image is allowed to imply a feature that does not exist.
- Layout: 12-column marketing compositions, asymmetrical feature grids, 8px spacing rhythm, 44px minimum interactive controls, and a readable content width.
- Texture: barely visible grain/radial light only; it must never reduce text contrast or compete with data.
- Icons: Lucide for operational controls, custom inline SVG for the brand mark, and consistent semantic color treatment.
- Style: editorial landing pages paired with dense, calm, permission-aware application surfaces.

## Motion rules

- Landing hero: the relationship graph loads lazily and responds to pointer movement without trapping scroll or requiring zoom.
- Product screens: transitions clarify state changes only—opening a detail view, completing a task, moving a lead, or changing filters.
- Reduced motion: all nonessential animation is disabled under `prefers-reduced-motion`.
- Failure state: WebGL has a static fallback, and network/API failures explain what the user can do next.

## Visual QA checklist

Before calling a page complete, review it at 1440px, 1024px, 768px, and 390px widths:

1. Can the page’s primary action be identified in three seconds?
2. Does every visible control navigate or perform a real operation?
3. Are headings, helper text, table values, and error messages readable without zooming?
4. Does the layout have a clear focal point rather than equal-weight cards?
5. Does the page still work with no WebGL, no database, keyboard navigation, and reduced motion?
6. Are empty, loading, success, and error states as designed as the default state?

## Reference practice

The supplied reference sites and tools inform the workflow: 3D Websites for restrained interactive canvas ideas, AB Test Design for conversion and onboarding questions, Logosystem for mark exploration, HorizonX for design/code parity, and Figma/Stitch for composition exploration. Final CRM360 assets remain original and tied to the CRM problem statement.
