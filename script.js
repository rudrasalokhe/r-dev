/**
 * Rudra Salokhe — Portfolio Script
 * Ultra-clean, performant interactions
 */

document.addEventListener("DOMContentLoaded", () => {
  initClipboard();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   Copy to Clipboard with Toast Notification
   -------------------------------------------------------------------------- */
function initClipboard() {
  const copyBtn = document.getElementById("copyBtn");
  const emailElem = document.getElementById("emailAddress");
  const toast = document.getElementById("toast");

  if (!copyBtn || !emailElem) return;

  copyBtn.addEventListener("click", () => {
    const textToCopy = emailElem.textContent.trim();

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        showToast("Copied to clipboard.");
        copyBtn.textContent = "COPIED";
        setTimeout(() => {
          copyBtn.textContent = "COPY";
        }, 2000);
      })
      .catch(() => {
        // Fallback
        const textarea = document.createElement("textarea");
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);

        showToast("Copied to clipboard.");
        copyBtn.textContent = "COPIED";
        setTimeout(() => {
          copyBtn.textContent = "COPY";
        }, 2000);
      });
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);
  }
}

/* --------------------------------------------------------------------------
   Smooth Scroll Spy & Header Active State
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetElem = document.querySelector(targetId);

      if (targetElem) {
        e.preventDefault();
        targetElem.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}
