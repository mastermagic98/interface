(function () {
    'use strict';

    Lampa.Lang.add({
        params_ani_on: { ru: 'Включить', en: 'Enable', uk: 'Увімкнути' },
        params_ani_select: { ru: 'Выбор анимации', en: 'Select loading animation', uk: 'Вибір анімації завантаження' },
        params_ani_name: { ru: 'Анимация Загрузки', en: 'Loading animation', uk: 'Анімація завантаження' },
        default_loader: { ru: 'По умолчанию', en: 'Default', uk: 'За замовчуванням' },
        custom_svg_input: { ru: 'Введи URL SVG', en: 'Enter SVG URL', uk: 'Введи URL SVG URL' },
        svg_input_hint: { ru: 'Используйте URL SVG, например https://example.com/loader.svg', en: 'Use SVG URL, for example https://example.com/loader.svg', uk: 'Використовуйте URL SVG, наприклад https://example.com/loader.svg' }
    });

    Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_picker_container">{ani_svg_content}</div></div>');

    function hexToRgb(hex) {
        var cleanHex = hex.replace('#', '');
        var r = parseInt(cleanHex.substring(0, 2), 16);
        var g = parseInt(cleanHex.substring(2, 4), 16);
        var b = parseInt(cleanHex.substring(4, 6), 16);
        return { r: r, g: g, b: b };
    }

    function getFilterRgb(mainColor) {
        if (mainColor.toLowerCase() === '#353535') {
            return { r: 255, g: 255, b: 255 };
        }
        return hexToRgb(mainColor);
    }

    function applyDefaultLoaderColor() {
        var defaultSvg = '<?xml version="1.0" encoding="utf-8"?>' +
                         '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="94px" height="94px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">' +
                         '<circle cx="50" cy="50" fill="none" stroke="#ffffff" stroke-width="5" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">' +
                         ' <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>' +
                         '</circle>' +
                         '</svg>';
        var encodedSvg = 'data:image/svg+xml,' + encodeURIComponent(defaultSvg);
        return { src: encodedSvg, filter: '' };
    }

    function setCustomLoader(url) {
        console.log('setCustomLoader called with URL:', url);
        $('#aniload-id').remove();
        $('#aniload-glass-id').remove();

        var escapedUrl = url.replace(/'/g, "\\'");
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        var rgb = getFilterRgb(mainColor);
        var filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';

        // Основний стиль для SVG-лоадера
        var loaderStyle = 'body .activity__loader { display: none !important; background-image: none !important; }' +
                          'body .activity__loader.active { background-attachment: scroll; background-clip: border-box; background-color: transparent !important; background-image: url(\'' + escapedUrl + '\') !important; background-origin: padding-box; background-position: 50% 50%; background-repeat: no-repeat; background-size: contain !important; box-sizing: border-box; display: block !important; position: fixed !important; left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) scale(1) !important; -webkit-transform: translate(-50%, -50%) scale(1) !important; width: 108px !important; height: 108px !important; filter: ' + filterValue + '; z-index: 10001 !important; }' +
                          'body .lampac-balanser-loader { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: 50% 50% !important; background-size: contain !important; background-color: transparent !important; filter: ' + filterValue + ' !important; z-index: 10001 !important; }' +
                          'body .player-video .player-video__loader, body .player-video.video--load .player-video__loader { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: 50% 50% !important; background-size: 80% 80% !important; background-color: transparent !important; filter: ' + filterValue + ' !important; backdrop-filter: none !important; z-index: 10001 !important; }' +
                          'body .player-video .player-video__loader:not(.custom) { background-image: none !important; display: none !important; }' +
                          'body .loading-layer .loading-layer__ico { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: center !important; background-size: contain !important; background-color: transparent !important; filter: ' + filterValue + ' !important; width: 1.9em !important; height: 1.9em !important; z-index: 10001 !important; }' +
                          'body .loading-layer .loading-layer__ico:not(.custom) { background-image: none !important; display: none !important; }' +
                          'body .player-video__youtube-needclick > div { text-indent: -9999px; background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: 50% 50% !important; background-size: 80% 80% !important; background-color: transparent !important; filter: ' + filterValue + ' !important; z-index: 10001 !important; width: 8em !important; height: 8em !important; }' +
                          'body .modal-loading { background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: 50% 50% !important; background-size: contain !important; background-color: transparent !important; filter: ' + filterValue + ' !important; display: block !important; z-index: 10001 !important; }';

        // Додаємо розмите скляне коло ПІД SVG
        var glassCircleStyle = 'body .activity__loader.active::before,' +
                               'body .lampac-balanser-loader::before,' +
                               'body .player-video__loader.custom::before,' +
                               'body .loading-layer__ico.custom::before,' +
                               'body .player-video__youtube-needclick > div.custom::before,' +
                               'body .modal-loading.custom::before {' +
                               'content: "" !important;' +
                               'position: absolute !important;' +
                               'left: 50% !important;' +
                               'top: 50% !important;' +
                               'transform: translate(-50%, -50%) !important;' +
                               'width: 140px !important;' +
                               'height: 140px !important;' +
                               'background: rgba(255, 255, 255, 0.12) !important;' +
                               'border-radius: 50% !important;' +
                               'backdrop-filter: blur(12px) !important;' +
                               '-webkit-backdrop-filter: blur(12px) !important;' +
                               'box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37) !important;' +
                               'border: 1px solid rgba(255, 255, 255, 0.18) !important;' +
                               'z-index: 10000 !important;' +
                               'pointer-events: none !important;' +
                               '}';

        $('<style id="aniload-id">' + loaderStyle + glassCircleStyle + '</style>').appendTo('head');

        // Застосовуємо до всіх існуючих елементів
        var elements = [
            '.activity__loader',
            '.lampac-balanser-loader',
            '.player-video__loader',
            '.loading-layer__ico',
            '.player-video__youtube-needclick > div',
            '.modal-loading'
        ];

        elements.forEach(function(selector) {
            var items = document.querySelectorAll(selector);
            items.forEach(function(el) {
                el.classList.add('custom');
                el.style.backgroundImage = 'url(\'' + escapedUrl + '\')';
                el.style.filter = filterValue;
                el.style.backgroundColor = 'transparent';
            });
        });

        var activityEl = document.querySelector('.activity__loader');
        if (activityEl && Lampa.Storage.get('ani_active')) {
            activityEl.classList.add('active');
            activityEl.style.display = 'block';
        }
    }

    function insert_activity_loader_prv(escapedUrl) {
        $('#aniload-id-prv').remove();
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        var rgb = getFilterRgb(mainColor);
        var whiteFilterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22white_color%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#white_color")';

        if (!escapedUrl || escapedUrl === './img/loader.svg') {
            var def = applyDefaultLoaderColor();
            escapedUrl = def.src;
        }

        var prvStyle = '.settings-param[data-name="select_ani_mation"] .activity__loader_prv {' +
                       'display: inline-block; width: 23px; height: 24px; margin-right: 10px; vertical-align: middle;' +
                       'background: url(\'' + escapedUrl + '\') no-repeat 50% 50%; background-size: contain;' +
                       'background-color: transparent !important; filter: ' + whiteFilterValue + ' !important; -webkit-filter: ' + whiteFilterValue + ' !important;' +
                       '}';

        $('<style id="aniload-id-prv">' + prvStyle + '</style>').appendTo('head');
    }

    function remove_activity_loader() {
        $('#aniload-id').remove();
        $('#aniload-glass-id').remove();
        $('#aniload-id-prv').remove();

        $('.activity__loader, .lampac-balanser-loader, .player-video__loader, .loading-layer__ico, .player-video__youtube-needclick > div, .modal-loading').removeClass('custom active')
            .css({
                backgroundImage: '',
                filter: '',
                backgroundColor: '',
                display: ''
            });

        var act = document.querySelector('.activity__loader');
        if (act) {
            act.style.display = 'none';
        }

        insert_activity_loader_prv('./img/loader.svg');
    }

    function create_ani_modal() {
        var style = document.createElement('style');
        style.id = 'aniload-modal-style';
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        var rgb = getFilterRgb(mainColor);
        var filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
        var focusBorder = mainColor.toLowerCase() === '#353535' ? '#ffffff' : 'var(--main-color)';

        style.textContent = '.ani_modal_root { padding: 1em; }' +
                            '.ani_picker_container { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }' +
                            '@media (max-width: 768px) { .ani_picker_container { grid-template-columns: 1fr; } }' +
                            '.ani_loader_row { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 25px; justify-content: center; }' +
                            '.ani_loader_square { width: 35px; height: 35px; border-radius: 4px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; color: #fff; font-size: 10px; }' +
                            '.ani_loader_square img { max-width: 30px; max-height: 30px; object-fit: contain; filter: ' + filterValue + '; }' +
                            '.ani_loader_square.focus { border: 0.3em solid ' + focusBorder + '; transform: scale(1.1); }' +
                            '.svg_input { width: 252px; height: 35px; border-radius: 8px; border: 2px solid #ddd; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; font-size: 12px; background-color: #353535; }' +
                            '.svg_input.focus { border: 0.3em solid ' + focusBorder + '; transform: scale(1.1); }';

        document.head.appendChild(style);
    }

    function createSvgHtml(src, index) {
        return '<div class="ani_loader_square selector" tabindex="0" title="Loader ' + index + '"><img src="' + src + '" alt="Loader"></div>';
    }

    function chunkArray(arr, size) {
        var result = [];
        for (var i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
        return result;
    }

    function isValidSvgUrl(url) {
        return /^https?:\/\/.*\.svg$/.test(url);
    }

    function aniLoad() {
        var icon = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><circle cx="12" cy="12" r="3"/><g><circle cx="4" cy="12" r="3"/><circle cx="20" cy="12" r="3"/><animateTransform attributeName="transform" type="rotate" dur="1s" values="0 12 12;360 12 12" repeatCount="indefinite"/></g></svg>';

        try { Lampa.SettingsApi.addComponent({ component: 'ani_load_menu', name: Lampa.Lang.translate('params_ani_name'), icon: icon }); } catch(e) {}

        try {
            Lampa.SettingsApi.addParam({
                component: 'ani_load_menu',
                param: { name: 'ani_active', type: 'trigger', default: false },
                field: { name: Lampa.Lang.translate('params_ani_on') },
                onChange: function(val) {
                    Lampa.Storage.set('ani_active', val === 'true');
                    var sel = $('.settings-param[data-name="select_ani_mation"]');
                    if (val === 'true') {
                        sel.show();
                        var url = Lampa.Storage.get('ani_load');
                        if (url && url !== './img/loader.svg') {
                            setCustomLoader(url);
                            insert_activity_loader_prv(url);
                        } else {
                            insert_activity_loader_prv('./img/loader.svg');
                        }
                    } else {
                        sel.hide();
                        remove_activity_loader();
                    }
                }
            });
        } catch(e) {}

        try {
            Lampa.SettingsApi.addParam({
                component: 'ani_load_menu',
                param: { name: 'select_ani_mation', type: 'button' },
                field: { name: '<div class="settings-folder__icon" style="display:inline-block;vertical-align:middle;width:23px;height:24px;margin-right:10px;"><div class="activity__loader_prv"></div></div>' + Lampa.Lang.translate('params_ani_select') },
                onRender: function(el) {
                    if (!Lampa.Storage.get('ani_active')) el.hide();
                    else {
                        el.show();
                        setTimeout(function() { insert_activity_loader_prv(Lampa.Storage.get('ani_load', './img/loader.svg')); }, 50);
                    }
                },
                onChange: function() {
                    if (!window.svg_loaders || !window.svg_loaders.length) return;

                    create_ani_modal();

                    var groups = chunkArray(window.svg_loaders, 6);
                    var rows = groups.map(function(g, i) {
                        return '<div class="ani_loader_row">' + g.map(function(src, j) => createSvgHtml(src, i*6 + j + 1)).join('') + '</div>';
                    });

                    var defaultBtn = '<div class="ani_loader_square selector default" tabindex="0"><img src="' + applyDefaultLoaderColor().src + '"></div>';
                    var inputHtml = '<div class="ani_loader_square selector svg_input" tabindex="0" style="width:252px;"><div class="label">' + Lampa.Lang.translate('custom_svg_input') + '</div><div class="value">' + (Lampa.Storage.get('ani_load_custom_svg', '') || 'https://example.com/loader.svg') + '</div></div>';

                    Lampa.Modal.open({
                        title: Lampa.Lang.translate('params_ani_select'),
                        size: 'medium',
                        html: $('<div><div style="display:flex;gap:20px;justify-content:center;margin-bottom:25px;">' + defaultBtn + inputHtml + '</div><div class="ani_picker_container">' + rows.join('') + '</div></div>'),
                        onSelect: function(elem) {
                            if (!elem || !elem.length) return;
                            var target = elem[0];

                            if (target.classList.contains('svg_input')) {
                                Lampa.Input.edit({
                                    name: 'ani_load_custom_svg',
                                    value: Lampa.Storage.get('ani_load_custom_svg', ''),
                                    placeholder: 'https://example.com/loader.svg'
                                }, function(newUrl) {
                                    if (!newUrl || !isValidSvgUrl(newUrl)) {
                                        Lampa.Noty.show('Невірний або порожній URL SVG');
                                        return;
                                    }
                                    Lampa.Storage.set('ani_load_custom_svg', newUrl);
                                    Lampa.Storage.set('ani_load', newUrl);
                                    if (Lampa.Storage.get('ani_active')) setCustomLoader(newUrl);
                                    insert_activity_loader_prv(newUrl);
                                });
                                return;
                            }

                            var url;
                            if (target.classList.contains('default')) {
                                url = './img/loader.svg';
                                Lampa.Storage.set('ani_load', '');
                                remove_activity_loader();
                            } else {
                                url = target.querySelector('img').src;
                                Lampa.Storage.set('ani_load', url);
                                if (Lampa.Storage.get('ani_active')) setCustomLoader(url);
                            }

                            insert_activity_loader_prv(url || './img/loader.svg');
                            Lampa.Modal.close();
                        }
                    });
                }
            });
        } catch(e) {}

        // Ініціалізація при старті
        if (Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        } else {
            insert_activity_loader_prv('./img/loader.svg');
        }
    }

    function byTheme() {
        if (Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        } else {
            remove_activity_loader();
        }
    }

    if (window.appready) {
        aniLoad();
        byTheme();
    } else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') {
                aniLoad();
                byTheme();
            }
        });
    }

    Lampa.Storage.listener.follow('change', function(e) {
        if (e.name === 'accent_color_selected') byTheme();
    });

    window.byTheme = byTheme;
})();
