(function () {
  var content = document.querySelector('.content');
  if (!content) return;

  var h2s = Array.from(content.querySelectorAll('h2'));
  if (h2s.length < 2) return;

  // Auto-assign IDs from heading text when missing
  function slugify(text) {
    return text.trim().toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  h2s.forEach(function (h) {
    if (!h.id) h.id = slugify(h.textContent);
  });

  // ---- Sidebar sub-nav (fallback on narrow screens) ----
  var activeLink = document.querySelector('.sidebar-nav a.active');
  if (activeLink) {
    var subNav = document.createElement('div');
    subNav.className = 'sidebar-sub-nav';
    h2s.forEach(function (h) {
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.className = 'sidebar-sub-link';
      a.textContent = h.textContent;
      subNav.appendChild(a);
    });
    activeLink.parentNode.insertBefore(subNav, activeLink.nextSibling);
  }

  // ---- Right-rail "On this page" TOC ----
  // Don't render on cheat-sheet pages (too dense / full-width)
  if (content.classList.contains('cheat-sheet')) {
    // still wire scrollspy for the (possible) sidebar sub-nav
    wireScrollSpy([]);
    return;
  }

  var mainInner = content.parentNode.classList.contains('main-inner')
    ? content.parentNode
    : null;
  if (!mainInner) return;

  var rail = document.createElement('aside');
  rail.className = 'page-rail';
  rail.setAttribute('aria-label', 'On this page');

  var title = document.createElement('div');
  title.className = 'page-rail-title';
  title.textContent = 'On this page';
  rail.appendChild(title);

  var list = document.createElement('ul');
  list.className = 'page-rail-list';

  // Collect H2s + their nested H3s (stop at next H2)
  h2s.forEach(function (h2) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#' + h2.id;
    a.textContent = h2.textContent;
    a.setAttribute('data-rail-target', h2.id);
    li.appendChild(a);
    list.appendChild(li);

    // Collect H3s until next H2
    var node = h2.nextElementSibling;
    while (node && node.tagName !== 'H2') {
      if (node.tagName === 'H3') collectH3(node);
      // Also look inside wrappers (data-section-body divs)
      if (node.querySelectorAll) {
        var innerH3s = Array.from(node.querySelectorAll('h3'));
        innerH3s.forEach(function (h3) {
          // Avoid collecting again if already in main flow
          if (h3.closest('h2') !== null) return;
          collectH3(h3);
        });
      }
      node = node.nextElementSibling;
    }

    function collectH3(h3) {
      if (!h3.id) h3.id = slugify(h3.textContent);
      var subLi = document.createElement('li');
      subLi.className = 'rail-h3';
      var subA = document.createElement('a');
      subA.href = '#' + h3.id;
      subA.textContent = h3.textContent;
      subA.setAttribute('data-rail-target', h3.id);
      subLi.appendChild(subA);
      list.appendChild(subLi);
    }
  });

  rail.appendChild(list);
  mainInner.appendChild(rail);

  // ---- Scrollspy (both rail and sidebar sub-nav) ----
  var allTargets = Array.from(
    document.querySelectorAll('.content h2[id], .content h3[id]')
  );

  function wireScrollSpy() {
    var railLinks = Array.from(document.querySelectorAll('.page-rail-list a'));
    var subLinks = Array.from(document.querySelectorAll('.sidebar-sub-link'));

    function updateActive() {
      var offset = 120;
      var fromTop = window.scrollY + offset;
      var currentId = '';
      for (var i = 0; i < allTargets.length; i++) {
        if (allTargets[i].offsetTop <= fromTop) currentId = allTargets[i].id;
        else break;
      }
      railLinks.forEach(function (l) {
        l.classList.toggle('rail-active', l.getAttribute('data-rail-target') === currentId);
      });
      subLinks.forEach(function (l) {
        l.classList.toggle('sidebar-sub-link-active', l.getAttribute('href') === '#' + currentId);
      });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive, { passive: true });
    updateActive();
  }

  wireScrollSpy();
})();
