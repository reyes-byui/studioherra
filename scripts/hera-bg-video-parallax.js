// Parallax effect for background video in #who-is-hera-content
window.initBgVideoParallax = function() {
  // Remove any previous scroll listeners to avoid stacking
  window.removeEventListener('scroll', window._heraBgVideoParallaxScrollHandler);
  window._heraBgVideoParallaxScrollHandler = function() {
    const video = document.getElementById('hera-bg-video');
    if (video) {
      const offset = window.scrollY * 0.5;
      video.style.transform = `translateY(${offset}px)`;
    }
  };
  window.addEventListener('scroll', window._heraBgVideoParallaxScrollHandler);
  // Trigger once in case already scrolled
  window._heraBgVideoParallaxScrollHandler();
};
