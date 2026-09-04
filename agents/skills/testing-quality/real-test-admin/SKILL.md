---
name: real-test-admin
description: Drive the Neo Health ADMIN dashboard against a real deployment (Railway staging or local :3002) with playwright-cli and direct API calls. Use whenever asked to test, verify, smoke-test, sweep, or "actually check" the admin panel — a single admin screen or all of them. Covers admin auth (admin_token cookie + AdminRoleGuard), the full route inventory, the shared-staging blast radius, and the failure signatures unique to this app.
---

# Real-deployment testing for the Neo Health admin panel

Admin is ~35 authenticated routes over one backend. Nothing here is mocked —
you are looking at the same data every other operator on that environment sees.

Two rules drive everything below:

1. **Read the network, not the pixels.** A TanStack Table renders an identical
   empty shell for "no rows", "403", and "the query threw". Only the request
   list distinguishes them. Screenshot to judge *layout*; use `requests` to
   judge *working*.
2. **On a shared environment, default to read-only.** Admin's whole job is
   elevated mutation — approving doctors, sending email blasts, flipping flags
   for every other app. See §4 before you click anything that commits.

For the LOCAL docker stack (bringing Postgres/backend up, seeds, SQL flag
flips) use `real-test-playwright` — this skill is the deployed-target half and
does not repeat it.

---

## 1. Targets

| Env | Admin URL | Notes |
|---|---|---|
| staging (`dev`) | `https://admin-dev-stg.up.railway.app/` | shared; real-ish data |
| local | `http://localhost:3002` | `cd apps/admin && pnpm dev` |

The backend base is whatever `NEXT_PUBLIC_API_URL` was baked in at build time
(`https://<backend>.up.railway.app/api`). **Do not hardcode it — discover it**,
because it differs per environment and rots:

```bash
"$PWCLI" requests | grep -iE "auth/(login|me)"     # after a login attempt
```

As of 2026-08-19 staging resolves to `https://backend-devv.up.railway.app/api`
— **two v's in `devv`**, and `backend-dev`/`backend-dev-stg` are *not* it (they
answer `Application not found`). Re-discover rather than trusting that line.

Everything below assumes:

```bash
export PWCLI="$HOME/.claude/skills/playwright/scripts/playwright_cli.sh"
export ADMIN="https://admin-dev-stg.up.railway.app"
```

Preflight — is it even up? A Railway `Application not found` JSON body means
the service is gone, not that you typed the URL wrong:

```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" -m 20 "$ADMIN/"
# expect: 307 -> /login?redirect=%2F   (a 307 to /login IS the healthy answer)
```

---

## 2. Auth

The chain, in order — each link fails differently, so know which one broke:

1. **`middleware.ts`** reads the `admin_token` cookie and decodes `exp` itself.
   No cookie, or expired, gives a 307 to `/login?redirect=<path>`. It never
   calls the backend, so an unexpired but foreign JWT gets past this link.
2. **`AdminRoleGuard`** (dashboard layout) calls `POST {API}/auth/me` on mount (yes, POST)
   and requires `role === "ADMIN"`; anything else wipes the cookie and sends you
   to `/login?error=admin_only`. While it waits it renders a bare dark page
   reading **`Loading...`** — see §5.
3. The page's own TanStack Query calls.

Cookies are `admin_token` (access) and `admin_refresh_token`, set from JS by
`lib/api.ts` — so they are **not HttpOnly** and you can plant them.

### UI login (tests the real path — do this at least once)

```bash
"$PWCLI" open "$ADMIN/login"
"$PWCLI" snapshot | grep -iE 'textbox|button'      # refs change every load
"$PWCLI" fill <emailRef> 'admin.ked@neo.health'
"$PWCLI" fill <pwRef> 'Ked2026!'
"$PWCLI" click <submitRef>          # the button is labelled "Enter", not "Log in"
"$PWCLI" tab-list                                   # URL should now be /users
```

The form is `aria-label="Email"` / `aria-label="Password"`, placeholder
`me@neo.health`. Success lands on **`/users`** — both the middleware and the
login handler send you there; `/` is not a page.

### Token injection (fast path for a multi-route sweep)

Re-logging-in through the form for every check is slow, and the 30-minute JWT
expires under you mid-sweep. Mint once, plant, reuse:

```bash
API=<discovered base>            # e.g. https://<backend>.up.railway.app/api
TOKEN=$(curl -s -X POST "$API/auth/login" -H "Content-Type: application/json" \
  -d '{"email":"admin.ked@neo.health","password":"Ked2026!"}' \
  | python -c "import sys,json;print(json.load(sys.stdin).get('accessToken',''))")
[ -n "$TOKEN" ] || echo "LOGIN FAILED — check creds/CORS before blaming the UI"

"$PWCLI" open "$ADMIN/login"
"$PWCLI" cookie-set admin_token "$TOKEN"
"$PWCLI" goto "$ADMIN/users"
```

That same `$TOKEN` is your API-layer probe for every screen:

```bash
curl -s -H "Authorization: Bearer $TOKEN" "$API/admin/users?page=1&limit=1" | head -c 300
```

Endpoint names do not all live under `/admin`. Feature flags are **`/feature-flags`**;
`/admin/feature-flags` is a 404 (and the message comes back `PATH_REDACTED` —
that is `PhiErrorFilter` working, not a broken route).

**If a screen looks broken, check the API first.** `curl` 200 + empty table is a
frontend bug. `curl` 403/500 is a backend problem and the UI is behaving.

---

## 3. The sweep

Per route: navigate, snapshot, console, failed requests. Screenshot only when
something looks off, or when the check is explicitly about layout.

```bash
for R in users kyc-applications organizations audit-logs system-settings; do
  echo "### /$R"
  "$PWCLI" goto "$ADMIN/$R" >/dev/null
  "$PWCLI" tab-list --raw                              # caught a redirect to /login?
  "$PWCLI" console error 2>&1 | head -5
  "$PWCLI" requests 2>&1 | grep -vE " 2[0-9][0-9] | 30[0-9] " | head -8
done
```

Green means all three: the URL is still the route you asked for, no console
errors, no non-2xx requests. Anything else, drill in with `"$PWCLI" request <n>`
and `response-body <n>`.

### Route inventory

Nav order, from `app/(dashboard)/layout.tsx`. `⚠` marks a committing action —
read §4 first.

| Route | What "working" looks like |
|---|---|
| `/users` | rows render; this is the landing page after login ⚠ |
| `/users/<id>/kyc` | per-user KYC review; densest mutation surface in the app ⚠ |
| `/kyc-applications` | provider KYC queue ⚠ |
| `/patient-wallet-kyc` | **status view, not a queue** — the BVN/NIN provider decides, there is no button to press |
| `/representative-claims` | claim adjudication ⚠ |
| `/representatives` | representative authority freeze/thaw ⚠ |
| `/access-reviews` | break-glass / supervised-exception queue ⚠ |
| `/break-glass-stats` | recharts charts populate |
| `/authority-change-reviews` | ⚠ |
| `/needs-guardian` | ⚠ |
| `/duplicate-reviews`, `/duplicate-reviews/<id>` | merge screen; the server refuses a merge executed by its own co-signer ⚠ |
| `/legal-holds` | ⚠ |
| `/campaigns` | **sends real email** ⚠⚠ |
| `/posts`, `/posts/new`, `/posts/<id>`, `/posts/<id>/comments` | news posts |
| `/templates`, `/templates/new`, `/templates/<id>` | scribe note templates |
| `/intake-forms`, `/intake-forms/new`, `/intake-forms/<id>` | |
| `/specialties`, `/specialties/new`, `/specialties/<id>` | |
| `/catalog`, `/catalog/new`, `/catalog/<id>` | service catalog |
| `/organizations` + `/new`, `/<id>`, `/pending-review`, `/requests/<id>` | a 409 `CLOSE_MATCH` on create is the dedup guard, not a bug ⚠ |
| `/organization-types` + `/new`, `/<id>` | not in the sidebar; `/organization-types` **redirects to `/organizations?tab=types`** — grab the *last* Page URL after a `goto`, not the first |
| `/ai-config` | entry point to the provider note prompts |
| `/prompts`, `/prompts/new`, `/prompts/<id>` | versioned system prompts ⚠ |
| `/dot-phrases`, `/lexicon`, `/normal-findings`, `/specialty-packs` | catalog screens |
| `/system-settings` | **feature flags for the whole environment** ⚠⚠ |
| `/library-requests` | Health Library requests |
| `/memory` | CIE patient memory viewer — keys off the **FHIR patient id**, not a User ID |
| `/audit-logs` | backend-paginated AuditEvent viewer |
| `/fhir-sync` | FHIR sync ops ⚠ |
| `/license-extraction` | "Extraction Test" bench — runs the live extractor |
| `/template-test` | "Template Test" bench |
| `/analytics` | de-linked legacy route; still resolves for bookmarks |
| `/support` + `/lookup`, `/analytics`, `/complaints`, `/providers/<id>`, `/sessions/<id>` | own sidebar group |

---

## 4. Blast radius — what NOT to click on a shared environment

Admin endpoints run with elevated scope. On staging these are real writes other
people will hit. **Ask before triggering any of these; never do one "just to see
if the button works".**

| Action | Why it is not a safe click |
|---|---|
| `/system-settings` flag toggle, and especially a **release profile** | The backend serves 403 for disabled features immediately, for *every* app on that environment. The profile buttons overwrite **every** flag at once. |
| `/campaigns` broadcast or invite | Actually sends email via Pingram to real addresses. |
| KYC approve / reject | Flips a provider's verification and writes AuditEvent + Provenance. |
| `/duplicate-reviews` merge | Merges patient records. Not undoable from the UI. |
| `/legal-holds`, `/representatives` freeze | Changes access rights on real accounts. |
| `/fhir-sync` runs | Bulk-touches Medplum. |
| delete on org / specialty / template / post | Elevated destructive path. |

Safe-by-construction alternatives that still prove the wiring: open the dialog
and **cancel**; submit deliberately invalid input and assert the error surfaces;
call the endpoint with `curl` and no `Authorization` header and assert `401`;
create a throwaway record you then delete — catalog-type data only, never
KYC/legal/patient.

**PHI**: staging carries patient-shaped data. Do not paste names, emails, or
FHIR ids into commits, PRs, issues, or reports. Screenshots of `/users`,
`/support/*`, `/memory` and `/audit-logs` contain identifiers — describe them,
don't attach them, and clear `.playwright-cli/*.png` when done.

---

## 5. Failure signatures specific to this app

- **Stuck on a dark page reading `Loading...`** — `AdminRoleGuard` never got its
  answer. The cause is `POST /auth/me`: 401 (token expired or foreign), a CORS
  block (backend `CORS_ORIGINS` missing this admin origin), or the backend being
  down. `"$PWCLI" requests | grep auth/me` is the whole diagnosis; a pending or
  failed `/auth/me` is not a page bug.
- **Bounced to bare `/login` with a valid non-admin token** — this is the
  `AdminRoleGuard` bounce working. The login page toasts "Admin access only…"
  and then *strips* `?error=admin_only` via `history.replaceState`, so the final
  URL carries no query and the toast (~4s) is long gone before a `snapshot`
  lands — every CLI round-trip costs 5–15s. Do not report the missing toast as
  a defect on snapshot evidence alone; it cannot be observed this way.
- **Bounced to `/login?redirect=…` mid-sweep** — the 30-minute access token
  expired. Re-mint and re-plant (§2); don't re-debug the page.
- **Everything 401s right after a deploy** — stale `admin_token` in the browser.
  `"$PWCLI" cookie-clear`, then log in again.
- **`Failed to load chunk` / `ChunkLoadError`** — a deploy landed while the tab
  was open. The app self-reloads once per 60s (`lib/chunk-error-recovery.ts`);
  reload and retry before reporting it. Not a real defect.
- **A form 400s naming a field you never touched** — the backend pipe runs
  `whitelist: true` + `forbidNonWhitelisted: true`, so any field the DTO does
  not declare rejects the whole request. Compare the outgoing body
  (`"$PWCLI" request-body <n>`) against the DTO, not against the UI.
- **409 `CLOSE_MATCH` creating an organization** — the intended dedup guard; the
  payload carries the existing org so the UI can offer it. Working as designed.
- **`/memory` shows nothing for a patient** — you almost certainly passed a User
  ID. That screen wants the FHIR patient id.
- **`/organizations` showing "No organizations found."** — check the console
  before believing it. Every `/fhir/*` route is gated on `isVerified` for
  ADMIN as well as PROVIDER (`fhir-access-policy.guard.ts`), so an admin whose
  account was never verified gets `403 VERIFICATION_REQUIRED` and the table
  renders the empty state instead of an error. Confirm with
  `curl -H "Authorization: Bearer $TOKEN" "$API/fhir/organizations?_count=1"`.
- **Empty table, no errors, 200 response** — read the response body before
  calling it a bug. Staging genuinely has empty queues.
- **`favicon.ico` 404 in console** — noise, always.
- **An `alert` node in every dashboard snapshot** — the Sonner toaster's live
  region. Present on every page, empty. Noise.
- **A valid non-admin token gets `401`, not `403`, from `/admin/*`** — that is
  `AdminGuard` → `AuthService.validateAdmin` throwing `UnauthorizedException`
  for a *role* failure. Access is correctly denied, so don't file it as a
  security hole; the consequence is that `lib/refresh-interceptor.ts` treats it
  as an expired token, burns a `/auth/refresh` round-trip, and logs the user out
  instead of saying "not permitted".

Playwright gotchas (same as the provider skill; they bite here too): refs go
stale after any navigation, so re-`snapshot`; `open` can drop the session where
`goto` keeps it; a pre-existing tab steals focus, so `close` and reopen — and
stop fighting it after two tries, fall back to API checks.

---

## 6. Report

Per route: **route → verdict → the evidence** (a status code, a console line, a
response body — not "looks fine"). Say which layer proved it, API or browser;
they prove different things. Keep three buckets separate: defects you found,
staging data that is merely empty, and things you deliberately did not test
because they mutate shared state — list those rather than silently skipping.
