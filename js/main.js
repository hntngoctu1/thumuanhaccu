/* ============================================================
   Doremi 2000 — Interactions & motion
   Progressive enhancement: core UX works without GSAP.
   ============================================================ */
(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, ctx) => (ctx || document).querySelector(s);
  const $$ = (s, ctx) => Array.from((ctx || document).querySelectorAll(s));

  /* ---------- Current year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Theme toggle (shared key with admin) ---------- */
  const THEME_KEY = "doremi-theme";
  const metaTheme = $('meta[name="theme-color"]');
  const applyTheme = (t) => {
    document.documentElement.setAttribute("data-theme", t);
    if (metaTheme) metaTheme.setAttribute("content", t === "light" ? "#f4eee1" : "#0a0a0c");
  };
  applyTheme(document.documentElement.getAttribute("data-theme") || "dark");
  const toggleTheme = () => {
    const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  };
  ["#themeToggle", "#themeToggleMobile"].forEach((sel) => {
    const el = $(sel);
    if (el) el.addEventListener("click", toggleTheme);
  });

  /* ---------- Hero slider ---------- */
  (function heroSlider() {
    const root = $("#heroSlider");
    if (!root) return;
    const heroSection = $("#hero");
    const slides = $$(".hero-slide", root);
    const dots = $$(".hero-dot", $("#heroDots"));
    const prevBtn = $("#heroPrev"), nextBtn = $("#heroNext");
    if (slides.length < 2) return;
    let idx = 0, timer = null;
    const DELAY = 6000;
    const render = () => {
      slides.forEach((s, i) => {
        const active = i === idx;
        s.classList.toggle("is-active", active);
        s.setAttribute("aria-hidden", String(!active));
        s.inert = !active;
      });
      dots.forEach((d, i) => {
        const active = i === idx;
        d.classList.toggle("is-active", active);
        if (active) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
      });
    };
    const setSlide = (n) => { idx = (n + slides.length) % slides.length; render(); };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };
    const start = () => { if (prefersReduced || timer) return; timer = setInterval(() => setSlide(idx + 1), DELAY); };
    const go = (n) => { setSlide(n); stop(); start(); };
    dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
    if (nextBtn) nextBtn.addEventListener("click", () => go(idx + 1));
    if (prevBtn) prevBtn.addEventListener("click", () => go(idx - 1));
    let paused = false;
    const pause = () => { paused = true; stop(); };
    const resume = () => { paused = false; start(); };
    root.addEventListener("mouseenter", pause);
    root.addEventListener("mouseleave", resume);
    root.addEventListener("focusin", pause);
    root.addEventListener("focusout", resume);
    if (heroSection) heroSection.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(idx - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); go(idx + 1); }
    });
    let sx = null;
    root.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    root.addEventListener("touchend", (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) go(idx + (dx < 0 ? 1 : -1));
      sx = null;
    }, { passive: true });
    document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); else if (!paused) start(); });
    render();
    start();
  })();

  /* ---------- Hide decorative icon SVGs from assistive tech ---------- */
  $$("svg").forEach((svg) => {
    if (svg.querySelector("use")) {
      svg.setAttribute("aria-hidden", "true");
      svg.setAttribute("focusable", "false");
    }
  });

  /* ---------- Header scroll state ---------- */
  const header = $("#header");
  const toTop = $("#toTop");
  const scrollProgress = $("#scrollProgress");
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 24);
    if (toTop) toTop.classList.toggle("is-visible", y > 600);
    if (scrollProgress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    }
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  if (toTop) toTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" })
  );

  /* ---------- Mobile menu (with focus trap + inert background) ---------- */
  const toggle = $("#navToggle");
  const menu = $("#mobileMenu");
  const bgRegions = ["#header", "main", ".site-footer", ".dock", ".to-top", ".mobile-cta"]
    .map((s) => $(s))
    .filter(Boolean);
  let lastFocused = null;
  const menuFocusables = () => $$("a, button", menu).filter((el) => !el.disabled);
  const setInert = (on) => bgRegions.forEach((el) => { el.inert = on; });

  const setMenu = (open) => {
    if (!menu || !toggle) return;
    menu.classList.toggle("is-open", open);
    toggle.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Đóng menu" : "Mở menu");
    document.body.classList.toggle("no-scroll", open);
    if (scrollProgress) scrollProgress.style.opacity = open ? "0" : "";
    setInert(open);
    if (open) {
      lastFocused = document.activeElement;
      const f = menuFocusables();
      if (f[0]) f[0].focus();
    } else if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  };
  if (toggle) toggle.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  $$("#mobileMenu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => {
    if (!menu || !menu.classList.contains("is-open")) return;
    if (e.key === "Escape") { setMenu(false); return; }
    if (e.key === "Tab") {
      const f = menuFocusables();
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); obs.unobserve(en.target); }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Animated counters ---------- */
  const counters = $$("[data-count]");
  const formatNum = (n) => n.toLocaleString("vi-VN");
  const runCounter = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || "";
    if (prefersReduced) { el.textContent = formatNum(target) + suffix; return; }
    const dur = 1600;
    let start = null;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (ts) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      el.textContent = formatNum(Math.round(target * ease(p))) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries, obs) => entries.forEach((en) => {
        if (en.isIntersecting) { runCounter(en.target); obs.unobserve(en.target); }
      }),
      { threshold: 0.6 }
    );
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- Active nav link ---------- */
  const navLinks = $$(".nav__link");
  const linkFor = (id) => navLinks.find((l) => l.getAttribute("href") === "#" + id);
  const sections = ["services", "gallery", "process", "pricing", "why", "testimonials", "faq"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    const sio = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        const link = linkFor(en.target.id);
        if (link && en.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => sio.observe(s));
  }

  /* ---------- FAQ accordion ---------- */
  const accItems = $$("#faqAcc .acc-item");
  accItems.forEach((item, i) => {
    const trigger = $(".acc-trigger", item);
    const panel = $(".acc-panel", item);
    if (!trigger || !panel) return;
    const pid = "faq-panel-" + i;
    panel.id = pid;
    trigger.setAttribute("aria-controls", pid);
    panel.setAttribute("aria-hidden", "true"); // collapsed: remove from AT tree
    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      accItems.forEach((other) => {
        other.classList.remove("is-open");
        $(".acc-trigger", other).setAttribute("aria-expanded", "false");
        const op = $(".acc-panel", other);
        op.style.maxHeight = null;
        op.setAttribute("aria-hidden", "true");
      });
      if (!isOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        panel.removeAttribute("aria-hidden");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });

  /* ---------- Recompute open accordion height on resize ---------- */
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const openPanel = $("#faqAcc .acc-item.is-open .acc-panel");
      if (openPanel) openPanel.style.maxHeight = openPanel.scrollHeight + "px";
    }, 150);
  }, { passive: true });

  /* ---------- Quote form (no backend — honest hand-off to call/Zalo) ---------- */
  const form = $("#quoteForm");
  if (form) {
    const success = $("#quoteSuccess");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const type = $("#qType").value;
      const cond = $("#qCond").value;
      const phone = $("#qPhone").value.trim();
      // Save lead to a local (front-end) store so the admin page can display it.
      // NOTE: localStorage is per-browser — for real lead capture, wire to a backend/Formspree.
      try {
        const LEADS_KEY = "doremi-leads";
        const leads = JSON.parse(localStorage.getItem(LEADS_KEY) || "[]");
        leads.unshift({
          id: "L" + Date.now(),
          phone: phone, type: type, condition: cond,
          status: "Mới", value: 0, source: "Website", createdAt: Date.now(),
        });
        localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
      } catch (e) { /* storage unavailable — ignore */ }
      if (success) {
        var _lang = document.documentElement.lang === "en" ? "en" : "vi";
        success.querySelector("span").textContent = _lang === "en"
          ? `Thanks! Your quote request for “${type}” (${cond}) is ready. Tap Call 0938 818 871 or message us on Zalo below — you'll get a quote right away.`
          : `Cảm ơn bạn! Yêu cầu báo giá “${type}” (${cond}) đã sẵn sàng. Vui lòng bấm Gọi 0938 818 871 hoặc nhắn Zalo bên dưới để gửi cho chúng tôi — bạn sẽ nhận báo giá ngay.`;
        success.classList.add("is-visible");
        success.scrollIntoView({ block: "nearest", behavior: prefersReduced ? "auto" : "smooth" });
      }
    });
  }

  /* ---------- Optional GSAP hero parallax (enhancement only) ---------- */
  window.addEventListener("load", () => {
    if (prefersReduced || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const rings = $(".hero__rings");
    const eq = $(".equalizer");
    const st = { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 };
    if (rings) gsap.to(rings, { yPercent: 18, ease: "none", scrollTrigger: st });
    if (eq) gsap.to(eq, { yPercent: -10, ease: "none", scrollTrigger: st });
  });
})();
