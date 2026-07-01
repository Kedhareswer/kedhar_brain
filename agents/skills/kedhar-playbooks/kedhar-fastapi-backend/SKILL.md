---
name: kedhar-fastapi-backend
description: Build a FastAPI backend with Kedhar's conventions — clean layout, Pydantic v2 models, async endpoints, CORS for web frontends, error handling, env config, and deployment. Use when building a Python API, backend service, or REST endpoints for Kedhar. Keywords "FastAPI, python backend, REST API, endpoints, Pydantic, async API, CORS, microservice, uvicorn".
---

# Kedhar FastAPI Backend

Conventions for Python APIs that back Kedhar's Next.js frontends.

## Layout
```
app/
├── main.py            # app factory, middleware, router includes
├── core/config.py     # pydantic-settings (env)
├── routers/           # one module per resource
├── models/            # Pydantic v2 schemas
├── services/          # business logic (keep routers thin)
└── deps.py            # shared dependencies
requirements.txt  Dockerfile  .env.example
```

## Conventions
- **Async** endpoints; thin routers, logic in `services/`.
- **Pydantic v2** request/response models on every endpoint (typed, validated).
- **CORS** configured for the Vercel frontend origin(s):
  ```python
  app.add_middleware(CORSMiddleware, allow_origins=[FRONTEND_URL],
                     allow_methods=["*"], allow_headers=["*"])
  ```
- Config via `pydantic-settings` reading env; **never hardcode secrets**.
- Consistent error handling (HTTPException + a global handler returning `{detail}`); add `/health`.
- `GET /docs` (OpenAPI) left on for dev.

## Test & run
```bash
uvicorn app.main:app --reload          # dev
pytest                                  # httpx + pytest
gunicorn -k uvicorn.workers.UvicornWorker app.main:app   # prod
```

## Deploy
Render / Railway / Fly.io via the `Dockerfile`. Set env vars in the dashboard. Expose the URL to the frontend's `NEXT_PUBLIC_API_URL`.

## Definition of done
`/health` + `/docs` live, CORS allows the frontend, secrets in env, tests pass, README per `kedhar-project-conventions`.
