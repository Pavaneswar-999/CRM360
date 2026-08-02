# CRM360 Visual Direction

The supplied references are used to study composition, type scale, material texture, and pace. CRM360 does not copy their artwork or screens.

## Editorial Signal Room

CRM360 pairs a high-contrast editorial public experience with an efficient application workspace. The landing page shows why customer context and follow-up matter; the app makes those actions easy to complete.

### Visual ingredients

- A text-free master image of tactile record cards and task tabs, placed behind live text with strong contrast.
- Large Manrope headings with deliberate line breaks, supported by small DM Mono labels.
- Mineral bone, carbon, moss, and a single muted citron accent.
- Ruled-grid and paper-grain texture that stays behind content.
- Rectangular shapes, tab edges, dividers, and thread strokes rather than planets, spheres, orbital lines, or generic 3D decoration.

### Page intent

| Surface | What it needs to communicate | Primary action |
| --- | --- | --- |
| Landing | A customer relationship moves from capture to a completed next action. | Create an account or explore a specific CRM area. |
| Sign in and registration | The form is secure, clear, and connected to a real workspace. | Sign in, create an account, or reset a password. |
| Dashboard | What needs attention now, backed by stored tasks and records. | Open tasks, create a record, or inspect the pipeline. |
| Customers and leads | Ownership and context around a real record. | Add, edit, view detail, assign, convert, or search. |
| Pipeline | Where opportunities stand and who should act next. | Update a real lead stage. |
| Tasks and notifications | Assigned work, due dates, and recent changes. | Create, complete, reassign, or mark updates read. |

### Motion rules

- Landing sections use subtle GSAP transforms and Lenis scroll smoothing. Content remains visible without JavaScript.
- App/auth use short Framer Motion transitions only.
- The optional Three.js scene is a lower-page visual detail: connected rectangular planes with a static fallback.
- Movement never blocks reading, typing, scrolling, keyboard use, or route navigation.

### Visual QA

Review at 375px, 768px, 1024px, and 1440px. At every size, check contrast, text wrapping, focus rings, click targets, empty states, error messages, and that every apparent control has a real result.
