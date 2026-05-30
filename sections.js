(function () {
  var content = document.querySelector('.content');
  if (!content) return;

  var pageId = location.pathname.split('/').pop().replace('.html', '') || 'index';
  var headings = Array.from(content.querySelectorAll('h2'));

  headings.forEach(function (h2) {
    // Ensure the heading has an id (toc.js also does this but may run after)
    if (!h2.id) {
      h2.id = h2.textContent.trim().toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    var storageKey = 'ql-sec-' + pageId + '-' + h2.id;
    var stored = localStorage.getItem(storageKey);
    var hashMatch = location.hash === '#' + h2.id;
    // Default collapsed; expand only if explicitly stored as expanded or if the hash targets this section
    var expanded = stored !== 'collapsed';

    // Collect all siblings after the h2 within the same parent until the next h2
    var body = document.createElement('div');
    body.className = 'section-body';
    if (!expanded) body.classList.add('section-collapsed');

    var next = h2.nextElementSibling;
    while (next && next.tagName !== 'H2') {
      var toMove = next;
      next = next.nextElementSibling;
      body.appendChild(toMove);
    }

    if (!body.children.length) return;

    h2.parentNode.insertBefore(body, h2.nextSibling);
    h2.classList.add('section-toggle');
    h2.setAttribute('aria-expanded', expanded ? 'true' : 'false');

    (function (heading, bodyDiv, key) {
      heading.addEventListener('click', function () {
        var nowExpanded = this.getAttribute('aria-expanded') !== 'true';
        this.setAttribute('aria-expanded', nowExpanded ? 'true' : 'false');
        bodyDiv.classList.toggle('section-collapsed', !nowExpanded);
        localStorage.setItem(key, nowExpanded ? 'expanded' : 'collapsed');
      });
    })(h2, body, storageKey);
  });

  // Expand section when navigated to via anchor link
  function expandByHash(hash) {
    if (!hash) return;
    try {
      var target = document.querySelector(hash);
      if (target && target.tagName === 'H2') {
        target.setAttribute('aria-expanded', 'true');
        var body = target.nextElementSibling;
        if (body && body.classList.contains('section-body')) {
          body.classList.remove('section-collapsed');
        }
      }
    } catch (e) {}
  }

  window.addEventListener('hashchange', function () { expandByHash(location.hash); });
  expandByHash(location.hash);
})();
