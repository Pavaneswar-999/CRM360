# CRM360 Design Handoff

## Working design file

[Open CRM360 — Editorial Signal Room in Figma](https://www.figma.com/design/BjdhmBVjcVCywUIq41wd8Q)

The Figma file holds the CRM360 visual tokens, component rules, and responsive directions. It is a design source, not a copy of the application or customer data. The React application remains the working product.

## Direction

CRM360 is an operational CRM for teams that need to see the next action without losing the customer context around it. The visual language is editorial and material, while the authenticated application stays direct and easy to scan.

- **Tagline:** Every relationship. Every next move.
- **Type:** Manrope for display and interface copy; DM Mono only for dates, short status labels, and dense metadata.
- **Palette:** mineral bone canvas, carbon and moss structure, and muted citron for the primary signal. Success, warning, and error colours remain semantic and distinct.
- **Texture:** restrained paper grain and ruled-grid details in CSS/SVG. Texture never sits over data or reduces contrast.
- **Logo:** the CRM360 relationship-thread SVG mark. It is original to this project and appears with the CRM360 wordmark.
- **Layout:** 12 columns on desktop, 6 on tablet, and 4 on mobile. Marketing uses deliberate asymmetry; application pages use compact, predictable operational layouts.

## Canonical visual asset

`client/public/crm360-signal-room-hero.png` is the single approved generated image. It is text-free and depicts layered index cards and task tabs with a quiet citron path. It contains no people, screens, logos, charts, planets, spheres, satellites, or orbit lines.

The landing hero, authentication backdrop, and final landing callout use controlled crops of this same image with CSS overlays. Do not generate separate start/end images or crossfade different generated scenes. All text, buttons, labels, and meaningful content remain live HTML.

## Motion and interaction rules

- Lenis and GSAP are limited to the public landing page. They enhance scroll rhythm but never hide content or replace native keyboard scrolling.
- Framer Motion is limited to short route transitions in authentication and the app.
- The lower landing enhancement is a contained Three.js scene of rectangular record planes and connection strokes. It has a static fallback and contains no essential information.
- `prefers-reduced-motion` disables nonessential movement.
- Every visible link, button, filter, search field, and form must carry out its stated action. Remove an element if the product cannot support it.

## Product writing rules

Write plainly and tie claims to existing behavior. Prefer “Assignments and tasks with an upcoming due date” over abstract language. Do not claim AI, automation, live numbers, customer results, or features that are not implemented.

## QA before release

1. Check the landing page, auth pages, dashboard, and record management at 375px, 768px, 1024px, and 1440px.
2. Confirm the primary action on every screen leads to the correct route or API operation.
3. Check focus visibility, labels, keyboard navigation, contrast, loading, empty, error, success, and permission states.
4. Confirm the product still works when the Three.js canvas is unavailable or motion is reduced.
5. Use Playwright screenshots and Axe scans as a guardrail; validate real CRUD flows against the deployed API before presenting the site.

## Reference practice

Figma and Stitch are used for design exploration. Product references informed hierarchy, scrolling, and interaction patterns, but no external screen, logo, or paid asset is copied into CRM360.
