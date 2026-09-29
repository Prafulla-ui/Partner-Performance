# Design system audit — UNIFI Partner Performance Report

**Date:** 25 Sep 2026  
**Project:** Partner Performance & Growth Report (UNIFI prototype)

## Current technology and styling setup

| Area | Finding |
|---|---|
| Language | TypeScript (strict, `verbatimModuleSyntax`) |
| Framework | React 19 + Vite 8 |
| Routing | React Router 7 |
| Styling | Tailwind CSS **v4** via `@tailwindcss/vite` — tokens live in `src/index.css` `@theme` |
| UI libraries | None (no MUI/Chakra/Radix). Charts: Recharts. Icons: Lucide |
| Path alias | **Configured** — `@` → `src` (Vite + `tsconfig.app.json`) |
| Storybook | Not installed |
| Lint | `oxlint` |
| Desktop-first | `body { min-width: 1280px }` — intentionally not mobile-first |

## Existing visual patterns

- **Brand navy** `#0F1F33` + muted `#4A5B70`
- **Brand blue** `#1B4F9C` / bright `#2563EB` / soft `#E8EEF8`
- **Feedback:** positive, warning, danger, teal, AI purple
- **Surfaces:** canvas wash + `.surface-card` (white, line border, soft shadow, blur)
- **Typography:** Plus Jakarta Sans; 10–11px uppercase labels; 15–22px section titles; tabular numbers
- **Radius:** mostly `rounded-lg` / `rounded-2xl` / `rounded-full` pills
- **Controls:** h-8/h-9; segmented controls; native selects; primary gradient buttons

## Inconsistencies found

1. Hex and Tailwind colour names mixed (`#F3F6FB`, `slate-*`, `rg-blue`) without semantic roles.
2. Duplicate button definitions (`PrimaryButton` / `SecondaryButton` / `GhostButton`) vs raw `button` classes in forms.
3. Two table styles: shared `DataTable` vs ad-hoc markup elsewhere.
4. Icon treatments vary (blue gradient → later slate grey on KPIs).
5. Focus rings inconsistent / often missing on custom controls.
6. No dark-theme token layer (light-only CSS vars).
7. Spacing and type sizes chosen ad-hoc (`text-[10px]`, `text-[15px]`, `gap-5`) without a named scale.
8. Product components (`KpiCard`, `ModuleChecklist`) sit beside primitives in `components/ui`.

## Reusable components already available

Under `src/components/ui/`: Buttons, Badges, DataTable, FilterBar/Select/TextInput, SegmentedControl, ConfirmModal, SideDrawer, ChartContainer, SectionHeader, StatusBadge, EmptyState, KpiCard, TrendIndicator, MetricTooltip, PeriodSelector, ModuleChecklist, AiInsightCard, RecommendationCard, Sparkline.

Product-specific: GenerateReportDrawer, Edit/Share/Download modals, charts, ConversionFunnel.

## Components that should be created (DS layer)

**Primitives:** Button, IconButton, Input, Textarea, Select, Checkbox, Label, FormField, HelperText, ErrorMessage, Card, Badge, Divider, Spinner, Skeleton, Tooltip, Modal, Drawer, Tabs, Alert, EmptyState (generic), Table.

**Patterns:** PageHeader, FilterBar, FormSection, EmptyStatePanel, LoadingState.

**Defer:** MultiSelect, DatePicker (keep PeriodSelector as product), Toast system, Sidebar (not used).

## Recommended folder structure

```
src/design-system/
  tokens/           # CSS + TS semantic tokens
  styles/           # theme CSS imported by index.css
  utils/            # cn, focus helpers
  components/       # primitives
  patterns/         # composed layouts
  icons/            # re-export Lucide sizes
  docs/             # in-app notes
  index.ts          # barrel
docs/
  design-system-audit.md
  design-system.md
  component-api.md
  migration-guide.md
```

Import: `import { Button, Input } from '@/design-system'`

## Migration risks

- OneDrive/file sync can stall builds; prefer incremental file writes.
- Replacing all `PrimaryButton` imports in one pass risks regressions — keep thin adapters.
- Desktop-only layout must not be “fixed” into a mobile redesign without product sign-off.
- Chart colours are intentional brand hues — map via tokens, don’t invent a new palette.

## Proposed implementation sequence

1. Tokens + CSS variables (light + dark readiness) wired into Tailwind `@theme`.
2. Utils + core primitives (Button, Input, Select, Card, Badge, Modal, Drawer).
3. Patterns + barrel + path alias.
4. Internal showcase route (`/design-system`).
5. Migrate **Login** as reference screen.
6. Document API + migration map; leave ReportDetail/Library on existing UI until next wave.
