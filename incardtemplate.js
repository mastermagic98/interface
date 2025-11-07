(function (){
    'use strict';

    // Plugin: InCard Buttons Display (ES5)
    // Опис: додає дві опції у Налаштування -> Інтерфейс:
    //  - показувати всі кнопки (текст + іконки)
    //  - показувати тільки іконки (текст приховано)
    // Сумісність: ES5, мінімальні втручання в DOM

    var PLUGIN_KEY = 'incard_buttons_display';

    try {
        Lampa.Lang.add({
            incard_buttons_display: { ru: 'Кнопки в картці: повні / іконки', uk: 'Кнопки в картці: повні / іконки', en: 'Card buttons: full / icons' },
            incard_buttons_show_all: { ru: 'Показувати всі кнопки', uk: 'Показувати всі кнопки', en: 'Show all buttons' },
            incard_buttons_icons_only: { ru: 'Показувати лише іконки', uk: 'Показувати лише іконки', en: 'Icons only' }
        });
    } catch (e) {}

    // CSS
    var css = '\n' +
        '/* InCard Buttons Display plugin styles */\n' +
        '.incard-buttons-wrap { display:flex; gap:12px; flex-wrap:nowrap; overflow:visible !important; white-space:nowrap; align-items:center; }\n' +
        '.incard-button { display:flex; align-items:center; gap:8px; min-width:70px; padding:6px 10px; pointer-events:auto; }\n' +
        '.incard-button .incard-label { display:inline-block; }\n' +
        '.incard-icons-only .incard-button .incard-label { display:none !important; }\n' +
        '.incard-icons-only .incard-button { min-width:44px !important; padding:6px; justify-content:center; }\n' +
        '.incard-force-visible .full-start__button, .incard-force-visible .incard-button { display:flex !important; visibility:visible !important; opacity:1 !important; }\n' +
        '[class*="hide"], .hide, .hidden { display:flex !important; opacity:1 !important; visibility:visible !important; }\n' +
        '\n';

    function addGlobalStyle() {
        var id = 'incard-buttons-display-style';
        if (document.getElementById(id)) return;
        var s = document.createElement('style');
        s.id = id;
        s.innerHTML = css;
        document.head.appendChild(s);
    }

    function getMode() {
        try { var v = Lampa.Storage.get(PLUGIN_KEY, 'all'); return v || 'all'; } catch (e) { return 'all'; }
    }
    function setMode(v) {
        try { Lampa.Storage.set(PLUGIN_KEY, v); } catch (e) {}
    }

    function addSetting() {
        try {
            Lampa.SettingsApi.addParam({
                component: 'interface',
                param: { name: PLUGIN_KEY, type: 'list', default: 'all' },
                field: {
                    name: Lampa.Lang.translate('incard_buttons_display'),
                    description: Lampa.Lang.translate('incard_buttons_show_all') + ' / ' + Lampa.Lang.translate('incard_buttons_icons_only'),
                    values: [
                        { id: 'all', name: Lampa.Lang.translate('incard_buttons_show_all') },
                        { id: 'icons', name: Lampa.Lang.translate('incard_buttons_icons_only') }
                    ]
                },
                onChange: function (v) {
                    setMode(v);
                    try {
                        var c = Lampa.Controller.get('full_start');
                        if (c) Lampa.Controller.toggle('full_start');
                    } catch (e) {}
                }
            });
        } catch (e) {}
    }

    function applyToCard(container) {
        if (!container) return;
        addGlobalStyle();

        var buttons = container.querySelector('.full-start-new__buttons') || container.querySelector('.full-start__buttons') || null;
        if (!buttons) return;

        if (buttons.className.indexOf('incard-buttons-wrap') === -1) buttons.className += ' incard-buttons-wrap';
        if (container.className.indexOf('incard-force-visible') === -1) container.className += ' incard-force-visible';

        var btns = buttons.querySelectorAll('.full-start__button, .full-start-new__button, .full-start-button, .full-start__action');
        if (!btns || !btns.length) btns = buttons.children;

        for (var i = 0; i < btns.length; i++) {
            var b = btns[i];
            if (!b) continue;
            if ((' ' + b.className + ' ').indexOf(' incard-button ') === -1) b.className = (b.className + ' incard-button').trim();

            var span = b.querySelector('.incard-label');
            if (!span) {
                var textSpan = b.querySelector('span');
                var created = false;
                if (textSpan) {
                    var txt = (textSpan.textContent || textSpan.innerText || '').trim();
                    if (txt) {
                        span = document.createElement('span');
                        span.className = 'incard-label';
                        span.textContent = txt;
                        textSpan.textContent = '';
                        b.appendChild(span);
                        created = true;
                    }
                }
                if (!created && !span) {
                    span = document.createElement('span');
                    span.className = 'incard-label';
                    span.textContent = '';
                    b.appendChild(span);
                }
            }

            b.className = b.className.replace(/\bhide\b/g, '');
            b.className = b.className.replace(/\bhidden\b/g, '');
            b.style.display = 'flex';
            b.style.visibility = 'visible';
            b.style.opacity = '1';
        }

        var mode = getMode();
        if (mode === 'icons') {
            if (container.className.indexOf('incard-icons-only') === -1) container.className += ' incard-icons-only';
        } else {
            container.className = container.className.replace(/\bincard-icons-only\b/g, '');
        }
    }

    function hookFullRender() {
        try {
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'render') {
                    setTimeout(function () {
                        var container = document.querySelector('.full-start-new') || document.querySelector('.full-start') || document.querySelector('[data-component="full_start"]');
                        if (container) applyToCard(container);
                    }, 60);

                    setTimeout(function () {
                        var container = document.querySelector('.full-start-new') || document.querySelector('.full-start') || document.querySelector('[data-component="full_start"]');
                        if (container) applyToCard(container);
                    }, 300);
                }
            });
        } catch (e) {}
    }

    function init() {
        addSetting();
        hookFullRender();
        setTimeout(function () {
            var container = document.querySelector('.full-start-new') || document.querySelector('.full-start') || document.querySelector('[data-component="full_start"]');
            if (container) applyToCard(container);
        }, 400);
    }

    if (window.appready) init();
    else {
        try {
            Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') init(); });
        } catch (e) { init(); }
    }

})();
