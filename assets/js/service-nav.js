(function () {
  "use strict";

  const nav = document.querySelector("[data-service-nav]");
  if (!nav) return;

  const navWrap = document.querySelector("[data-service-nav-wrap]");
  const navContainer = navWrap?.closest(".service-nav-container");
  const slider = document.querySelector(".service-slider");
  const mobileQuery = window.matchMedia("(max-width: 1023px)");

  const links = Array.from(nav.querySelectorAll("a[href^=\"#\"]"));
  const targets = links
    .map((link) => {
      const id = link.getAttribute("href")?.slice(1);
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
    });
    updateIndicator();
  };

  links.forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.getAttribute("href")?.slice(1);
      if (id) setActive(id);
    });
    link.addEventListener("mouseenter", () => {
      moveIndicatorTo(link);
    });
  });

  nav.addEventListener("mouseleave", () => {
    updateIndicator();
  });

  if (!targets.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        .forEach((entry) => setActive(entry.target.id));
    },
    {
      rootMargin: "0px 0px -60% 0px",
      threshold: 0.1,
    },
  );

  targets.forEach((target) => observer.observe(target));

  function updateMobileDock() {
    if (!navWrap || !navContainer) return;
    if (!mobileQuery.matches || !navWrap.classList.contains("is-visible")) {
      navWrap.classList.remove("is-fixed");
      navContainer.style.removeProperty("height");
      navWrap.style.removeProperty("top");
      navWrap.style.removeProperty("left");
      navWrap.style.removeProperty("right");
      navWrap.style.removeProperty("width");
      return;
    }

    const headerHeight = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--header-height"),
    ) || 0;
    const offset = headerHeight + 8;
    const containerRect = navContainer.getBoundingClientRect();
    const shouldFix = containerRect.top <= offset;
    navWrap.classList.toggle("is-fixed", shouldFix);

    if (shouldFix) {
      navWrap.style.top = `${offset}px`;
      navWrap.style.left = `${containerRect.left}px`;
      navWrap.style.right = "auto";
      navWrap.style.width = `${containerRect.width}px`;
      navContainer.style.height = `${navWrap.getBoundingClientRect().height}px`;
    } else {
      navContainer.style.removeProperty("height");
      navWrap.style.removeProperty("top");
      navWrap.style.removeProperty("left");
      navWrap.style.removeProperty("right");
      navWrap.style.removeProperty("width");
    }
  }

  if (navWrap) {
    const updateNavVisibility = () => {
      if (!slider) {
        navWrap.classList.add("is-visible");
        updateIndicator();
        updateMobileDock();
        return;
      }
      const rect = slider.getBoundingClientRect();
      const shouldShow = rect.bottom <= 120;
      navWrap.classList.toggle("is-visible", shouldShow);
      if (shouldShow) updateIndicator();
      updateMobileDock();
    };

    updateNavVisibility();
    window.addEventListener("scroll", updateNavVisibility, { passive: true });
    window.addEventListener("resize", updateNavVisibility);
  }

  function moveIndicatorTo(link) {
    if (!link) return;
    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const height = 16;
    const top = linkRect.top - navRect.top + (linkRect.height - height) / 2;
    nav.style.setProperty("--indicator-top", `${Math.max(0, top)}px`);
    nav.style.setProperty("--indicator-height", `${height}px`);
  }

  function updateIndicator() {
    const active = nav.querySelector(".service-nav-link.is-active");
    if (!active) return;
    moveIndicatorTo(active);
  }

  window.addEventListener("resize", updateIndicator);
})();
