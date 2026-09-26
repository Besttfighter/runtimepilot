// RuntimePilot — Master Course Catalog Data (2026)
// Grounded strictly in COMMERCIAL_COURSE_TRUTH.json and approved owner commercial decisions.

window.COURSES_DATA = [
{
  "id": "production-ai-systems",
  "slug": "production-ai-systems",
  "featured": true,
  "isChampion": true,
  "title": "Production AI Systems: Engineering Resilient Business Automations in Node.js & Python",
  "shortTitle": "Production AI Systems",
  "subtitle": "Wrap probabilistic AI models in deterministic software architecture with multi-model cascades, circuit breakers, distributed idempotency, and chaos testing.",
  "tagline": "The definitive engineering masterclass to build resilient AI automations, agent runtimes, and LLM pipelines that survive production failures.",
  "category": "AI Systems Engineering",
  "track": "engineering",
  "level": "Intermediate to Advanced",
  "duration": "2.6 Hours (156 minutes)",
  "durationHours": 2.6,
  "lessonsCount": 21,
  "modulesCount": 7,
  "launchPrice": 99,
  "standardPrice": 149,
  "currency": "EUR",
  "currencySymbol": "\u20ac",
  "badge": "FLAGSHIP COURSE \u2022 PRODUCTION AI ENGINEERING",
  "checkoutUrl": "CHECKOUT_URL",
  "techStack": [
    "Python 3.10+",
    "Node.js v22",
    "FastAPI",
    "Express",
    "Zod",
    "Pydantic",
    "SQLite WAL",
    "Redis",
    "BullMQ",
    "OpenTelemetry",
    "Docker"
  ],
  "outcomes": [
    "Implement non-blocking latency budgets and three-state circuit breakers to eliminate 429 cascade outages.",
    "Secure webhook endpoints with constant-time HMAC-SHA256 signature verification and timing-attack defense.",
    "Enforce distributed idempotency using atomic Redis/SQLite locks to guarantee single-execution semantics.",
    "Construct deterministic AST and JSON schema self-healing pipelines with Zod and Pydantic.",
    "Architect resilient dead-letter queues (DLQs) and exponential backoff loops with truncated jitter.",
    "Isolate LLM-driven tool execution within restricted operating system subprocess boundaries and allowlists.",
    "Stress-test end-to-end automation pipelines under a 500-request HTTP chaos test with 50-way concurrency."
  ],
  "targetAudience": [
    "Backend & Full-Stack Engineers deploying AI workflows into mission-critical production.",
    "Technical Leads & Architects seeking deterministic reliability standards for probabilistic models.",
    "Software Developers tired of fragile API demos, unhandled rate limits, and cascade crashes.",
    "DevOps & Platform Engineers instrumenting AI automations with distributed tracing and metrics."
  ],
  "capstoneProject": {
    "title": "5-Gate Resilient Automation Engine (Lesson 21)",
    "description": "An end-to-end, dual-stack production engine incorporating ingress HMAC authentication, AST schema self-healing, multi-tier cascade routing, atomic WAL deduplication, and dead-letter queues, stress-tested under a 500-request HTTP chaos test with 50-way concurrency."
  },
  "curriculum": [
    {
      "moduleId": "module_01",
      "moduleNumber": 1,
      "title": "Module 1: Foundations of AI Automation Systems",
      "lessons": [
        {
          "id": "01",
          "lessonNumber": 1,
          "title": "Lesson 01: Autonomous Lead Triage & Qualification",
          "duration": "7:49",
          "preview": false,
          "isSampleLesson": false,
          "implementation": [
            "schema_validation.js"
          ],
          "tests": [
            "test_schema_validation.js"
          ]
        },
        {
          "id": "02",
          "lessonNumber": 2,
          "title": "Lesson 02: Multi-Model Resilience & Circuit Breakers",
          "duration": "8:21",
          "preview": false,
          "isSampleLesson": false,
          "implementation": [
            "circuit_breaker.py"
          ],
          "tests": [
            "test_resilience.py"
          ]
        },
        {
          "id": "03",
          "lessonNumber": 3,
          "title": "Lesson 03: Secure Webhooks & Persistent Idempotency",
          "duration": "7:56",
          "preview": false,
          "isSampleLesson": false,
          "implementation": [
            "webhook_gateway.py"
          ],
          "tests": [
            "test_security.py"
          ]
        }
      ]
    },
    {
      "moduleId": "module_02",
      "moduleNumber": 2,
      "title": "Module 2: Reliable AI Workflows and Structured Outputs",
      "lessons": [
        {
          "id": "04",
          "lessonNumber": 4,
          "title": "Lesson 04: Schema Enforcement & Strict JSON Validation",
          "duration": "7:27",
          "preview": false,
          "isSampleLesson": false,
          "implementation": [
            "schema_engine.js"
          ],
          "tests": [
            "test_schema_engine.js"
          ]
        },
        {
          "id": "05",
          "lessonNumber": 5,
          "title": "Lesson 05: Deterministic Routing & Output Repair",
          "duration": "7:09",
          "preview": false,
          "isSampleLesson": false,
          "implementation": [
            "output_repair.py"
          ],
          "tests": [
            "test_output_repair.py"
          ]
        },
        {
          "id": "06",
          "lessonNumber": 6,
          "title": "Lesson 06: Model Confidence Boundaries & Human Fallback",
          "duration": "7:27",
          "preview": false,
          "isSampleLesson": false,
          "implementation": [
            "confidence_evaluator.py"
          ],
          "tests": [
            "test_confidence_evaluator.py"
          ]
        }
      ]
    },
    {
      "moduleId": "module_03",
      "moduleNumber": 3,
      "title": "Module 3: Multi-Model Routing, Failover and Resilience",
      "lessons": [
        {
          "id": "07",
          "lessonNumber": 7,
          "title": "Lesson 07: Dynamic Cost/Latency Model Routing & Cascades",
          "duration": "7:46",
          "preview": true,
          "isSampleLesson": true,
          "implementation": [
            "cascade_router.py"
          ],
          "tests": [
            "test_cascade_router.py"
          ]
        },
        {
          "id": "08",
          "lessonNumber": 8,
          "title": "Lesson 08: Retry Strategies: Exponential Backoff, Jitter & Circuit States",
          "duration": "7:37",
          "preview": false,
          "isSampleLesson": false,
          "implementation": [
            "retry_circuit.py"
          ],
          "tests": [
            "test_retry_circuit.py"
          ]
        },
        {
          "id": "09",
          "lessonNumber": 9,
          "title": "Lesson 09: Dead-Letter Queue (DLQ) Quarantine & Replay Engines",
          "duration": "7:15",
          "preview": false,
          "isSampleLesson": false,
          "implementation": [
            "dlq_engine.py"
          ],
          "tests": [
            "test_dlq_engine.py"
          ]
        }
      ]
    },
    {
      "moduleId": "module_04",
      "moduleNumber": 4,
      "title": "Module 4: Security, Webhooks, Idempotency and Guardrails",
      "lessons": [
        {
          "id": "10",
          "lessonNumber": 10,
          "title": "Lesson 10: Inbound Webhook Authentication & Replay Protection",
          "duration": "7:38",
          "preview": false,
          "isSampleLesson": false,
          "implementation": [
            "webhook_auth.js"
          ],
          "tests": [
            "test_webhook_auth.js"
          ]
        },
        {
          "id": "11",
          "lessonNumber": 11,
          "title": "Lesson 11: Prompt Injection Hardening & Guardrails",
          "duration": "7:16",
          "preview": false,
          "isSampleLesson": false,
          "implementation": [
            "prompt_guard.py"
          ],
          "tests": [
            "test_prompt_guard.py"
          ]
        },
        {
          "id": "12",
          "lessonNumber": 12,
          "title": "Lesson 12: Secret Management & Immutable Audit Trails",
          "duration": "7:27",
          "preview": false,
          "isSampleLesson": false,
          "implementation": [
            "audit_logger.py"
          ],
          "tests": [
            "test_audit_logger.py"
          ]
        }
      ]
    },
    {
      "moduleId": "module_05",
      "moduleNumber": 5,
      "title": "Module 5: Business Integrations and Autonomous Operations",
      "lessons": [
        {
          "id": "13",
          "lessonNumber": 13,
          "title": "Lesson 13: CRM Ingestion & Stateful Lead Enrichment",
          "duration": "7:33",
          "preview": false,
          "isSampleLesson": false,
          "implementation": [
            "crm_integration.py"
          ],
          "tests": [
            "test_crm_integration.py"
          ]
        },
        {
          "id": "14",
          "lessonNumber": 14,
          "title": "Lesson 14: Bi-Directional Slack Dispatch & Interactive Escalations",
          "duration": "7:07",
          "preview": false,
          "isSampleLesson": false,
          "implementation": [
            "slack_dispatcher.js"
          ],
          "tests": [
            "test_slack_dispatcher.js"
          ]
        },
        {
          "id": "15",
          "lessonNumber": 15,
          "title": "Lesson 15: Scheduled Cron Automations & Observability Metrics",
          "duration": "7:20",
          "preview": false,
          "isSampleLesson": false,
          "implementation": [
            "cron_reconciliation.py"
          ],
          "tests": [
            "test_cron_reconciliation.py"
          ]
        }
      ]
    },
    {
      "moduleId": "module_06",
      "moduleNumber": 6,
      "title": "Module 6: Agentic Systems, Observability and Human Approval",
      "lessons": [
        {
          "id": "16",
          "lessonNumber": 16,
          "title": "Lesson 16: Workflow Pipelines vs Autonomous Agents: The Architecture Boundary",
          "duration": "7:16",
          "preview": false,
          "isSampleLesson": false,
          "implementation": [
            "agent_boundary.py"
          ],
          "tests": [
            "test_agent_boundary.py"
          ]
        },
        {
          "id": "17",
          "lessonNumber": 17,
          "title": "Lesson 17: Sandboxed Tool Calling & State Persistence",
          "duration": "7:04",
          "preview": false,
          "isSampleLesson": false,
          "implementation": [
            "tool_sandbox.py"
          ],
          "tests": [
            "test_tool_sandbox.py"
          ]
        },
        {
          "id": "18",
          "lessonNumber": 18,
          "title": "Lesson 18: Human Governance: Reviewer LLMs, Approval Queues & Safe Rollback",
          "duration": "7:39",
          "preview": false,
          "isSampleLesson": false,
          "implementation": [
            "governance_engine.py"
          ],
          "tests": [
            "test_governance_engine.py"
          ]
        }
      ]
    },
    {
      "moduleId": "module_07",
      "moduleNumber": 7,
      "title": "Module 7: Capstone: Build a Complete Autonomous Business System",
      "lessons": [
        {
          "id": "19",
          "lessonNumber": 19,
          "title": "Lesson 19: Capstone Architecture & System Specification",
          "duration": "5:15",
          "preview": false,
          "isSampleLesson": false,
          "implementation": [
            "capstone_contract.js"
          ],
          "tests": [
            "test_capstone_contract.js"
          ]
        },
        {
          "id": "20",
          "lessonNumber": 20,
          "title": "Lesson 20: Capstone Core Engine: Ingress, Router & Fallback Chain",
          "duration": "7:45",
          "preview": false,
          "isSampleLesson": false,
          "implementation": [
            "capstone_core_engine.js"
          ],
          "tests": [
            "test_capstone_core_engine.js"
          ]
        },
        {
          "id": "21",
          "lessonNumber": 21,
          "title": "Lesson 21: Capstone Production Hardening, Chaos Testing & Deployment",
          "duration": "7:50",
          "preview": false,
          "isSampleLesson": false,
          "implementation": [
            "capstone_core_engine.js",
            "chaos_run.json",
            "chaos_server.js",
            "chaos_suite.js"
          ],
          "tests": [
            "test_chaos_suite.js"
          ]
        }
      ]
    }
  ]
}
];

window.FAQS_DATA = [
  {
    "q": "What is RuntimePilot?",
    "a": "RuntimePilot is an engineering-first platform focused exclusively on building production-oriented AI and automation architectures. No lifestyle marketing, no prompt tricks\u2014just verified software engineering patterns backed by automated test suites."
  },
  {
    "q": "What prerequisites do I need for this course?",
    "a": "Familiarity with standard JavaScript/TypeScript (Node.js) or Python. The course uses standard libraries and minimal dependencies (Node.js built-ins, Python standard library, Zod, and Pydantic) to emphasize pure software architecture over ephemeral third-party frameworks."
  },
  {
    "q": "What is the difference between the launch price and standard price?",
    "a": "The course is currently offered at an inaugural 7-day launch promotional price of \u20ac99 for early adopters. The standard price is \u20ac149. Both tiers provide the exact same complete access to all 21 video lessons, starter packages, and reference solutions."
  },
  {
    "q": "What is the course update and errata policy?",
    "a": "Your purchased version remains accessible permanently. Additionally, your enrollment includes 12 months of minor updates, bug fixes, and errata patches as dependencies and model APIs evolve."
  },
  {
    "q": "What is the refund policy?",
    "a": "We provide a straightforward 14-Day Refund Policy. If the course is not right for you, simply request a refund within 14 days of purchase. No outcome promises, no friction, and zero interrogation."
  },
  {
    "q": "What does the Single-Developer Commercial License permit?",
    "a": "The license permits you to use, adapt, and incorporate the architectural patterns, code templates, and starter kit blueprints into your personal projects, employer internal workflows, and client delivery work. You may not redistribute, sub-license, mirror, or publicly share the course videos, lessons, or raw reference solutions."
  },
  {
    "q": "Are both Node.js and Python implementations included?",
    "a": "Yes. Every core reliability pattern\u2014from circuit breakers and HMAC validation to cascade routers and idempotency locks\u2014is provided with runnable starter packages and clean reference solutions in both Node.js (v22) and Python (3.10+)."
  }
];
