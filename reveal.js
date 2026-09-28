(function () {
  if (window.__frReveal) return; window.__frReveal = true;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var css = document.createElement('style');
  css.textContent = '.rv{opacity:0;transform:translateY(28px);transition:opacity 1s cubic-bezier(.2,.7,.2,1),transform 1s cubic-bezier(.2,.7,.2,1);transition-delay:var(--rv-d,0ms)}' +
    '.rv.rv-in{opacity:1;transform:none}';
  if (!reduced) document.head.appendChild(css);
  if (reduced || !('IntersectionObserver' in window)) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('rv-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  var BLOCKS = 'main a[href*="Articulo"], main div[style*="border-radius: 24px"][style*="background: rgb(247, 243, 236)"], main aside, main form, main iframe, main [data-fr-map], main [data-car], main div[style*="aspect-ratio"], main section[style*="background: rgb(30, 26, 21)"] > div > div, footer > div > div, footer > div';
  var LEAVES = 'main h1, main h2, main h3, main p, main nav, main img, main [role="img"], main section > div > div > a, main div[style*="display: flex"] > a[style*="border-radius: 999px"]';

  function skip(el) {
    return el.closest('#inicio') || el.closest('[role="dialog"]') || el.closest('header') || el.closest('.rv') && el.closest('.rv') !== el;
  }
  function tag(el) {
    if (el.classList.contains('rv') || skip(el)) return;
    var r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) return;
    var p = el.parentElement, i = 0;
    if (p) { var sib = p.querySelectorAll(':scope > .rv'); i = sib.length; }
    el.style.setProperty('--rv-d', Math.min(i, 5) * 80 + 'ms');
    el.classList.add('rv');
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('rv-in'); }); });
    else io.observe(el);
  }
  function scan() {
    document.querySelectorAll(BLOCKS).forEach(tag);
    document.querySelectorAll(LEAVES).forEach(tag);
  }
  var t;
  function later() { clearTimeout(t); t = setTimeout(scan, 120); }
  function start() {
    scan();
    new MutationObserver(later).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'complete') setTimeout(start, 300);
  else window.addEventListener('load', function () { setTimeout(start, 300); });
})();
