(function () {
    'use strict';

    /* ================== ЛОКАЛІЗАЦІЯ ================== */

    Lampa.Lang.add({
        params_ani_on: { ru: 'Включить', en: 'Enable', uk: 'Увімкнути' },
        params_ani_select: { ru: 'Выбор анимации', en: 'Select loading animation', uk: 'Вибір анімації завантаження' },
        params_ani_name: { ru: 'Анимация загрузки', en: 'Loading animation', uk: 'Анімація завантаження' },
        default_loader: { ru: 'По умолчанию', en: 'Default', uk: 'За замовчуванням' },
        custom_svg_input: { ru: 'Введи URL SVG', en: 'Enter SVG URL', uk: 'Введи URL SVG' },
        svg_input_hint: {
            ru: 'Используйте URL SVG, например https://example.com/loader.svg',
            en: 'Use SVG URL, for example https://example.com/loader.svg',
            uk: 'Використовуйте URL SVG, наприклад https://example.com/loader.svg'
        }
    });

    /* ================== УТИЛІТИ ================== */

    function getMainColorFromCSS() {
        return getComputedStyle(document.documentElement)
            .getPropertyValue('--main-color')
            .trim() || '#ffffff';
    }

    function getLoaderColor() {
        var enabled = Lampa.Storage.get('color_plugin_enabled', 'false') === 'true';
        return enabled ? 'var(--main-color)' : '#ffffff';
    }

    function getDefaultSvg() {
        var svg =
            '<?xml version="1.0" encoding="utf-8"?>' +
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
            '<circle cx="50" cy="50" r="35" fill="none" stroke="#ffffff" stroke-width="5">' +
            '<animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" from="0 50 50" to="360 50 50"/>' +
            '</circle>' +
            '</svg>';

        return 'data:image/svg+xml,' + encodeURIComponent(svg);
    }

    function isValidSvgUrl(url) {
        return /^https?:\/\/.+\.svg(\?.*)?$/.test(url);
    }

    /* ================== CSS ГЕНЕРАЦІЯ ================== */

    function buildLoaderCSS(svgUrl) {
        var color = getLoaderColor();
        var url = svgUrl.replace(/'/g, "\\'");

        return `
        body .ani-custom {
            background-color: ${color} !important;
            -webkit-mask-image: url('${url}') !important;
            mask-image: url('${url}') !important;
            -webkit-mask-repeat: no-repeat !important;
            mask-repeat: no-repeat !important;
            -webkit-mask-position: 50% 50% !important;
            mask-position: 50% 50% !important;
            -webkit-mask-size: contain !important;
            mask-size: contain !important;
        }

        body .activity__loader { display: none !important; }
        body .activity__loader.active.ani-custom { display: block !important; }

        body .player-video__loader:not(.ani-custom),
        body .loading-layer__ico:not(.ani-custom) {
            display: none !important;
        }
        `;
    }

    function injectStyle(id, css) {
        removeStyle(id);
        var style = document.createElement('style');
        style.id = id;
        style.textContent = css;
        document.head.appendChild(style);
    }

    function removeStyle(id) {
        var el = document.getElementById(id);
        if (el) el.remove();
    }

    /* ================== ЛОАДЕР ================== */

    function applyCustomLoader(svgUrl) {
        if (!svgUrl) return;

        injectStyle('ani-loader-style', buildLoaderCSS(svgUrl));

        document.querySelectorAll(
            '.activity__loader,' +
            '.player-video__loader,' +
            '.lampac-balanser-loader,' +
            '.loading-layer__ico,' +
            '.player-video__youtube-needclick > div,' +
            '.modal-loading'
        ).forEach(function (el) {
            el.classList.add('ani-custom');
        });
    }

    function resetLoader() {
        removeStyle('ani-loader-style');
        removeStyle('ani-loader-preview');

        document.querySelectorAll('.ani-custom').forEach(function (el) {
            el.classList.remove('ani-custom');
        });
    }

    /* ================== PREVIEW ================== */

    function renderPreview(svgUrl) {
        var url = svgUrl || getDefaultSvg();
        var css = `
        .settings-param[data-name="select_ani_mation"] .activity__loader_prv {
            width: 23px;
            height: 24px;
            display: inline-block;
            background-color: ${getLoaderColor()} !important;
            -webkit-mask-image: url('${url}');
            mask-image: url('${url}');
            -webkit-mask-repeat: no-repeat;
            mask-repeat: no-repeat;
            -webkit-mask-position: 50% 50%;
            mask-position: 50% 50%;
            -webkit-mask-size: contain;
            mask-size: contain;
        }`;
        injectStyle('ani-loader-preview', css);
    }

    /* ================== SETTINGS ================== */

    function initSettings() {
        Lampa.SettingsApi.addComponent({
            component: 'ani_loader',
            name: Lampa.Lang.translate('params_ani_name'),
            icon: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/></svg>'
        });

        Lampa.SettingsApi.addParam({
            component: 'ani_loader',
            param: { name: 'ani_active', type: 'trigger', default: false },
            field: { name: Lampa.Lang.translate('params_ani_on') },
            onChange: function (v) {
                Lampa.Storage.set('ani_active', v === 'true');
                updateState();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'ani_loader',
            param: { name: 'select_ani_mation', type: 'button' },
            field: {
                name:
                    '<div class="settings-folder__icon">' +
                    '<div class="activity__loader_prv"></div></div>' +
                    Lampa.Lang.translate('params_ani_select')
            },
            onRender: function (item) {
                item.toggle(Lampa.Storage.get('ani_active'));
                renderPreview(Lampa.Storage.get('ani_load'));
            },
            onChange: openPicker
        });
    }

    function openPicker() {
        var inputValue = Lampa.Storage.get('ani_load_custom_svg', '');

        Lampa.Input.edit(
            {
                name: 'ani_load_custom_svg',
                value: inputValue,
                placeholder: 'https://example.com/loader.svg'
            },
            function (value) {
                if (!isValidSvgUrl(value)) {
                    Lampa.Noty.show(Lampa.Lang.translate('svg_input_hint'));
                    return;
                }
                Lampa.Storage.set('ani_load_custom_svg', value);
                Lampa.Storage.set('ani_load', value);
                updateState();
            }
        );
    }

    /* ================== OBSERVER ================== */

    function initObserver() {
        var observer = new MutationObserver(function () {
            updateState();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    /* ================== STATE ================== */

    function updateState() {
        if (Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load')) {
            applyCustomLoader(Lampa.Storage.get('ani_load'));
            renderPreview(Lampa.Storage.get('ani_load'));
        } else {
            resetLoader();
            renderPreview(null);
        }
    }

    /* ================== INIT ================== */

    function init() {
        initSettings();
        initObserver();
        updateState();
    }

    if (window.appready) {
        init();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') init();
        });
    }

    Lampa.Storage.listener.follow('change', function (e) {
        if (e.name === 'color_plugin_enabled') {
            updateState();
        }
    });

})();
