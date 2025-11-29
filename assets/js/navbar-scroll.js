// Enhanced navbar scroll effect
document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar');
  let lastScrollTop = 0;
  let scrollThreshold = 50;

  function handleNavbarScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Add 'scrolled' class when scrolled past threshold
    if (scrollTop > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollTop = scrollTop;
  }

  // Throttle scroll event for performance
  let ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        handleNavbarScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
});
