# 🛡️ RLS Policies SOP

## General Principles
1. **Default Deny:** Every table must have RLS enabled.
2. **Tenant Scoping:** All queries must include a check against the `organization_id` in the JWT.
3. **Role Scoping:** Admins can perform `ALL`, members can perform `SELECT`, `INSERT`, `UPDATE` on their own records.

## Core Policies

### `public.users`
- **Select:** `auth.uid() = id` (User can see self) OR `auth.uid() IN (SELECT owner_id FROM organizations WHERE id = organization_id)` (Admin can see org members).
- **Update:** `auth.uid() = id` (Self-update limited fields).

### `public.organizations`
- **Select:** `auth.uid() = owner_id` OR `id = (SELECT organization_id FROM users WHERE id = auth.uid())`.

## CRM Policies

### `public.contacts` / `public.deals`
- **Logic:**
```sql
CREATE POLICY "tenant_isolation" ON "public"."contacts"
AS PERMISSIVE FOR ALL
TO authenticated
USING (
  (organization_id = (auth.jwt() -> 'app_metadata' ->> 'organization_id')::uuid)
);
```

## Security Audit Checklist
- [ ] RLS enabled on all tables?
- [ ] No `SERVICE_ROLE_KEY` used in frontend?
- [ ] `organization_id` column present on every multi-tenant table?
- [ ] JWT Hook validated and tested?
