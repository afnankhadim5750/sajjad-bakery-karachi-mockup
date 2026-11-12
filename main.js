/* Sajjad Bakery — mobile menu, bake-board tabs, lightbox, reveal, nav highlight */
(function () {
  "use strict";

  /* ---------- mobile menu (instant toggle: no transition on open/close) ---------- */
  var toggle = document.querySelector("[data-menu-toggle]");
  var nav = document.querySelector("[data-mobile-menu]");
  if (toggle && nav) {
    var closeMenu = function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    };
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---------- bake-board tabs ---------- */
  var tabBtns = Array.prototype.slice.call(document.querySelectorAll(".tab-btn"));
  var panels = {};
  tabBtns.forEach(function (btn) {
    panels[btn.dataset.tab] = document.getElementById("panel-" + btn.dataset.tab);
  });
  function activateTab(name, focusBtn) {
    tabBtns.forEach(function (btn) {
      var active = btn.dataset.tab === name;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", active ? "true" : "false");
      btn.tabIndex = active ? 0 : -1;
      var panel = panels[btn.dataset.tab];
      if (panel) panel.hidden = !active;
      if (active && focusBtn) btn.focus();
    });
  }
  tabBtns.forEach(function (btn, i) {
    btn.addEventListener("click", function () { activateTab(btn.dataset.tab, false); });
    btn.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") next = tabBtns[(i + 1) % tabBtns.length];
      if (e.key === "ArrowLeft") next = tabBtns[(i - 1 + tabBtns.length) % tabBtns.length];
      if (next) { e.preventDefault(); activateTab(next.dataset.tab, true); }
    });
  });
  /* Nav "Sweets" link opens the sweets tab */
  document.querySelectorAll("[data-goto-tab]").forEach(function (link) {
    link.addEventListener("click", function () {
      activateTab(link.dataset.gotoTab, false);
    });
  });

  /* ---------- lightbox gallery ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightbox-img");
  var current = 0;
  var lastFocus = null;
  function showPhoto(i) {
    current = (i + items.length) % items.length;
    lbImg.src = items[current].dataset.full;
    lbImg.alt = items[current].dataset.alt || "";
  }
  function openLightbox(i) {
    lastFocus = document.activeElement;
    showPhoto(i);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightbox.querySelector(".lightbox-close").focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  items.forEach(function (item, i) {
    item.addEventListener("click", function () { openLightbox(i); });
  });
  lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", function () { showPhoto(current - 1); });
  lightbox.querySelector(".lightbox-next").addEventListener("click", function () { showPhoto(current + 1); });
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPhoto(current - 1);
    if (e.key === "ArrowRight") showPhoto(current + 1);
  });

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(
    ".bake-card, .feature-photo, .feature-copy, .why-grid article, .gallery-item, .counter-photo, .hours-card"
  );
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) {
      el.classList.add("reveal");
      io.observe(el);
    });
  }

  /* ---------- current-section nav highlight ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav a[href^='#']"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          var on = a.getAttribute("href") === "#" + entry.target.id;
          a.style.borderBottomColor = on ? "var(--gold)" : "";
          a.style.color = on ? "var(--gold-deep)" : "";
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }
})();
