(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // header: hairline once scrolled, hides on scroll down, returns on scroll up; highlights the section in view
  var hdr = document.getElementById('hdr'), lastY = window.scrollY;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    hdr.classList.toggle('scrolled', y > 10);
    if (y > 600 && y > lastY + 2) hdr.classList.add('away'); else if (y < lastY - 2) hdr.classList.remove('away');
    lastY = y;
  }, { passive: true });
  var links = document.querySelectorAll('.site-header nav a');
  if ('IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); }); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    ['private', 'coworking', 'services', 'spaces', 'location'].forEach(function (id) { so.observe(document.getElementById(id)); });
  }

  // language dropdown (UI concept: the content stays in English for now)
  var lb = document.getElementById('lang-btn'), lm = document.getElementById('lang-menu'), lc = document.getElementById('lang-code');
  function setMenu(open) { lb.setAttribute('aria-expanded', String(open)); lm.classList.toggle('open', open); }
  lb.addEventListener('click', function (e) { e.stopPropagation(); setMenu(lb.getAttribute('aria-expanded') !== 'true'); });
  lm.querySelectorAll('button').forEach(function (b) {
    b.addEventListener('click', function () {
      lm.querySelectorAll('button').forEach(function (o) { o.setAttribute('aria-checked', o === b ? 'true' : 'false'); });
      lc.textContent = b.dataset.code; lb.setAttribute('aria-label', 'Language: ' + b.firstChild.textContent);
      setMenu(false); lb.focus();
    });
  });
  document.addEventListener('click', function (e) { if (!lm.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // gentle parallax on large photos
  var par = document.querySelectorAll('.par');
  function parallax() {
    var vh = window.innerHeight;
    par.forEach(function (img) {
      var r = img.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var k = (r.top + r.height / 2 - vh / 2) / vh;
      img.style.transform = 'translate3d(0,' + (-k * parseFloat(img.dataset.speed) * r.height - parseFloat(img.dataset.speed) * r.height * .5) + 'px,0)';
    });
  }
  if (!reduce) { window.addEventListener('scroll', function () { requestAnimationFrame(parallax); }, { passive: true }); parallax(); }

  // reveals, only for elements that start below the first screen
  if ('IntersectionObserver' in window && !reduce) {
    var fold = window.innerHeight;
    var ro = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove('pre'); ro.unobserve(e.target); } }); }, { threshold: .15 });
    document.querySelectorAll('.rv').forEach(function (el) { if (el.getBoundingClientRect().top > fold) { el.classList.add('pre'); ro.observe(el); } });
    // clipped photos report no visible area, so watch their parent and uncover the photo from there
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.querySelectorAll(':scope > .rimg').forEach(function (c) { c.classList.remove('pre'); }); io.unobserve(e.target); } }); }, { threshold: .1 });
    document.querySelectorAll('.rimg').forEach(function (el) { if (el.getBoundingClientRect().top > fold) { el.classList.add('pre'); io.observe(el.parentElement); } });
  }

  // Our Spaces: arrows, drag to scroll, progress bar
  var g = document.getElementById('gallery'), items = g.querySelectorAll('figure'), bar = document.getElementById('bar');
  function update() { var max = g.scrollWidth - g.clientWidth, w = Math.max(10, g.clientWidth / g.scrollWidth * 100); bar.style.width = w + '%'; bar.style.left = (max > 0 ? g.scrollLeft / max * (100 - w) : 0) + '%'; }
  function current() { var best = 0; items.forEach(function (it, i) { if (it.offsetLeft - items[0].offsetLeft <= g.scrollLeft + 40) best = i; }); return best; }
  function go(step) { var i = Math.max(0, Math.min(items.length - 1, current() + step)); g.scrollTo({ left: items[i].offsetLeft - items[0].offsetLeft, behavior: reduce ? 'auto' : 'smooth' }); }
  document.getElementById('prev').addEventListener('click', function () { go(-1); });
  document.getElementById('next').addEventListener('click', function () { go(1); });
  g.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update); update();
  var down = false, sx = 0, sl = 0;
  g.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = g.scrollLeft; g.classList.add('drag'); });
  window.addEventListener('pointermove', function (e) { if (down) g.scrollLeft = sl - (e.clientX - sx); });
  window.addEventListener('pointerup', function () { if (down) { down = false; g.classList.remove('drag'); } });
})();
