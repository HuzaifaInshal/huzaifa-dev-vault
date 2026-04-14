import Code from "@/components/documentation/Code";
import DocLayout from "@/components/documentation/DocLayout";
import { CommonPageProps } from "@/features/navigation/navigationType";

const first = `
# Project Structure

This guide contains relevant information about project structure. Please note it precisely.
This project follows a **feature-based architecture**.
Generic code lives in global folders, while **feature-specific logic lives inside \`src/features\`**.

---

# public

Static assets served directly by the browser.

\`\`\`
public
 ├─ assets
 │   ├─ common
 │   └─ [feature]
 └─ favicons
\`\`\`

Rules:

- Global assets → \`assets/common\`
- Feature assets → \`assets/[feature]\`

---

# src

\`\`\`
src
 ├─ app
 ├─ components
 ├─ lib
 ├─ services
 ├─ types
 ├─ config
 └─ features
\`\`\`

---

# app (Next.js routing)

Contains **routes only**.

Rules:

- No business logic
- Only import views from features

Example:

\`\`\`tsx
import UsersView from "@/features/users/views/users.view";

export default function Page() {
  return <UsersView />;
}
\`\`\`

---

# components (global components)

\`\`\`
components
 ├─ ui
 └─ custom
\`\`\`

### ui

Reusable **design system components**

Examples:

\`\`\`
Button
Input
Modal
Dropdown
\`\`\`

Rules:

- No business logic
- Fully reusable

---

### custom

Reusable components used across features but not purely UI.

Examples:

\`\`\`
DataTable
Pagination
FileUploader
\`\`\`

---

# lib (global utilities)

Utilities shared across features.

Examples:

\`\`\`
api-client.ts
date.ts
utils.ts
validators.ts
\`\`\`

Rule:

If a utility is feature-specific, keep it inside the feature.

---

# config

Application configuration.

Examples:

\`\`\`
env.ts
routes.ts
constants.ts
\`\`\`

---

# types (global types)

Global reusable types.

Examples:

\`\`\`
ApiResponse<T>
PaginatedResponse<T>
ErrorResponse
\`\`\`

Feature-specific types should stay inside the feature.

---

# services (global API setup)

Shared API configuration.

Examples:

\`\`\`
http.ts
interceptors.ts
\`\`\`

Typically includes:

- axios/fetch client
- auth interceptors
- token refresh logic

---

# features (core architecture)

All domain logic lives here.

\`\`\`
features
 └─ [feature-name]
\`\`\`

Example:

\`\`\`
features
 ├─ users
 ├─ auth
 ├─ products
 └─ orders
\`\`\`

Each feature is **self-contained**.

---

# Feature Structure

\`\`\`
features
 └─ users
     ├─ views
     ├─ components
     ├─ hooks
     ├─ queries
     ├─ mutations
     ├─ services
     ├─ types
     ├─ utils
     └─ query-keys.ts
\`\`\`

---

# views

Page-level containers used by \`app\`.

Example:

\`\`\`
views
 ├─ UsersView.tsx
 └─ UserDetailsView.tsx
\`\`\`

---

# components

Components used only inside the feature.

Example:

\`\`\`
components
 ├─ UserCard.tsx
 ├─ UserTable.tsx
 └─ user-details
\`\`\`

---

# hooks

Feature-specific React hooks.

Example:

\`\`\`
hooks
 ├─ useUsers.ts
 └─ useUserDetails.ts
\`\`\`

Responsibilities:

- state logic
- combine queries
- derived data

---

# queries (TanStack Query)

Responsible only for **fetching data**.

Example:

\`\`\`ts
export const useUsersQuery = () =>
  useQuery({
    queryKey: usersQueryKeys.list(),
    queryFn: usersService.getUsers
  });
\`\`\`

---

# mutations (TanStack Query)

Responsible for **creating/updating/deleting data**.

Example:

\`\`\`ts
export const useCreateUserMutation = () =>
  useMutation({
    mutationFn: usersService.createUser
  });
\`\`\`

---

# services (feature API layer)

Handles API calls for the feature.

Example:

\`\`\`ts
export const usersService = {
  getUsers: () => apiClient.get("/users"),
  getUser: (id: string) => apiClient.get(\`/users/\${id}\`),
  createUser: (data) => apiClient.post("/users", data)
};
\`\`\`

Purpose:

- keep queries clean
- reuse API logic
- easier testing

---

# types (feature types)

Feature-specific types.

---

# utils

Feature-specific helper functions.

---

# query-keys

Centralized **TanStack Query keys**.

Example:

\`\`\`ts
export const usersQueryKeys = {
  all: ["users"],
  list: () => [...usersQueryKeys.all, "list"],
  detail: (id: string) => [...usersQueryKeys.all, "detail", id]
};
\`\`\`

---

# Sub-feature Pattern (optional)

For large features, group logic by sub-feature. Basically implementation of layered structure for each feature inside my root featured structure.

Example:

\`\`\`
users
 ├─ components
 │   ├─ users-list
 │   └─ user-details
 ├─ queries
 │   ├─ users-list
 │   └─ user-details
\`\`\`

---

# Data Flow

Typical request flow:

\`\`\`
View
 → Hook
 → Query / Mutation
 → Service
 → API Client
\`\`\`

---

# Naming Conventions

Follow these naming rules:

**Components**

\`\`\`
PascalCase.tsx (e.g. UserCard.tsx)
\`\`\`

**Functions / utilities**

\`\`\`
camelCase.ts (e.g. formatUserName.ts)
\`\`\`

**Hooks**

\`\`\`
usePascalCase.ts (e.g. useUsers.ts)
\`\`\`
`;

const second = `
# Special Instructions

- use cn to group same type of classes
- UI must be responsive
- FOCUS on using reusable components from /components/ui
- if any reusable component does not fit the requirement then only create another one
- for components with multiple option/ui support in it e.g. button, use a style that fits perfectly to UI if not there then add your own style
- do not use tailwinds built in colors, use ones specified in globals.css, if a color is not present then add that there.
- if you encounter any picture that needs to be placed in design then add it in code, and tell me explicitly to add that image to where in public folder.
- please avoid writing complete classes in functional components (components inside feature folders) instead write complete classes in ui components.
- for icons its better to use luicide react
- while writing tailwind classes do not specify hardly like w-[400px] instead if you know its alternative then use that like w-100
- use shadcn components over creating your native (do not create shadcn file directly instead call the command, pnpm dlx shadcn add <>)
- while creating UI keep the components in seperate pages
`;

const firstA = `
# Project Structure

Feature-based architecture. Generic code in global folders; feature-specific logic in \`src/features\`.

---

## public/

- \`assets/common\` — global assets
- \`assets/[feature]\` — feature assets

## src/

\`\`\`
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
\`\`\`

## Feature Structure

\`\`\`
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
\`\`\`

## Data Flow

\`View → Hook → Query/Mutation → Service → API Client\`

## Naming

- Components: \`PascalCase.tsx\`
- Hooks: \`usePascalCase.ts\`
- Utils/services: \`camelCase.ts\`

## Rules

- \`app/\` has no business logic — views only
- Feature-specific types/utils stay inside the feature
- \`lib/\` and \`services/\` are global only; don't put feature code there
- For large features, group by sub-feature inside \`queries/\`, \`components/\`, etc.
`;

const secondA = `
# Special Instructions

- Group classes with \`cn()\`
- Responsive UI always
- Prefer \`/components/ui\` reusable components; create new ones only if needed
- For multi-variant components (e.g. Button), extend existing styles before adding new ones
- No Tailwind built-in colors — use \`globals.css\` variables; add missing colors there
- For images: add placeholder in code + tell me the exact \`public/\` path
- Keep full Tailwind classes in \`/components/ui\`, not in feature components
- Icons: use \`lucide-react\`
- Avoid hardcoded sizes (\`w-[400px]\`) — prefer Tailwind scale utilities (\`w-96\`)
- Use shadcn over custom components — install via \`pnpm dlx shadcn add <>\`
- One component per file
`;

const CreatingUiWithSSOrFigmaJson = (args: CommonPageProps) => {
  return (
    <DocLayout {...args}>
      <p>Start by creating 2 files in /agent-docs:</p>

      <h5>ui-creation-special-instructions.md</h5>
      <Code language="md">{second}</Code>

      <h5>project-structure.md</h5>
      <Code language="md">{first}</Code>

      <p>If struggling with LLM context then use their minmalistic versions:</p>

      <h5>ui-creation-special-instructions.md</h5>
      <Code language="md">{secondA}</Code>

      <h5>project-structure.md</h5>
      <Code language="md">{firstA}</Code>

      <h1>Creating UI with figma json</h1>
      <p>Use this prompt:</p>
      <Code language="md">{`
      I am attaching figma json for the UI of page [page route] to be created. Your job is to convert it to a pixel perfect code. Please refer to /agent-docs/ui-creation-special-instructions.md for all the guidelines related to creating a code according to my criteria and format. The json is how the design is set on the figma, you need to convert it into a pixel perfect code using grids and flex boxes. Please do not use absolute and relative positioning unless extremely necessary or only for images/objects that could not be placed in screen like a typical grid/flex layout.

Json:
[attach json here]
        `}</Code>

      <h1>Creating UI with figma links</h1>
      <p>Use this script:</p>
      <Code language="py">
        {`
import os
import requests
import json
import re
import sys

# --- CONFIGURATION ---
# This pulls the token from your system's environment variables
FIGMA_TOKEN = os.getenv('FIGMA_ACCESS_TOKEN')

def extract_ids_from_url(url):
    """Extracts file key and node ID from a standard Figma URL."""
    file_key_match = re.search(r'design/([^/]+)', url)
    # Node IDs in URLs use '-' but the API expects ':'
    node_id_match = re.search(r'node-id=([^&]+)', url)
    
    if not file_key_match:
        print("Error: Could not find File Key in URL.")
        sys.exit(1)
        
    file_key = file_key_match.group(1)
    node_id = node_id_match.group(1).replace('-', ':') if node_id_match else None
    
    return file_key, node_id

def prune_node(node):
    """Recursively removes noise to keep the JSON AI-friendly."""
    keep_keys = {
        'id', 'name', 'type', 'visible', 'children',
        'absoluteBoundingBox', 'fills', 'strokes', 'strokeWeight',
        'characters', 'style', 'layoutMode', 'primaryAxisAlignItems',
        'counterAxisAlignItems', 'paddingLeft', 'paddingRight', 
        'paddingTop', 'paddingBottom', 'itemSpacing', 'cornerRadius'
    }
    
    pruned = {k: v for k, v in node.items() if k in keep_keys}
    
    if 'children' in pruned:
        pruned['children'] = [prune_node(child) for child in pruned['children']]
        
    return pruned

def fetch_and_display(url):
    if not FIGMA_TOKEN:
        print("Error: FIGMA_ACCESS_TOKEN environment variable is not set.")
        sys.exit(1)

    file_key, node_id = extract_ids_from_url(url)
    
    # We use the 'nodes' endpoint to get specific component data
    endpoint = f"https://api.figma.com/v1/files/{file_key}/nodes?ids={node_id}"
    headers = {"X-Figma-Token": FIGMA_TOKEN}
    
    try:
        response = requests.get(endpoint, headers=headers)
        response.raise_for_status() # Raises an error for 4xx/5xx responses
        
        data = response.json()
        
        # Figma returns nodes indexed by their ID string
        if node_id not in data['nodes']:
            print(f"Error: Node {node_id} not found in file.")
            return

        raw_node = data['nodes'][node_id]['document']
        clean_data = prune_node(raw_node)
        
        print(json.dumps(clean_data, indent=2))
        
    except requests.exceptions.RequestException as e:
        print(f"API Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python script.py <FIGMA_URL>")
    else:
        fetch_and_display(sys.argv[1])
`}
      </Code>
      <p>In order to run this script you can:</p>
      <Code language="md">{`
      sudo nano ~/scripts/figma_extractor.py
      `}</Code>
      <p>
        Then paste the code and save it. To make the script globally accessible:
      </p>
      <Code language="md">{`
      chmod +x ~/scripts/figma_extractor.py
sudo ln -s ~/scripts/figma_extractor.py /usr/local/bin/generate_figma_json
      `}</Code>
      <p>Now you can call:</p>
      <Code language="md">{`
      generate_figma_json <figma link>
      `}</Code>
      <p>Use this prompt:</p>
      <Code language="md">{`
      I am attaching figma links for the UI of pages [page route] to be created. Your job is to convert it to a pixel perfect code. However the first step would be to extract the json from figma links for that purpose you must first execute a bash command \`generate_figma_json <figma_link>\` it will return you the json of that particular figma link. Please refer to /agent-docs/ui-creation-special-instructions.md for all the guidelines related to creating a code according to my criteria and format. The extracted json is how the design is set on the figma, you need to convert it into a pixel perfect code using grids and flex boxes. Please do not use absolute and relative positioning unless extremely necessary or only for images/objects that could not be placed in screen like a typical grid/flex layout.

Figma Links:
[attach figma links here]
        `}</Code>

      <h1>Creating UI with images</h1>
      <p>Use this prompt:</p>
      <Code language="md">{`
      I am attaching figma images for the UI of pages [page route] to be created. Your job is to extract whats inside the image and convert it to a pixel perfect code. Please refer to /agent-docs/ui-creation-special-instructions.md for all the guidelines related to creating a code according to my criteria and format. Please write code using grids and flex boxes. Please do not use absolute and relative positioning unless extremely necessary or only for images/objects that could not be placed in screen like a typical grid/flex layout.

Images attached:

(If extending)
You can find the reference code that could be similiar to image on here: [component name]

      `}</Code>
    </DocLayout>
  );
};

export default CreatingUiWithSSOrFigmaJson;
