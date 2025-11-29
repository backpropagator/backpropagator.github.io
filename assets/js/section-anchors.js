// Add anchor links to section headings
document.addEventListener('DOMContentLoaded', function() {
  const headings = document.querySelectorAll('h2[id], h3[id], h4[id]');

  headings.forEach(heading => {
    // Create anchor link
    const anchor = document.createElement('a');
    anchor.className = 'section-anchor';
    anchor.href = `#${heading.id}`;
    anchor.setAttribute('aria-label', `Link to ${heading.textContent}`);
    anchor.innerHTML = '<i class="fas fa-link"></i>';

    // Insert anchor before heading text
    heading.style.position = 'relative';
    heading.appendChild(anchor);
  });
});
