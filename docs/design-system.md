# UNIFI design system

## Purpose

Centralize visual language, interaction patterns, and reusable UI so RateGain UNIFI screens stay consistent, accessible, and easy to rebrand without rewriting product logic.

## Architecture

```
src/design-system/
  styles/tokens.css   # CSS custom properties (primitives + semantic + dark)
  tokens/index.ts     # TS maps for showcase / programmatic use
  utils/cn.ts         # class merge helper
  icons/              # icon size scale
  components/         # generic primitives
  patterns/           # composed product-adjacent layouts
  index.ts            # barrel exports
```

- **Tokens** define values once.
- **Components** consume semantic tokens only (no raw hex).
- **Patterns** compose components for repeated page structures.
- Product-specific widgets (KpiCard, PeriodSelector, charts) stay in `src/components/`.

## Token structure

1. **Primitives** (`--ds-navy-950`, `--ds-blue-700`, …) — stable palette.
2. **Semantic roles** (`--ds-bg-primary`, `--ds-text-secondary`, `--ds-brand-primary`, …) — what UI means.
3. **Tailwind bridge** — `src/index.css` `@theme` maps legacy colour names (`navy`, `rg-blue`, …) to DS variables so existing screens keep working during migration.

### Theme usage

- Default: light (`:root`).
- Dark readiness: set `data-theme="dark"` on a root element. Dark is structured but **not** enabled in the product UI yet.
- Change brand colour globally by editing semantic brand roles in `tokens.css` (and primitives if needed).

## Component categories

| Category | Examples |
|---|---|
| Actions | Button, IconButton, Link |
| Forms | Input, Textarea, Select, Checkbox, Switch, FormField, Label, HelperText, ErrorMessage |
| Display | Card, Badge, Table, Divider, Spinner, Skeleton, EmptyState, Alert, Tooltip, Tabs |
| Overlays | Modal, Drawer |
| Patterns | PageHeader, FilterBar, FormSection, LoadingState, ErrorState |

## Import conventions

```ts
import { Button, Input, Modal } from '@/design-system'
```

Path alias `@` → `src` (Vite + `tsconfig.app.json`). Prefer the barrel; avoid deep imports unless troubleshooting.

## Accessibility principles

- Semantic HTML (`button`, `label`, `dialog`, `table`).
- Visible focus rings via `focus-visible` + `--ds-border-focus`.
- Icon-only controls require an accessible `label` / `aria-label`.
- Errors use `role="alert"` / `aria-invalid`.
- Overlays close on Escape and expose `aria-modal`.

## Responsive principles

This product is **desktop-first** (`body { min-width: 1280px }`). DS components are fluid within that canvas; do not introduce a mobile redesign without product approval. Showcase uses wrapping flex layouts for denser demos.

## Contribution guidelines

1. Add or change tokens in `styles/tokens.css` first; mirror TS maps in `tokens/index.ts` when needed for docs.
2. New components go under `components/` (generic) or `patterns/` (composed). Export from `index.ts`.
3. Use `cn()` for class composition; accept `className`.
4. Prefer semantic variant names (`primary`, `destructive`) — never colour-named components.
5. Document props in `docs/component-api.md`.
6. Show new states in `/design-system` (dev only).

### How to add or update a token

1. Add primitive if the hex is new.
2. Map a semantic role (or update an existing one).
3. If legacy Tailwind names need the value, update `@theme` in `index.css`.
4. Avoid hard-coding the hex in components.

### How to add a new component

1. Implement under `components/` with tokens, variants, focus, and ref forwarding where appropriate.
2. Export from `index.ts`.
3. Add a showcase section and API docs.
4. Do not embed report/business copy inside the primitive.

### How to change the product’s visual style globally

Edit semantic tokens (brand, radius, shadow, font) in `tokens.css`. Most migrated screens pick up the change automatically. Legacy screens still using `bg-navy` / `text-rg-blue` also update via the `@theme` bridge until fully migrated.

## Common mistakes to avoid

- Hard-coding hex or arbitrary Tailwind colours in new code.
- Importing product components into the design system.
- Enabling dark mode in the app chrome without a full contrast pass.
- Deleting `src/components/ui/*` before call sites are migrated.
- Shipping the showcase route in production navigation (it is gated by `import.meta.env.DEV`).
