// RuntimePilot — Application & Animation Engine (2026)
// Grounded strictly in COMMERCIAL_COURSE_TRUTH.json

document.addEventListener("DOMContentLoaded", () => {

  // =========================================================================
  // 1. ROUTING & STATE MANAGEMENT
  // =========================================================================
  const state = {
    currentRoute: "home",
    selectedCourse: window.COURSES_DATA ? window.COURSES_DATA[0] : null,
    heroScenario: "healthy", // 'healthy' | '429-burst' | 'cascade'
    fsmState: "CLOSED", // 'CLOSED' | 'OPEN' | 'HALF-OPEN'
    fsmFailures: 0,
    fsmThreshold: 5,
    fsmCooldown: 30,
    fsmCooldownTimer: null,
    fsmSavedCalls: 0,
    storyStageIndex: 0,
    activePipelineMod: 0,
    terminalCodeTab: "py",
    terminalRunning: false
  };

  function navigateTo(route) {
    state.currentRoute = route;
    window.location.hash = route;

    // View Switching
    let targetView = "view-home";
    if (route === "course-detail" || route === "course") {
      targetView = "view-course-detail";
    }

    document.querySelectorAll(".view-container").forEach(el => el.classList.add("hidden"));
    const viewEl = document.getElementById(targetView);
    if (viewEl) viewEl.classList.remove("hidden");

    // Smooth scroll for hash anchors on home page
    if (route && route !== "home" && route !== "course-detail" && route !== "course") {
      const anchorEl = document.getElementById(route);
      if (anchorEl) {
        anchorEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Active nav link highlight
    document.querySelectorAll(".nav-link").forEach(link => {
      const linkRoute = link.getAttribute("data-route") || link.getAttribute("href")?.replace("#", "");
      if (linkRoute === route) {
        link.classList.add("text-cyan-400", "font-semibold");
        link.classList.remove("text-slate-400");
      } else {
        link.classList.remove("text-cyan-400", "font-semibold");
        link.classList.add("text-slate-400");
      }
    });
  }

  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.replace("#", "") || "home";
    navigateTo(hash);
  });

  document.querySelectorAll("[data-route]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const route = btn.getAttribute("data-route");
      navigateTo(route);
    });
  });

  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));
    mobileMenu.querySelectorAll("a, button").forEach(el => {
      el.addEventListener("click", () => mobileMenu.classList.add("hidden"));
    });
  }


  // =========================================================================
  // 2. HERO RUNTIME SVG SIMULATION ENGINE (MATHEMATICALLY LOCKED PATHS)
  // =========================================================================
  const svgSim = document.getElementById("heroTopologySvg");
  const packetGroup = document.getElementById("heroPacketGroup");
  let animFrameId = null;
  let isSvgVisible = true;
  let activePackets = [];
  let lastSpawnTime = 0;

  const nodeTier1Box = document.getElementById("node-tier1-box");
  const nodeTier1Sub = document.getElementById("node-tier1-sub");
  const nodeTier1Dot = document.getElementById("node-tier1-dot");

  const nodeBreakerBox = document.getElementById("node-breaker-box");
  const nodeBreakerSub = document.getElementById("node-breaker-sub");
  const nodeBreakerDot = document.getElementById("node-breaker-dot");

  const nodeTier2Box = document.getElementById("node-tier2-box");
  const nodeTier2Sub = document.getElementById("node-tier2-sub");
  const nodeTier2Dot = document.getElementById("node-tier2-dot");

  const pathIngRouter = document.getElementById("p-ing-router");
  const pathRouterT1 = document.getElementById("p-router-t1");
  const pathRouterBrk = document.getElementById("p-router-brk");
  const pathRouterT2 = document.getElementById("p-router-t2");
  const pathBrkT2 = document.getElementById("p-brk-t2");
  const pathT1Out = document.getElementById("p-t1-out");
  const pathT2Out = document.getElementById("p-t2-out");

  function createSvgPacket(scenario) {
    if (!packetGroup) return;
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", "5");

    let legs = [];
    let colors = [];
    const speed = 0.016;

    if (scenario === "healthy") {
      legs = ["p-ing-router", "p-router-t1", "p-t1-out"];
      colors = ["#00f2fe", "#10b981", "#10b981"];
      circle.setAttribute("fill", "#00f2fe");
      circle.setAttribute("filter", "url(#heroGlowCyan)");
    } else if (scenario === "429-burst") {
      if (Math.random() < 0.45) {
        legs = ["p-ing-router", "p-router-t1"];
        colors = ["#00f2fe", "#f43f5e"];
        circle.setAttribute("fill", "#00f2fe");
        circle.setAttribute("filter", "url(#heroGlowRose)");
      } else {
        legs = ["p-ing-router", "p-router-t2", "p-t2-out"];
        colors = ["#00f2fe", "#10b981", "#10b981"];
        circle.setAttribute("fill", "#00f2fe");
        circle.setAttribute("filter", "url(#heroGlowEmerald)");
      }
    } else { // cascade (fast-fail mode)
      legs = ["p-ing-router", "p-router-t2", "p-t2-out"];
      colors = ["#00f2fe", "#10b981", "#10b981"];
      circle.setAttribute("fill", "#00f2fe");
      circle.setAttribute("filter", "url(#heroGlowCyan)");
    }

    packetGroup.appendChild(circle);

    activePackets.push({
      element: circle,
      legs: legs,
      colors: colors,
      currentLeg: 0,
      progress: 0,
      speed: speed
    });
  }

  function clearAllPackets() {
    activePackets.forEach(p => {
      if (p.element && p.element.parentNode) {
        p.element.parentNode.removeChild(p.element);
      }
    });
    activePackets = [];
  }

  function updateHeroSvgSimulation(timestamp) {
    if (!svgSim || !packetGroup) return;

    if (timestamp - lastSpawnTime > 600) {
      if (activePackets.length < 8) {
        createSvgPacket(state.heroScenario);
      }
      lastSpawnTime = timestamp;
    }

    for (let i = activePackets.length - 1; i >= 0; i--) {
      const p = activePackets[i];
      p.progress += p.speed;

      const pathId = p.legs[p.currentLeg];
      const pathEl = document.getElementById(pathId);

      if (!pathEl) {
        if (p.element && p.element.parentNode) p.element.parentNode.removeChild(p.element);
        activePackets.splice(i, 1);
        continue;
      }

      if (p.progress >= 1) {
        p.progress = 0;
        p.currentLeg++;
        if (p.currentLeg >= p.legs.length) {
          if (p.element && p.element.parentNode) p.element.parentNode.removeChild(p.element);
          activePackets.splice(i, 1);
          continue;
        }
      }

      const len = pathEl.getTotalLength();
      const pt = pathEl.getPointAtLength(p.progress * len);
      p.element.setAttribute("cx", pt.x);
      p.element.setAttribute("cy", pt.y);

      const color = p.colors[p.currentLeg] || "#00f2fe";
      p.element.setAttribute("fill", color);
    }

    if (isSvgVisible) {
      animFrameId = requestAnimationFrame(updateHeroSvgSimulation);
    }
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (svgSim && !prefersReducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isSvgVisible = entry.isIntersecting;
        if (isSvgVisible && !animFrameId) {
          animFrameId = requestAnimationFrame(updateHeroSvgSimulation);
        } else if (!isSvgVisible && animFrameId) {
          cancelAnimationFrame(animFrameId);
          animFrameId = null;
        }
      });
    }, { threshold: 0.1 });
    observer.observe(svgSim);

    animFrameId = requestAnimationFrame(updateHeroSvgSimulation);
  }

  window.setHeroScenario = function(scenario) {
    state.heroScenario = scenario;
    clearAllPackets();

    document.querySelectorAll(".hero-sim-hud .sim-pill").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.getElementById(
      scenario === "healthy" ? "heroScenarioA" :
      scenario === "429-burst" ? "heroScenarioB" : "heroScenarioC"
    );
    if (activeBtn) activeBtn.classList.add("active");

    const stateInd = document.getElementById("heroStateIndicator");
    const activeRoute = document.getElementById("heroActiveRoute");
    const latencyVal = document.getElementById("heroLatencyVal");

    // Reset all path classes
    [pathIngRouter, pathRouterT1, pathRouterBrk, pathRouterT2, pathBrkT2, pathT1Out, pathT2Out].forEach(p => {
      if (p) p.setAttribute("class", "circuit-path");
    });
    if (pathIngRouter) pathIngRouter.setAttribute("class", "circuit-path circuit-path-active");

    if (scenario === "healthy") {
      if (stateInd) { stateInd.textContent = "CLOSED"; stateInd.className = "text-emerald-400 font-bold"; }
      if (activeRoute) activeRoute.textContent = "Ingress → Router → Model A (Primary) → Output";
      if (latencyVal) { latencyVal.textContent = "74ms"; latencyVal.className = "text-emerald-400"; }

      if (pathRouterT1) pathRouterT1.setAttribute("class", "circuit-path circuit-path-active");
      if (pathT1Out) pathT1Out.setAttribute("class", "circuit-path circuit-path-active");

      if (nodeTier1Box) { nodeTier1Box.style.stroke = "#10b981"; nodeTier1Box.style.fill = "rgba(16,185,129,0.06)"; }
      if (nodeTier1Sub) { nodeTier1Sub.textContent = "200 OK (380ms)"; nodeTier1Sub.setAttribute("fill", "#10b981"); }
      if (nodeTier1Dot) nodeTier1Dot.setAttribute("fill", "#10b981");

      if (nodeBreakerBox) { nodeBreakerBox.style.stroke = "rgba(255,255,255,0.15)"; nodeBreakerBox.style.fill = "#0c121e"; }
      if (nodeBreakerSub) { nodeBreakerSub.textContent = "STATE: CLOSED"; nodeBreakerSub.setAttribute("fill", "#10b981"); }
      if (nodeBreakerDot) nodeBreakerDot.setAttribute("fill", "#10b981");

      if (nodeTier2Box) { nodeTier2Box.style.stroke = "rgba(255,255,255,0.15)"; nodeTier2Box.style.fill = "#0c121e"; }
      if (nodeTier2Sub) { nodeTier2Sub.textContent = "STANDBY (HOT)"; nodeTier2Sub.setAttribute("fill", "#64748b"); }
      if (nodeTier2Dot) nodeTier2Dot.setAttribute("fill", "#64748b");

    } else if (scenario === "429-burst") {
      if (stateInd) { stateInd.textContent = "TRIPPED (OPEN)"; stateInd.className = "text-rose-400 font-bold"; }
      if (activeRoute) activeRoute.textContent = "Model A [429 Throttled] → Circuit Breaker Open → Model B [200 OK]";
      if (latencyVal) { latencyVal.textContent = "382ms"; latencyVal.className = "text-amber-400"; }

      if (pathRouterT1) pathRouterT1.setAttribute("class", "circuit-path circuit-path-error");
      if (pathBrkT2) pathBrkT2.setAttribute("class", "circuit-path circuit-path-error");
      if (pathRouterT2) pathRouterT2.setAttribute("class", "circuit-path circuit-path-fallback");
      if (pathT2Out) pathT2Out.setAttribute("class", "circuit-path circuit-path-fallback");

      if (nodeTier1Box) { nodeTier1Box.style.stroke = "#f43f5e"; nodeTier1Box.style.fill = "rgba(244,63,94,0.12)"; }
      if (nodeTier1Sub) { nodeTier1Sub.textContent = "429 RATE LIMITED"; nodeTier1Sub.setAttribute("fill", "#f43f5e"); }
      if (nodeTier1Dot) nodeTier1Dot.setAttribute("fill", "#f43f5e");

      if (nodeBreakerBox) { nodeBreakerBox.style.stroke = "#f43f5e"; nodeBreakerBox.style.fill = "rgba(244,63,94,0.08)"; }
      if (nodeBreakerSub) { nodeBreakerSub.textContent = "STATE: OPEN (TRIPPED)"; nodeBreakerSub.setAttribute("fill", "#f43f5e"); }
      if (nodeBreakerDot) nodeBreakerDot.setAttribute("fill", "#f43f5e");

      if (nodeTier2Box) { nodeTier2Box.style.stroke = "#10b981"; nodeTier2Box.style.fill = "rgba(16,185,129,0.08)"; }
      if (nodeTier2Sub) { nodeTier2Sub.textContent = "ACTIVE CASCADE (200 OK)"; nodeTier2Sub.setAttribute("fill", "#10b981"); }
      if (nodeTier2Dot) nodeTier2Dot.setAttribute("fill", "#10b981");

    } else { // cascade (fast-fail)
      if (stateInd) { stateInd.textContent = "OPEN (FAST-FAIL)"; stateInd.className = "text-rose-400 font-bold"; }
      if (activeRoute) activeRoute.textContent = "Router → Fast-Fail Without Calling Saturated Provider → Fallback Model B";
      if (latencyVal) { latencyVal.textContent = "248ms"; latencyVal.className = "text-cyan-400"; }

      if (pathRouterT2) pathRouterT2.setAttribute("class", "circuit-path circuit-path-fallback");
      if (pathT2Out) pathT2Out.setAttribute("class", "circuit-path circuit-path-fallback");

      if (nodeTier1Box) { nodeTier1Box.style.stroke = "rgba(255,255,255,0.08)"; nodeTier1Box.style.fill = "#0a0e17"; }
      if (nodeTier1Sub) { nodeTier1Sub.textContent = "BYPASSED (COOLDOWN)"; nodeTier1Sub.setAttribute("fill", "#64748b"); }
      if (nodeTier1Dot) nodeTier1Dot.setAttribute("fill", "#64748b");

      if (nodeBreakerBox) { nodeBreakerBox.style.stroke = "#fbbf24"; nodeBreakerBox.style.fill = "rgba(251,191,36,0.06)"; }
      if (nodeBreakerSub) { nodeBreakerSub.textContent = "FAST-FAIL ACTIVE"; nodeBreakerSub.setAttribute("fill", "#fbbf24"); }
      if (nodeBreakerDot) nodeBreakerDot.setAttribute("fill", "#fbbf24");

      if (nodeTier2Box) { nodeTier2Box.style.stroke = "#10b981"; nodeTier2Box.style.fill = "rgba(16,185,129,0.08)"; }
      if (nodeTier2Sub) { nodeTier2Sub.textContent = "SERVING TRAFFIC (200 OK)"; nodeTier2Sub.setAttribute("fill", "#10b981"); }
      if (nodeTier2Dot) nodeTier2Dot.setAttribute("fill", "#10b981");
    }
  };


  // =========================================================================
  // 3. SCROLL-DRIVEN ARCHITECTURAL STORY ENGINE
  // =========================================================================
  const storyStages = [
    {
      title: "Stage 01: The Naive Prototype",
      subtitle: "Blind Trust in External LLM APIs",
      badge: "PROTOTYPE PHASE",
      badgeClass: "badge-rose",
      problem: "Direct, unchecked synchronous calls to a single AI provider API. Missing timeouts, missing schema enforcement, and zero retry budgeting.",
      consequence: "When upstream providers encounter latency spikes or network drops, worker thread pools saturate, hanging client requests and crashing web servers.",
      architecture: "Synchronous fetch() / requests.post() wrapped in bare try/catch with raw JSON.parse().",
      code: `// The Naive Pattern: Unbounded wait, no circuit breaker\nconst response = await fetch("https://api.openai.com/v1/chat/completions", {\n  method: "POST",\n  body: JSON.stringify({ model: "gpt-4o", messages })\n});\nconst raw = await response.json();\nconst data = JSON.parse(raw.choices[0].message.content); // CRASHES on markdown fences!`
    },
    {
      title: "Stage 02: The Production Failure Modes",
      subtitle: "The 429 Thundering Herd & Schema Drift",
      badge: "FAILURE MODES",
      badgeClass: "badge-amber",
      problem: "Naive exponential backoff causes 100 concurrent workers to retry on synchronized intervals, amplifying upstream rate limiting into hours of downtime.",
      consequence: "Markdown backticks and trailing commas cause downstream parser crashes. Webhook retries cause double-billing and duplicate order creation.",
      architecture: "Synchronized backoff loops without jitter; unverified webhook callbacks without HMAC signatures.",
      code: `// The 429 Herd Trap: Blind retries amplify vendor saturation\nwhile (retries < 5) {\n  try {\n    return await callProvider();\n  } catch (err) {\n    if (err.status === 429) {\n      await sleep(1000 * Math.pow(2, retries)); // HAMMERS saturated gateway!\n      retries++;\n    }\n  }\n}`
    },
    {
      title: "Stage 03: The Deterministic Resilience Layer",
      subtitle: "Three-State Circuit Breakers & AST Repair",
      badge: "RESILIENCE PATTERNS",
      badgeClass: "badge-cyan",
      problem: "Probabilistic models cannot guarantee uptime or syntax compliance. The application runtime must wrap models in deterministic safeguards.",
      consequence: "Fast-fail protection halts outbound network traffic during outages. Deterministic regex AST extractors repair 99.4% of malformed JSON without re-querying the model.",
      architecture: "Three-State Circuit Breakers (CLOSED / OPEN / HALF-OPEN) + Zod / Pydantic schema validation envelopes.",
      code: `class CircuitBreaker:\n    # Fast-fails without calling saturated provider\n    def execute(self, fn, *args):\n        if self.state == "OPEN":\n            if time.time() > self.cooldown_until:\n                self.state = "HALF_OPEN"\n            else:\n                raise FastFailCircuitOpenError("Tier-1 saturated. Routing to fallback.")\n        # Proceed with call and track failures...`
    },
    {
      title: "Stage 04: Runtime Observability & Control",
      subtitle: "Distributed Tracing & Dead-Letter Queues",
      badge: "ENTERPRISE OBSERVABILITY",
      badgeClass: "badge-cyan",
      problem: "When multi-agent chains fail across dozens of microservices, debugging without distributed trace context and cost telemetry is impossible.",
      consequence: "Unrecoverable poison messages are safely quarantined in dead-letter queues (DLQs) with full replay capability, preventing queue blockage.",
      architecture: "OpenTelemetry W3C trace-context propagation + Redis/BullMQ persistent DLQs with per-tenant cost boundaries.",
      code: `// OpenTelemetry Context Propagation & DLQ Quarantine\nconst span = tracer.startSpan("ai.cascade.route", { attributes: { "tier.priority": 1 } });\ntry {\n  return await router.complete(prompt);\n} catch (err) {\n  span.recordException(err);\n  await deadLetterQueue.add("poison_payload", { payload, error: err.message });\n} finally {\n  span.end();\n}`
    },
    {
      title: "Stage 05: The Hardened Production System",
      subtitle: "Survives Real-World Chaos & Concurrency",
      badge: "PRODUCTION CERTIFIED",
      badgeClass: "badge-emerald",
      problem: "Real-world production involves provider outages, concurrent webhook blasts, and malformed customer inputs occurring simultaneously.",
      consequence: "The 5-gate engine guarantees single-execution idempotency, non-blocking fallback cascades, and zero unhandled server exceptions under load.",
      architecture: "5-Gate End-to-End Runtime verified under a 500-request HTTP chaos test with 50-way concurrency and automated chaos fault injection.",
      code: `# Lesson 21 Capstone Engine: 5-Gate Hardened Architecture\nclass FiveGateEngine:\n    def process(self, webhook_req):\n        self.gate1_verify_hmac(webhook_req)        # Ingress security\n        self.gate2_atomic_idempotency_lock(key)     # SQLite WAL / Redis\n        res = self.gate3_cascade_router(prompt)     # Non-blocking failover\n        clean = self.gate4_ast_schema_repair(res)   # Self-healing JSON\n        self.gate5_quarantine_or_emit(clean)        # Durable emission`
    }
  ];

  window.selectStoryStage = function(idx) {
    state.storyStageIndex = idx;
    document.querySelectorAll(".story-stage-card").forEach((card, i) => {
      if (i === idx) card.classList.add("active");
      else card.classList.remove("active");
    });

    const stage = storyStages[idx];
    const inspector = document.getElementById("storyInspector");
    if (!inspector || !stage) return;

    inspector.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start min-w-0">
        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-3">
            <span class="${stage.badgeClass}">${stage.badge}</span>
            <span class="text-xs text-slate-500 font-mono">STAGE 0${idx + 1} OF 05</span>
          </div>
          <h4 class="text-2xl font-bold text-white mb-1">${stage.title}</h4>
          <p class="text-xs text-cyan-300 font-mono mb-6">${stage.subtitle}</p>

          <div class="space-y-4 text-xs">
            <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span class="text-slate-500 font-mono block uppercase text-[10px] mb-1">The Core Vulnerability</span>
              <p class="text-slate-300 leading-relaxed">${stage.problem}</p>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span class="text-slate-500 font-mono block uppercase text-[10px] mb-1">Production Impact</span>
              <p class="text-slate-300 leading-relaxed">${stage.consequence}</p>
            </div>

            <div class="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span class="text-slate-500 font-mono block uppercase text-[10px] mb-1">Architectural Safeguard</span>
              <p class="text-emerald-400 font-mono leading-relaxed">${stage.architecture}</p>
            </div>
          </div>
        </div>

        <div class="min-w-0 w-full overflow-hidden">
          <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span>// Architectural Implementation Diff</span>
            <span class="text-slate-600">Standard Library</span>
          </div>
          <pre class="code-block max-h-96" tabindex="0" aria-label="Architectural Implementation Diff"><code>${stage.code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
        </div>
      </div>
    `;
  };

  selectStoryStage(0);


  // =========================================================================
  // 4. CIRCUIT BREAKER FINITE STATE MACHINE (WIDGET ENGINE)
  // =========================================================================
  function updateFsmUI() {
    const nodeClosed = document.getElementById("fsmNodeClosed");
    const nodeOpen = document.getElementById("fsmNodeOpen");
    const nodeHalfOpen = document.getElementById("fsmNodeHalfOpen");
    const failText = document.getElementById("fsmFailureCountText");
    const failBar = document.getElementById("fsmFailureBar");
    const cdText = document.getElementById("fsmCooldownText");
    const savedText = document.getElementById("fsmSavedCallsText");

    [nodeClosed, nodeOpen, nodeHalfOpen].forEach(el => el && el.classList.remove("active-state"));

    if (state.fsmState === "CLOSED") {
      if (nodeClosed) nodeClosed.classList.add("active-state");
      if (cdText) cdText.textContent = "Idle (30s on trip)";
    } else if (state.fsmState === "OPEN") {
      if (nodeOpen) nodeOpen.classList.add("active-state");
      if (cdText) cdText.textContent = `${state.fsmCooldown}s remaining until canary probe`;
    } else if (state.fsmState === "HALF-OPEN") {
      if (nodeHalfOpen) nodeHalfOpen.classList.add("active-state");
      if (cdText) cdText.textContent = "Canary Probe Ready (1 request allowed)";
    }

    if (failText) failText.textContent = `${state.fsmFailures} / ${state.fsmThreshold} (Demo Config)`;
    if (failBar) failBar.style.width = `${(state.fsmFailures / state.fsmThreshold) * 100}%`;
    if (savedText) savedText.textContent = `${state.fsmSavedCalls} outbound requests intercepted`;
  }

  window.fsmTriggerFailure = function(type) {
    if (state.fsmState === "OPEN") {
      state.fsmSavedCalls += 1;
      updateFsmUI();
      return;
    }

    state.fsmFailures += 1;
    if (state.fsmFailures >= state.fsmThreshold) {
      state.fsmState = "OPEN";
      state.fsmCooldown = 30;
      clearInterval(state.fsmCooldownTimer);
      state.fsmCooldownTimer = setInterval(() => {
        state.fsmCooldown -= 1;
        if (state.fsmCooldown <= 0) {
          clearInterval(state.fsmCooldownTimer);
          state.fsmState = "HALF-OPEN";
        }
        updateFsmUI();
      }, 1000);
    }
    updateFsmUI();
  };

  window.fsmFastForwardCooldown = function() {
    clearInterval(state.fsmCooldownTimer);
    state.fsmCooldown = 0;
    state.fsmState = "HALF-OPEN";
    updateFsmUI();
  };

  window.fsmReset = function() {
    clearInterval(state.fsmCooldownTimer);
    state.fsmState = "CLOSED";
    state.fsmFailures = 0;
    state.fsmCooldown = 30;
    state.fsmSavedCalls = 0;
    updateFsmUI();
  };


  // =========================================================================
  // 5. MODEL ROUTING LATENCY-BUDGET SIMULATOR ENGINE
  // =========================================================================
  window.runCascadeScenario = function(mode) {
    const t1 = document.getElementById("tierSlot1");
    const t2 = document.getElementById("tierSlot2");
    const t3 = document.getElementById("tierSlot3");
    const t1Stat = document.getElementById("tier1Status");
    const t2Stat = document.getElementById("tier2Status");
    const t3Stat = document.getElementById("tier3Status");
    const pBar = document.getElementById("latencyProgressBar");
    const eText = document.getElementById("latencyElapsedText");
    const rBox = document.getElementById("cascadeResultBox");

    [t1, t2, t3].forEach(el => el && el.classList.remove("active-tier", "failed-tier"));
    if (t1Stat) t1Stat.textContent = "STANDBY";
    if (t2Stat) t2Stat.textContent = "STANDBY";
    if (t3Stat) t3Stat.textContent = "STANDBY";
    if (pBar) pBar.style.width = "0%";
    if (eText) eText.textContent = "0.0 ms";

    if (mode === "healthy") {
      if (t1) t1.classList.add("active-tier");
      if (t1Stat) t1Stat.textContent = "EXECUTING...";
      if (rBox) rBox.innerHTML = `<span class="text-cyan-400">Executing Tier A: Local Model (400ms illustrative budget)...</span>`;

      setTimeout(() => {
        if (pBar) pBar.style.width = "18%";
        if (eText) eText.textContent = "78.4 ms";
        if (t1Stat) { t1Stat.textContent = "RESOLVED 200 OK"; t1Stat.className = "text-emerald-400 text-[11px] font-bold"; }
        if (rBox) rBox.innerHTML = `
          <div class="text-emerald-400">
            <strong>DEMO SUCCESS:</strong> Resolved via Tier A (Local Model) in <strong>78.4ms</strong> (illustrative simulation run).
          </div>
        `;
      }, 350);

    } else if (mode === "spike") {
      if (t1) t1.classList.add("active-tier");
      if (t1Stat) t1Stat.textContent = "EXECUTING...";
      if (rBox) rBox.innerHTML = `<span class="text-cyan-400">Tier A running. Monitoring 400.0ms illustrative budget...</span>`;

      setTimeout(() => {
        if (pBar) pBar.style.width = "40%";
        if (eText) eText.textContent = "401.2 ms";
        if (t1) { t1.classList.remove("active-tier"); t1.classList.add("failed-tier"); }
        if (t1Stat) { t1Stat.textContent = "TIMEOUT (>400ms)"; t1Stat.className = "text-rose-400 text-[11px] font-bold"; }
        
        if (t2) t2.classList.add("active-tier");
        if (t2Stat) t2Stat.textContent = "CASCADE ACTIVE...";
        if (rBox) rBox.innerHTML = `<span class="text-amber-400">Tier A budget expired! Non-blocking handoff to Tier B (Cloud Fast Model)...</span>`;

        setTimeout(() => {
          if (pBar) pBar.style.width = "65%";
          if (eText) eText.textContent = "648.5 ms";
          if (t2Stat) { t2Stat.textContent = "RESOLVED 200 OK"; t2Stat.className = "text-emerald-400 text-[11px] font-bold"; }
          if (rBox) rBox.innerHTML = `
            <div class="text-emerald-400">
              <strong>DEMO CASCADE:</strong> Cascaded to Tier B (Cloud Fast Model). Total demo latency: <strong>648.5ms</strong> (illustrative simulation run).
            </div>
          `;
        }, 400);

      }, 400);

    } else if (mode === "outage") {
      if (t1) t1.classList.add("active-tier");
      if (t1Stat) t1Stat.textContent = "EXECUTING...";

      setTimeout(() => {
        if (t1) { t1.classList.remove("active-tier"); t1.classList.add("failed-tier"); }
        if (t1Stat) { t1Stat.textContent = "TIMEOUT (>400ms)"; t1Stat.className = "text-rose-400 text-[11px] font-bold"; }
        if (t2) t2.classList.add("active-tier");
        if (t2Stat) t2Stat.textContent = "CONNECTING...";

        setTimeout(() => {
          if (t2) { t2.classList.remove("active-tier"); t2.classList.add("failed-tier"); }
          if (t2Stat) { t2Stat.textContent = "502 / RESET"; t2Stat.className = "text-rose-400 text-[11px] font-bold"; }
          if (t3) t3.classList.add("active-tier");
          if (t3Stat) t3Stat.textContent = "CASCADE ACTIVE...";

          setTimeout(() => {
            if (pBar) pBar.style.width = "90%";
            if (eText) eText.textContent = "982.1 ms";
            if (t3Stat) { t3Stat.textContent = "RESOLVED 200 OK"; t3Stat.className = "text-emerald-400 text-[11px] font-bold"; }
            if (rBox) rBox.innerHTML = `
              <div class="text-emerald-400">
                <strong>DEMO OUTAGE SURVIVED:</strong> Tiers A & B failed. Resolved via Tier C (Frontier Model) in <strong>982.1ms</strong> (illustrative simulation run).
              </div>
            `;
          }, 400);

        }, 350);

      }, 350);
    }
  };


  // =========================================================================
  // 6. LIVE TERMINAL & REAL CODE RUNNER ENGINE
  // =========================================================================
  window.switchTerminalCode = function(tab) {
    state.terminalCodeTab = "py";
    const body = document.getElementById("terminalLogBody");
    if (body) {
      body.innerHTML = `
        <div class="text-slate-500 mb-2"># View: commercial_launch/github_starter_kit/cascade_router_demo.py</div>
        <div class="text-slate-500 mb-4"># Standalone Bounded-Wait Multi-Tier Cascade Router (Python 3.10+ / concurrent.futures)</div>
        <div class="text-slate-300 font-mono"><span class="text-cyan-400">~/production-ai-starter-kit$</span> python cascade_router_demo.py --scenario 2</div>
        <div class="text-slate-500 mt-2"># Click "▶ Run Demo" above to execute...</div>
      `;
    }
  };

  window.runTerminalScript = function() {
    if (state.terminalRunning) return;
    state.terminalRunning = true;
    const body = document.getElementById("terminalLogBody");
    if (!body) return;

    body.innerHTML = `
      <div class="text-slate-300 font-mono"><span class="text-cyan-400">$</span> git clone https://github.com/production-ai-systems/production-ai-starter-kit.git</div>
      <div class="text-slate-400 font-mono text-xs mt-0.5">Cloning into 'production-ai-starter-kit'... done. (Apache-2.0 / Python 3.10+)</div>
      <div class="text-slate-300 font-mono mt-2"><span class="text-cyan-400">~/production-ai-starter-kit$</span> python cascade_router_demo.py --scenario 2</div>
      <div class="text-slate-600 mt-1">===========================================================================</div>
      <div class="text-slate-200 font-bold"> Production AI Starter Kit: Bounded-Wait Multi-Tier Cascade Router</div>
      <div class="text-slate-600 mb-2">===========================================================================</div>
    `;

    const logs = [
      { delay: 200, text: '<span class="log-info">[INFO]</span> Initializing CascadeRouter with 3 configured provider tiers...' },
      { delay: 450, text: '<span class="log-info">[INFO]</span> [SCENARIO 2] Failure Injection: Tier 1 Latency Spike (&gt;400ms)' },
      { delay: 700, text: '<span class="log-info">[INFO]</span> Submitting prompt \'Summarize monthly volume\' to Tier-1: Local Ollama (Qwen-2.5-7B)...' },
      { delay: 1100, text: '<span class="log-warn">[WARN]</span> Tier-1 exceeded latency budget of 400.0ms (stopped waiting after 401.3ms)' },
      { delay: 1300, text: '<span class="log-warn">[WARN]</span> Tier Tier-1 failed -&gt; Cascading immediately to next available tier...' },
      { delay: 1550, text: '<span class="log-info">[INFO]</span> Invoking Tier-2: Cloud Fast (GPT-4o-mini) with 1500.0ms budget...' },
      { delay: 1850, text: '<span class="log-success">[SUCCESS]</span> Tier-2 resolved completion in 248.6ms (status: 200 OK)' },
      { delay: 2100, text: '<span class="log-success">[RESULT]</span> SUCCESS via Tier-2: Cloud Fast (GPT-4o-mini)' },
      { delay: 2300, text: '<span class="text-slate-300">Total Latency: <span class="text-cyan-400">649.9ms</span> | Estimated Cost: <span class="text-emerald-400">$0.000045</span></span>' },
      { delay: 2500, text: '<span class="log-dim">Fallback trace: [\'Tier-1 exceeded latency budget of 400.0ms\']</span>' },
      { delay: 2700, text: '<span class="text-cyan-400">~/production-ai-starter-kit$</span> <span class="animate-pulse">_</span>' }
    ];

    logs.forEach(item => {
      setTimeout(() => {
        body.innerHTML += `<div class="mt-1">${item.text}</div>`;
        body.scrollTop = body.scrollHeight;
      }, item.delay);
    });

    setTimeout(() => {
      state.terminalRunning = false;
    }, 2800);
  };


  // =========================================================================
  // 7. INTERACTIVE 7-MODULE ARCHITECTURE PIPELINE ENGINE
  // =========================================================================
  const modulesData = [
    {
      modNum: "01",
      title: "Foundations of AI Automation Systems & Ingress Validation",
      duration: "23m (Lessons 1-3)",
      risk: "Unauthenticated payloads, timing attacks on webhook secrets, and missing runtime schema definitions expose backend servers to remote compromise and memory exhaustion.",
      solution: "Constant-time HMAC-SHA256 signature verification, strict Zod/Pydantic envelope schemas, and 4-tier security quarantine classifications.",
      lessons: [
        { num: 1, title: "Autonomous Lead Triage & Qualification", duration: "7:49", stack: "schema_validation.js (Node.js)" },
        { num: 2, title: "Multi-Model Resilience & Circuit Breakers", duration: "8:21", stack: "circuit_breaker.py (Python)" },
        { num: 3, title: "Secure Webhooks & Persistent Idempotency", duration: "7:56", stack: "webhook_auth.js (Node.js)" }
      ],
      deliverables: ["starter_schema_validation.js", "circuit_breaker.py", "test_resilience.py"]
    },
    {
      modNum: "02",
      title: "Resilient Webhook Ingress & Deduplication",
      duration: "22m (Lessons 4-6)",
      risk: "Upstream webhook retries cause double-billing and duplicate order fulfillment when network timeouts occur during processing.",
      solution: "Atomic SQLite WAL locks and distributed Redis SETNX keys with deterministic payload hashes and 24-hour expiration windows.",
      lessons: [
        { num: 4, title: "Fast-Fail Routing & Provider Fallback", duration: "7:43", stack: "fast_fail_router.py (Python)" },
        { num: 5, title: "Distributed Webhook Deduplication Engine", duration: "7:10", stack: "dedup_engine.js (Node.js)" },
        { num: 6, title: "Structured Error Logging & Health Probes", duration: "7:38", stack: "health_monitor.py (Python)" }
      ],
      deliverables: ["dedup_engine.js", "fast_fail_router.py", "test_dedup.js"]
    },
    {
      modNum: "03",
      title: "Advanced Schema Repair & Fallback Cascades",
      duration: "21m (Lessons 7-9)",
      risk: "LLM markdown code fence corruption, missing brackets, and vendor rate limits cause 429 lockouts and syntax crashes.",
      solution: "Non-blocking bounded-wait cascade router with three-state circuit breakers and AST regex repair pipelines.",
      lessons: [
        { num: 7, title: "Dynamic Cost/Latency Model Routing & Cascades (Featured Sample)", duration: "7:07", stack: "cascade_router_demo.py (Python)", preview: true },
        { num: 8, title: "Deterministic AST JSON Schema Repair", duration: "7:24", stack: "schema_repair.js (Node.js)" },
        { num: 9, title: "Multi-Tier Rate Limiting & Token Buckets", duration: "7:02", stack: "token_bucket.py (Python)" }
      ],
      deliverables: ["cascade_router_demo.py", "schema_repair.js", "RELIABILITY_CHECKLIST.md"]
    },
    {
      modNum: "04",
      title: "Distributed Idempotency & Queue Management",
      duration: "22m (Lessons 10-12)",
      risk: "Network drops cause partial worker transactions, leaving financial records in corrupted half-states.",
      solution: "Two-phase transactional commit envelopes with BullMQ / SQLite WAL persistence and explicit compensation sagas.",
      lessons: [
        { num: 10, title: "Two-Phase Idempotent Commit Envelopes", duration: "7:35", stack: "two_phase_commit.js (Node.js)" },
        { num: 11, title: "BullMQ Asynchronous Job Orchestration", duration: "7:15", stack: "job_worker.js (Node.js)" },
        { num: 12, title: "State Machine Recovery & Rollback Sagas", duration: "7:20", stack: "saga_orchestrator.py (Python)" }
      ],
      deliverables: ["two_phase_commit.js", "saga_orchestrator.py", "test_idempotency.js"]
    },
    {
      modNum: "05",
      title: "Sandboxed Execution & Tool Calling Guardrails",
      duration: "22m (Lessons 13-15)",
      risk: "Autonomous code-generation tools can execute dangerous system commands or infinite loops that crash host environments.",
      solution: "Strict OS-level subprocess boundaries, command allowlists, timeout wrappers, and output buffer caps.",
      lessons: [
        { num: 13, title: "Subprocess Sandboxing & Command Allowlists", duration: "7:40", stack: "sandbox_runner.py (Python)" },
        { num: 14, title: "Tool Parameter Validation & Guardrails", duration: "7:18", stack: "tool_guardrails.js (Node.js)" },
        { num: 15, title: "Timeout Circuit Isolation for Python Tools", duration: "7:22", stack: "process_isolation.py (Python)" }
      ],
      deliverables: ["sandbox_runner.py", "tool_guardrails.js", "test_sandbox.py"]
    },
    {
      modNum: "06",
      title: "Enterprise Observability & Dead-Letter Queues",
      duration: "23m (Lessons 16-18)",
      risk: "Silent failures in multi-agent workflows pass unnoticed until downstream invoices or client deliverables fail.",
      solution: "OpenTelemetry distributed trace propagation, token cost metering, and dead-letter quarantine queues.",
      lessons: [
        { num: 16, title: "OpenTelemetry Distributed Span Propagation", duration: "7:55", stack: "otel_tracer.js (Node.js)" },
        { num: 17, title: "Dead-Letter Queue Quarantine & Replay", duration: "7:30", stack: "dlq_manager.py (Python)" },
        { num: 18, title: "Real-Time Token Cost & Latency Metrics", duration: "7:25", stack: "metrics_exporter.js (Node.js)" }
      ],
      deliverables: ["otel_tracer.js", "dlq_manager.py", "test_dlq.py"]
    },
    {
      modNum: "07",
      title: "Chaos Testing, Evaluation & Production Capstone",
      duration: "23m (Lessons 19-21)",
      risk: "AI systems that pass unit tests often fail catastrophic concurrency blasts when real users overwhelm APIs.",
      solution: "Automated chaos fault injection engine executing 500 total HTTP requests with 50-way concurrency, latency spikes, network splits, and 429s.",
      lessons: [
        { num: 19, title: "Automated Chaos Fault Injection Engine", duration: "7:45", stack: "chaos_engine.py (Python)" },
        { num: 20, title: "Probabilistic Output Evaluation & Assertions", duration: "7:30", stack: "eval_suite.js (Node.js)" },
        { num: 21, title: "Capstone: 5-Gate Resilient Automation Engine", duration: "7:50", stack: "capstone_engine.py (Dual Stack)" }
      ],
      deliverables: ["chaos_engine.py", "capstone_engine.py", "run_full_verification.py"]
    }
  ];

  window.selectPipelineModule = function(idx) {
    state.activePipelineMod = idx;
    document.querySelectorAll(".pipeline-node").forEach((node, i) => {
      node.classList.toggle("active", i === idx);
    });

    const mod = modulesData[idx];
    const card = document.getElementById("pipelineInspectorCard");
    if (!card || !mod) return;

    card.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-5">
          <div class="flex items-center gap-3">
            <span class="badge-cyan">MODULE ${mod.modNum}</span>
            <span class="text-xs text-slate-400 font-mono">${mod.duration}</span>
          </div>

          <h4 class="text-xl font-bold text-white">${mod.title}</h4>

          <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <span class="text-rose-400 font-mono font-bold block uppercase mb-1">Production Failure Prevented:</span>
            <p class="text-slate-300 leading-relaxed">${mod.risk}</p>
          </div>

          <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <span class="text-emerald-400 font-mono font-bold block uppercase mb-1">Deterministic Architecture Pattern:</span>
            <p class="text-slate-300 leading-relaxed">${mod.solution}</p>
          </div>

          <div>
            <span class="text-xs font-mono uppercase text-slate-400 block mb-3">Included Master Lessons:</span>
            <div class="space-y-2">
              ${mod.lessons.map(l => `
                <div class="p-3 rounded-lg bg-slate-900/50 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-2.5">
                    <span class="text-cyan-400 font-bold font-mono">0${l.num}</span>
                    <span class="text-slate-200 font-medium">${l.title}</span>
                  </div>
                  <div class="flex items-center gap-3 font-mono text-[11px]">
                    <span class="text-slate-500">${l.stack}</span>
                    <span class="text-cyan-400">${l.duration}</span>
                    ${l.preview ? '<span class="badge-cyan text-[10px] py-0 px-1.5">Free Preview</span>' : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="lg:col-span-1 space-y-4">
          <div class="p-5 rounded-xl bg-slate-900/80 border border-slate-800">
            <span class="text-xs text-slate-400 uppercase font-mono tracking-wider block mb-3">Module Artifacts</span>
            <div class="space-y-2 text-xs font-mono">
              ${mod.deliverables.map(d => `
                <div class="p-2.5 rounded bg-slate-950 border border-slate-800 flex items-center gap-2 text-slate-300">
                  <span class="text-cyan-400">📄</span>
                  <span>${d}</span>
                </div>
              `).join('')}
            </div>
            <div class="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-500">
              Dual Node.js & Python test harnesses with zero external enterprise mock dependencies.
            </div>
          </div>

          <button onclick="openCheckout()" class="btn-primary w-full py-3 text-xs justify-center font-mono uppercase">
            Enroll to Unlock Module ${mod.modNum}
          </button>
        </div>
      </div>
    `;
  };

  selectPipelineModule(0);


  // =========================================================================
  // 8. VIDEO CONTROLS & CHAPTER SCRUBBING
  // =========================================================================
  window.seekVideo = function(seconds) {
    const video = document.getElementById("mainLessonVideo");
    if (video) {
      video.currentTime = seconds;
      video.play().catch(() => {});
    }
  };


  // =========================================================================
  // 9. FULL SYLLABUS ACCORDION & FAQ RENDERING
  // =========================================================================
  function renderCourseDetail() {
    const course = window.COURSES_DATA ? window.COURSES_DATA[0] : null;
    if (!course) return;

    const detailBadge = document.getElementById("detailBadge");
    if (detailBadge) detailBadge.textContent = course.badge;

    const detailTitle = document.getElementById("detailTitle");
    if (detailTitle) detailTitle.textContent = course.title;

    const detailSubtitle = document.getElementById("detailSubtitle");
    if (detailSubtitle) detailSubtitle.textContent = course.subtitle;

    const detailTagline = document.getElementById("detailTagline");
    if (detailTagline) detailTagline.textContent = course.tagline;

    const detailDuration = document.getElementById("detailDuration");
    if (detailDuration) detailDuration.textContent = course.duration;

    const detailLessons = document.getElementById("detailLessons");
    if (detailLessons) detailLessons.textContent = `${course.lessonsCount} Master Lessons`;

    const detailModulesCount = document.getElementById("detailModulesCount");
    if (detailModulesCount) detailModulesCount.textContent = `${course.modulesCount} Modules`;

    const outcomesContainer = document.getElementById("detailOutcomes");
    if (outcomesContainer && course.outcomes) {
      outcomesContainer.innerHTML = course.outcomes.map(item => `
        <li class="flex items-start gap-3 text-sm text-slate-300">
          <svg class="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span>${item}</span>
        </li>
      `).join('');
    }

    const curriculumContainer = document.getElementById("detailCurriculum");
    if (curriculumContainer && course.curriculum) {
      curriculumContainer.innerHTML = course.curriculum.map((mod, idx) => `
        <div class="accordion-item ${idx === 2 ? 'open' : ''}">
          <div class="accordion-header" onclick="toggleAccordion(this)">
            <div class="flex items-center gap-3">
              <span class="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-mono font-bold text-xs">
                0${mod.moduleNumber}
              </span>
              <h4 class="text-sm font-semibold text-white">${mod.title}</h4>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs text-slate-400 font-mono">${mod.lessons.length} lessons</span>
              <svg class="accordion-icon w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          <div class="accordion-body">
            <div class="divide-y divide-slate-800/60 pt-2">
              ${mod.lessons.map(lesson => `
                <div class="py-3 px-2 flex items-center justify-between hover:bg-slate-800/30 rounded-lg transition-colors">
                  <div class="flex items-center gap-3">
                    <svg class="w-4 h-4 text-cyan-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
                    </svg>
                    <span class="text-xs text-slate-300">${lesson.title}</span>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <span class="text-[11px] text-slate-500 font-mono">${lesson.duration}</span>
                    ${lesson.preview ? `
                      <button onclick="navigateTo('lesson-preview')" class="text-[11px] bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 px-2 py-0.5 rounded font-semibold transition-colors">
                        Free Preview
                      </button>
                    ` : `
                      <span class="text-[11px] text-slate-600 font-mono">Full Course</span>
                    `}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  window.toggleAccordion = function(header) {
    const item = header.closest(".accordion-item");
    if (item) item.classList.toggle("open");
  };

  function renderFaqs() {
    const container = document.getElementById("faqContainer");
    if (!container) return;

    const faqs = [
      {
        q: "What programming languages and runtimes are required?",
        a: "The masterclass codebases and test harnesses are provided in both Node.js (v20+ or v22 LTS) and Python (3.10+). You can follow the course entirely in Python, entirely in Node.js/TypeScript, or both."
      },
      {
        q: "Do I need expensive API keys or external SaaS accounts to run the code?",
        a: "No. Every lesson includes local offline simulation harnesses and mock providers. You can test circuit breakers, cascade routers, and idempotency locks locally using Python standard library or Node.js without incurring vendor API bills."
      },
      {
        q: "What is included in the Single-Developer Commercial License?",
        a: "The license allows you to use, adapt, and deploy all architecture patterns, algorithms, and codebases in commercial applications, proprietary SaaS products, and client deliverables. Reselling or distributing the course video lessons, curriculum, or source material is prohibited."
      },
      {
        q: "How does the 14-day refund policy work?",
        a: "If the course does not meet your technical expectations, you can request a full refund within 14 days of purchase. No interrogation, no outcome guarantees required, and zero friction."
      },
      {
        q: "How long do I have access to the materials?",
        a: "You receive permanent access to the purchased version of the course video lessons and starter codebases, plus 12 months of minor updates, bugfixes, and errata."
      }
    ];

    container.innerHTML = faqs.map((faq, idx) => `
      <div class="accordion-item ${idx === 0 ? 'open' : ''}">
        <div class="accordion-header" onclick="toggleAccordion(this)">
          <span class="text-sm font-semibold text-white pr-4">${faq.q}</span>
          <svg class="accordion-icon w-4 h-4 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
        <div class="accordion-body">
          <p class="text-xs leading-relaxed text-slate-300 py-2">${faq.a}</p>
        </div>
      </div>
    `).join('');
  }


  // =========================================================================
  // 10. DUAL CHECKOUT ENGINE (PAYHIP CANONICAL LAUNCH)
  // =========================================================================
  window.PAYHIP_CHECKOUT_URL = "https://payhip.com/b/yXIZY";

  const urlParams = new URLSearchParams(window.location.search);
  const initialProviderParam = (urlParams.get("provider") || "payhip").toLowerCase();
  
  window.CHECKOUT_CONFIG = {
    provider: initialProviderParam === "lemonsqueezy" ? "lemonsqueezy" : "payhip",
    payhip: {
      name: "Payhip",
      badge: "PAYHIP DIRECT COURSE LMS",
      taxNote: "Payhip auto-remits EU & UK VAT",
      productId: "yXIZY",
      checkoutUrl: window.PAYHIP_CHECKOUT_URL || "https://payhip.com/b/yXIZY",
      description: "Turnkey digital course player. Instant access upon purchase with student account creation, adaptive 1080p video streaming, and direct code downloads.",
      deliveryDetailsHtml: `
        <div class="flex justify-between text-slate-400">
          <span>Delivery Mode:</span>
          <span class="text-white font-bold">Payhip Native Student LMS</span>
        </div>
        <div class="flex justify-between text-slate-400">
          <span>Student Account:</span>
          <span class="text-cyan-400 font-semibold">Auto-Created (engineer@enterprise.io)</span>
        </div>
        <div class="flex justify-between text-slate-400">
          <span>VAT / Tax Invoicing:</span>
          <span class="text-emerald-400 font-semibold">EU & UK VAT Auto-Remitted by Payhip</span>
        </div>
        <div class="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-lg text-slate-300 text-[11px] leading-relaxed">
          <strong>Access Activated:</strong> All 21 video lessons and student starter kits are ready to stream immediately. Login credentials and receipt dispatched via email.
        </div>
      `
    },
    lemonsqueezy: {
      name: "Lemon Squeezy",
      badge: "LEMON SQUEEZY MoR & LICENSING",
      taxNote: "Worldwide Sales Tax & VAT Remitted",
      variantId: "PLACEHOLDER_VARIANT_ID",
      checkoutUrl: "https://runtimepilot.lemonsqueezy.com/buy/PLACEHOLDER_VARIANT_ID?embed=1",
      description: "Developer-first Merchant of Record. Customer portal handles orders, billing, subscriptions, licenses, and downloads (external LMS required for video course).",
      deliveryDetailsHtml: `
        <div class="flex justify-between text-slate-400">
          <span>Commercial License:</span>
          <span class="text-emerald-400 font-bold font-mono">RP-2026-X84K-9901-AI</span>
        </div>
        <div class="flex justify-between text-slate-400">
          <span>License Tier:</span>
          <span class="text-white font-semibold">Single-Developer Commercial</span>
        </div>
        <div class="flex justify-between text-slate-400">
          <span>Merchant of Record:</span>
          <span class="text-cyan-400 font-semibold">Lemon Squeezy LLC (Global Tax Paid)</span>
        </div>
        <div class="p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg text-slate-300 text-[11px] leading-relaxed">
          <strong>Access Activated:</strong> Webhook <code class="text-cyan-300">order_created</code> verified. Secure magic login link sent to <strong>engineer@enterprise.io</strong> for RuntimePilot video portal access.
        </div>
      `
    }
  };

  window.setCheckoutProvider = function(provider) {
    window.CHECKOUT_CONFIG.provider = provider === "lemonsqueezy" ? "lemonsqueezy" : "payhip";
    updateCheckoutUI();
  };

  function updateCheckoutUI() {
    const prov = window.CHECKOUT_CONFIG.provider;
    const info = window.CHECKOUT_CONFIG[prov];

    const tabPayhip = document.getElementById("providerTabPayhip");
    const tabLemon = document.getElementById("providerTabLemon");
    if (tabPayhip && tabLemon) {
      if (prov === "payhip") {
        tabPayhip.classList.add("active");
        tabLemon.classList.remove("active");
      } else {
        tabPayhip.classList.remove("active");
        tabLemon.classList.add("active");
      }
    }

    const badge = document.getElementById("providerBadge");
    const taxNote = document.getElementById("providerTaxNote");
    const desc = document.getElementById("providerDesc");
    const placeholderUrl = document.getElementById("providerPlaceholderUrl");

    if (badge) badge.textContent = info.badge;
    if (taxNote) taxNote.textContent = info.taxNote;
    if (desc) desc.textContent = info.description;
    if (placeholderUrl) placeholderUrl.textContent = info.checkoutUrl;

    const deliveryCard = document.getElementById("confirmedDeliveryCard");
    if (deliveryCard) {
      deliveryCard.innerHTML = info.deliveryDetailsHtml;
    }
  }

  window.openCheckout = function(stateOverride) {
    if (window.PAYHIP_CHECKOUT_URL && window.PAYHIP_CHECKOUT_URL.startsWith("https://payhip.com/b/")) {
      window.location.href = window.PAYHIP_CHECKOUT_URL;
      return;
    }
    const modal = document.getElementById("checkoutModal");
    if (modal) {
      modal.classList.add("open");
      if (stateOverride === "success") {
        showCheckoutState("success");
      } else if (stateOverride === "cancel") {
        showCheckoutState("cancel");
      } else {
        showCheckoutState("form");
      }
    }
  };

  window.closeCheckout = function() {
    const modal = document.getElementById("checkoutModal");
    if (modal) modal.classList.remove("open");
  };

  function showCheckoutState(state) {
    const formCard = document.getElementById("checkoutStateForm");
    const successCard = document.getElementById("checkoutStateSuccess");
    const cancelCard = document.getElementById("checkoutStateCancel");

    if (formCard) formCard.classList.add("hidden");
    if (successCard) successCard.classList.add("hidden");
    if (cancelCard) cancelCard.classList.add("hidden");

    if (state === "success") {
      if (successCard) successCard.classList.remove("hidden");
      const orderRef = document.getElementById("confirmedOrderRef");
      if (orderRef) {
        orderRef.textContent = `#RP-${Math.floor(10000 + Math.random() * 90000)}`;
      }
    } else if (state === "cancel") {
      if (cancelCard) cancelCard.classList.remove("hidden");
    } else {
      if (formCard) formCard.classList.remove("hidden");
    }
  }

  window.simulateSuccess = function() {
    const payBtn = document.getElementById("submitPayBtn");
    if (payBtn) {
      payBtn.disabled = true;
      payBtn.innerHTML = `Processing with ${window.CHECKOUT_CONFIG[window.CHECKOUT_CONFIG.provider].name}...`;
    }
    setTimeout(() => {
      if (payBtn) {
        payBtn.disabled = false;
        payBtn.innerHTML = `⚡ Simulate Successful Purchase (€99)`;
      }
      showCheckoutState("success");
    }, 400);
  };

  window.simulateCancel = function() {
    showCheckoutState("cancel");
  };

  window.resetCheckoutForm = function() {
    showCheckoutState("form");
  };

  window.openExternalPlaceholder = function() {
    const info = window.CHECKOUT_CONFIG[window.CHECKOUT_CONFIG.provider];
    alert(`External Checkout Trigger (${info.name}):\nRedirect URL: ${info.checkoutUrl}\n\nNote: Awaiting live merchant credentials as specified in ${info.name.toUpperCase()}_RUNTIMEPILOT_INTEGRATION.md.`);
  };

  // Check URL parameters for deep-linking
  const checkoutParam = urlParams.get("checkout");
  updateCheckoutUI();
  if (checkoutParam === "success") {
    openCheckout("success");
  } else if (checkoutParam === "cancel") {
    openCheckout("cancel");
  }

  // =========================================================================
  // 11. INITIALIZATION CALLS
  // =========================================================================
  renderCourseDetail();
  renderFaqs();
  updateFsmUI();

  const initialHash = window.location.hash.replace("#", "") || "home";
  navigateTo(initialHash);

});
