(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header: transparent over the hero, solid after it, hides on scroll down
  var header = document.querySelector('.site-header');
  var hero = document.querySelector('.hero');
  var lastY = window.scrollY;
  function onScroll() {
    var y = window.scrollY, h = hero.offsetHeight;
    header.classList.toggle('solid', y > 40);
    if (y > h && y > lastY + 2) header.classList.add('away');
    else if (y < lastY - 2 || y <= h) header.classList.remove('away');
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Hero: streak field at the logo angle, brighter near the cursor
  var cv = document.getElementById('streaks'), ctx = cv.getContext('2d');
  var W = 0, H = 0, dpr = 1, streaks = [], mouse = { x: -9999, y: -9999 }, running = true;
  var TAN = Math.tan(19 * Math.PI / 180);
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    streaks = [];
    var n = Math.round(W / 14);
    for (var i = 0; i < n; i++) streaks.push({ x: Math.random() * (W + H * TAN), y: Math.random() * H, len: 40 + Math.random() * 140, v: .25 + Math.random() * .8, a: .05 + Math.random() * .18 });
  }
  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < streaks.length; i++) {
      var s = streaks[i];
      if (!reduce) { s.y -= s.v; s.x += s.v * TAN; if (s.y + s.len < 0) { s.y = H + Math.random() * 60; s.x = Math.random() * (W + H * TAN) - H * TAN * .2; } }
      var x2 = s.x + s.len * TAN, y2 = s.y - s.len;
      var mx = (s.x + x2) / 2, my = (s.y + y2) / 2;
      var d = Math.hypot(mx - mouse.x, my - mouse.y);
      var glow = Math.max(0, 1 - d / 220);
      var g = ctx.createLinearGradient(s.x, s.y, x2, y2);
      var col = glow > 0 ? '18,211,216' : '157,210,214';
      g.addColorStop(0, 'rgba(' + col + ',0)');
      g.addColorStop(1, 'rgba(' + col + ',' + Math.min(1, s.a + glow * .8) + ')');
      ctx.strokeStyle = g; ctx.lineWidth = 1 + glow * 1.2;
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(x2, y2); ctx.stroke();
    }
    if (running && !reduce) requestAnimationFrame(frame);
  }
  size(); frame();
  window.addEventListener('resize', function () { size(); if (reduce) frame(); });
  hero.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; if (reduce) frame(); });
  hero.addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; if (reduce) frame(); });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { var vis = es[0].isIntersecting; if (vis && !running) { running = true; if (!reduce) requestAnimationFrame(frame); } running = vis; }).observe(hero);

  // Hero: logo mark tilts toward the cursor
  var mark = document.getElementById('mark');
  if (!reduce) hero.addEventListener('pointermove', function (e) {
    var r = hero.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
    mark.style.transform = 'rotateY(' + (px * 22) + 'deg) rotateX(' + (-py * 18) + 'deg)';
  });
  hero.addEventListener('pointerleave', function () { mark.style.transform = ''; });

  // Our DNA: the panel in the middle of the screen drives the index
  var panels = document.querySelectorAll('.panel'), items = document.querySelectorAll('#index li');
  function activate(id) {
    panels.forEach(function (p) { p.classList.toggle('on', p.id === id); });
    items.forEach(function (li) { li.classList.toggle('on', li.querySelector('a').getAttribute('href') === '#' + id); });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) activate(e.target.id); }); }, { rootMargin: '-45% 0px -45% 0px' });
    panels.forEach(function (p) { io.observe(p); });
  }
  document.querySelectorAll('a[href^="#svc-"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.querySelector(a.getAttribute('href')); if (!t) return;
      e.preventDefault(); t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); activate(t.id);
    });
  });

  // Reveal + count-up, only for elements that start below the first screen
  var rvs = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var fold = window.innerHeight;
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target; el.classList.remove('pre'); ro.unobserve(el);
        var c = el.querySelector('.count');
        if (c) { var to = +el.dataset.value, t0 = null; (function tick(t) { t0 = t0 || t; var k = Math.min(1, (t - t0) / 1400); c.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); })(performance.now()); }
      });
    }, { threshold: .18 });
    rvs.forEach(function (el) {
      if (el.getBoundingClientRect().top > fold) { el.classList.add('pre'); var c = el.querySelector('.count'); if (c) c.textContent = '0'; ro.observe(el); }
    });
  }

  // FAQ accordion
  document.querySelectorAll('.qa button').forEach(function (b) {
    b.addEventListener('click', function () { b.setAttribute('aria-expanded', b.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'); });
  });
})();
