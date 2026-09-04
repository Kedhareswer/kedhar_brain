---
name: real-test-playwright
description: Test Neo Health features against a REAL running stack (docker + backend + Next apps) using playwright-cli and direct API calls. Use whenever asked to "test in the UI", "verify it actually works", "check the app", or after building any provider/patient/admin feature. Covers bringing the stack up, seeded logins, enabling feature flags, driving the browser, and the gotchas that waste the most time.
---

# Real-stack testing for Neo Health

Unit tests prove logic. This skill proves the **feature actually works in the
running product** — auth, feature flags, access policy, real LLM, real FHIR.

**Rule of thumb: verify at the API layer first, browser second.** The API check
covers auth → flag → guard → service → DB in ~10 seconds and never flakes. Use
the browser for what only the browser can show: rendering, layout collisions,
focus, and interaction.

---

## 1. Bring the stack up (in this order — each step depends on the last)

```bash
# 1. Docker daemon (Windows: Docker Desktop must be RUNNING, not just installed)
docker info >/dev/null 2>&1 || powershell -NoProfile -Command \
  "Start-Process 'C:\Program Files\Docker\Docker\Docker Desktop.exe'"
# then poll — it takes 10-60s
for i in $(seq 1 20); do docker info >/dev/null 2>&1 && break; sleep 6; done

# 2. Infra: Postgres(5432) Redis(6379) MinIO(9000) Medplum(8103)
cd apps/backend && docker-compose up -d
docker ps --format "{{.Names}}\t{{.Status}}"   # all should be (healthy)

# 3. Migrations — REQUIRED after any schema/feature-flag change
npx prisma migrate deploy

# 4. Backend (own process, port 3000)
cd apps/backend && pnpm dev > /tmp/backend.log 2>&1 &

# 5. Frontend (provider 3001 / patient 3003 / admin 3002)
cd apps/provider && pnpm dev > /tmp/provider.log 2>&1 &
```

Readiness poll (don't guess a sleep):

```bash
for i in $(seq 1 40); do
  B=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api)
  P=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)
  [ "$B" != "000" ] && [ "$P" != "000" ] && echo "up" && break
  sleep 5
done
```

**Symptom → cause**
- `ERR_CONNECTION_REFUSED` / "Failed to fetch" on login → backend :3000 is down.
- Prisma 500 about a missing column → run `npx prisma migrate deploy`.
- Backend boots but flags look wrong → you changed `release-profiles.ts`; rows
  are upserted on boot, so **restart the backend** after editing flags.

---

## 2. Seeded logins

```
doctor.seed@neo.health / Provider2025!     (verified PROVIDER — use this one)
doctor.cardio@neo.health, doctor.peds@neo.health, doctor.alex1@neo.health
```
Password lives in `apps/backend/prisma/seed.ts` (search `password:`). Admin
password is `ADMIN_PASSWORD` in the same file.

List real users instead of guessing:

```bash
docker exec backend-postgres psql -U postgres -d neo_health -t \
  -c "SELECT email, role, \"isVerified\" FROM users WHERE role='PROVIDER' LIMIT 5;"
```

---

## 3. Feature flags — most features are OFF by default

A new flag key added to `FEATURE_FLAG_DEFINITIONS` auto-creates its row on boot
with `enabled=false`. Nothing renders until you turn it on.

```bash
# check
docker exec backend-postgres psql -U postgres -d neo_health -t \
  -c "SELECT key, enabled FROM feature_flags WHERE key='VOICE_ACTIONS';"

# enable, then RESTART the backend (the service caches flags in memory)
docker exec backend-postgres psql -U postgres -d neo_health \
  -c "UPDATE feature_flags SET enabled=true WHERE key='VOICE_ACTIONS';"
```

The proper path is `PATCH /api/admin/feature-flags/:key` (admin JWT), but SQL +
restart is faster and deterministic for a test run.

**⚠ Before trusting ANY flag test, confirm exactly one backend is listening.**
`pkill -f "nest start"` does not reliably kill the process holding :3000. A
zombie keeps serving with its **old in-memory flag cache**, so the DB says off,
`GET /api/feature-flags` says off (it reads the DB), and the route still works —
which looks exactly like a broken guard. This cost a real debugging session.

```bash
# kill by PORT, not by process name
for P in $(netstat -ano | grep ":3000" | grep LISTENING | awk '{print $NF}' | sort -u); do
  taskkill //F //PID "$P"
done
pkill -f "nest start"; sleep 4
netstat -ano | grep ":3000" | grep -c LISTENING     # must print 0 before restarting
```

Tell-tale: the PID in `/tmp/backend.log` differs from the PID actually
listening on :3000.

**Frontends keep their own flag list.** `apps/provider/hooks/use-features.ts`
has both `FEATURE_FLAG_KEYS` and a `DEFAULT_FLAGS` map — a key missing from
either means the UI never shows the feature even when the backend says on.

---

## 4. API-layer verification (do this first)

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor.seed@neo.health","password":"Provider2025!"}' \
  | python -c "import sys,json;print(json.load(sys.stdin).get('accessToken',''))")

curl -s -X POST http://localhost:3000/api/voice/command \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"text":"open my tasks"}'
```

Note the **`/api` prefix** — routes are `/api/<controller>`, not `/<controller>`.

**⚠ Send EXACTLY the body the client sends — copy it from the client file.**
A hand-written curl body is not the client. The global pipe (`main.ts`) uses
`whitelist: true` + `forbidNonWhitelisted: true`, so **any field the DTO does
not declare 400s the entire request**. Removing a field from a DTO without
removing it from the client silently breaks 100% of real traffic while curl
(which omits it) and every service-level unit test (which bypasses the pipe)
stay green. This exact bug shipped here.

```bash
grep -A4 "body: JSON.stringify" apps/provider/lib/api/<feature>.ts   # copy this
```

Pin the contract with a DTO spec that runs the pipe's real options, so a
client/DTO divergence fails in CI rather than in production:

```ts
const dto = plainToInstance(MyDto, { text: 'x', role: 'provider' });
const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
```

Always test the negative cases too, not just the happy path:

| Check | Expect |
|---|---|
| no `Authorization` header | `401` |
| a field the DTO doesn't declare | `400` (whitelist validation) |
| hostile input ("delete all patient records") | safe refusal, not an action |
| a gated feature with the flag off | `403 FEATURE_DISABLED` |
| a tool outside the caller's role | refusal |

---

## 5. Driving the browser

```bash
export PWCLI="$HOME/.claude/skills/playwright/scripts/playwright_cli.sh"
"$PWCLI" open "http://localhost:3001/login"
"$PWCLI" snapshot                 # ALWAYS snapshot before using a ref
"$PWCLI" fill e40 "doctor.seed@neo.health"
"$PWCLI" fill e46 "Provider2025!"
"$PWCLI" click e52
"$PWCLI" screenshot               # writes into .playwright-cli/
ls -t .playwright-cli/*.png | head -1   # then Read that path
```

Find refs by their accessible name — that also verifies a11y labelling:

```bash
"$PWCLI" snapshot 2>&1 | grep -iE 'textbox "Email|button "Log In'
```

### Gotchas that cost real time

- **`file://` is blocked.** To test a local HTML file, serve it:
  `python -m http.server 8765` then open `http://localhost:8765/...`, and kill
  the server by PID afterwards.
- **A pre-existing browser tab steals focus.** If `tab-list` keeps showing
  someone else's page as `(current)` and `tab-select` won't hold, run
  `"$PWCLI" close` and re-open. Don't fight it more than twice — fall back to
  API checks.
- **`open` can drop the session.** Navigating to another route via `open` may
  land you back on `/login`. Log in again, then stay on the page and interact,
  or navigate by clicking in-app.
- **Refs go stale** after navigation or any DOM change — re-`snapshot`.
- **`run-code` has no `window`/`document`/`page`** in scope. Don't reach for it
  to read `location.href`; use `tab-list`, which prints the current URL.
- **Console noise:** a `favicon.ico` 404 is normal and not a failure. Check
  `"$PWCLI" console` for *real* errors after loading a page with scripts.

---

## 6. What to actually check per feature type

**Any new UI control**
1. Does it render at all (a11y tree, not just the screenshot)?
2. Is its accessible name correct and does it name the shortcut?
3. **Does it work by keyboard?** Pointer-only handlers (`onPointerDown`) are
   inert for Enter/Space, switch control, and voice control. Click it via the
   CLI — that's a click, so it reproduces exactly that bug class.
4. Does it collide with existing fixed/floating elements? Screenshot and look.
   The provider app already has a Quick Actions FAB bottom-right.
5. Does it respect `env(safe-area-inset-bottom)`? A flat `bottom-5` sits in the
   phone's home-indicator / back-gesture strip.

**Anything using the microphone**
The browser will usually **deny mic access** — that is a *useful* test, not a
blocker: it exercises the failure path. Confirm the user sees a real message
rather than silence.

**Anything behind a feature flag** — test it both ON and OFF. Off should hide
the UI *and* 403 the route.

**Anything touching PHI** — confirm the route is audited. Routes outside
`/fhir/*` are audited only if allowlisted in
`apps/backend/src/fhir/interceptors/custom-audit.interceptor.ts` (`isAuditedPath`).
A PHI read added without that entry has **no AuditEvent and green CI**.

**Anything spoken or displayed near a patient** — check nothing echoes raw
clinical hypotheses or patient identifiers back onto the screen.

---

## 7. Clean up

```bash
pkill -f "nest start"; pkill -f "next dev"          # dev servers
# docker-compose down    # only if you want the DB gone; usually leave it up
rm -f .playwright-cli/page-*.png                     # screenshots are noise
```

**Run the unit suite with the dev servers STOPPED.** Jest and a running backend
contend for Postgres/Redis, and suites time out at 40s+ and look broken when
they aren't. If a suite fails during a stack session, re-run it in isolation
before believing it:

```bash
npx jest src/path/to/suite --silent      # isolation
npx jest --silent                        # full, servers stopped
```

---

## 8. Report honestly

- Say which layer you verified (API vs browser) — they prove different things.
- If the browser wouldn't cooperate, say so and say what you verified instead.
- Distinguish **pre-existing** failures from ones you caused (check the line
  numbers against your diff, or `git stash` and re-run).
