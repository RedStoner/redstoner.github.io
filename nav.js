(function () {
  // ---- Single source of truth for the sidebar ----
  // Entry shapes:
  //   { type: 'link',    href, icon, label, plugin? }
  //   { type: 'section', label, plugin? }
  // `plugin` is a key used for color accents (core|icons|dialog|titles|gui|claims).
  // `icon` is an inline SVG string rendered inside a small box.
  var SVG = {
    home:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1Z"/></svg>',
    book:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5A2.5 2.5 0 0 0 4 20.5V4.5Z"/><path d="M8 2v16"/></svg>',
    npc:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    check:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>',
    play:    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5a1 1 0 0 1 1.5-.87l11 6.5a1 1 0 0 1 0 1.74l-11 6.5A1 1 0 0 1 7 17.5v-13Z"/></svg>',
    target:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
    sheet:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l5 5v13H6z"/><path d="M14 3v5h5"/><path d="M9 13h7M9 17h7M9 9h3"/></svg>',
    smile:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><circle cx="9" cy="10" r="0.8" fill="currentColor"/><circle cx="15" cy="10" r="0.8" fill="currentColor"/></svg>',
    route:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8 6h9a4 4 0 0 1 0 8H7a4 4 0 0 0 0 8h9"/></svg>',
    gear:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.37.08.7.28.95.56.25.28.4.63.4 1v.09c0 .38.15.73.4 1Z"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 13.6 8.4 20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6Z"/><path d="M19 14l.7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7Z"/></svg>',
    diamond: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M12 3l9 9-9 9-9-9z"/></svg>',
    square:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>',
    star:    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3 7h7l-5.7 4.3L18 21l-6-4.3L6 21l1.7-7.7L2 9h7z"/></svg>',
    layout:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 10h18M10 10v11"/></svg>',
    map:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"><path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2Z"/><path d="M9 3v16M15 5v16"/></svg>',
    swords:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"><path d="M14.5 17.5 21 11l-2-2-6.5 6.5"/><path d="m13 16-3-3"/><path d="m9 17-2 2H4v-3l2-2"/><path d="M3 3l6 6"/><path d="M14.5 6.5 21 13l-2 2-6.5-6.5"/><path d="m11 8 3 3"/></svg>',
    chat:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 9 9 0 0 1-3.8-.8L3 21l1.8-4.7A8.38 8.38 0 0 1 4 12.5 8.5 8.5 0 0 1 12.5 4 8.5 8.5 0 0 1 21 11.5Z"/><path d="M8.5 11.5h7M8.5 14.5h4"/></svg>',
    banner:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3v18"/><path d="M5 4h13l-3 4 3 4H5"/></svg>',
    crown:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m3 7 4 4 5-6 5 6 4-4-2 12H5z"/></svg>'
  };

  var NAV_ITEMS = [
    { type: 'link', href: 'index.html',         icon: SVG.home,    label: 'Suite Home' },

    { type: 'section', label: 'Core',           plugin: 'core' },
    { type: 'link', href: 'core.html',          icon: SVG.book,    label: 'Overview',      plugin: 'core' },
    { type: 'link', href: 'editor.html',        icon: SVG.sheet,   label: 'Web Editor',    plugin: 'core' },
    { type: 'link', href: 'in-game-editor.html',icon: SVG.gear,    label: 'In-Game Editor',plugin: 'core' },
    { type: 'link', href: 'npc-setup.html',     icon: SVG.npc,     label: 'NPC Setup',     plugin: 'core' },
    { type: 'link', href: 'requirements.html',  icon: SVG.check,   label: 'Requirements',  plugin: 'core' },
    { type: 'link', href: 'actions.html',       icon: SVG.play,    label: 'Actions',       plugin: 'core' },
    { type: 'link', href: 'objectives.html',    icon: SVG.target,  label: 'Objectives',    plugin: 'core' },
    { type: 'link', href: 'cheatsheet.html',    icon: SVG.sheet,   label: 'Cheat Sheet',   plugin: 'core' },
    { type: 'link', href: 'portraits.html',     icon: SVG.smile,   label: 'Portraits',     plugin: 'core' },
    { type: 'link', href: 'progression.html',   icon: SVG.route,   label: 'Quest Patterns',plugin: 'core' },
    { type: 'link', href: 'developer-api.html', icon: SVG.gear,    label: 'Plugin API',    plugin: 'core' },
    { type: 'link', href: 'ai-generation.html', icon: SVG.sparkle, label: 'AI Generation', plugin: 'core' },
    { type: 'link', href: 'wavearenas.html',    icon: SVG.swords,  label: 'Wave Arenas',   plugin: 'core' },

    { type: 'section', label: 'Icons',          plugin: 'icons' },
    { type: 'link', href: 'icons.html',         icon: SVG.diamond, label: 'Overview',      plugin: 'icons' },

    { type: 'section', label: 'Dialog',         plugin: 'dialog' },
    { type: 'link', href: 'dialog.html',        icon: SVG.square,  label: 'Overview',      plugin: 'dialog' },

    { type: 'section', label: 'Titles',         plugin: 'titles' },
    { type: 'link', href: 'titles.html',        icon: SVG.star,    label: 'Overview',      plugin: 'titles' },

    { type: 'section', label: 'GUI',            plugin: 'gui' },
    { type: 'link', href: 'gui.html',           icon: SVG.layout,  label: 'Overview',      plugin: 'gui' },

    { type: 'section', label: 'Claims',         plugin: 'claims' },
    { type: 'link', href: 'claims.html',             icon: SVG.map,     label: 'Overview',            plugin: 'claims' },
    { type: 'link', href: 'claims-player.html',      icon: SVG.home,    label: 'Player Claims',       plugin: 'claims' },
    { type: 'link', href: 'claims-regions.html',     icon: SVG.square,  label: 'Admin Regions',       plugin: 'claims' },
    { type: 'link', href: 'claims-rentbuy.html',     icon: SVG.diamond, label: 'Rent & Buy Regions',  plugin: 'claims' },
    { type: 'link', href: 'claims-commands.html',    icon: SVG.sheet,   label: 'Commands',            plugin: 'claims' },
    { type: 'link', href: 'claims-config.html',      icon: SVG.gear,    label: 'Config & Permissions',plugin: 'claims' },
    { type: 'link', href: 'claims-integrations.html',icon: SVG.route,   label: 'Integrations',        plugin: 'claims' },
    { type: 'link', href: 'claims-api.html',         icon: SVG.book,    label: 'Developer API',       plugin: 'claims' },

    { type: 'section', label: 'MMO',            plugin: 'mmo' },
    { type: 'link', href: 'mmo.html',           icon: SVG.swords,  label: 'Overview',                plugin: 'mmo' },
    { type: 'link', href: 'mmo-social.html',    icon: SVG.npc,     label: 'Parties & Friends',       plugin: 'mmo' },
    { type: 'link', href: 'mmo-guilds.html',    icon: SVG.home,    label: 'Guilds & Halls',          plugin: 'mmo' },
    { type: 'link', href: 'mmo-dungeons.html',  icon: SVG.target,  label: 'Dungeons & LFG',          plugin: 'mmo' },
    { type: 'link', href: 'mmo-events.html',    icon: SVG.sparkle, label: 'Events & Discoveries',    plugin: 'mmo' },
    { type: 'link', href: 'mmo-interface.html', icon: SVG.layout,  label: 'UI & Commands',           plugin: 'mmo' },
    { type: 'link', href: 'mmo-config.html',    icon: SVG.gear,    label: 'Configuration',           plugin: 'mmo' },
    { type: 'link', href: 'mmo-reference.html', icon: SVG.check,   label: 'Permissions & Integrations', plugin: 'mmo' },

    { type: 'section', label: 'Nations',        plugin: 'nations' },
    { type: 'link', href: 'nations.html',            icon: SVG.banner,  label: 'Overview',            plugin: 'nations' },
    { type: 'link', href: 'nations-cities.html',     icon: SVG.home,    label: 'Cities',              plugin: 'nations' },
    { type: 'link', href: 'nations-tier.html',       icon: SVG.crown,   label: 'Nations',             plugin: 'nations' },
    { type: 'link', href: 'nations-diplomacy.html',  icon: SVG.swords,  label: 'Diplomacy & Wars',    plugin: 'nations' },
    { type: 'link', href: 'nations-bank.html',       icon: SVG.diamond, label: 'Bank & Tax',          plugin: 'nations' },
    { type: 'link', href: 'nations-claims.html',     icon: SVG.map,     label: 'Claims & Plots',      plugin: 'nations' },
    { type: 'link', href: 'nations-commands.html',   icon: SVG.sheet,   label: 'Commands',            plugin: 'nations' },
    { type: 'link', href: 'nations-config.html',     icon: SVG.gear,    label: 'Config & Admin',      plugin: 'nations' },

    { type: 'section', label: 'Denizens',       plugin: 'denizens' },
    { type: 'link', href: 'denizens.html',           icon: SVG.npc,    label: 'Overview',            plugin: 'denizens' },
    { type: 'link', href: 'denizens-commands.html',  icon: SVG.sheet,  label: 'Commands',            plugin: 'denizens' },
    { type: 'link', href: 'denizens-appearance.html',icon: SVG.smile,  label: 'Appearance',          plugin: 'denizens' },
    { type: 'link', href: 'denizens-behavior.html',  icon: SVG.route,  label: 'Behavior & AI',       plugin: 'denizens' },
    { type: 'link', href: 'denizens-interaction.html',icon: SVG.chat,  label: 'Interaction & Quests',plugin: 'denizens' },
    { type: 'link', href: 'denizens-integration.html',icon: SVG.book,  label: 'Migration & API',     plugin: 'denizens' },
    { type: 'link', href: 'denizens-license.html',   icon: SVG.diamond,label: 'Licensing',           plugin: 'denizens' },

    { type: 'section', label: 'Arcade',          plugin: 'arcade' },
    { type: 'link', href: 'arcade.html',             icon: SVG.play,    label: 'Overview',           plugin: 'arcade' },
    { type: 'link', href: 'arcade-games.html',       icon: SVG.sparkle, label: 'Game Catalog',       plugin: 'arcade' },
    { type: 'link', href: 'arcade-blocks.html',      icon: SVG.square,  label: 'Cabinets & Tables',  plugin: 'arcade' },
    { type: 'link', href: 'arcade-commands.html',    icon: SVG.sheet,   label: 'Commands',           plugin: 'arcade' },
    { type: 'link', href: 'arcade-wallet.html',      icon: SVG.diamond, label: 'Wallet & Economy',   plugin: 'arcade' },
    { type: 'link', href: 'arcade-config.html',      icon: SVG.gear,    label: 'Configuration',      plugin: 'arcade' },
    { type: 'link', href: 'arcade-api.html',         icon: SVG.book,    label: 'Developer API',      plugin: 'arcade' },

    { type: 'section', label: 'QuestLines Knowledge', plugin: 'bot' },
    { type: 'link', href: 'bot.html',           icon: SVG.chat,    label: 'Discord Bot',    plugin: 'bot' },
    { type: 'link', href: 'bot-admin.html',     icon: SVG.gear,    label: 'Admin & Setup',  plugin: 'bot' },
    { type: 'link', href: 'bot-privacy.html',   icon: SVG.sheet,   label: 'Privacy Policy', plugin: 'bot' }
  ];

  var FOOTER_HTML = 'QuestLines — Hytale Plugin Suite';

  function currentPageFile() {
    var path = location.pathname.split('/').pop();
    return path || 'index.html';
  }

  function slugify(text) {
    return text.trim().toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Build the sidebar inside the given element
  function buildSidebar(sidebarEl) {
    var header = document.createElement('div');
    header.className = 'sidebar-header';

    var logo = document.createElement('a');
    logo.className = 'sidebar-logo';
    logo.href = 'index.html';
    var logoText = document.createElement('span');
    logoText.style.display = 'inline-flex';
    logoText.style.flexDirection = 'column';
    var mainLabel = document.createElement('span');
    mainLabel.textContent = 'QuestLines';
    mainLabel.style.color = 'var(--gold-soft)';
    mainLabel.style.fontFamily = 'var(--font-display)';
    mainLabel.style.fontSize = '1.22rem';
    mainLabel.style.fontWeight = '600';
    mainLabel.style.lineHeight = '1';
    mainLabel.style.textTransform = 'none';
    mainLabel.style.letterSpacing = '-0.01em';
    var subLabel = document.createElement('span');
    subLabel.textContent = 'Plugin Suite';
    logoText.appendChild(mainLabel);
    logoText.appendChild(subLabel);
    logo.appendChild(logoText);
    header.appendChild(logo);

    var searchBox = document.createElement('div');
    searchBox.className = 'sidebar-search';
    var searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.className = 'sidebar-search-input';
    searchInput.placeholder = 'Search the docs...';
    searchInput.setAttribute('aria-label', 'Search documentation');
    searchInput.autocomplete = 'off';
    searchInput.spellcheck = false;
    var kbd = document.createElement('span');
    kbd.className = 'sidebar-search-kbd';
    kbd.textContent = '/';
    var searchResults = document.createElement('div');
    searchResults.className = 'sidebar-search-results';
    searchResults.hidden = true;
    searchBox.appendChild(searchInput);
    searchBox.appendChild(kbd);
    searchBox.appendChild(searchResults);
    header.appendChild(searchBox);

    var nav = document.createElement('div');
    nav.className = 'sidebar-nav';

    var active = currentPageFile();

    NAV_ITEMS.forEach(function (item) {
      if (item.type === 'section') {
        var lbl = document.createElement('div');
        lbl.className = 'sidebar-section-label';
        lbl.textContent = item.label;
        if (item.plugin) lbl.setAttribute('data-plugin', item.plugin);
        nav.appendChild(lbl);
      } else if (item.type === 'link') {
        var a = document.createElement('a');
        a.href = item.href;
        if (item.href === active) a.className = 'active';
        if (item.plugin) a.setAttribute('data-plugin', item.plugin);

        var ico = document.createElement('span');
        ico.className = 'nav-icon';
        if (item.icon && item.icon.indexOf('<svg') === 0) {
          ico.innerHTML = item.icon;
          // normalize svg sizing
          var svg = ico.querySelector('svg');
          if (svg) {
            svg.setAttribute('width', '13');
            svg.setAttribute('height', '13');
            svg.style.display = 'block';
          }
        } else {
          ico.textContent = item.icon || '';
        }
        a.appendChild(ico);
        a.appendChild(document.createTextNode(item.label));
        nav.appendChild(a);
      }
    });

    var footer = document.createElement('div');
    footer.className = 'sidebar-footer';
    footer.innerHTML = FOOTER_HTML;

    sidebarEl.innerHTML = '';
    sidebarEl.appendChild(header);
    sidebarEl.appendChild(nav);
    sidebarEl.appendChild(footer);

    wireSearch(searchInput, searchResults);
    wireSearchKbdShortcut(searchInput);

    return nav;
  }

  // ---- Topbar: breadcrumbs + prev/next ----
  function buildTopbar() {
    if (document.querySelector('.topbar')) return;

    var mainWrapper = document.querySelector('.main-wrapper');
    if (!mainWrapper) return;

    // Wrap the existing .content in .main-inner if not already wrapped
    var content = mainWrapper.querySelector(':scope > .content');
    if (content && !content.parentNode.classList.contains('main-inner')) {
      var inner = document.createElement('div');
      inner.className = 'main-inner';
      mainWrapper.insertBefore(inner, content);
      inner.appendChild(content);
    }

    var topbar = document.createElement('div');
    topbar.className = 'topbar';

    var crumbs = document.createElement('nav');
    crumbs.className = 'topbar-crumbs';
    crumbs.setAttribute('aria-label', 'Breadcrumb');

    var active = currentPageFile();
    var activeItem = NAV_ITEMS.find(function (i) { return i.type === 'link' && i.href === active; });

    // Figure out the section this page belongs to
    var section = null;
    for (var i = 0; i < NAV_ITEMS.length; i++) {
      if (NAV_ITEMS[i].type === 'section') section = NAV_ITEMS[i];
      if (NAV_ITEMS[i] === activeItem) break;
    }

    var homeLink = document.createElement('a');
    homeLink.href = 'index.html';
    homeLink.textContent = 'QuestLines';
    crumbs.appendChild(homeLink);

    if (section) {
      var sep1 = document.createElement('span');
      sep1.className = 'crumb-sep';
      sep1.textContent = '/';
      crumbs.appendChild(sep1);

      var sectionSpan = document.createElement('span');
      sectionSpan.textContent = section.label;
      sectionSpan.style.color = 'var(--ink-soft)';
      crumbs.appendChild(sectionSpan);
    }

    if (activeItem && active !== 'index.html') {
      var sep2 = document.createElement('span');
      sep2.className = 'crumb-sep';
      sep2.textContent = '/';
      crumbs.appendChild(sep2);

      var pageSpan = document.createElement('span');
      pageSpan.className = 'crumb-current';
      pageSpan.textContent = activeItem.label;
      crumbs.appendChild(pageSpan);
    }

    topbar.appendChild(crumbs);

    // Prev / next
    var linkItems = NAV_ITEMS.filter(function (i) { return i.type === 'link'; });
    var idx = linkItems.findIndex(function (i) { return i.href === active; });
    var prev = idx > 0 ? linkItems[idx - 1] : null;
    var next = idx >= 0 && idx < linkItems.length - 1 ? linkItems[idx + 1] : null;

    var actions = document.createElement('div');
    actions.className = 'topbar-actions';

    function mkNavBtn(item, dir) {
      var a = document.createElement('a');
      a.className = 'topbar-nav-btn';
      if (!item) a.classList.add('topbar-nav-btn-disabled');
      a.href = item ? item.href : '#';
      var label = document.createElement('span');
      label.className = 'nav-label';
      label.textContent = item ? item.label : (dir === 'prev' ? 'Prev' : 'Next');
      var arrow = document.createElement('span');
      arrow.className = 'arrow';
      arrow.textContent = dir === 'prev' ? '←' : '→';
      if (dir === 'prev') { a.appendChild(arrow); a.appendChild(label); }
      else { a.appendChild(label); a.appendChild(arrow); }
      a.title = item ? ((dir === 'prev' ? 'Previous: ' : 'Next: ') + item.label) : '';
      return a;
    }

    actions.appendChild(mkNavBtn(prev, 'prev'));
    actions.appendChild(mkNavBtn(next, 'next'));

    topbar.appendChild(actions);

    document.body.insertBefore(topbar, document.body.firstChild);
  }

  // ---- Search ----
  var searchIndex = null;
  var searchIndexPromise = null;

  function buildSearchIndex() {
    if (searchIndexPromise) return searchIndexPromise;

    var pages = NAV_ITEMS
      .filter(function (i) { return i.type === 'link'; })
      .map(function (i) { return { href: i.href, label: i.label }; });

    var parser = new DOMParser();

    searchIndexPromise = Promise.all(pages.map(function (p) {
      return fetch(p.href, { credentials: 'same-origin' })
        .then(function (r) { return r.ok ? r.text() : null; })
        .then(function (html) {
          if (!html) return [];
          var doc = parser.parseFromString(html, 'text/html');
          var entries = [];

          var title = (doc.querySelector('.page-title') || {}).textContent || p.label;
          var subtitle = (doc.querySelector('.page-subtitle') || {}).textContent || '';
          entries.push({
            page: p.href,
            pageLabel: p.label,
            section: '',
            sectionSlug: '',
            title: title.trim(),
            text: (title + ' ' + subtitle).toLowerCase()
          });

          var content = doc.querySelector('.content');
          if (content) {
            var headings = Array.from(content.querySelectorAll('h2'));
            headings.forEach(function (h) {
              var sectionTitle = h.textContent.trim();
              var slug = h.id || slugify(sectionTitle);
              var body = sectionTitle;
              var node = h.nextElementSibling;
              while (node && node.tagName !== 'H2') {
                body += ' ' + (node.textContent || '');
                node = node.nextElementSibling;
              }
              entries.push({
                page: p.href,
                pageLabel: p.label,
                section: sectionTitle,
                sectionSlug: slug,
                title: sectionTitle,
                text: body.toLowerCase().replace(/\s+/g, ' ')
              });
            });
          }
          return entries;
        })
        .catch(function () { return []; });
    })).then(function (arrays) {
      searchIndex = arrays.reduce(function (acc, a) { return acc.concat(a); }, []);
      return searchIndex;
    });

    return searchIndexPromise;
  }

  function scoreEntry(entry, query, tokens) {
    var titleLower = entry.title.toLowerCase();
    var score = 0;
    if (titleLower === query) score += 100;
    if (titleLower.indexOf(query) === 0) score += 40;
    else if (titleLower.indexOf(query) !== -1) score += 20;
    if (entry.pageLabel.toLowerCase().indexOf(query) !== -1) score += 5;
    tokens.forEach(function (t) {
      if (!t) return;
      if (titleLower.indexOf(t) !== -1) score += 4;
      var count = 0;
      var from = 0;
      while (count < 5) {
        var idx = entry.text.indexOf(t, from);
        if (idx === -1) break;
        count++;
        from = idx + t.length;
      }
      score += count;
    });
    if (entry.section === '' && score > 0) score += 2;
    return score;
  }

  function makeSnippet(text, query) {
    var idx = text.indexOf(query);
    if (idx === -1) {
      return text.slice(0, 120) + (text.length > 120 ? '...' : '');
    }
    var start = Math.max(0, idx - 40);
    var end = Math.min(text.length, idx + query.length + 80);
    var prefix = start > 0 ? '...' : '';
    var suffix = end < text.length ? '...' : '';
    return prefix + text.slice(start, end) + suffix;
  }

  function highlight(snippet, query) {
    if (!query) return document.createTextNode(snippet);
    var frag = document.createDocumentFragment();
    var lower = snippet.toLowerCase();
    var q = query.toLowerCase();
    var from = 0;
    while (true) {
      var idx = lower.indexOf(q, from);
      if (idx === -1) {
        frag.appendChild(document.createTextNode(snippet.slice(from)));
        break;
      }
      if (idx > from) frag.appendChild(document.createTextNode(snippet.slice(from, idx)));
      var mark = document.createElement('mark');
      mark.textContent = snippet.slice(idx, idx + q.length);
      frag.appendChild(mark);
      from = idx + q.length;
    }
    return frag;
  }

  function renderResults(resultsEl, entries, query) {
    resultsEl.innerHTML = '';
    if (entries.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'sidebar-search-empty';
      empty.textContent = 'No matches';
      resultsEl.appendChild(empty);
      return;
    }

    entries.forEach(function (entry, i) {
      var a = document.createElement('a');
      a.className = 'sidebar-search-result';
      a.href = entry.page + (entry.sectionSlug ? ('#' + entry.sectionSlug) : '');
      if (i === 0) a.classList.add('sidebar-search-result-first');

      var top = document.createElement('div');
      top.className = 'sidebar-search-result-top';
      var page = document.createElement('span');
      page.className = 'sidebar-search-result-page';
      page.textContent = entry.pageLabel;
      top.appendChild(page);
      if (entry.section) {
        var sep = document.createElement('span');
        sep.className = 'sidebar-search-result-sep';
        sep.textContent = ' / ';
        top.appendChild(sep);
        var sec = document.createElement('span');
        sec.className = 'sidebar-search-result-section';
        sec.appendChild(highlight(entry.section, query));
        top.appendChild(sec);
      }
      a.appendChild(top);

      var snippet = document.createElement('div');
      snippet.className = 'sidebar-search-result-snippet';
      var snippetText = makeSnippet(entry.text, query.toLowerCase());
      snippet.appendChild(highlight(snippetText, query));
      a.appendChild(snippet);

      resultsEl.appendChild(a);
    });
  }

  function wireSearch(inputEl, resultsEl) {
    var lastQuery = '';
    var loading = false;

    function runSearch(query) {
      query = query.trim();
      if (query.length < 2) {
        resultsEl.hidden = true;
        resultsEl.innerHTML = '';
        return;
      }
      resultsEl.hidden = false;

      if (!searchIndex) {
        if (!loading) {
          loading = true;
          resultsEl.innerHTML = '<div class="sidebar-search-empty">Indexing...</div>';
          buildSearchIndex().then(function () {
            loading = false;
            runSearch(inputEl.value);
          });
        }
        return;
      }

      var lower = query.toLowerCase();
      var tokens = lower.split(/\s+/).filter(Boolean);
      var scored = [];
      for (var i = 0; i < searchIndex.length; i++) {
        var s = scoreEntry(searchIndex[i], lower, tokens);
        if (s > 0) scored.push({ entry: searchIndex[i], score: s });
      }
      scored.sort(function (a, b) { return b.score - a.score; });
      renderResults(resultsEl, scored.slice(0, 10).map(function (r) { return r.entry; }), query);
    }

    inputEl.addEventListener('input', function () {
      var v = inputEl.value;
      if (v === lastQuery) return;
      lastQuery = v;
      runSearch(v);
    });

    inputEl.addEventListener('focus', function () {
      if (!searchIndex && !loading) buildSearchIndex();
    });

    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        inputEl.value = '';
        lastQuery = '';
        resultsEl.hidden = true;
        resultsEl.innerHTML = '';
        inputEl.blur();
      } else if (e.key === 'Enter') {
        var first = resultsEl.querySelector('.sidebar-search-result');
        if (first) {
          e.preventDefault();
          window.location.href = first.getAttribute('href');
        }
      }
    });

    document.addEventListener('click', function (e) {
      if (!inputEl.parentNode.contains(e.target)) {
        resultsEl.hidden = true;
      }
    });
    inputEl.addEventListener('focus', function () {
      if (inputEl.value.trim().length >= 2) resultsEl.hidden = false;
    });
  }

  function wireSearchKbdShortcut(inputEl) {
    document.addEventListener('keydown', function (e) {
      // Ignore when typing into an input/textarea/contenteditable
      var t = e.target;
      var tag = t && t.tagName;
      var editable = t && (t.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT');
      if (editable) return;

      if (e.key === '/') {
        e.preventDefault();
        inputEl.focus();
        inputEl.select();
      }
    });
  }

  function wireCollapsibleSections(nav) {
    var nodes = Array.from(nav.children);
    var i = 0;

    while (i < nodes.length) {
      var node = nodes[i];

      if (node.classList.contains('sidebar-section-label')) {
        var group = [];
        var j = i + 1;
        while (j < nodes.length && !nodes[j].classList.contains('sidebar-section-label')) {
          group.push(nodes[j]);
          j++;
        }

        if (group.length > 0) {
          var hasActive = group.some(function (el) {
            return el.classList.contains('active') ||
                   (el.querySelector && el.querySelector('.active'));
          });

          var sectionId = 'ql-nav-' + node.textContent.trim()
            .replace(/\s+/g, '-').toLowerCase();
          var stored = localStorage.getItem(sectionId);
          // Default: only expand the section containing the active page;
          // others collapse unless explicitly expanded before.
          var expanded;
          if (hasActive) expanded = true;
          else if (stored === 'expanded') expanded = true;
          else expanded = false;

          var items = document.createElement('div');
          items.className = 'sidebar-section-items';
          if (!expanded) items.classList.add('collapsed');

          group.forEach(function (el) { items.appendChild(el); });
          node.parentNode.insertBefore(items, node.nextSibling);

          node.classList.add('sidebar-section-toggle');
          node.setAttribute('aria-expanded', expanded ? 'true' : 'false');

          (function (labelNode, itemsDiv, id) {
            labelNode.addEventListener('click', function () {
              var nowExpanded = this.getAttribute('aria-expanded') !== 'true';
              this.setAttribute('aria-expanded', nowExpanded ? 'true' : 'false');
              itemsDiv.classList.toggle('collapsed', !nowExpanded);
              localStorage.setItem(id, nowExpanded ? 'expanded' : 'collapsed');
            });
          })(node, items, sectionId);

          i = j;
        } else {
          i++;
        }
      } else {
        i++;
      }
    }
  }

  // ---- Init ----
  var sidebar = document.querySelector('nav.sidebar');
  if (!sidebar) return;

  if (!sidebar.querySelector('.sidebar-nav')) {
    buildSidebar(sidebar);
  }

  var navEl = sidebar.querySelector('.sidebar-nav');
  if (navEl) wireCollapsibleSections(navEl);

  buildTopbar();
})();
