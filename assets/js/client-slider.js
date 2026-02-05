(function () {
  "use strict";

  const sliders = document.querySelectorAll(".client-logo-slider");
  if (!sliders.length || typeof Swiper === "undefined") return;

  sliders.forEach((slider) => {
    const nextEl = slider.querySelector(".client-logo-next");
    const prevEl = slider.querySelector(".client-logo-prev");

    new Swiper(slider, {
      spaceBetween: 16,
      loop: true,
      watchOverflow: true,
      slidesPerView: 2,
      slidesPerGroup: 2,
      speed: 700,
      navigation: {
        nextEl,
        prevEl,
      },
      breakpoints: {
        480: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 24 },
        768: { slidesPerView: 3, slidesPerGroup: 3 },
        1024: { slidesPerView: 4, slidesPerGroup: 4 },
        1280: { slidesPerView: 5, slidesPerGroup: 5 },
      },
    });
  });
})();
