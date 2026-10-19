/* Universal image lightbox for portfolio case pages */
(function () {
  if (document.getElementById('portfolio-lightbox-css')) return;
  var s = document.createElement('style');
  s.id = 'portfolio-lightbox-css';
  s.textContent = ['.zoom-trigger{cursor:zoom-in;border:0;padding:0;background:transparent;display:block;width:100%;max-width:100%}','img.zoom-trigger,button.zoom-trigger img{cursor:zoom-in;transition:opacity .2s ease}','img.zoom-trigger:hover,button.zoom-trigger:hover img{opacity:.92}','.lightbox{margin:auto!important;border:none!important;padding:0!important;max-width:min(96vw,1100px)!important;max-height:92vh!important;width:fit-content!important;background:transparent!important;position:fixed!important;inset:0!important;z-index:10000!important}','.lightbox[open]{display:flex!important;align-items:center!important;justify-content:center!important}','.lightbox::backdrop{background:rgba(12,12,14,.92)!important}','.lightbox-inner{display:flex!important;align-items:center!important;justify-content:center!important;background:#111!important;border-radius:12px!important;max-width:min(96vw,1100px)!important;max-height:min(90vh,90dvh)!important;margin:auto!important;position:relative!important;padding:2.5rem 1rem 1rem;box-sizing:border-box!important}','.lightbox-inner img{width:auto!important;height:auto!important;max-width:min(94vw,1080px)!important;max-height:min(82vh,82dvh)!important;object-fit:contain!important;object-position:center!important;margin:0 auto!important;display:block!important}','.lightbox-close{position:absolute!important;top:.5rem!important;right:.5rem!important;z-index:5!important;min-height:44px!important;min-width:44px!important;border-radius:999px!important;border:1px solid rgba(255,255,255,.25)!important;background:rgba(0,0,0,.55)!important;color:#fff!important;font-size:.85rem!important;font-weight:700!important;cursor:pointer!important;font-family:inherit!important}','@media(max-width:720px){.lightbox[open]{width:100%!important;height:100%!important;max-height:100vh!important;max-height:100dvh!important}.lightbox-inner{width:100%!important;height:100%!important;max-height:100%!important;border-radius:0!important;padding:3rem .75rem 1.25rem}.lightbox-inner img{max-width:calc(100vw - 1.5rem)!important;max-height:calc(100dvh - 5.5rem)!important;max-height:calc(100vh - 5.5rem)!important}}'].join('');
  document.head.appendChild(s);
})();

(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  function absUrl(u) {
    if (!u) return '';
    try { return new URL(u, location.href).href; } catch (e) { return u; }
  }
  function getSrc(el) {
    if (!el) return '';
    if (el.tagName === 'IMG') return el.currentSrc || el.src || '';
    var img = el.querySelector && el.querySelector('img');
    return img ? (img.currentSrc || img.src || '') : '';
  }
  function openLightbox(src, alt) {
    if (!src) return;
    var existing = document.getElementById('portfolio-lightbox');
    if (existing) existing.remove();
    var dlg = document.createElement('dialog');
    dlg.id = 'portfolio-lightbox';
    dlg.className = 'lightbox';
    dlg.setAttribute('aria-label', 'Image preview');
    var inner = document.createElement('div');
    inner.className = 'lightbox-inner';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lightbox-close';
    btn.setAttribute('aria-label', 'Close');
    btn.textContent = 'Close';
    var img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    img.decoding = 'async';
    inner.appendChild(btn);
    inner.appendChild(img);
    dlg.appendChild(inner);
    document.body.appendChild(dlg);
    function close() {
      if (dlg.open) dlg.close();
      dlg.remove();
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) {
      if (e.key === 'Escape') close();
    }
    btn.addEventListener('click', close);
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg) close();
    });
    document.addEventListener('keydown', onKey);
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
  }
  ready(function () {
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (!t) return;
      var trigger = t.closest && t.closest('.zoom-trigger, img.zoom-trigger, [data-zoom]');
      if (!trigger) return;
      e.preventDefault();
      var src = trigger.getAttribute('data-full') || getSrc(trigger);
      var alt = '';
      if (trigger.tagName === 'IMG') alt = trigger.alt || '';
      else {
        var im = trigger.querySelector && trigger.querySelector('img');
        if (im) alt = im.alt || '';
      }
      openLightbox(absUrl(src), alt);
    });
  });
})();
