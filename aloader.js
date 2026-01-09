(function () {
    'use strict';

    /* ======================================================
     *  LANG
     * ====================================================== */
    Lampa.Lang.add({
        params_ani_on: { ru: 'Включить', en: 'Enable', uk: 'Увімкнути' },
        params_ani_select: { ru: 'Выбор анимации', en: 'Select loading animation', uk: 'Вибір анімації завантаження' },
        params_ani_name: { ru: 'Анимация загрузки', en: 'Loading animation', uk: 'Анімація завантаження' },
        params_ani_desc: { ru: 'Изменяет вид анимации загрузки', en: 'Changes the loading animation appearance', uk: 'Змінює вигляд анімації завантаження' },
        default_loader: { ru: 'По умолчанию', en: 'Default', uk: 'За замовчуванням' },
        custom_svg_input: { ru: 'Введи URL SVG', en: 'Enter SVG URL', uk: 'Введи URL SVG' },
        svg_input_hint: {
            ru: 'Используйте URL SVG, например https://example.com/loader.svg',
            en: 'Use SVG URL, for example https://example.com/loader.svg',
            uk: 'Використовуйте URL SVG, наприклад https://example.com/loader.svg'
        }
    });

    /* ======================================================
     *  CSS (один раз)
     * ====================================================== */
    (function injectCss() {
        if (document.getElementById('lampac-ani-css')) return;

        var css = `
        .lampac-setting-row{
            display:flex;
            align-items:center;
        }

        .lampac-setting-icon{
            width:32px;
            height:32px;
            min-width:32px;
            min-height:32px;
            max-width:32px;
            max-height:32px;
            margin-right:10px;
            flex-shrink:0;
            display:flex;
            align-items:center;
            justify-content:center;
        }

        .lampac-setting-icon svg{
            width:32px;
            height:32px;
            display:block;
        }

        .lampac-setting-icon .activity__loader_prv{
            width:100%;
            height:100%;
            background-repeat:no-repeat;
            background-position:center;
            background-size:contain;
        }
        `;
        $('<style id="lampac-ani-css">' + css + '</style>').appendTo('head');
    })();

    /* ======================================================
     *  SVG ICON (16x16)
     * ====================================================== */
    function aniIconSvg() {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="8" cy="8" r="1.5"/>
            <g>
                <circle cx="4" cy="8" r="1.5"/>
                <circle cx="12" cy="8" r="1.5"/>
                <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 8 8"
                    to="360 8 8"
                    dur="1s"
                    repeatCount="indefinite"/>
            </g>
        </svg>`;
    }

    /* ======================================================
     *  COLOR / FILTER UTILS
     * ====================================================== */
    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        return {
            r: parseInt(hex.substr(0, 2), 16),
            g: parseInt(hex.substr(2, 2), 16),
            b: parseInt(hex.substr(4, 2), 16)
        };
    }

    function getFilterRgb(color) {
        if (color.toLowerCase() === '#353535') return { r: 255, g: 255, b: 255 };
        return hexToRgb(color);
    }

    function svgHasOwnFilter(url) {
        if (!url || url.indexOf('data:image/svg+xml') !== 0) return false;
        try {
            var decoded = decodeURIComponent(url.split(',')[1]);
            return /<filter|feColorMatrix|feGaussianBlur/.test(decoded);
        } catch (e) {
            return false;
        }
    }

    function defaultLoader() {
        var svg =
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
            '<circle cx="50" cy="50" r="35" fill="none" stroke="#fff" stroke-width="5" ' +
            'stroke-dasharray="165 57">' +
            '<animateTransform attributeName="transform" type="rotate" dur="1s" ' +
            'repeatCount="indefinite" from="0 50 50" to="360 50 50"/>' +
            '</circle></svg>';

        return 'data:image/svg+xml,' + encodeURIComponent(svg);
    }

    /* ======================================================
     *  APPLY LOADER
     * ====================================================== */
    function applyLoader(url) {
        $('#aniload-style').remove();

        if (!url || url === './img/loader.svg') url = defaultLoader();

        var filter = '';
        if (!svgHasOwnFilter(url)) {
            var rgb = getFilterRgb(Lampa.Storage.get('color_plugin_main_color', '#fff'));
            filter =
                'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E' +
                '%3Cfilter id=%22c%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' +
                (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) +
                ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#c")';
        }

        var css = `
        .activity__loader.active{
            background:url('${url}') center/contain no-repeat !important;
            filter:${filter};
        }

        .player-video__loader.custom::before{
            content:'';
            position:absolute;
            inset:0;
            background:url('${url}') center/contain no-repeat;
            filter:${filter};
            pointer-events:none;
        }

        .lampac-balanser-loader.custom,
        .loading-layer__ico.custom,
        .modal-loading.custom{
            background:url('${url}') center/contain no-repeat !important;
            filter:${filter};
        }
        `;
        $('<style id="aniload-style">' + css + '</style>').appendTo('head');

        $('.player-video__loader,.lampac-balanser-loader,.loading-layer__ico,.modal-loading')
            .addClass('custom');
    }

    function removeLoader() {
        $('#aniload-style').remove();
        $('.custom').removeClass('custom');
    }

    /* ======================================================
     *  PREVIEW
     * ====================================================== */
    function updatePreview(url) {
        if (!url || url === './img/loader.svg') url = defaultLoader();
        $('.activity__loader_prv').css('background-image', 'url("' + url + '")');
    }

    /* ======================================================
     *  SETTINGS
     * ====================================================== */
    function registerSettings() {
        Lampa.SettingsApi.addParam({
            component: 'interface_customization',
            param: {
                name: 'ani_active',
                type: 'select',
                values: {
                    'false': Lampa.Lang.translate('settings_param_no'),
                    'true': Lampa.Lang.translate('settings_param_yes')
                },
                default: 'false'
            },
            field: {
                name:
                    '<div class="lampac-setting-row">' +
                        '<div class="lampac-setting-icon">' +
                            aniIconSvg() +
                        '</div>' +
                        Lampa.Lang.translate('params_ani_name') +
                    '</div>',
                description: Lampa.Lang.translate('params_ani_desc')
            },
            onChange: function (v) {
                Lampa.Storage.set('ani_active', v === 'true');
                Lampa.Settings.render();
                syncState();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'interface_customization',
            param: { name: 'select_ani_mation', type: 'button' },
            field: {
                name:
                    '<div class="lampac-setting-row">' +
                        '<div class="lampac-setting-icon">' +
                            '<div class="activity__loader_prv"></div>' +
                        '</div>' +
                        Lampa.Lang.translate('params_ani_select') +
                    '</div>'
            },
            onRender: function (item) {
                item.toggle(Lampa.Storage.get('ani_active'));
                updatePreview(Lampa.Storage.get('ani_load'));
            },
            onChange: openPicker
        });
    }

    /* ======================================================
     *  MODAL PICKER (логіка збережена)
     * ====================================================== */
    function openPicker() {
        if (!window.svg_loaders || !window.svg_loaders.length) return;

        var html = window.svg_loaders.map(function (src) {
            return '<div class="ani_loader_square selector"><img src="' + src + '"></div>';
        }).join('');

        Lampa.Modal.open({
            title: Lampa.Lang.translate('params_ani_select'),
            size: 'medium',
            html: html,
            onSelect: function (a) {
                var img = a[0].querySelector('img');
                if (!img) return;
                var src = img.getAttribute('src');
                Lampa.Storage.set('ani_load', src);
                syncState();
                Lampa.Modal.close();
            }
        });
    }

    /* ======================================================
     *  STATE SYNC (єдина точка)
     * ====================================================== */
    function syncState() {
        if (Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load')) {
            applyLoader(Lampa.Storage.get('ani_load'));
            updatePreview(Lampa.Storage.get('ani_load'));
        } else {
            removeLoader();
            updatePreview();
        }
    }

    /* ======================================================
     *  OBSERVER (ОДИН)
     * ====================================================== */
    var observer = new MutationObserver(function () {
        if (Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load')) {
            applyLoader(Lampa.Storage.get('ani_load'));
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    /* ======================================================
     *  PAUSE ICON COLOR
     * ====================================================== */
    function updatePauseIconColor() {
        $('#pause-icon-color').remove();
        var color = Lampa.Storage.get('color_plugin_main_color', '#fff');
        $('<style id="pause-icon-color">.player-video__paused svg rect{fill:' +
            color + ' !important}</style>').appendTo('head');
    }

    /* ======================================================
     *  INIT
     * ====================================================== */
    function init() {
        registerSettings();
        syncState();
        updatePauseIconColor();
    }

    if (window.appready) init();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') init();
    });

    Lampa.Storage.listener.follow('change', function (e) {
        if (e.name === 'color_plugin_main_color') {
            syncState();
            updatePauseIconColor();
        }
    });

})();
