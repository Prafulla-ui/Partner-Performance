# Component API

Import all primitives from `@/design-system` unless noted.

---

## Button

**Purpose:** Primary action control.  
**Import:** `import { Button } from '@/design-system'`

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `primary \| secondary \| ghost \| destructive \| link` | `primary` | Semantic, not colour-named |
| `size` | `sm \| md \| lg` | `md` | Ignored for `link` |
| `loading` | `boolean` | `false` | Sets `aria-busy`, disables |
| `leftIcon` / `rightIcon` | `ReactNode` | — | Hidden while loading |
| `className` | `string` | — | Merged via `cn` |
| … | native button attrs | — | `type` defaults to `button` |

**States:** default, hover, focus-visible, disabled, loading.  
**When to use:** Form submits, primary CTAs, toolbar actions.  
**When not:** Navigation between pages — use router `Link` or DS `Link`.  
**a11y:** Keyboard focus ring; loading announced via `aria-busy`.

```tsx
<Button variant="primary" loading={busy}>Save</Button>
```

---

## IconButton

**Purpose:** Compact icon-only action.  
**Props:** `label` (required), `variant` (`ghost` \| `secondary`), children = icon.  
**a11y:** `aria-label` + `title` from `label`.

---

## Input / Textarea / Select

**Purpose:** Text entry and native select.  
**Shared:** `invalid`, native attrs, ref forwarding, focus ring.  
**Select:** requires `options: { value, label }[]`.

**When to use:** Forms and filters.  
**When not:** Multi-select / date range — keep product PeriodSelector for now.

---

## FormField, Label, HelperText, ErrorMessage

**Purpose:** Consistent labelling and validation messaging.  
**FormField props:** `label`, `htmlFor`, `required`, `helper`, `error`, `children`.  
**a11y:** ErrorMessage uses `role="alert"`; required shows visual `*`.

---

## Checkbox / Switch

**Checkbox:** native input + `label` string.  
**Switch:** `checked`, `onChange(boolean)`, `label` (visible + `aria-label`).

---

## Card / CardHeader

**Purpose:** Surface container matching `.surface-card` language.  
**Card:** `padded` (default true), `className`.  
**CardHeader:** `title`, `description?`, `action?`.

---

## Badge

**Purpose:** Compact status / meta chip.  
**Tone:** `neutral | brand | success | warning | danger | info`.  
**When not:** Long sentences — use Alert.

---

## Alert

**Purpose:** Inline feedback.  
**Tone:** `info | success | warning | error`.  
**Props:** `title?`, `children`.

---

## Modal / Drawer

**Purpose:** Overlay dialogs.  
**Shared props:** `open`, `title`, `onClose`, `children`, `footer?`, `width?`.  
**Behaviour:** Escape + backdrop close; `role="dialog"` + `aria-modal`.  
**When:** Confirmations, short forms (Modal); filters / generate flows (Drawer).

---

## Table

**Purpose:** Simple data table.  
**Props:** `headers: string[]`, `rows: ReactNode[][]`.  
**When not:** Complex sortable report tables — keep product `DataTable` until migrated.

---

## Tabs

**Purpose:** Segmented tablist.  
**Props:** `value`, `onChange`, `options: { value, label }[]`.  
**a11y:** `role="tablist"` / `tab` / `aria-selected`.

---

## EmptyState / Spinner / Skeleton / Divider / Tooltip / Link

| Component | Key props | Notes |
|---|---|---|
| EmptyState | `title`, `body?`, `action?` | Dashed panel |
| Spinner | `label?` | `role="status"` |
| Skeleton | `className` | Pulse placeholder |
| Divider | `className` | Horizontal rule |
| Tooltip | `text`, `children` | Hover / focus-within |
| Link | `href`, `children` | Styled anchor |

---

## Patterns

### PageHeader
`title`, `description?`, `action?` — page title row.

### FilterBar
Wraps filter controls in a wrapping flex row.

### FormSection
Bordered section with title + description + children stack.

### LoadingState / ErrorState
Full-row loading spinner text; inline error panel.

---

## Utilities

- `cn(...classes)` — conditional class merge.
- `colorPrimitives`, `spacingScale`, `radiusScale`, `typographyScale`, `iconSizes` / `iconSize` — token maps for docs and tools.
