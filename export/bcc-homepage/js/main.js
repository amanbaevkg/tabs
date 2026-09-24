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
