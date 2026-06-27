export function configureSwiperNavigation(swiper, prevRef, nextRef) {
  if (!swiper?.params) return;

  swiper.params.navigation = {
    ...(swiper.params.navigation ?? {}),
    prevEl: prevRef.current,
    nextEl: nextRef.current,
  };
}

export function bindSliderNavigation(swiper, prevRef, nextRef) {
  if (!swiper?.params) return;

  configureSwiperNavigation(swiper, prevRef, nextRef);

  window.setTimeout(() => {
    if (!swiper?.params?.navigation || !swiper.navigation) return;

    swiper.params.navigation.prevEl = prevRef.current;
    swiper.params.navigation.nextEl = nextRef.current;

    if (typeof swiper.navigation.destroy === "function") {
      swiper.navigation.destroy();
    }

    if (typeof swiper.navigation.init === "function") {
      swiper.navigation.init();
    }

    if (typeof swiper.navigation.update === "function") {
      swiper.navigation.update();
    }
  });
}
