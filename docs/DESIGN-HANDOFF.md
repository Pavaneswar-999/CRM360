# CRM360 Design Handoff

## Working design file

[Open CRM360 — Product Screens in Figma](https://www.figma.com/design/QRIZ9K3bhOQJPjfMOCENiz)

The file contains an original CRM360 exploration board for the landing direction and Focus Queue. It was created from the CRM360 design system; local source code and customer records were not exported into Figma.

Local visual reference: `docs/figma-crm360-exploration.png`.

## Stitch prompt for the next iteration

```text
Design a responsive B2B SaaS CRM called CRM360 for small sales teams.

Screens:
- Public landing page with an asymmetric split hero, one primary CTA, relationship workflow, feature proof, trust statement, and footer.
- Authenticated dashboard with a 250px sidebar, top search, four real metric cards, a database-derived Focus Queue, pipeline stage summary, recent activity, and quick actions.
- Lead detail view with overview, activity timeline, notes, tasks, owner, stage, estimated value, next action, and follow-up date.
- Mobile layout with a compact navigation drawer and stacked, touch-friendly controls.

Visual direction:
- Editorial clarity combined with modern SaaS precision.
- Warm paper canvas, cream surfaces, deep navy ink, copper primary signal, blue secondary structure, emerald success, and amber warning.
- Manrope for headings and DM Sans for body copy.
- 4px spacing rhythm; 14px cards; subtle tinted shadows; no heavy glassmorphism.
- Use asymmetric layouts, one canonical relationship-atlas image, and an original relationship/orbital motif only on the public landing page. Do not animate between unrelated generated frames.

Product behavior:
- Clear loading, empty, error, hover, focus, disabled, and destructive-confirmation states.
- Accessible contrast, visible labels, minimum 44px touch targets, and reduced-motion support.
- Do not invent charts, fake customer metrics, pricing, AI claims, or decorative WebGL in the authenticated workspace.
```

## Workflow

1. Explore 2–3 variants in Stitch using the prompt above.
2. Keep the structure that best communicates the next action in under five seconds.
3. Refine the chosen direction in Figma using the existing CRM360 board and components.
4. Compare against the running React app at desktop, tablet, and mobile widths.
5. Implement only changes that improve hierarchy, task completion, accessibility, or perceived performance.

## Reference sources

The research log in `docs/RESEARCH.md` records the CRM, motion, and UI references used for patterns. Premium references are inspiration only; CRM360 uses original visual assets and copy.
