(function () {
  var headings = Array.from(document.querySelectorAll('.content h2'));
  if (headings.length < 2) return;

  // Auto-assign IDs from heading text
  headings.forEach(function (h) {
    if (!h.id) {
      h.id = h.textContent.trim().toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
  });

  // Find the active sidebar link
  var activeLink = document.querySelector('.sidebar-nav a.active');
  if (!activeLink) return;

  // Build sub-nav container and inject one link per heading
  var subNav = document.createElement('div');
  subNav.className = 'sidebar-sub-nav';

  headings.forEach(function (h) {
    var a = document.createElement('a');
    a.href = '#' + h.id;
    a.className = 'sidebar-sub-link';
    a.textContent = h.textContent;
    subNav.appendChild(a);
  });

  // Insert immediately after the active link
  activeLink.parentNode.insertBefore(subNav, activeLink.nextSibling);

  // Scroll-based active section tracking
  var subLinks = Array.from(subNav.querySelectorAll('.sidebar-sub-link'));

  function updateActive() {
    var fromTop = window.scrollY + 120;
    var current = '';
    headings.forEach(function (h) {
      if (h.offsetTop <= fromTop) current = h.id;
    });
    subLinks.forEach(function (l) {
      l.classList.toggle('sidebar-sub-link-active', l.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();
