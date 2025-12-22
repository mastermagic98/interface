(function () {
  'use strict';

  var ID = 'lampa-garland-plugin-root';
  var STYLE_ID = 'lampa-garland-plugin-style';
  if (document.getElementById(ID)) return;

  // ===== Platform detect =====
  function ua() { return (navigator.userAgent || ''); }

  function isTizen() {
    try { if (window.Lampa && Lampa.Platform && Lampa.Platform.is && Lampa.Platform.is('tizen')) return true; } catch (e) {}
    return /Tizen/i.test(ua());
  }

  function isAndroid() {
    try { if (window.Lampa && Lampa.Platform && Lampa.Platform.is && Lampa.Platform.is('android')) return true; } catch (e) {}
    return /Android/i.test(ua());
  }

  function isTvDevice() {
    return /SMART-TV|Tizen|Web0S|NetCast|TV|AndroidTV|BRAVIA|AFT|HbbTV/i.test(ua());
  }

  function isMobileDevice() {
    // мобильный режим только для телефонов/планшетов, НЕ для Android TV/SmartTV
    var small = (Math.min(window.innerWidth || 9999, window.innerHeight || 9999) <= 900);
    var mobileUA = /Mobile|iPhone|iPad|iPod|Android/i.test(ua());
    return small && mobileUA && !isTvDevice();
  }

  var TIZEN = isTizen();
  var ANDROID = isAndroid();
  var MOBILE = isMobileDevice();

  // ===== CSS =====
  // Учтены твои правки:
  // OFF: 1%-4% opacity 0.08, без свечения
  // speed: dur/delay в JS (ниже)
  var css =
    '#' + ID + '{' +
      'position:fixed;left:0;top:0;width:100%;height:130px;' +
      'pointer-events:none;z-index:99999;transform:translateZ(0);' +
      'opacity:1;transition:opacity .18s ease;' +
    '}' +
    '#' + ID + '.garland-hidden{opacity:0;}' +
    '#' + ID + ' .garland-wrap{position:absolute;left:0;top:0;width:100%;height:130px;}' +

    // Нить
    '#' + ID + ' .garland-wire{' +
      'position:absolute;left:-6%;width:112%;top:72px;height:40px;' +
      'border-top:2px solid rgba(0,0,0,.45);' +
      'border-radius:0 0 85% 85%;' +
      'filter:drop-shadow(0 2px 2px rgba(0,0,0,.35));' +
      'opacity:.95;' +
    '}' +

    // Лампочка
    '#' + ID + ' .garland-bulb{' +
      'position:absolute;width:14px;height:18px;' +
      'border-radius:50% 50% 45% 45%;' +
      'transform:translateX(-50%);' +
      'background:var(--c,#ff3b30);' +
      'box-shadow:0 0 6px var(--c,#ff3b30),0 0 14px var(--c,#ff3b30);' +
      'opacity:.95;' +
      'animation-name:garlandBlink;' +
      'animation-duration:var(--t,2.6s);' +
      'animation-delay:var(--d,0s);' +
      'animation-iteration-count:infinite;' +
      'animation-timing-function:ease-in-out;' +
      'will-change:opacity,transform;' +
    '}' +

    '#' + ID + ' .garland-bulb::after{' +
      'content:"";position:absolute;left:50%;top:-6px;width:12px;height:7px;' +
      'transform:translateX(-50%);border-radius:4px 4px 2px 2px;' +
      'background:rgba(20,20,20,.85);box-shadow:0 1px 0 rgba(255,255,255,.12) inset;' +
    '}' +
    '#' + ID + ' .garland-bulb::before{' +
      'content:"";position:absolute;left:50%;top:-14px;width:2px;height:12px;' +
      'transform:translateX(-50%);background:rgba(0,0,0,.65);' +
    '}' +

    // Твой OFF (реальное выключение)
    '@keyframes garlandBlink{' +
      '0%{opacity:.95;filter:brightness(1) saturate(1);box-shadow:0 0 6px var(--c,#ff3b30),0 0 14px var(--c,#ff3b30);}' +
      '1%,4%{opacity:0.08;filter:brightness(.22) saturate(.75);box-shadow:none;}' +
      '10%,38%{opacity:.95;filter:brightness(1) saturate(1);box-shadow:0 0 6px var(--c,#ff3b30),0 0 14px var(--c,#ff3b30);}' +
      '45%{opacity:.55;filter:brightness(.6) saturate(.9);box-shadow:0 0 3px var(--c,#ff3b30);}' +
      '60%{opacity:.85;filter:brightness(.9) saturate(.95);box-shadow:0 0 5px var(--c,#ff3b30),0 0 10px var(--c,#ff3b30);}' +
      '100%{opacity:.95;filter:brightness(1) saturate(1);box-shadow:0 0 6px var(--c,#ff3b30),0 0 14px var(--c,#ff3b30);}' +
    '}' +

    // Tizen: легче (без filter)
    '@keyframes garlandBlinkTizen{' +
      '0%{opacity:.95;box-shadow:0 0 5px var(--c,#ff3b30),0 0 10px var(--c,#ff3b30);}' +
      '1%,4%{opacity:0.08;box-shadow:none;}' +
      '10%,38%{opacity:.95;box-shadow:0 0 5px var(--c,#ff3b30),0 0 10px var(--c,#ff3b30);}' +
      '45%{opacity:.55;box-shadow:0 0 3px var(--c,#ff3b30);}' +
      '60%{opacity:.85;box-shadow:0 0 4px var(--c,#ff3b30),0 0 8px var(--c,#ff3b30);}' +
      '100%{opacity:.95;box-shadow:0 0 5px var(--c,#ff3b30),0 0 10px var(--c,#ff3b30);}' +
    '}' +
    '#' + ID + '.is-tizen .garland-wire{filter:none;border-top-color:rgba(0,0,0,.38);}' +
    '#' + ID + '.is-tizen .garland-bulb{animation-name:garlandBlinkTizen;box-shadow:0 0 5px var(--c,#ff3b30),0 0 10px var(--c,#ff3b30);}' +

    // ===== MOBILE FIX =====
    // Главное: ограничиваем область гирлянды по высоте и прячем "свисание" (overflow:hidden)
    '#' + ID + '.is-mobile{' +
      'height:76px;' +
      'overflow:hidden;' +
      'padding-top: env(safe-area-inset-top);' +
    '}' +
    '#' + ID + '.is-mobile .garland-wrap{height:76px;}' +
    '#' + ID + '.is-mobile .garland-wire{' +
      'top:36px;height:22px;' +
      'border-radius:0 0 80% 80%;' +
      'filter:none;' +
    '}' +
    '#' + ID + '.is-mobile .garland-bulb{' +
      'width:10px;height:12px;' +
      'box-shadow:0 0 4px var(--c,#ff3b30),0 0 8px var(--c,#ff3b30);' +
    '}' +
    '#' + ID + '.is-mobile .garland-bulb::before{top:-10px;height:9px;}' +
    '#' + ID + '.is-mobile .garland-bulb::after{top:-5px;width:10px;height:6px;}' +

    '@media (prefers-reduced-motion: reduce){' +
      '#' + ID + ' .garland-bulb{animation:none !important;}' +
    '}';

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var st = document.createElement('style');
    st.id = STYLE_ID;
    st.type = 'text/css';
    st.appendChild(document.createTextNode(css));
    document.head.appendChild(st);
  }

  function createRoot() {
    var root = document.createElement('div');
    root.id = ID;
    if (TIZEN) root.classList.add('is-tizen');
    if (MOBILE) root.classList.add('is-mobile');
    root.innerHTML = '<div class="garland-wrap"><div class="garland-wire"></div></div>';
    document.body.appendChild(root);
    return root;
  }

  var COLORS = ['#ff3b30', '#ffcc00', '#34c759', '#0a84ff', '#bf5af2', '#ff9f0a', '#64d2ff'];

  function render(root) {
    var wrap = root.querySelector('.garland-wrap');
    if (!wrap) return;

    var olds = wrap.querySelectorAll('.garland-bulb');
    for (var k = 0; k < olds.length; k++) olds[k].remove();

    var w = Math.max(320, window.innerWidth || 1920);

    // плотность ламп
    var div;
    var maxBulbs;
    if (MOBILE) { div = 44; maxBulbs = 32; }
    else if (TIZEN) { div = 74; maxBulbs = 42; }
    else if (ANDROID && isTvDevice()) { div = 60; maxBulbs = 56; }
    else { div = 52; maxBulbs = 64; }

    var bulbCount = Math.floor(w / div);
    if (bulbCount < 14) bulbCount = 14;
    if (bulbCount > maxBulbs) bulbCount = maxBulbs;

    var spacing = w / (bulbCount - 1);

    // высота нити должна совпадать с CSS (desktop 72px, mobile 36px)
    var wireY = MOBILE ? 36 : 72;
    var sagAmp = MOBILE ? 3 : (TIZEN ? 8 : 10);
    var hang = MOBILE ? 2 : 6;

    for (var i = 0; i < bulbCount; i++) {
      var x = i * spacing;
      var t = i / (bulbCount - 1);
      var sag = Math.sin(t * Math.PI) * sagAmp;
      var y = wireY + sag + hang;

      var bulb = document.createElement('div');
      bulb.className = 'garland-bulb';

      var color = COLORS[i % COLORS.length];

      // ТВОИ значения скорости (чуть медленнее)
      var dur = (2600 + (i % 7) * 220) + 'ms';
      var delay = ((i % 9) * 140) + 'ms';

      bulb.style.left = x + 'px';
      bulb.style.top = y + 'px';
      bulb.style.setProperty('--c', color);
      bulb.style.setProperty('--t', dur);
      bulb.style.setProperty('--d', delay);

      if (!MOBILE && i % 5 === 0) bulb.style.transform = 'translateX(-50%) scale(1.06)';

      wrap.appendChild(bulb);
    }
  }

  // ===== Overlay / Player detection (как в снеге, без “слишком общих” селекторов) =====

  function isElVisible(el) {
    if (!el) return false;
    try {
      var r = el.getBoundingClientRect();
      if (!r || r.width < 10 || r.height < 10) return false;

      var Wv = window.innerWidth || 1;
      var Hv = window.innerHeight || 1;
      if (r.right <= 0 || r.bottom <= 0 || r.left >= Wv || r.top >= Hv) return false;

      var cs = window.getComputedStyle ? getComputedStyle(el) : null;
      if (cs) {
        if (cs.display === 'none' || cs.visibility === 'hidden') return false;
        if (Number(cs.opacity) === 0) return false;
      }
      return true;
    } catch (e) { return false; }
  }

  function rectAreaRatio(r) {
    var Wv = window.innerWidth || 1;
    var Hv = window.innerHeight || 1;
    var x1 = Math.max(0, r.left);
    var y1 = Math.max(0, r.top);
    var x2 = Math.min(Wv, r.right);
    var y2 = Math.min(Hv, r.bottom);
    var ww = Math.max(0, x2 - x1);
    var hh = Math.max(0, y2 - y1);
    return (ww * hh) / (Wv * Hv);
  }

  function coversPoint(el) {
    try {
      var Wv = window.innerWidth || 1;
      var Hv = window.innerHeight || 1;
      var r = el.getBoundingClientRect();
      var px = Math.min(Wv - 2, Math.max(2, (r.left + r.right) / 2));
      var py = Math.min(Hv - 2, Math.max(2, (r.top + r.bottom) / 2));
      var topEl = document.elementFromPoint(px, py);
      if (!topEl) return false;
      return el === topEl || (el.contains && el.contains(topEl));
    } catch (e) { return false; }
  }

  function detectOverlayOpen() {
    // точечно: настройки/диалоги/selectbox (сортировка/фильтр/источник)
    var sels = [
      '.settings', '.settings__layer', '.settings-window',
      '.modal', '.dialog', '.notification',
      '[role="dialog"]', '[aria-modal="true"]',
      '.selectbox', '.selectbox__layer', '.selectbox__content', '.selectbox__body'
    ];

    for (var i = 0; i < sels.length; i++) {
      var el = null;
      try { el = document.querySelector(sels[i]); } catch (e1) {}
      if (!el) continue;
      if (!isElVisible(el)) continue;

      var r = el.getBoundingClientRect();
      var ratio = rectAreaRatio(r);
      if (ratio < 0.12) continue;       // достаточно крупное
      if (!coversPoint(el)) continue;   // реально сверху

      var cs = getComputedStyle(el);
      if (cs.position !== 'fixed' && cs.position !== 'absolute') continue;
      if (cs.pointerEvents === 'none') continue;

      return true;
    }
    return false;
  }

  function detectPlayerOpen() {
    var h = (location.hash || '').toLowerCase();
    if (h.indexOf('player') !== -1 || h.indexOf('video') !== -1) return true;

    // большое VIDEO
    var videos = document.getElementsByTagName('video');
    if (videos && videos.length) {
      for (var v = 0; v < videos.length; v++) {
        var vid = videos[v];
        if (!isElVisible(vid)) continue;
        var rr = vid.getBoundingClientRect();
        if (rectAreaRatio(rr) >= 0.25) return true;
      }
    }

    // fallback по контейнеру плеера (если video внутри хитро спрятан)
    var sels = ['.player', '.player-panel', '.player__panel', '.player__controls', '.video-player', '.lampa-player'];
    for (var i = 0; i < sels.length; i++) {
      var el = null;
      try { el = document.querySelector(sels[i]); } catch (e2) {}
      if (!el) continue;
      if (!isElVisible(el)) continue;
      var r = el.getBoundingClientRect();
      if (rectAreaRatio(r) >= 0.15 && coversPoint(el)) return true;
    }

    return false;
  }

  function syncVisibility(root) {
    var h = (location.hash || '').toLowerCase();
    var byHashSettings = (h.indexOf('settings') !== -1 || h.indexOf('настройк') !== -1);

    var overlay = detectOverlayOpen();
    var player = detectPlayerOpen(); // в плеере прячем всегда

    root.classList.toggle('garland-hidden', byHashSettings || overlay || player);
  }

  function init() {
    injectStyle();
    var root = createRoot();

    render(root);
    syncVisibility(root);

    var raf = 0;
    window.addEventListener('resize', function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        // пересчёт MOBILE при повороте экрана
        var nowMobile = isMobileDevice();
        if (nowMobile !== MOBILE) {
          MOBILE = nowMobile;
          root.classList.toggle('is-mobile', MOBILE);
        }
        render(root);
        syncVisibility(root);
      });
    });

    window.addEventListener('hashchange', function () { syncVisibility(root); });

    // мониторинг (как в снеге)
    var last = null;
    setInterval(function () {
      var now = (detectOverlayOpen() || detectPlayerOpen()) ? 1 : 0;
      if (now !== last) {
        last = now;
        syncVisibility(root);
      }
    }, 450);

    var raf2 = 0;
    var mo = new MutationObserver(function () {
      cancelAnimationFrame(raf2);
      raf2 = requestAnimationFrame(function () { syncVisibility(root); });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    setTimeout(function () { syncVisibility(root); }, 200);
    setTimeout(function () { syncVisibility(root); }, 900);
  }

  function startWhenReady() {
    if (document.body && document.head) init();
    else document.addEventListener('DOMContentLoaded', init, { once: true });
  }

  if (window.Lampa && window.Lampa.Listener && typeof window.Lampa.Listener.follow === 'function') {
    window.Lampa.Listener.follow('app', function (e) {
      if (e && e.type === 'ready') startWhenReady();
    });
    setTimeout(startWhenReady, 1200);
  } else {
    startWhenReady();
  }
})();
