document.addEventListener("DOMContentLoaded", () => {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const loader = document.querySelector(".intro-loader");
  document.body.classList.add("is-loading");

  const finishLoading = () => {
    loader?.classList.add("is-done");
    document.body.classList.remove("is-loading");
  };
  reduceMotion ? finishLoading() : setTimeout(finishLoading, 1050);

  const reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((node) => node.classList.add("visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: .1, rootMargin: "0px 0px -5% 0px" });
    reveals.forEach((node) => observer.observe(node));
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  const progress = document.querySelector(".scroll-progress");
  let scrollFrame = 0;
  const updateScroll = () => {
    const maximum = document.documentElement.scrollHeight - innerHeight;
    const ratio = maximum > 0 ? scrollY / maximum : 0;
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    if (!reduceMotion) {
      document.querySelectorAll(".hero-word").forEach((word, index) => {
        const shift = Math.min(scrollY, innerHeight) * (index + 1) * .018;
        word.style.translate = `${index % 2 ? shift : -shift}px 0`;
      });
    }
    scrollFrame = 0;
  };
  addEventListener("scroll", () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  }, { passive: true });
  updateScroll();

  const copyButton = document.querySelector("[data-copy]");
  const toast = document.querySelector(".toast");
  copyButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(copyButton.dataset.copy);
    } catch {
      const field = document.createElement("textarea");
      field.value = copyButton.dataset.copy;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    copyButton.textContent = "COPIED ✓";
    toast?.classList.add("show");
    setTimeout(() => {
      copyButton.textContent = "COPY EMAIL";
      toast?.classList.remove("show");
    }, 2000);
  });

  if (matchMedia("(pointer: fine)").matches && !reduceMotion) {
    const cursor = document.querySelector(".cursor");
    addEventListener("pointermove", (event) => {
      cursor?.animate(
        { left: `${event.clientX}px`, top: `${event.clientY}px` },
        { duration: 220, fill: "forwards" }
      );
    }, { passive: true });

    document.querySelectorAll("a, button, .skill, .project-card").forEach((element) => {
      element.addEventListener("pointerenter", () => cursor?.classList.add("active"));
      element.addEventListener("pointerleave", () => cursor?.classList.remove("active"));
    });

    document.querySelectorAll(".magnetic").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * .12;
        const y = (event.clientY - rect.top - rect.height / 2) * .12;
        element.style.transform = `translate(${x}px, ${y}px)`;
      });
      element.addEventListener("pointerleave", () => { element.style.transform = ""; });
    });
  }
});
