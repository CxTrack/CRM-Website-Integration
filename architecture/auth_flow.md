# 🔐 SSO & Auth Flow SOP

## Overview
This document defines the deterministic logic for Single Sign-On (SSO) across CxTrack products using Supabase Core as the Central Identity Provider (IdP).

## 1. Authentication Flow
1. **Initiation:** User visits `cxtrack-core` /access page.
2. **Method:** User logs in via Email/Password or Google OAuth.
3. **Trigger:** On successful auth, a Supabase PostgreSQL Trigger syncs the `auth.users` record to `public.users`.
4. **JWT Enrichment:** The `auth.jwt()` hook (PostgreSQL function) executes.
    - Fetch `organization_id` and `role` from `public.users`.
    - Inject these into the `app_metadata` or top-level JWT claims.
5. **Redirection:**
    - If successful, redirect to the `REDIRECT_URL_WORKSPACE`.
    - Cross-domain session sharing is handled via URL parameters (short-lived tokens) or shared cookies if subdomains are used.

## 2. JWT Data Shape
The enriched JWT must contain:
```json
{
  "https://cxtrack.com/claims": {
    "org_id": "uuid",
    "role": "admin|member",
    "products": ["crm", "website"]
  }
}
```

## 3. Shadow Accounts (Invite Flow)
- Admin invites a user by email.
- A `public.users` record is created with `organization_id` but no `auth.uid`.
- User clicks magic link -> signs up -> Trigger matches `email` and links `auth.uid`.

## 4. Edge Cases & Error Handling
- **No Organization:** If a user exists but has no `organization_id`, redirect to `/setup-organization`.
- **Expired Tokens:** Redirect back to Core for re-authentication.
- **Cross-Org Breach:** RLS policies must block any query where `organization_id != JWT.org_id`.
