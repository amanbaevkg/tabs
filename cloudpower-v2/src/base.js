/* ============ Cloud Power design system: shared behaviour ============ */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.CP = { reduce: reduce };

  // Header: transparent over the dark hero, solid once scrolled, hides on scroll down and returns on scroll up
  var header = document.querySelector('.site-header');
  var hero = document.querySelector('.phero, .hero');
  var lastY = window.scrollY;
  function onScroll() {
    var y = window.scrollY, h = hero ? hero.offsetHeight : 400;
    header.classList.toggle('solid', y > 40);
    if (y > h && y > lastY + 2) header.classList.add('away');
    else if (y < lastY - 2 || y <= h) header.classList.remove('away');
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Hero streak field at the logo angle (quieter on inner pages), brighter near the cursor
  var cv = document.getElementById('streaks');
  if (cv && hero) {
    var ctx = cv.getContext('2d'), W = 0, H = 0, streaks = [], mouse = { x: -9999, y: -9999 }, running = true;
    var TAN = Math.tan(19 * Math.PI / 180), density = +(cv.dataset.density || 14);
    var size = function () {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      streaks = [];
      for (var i = 0, n = Math.round(W / density); i < n; i++) streaks.push({ x: Math.random() * (W + H * TAN), y: Math.random() * H, len: 40 + Math.random() * 140, v: .25 + Math.random() * .8, a: .05 + Math.random() * .16 });
    };
    var frame = function () {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < streaks.length; i++) {
        var s = streaks[i];
        if (!reduce) { s.y -= s.v; s.x += s.v * TAN; if (s.y + s.len < 0) { s.y = H + Math.random() * 60; s.x = Math.random() * (W + H * TAN) - H * TAN * .2; } }
        var x2 = s.x + s.len * TAN, y2 = s.y - s.len, glow = Math.max(0, 1 - Math.hypot((s.x + x2) / 2 - mouse.x, (s.y + y2) / 2 - mouse.y) / 220);
        var g = ctx.createLinearGradient(s.x, s.y, x2, y2), col = glow > 0 ? '18,211,216' : '157,210,214';
        g.addColorStop(0, 'rgba(' + col + ',0)'); g.addColorStop(1, 'rgba(' + col + ',' + Math.min(1, s.a + glow * .8) + ')');
        ctx.strokeStyle = g; ctx.lineWidth = 1 + glow * 1.2; ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(x2, y2); ctx.stroke();
      }
      if (running && !reduce) requestAnimationFrame(frame);
    };
    size(); frame();
    window.addEventListener('resize', function () { size(); if (reduce) frame(); });
    hero.addEventListener('pointermove', function (e) { var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; if (reduce) frame(); });
    hero.addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; if (reduce) frame(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { var vis = es[0].isIntersecting; if (vis && !running) { running = true; if (!reduce) requestAnimationFrame(frame); } running = vis; }).observe(hero);
  }

  // Reveal + count-up, only for elements that start below the first screen
  if ('IntersectionObserver' in window && !reduce) {
    var fold = window.innerHeight;
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target; el.classList.remove('pre'); ro.unobserve(el);
        var c = el.querySelector('.count');
        if (c) { var to = +el.dataset.value, t0 = null; (function tick(t) { t0 = t0 || t; var k = Math.min(1, (t - t0) / 1400); c.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); })(performance.now()); }
      });
    }, { threshold: .15 });
    document.querySelectorAll('.rv').forEach(function (el) {
      if (el.getBoundingClientRect().top > fold) { el.classList.add('pre'); var c = el.querySelector('.count'); if (c) c.textContent = '0'; ro.observe(el); }
    });
  }

  // Accordions (FAQ style)
  document.querySelectorAll('.qa button').forEach(function (b) {
    b.addEventListener('click', function () { b.setAttribute('aria-expanded', b.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'); });
  });
})();
