// Auto-hide footer on scroll down, show on scroll up
(function() {
  const footer = document.querySelector('footer.fixed-bottom');
  if (!footer) return;

  let lastScrollTop = 0;
  let scrollTimeout;

  window.addEventListener('scroll', function() {
    // Clear the timeout if it exists
    clearTimeout(scrollTimeout);

    // Set a timeout to run after scrolling stops
    scrollTimeout = setTimeout(function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // If scrolled down more than 100px
      if (scrollTop > 100) {
        if (scrollTop > lastScrollTop) {
          // Scrolling down - hide footer
          footer.classList.add('footer-hidden');
        } else {
          // Scrolling up - show footer
          footer.classList.remove('footer-hidden');
        }
      } else {
        // Near top of page - always show footer
        footer.classList.remove('footer-hidden');
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, 100); // Wait 100ms after scrolling stops
  }, false);
})();
