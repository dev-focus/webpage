(function () {
  "use strict";

  const nav = document.querySelector("[data-service-nav]");
  if (!nav) return;

  const navWrap = document.querySelector("[data-service-nav-wrap]");
  const slider = document.querySelector(".service-slider");

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

  if (navWrap) {
    const updateNavVisibility = () => {
      if (!slider) {
        navWrap.classList.add("is-visible");
        updateIndicator();
        return;
      }
      const rect = slider.getBoundingClientRect();
      const shouldShow = rect.bottom <= 120;
      navWrap.classList.toggle("is-visible", shouldShow);
      if (shouldShow) updateIndicator();
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
