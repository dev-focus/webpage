(function () {
  "use strict";

  const nav = document.querySelector("[data-service-nav]");
  if (!nav) return;

  const navWrap = document.querySelector("[data-service-nav-wrap]");
  const navContainer = navWrap?.closest(".service-nav-container");
  const slider = document.querySelector(".service-slider");
  const header = document.querySelector(".header");
  const navToggle = document.querySelector("#nav-toggle");
  const mobileQuery = window.matchMedia("(max-width: 1023px)");
  const IDLE_HIDE_DELAY_MS = 1100;

  const links = Array.from(nav.querySelectorAll("a[href^=\"#\"]"));
  const targets = links
    .map((link) => {
      const id = link.getAttribute("href")?.slice(1);
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  const targetIds = new Set(targets.map((target) => target.id));
  let currentActiveId = "";
  let idleHideTimer = null;
  let suppressScrollspyUntil = 0;

  links.forEach((link) => {
    link.addEventListener("click", () => {
      const id = link.getAttribute("href")?.slice(1);
      if (!id) return;
      setActive(id);
      revealNavDuringScroll();
      scheduleStateUpdate();
    });

    link.addEventListener("mouseenter", () => {
      moveIndicatorTo(link);
    });
  });

  nav.addEventListener("mouseleave", () => {
    updateIndicator();
  });

  let scheduled = false;

  function getHeaderOffset() {
    if (!header) return 8;
    return Math.ceil(header.getBoundingClientRect().height) + 8;
  }

  function setActive(id) {
    if (!id || !targetIds.has(id)) return;
    if (id === currentActiveId) {
      updateIndicator();
      return;
    }
    currentActiveId = id;

    links.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", isActive);
    });

    if (mobileQuery.matches) {
      const activeLink = nav.querySelector(`.service-nav-link[href="#${id}"]`);
      activeLink?.scrollIntoView({ block: "nearest", inline: "center" });
    }

    updateIndicator();
  }

  function setActiveFromHash() {
    const hashId = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!hashId || !targetIds.has(hashId)) return;
    setActive(hashId);
    suppressScrollspyUntil = Date.now() + 900;
  }

  function releaseMobileDock() {
    if (!navWrap || !navContainer) return;
    navWrap.classList.remove("is-fixed");
    navWrap.classList.remove("is-idle-hidden");
    navContainer.style.removeProperty("height");
    navWrap.style.removeProperty("top");
    navWrap.style.removeProperty("left");
    navWrap.style.removeProperty("right");
    navWrap.style.removeProperty("width");
    clearIdleHideTimer();
  }

  function updateNavState() {
    if (!navWrap) return;

    const headerOffset = getHeaderOffset();
    const showThreshold = headerOffset + 24;
    const shouldShow = slider ? slider.getBoundingClientRect().bottom <= showThreshold : true;

    navWrap.classList.toggle("is-visible", shouldShow);
    if (shouldShow && targets.length && Date.now() >= suppressScrollspyUntil) {
      setActive(getActiveIdFromScroll(headerOffset));
    }

    if (!shouldShow || !mobileQuery.matches || !navContainer) {
      releaseMobileDock();
      if (shouldShow) updateIndicator();
      return;
    }

    const containerRect = navContainer.getBoundingClientRect();
    const shouldFix = containerRect.top <= headerOffset;
    navWrap.classList.toggle("is-fixed", shouldFix);

    if (!shouldFix) {
      navWrap.classList.remove("is-idle-hidden");
      navContainer.style.removeProperty("height");
      navWrap.style.removeProperty("top");
      navWrap.style.removeProperty("left");
      navWrap.style.removeProperty("right");
      navWrap.style.removeProperty("width");
      clearIdleHideTimer();
      updateIndicator();
      return;
    }

    navWrap.style.top = `${headerOffset}px`;
    navWrap.style.left = `${containerRect.left}px`;
    navWrap.style.right = "auto";
    navWrap.style.width = `${containerRect.width}px`;
    navContainer.style.height = `${navWrap.getBoundingClientRect().height}px`;
    scheduleIdleHide();
    updateIndicator();
  }

  function getActiveIdFromScroll(headerOffset) {
    if (!targets.length) return "";

    const nearBottom =
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - 8;
    if (nearBottom) {
      return targets[targets.length - 1].id;
    }

    const navHeight = navWrap.classList.contains("is-fixed")
      ? Math.ceil(navWrap.getBoundingClientRect().height)
      : 0;
    const stickyProbe = headerOffset + navHeight + 20;
    const viewportProbe = Math.round(
      window.innerHeight * (mobileQuery.matches ? 0.34 : 0.28),
    );
    const probeY = Math.max(stickyProbe, viewportProbe);

    let activeId = targets[0].id;
    for (const target of targets) {
      if (target.getBoundingClientRect().top <= probeY) {
        activeId = target.id;
      } else {
        break;
      }
    }

    return activeId;
  }

  function scheduleStateUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      updateNavState();
    });
  }

  function clearIdleHideTimer() {
    if (idleHideTimer === null) return;
    clearTimeout(idleHideTimer);
    idleHideTimer = null;
  }

  function canHideForIdle() {
    if (!navWrap) return false;
    return (
      mobileQuery.matches &&
      navWrap.classList.contains("is-visible") &&
      navWrap.classList.contains("is-fixed")
    );
  }

  function scheduleIdleHide() {
    if (!navWrap) return;
    clearIdleHideTimer();
    if (!canHideForIdle()) {
      navWrap.classList.remove("is-idle-hidden");
      return;
    }
    idleHideTimer = window.setTimeout(() => {
      idleHideTimer = null;
      if (canHideForIdle()) {
        navWrap.classList.add("is-idle-hidden");
      }
    }, IDLE_HIDE_DELAY_MS);
  }

  function revealNavDuringScroll() {
    if (!navWrap) return;
    navWrap.classList.remove("is-idle-hidden");
    scheduleIdleHide();
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

  setActiveFromHash();
  scheduleStateUpdate();
  requestAnimationFrame(scheduleStateUpdate);

  window.addEventListener(
    "scroll",
    () => {
      revealNavDuringScroll();
      scheduleStateUpdate();
    },
    { passive: true },
  );
  window.addEventListener("resize", scheduleStateUpdate);
  window.addEventListener("resize", updateIndicator);
  window.addEventListener("load", scheduleStateUpdate);
  window.addEventListener("pageshow", scheduleStateUpdate);
  window.addEventListener("hashchange", () => {
    setActiveFromHash();
    scheduleStateUpdate();
  });

  if (navToggle) {
    navToggle.addEventListener("change", scheduleStateUpdate);
  }
})();
