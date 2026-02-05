# 📜 Project Constitution (gemini.md)

## 🏗️ Architectural Invariants
1. 3-Layer Architecture (Architecture/Navigation/Tools).
2. Deterministic Python scripts for Layer 3.
3. Logic changes must update SOPs before code.

## 📊 Data Schemas

### Core DB (`cxtrack-core-demo` / `Main_CxTrack_Demo`)

- **Organizations:** `organizations` table (id, name, slug, logo_url, settings).
- **Profiles:** `profiles` table (id references auth.users, organization_id, role, products, onboarding_completed).
- **Subscriptions:** `subscriptions` table (organization_id, product, plan, status).
- **Invitations:** `invitations` table (organization_id, email, role, token, expires_at).

### Schema Invariants
- `profiles.id` is a 1:1 mapping from `auth.users.id`.
- `organizations.slug` is unique for multi-tenant routing.
- `subscriptions` are scoped per organization and product.

## ⚖️ Behavioral Rules

### Operational
- **User Sync:** `handle_new_user()` trigger ensures `public.profiles` stays in sync with `auth.users`.
- **RBAC:** Roles: `owner`, `admin`, `member`, `viewer`.
- **RLS:** Enforced on all tables based on `organization_id`.
- **Auth:** Magic Link (Email OTP) and Google OAuth enabled.

## 🛠️ Maintenance Log

### [2026-02-04] Initial Setup
- **Action:** Deployed `core_schema` migration via Supabase CLI.
- **Fix:** Switched `uuid_generate_v4()` to `gen_random_uuid()` for compatibility.
- **Fix:** Prefixed `gen_random_bytes()` with `extensions.` schema.
- **Deliverable:** Created `lib/supabase-auth.ts`, `middleware.ts`, and Access UI.
- **Status:** Core Database LIVE.


## 🛠️ Maintenance Log
*To be defined.*
