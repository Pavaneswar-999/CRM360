# CRM360 Brand and Interface System

CRM360 is a relationship operating layer for small teams: composed, direct, and useful under pressure. The product should feel like a well-made instrument, not a template gallery. The public site can create a memorable moment; the authenticated app must make the next action easier to see and complete.

## 1. Logo

The mark is a central relationship node connected to three surrounding nodes. It represents context becoming useful through connection. The wordmark is `CRM360`, with `360` in the brand accent. Minimum size is 24px for the mark and 112px for the full lockup. Never redraw the mark with a generic network icon or use a third-party logo as the product identity.

## 2. Typography

- Display and page titles: Manrope, 600–800, tight tracking (`-0.045em` to `-0.075em`).
- Product body and controls: DM Sans, 400–700, 1.5–1.7 line height.
- Dense numeric metadata: system monospace only when it improves scanning; never use serif type in the application.
- Body copy is capped around 65 characters per line. Normal text must remain at least 14px on desktop and 16px on mobile where practical.
- Avoid Inter, generic serif fonts, oversized shouting headings, and low-contrast grey copy.

## 3. Brand colours

| Token | Value | Role |
| --- | --- | --- |
| Canvas | `#F2F0EA` | Warm paper background |
| Surface | `#FFFDF8` | Elevated workspace surface |
| Ink | `#17233A` | Primary text and headings |
| Steel | `#68758A` | Supporting text and metadata |
| Structure | `#D9DEE5` | Dividers and input borders |
| Signal copper | `#C5744D` | Primary action, links, active public states |
| Deep navy | `#101B31` | Hero depth and authenticated navigation |
| Signal blue | `#5570D7` | Secondary structure and pipeline states |
| Success | `#258B70` | Positive state, never the only indicator |
| Warning | `#BA7D2D` | Due soon and caution |
| Danger | `#C55362` | Errors and overdue state |

Copper is the recognisable CRM360 signal. Navy provides depth; blue, green, amber, and red are reserved for product meaning. There are no neon gradients, purple glows, or decorative colour changes between screens.

## 4. Tagline and voice

Primary tagline: **Every relationship. Every next step.**

Voice is calm, concrete, and accountable. Prefer “Review renewal health” over “Unlock powerful engagement.” Avoid vague AI copy, inflated metrics, and claims that cannot be demonstrated by a working route.

## 5. Brand imagery

CRM360 imagery is the relationship graph: nodes, paths, focus queues, activity traces, and human-readable work states. The landing hero uses one canonical original relationship-atlas image with a lightweight WebGL layer and static fallback. Application pages use real product previews and data compositions. Do not use stock-photo wallpaper, mismatched generated frames, broken remote images, or invented customer testimonials.

## 6. Layout system

- Public pages use asymmetric editorial splits, a 1240px content rail, framed product views, and one dominant action per section.
- Auth pages use a 52/48 split: focused form on the left, evidence of product value on the right.
- App pages use a fixed 252px sidebar, 74px top bar, and a content rail capped at 1560px.
- Data-heavy surfaces prefer structural dividers and whitespace over a wall of identical cards.
- Below 768px every multi-column layout collapses to one column, with no horizontal scroll and 44px touch targets.

## 7. Textures and depth

The base is near-white with a faint, static radial texture and soft navy depth only where hierarchy demands it. Shadows are broad and tinted toward navy; they are never neon outer glows. Grain is limited to pointer-inert backgrounds and is never applied to scrolling data surfaces.

## 8. Iconography

Lucide icons are used consistently at 16–20px with a 1.8–2px stroke. The custom CRM360 mark is the only bespoke icon. Icon-only controls always have an accessible name. Icons supplement labels; colour or iconography alone never communicates status.

## 9. Design style

**Relationship Atlas / Quiet Signal**: warm editorial clarity plus a precise operating instrument. Variance 7, motion 4, density 6. The landing page carries the material signature; the app earns trust through readable hierarchy, fast states, useful empty states, and visible ownership. Motion uses transform/opacity, respects reduced motion, and never delays a user’s work.

## State rules

Every real workflow includes loading, empty, error, success, and permission-denied states. Skeletons match the final layout. Errors explain recovery. Destructive actions require confirmation. Forms label inputs above the control, associate field errors, and announce submission state.

## Reference workflow

3D Websites informed the decision to keep the relationship graph meaningful and performance-bounded. AB Test informed the decision to preview value before asking for commitment and to make onboarding/recovery explicit. Logosystem informed the identity review approach—study type, shape, and system rather than copy a mark. HorizonX informed the production bar: design and code are reviewed together, with no throwaway mockups. Stitch and Figma remain design exploration/handoff tools; React is the production source of truth.
