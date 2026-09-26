# Production AI Systems: 35-Point Reliability & Engineering Checklist
**Reference**: Production AI Systems: Engineering Resilient Business Automations in Node.js & Python  
**Target Audience**: Senior Engineers, Solutions Architects, and Engineering Managers running LLMs in production.

Use this 35-point audit checklist before deploying any automated LLM workflow, agentic pipeline, or AI webhook handler to production.

---

## 1. Latency Budgets & Timeout Isolation (5 Points)
- [ ] **1.1 Bounded Wait Enforced**: Every external LLM call specifies an explicit client-side wait budget (`timeout_ms`) rather than relying on default HTTP socket timeouts.
- [ ] **1.2 Cascade Failover Configured**: Fast fallback tiers (e.g. intermediate cloud model or local inference) are registered to take over immediately when primary latency budgets expire.
- [ ] **1.3 Thread Isolation Awareness**: Concurrency models account for worker thread lifecycles when wait budgets abort (uncompleted background calls terminate cleanly without starving the connection pool).
- [ ] **1.4 Progressive Degradation**: System degrades gracefully (e.g. returns cached summary, heuristic response, or queued status) rather than displaying a 500 error to end users.
- [ ] **1.5 Edge Connection Timeouts**: Public endpoints decouple incoming HTTP requests from long LLM processing times via asynchronous worker queues (`202 Accepted`).

---

## 2. Token Budgeting & Financial Cost Caps (5 Points)
- [ ] **2.1 Hard Spend Limits**: Hard daily and monthly dollar caps configured directly in provider dashboards (OpenAI, Anthropic) with automated webhook alert triggers.
- [ ] **2.2 Per-Request Token Limits**: `max_tokens` explicitly defined on every completion request to prevent rogue infinite generation loops.
- [ ] **2.3 Context Truncation Guard**: Ingestion pipelines enforce sliding window or token boundary clipping before prompts reach the LLM.
- [ ] **2.4 Tiered Model Assignment**: High-reasoning frontier models (GPT-4o, Claude 3.5 Sonnet) are reserved exclusively for complex reasoning; routine tasks use lightweight models (GPT-4o-mini, Haiku, local Qwen).
- [ ] **2.5 Cost Telemetry Instrumentation**: Exact prompt and completion token counts are captured in telemetry spans to calculate per-transaction USD costs.

---

## 3. Distributed Idempotency & Concurrency (5 Points)
- [ ] **3.1 Atomic Idempotency Keys**: Distributed lock keys (`SET key uuid NX PX 60000` in Redis) prevent concurrent execution of identical webhook events or payment retries.
- [ ] **3.2 In-Flight State Segregation**: Distinguish between "job currently executing" and "job completed with cached result" to avoid duplicate background workers.
- [ ] **3.3 Clock Drift Tolerance**: Lock expiration TTLs include safety margins (at least 2x expected execution time) to prevent premature lock releases.
- [ ] **3.4 Atomic Lock Release via Lua**: Distributed locks are released exclusively via Lua scripts verifying unique worker ownership UUIDs.
- [ ] **3.5 Replay Storm Protection**: Upstream webhook retries (from Stripe, Shopify, GitHub) are deduplicated before reaching business logic.

---

## 4. Schema Validation & Feedback Self-Healing (5 Points)
- [ ] **4.1 Strict Type Enforcement**: All LLM outputs are validated against strict type schemas (Pydantic v2 in Python, Zod in TypeScript) before consumption.
- [ ] **4.2 Markdown Fence Stripping**: Output sanitizers automatically strip markdown wrappers (e.g. ````json ... ````) before JSON parsing.
- [ ] **4.3 Single-Pass Feedback Repair**: When schema validation fails, the exact validator error message is injected into a single correction prompt retry.
- [ ] **4.4 Union & Optional Handling**: Schemas explicitly handle missing fields, null values, and variant types without crashing downstream pipelines.
- [ ] **4.5 Deterministic Unit Fixtures**: Schema definitions are tested in CI against a bank of 50+ historical and synthetic malformed LLM responses.

---

## 5. Prompt Injection & Boundary Security (5 Points)
- [ ] **5.1 Structural Boundary Delimiters**: User-provided inputs, customer emails, and document text are encapsulated within clear XML/delimiter tags (e.g. `<user_input>`).
- [ ] **5.2 Canary Token Probes**: Synthetic canary strings are seeded in system prompts to monitor whether prompt leakage attacks succeed.
- [ ] **5.3 Indirect Injection Quarantine**: Ingested files (PDFs, web scrapes) pass through regex and classifier gates before embedding or context injection.
- [ ] **5.4 Privilege Separation**: AI worker processes run with minimal required database and API credentials (read-only where possible).
- [ ] **5.5 Action Execution Approval**: Destructive actions (database writes, refunds, emails sent to external clients) require explicit heuristic verification or human sign-off.

---

## 6. Observability, Telemetry & OpenTelemetry Spans (5 Points)
- [ ] **6.1 Trace Context Propagation**: Distributed trace headers (`traceparent`) are propagated across async job queues, HTTP endpoints, and worker nodes.
- [ ] **6.2 Standardized GenAI Attributes**: Spans record standard OpenTelemetry attributes (`gen_ai.system`, `gen_ai.request.model`, `gen_ai.usage.prompt_tokens`).
- [ ] **6.3 Redacted PII Logging**: Customer PII (emails, credit card numbers, auth tokens) is masked before trace spans are exported to collectors.
- [ ] **6.4 Real-Time Latency Dashboards**: P50, P95, and P99 latency percentiles are tracked separately for each model provider tier.
- [ ] **6.5 Automated Alerting on Error Cascades**: Slack/PagerDuty alerts trigger when fallback tier activation rates exceed 5% of total traffic.

---

## 7. Failure Recovery, Circuit Breakers & Dead-Letter Persistence (5 Points)
- [ ] **7.1 Circuit Breaker Implementation**: Repeated 5xx errors or connection timeouts trip circuit breakers to protect failing providers from overload.
- [ ] **7.2 Jittered Exponential Backoff**: Retries use exponential backoff with randomized jitter to prevent thundering herd spikes.
- [ ] **7.3 Durable Dead-Letter Queue (DLQ)**: Tasks that fail after all retry and cascade attempts are persisted to a durable dead-letter queue (e.g. BullMQ / Redis / SQS).
- [ ] **7.4 DLQ Inspection & Replay Tooling**: Admin tooling exists to inspect failed payloads, review failure stack traces, and re-enqueue jobs after provider recovery.
- [ ] **7.5 Regular Chaos Testing**: CI or staging environments regularly simulate provider blackouts (HTTP 502, 504, 429) to verify automated cascade recovery.

---

### Master These 35 Production Requirements in Code
Every requirement in this checklist is implemented and tested with runnable Node.js and Python code in the full 21-lesson course:

**Production AI Systems: Engineering Resilient Business Automations in Node.js & Python**  
- Launch Price: **€99** (Standard: €149)  
- Includes: 21 Modules, 636 Frozen Production Files, Test Suites, Commercial License, 14-Day Guarantee.  
- [→ Enroll in the Course](https://course.production-ai-systems.com/?utm_source=github&utm_medium=checklist&utm_campaign=launch)
