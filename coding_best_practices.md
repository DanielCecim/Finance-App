# JS Frontend × Agno Agent — Code Best Practices

> **Purpose:** Give your agent developer a single, battle‑tested playbook to migrate a Streamlit app to a modern JavaScript frontend while keeping the backend as an **Agno** agent service. The focus is on stability, clarity, and not “losing itself” as the codebase grows.

---

## 0) Quick‑Start Checklist

* [ ] Pick stack: **React + Vite** (recommended) or **Next.js** (if you want routing/SSR). Stay in **JavaScript** or opt‑in to **TypeScript** for safety.
* [ ] Define stable **API contract** to the Agno agent (REST + SSE/WebSocket for streaming).
* [ ] Introduce **session & conversation IDs**; never call the agent without them.
* [ ] Add **error boundaries**, retry/backoff, and circuit breakers for agent calls.
* [ ] Ship a minimal **observability** stack (logs + metrics + traces + client event logs).
* [ ] Write **component tests** and **API contract tests** before heavy UI work.
* [ ] Create a **feature flags** mechanism for risky features.
* [ ] Stand up **preview environments** on each PR (ephemeral backend + frontend).

---

## 1) Architecture at a Glance

**Frontend (JS)**

* SPA (React + Vite) with **atomic components** and **feature folders**.
* Global state: lightweight (Zustand/Context) + URL state for sharable views.
* Streaming from agent via **SSE** (preferred) or **WebSocket**.
* Build: Vite; Lint/Format: ESLint + Prettier; Tests: Vitest + Playwright.

**Backend (Agno agent)**

* Expose endpoints:

  * `POST /v1/chat` (non‑streaming)
  * `POST /v1/chat/stream` (SSE)
  * `POST /v1/tools/:name` (tool actions)
  * `POST /v1/files` (uploads)
  * `GET /v1/health` (readiness/liveness)
* **Idempotent** requests keyed by `(session_id, turn_id)`.
* **Stateless service** with external state: conversation history, vector memory, files.
* **Observability**: request logs (trace_id), structured events, latency, token usage.

**Shared Contracts**

* Define JSON shapes for: `Message`, `AgentEvent`, `ToolCall`, `Error`, `FileRef`.
* Versioned as `v1`; changes behind feature flags or new `v2` paths.

---

## 2) Folder Structure (Frontend)

```
frontend/
  src/
    app/                 # App shell, routing, public providers
    features/
      chat/
        components/
        hooks/
        services/
        state/
        index.ts
      files/
      auth/
      settings/
    shared/
      components/        # Button, TextArea, Modal, Spinner, ErrorBoundary
      hooks/             # useSse, useDebounce, usePersistedState
      utils/             # fetchJSON, retry, schema validators
      types/             # shared TS types for API contracts (or JSDoc typedefs)
    styles/
    index.html
    main.tsx (or .jsx)
  public/
  vite.config.ts
```

> Keep **feature isolation**. Each feature owns UI, hooks, services, and tests.

---

## 3) API Contract (Frontend ⇄ Agno)

### 3.1 Request headers

* `Authorization: Bearer <token>` or signed cookie
* `X-Client-Session: <session_id>`
* `X-Conversation: <conversation_id>`
* `X-Request-Id: <uuid>` (frontend generated for tracing)

### 3.2 Chat (non‑streaming)

`POST /v1/chat`

```json
{
  "session_id": "abc-123",
  "conversation_id": "conv-001",
  "messages": [
    {"role":"system","content":"..."},
    {"role":"user","content":"Hello"}
  ],
  "tools": [
    {"name":"search", "schema": {"q":"string"}}
  ],
  "metadata": {"ui_version": "2025.11.14"}
}
```

**Response**

```json
{
  "id": "msg-789",
  "role": "assistant",
  "content": "Hello!",
  "events": [],
  "usage": {"input_tokens": 12, "output_tokens": 8}
}
```

### 3.3 Chat (streaming via SSE)

`POST /v1/chat/stream` → `text/event-stream`
Events to emit:

* `event: token` → `{ "delta": "…" }`
* `event: tool_call` → `{ "name": "search", "args": {…} }`
* `event: tool_result` → `{ "name": "search", "result": {…} }`
* `event: message_end` → `{ "message_id": "…", "usage": {…} }`
* `event: error` → `{ "code": "…", "message": "…" }`

> **Rule:** The frontend must treat SSE as **append‑only** and be robust to duplicates. Use `X-Request-Id` + `message_id` for de‑duping.

### 3.4 Errors (uniform)

```json
{
  "error": {
    "code": "RATE_LIMIT",
    "message": "Too many requests, retry later",
    "retry_after": 3.0,
    "trace_id": "…"
  }
}
```

---

## 4) Session, Memory & Identity (don’t lose the thread)

* Generate a **stable `session_id`** per browser (persist in `localStorage`).
* Generate a **`conversation_id`** per chat tab/thread.
* Attach both IDs on every call; backend uses them to load/save memory.
* App state = UI view state; **source of truth** = backend memory store.
* On refresh/crash: rehydrate by fetching last N messages for `conversation_id`.
* Ensure **tool use** is logged with the message that triggered it.
* Version prompts/instructions with `system.version` to avoid drift and enable rollbacks.

---

## 5) Streaming UX Patterns

* Show a **typing indicator** when first `token` arrives or after 300ms.
* Switch send button to **Stop** during streaming; cancel = `AbortController` + backend cancel.
* **Scroll‑follow** until user scrolls up; then show “Jump to newest”.
* Support **inline tool results** (expand/collapse) with copy buttons.
* **Autosave drafts** of user input; restore on reload.

---

## 6) Error Handling & Resilience

* Use a **top‑level ErrorBoundary** and feature‑level boundaries.
* Implement **retry with jitter** (e.g., 250ms → 2s exponential) for network 5xx.
* **No retry** on `4xx` except `429` with `retry_after`.
* **Circuit breaker**: if >N failures in 60s, short‑circuit calls and surface status banner.
* **Offline mode**: detect `navigator.onLine` changes; queue message until online.
* Capture and surface **trace_id** on any agent error for support.

---

## 7) Security & Privacy

* Use **token‑based auth**; never store secrets in the frontend repo.
* **CORS** locked to known origins; **CSRF** if using cookies.
* Enforce **payload size limits** and **file type allow‑list** on uploads.
* Strip EXIF/PII on images where relevant.
* Redact sensitive fields in client logs.
* Rate limit by **IP + session_id + user_id**.

---

## 8) Performance Budget

* **LCP < 2.5s**, **CLS < 0.1**, bundle **< 200KB gz** for initial route.
* Code‑split feature routes; lazy‑load heavy editors/viewers.
* Cache **static config** (prompts, tool names) with ETag and long‑max‑age.
* Debounce input (200–300ms) and throttle resize/scroll handlers.

---

## 9) Accessibility (A11y) & Internationalization (i18n)

* Use semantic HTML, keyboard navigable controls, aria‑live for streaming regions.
* Respect prefers‑reduced‑motion.
* No AI‑only affordances; always provide visible labels.
* Externalize strings; support locale switch; avoid concatenated dynamic strings.

---

## 10) Testing Strategy

* **Unit**: pure functions, formatters, reducers, utilities.
* **Component**: chat message list, input composer, streaming renderer.
* **Contract**: mock backend using JSON fixtures; verify SSE sequence.
* **E2E**: Playwright scenarios (send message, cancel)
