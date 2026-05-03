# Project Structure

Feature-based architecture. Generic code in global folders; feature-specific logic in `src/features`.

---

## public/

- `assets/common` — global assets
- `assets/[feature]` — feature assets

## src/

```
src/
├─ app/           # Routes only. No logic. Import views from features.
├─ components/
│   ├─ ui/        # Pure design-system components (Button, Input, Modal)
│   └─ custom/    # Cross-feature components (DataTable, Pagination)
├─ lib/           # Shared utils (api-client, date, validators)
├─ config/        # env, routes, constants
├─ types/         # Global types (ApiResponse<T>, PaginatedResponse<T>)
├─ services/      # Shared API setup (http, interceptors, token refresh)
└─ features/
    └─ [feature]/ # Self-contained domain module
```

## Feature Structure

```
features/[feature]/
├─ views/         # Page-level containers (UsersView.tsx)
├─ components/    # Feature-only components
├─ hooks/         # State logic, combined queries, derived data
├─ queries/       # TanStack Query — fetch only
├─ mutations/     # TanStack Query — create/update/delete
├─ services/      # API calls for this feature
├─ types/         # Feature-specific types
├─ utils/         # Feature-specific helpers
└─ query-keys.ts  # Centralised query keys
```

## Data Flow

`View → Hook → Query/Mutation → Service → API Client`

## Naming

- Components: `PascalCase.tsx`
- Hooks: `usePascalCase.ts`
- Utils/services: `camelCase.ts`

## Rules

- `app/` has no business logic — views only
- Feature-specific types/utils stay inside the feature
- `lib/` and `services/` are global only; don't put feature code there
- For large features, group by sub-feature inside `queries/`, `components/`, etc.

# Special Instructions

- Group classes with `cn()`
- Responsive UI always
- Prefer `/components/ui` reusable components; create new ones only if needed
- For multi-variant components (e.g. Button), extend existing styles before adding new ones
- No Tailwind built-in colors — use `globals.css` variables; add missing colors there
- For images: add placeholder in code + tell me the exact `public/` path
- Keep full Tailwind classes in `/components/ui`, not in feature components
- Icons: use `lucide-react`
- Avoid hardcoded sizes (`w-[400px]`) — prefer Tailwind scale utilities (`w-96`)
- Use shadcn over custom components — install via `pnpm dlx shadcn add <>`
- One component per file
