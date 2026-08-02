# CRM360 Brand and Interface System

CRM360 is a customer relationship workspace for teams that need a clear view of customers, leads, assigned work, and pipeline progress. It should feel crafted and dependable, not ornamental or generic.

## 1. Logo

The mark is a native SVG relationship thread: three connected points held by a single line. It represents customer context moving from one person and action to the next. The wordmark is `CRM360`, with the final `360` in citron. Keep the mark simple, legible at small sizes, and separate from third-party branding.

## 2. Typography

- **Display and page titles:** Manrope, 600–800, tight tracking.
- **Body, forms, and tables:** Manrope, 400–700, comfortable line height.
- **Dates, statuses, and small data labels:** DM Mono, used sparingly.
- **Rules:** no Inter, no decorative serif, no all-caps paragraph copy, and no low-contrast small text.

## 3. Brand colours

| Token | Value | Use |
| --- | --- | --- |
| Mineral bone | `#F1EFE7` | Page canvas and warm contrast |
| Paper | `#FFFDF7` | Elevated surfaces |
| Carbon ink | `#122019` | Main text and dark structures |
| Moss | `#23372D` | Navigation and supporting structure |
| Muted citron | `#A5B832` | Primary action and selected signal |
| Success | `#28724B` | Completed or positive state |
| Warning | `#A76E36` | Upcoming or caution state |
| Error | `#B8404A` | Destructive or overdue state |

Citron is the only brand accent. Semantic colours communicate state; they are not decoration.

## 4. Tagline and voice

**Every relationship. Every next move.**

Use concise, specific language. Describe what CRM360 does in a person’s workday: add a customer, assign a lead, plan a task, review a pipeline stage, or read an update. Avoid inflated claims, buzzwords, generic “AI” language, invented results, and filler.

## 5. Brand imagery

The product image is `client/public/crm360-signal-room-hero.png`: carbon studio materials, layered record cards, task tabs, and a single citron thread. It is used as one canonical source for the landing page and auth backdrop.

The image never supplies product data. CRM data is shown through live UI only after sign-in. Do not introduce people, stock-photo wallpaper, screens inside the image, copied brand marks, orbital scenes, or mismatched generated frames.

## 6. Layout system

- Marketing: 12 columns, a maximum 1240px rail, large editorial type, controlled asymmetry, and one primary action per section.
- Auth: full-canvas image treatment with a high-contrast, real form panel.
- App: fixed 252px navigation, 74px top bar, and a content rail capped at 1560px.
- Tablet: 6 columns; mobile: 4 columns with a navigation drawer and at least 44px touch targets.
- Operational screens favour real queues, tables, and action paths over equal-weight metric cards.

## 7. Texture and depth

Paper grain and ruled-grid details are CSS-only, pointer-inert, and nearly invisible. Shadows are broad and warm enough to establish depth but never become glows. No effect may make data harder to read.

## 8. Iconography

Lucide icons are used at 16–20px with accompanying labels where the action is not obvious. Icon-only controls have accessible names. The custom relationship-thread mark is the only product-specific icon.

## 9. Motion and accessibility

Landing motion is a progressive enhancement: Lenis and GSAP guide visual rhythm without holding back content. Framer Motion handles short page transitions in the app and auth flows. A reduced-motion preference removes nonessential movement. Focus remains visible, colour is never the only status cue, and every form has labels and useful error messages.

## State rules

Every working route must support loading, empty, error, success, and permission-denied states. Destructive actions require confirmation. Empty screens should tell the user what they can create next and take them there.
