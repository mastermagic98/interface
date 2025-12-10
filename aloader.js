(function () {
    'use strict';

    Lampa.Lang.add({
        params_ani_on: { ru: 'Включить', en: 'Enable', uk: 'Увімкнути' },
        params_ani_select: { ru: 'Выбор анимации', en: 'Select loading animation', uk: 'Вибір анімації завантаження' },
        params_ani_name: { ru: 'Анимация Загрузки', en: 'Loading animation', uk: 'Анімація завантаження' },
        default_loader: { ru: 'По умолчанию', en: 'Default', uk: 'За замовчуванням' },
        custom_svg_input: { ru: 'Введи URL SVG', en: 'Enter SVG URL', uk: 'Введи URL SVG' },
        svg_input_hint: { ru: 'Используйте URL SVG, например https://example.com/loader.svg', en: 'Use SVG URL, for example https://example.com/loader.svg', uk: 'Використовуйте URL SVG, наприклад https://example.com/loader.svg' }
    });

    function hexToRgb(hex) {
        var cleanHex = hex.replace('#', '');
        var r = parseInt(cleanHex.substring(0, 2), 16);
        var g = parseInt(cleanHex.substring(2, 4), 16);
        var b = parseInt(cleanHex.substring(4, 6), 16);
        return { r: r, g: g, b: b };
    }

    function getFilterRgb(mainColor) {
        if (mainColor.toLowerCase() === '#353535') return { r: 255, g: 255, b: 255 };
        return hexToRgb(mainColor);
    }

    function getDefaultLoader() {
        var svg = '<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" width="94px" height="94px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="#ffffff" stroke-width="5" r="35" stroke-dasharray="164.93361431346415 56.97787143782138"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform></circle></svg>';
        return 'data:image/svg+xml,' + encodeURIComponent(svg);
    }

    // === ГЛАВНА ФУНКЦІЯ — ЗАСТОСОВУЄ ЛОАДЕР ЗІ СКЛОМ ===
    function setCustomLoader(url) {
        $('#aniload-id').remove();

        var escapedUrl = url.replace(/'/g, "\\'");
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        var rgb = getFilterRgb(mainColor);

        var filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';

        var css = ''
            // СКЛО + ЛОАДЕР ДЛЯ ПЛЕЄРА
            + 'body .player-video__loader.custom {'
            + '  position: absolute !important; left:0; top:0; width:100%; height:100%;'
            + '  background: rgba(0,0,0,0.45) !important;'
            + '  backdrop-filter: blur(14px) !important;'
            + '  -webkit-backdrop-filter: blur(14px) !important;'
            + '  display: flex !important; align-items:center; justify-content:center;'
            + '  z-index: 9998 !important;'
            + '}'
            + 'body .player-video__loader.custom::before {'
            + '  content:"" !important;'
            + '  width: 100px; height: 100px;'
            + '  background: url(\'' + escapedUrl + '\') center/contain no-repeat !important;'
            + '  filter: ' + filterValue + ' !important;'
            + '  z-index: 9999 !important;'
            + '}'
            // Приховуємо старий червоний лоадер
            + 'body .player-video__loader:not(.custom) { display:none !important; }'

            // Усі інші лоадери — теж зі склом + SVG по центру
            + 'body .activity__loader.active,'
            + 'body .lampac-balanser-loader,'
            + 'body .loading-layer__ico.custom,'
            + 'body .player-video__youtube-needclick > div.custom,'
            + 'body .modal-loading.custom {'
            + '  background: rgba(0,0,0,0.45) !important;'
            + '  backdrop-filter: blur(14px) !important;'
            + '  -webkit-backdrop-filter: blur(14px) !important;'
            + '  background-image: url(\'' + escapedUrl + '\') !important;'
            + '  background-repeat: no-repeat !important;'
            + '  background-position: center !important;'
            + '  background-size: 80px 80px !important;'
            + '  filter: ' + filterValue + ' !important;'
            + '}';

        $('<style id="aniload-id">' + css + '</style>').appendTo('head');

        // Примусово додаємо клас .custom та стилі до всіх елементів
        var selectors = [
            '.player-video__loader',
            '.activity__loader.active',
            '.lampac-balanser-loader',
            '.loading-layer__ico',
            '.player-video__youtube-needclick > div',
            '.modal-loading'
        ];
        selectors.forEach(function(sel) {
            $(sel).addClass('custom')
                   .css({
                       'background-image': 'url(' + escapedUrl + ')',
                       'filter': filterValue,
                       'background-color': 'rgba(0,0,0.45)',
                       'backdrop-filter': 'blur(14px)',
                       '-webkit-backdrop-filter': 'blur(14px)'
                   });
        });
    }

    function removeCustomLoader() {
        $('#aniload-id').remove();
        $('.player-video__loader, .activity__loader, .lampac-balanser-loader, .loading-layer__ico, .player-video__youtube-needclick > div, .modal-loading')
            .removeClass('custom')
            .css({
                'background-image': '',
                'filter': '',
                'backdrop-filter': '',
                '-webkit-backdrop-filter': ''
            });
    }

    function updatePreview(url) {
        $('#aniload-id-prv').remove();
        if (!url || url === './img/loader.svg') url = getDefaultLoader();

        var whiteFilter = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22w%22%3E%3CfeColorMatrix values=%220 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#w")';

        var css = '.settings-param[data-name="select_ani_mation"] .activity__loader_prv {' +
                  'background: url(\'' + url + '\') center/contain no-repeat !important;' +
                  'filter: ' + whiteFilter + ' !important;}';
        $('<style id="aniload-id-prv">' + css + '</style>').appendTo('head');
    }

    // === ОНОВЛЕНА ФУНКЦІЯ aLoader() ===
    function aLoader() {
        var active = Lampa.Storage.get('ani_active', false);
        var url = Lampa.Storage.get('ani_load', './img/loader.svg');

        if (active && url && url !== './img/loader.svg') {
            setCustomLoader(url);
            updatePreview(url);
        } else {
            removeCustomLoader();
            updatePreview('./img/loader.svg');
        }
    }

    // === ІНІЦІАЛІЗАЦІЯ ===
    function init() {
        Lampa.SettingsApi.addComponent({
            component: 'ani_load_menu',
            name: Lampa.Lang.translate('params_ani_name'),
            icon: '<svg viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="12" r="3"/><g><circle cx="4" cy="12" r="3"/><circle cx="20" cy="12" r="3"/><animateTransform attributeName="transform" type="rotate" dur="1s" values="0 12 12;360 12 12" repeatCount="indefinite"/></g></svg>'
        });

        Lampa.SettingsApi.addParam({
            component: 'ani_load_menu',
            param: { name: 'ani_active', type: 'trigger', default: false },
            field: { name: Lampa.Lang.translate('params_ani_on') },
            onChange: function(v) {
                Lampa.Storage.set('ani_active', v === 'true');
                aLoader();
                $('.settings-param[data-name="select_ani_mation"]').toggle(v === 'true');
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'ani_load_menu',
            param: { name: 'select_ani_mation', type: 'button' },
            field: { name: '<div style="display:inline-block;width:23px;height:24px;vertical-align:middle;margin-right:10px;" class="activity__loader_prv"></div>' + Lampa.Lang.translate('params_ani_select') },
            onRender: function(el) { el.toggle(Lampa.Storage.get('ani_active')); },
            onChange: function() {
                if (!window.svg_loaders || !window.svg_loaders.length) return;

                var html = '<div style="padding:1em;">';
                html += '<div style="display:flex;gap:15px;justify-content:center;margin-bottom:20px;">';
                html += '<div class="ani_loader_square selector" data-url="./img/loader.svg"><img src="' + getDefaultLoader() + '" style="width:50px;height:50px;"></div>';
                html += '<div class="ani_loader_square selector svg_input" style="width:260px;padding:10px;background:#353535;color:#fff;border-radius:8px;">' + Lampa.Lang.translate('custom_svg_input') + '</div>';
                html += '</div>';

                for (var i = 0; i < window.svg_loaders.length; i += 6) {
                    html += '<div style="display:flex;gap:15px;justify-content:center;margin:10px 0;">';
                    for (var j = i; j < i+6 && j < window.svg_loaders.length; j++) {
                        var active = window.svg_loaders[j] === Lampa.Storage.get('ani_load') ? 'style="border:3px solid var(--main-color);transform:scale(1.1)"' : '';
                        html += '<div class="ani_loader_square selector" data-url="' + window.svg_loaders[j] + '" ' + active + '><img src="' + window.svg_loaders[j] + '" style="width:50px;height:50px;"></div>';
                    }
                    html += '</div>';
                }
                html += '</div>';

                Lampa.Modal.open({
                    title: Lampa.Lang.translate('params_ani_select'),
                    html: $(html),
                    size: 'medium',
                    onSelect: function(el) {
                        if ($(el).hasClass('svg_input')) {
                            Lampa.Input.edit({
                                name: 'ani_load_custom_svg',
                                value: Lampa.Storage.get('ani_load_custom_svg', ''),
                                placeholder: 'https://example.com/loader.svg'
                            }, function(val) {
                                if (val && /^https?:\/\/.*\.svg$/i.test(val)) {
                                    Lampa.Storage.set('ani_load_custom_svg', val);
                                    Lampa.Storage.set('ani_load', val);
                                    aLoader();
                                }
                            });
                            return;
                        }
                        var u = $(el).data('url') || './img/loader.svg';
                        Lampa.Storage.set('ani_load', u);
                        aLoader();
                        Lampa.Modal.close();
                    },
                    onBack: function() { Lampa.Modal.close(); }
                });
            }
        });

        // Запуск при старті
        aLoader();

        // Реакція на зміну теми
        Lampa.Storage.listener.follow('change', function(e) {
            if (e.name === 'accent_color_selected' || e.name === 'color_plugin_main_color') {
                aLoader();
            }
        });

        // Якщо додаток вже готовий — запускаємо одразу
        if (window.appready) aLoader();
    }

    if (window.appready) {
        init();
    } else {
        Lampa.Listener.follow('app', { type: 'ready' }, init);
    }

    // Експорт функції
    window.aLoader = aLoader;

})();
