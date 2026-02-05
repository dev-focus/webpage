(function () {
  "use strict";

  const sliders = document.querySelectorAll(".client-logo-slider");
  if (!sliders.length || typeof Swiper === "undefined") return;

  const breakpoints = {
    480: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 24 },
    768: { slidesPerView: 3, slidesPerGroup: 3 },
    1024: { slidesPerView: 4, slidesPerGroup: 4 },
    1280: { slidesPerView: 5, slidesPerGroup: 5 },
  };

  const defaultView = { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 16 };

  const getCurrentView = (width) => {
    let view = { ...defaultView };
    if (width >= 480) view = { ...view, ...breakpoints[480] };
    if (width >= 768) view = { ...view, ...breakpoints[768] };
    if (width >= 1024) view = { ...view, ...breakpoints[1024] };
    if (width >= 1280) view = { ...view, ...breakpoints[1280] };
    return view;
  };

  sliders.forEach((slider) => {
    const nextEl = slider.querySelector(".client-logo-next");
    const prevEl = slider.querySelector(".client-logo-prev");
    const slides = slider.querySelectorAll(".swiper-slide").length;

    const shouldLoop = () => {
      if (!slides) return false;
      return slides > getCurrentView(window.innerWidth).slidesPerView;
    };

    const buildSlider = () => {
      const loop = shouldLoop();
      return new Swiper(slider, {
        spaceBetween: defaultView.spaceBetween,
        loop,
        watchOverflow: true,
        slidesPerView: defaultView.slidesPerView,
        slidesPerGroup: defaultView.slidesPerGroup,
        speed: 700,
        allowTouchMove: true,
        autoplay:
          slides > 1
            ? {
                delay: 2800,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false,
        navigation: {
          nextEl,
          prevEl,
        },
        breakpoints,
      });
    };

    let loopState = shouldLoop();
    let swiper = buildSlider();

    window.addEventListener("resize", () => {
      const nextLoopState = shouldLoop();
      if (nextLoopState === loopState) return;
      loopState = nextLoopState;
      swiper.destroy(true, true);
      swiper = buildSlider();
    });
  });
})();
