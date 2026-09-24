(function () {
  var header = document.querySelector('.site-header');
  var hero = document.querySelector('.hero');
  var lastY = window.scrollY;
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('solid', y > hero.offsetHeight - 120);
    header.classList.toggle('away', y > hero.offsetHeight && y > lastY + 2);
    if (y < lastY - 2 || y <= hero.offsetHeight) header.classList.remove('away');
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var names = { EN: 'English', FR: 'Français', DE: 'Deutsch', LU: 'Lëtzebuergesch' };
  var buttons = document.querySelectorAll('.lang button');
  var note = document.getElementById('lang-note');
  var timer;
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      buttons.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      var code = b.textContent.trim();
      note.textContent = code === 'EN' ? 'English' : names[code] + ': translation comes later';
      note.classList.add('show');
      clearTimeout(timer);
      timer = setTimeout(function () { note.classList.remove('show'); }, 2200);
    });
  });

  // Workspace selector over the hero video
  var szBtn = document.getElementById('sz-btn');
  var sizeLabels = { '1': '1 PERSON', '2': '2 PERSONS', '3': '3 PERSONS', '4': '4 PERSONS', '6': '6 PERSONS', '8': '8 PERSONS' };
  function closeAll(except) {
    document.querySelectorAll('.field-btn').forEach(function (b) {
      if (b === except) return;
      b.setAttribute('aria-expanded', 'false');
      document.getElementById(b.getAttribute('aria-controls')).classList.remove('open');
    });
  }
  function setupField(btnId, onPick) {
    var btn = document.getElementById(btnId);
    var menu = document.getElementById(btn.getAttribute('aria-controls'));
    var opts = menu.querySelectorAll('li');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = btn.getAttribute('aria-expanded') !== 'true';
      closeAll(btn);
      btn.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('open', open);
    });
    opts.forEach(function (o) {
      o.addEventListener('click', function () {
        opts.forEach(function (x) { x.setAttribute('aria-selected', x === o ? 'true' : 'false'); });
        btn.querySelector('.v').textContent = o.textContent;
        closeAll();
        onPick(o);
        btn.focus();
      });
    });
  }
  setupField('ws-btn', function (o) {
    var type = o.dataset.type;
    szBtn.disabled = type !== 'private';
    szBtn.querySelector('.v').textContent = type === 'private' ? sizeLabels[document.querySelector('#sz-menu [aria-selected="true"]').dataset.size] : '—';
  });
  setupField('sz-btn', function () {});
  document.addEventListener('click', function () { closeAll(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });

  var g = document.getElementById('gallery');
  var items = g.querySelectorAll('figure');
  var count = document.getElementById('count');
  var bar = document.getElementById('bar');
  function current() {
    var left = g.scrollLeft, best = 0;
    items.forEach(function (it, i) { if (it.offsetLeft - g.offsetLeft - 80 <= left) best = i; });
    if (left + g.clientWidth >= g.scrollWidth - 4) best = items.length - 1;
    return best;
  }
  function update() {
    var i = current();
    count.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(items.length).padStart(2, '0');
    var max = g.scrollWidth - g.clientWidth;
    var w = Math.max(12, g.clientWidth / g.scrollWidth * 100);
    bar.style.width = w + '%';
    bar.style.left = (max > 0 ? g.scrollLeft / max * (100 - w) : 0) + '%';
  }
  function go(step) {
    var i = Math.min(items.length - 1, Math.max(0, current() + step));
    g.scrollTo({ left: items[i].offsetLeft - items[0].offsetLeft });
  }
  document.getElementById('g-prev').addEventListener('click', function () { go(-1); });
  document.getElementById('g-next').addEventListener('click', function () { go(1); });
  g.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
