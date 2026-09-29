# Migration guide

## Approach

Migrate **one screen at a time**. Do not delete `src/components/ui/*` until unused. Prefer adapters if a quick rename is needed.

## Reference migration (done)

**Screen:** `src/pages/Login.tsx`  
**Changes:** Replaced `PrimaryButton`, raw inputs, and demo badge with DS `Button`, `Input`, `FormField`, `Card`, `Badge`, semantic colour tokens. Auth logic, credentials, and layout structure unchanged.  
**Showcase:** `/design-system` (development builds only via `import.meta.env.DEV`).

## Retain (product / domain)

Keep until a dedicated wave:

- `KpiCard`, `TrendIndicator`, `Sparkline`, chart wrappers
- `PeriodSelector`, `ModuleChecklist`, `AiInsightCard`, `RecommendationCard`
- `GenerateReportDrawer`, Edit / Share / Download modals
- `DataTable` (complex report tables)
- Auth / report contexts and routing

## Refactor next (map old → new)

| Existing | Design system |
|---|---|
| `PrimaryButton` | `Button` (`variant="primary"`) |
| `SecondaryButton` | `Button` (`variant="secondary"`) |
| `GhostButton` | `Button` (`variant="ghost"`) |
| `TextInput` / raw `<input>` | `Input` + `FormField` |
| Filter `Select` | `Select` |
| `ConfirmModal` | `Modal` |
| `SideDrawer` | `Drawer` |
| `DemoDataBadge` / status pills | `Badge` + tone |
| `EmptyState` (ui) | `EmptyState` (DS) — compare APIs first |
| `SectionHeader` | `CardHeader` / `PageHeader` |
| Ad-hoc spinner markup | `Spinner` / `LoadingState` |

## Duplicate styles to remove (after call sites move)

- Hard-coded hex in JSX (`#F3F6FB`, etc.)
- One-off button class strings duplicated across forms
- Multiple focus styles; standardize on DS focus ring

## Recommended screen order

1. ~~Login~~ ✅  
2. Report library toolbar / filters (`ReportLibrary`)  
3. Shared modals (Share, Confirm)  
4. Generate / Edit report drawers  
5. Report detail chrome (headers, module chrome) — leave charts last  
6. Thin-wrap or delete legacy `components/ui` buttons/inputs when unused

## Risks and regression checks

- **Visual drift:** compare Login and library against screenshots before/after token tweaks.
- **Auth flow:** wrong password still shows error; success still redirects.
- **Desktop width:** do not drop `min-width: 1280px` without product OK.
- **GitHub Pages base path:** showcase and login must respect `basename`.
- **Dark theme:** tokens exist; enabling UI dark mode needs a full contrast audit first.

### Checklist per migrated screen

- [ ] Business logic / API / context usage unchanged  
- [ ] Keyboard focus visible on interactive controls  
- [ ] Error / disabled / loading states covered  
- [ ] No new raw hex colours  
- [ ] Lint + build pass  

## Remaining work

- Migrate ReportLibrary filters and cards to DS primitives.  
- Replace ConfirmModal / SideDrawer call sites.  
- Align Badge tones with InternalOnly / NotShared / CustomerVisible badges (product copy stays).  
- Optionally add thin re-exports from `components/ui/Buttons.tsx` → DS Button for incremental adoption.  
- Full theme toggle only after dark contrast review.
