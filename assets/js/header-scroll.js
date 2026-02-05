(function () {
  "use strict";

  const header = document.querySelector(".header");
  if (!header) return;

  const setHeaderHeight = () => {
    const height = Math.ceil(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty(
      "--header-height",
      `${height}px`,
    );
  };

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  onScroll();
  setHeaderHeight();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", setHeaderHeight);

  const navToggle = document.querySelector("#nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("change", setHeaderHeight);
  }
})();
