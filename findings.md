# 🔍 Findings

## Research
- **Supabase Auth Hooks:** Use `auth.jwt()` hook to inject `organization_id` and `role` into the JWT claims for deterministic RLS.
- **Cross-Domain SSO:** Since projects are on different domains (`cxtrack-core`, `cxtrack-crm`), standard shared cookies (apex domain) won't work unless subdomains are used (`core.cxtrack.com`). 
- **SSO Handshake:** For separate domains, a redirection flow is required: Core -> Redirect with Token -> App -> Exchange Token for Session.
- **RLS Pattern:** Use `(auth.jwt() ->> 'organization_id')::uuid` in policies for high-performance multi-tenancy.

## Constraints
- **Keys:** Supabase keys and Google OAuth credentials are currently missing.
- **Domain:** Netlify demo URLs are distinct, requiring a robust cross-domain strategy or subdomain consolidation.
- **Shadow Accounts:** Must bypass normal email confirmation for "invite-first" flows.


## Discoveries
*Lessons learned and API nuances.*
