#!/usr/bin/env python3
"""
Production AI Starter Kit: Standalone Bounded-Wait Cascade Router Demo
----------------------------------------------------------------------
Course: Production AI Systems: Engineering Resilient Business Automations in Node.js & Python
Lesson Reference: Lesson 07 — Dynamic Cost/Latency Model Routing & Cascades

This standalone script demonstrates how to build a multi-tier LLM cascade router
with bounded latency budgets using Python standard library (concurrent.futures).

Key Architectural Principle:
The router enforces a bounded wait for each provider. When the latency budget expires,
it stops waiting on that attempt and immediately cascades to the next tier.
The underlying thread may continue until the provider call itself terminates.
The transaction completes through the backup tier rather than failing the request immediately.
"""

from typing import Dict, Any, List, Optional, Callable
import time
import concurrent.futures

class BoundedWaitTimeout(TimeoutError):
    """Raised when a provider latency budget expires and the router abandons waiting to cascade."""
    pass

class ModelTier:
    """Represents an inference provider tier with cost and SLA constraints."""
    def __init__(
        self,
        name: str,
        priority: int,
        timeout_ms: float,
        prompt_cost_per_m: float = 0.0,
        completion_cost_per_m: float = 0.0,
        invoke_fn: Optional[Callable[[str, Dict[str, Any]], Dict[str, Any]]] = None
    ):
        self.name = name
        self.priority = priority
        self.timeout_ms = timeout_ms
        self.prompt_cost_per_m = prompt_cost_per_m
        self.completion_cost_per_m = completion_cost_per_m
        self.invoke_fn = invoke_fn

class CascadeRouter:
    """Dynamically routes requests across tiered providers with bounded-wait timeout failover."""
    def __init__(self, tiers: List[ModelTier]):
        self.tiers = sorted(tiers, key=lambda t: t.priority)
        self.executor = concurrent.futures.ThreadPoolExecutor(max_workers=8)

    def calculate_cost(self, tier: ModelTier, prompt_tokens: int, completion_tokens: int) -> float:
        cost = (prompt_tokens / 1_000_000.0 * tier.prompt_cost_per_m) + \
               (completion_tokens / 1_000_000.0 * tier.completion_cost_per_m)
        return round(cost, 6)

    def route_completion(self, prompt: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        ctx = context or {}
        attempts = 0
        fallback_reasons: List[str] = []
        start_overall = time.time()

        for tier in self.tiers:
            attempts += 1
            t_start = time.time()
            timeout_sec = tier.timeout_ms / 1000.0

            try:
                # Submit worker to pool and wait up to bounded latency budget
                future = self.executor.submit(tier.invoke_fn, prompt, ctx)
                try:
                    res = future.result(timeout=timeout_sec)
                except concurrent.futures.TimeoutError:
                    future.cancel()
                    elapsed_ms = (time.time() - t_start) * 1000.0
                    raise BoundedWaitTimeout(
                        f"{tier.name} exceeded latency budget of {tier.timeout_ms}ms (stopped waiting after {elapsed_ms:.1f}ms)"
                    )

                # Successful execution
                elapsed_total = (time.time() - start_overall) * 1000.0
                cost = self.calculate_cost(tier, res.get("prompt_tokens", 100), res.get("completion_tokens", 50))
                return {
                    "success": True,
                    "resolved_tier": tier.name,
                    "attempts": attempts,
                    "total_latency_ms": round(elapsed_total, 2),
                    "estimated_cost_usd": cost,
                    "response": res.get("text"),
                    "fallback_reasons": fallback_reasons
                }

            except Exception as e:
                elapsed_ms = (time.time() - t_start) * 1000.0
                reason = f"Tier {tier.name} failed after {elapsed_ms:.1f}ms: {str(e)}"
                fallback_reasons.append(reason)
                print(f"  [WARN] {reason} -> Cascading to next available tier...")
                continue

        # All tiers exhausted
        elapsed_total = (time.time() - start_overall) * 1000.0
        return {
            "success": False,
            "resolved_tier": None,
            "attempts": attempts,
            "total_latency_ms": round(elapsed_total, 2),
            "estimated_cost_usd": 0.0,
            "error": "ALL_TIERS_EXHAUSTED",
            "fallback_reasons": fallback_reasons
        }


# ---------------------------------------------------------------------------
# Simulated Provider Invocations
# ---------------------------------------------------------------------------

def simulate_local_ollama(prompt: str, ctx: Dict[str, Any]) -> Dict[str, Any]:
    """Simulates local inference with potential latency spike."""
    if ctx.get("simulate_local_timeout"):
        time.sleep(1.2)  # Exceeds 400ms budget
    else:
        time.sleep(0.08)
    return {
        "text": f"Ollama Local Response for: {prompt[:30]}...",
        "prompt_tokens": 120,
        "completion_tokens": 45
    }

def simulate_cloud_fast(prompt: str, ctx: Dict[str, Any]) -> Dict[str, Any]:
    """Simulates cloud intermediate provider with potential connection error."""
    if ctx.get("simulate_cloud_error"):
        time.sleep(0.05)
        raise ConnectionResetError("Provider connection reset error")
    time.sleep(0.25)
    return {
        "text": f"Cloud Fast (Tier 2) Response for: {prompt[:30]}...",
        "prompt_tokens": 120,
        "completion_tokens": 60
    }

def simulate_frontier_backup(prompt: str, ctx: Dict[str, Any]) -> Dict[str, Any]:
    """Simulates reliable frontier model fallback."""
    time.sleep(0.40)
    return {
        "text": f"Frontier Enterprise (Tier 3) Response for: {prompt[:30]}...",
        "prompt_tokens": 120,
        "completion_tokens": 80
    }


# ---------------------------------------------------------------------------
# Demo Execution
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("=" * 75)
    print(" Production AI Starter Kit: Bounded-Wait Multi-Tier Cascade Router")
    print("=" * 75)

    tiers = [
        ModelTier(
            name="Tier-1: Local Ollama (Qwen-2.5-7B)",
            priority=1,
            timeout_ms=400.0,
            prompt_cost_per_m=0.0,
            completion_cost_per_m=0.0,
            invoke_fn=simulate_local_ollama
        ),
        ModelTier(
            name="Tier-2: Cloud Fast (GPT-4o-mini)",
            priority=2,
            timeout_ms=1500.0,
            prompt_cost_per_m=0.15,
            completion_cost_per_m=0.60,
            invoke_fn=simulate_cloud_fast
        ),
        ModelTier(
            name="Tier-3: Frontier Enterprise (Claude 3.5 Sonnet)",
            priority=3,
            timeout_ms=5000.0,
            prompt_cost_per_m=3.00,
            completion_cost_per_m=15.00,
            invoke_fn=simulate_frontier_backup
        )
    ]

    router = CascadeRouter(tiers)

    # Test Scenario 1: Normal execution (Tier 1 succeeds fast)
    print("\n[SCENARIO 1] Normal Flow: Primary Tier Healthy")
    res1 = router.route_completion("Classify customer sentiment for ticket #89412")
    print(f"Result: SUCCESS via {res1['resolved_tier']}")
    print(f"Total Latency: {res1['total_latency_ms']}ms | Estimated Cost: ${res1['estimated_cost_usd']:.6f}")

    # Test Scenario 2: Tier 1 Latency Spike -> Cascades to Tier 2
    print("\n[SCENARIO 2] Failure Injection: Tier 1 Latency Spike (>400ms)")
    res2 = router.route_completion(
        "Summarize monthly transaction volume",
        context={"simulate_local_timeout": True}
    )
    print(f"Result: SUCCESS via {res2['resolved_tier']}")
    print(f"Total Latency: {res2['total_latency_ms']}ms | Estimated Cost: ${res2['estimated_cost_usd']:.6f}")
    print(f"Fallback trace: {res2['fallback_reasons']}")

    # Test Scenario 3: Tier 1 Times Out AND Tier 2 Fails -> Cascades to Tier 3
    print("\n[SCENARIO 3] Cascading Outage: Tier 1 Times Out + Tier 2 Provider Exception")
    res3 = router.route_completion(
        "Generate audit compliance report",
        context={"simulate_local_timeout": True, "simulate_cloud_error": True}
    )
    print(f"Result: SUCCESS via {res3['resolved_tier']}")
    print(f"Total Latency: {res3['total_latency_ms']}ms | Estimated Cost: ${res3['estimated_cost_usd']:.6f}")
    print(f"Attempts: {res3['attempts']} tiers tried before successful completion.")
    for reason in res3['fallback_reasons']:
        print(f"  - {reason}")

    print("\n" + "=" * 75)
    print(" Want to learn how to build resilient, production-oriented AI systems?")
    print(" Master distributed locks, DLQs, semantic caching, and full observability.")
    print(" Course: https://course.production-ai-systems.com (Launch Price: €99)")
    print(" Free Sample Lesson: https://course.production-ai-systems.com/sample-lesson")
    print("=" * 75)
