# 🗄️ Database Schema SOP

## Core Database (`cxtrack-core-demo`)

### 1. Tables

#### `public.organizations`
- `id`: uuid, primary key, default gen_random_uuid()
- `name`: text, not null
- `slug`: text, unique, not null
- `plan`: text, default 'free'
- `owner_id`: uuid, references auth.users(id)
- `created_at`: timestamptz, default now()

#### `public.users`
- `id`: uuid, primary key, references auth.users(id)
- `email`: text, unique, not null
- `full_name`: text
- `organization_id`: uuid, references public.organizations(id)
- `role`: text, default 'member'
- `products`: text[], default '{}'
- `created_at`: timestamptz, default now()

### 2. Triggers

#### `on_auth_user_created`
- **Source:** `auth.users` (INSERT)
- **Logic:** 
  1. Check if email exists in `public.users` (Shadow account).
  2. If yes, update `id` with new `auth.uid`.
  3. If no, insert new record.

### 3. Auth Hooks (JWT Enrichment)

#### `custom_access_token_hook`
- **Function:** `auth.custom_access_token_hook`
- **Logic:**
  1. Determine `organization_id` for `auth.uid()`.
  2. Add `organization_id` to JWT claims.

## CRM Database (`cxtrack-crm-demo`)

### 1. Tables

#### `public.contacts`
- `id`: uuid, primary key
- `organization_id`: uuid, not null (Multi-tenant key)
- `first_name`: text
- `last_name`: text
- `email`: text
- `metadata`: jsonb

### 2. RLS Policies
- `ENABLE ROW LEVEL SECURITY ON public.contacts;`
- `CREATE POLICY "Org Isolation" ON public.contacts USING (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid);`
