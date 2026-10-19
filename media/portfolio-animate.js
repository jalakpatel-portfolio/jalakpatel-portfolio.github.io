/**
 * Portfolio scroll animations + site-wide ambient glow.
 * - Injects media/global-ambient.css on every page that loads this script
 * - Scroll-linked gradient color shift (phone + desktop)
 * - Count-up, fade-up, chart bars
 * - Carousel loop for [data-output-carousel]
 * Respects prefers-reduced-motion.
 */
(function () {
  try {
    var scriptEl = document.currentScript || document.querySelector('script[src*="portfolio-animate.js"]');
    if (scriptEl && scriptEl.src && !document.querySelector('link[data-global-ambient]')) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = scriptEl.src.replace(/portfolio-animate\.js(\?.*)?$/, 'global-ambient.css');
      link.setAttribute('data-global-ambient', '1');
      document.head.appendChild(link);
    }
  } catch (e) {}

  (function () {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var root = document.documentElement;
    var stops = [
      { a: [232, 90, 42], b: [157, 58, 114], c: [31, 92, 107] },
      { a: [194, 65, 12], b: [120, 70, 160], c: [20, 110, 120] },
      { a: [180, 80, 40], b: [100, 60, 140], c: [40, 90, 100] }
    ];
    function lerp(a, b, t) { return Math.round(a + (b - a) * t); }
    function mix(c1, c2, t) {
      return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
    }
    var ticking = false;
    function update() {
      ticking = false;
      var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      var p = Math.min(1, Math.max(0, window.scrollY / max));
      var seg = p < 0.5 ? 0 : 1;
      var t = p < 0.5 ? p * 2 : (p - 0.5) * 2;
      var from = stops[seg], to = stops[seg + 1];
      root.style.setProperty('--glow-a', mix(from.a, to.a, t).join(', '));
      root.style.setProperty('--glow-b', mix(from.b, to.b, t).join(', '));
      root.style.setProperty('--glow-c', mix(from.c, to.c, t).join(', '));
      root.style.setProperty('--glow-s', String(0.11 + p * 0.07));
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  })();

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function countUp(el) {
    if (!el || el.dataset.counted) return;
    el.dataset.counted = '1';
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var decimals = (String(target).split('.')[1] || '').length;
    if (reduce) {
      el.textContent = prefix + (decimals ? target.toFixed(decimals) : String(Math.round(target))) + suffix;
      return;
    }
    var start = performance.now();
    var dur = 900;
    function frame(now) {
      var t = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - t, 3);
      var val = target * eased;
      el.textContent = prefix + (decimals ? val.toFixed(decimals) : String(Math.round(val))) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function markIn(el) {
    el.classList.add('is-in');
    el.classList.add('is-inview');
    el.querySelectorAll('.metric-count[data-count]').forEach(countUp);
    if (el.classList.contains('metric-count') && el.hasAttribute('data-count')) countUp(el);
  }

  document.querySelectorAll('.fade-up').forEach(function (el, i) {
    el.style.transitionDelay = reduce ? '0s' : Math.min(i * 0.07, 0.42) + 's';
  });

  var fadeObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { markIn(e.target); fadeObs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.fade-up').forEach(function (el) { fadeObs.observe(el); });

  var chartObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        markIn(e.target);
        e.target.querySelectorAll('.bar-fill').forEach(function (bar) {
          var w = bar.style.getPropertyValue('--w') || bar.getAttribute('data-w') || bar.dataset.w;
          if (w && !String(w).includes('%') && !isNaN(parseFloat(w))) w = w + '%';
          if (w) bar.style.setProperty('--w', w);
        });
        chartObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.chart-card, .bars, [data-chart-animate]').forEach(function (el) {
    chartObs.observe(el);
  });

  /* Carousel loop for any [data-output-carousel] */
  document.querySelectorAll('[data-output-carousel]').forEach(function (root) {
    var track = root.querySelector('.output-carousel-track');
    var prev = root.querySelector('.carousel-btn.prev');
    var next = root.querySelector('.carousel-btn.next');
    if (!track) return;
    function step() { return Math.min(track.clientWidth * 0.85, 280); }
    function go(dir) {
      var max = track.scrollWidth - track.clientWidth;
      var nextPos = track.scrollLeft + dir * step();
      if (nextPos > max - 4) track.scrollTo({ left: 0, behavior: 'smooth' });
      else if (nextPos < 4 && dir < 0) track.scrollTo({ left: max, behavior: 'smooth' });
      else track.scrollBy({ left: dir * step(), behavior: 'smooth' });
    }
    if (prev) prev.addEventListener('click', function () { go(-1); });
    if (next) next.addEventListener('click', function () { go(1); });
  });
})();


/* Theme-preserving micro-interactions injected once for all case pages */
(function () {
  if (document.getElementById('micro-polish-css')) return;
  var s = document.createElement('style');
  s.id = 'micro-polish-css';
  s.textContent = [
    '.page-nav .primary:active,.nav-cta:active,.btn-nav:active,.btn-primary:active,a.btn-primary:active{transform:scale(0.98)}',
    '.page-nav .primary,.nav-cta,.btn-nav,.btn-primary,a.btn-primary{transition:filter .2s ease,transform .15s ease,box-shadow .2s ease}',
    '.case-teaser,.next-card,.channel-card,.output-card{transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease}',
    '.case-teaser:hover,.next-card:hover,.channel-card:hover{transform:translateY(-3px);box-shadow:0 14px 36px rgba(20,20,20,.09)}',
    '.output-card:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(20,20,20,.08)}'
  ].join('');
  document.head.appendChild(s);
})();
