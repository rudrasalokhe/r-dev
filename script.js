/** Rudra Salokhe — interactive systems portfolio */

document.addEventListener("DOMContentLoaded", () => {
  initClipboard();
  initSmoothScroll();
  initInterface();
  initReveal();
  initPointer();
  initProjectTilt();
  initSignalField();
});

function initClipboard() {
  const copyBtn = document.getElementById("copyBtn");
  const emailElem = document.getElementById("emailAddress");
  const toast = document.getElementById("toast");
  if (!copyBtn || !emailElem) return;
  copyBtn.addEventListener("click", async () => {
    const value = emailElem.textContent.trim();
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const field = document.createElement("textarea");
      field.value = value;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    if (toast) {
      toast.textContent = "Copied to clipboard.";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2400);
    }
    copyBtn.textContent = "COPIED";
    setTimeout(() => { copyBtn.textContent = "COPY"; }, 2000);
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function initInterface() {
  document.body.insertAdjacentHTML("afterbegin", `
    <div class="boot-screen" aria-hidden="true">
      <div class="boot-mark">RS<span>/</span>SYS</div>
      <div class="boot-track"><i></i></div>
      <div class="boot-copy">INITIALIZING PORTFOLIO CORE</div>
    </div>
    <div class="ambient-grid" aria-hidden="true"></div>
    <canvas id="signalField" aria-hidden="true"></canvas>
    <div class="scroll-progress" aria-hidden="true"></div>
    <div class="cursor-dot" aria-hidden="true"></div>
    <div class="cursor-ring" aria-hidden="true"></div>`);

  document.querySelector(".nav-container")?.insertAdjacentHTML(
    "beforeend", `<div class="nav-status"><i></i><span>SYSTEM ONLINE</span></div>`
  );
  document.querySelector(".hero-section .container")?.insertAdjacentHTML(
    "afterbegin", `<div class="hero-index" aria-hidden="true">00<span>/04</span></div>`
  );
  document.querySelectorAll(".section-heading").forEach((heading) => {
    heading.setAttribute("data-text", heading.textContent.trim());
  });

  const progress = document.querySelector(".scroll-progress");
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const ratio = max > 0 ? scrollY / max : 0;
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    let current = "hero";
    sections.forEach((section) => {
      if (scrollY >= section.offsetTop - innerHeight * 0.42) current = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`);
    });
  };
  updateScroll();
  addEventListener("scroll", updateScroll, { passive: true });
  setTimeout(() => document.body.classList.add("is-loaded"), 250);
}

function initReveal() {
  const targets = document.querySelectorAll(
    ".section-top-bar, .section-heading, .project-block, .table-data-row, .experience-card, .identity-card, .bottom-status-bar"
  );
  targets.forEach((node) => node.classList.add("reveal-node"));
  if (!("IntersectionObserver" in window)) {
    targets.forEach((node) => node.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  targets.forEach((node) => observer.observe(node));
}

function initPointer() {
  if (!matchMedia("(pointer: fine)").matches) return;
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (!dot || !ring) return;
  let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
  addEventListener("mousemove", (event) => {
    x = event.clientX; y = event.clientY;
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
  const follow = () => {
    rx += (x - rx) * 0.16; ry += (y - ry) * 0.16;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(follow);
  };
  follow();
  document.querySelectorAll("a, button, .project-block, .experience-card").forEach((item) => {
    item.addEventListener("mouseenter", () => document.body.classList.add("cursor-active"));
    item.addEventListener("mouseleave", () => document.body.classList.remove("cursor-active"));
  });
}

function initProjectTilt() {
  if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(".terminal-card, .experience-card, .identity-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--rx", `${(-py * 5).toFixed(2)}deg`);
      card.style.setProperty("--ry", `${(px * 6).toFixed(2)}deg`);
      card.style.setProperty("--mx", `${((px + 0.5) * 100).toFixed(1)}%`);
      card.style.setProperty("--my", `${((py + 0.5) * 100).toFixed(1)}%`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}

function initSignalField() {
  const canvas = document.getElementById("signalField");
  if (!canvas || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  let width, height, nodes = [], pointer = { x: -1000, y: -1000 };
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    width = innerWidth; height = innerHeight;
    canvas.width = width * dpr; canvas.height = height * dpr;
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(55, Math.floor(width / 24));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18
    }));
  };
  addEventListener("resize", resize, { passive: true });
  addEventListener("pointermove", (event) => {
    pointer.x = event.clientX; pointer.y = event.clientY;
  }, { passive: true });
  resize();
  const draw = () => {
    ctx.clearRect(0, 0, width, height);
    nodes.forEach((node, index) => {
      node.x += node.vx; node.y += node.vy;
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;
      const pointerDistance = Math.hypot(node.x - pointer.x, node.y - pointer.y);
      if (pointerDistance < 170) {
        ctx.beginPath(); ctx.moveTo(node.x, node.y); ctx.lineTo(pointer.x, pointer.y);
        ctx.strokeStyle = `rgba(183,255,32,${(1 - pointerDistance / 170) * .18})`; ctx.stroke();
      }
      nodes.slice(index + 1).forEach((other) => {
        const distance = Math.hypot(node.x - other.x, node.y - other.y);
        if (distance < 125) {
          ctx.beginPath(); ctx.moveTo(node.x, node.y); ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(125,249,255,${(1 - distance / 125) * .07})`; ctx.stroke();
        }
      });
      ctx.fillStyle = "rgba(183,255,32,.24)";
      ctx.fillRect(node.x, node.y, 1, 1);
    });
    requestAnimationFrame(draw);
  };
  draw();
}
