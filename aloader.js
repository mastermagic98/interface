(function () {
    'use strict';

    // Додаємо переклади
    Lampa.Lang.add({
        params_ani_on: { ru: 'Включить', en: 'Enable', uk: 'Увімкнути' },
        params_ani_select: { ru: 'Выбор анимации', en: 'Select loading animation', uk: 'Вибір анімації завантаження' },
        params_ani_name: { ru: 'Анимация Загрузки', en: 'Loading animation', uk: 'Анімація завантаження' },
        default_loader: { ru: 'По умолчанию', en: 'Default', uk: 'За замовчуванням' },
        custom_svg_input: { ru: 'Введи URL SVG', en: 'Enter SVG URL', uk: 'Введи URL SVG' },
        svg_input_hint: { ru: 'Используйте URL SVG, например https://example.com/loader.svg', en: 'Use SVG URL, for example https://example.com/loader.svg', uk: 'Використовуйте URL SVG, наприклад https://example.com/loader.svg' }
    });

    Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_picker_container">{ani_svg_content}</div></div>');

    // Повертає дефолтний білий лоадер (якщо потрібно)
    function applyDefaultLoaderColor() {
        var defaultSvg = '<?xml version="1.0" encoding="utf-8"?>' +
                         '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="94px" height="94px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">' +
                         '<circle cx="50" cy="50" fill="none" stroke="currentColor" stroke-width="5" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">' +
                         ' <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>' +
                         '</circle>' +
                         '</svg>';
        var encodedSvg = 'data:image/svg+xml,' + encodeURIComponent(defaultSvg);
        return { src: encodedSvg, filter: '' };
    }

    // === ГЛАВНАЯ ФУНКЦІЯ — НАКЛАДАННЯ КАСТОМНОГО ЛОАДЕРА (ВИПРАВЛЕНА) ===
    function setCustomLoader(url) {
        console.log('setCustomLoader called with URL:', url);
        $('#aniload-id').remove();

        var escapedUrl = url.replace(/'/g, "\\'");
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');

        var newStyle =
            // Приховуємо стандартний лоадер
            'body .activity__loader { display: none !important; background-image: none !important; }' +

            // Головний центральний лоадер
            'body .activity__loader.active {' +
            '  display: block !important;' +
            '  position: fixed !important;' +
            '  left: 50% !important; top: 50% !important;' +
            '  transform: translate(-50%, -50%) !important;' +
            '  width: 108px !important; height: 108px !important;' +
            '  background: url(\'' + escapedUrl + '\') no-repeat 50% 50% / contain transparent !important;' +
            '  color: ' + mainColor + ' !important;' +
            '  filter: none !important;' +
            '  z-index: 9999 !important;' +
            '}' +

            // Усі інші лоадери — через background + color
            'body .lampac-balanser-loader.custom,' +
            'body .player-video__loader.custom,' +
            'body .loading-layer__ico.custom,' +
            'body .player-video__youtube-needclick > div.custom,' +
            'body .modal-loading.custom {' +
            '  background: url(\'' + escapedUrl + '\') no-repeat 50% 50% / contain transparent !important;' +
            '  color: ' + mainColor + ' !important;' +
            '  filter: none !important;' +
            '  background-color: transparent !important;' +
            '}' +

            // Спеціально для YouTube-needclick
            'body .player-video__youtube-needclick > div.custom {' +
            '  width: 8em !important; height: 8em !important;' +
            '  background-size: 80% 80% !important;' +
            '  text-indent: -9999px !important;' +
            '}' +

            // Приховуємо стандартні лоадери, якщо не кастомні
            'body .player-video__loader:not(.custom),' +
            'body .loading-layer__ico:not(.custom) {' +
            '  display: none !important;' +
            '}';

        $('<style id="aniload-id">' + newStyle + '</style>').appendTo('head');

        // Примусово додаємо клас .custom та колір усім елементам
        $('.activity__loader, .lampac-balanser-loader, .player-video__loader, ' +
          '.loading-layer__ico, .player-video__youtube-needclick > div, .modal-loading')
            .addClass('custom')
            .css('color', mainColor);
    }

    // === ПРЕВ’Ю В НАЛАШТУВАННЯХ (ВИПРАВЛЕНО) ===
    function insert_activity_loader_prv(url) {
        $('#aniload-id-prv').remove();

        if (!url || url === './img/loader.svg') {
            var def = applyDefaultLoaderColor();
            url = def.src;
        }

        var escapedUrl = url.replace(/'/g, "\\'");
        var previewColor = '#ffffff'; // білий для прев’ю

        var newStyle =
            '.settings-param[data-name="select_ani_mation"] .activity__loader_prv {' +
            '  display: inline-block;' +
            '  width: 23px; height: 24px;' +
            '  margin-right: 10px;' +
            '  vertical-align: middle;' +
            '  background: url(\'' + escapedUrl + '\') no-repeat 50% 50% / contain transparent;' +
            '  color: ' + previewColor + ' !important;' +
            '  filter: none !important;' +
            '}';

        $('<style id="aniload-id-prv">' + newStyle + '</style>').appendTo('head');
    }

    // === ВИДАЛЕННЯ ВСІХ ЗМІН ===
    function remove_activity_loader() {
        $('#aniload-id').remove();
        $('#aniload-id-prv').remove();

        $('.activity__loader, .lampac-balanser-loader, .player-video__loader, ' +
          '.loading-layer__ico, .player-video__youtube-needclick > div, .modal-loading')
            .removeClass('custom')
            .css({
                'background-image': '',
                'color': '',
                'filter': '',
                'display': '',
                'background-color': ''
            });

        insert_activity_loader_prv('./img/loader.svg');
    }

    // === СТИЛІ МОДАЛЬНОГО ВІКНА ===
    function create_ani_modal() {
        var style = document.createElement('style');
        style.id = 'aniload-modal-style';
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        var focusBorderColor = mainColor.toLowerCase() === '#353535' ? '#ffffff' : 'var(--main-color)';

        style.textContent =
            '.ani_modal_root { padding: 1em; }' +
            '.ani_picker_container { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }' +
            '@media (max-width: 768px) { .ani_picker_container { grid-template-columns: 1fr; } }' +
            '.ani_loader_row { display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; margin-bottom: 25px; }' +
            '.ani_loader_square { width: 35px; height: 35px; border-radius: 4px; display: flex; justify-content: center; align-items: center; cursor: pointer; }' +
            '.ani_loader_square img { max-width: 30px; max-height: 30px; object-fit: contain; color: ' + mainColor + '; }' +
            '.ani_loader_square.focus { border: 0.3em solid ' + focusBorderColor + '; transform: scale(1.1); }' +
            '.svg_input { width: 252px; height: 35px; border-radius: 8px; border: 2px solid #ddd; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #353535; color: #fff !important; font-size: 12px; font-weight: bold; }' +
            '.svg_input.focus { border: 0.3em solid ' + focusBorderColor + '; transform: scale(1.1); }' +
            '.svg_input .label { font-size: 10px; position: absolute; top: 1px; }' +
            '.svg_input .value { font-size: 10px; position: absolute; bottom: 1px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 90%; }';

        document.head.appendChild(style);
    }

    // === ДОПОМІЖНІ ФУНКЦІЇ ===
    function createSvgHtml(src, index) {
        return '<div class="ani_loader_square selector" tabindex="0"><img src="' + src + '" alt="Loader ' + index + '"></div>';
    }

    function chunkArray(arr, size) {
        var result = [];
        for (var i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }

    function isValidSvgUrl(url) {
        return /^https?:\/\/.*\.svg$/i.test(url);
    }

    // === ГОЛОВНА ІНІЦІАЛІЗАЦІЯ ПЛАГІНУ ===
    function aniLoad() {
        var icon_plugin = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><circle cx="12" cy="12" r="3"/><g><circle cx="4" cy="12" r="3"/><circle cx="20" cy="12" r="3"/><animateTransform attributeName="transform" type="rotate" calcMode="spline" dur="1s" keySplines=".36,.6,.31,1;.36,.6,.31,1" values="0 12 12;180 12 12;360 12 12" repeatCount="indefinite"/></g></svg>';

        try {
            Lampa.SettingsApi.addComponent({
                component: 'ani_load_menu',
                name: Lampa.Lang.translate('params_ani_name'),
                icon: icon_plugin
            });
        } catch (e) {}

        // Перемикач увімкнення
        try {
            Lampa.SettingsApi.addParam({
                component: 'ani_load_menu',
                param: { name: 'ani_active', type: 'trigger', default: false },
                field: { name: Lampa.Lang.translate('params_ani_on') },
                onChange: function (value) {
                    Lampa.Storage.set('ani_active', value === 'true');
                    var selectItem = $('.settings-param[data-name="select_ani_mation"]');
                    if (selectItem.length) {
                        selectItem.css('display', value === 'true' ? 'block' : 'none');
                    }
                    if (value === 'true' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                        setCustomLoader(Lampa.Storage.get('ani_load'));
                        insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                    } else {
                        remove_activity_loader();
                    }
                }
            });
        } catch (e) {}

        // Кнопка вибору анімації
        try {
            Lampa.SettingsApi.addParam({
                component: 'ani_load_menu',
                param: { name: 'select_ani_mation', type: 'button' },
                field: {
                    name: '<div class="settings-folder__icon" style="display: inline-block; vertical-align: middle; width: 23px; height: 24px; margin-right: 10px;"><div class="activity__loader_prv"></div></div>' + Lampa.Lang.translate('params_ani_select')
                },
                onRender: function (item) {
                    item.css('display', Lampa.Storage.get('ani_active') ? 'block' : 'none');
                    setTimeout(function () {
                        insert_activity_loader_prv(Lampa.Storage.get('ani_load', './img/loader.svg'));
                    }, 100);
                },
                onChange: function () {
                    if (!window.svg_loaders || !window.svg_loaders.length) return;

                    create_ani_modal();

                    var grouped = chunkArray(window.svg_loaders, 6);
                    var rows = grouped.map(function (group, i) {
                        return '<div class="ani_loader_row">' + group.map(function (src, j) {
                            return createSvgHtml(src, i * 6 + j + 1);
                        }).join('') + '</div>';
                    });

                    var defaultLoader = applyDefaultLoaderColor();
                    var defaultBtn = '<div class="ani_loader_square selector default" tabindex="0"><img src="' + defaultLoader.src + '"></div>';
                    var customText = Lampa.Storage.get('ani_load_custom_svg') || Lampa.Lang.translate('custom_svg_input');
                    var inputBtn = '<div class="ani_loader_square selector svg_input" tabindex="0"><div class="label">' + Lampa.Lang.translate('custom_svg_input') + '</div><div class="value">' + customText + '</div></div>';

                    var html = $('<div><div style="display: flex; gap: 20px; justify-content: center; margin-bottom: 25px;">' + defaultBtn + inputBtn + '</div><div class="ani_picker_container">' + rows.join('') + '</div></div>');

                    Lampa.Modal.open({
                        title: Lampa.Lang.translate('params_ani_select'),
                        html: html,
                        size: 'medium',
                        onSelect: function (el) {
                            if (!el || !el.length) return;

                            var elem = el[0];
                            var url;

                            if (elem.classList.contains('default')) {
                                Lampa.Storage.set('ani_load', '');
                                remove_activity_loader();
                            } else if (elem.classList.contains('svg_input')) {
                                Lampa.Input.edit({
                                    name: 'ani_load_custom_svg',
                                    value: Lampa.Storage.get('ani_load_custom_svg', ''),
                                    placeholder: 'https://example.com/loader.svg'
                                }, function (value) {
                                    if (!value || !isValidSvgUrl(value)) {
                                        Lampa.Noty.show('Невірний URL SVG');
                                        return;
                                    }
                                    Lampa.Storage.set('ani_load_custom_svg', value);
                                    Lampa.Storage.set('ani_load', value);
                                    if (Lampa.Storage.get('ani_active')) {
                                        setCustomLoader(value);
                                        insert_activity_loader_prv(value);
                                    }
                                });
                                return;
                            } else {
                                var img = elem.querySelector('img');
                                url = img ? img.src : '';
                                Lampa.Storage.set('ani_load', url);
                                if (Lampa.Storage.get('ani_active')) {
                                    setCustomLoader(url);
                                    insert_activity_loader_prv(url);
                                }
                            }

                            Lampa.Modal.close();
                            Lampa.Controller.toggle('settings_component');
                        },
                        onBack: function () {
                            Lampa.Modal.close();
                            Lampa.Controller.toggle('settings_component');
                        }
                    });
                }
            });
        } catch (e) {}

        // Ініціалізація при старті
        if (Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        } else {
            remove_activity_loader();
        }
    }

    // Реакція на зміну теми
    function byTheme() {
        if (Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        }
    }

    // Запуск
    if (window.appready) {
        aniLoad();
        byTheme();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                aniLoad();
                byTheme();
            }
        });
    }

    Lampa.Storage.listener.follow('change', function (e) {
        if (e.name === 'accent_color_selected' || e.name === 'color_plugin_main_color') {
            byTheme();
        }
    });

    window.byTheme = byTheme;
})();
