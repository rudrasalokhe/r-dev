document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const EMAIL = "rudrasalokhe100@gmail.com";
  const loader = document.querySelector(".intro-loader");
  document.body.classList.add("is-loading");

  /* ---------- boot sequence ---------- */
  const bootLog = document.getElementById("bootLog");
  const lines = [
    "[boot] rudra.os v2.6",
    "[ ok ] mounting /projects",
    "[ ok ] fastapi · websockets · postgres",
    "[ ok ] telemetry link 19.07N 72.87E",
    "[ ok ] coffee level: critical",
    "[ .. ] handing over control"
  ];
  const finishLoading = () => {
    loader?.classList.add("is-done");
    document.body.classList.remove("is-loading");
    runScramble();
    runCounters();
  };
  if (reduceMotion) {
    finishLoading();
  } else {
    let i = 0;
    const tick = () => {
      if (i >= lines.length) return;
      const l = lines[i++];
      bootLog.innerHTML += (l.startsWith("[ ok ]") ? l.replace("[ ok ]", '<span class="ok">[ ok ]</span>') : l) + "\n";
      setTimeout(tick, 200);
    };
    tick();
    setTimeout(finishLoading, 1700);
  }

  /* ---------- scramble text ---------- */
  const chars = "!<>-_\\/[]{}=+*^?#01";
  function scramble(el, finalText, duration = 700) {
    const start = performance.now();
    const frame = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = finalText.split("").map((c, i) =>
        i < p * finalText.length ? c : chars[Math.floor(Math.random() * chars.length)]
      ).join("");
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = finalText;
    };
    requestAnimationFrame(frame);
  }
  function runScramble() {
    if (reduceMotion) return;
    document.querySelectorAll("[data-scramble]").forEach((el, i) => {
      setTimeout(() => scramble(el, el.dataset.scramble), i * 140);
    });
  }
  document.querySelectorAll("[data-scramble]").forEach((el) => {
    el.addEventListener("mouseenter", () => !reduceMotion && scramble(el, el.dataset.scramble, 450));
  });

  /* ---------- counters ---------- */
  function runCounters() {
    document.querySelectorAll("[data-count]").forEach((el) => {
      const target = +el.dataset.count;
      if (reduceMotion) { el.textContent = target; return; }
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / 1200, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  /* ---------- reveals ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((n) => n.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: .1, rootMargin: "0px 0px -5% 0px" });
    reveals.forEach((n) => observer.observe(n));
  }

  /* ---------- smooth anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  /* ---------- scroll progress + hero parallax ---------- */
  const progress = document.querySelector(".scroll-progress");
  let scrollFrame = 0;
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    if (!reduceMotion) {
      document.querySelectorAll(".hero-word").forEach((w, i) => {
        const shift = Math.min(scrollY, innerHeight) * (i + 1) * .018;
        w.style.translate = `${i % 2 ? shift : -shift}px 0`;
      });
    }
    scrollFrame = 0;
  };
  addEventListener("scroll", () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }, { passive: true });
  updateScroll();

  /* ---------- live IST clock ---------- */
  const clock = document.getElementById("clock");
  const tickClock = () => {
    if (!clock) return;
    clock.textContent = new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata" }) + " IST";
  };
  tickClock();
  setInterval(tickClock, 1000);

  /* ---------- copy email ---------- */
  const copyButton = document.querySelector("[data-copy]");
  const toast = document.querySelector(".toast");
  async function copyEmail() {
    try { await navigator.clipboard.writeText(EMAIL); }
    catch {
      const f = document.createElement("textarea");
      f.value = EMAIL; f.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(f); f.select(); document.execCommand("copy"); f.remove();
    }
    if (copyButton) copyButton.textContent = "COPIED ✓";
    toast?.classList.add("show");
    setTimeout(() => {
      if (copyButton) copyButton.textContent = "COPY EMAIL";
      toast?.classList.remove("show");
    }, 2000);
  }
  copyButton?.addEventListener("click", copyEmail);

  /* ---------- cursor, magnetic, card spotlight ---------- */
  document.querySelectorAll(".spot").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });

  if (matchMedia("(pointer: fine)").matches && !reduceMotion) {
    const cursor = document.querySelector(".cursor");
    addEventListener("pointermove", (e) => {
      cursor?.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 220, fill: "forwards" });
    }, { passive: true });
    document.querySelectorAll("a, button, .skill, .project-card").forEach((el) => {
      el.addEventListener("pointerenter", () => cursor?.classList.add("active"));
      el.addEventListener("pointerleave", () => cursor?.classList.remove("active"));
    });
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .15}px, ${(e.clientY - r.top - r.height / 2) * .15}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ---------- hero network canvas ---------- */
  const canvas = document.getElementById("net");
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, nodes = [], mouse = { x: -999, y: -999 };
    const pulses = [];
    const resize = () => {
      const dpr = devicePixelRatio || 1;
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.floor(w * h / 14000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35
      }));
    };
    resize();
    addEventListener("resize", resize);
    const hero = canvas.parentElement;
    hero.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    hero.addEventListener("pointerleave", () => { mouse.x = mouse.y = -999; });
    hero.addEventListener("click", (e) => {
      const r = canvas.getBoundingClientRect();
      pulses.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 0 });
    });
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        const dx = n.x - mouse.x, dy = n.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 120 && d > 1) { n.x += dx / d * 1.2; n.y += dy / d * 1.2; }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(5,5,5,${(1 - d / 130) * .22})`;
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
          }
        }
        const md = Math.hypot(nodes[i].x - mouse.x, nodes[i].y - mouse.y);
        if (md < 160) {
          ctx.strokeStyle = `rgba(5,5,5,${(1 - md / 160) * .6})`;
          ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = "#050505";
        ctx.fillRect(nodes[i].x - 1.5, nodes[i].y - 1.5, 3, 3);
      }
      for (let p = pulses.length - 1; p >= 0; p--) {
        const s = pulses[p]; s.r += 6;
        ctx.strokeStyle = `rgba(5,5,5,${Math.max(0, 1 - s.r / 500)})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.stroke();
        if (s.r > 500) pulses.splice(p, 1);
      }
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- command palette (Ctrl/Cmd + K) ---------- */
  const palette = document.getElementById("palette");
  const input = document.getElementById("paletteInput");
  const list = document.getElementById("paletteList");
  const go = (id) => document.querySelector(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  const open = (url) => window.open(url, "_blank", "noopener");
  const commands = [
    { name: "goto work", hint: "#projects", run: () => go("#projects") },
    { name: "goto about", hint: "#about", run: () => go("#about") },
    { name: "goto stack", hint: "#stack", run: () => go("#stack") },
    { name: "goto education", hint: "#education", run: () => go("#education") },
    { name: "goto contact", hint: "#contact", run: () => go("#contact") },
    { name: "copy email", hint: "clipboard", run: copyEmail },
    { name: "open github", hint: "↗", run: () => open("https://github.com/rudrasalokhe") },
    { name: "open linkedin", hint: "↗", run: () => open("https://www.linkedin.com/in/rudra-salokhe-12196b250/") },
    { name: "open x / twitter", hint: "↗", run: () => open("https://x.com/rs2006_05") },
    { name: "visit dealsinbox.in", hint: "live", run: () => open("https://dealsinbox.in/") },
    { name: "visit payslot.in", hint: "live", run: () => open("https://payslot.in/") },
    { name: "invert colors", hint: "theme", run: () => document.documentElement.classList.toggle("inverted") }
  ];
  let filtered = commands, sel = 0;
  const render = () => {
    list.innerHTML = filtered.map((c, i) =>
      `<li class="${i === sel ? "sel" : ""}" data-i="${i}">${c.name}<small>${c.hint}</small></li>`).join("");
  };
  const openPalette = () => {
    palette.classList.add("open");
    input.value = ""; filtered = commands; sel = 0; render(); input.focus();
  };
  const closePalette = () => palette.classList.remove("open");
  const runSel = () => { const c = filtered[sel]; if (!c) return; closePalette(); c.run(); };
  document.getElementById("openPalette")?.addEventListener("click", openPalette);
  palette.addEventListener("click", (e) => { if (e.target === palette) closePalette(); });
  list.addEventListener("click", (e) => {
    const li = e.target.closest("li"); if (!li) return;
    sel = +li.dataset.i; runSel();
  });
  input.addEventListener("input", () => {
    const q = input.value.toLowerCase();
    filtered = commands.filter((c) => c.name.includes(q)); sel = 0; render();
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { sel = Math.min(sel + 1, filtered.length - 1); render(); e.preventDefault(); }
    else if (e.key === "ArrowUp") { sel = Math.max(sel - 1, 0); render(); e.preventDefault(); }
    else if (e.key === "Enter") runSel();
  });
  addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      palette.classList.contains("open") ? closePalette() : openPalette();
    } else if (e.key === "Escape") closePalette();
  });
});
