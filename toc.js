(function () {
  // ── Page map: filename → sections for sub-nav ──────────────────────────────
  var PAGE_SECTIONS = {
    'index.html': [
      { id: 'how-it-works',              text: 'How It Works' },
      { id: 'core-concepts',             text: 'Core Concepts' },
      { id: 'data-model',                text: 'Data Model' },
      { id: 'page-resolution-algorithm', text: 'Page Resolution Algorithm' },
      { id: 'admin-commands',            text: 'Admin Commands' },
      { id: 'player-commands',           text: 'Player Commands' },
      { id: 'what-to-read-next',         text: 'What to Read Next' },
    ],
    'npc-setup.html': [
      { id: 'hycitizens-overview',      text: 'HyCitizens Overview' },
      { id: 'standard-hytale-npcs',     text: 'Standard Hytale NPCs' },
      { id: 'linking-quests-to-an-npc', text: 'Linking Quests to an NPC' },
      { id: 'npcs-json-format',         text: 'npcs.json Format' },
      { id: 'random-quest-pools',       text: 'Random Quest Pools' },
      { id: 'wand-mode',                text: 'Wand Mode' },
      { id: 'talk-tracking',            text: 'Talk Tracking' },
      { id: 'text-variables',           text: 'Text Variables' },
      { id: 'inline-text-formatting',   text: 'Inline Text Formatting' },
      { id: 'quick-setup-checklist',    text: 'Quick Setup Checklist' },
    ],
    'requirements.html': [
      { id: 'quest-state',         text: 'Quest State' },
      { id: 'player-tags',         text: 'Player Tags' },
      { id: 'kill-counting',       text: 'Kill Counting' },
      { id: 'block-interactions',  text: 'Block Interactions' },
      { id: 'inventory',           text: 'Inventory' },
      { id: 'npc-talk-count',      text: 'NPC Talk Count' },
      { id: 'cooldown',            text: 'Cooldown' },
      { id: 'timed-quests',        text: 'Timed Quests' },
      { id: 'position--world',     text: 'Position & World' },
      { id: 'logic-operators',     text: 'Logic Operators' },
      { id: 'named-variables',     text: 'Named Variables' },
      { id: 'quick-reference',     text: 'Quick Reference' },
    ],
    'actions.html': [
      { id: 'quest-state',         text: 'Quest State' },
      { id: 'player-tags',         text: 'Player Tags' },
      { id: 'tracking-flags',      text: 'Tracking Flags' },
      { id: 'journal-log-tag',     text: 'Journal Log Tag' },
      { id: 'cooldown--timer',     text: 'Cooldown & Timer' },
      { id: 'items',               text: 'Items' },
      { id: 'commands',            text: 'Commands' },
      { id: 'dialogue-navigation', text: 'Dialogue Navigation' },
      { id: 'load-actions',        text: 'Load Actions' },
      { id: 'npc-spawning',        text: 'NPC Spawning' },
      { id: 'named-variables',     text: 'Named Variables' },
      { id: 'quick-reference',     text: 'Quick Reference' },
    ],
    'progression.html': [
      { id: 'kill-quest',       text: 'Linear Kill Quest' },
      { id: 'item-turn-in',     text: 'Item Turn-In Quest' },
      { id: 'branching',        text: 'Branching Dialogue' },
      { id: 'cooldown-reward',  text: 'Cooldown / Daily Reward' },
      { id: 'timed-quest',      text: 'Timed Quest' },
      { id: 'random-pool',      text: 'Random Quest Pool' },
      { id: 'multi-npc',        text: 'Multi-NPC Quest Chain' },
    ],
    'ai-generation.html': [
      { id: 'what-is-the-system-prompt',  text: 'What Is the System Prompt' },
      { id: 'system-prompt',              text: 'System Prompt' },
      { id: 'getting-started',            text: 'Getting Started' },
      { id: 'writing-good-quest-prompts', text: 'Writing Good Quest Prompts' },
      { id: 'validating-ai-output',       text: 'Validating AI Output' },
      { id: 'common-mistakes',            text: 'Common Mistakes' },
    ],
  };

  function currentPage() {
    var path = window.location.pathname;
    var file = path.substring(path.lastIndexOf('/') + 1);
    return file || 'index.html';
  }

  function isActive(href) {
    var here = currentPage();
    return href === here || (here === '' && href === 'index.html');
  }

  // Auto-assign IDs to h2 headings on this page
  var contentHeadings = Array.from(document.querySelectorAll('.content h2'));
  contentHeadings.forEach(function (h) {
    if (!h.id) {
      h.id = h.textContent.trim().toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }
  });

  // Build collapsible sub-navs for every sidebar nav link
  var sidebarLinks = Array.from(document.querySelectorAll('.sidebar-nav > a'));

  sidebarLinks.forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var sections = PAGE_SECTIONS[href];
    if (!sections || sections.length === 0) return;

    var active = isActive(href);

    var wrapper = document.createElement('div');
    wrapper.className = 'sidebar-sub-nav' + (active ? ' sidebar-sub-nav-open' : '');
    wrapper.setAttribute('data-page', href);

    sections.forEach(function (sec) {
      var a = document.createElement('a');
      a.className = 'sidebar-sub-link';
      a.textContent = sec.text;
      // Same-page links use just the hash; cross-page links include filename
      a.href = active ? ('#' + sec.id) : (href + '#' + sec.id);
      wrapper.appendChild(a);
    });

    link.parentNode.insertBefore(wrapper, link.nextSibling);

    // Click the nav link to toggle collapse
    link.addEventListener('click', function (e) {
      if (isActive(href)) {
        // Already on this page — just toggle the sub-nav open/closed
        e.preventDefault();
        wrapper.classList.toggle('sidebar-sub-nav-open');
      }
      // Otherwise navigate normally; the destination page will open with its own sub-nav
    });
  });

  // Scroll-based active section highlight (current page only)
  var openSubNav = document.querySelector('.sidebar-sub-nav.sidebar-sub-nav-open');
  if (!openSubNav) return;
  var subLinks = Array.from(openSubNav.querySelectorAll('.sidebar-sub-link'));

  function updateActive() {
    var fromTop = window.scrollY + 120;
    var current = '';
    contentHeadings.forEach(function (h) {
      if (h.offsetTop <= fromTop) current = h.id;
    });
    subLinks.forEach(function (l) {
      var hash = l.getAttribute('href').replace(/^[^#]*#/, '');
      l.classList.toggle('sidebar-sub-link-active', hash === current);
    });
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();
})();
