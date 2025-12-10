// aloader_interface.js
// налаштування в інтерфейсі, прев’ю, модалку, збереження
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

    Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_picker_container">{ani_svg_content}</div></div>');

    window.aniLoaderInterface = {
        apply: function () {},
        remove: function () {},
        preview: function () {}
    };

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
                         '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin:auto;background:none;display:block;shape-rendering:auto;" width="94px" height="94px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">' +
                         '<circle cx="50" cy="50" fill="none" stroke="#ffffff" stroke-width="5" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">' +
                         '  <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>' +
                         '</circle></svg>';
        var encoded = 'data:image/svg+xml,' + encodeURIComponent(defaultSvg);
        return { src: encoded, filter: '' };
    }

    function insert_activity_loader_prv(url) {
        $('#aniload-id-prv').remove();

        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        var whiteFilter = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22w%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 1 0 0 0 0 0 1  0 0 0 0 1  0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#w")';

        if (!url || url === './img/loader.svg') {
            var def = applyDefaultLoaderColor();
            url = def.src;
        }

        var styleText = '.settings-param[data-name="select_ani_mation"] .activity__loader_prv {' +
                        'display: inline-block; width: 23px; height: 24px; margin-right: 10px; vertical-align: middle;' +
                        'background: url("' + url + '") no-repeat 50% 50%; background-size: contain; background-color: transparent !important;' +
                        'filter: ' + whiteFilter + ' !important; -webkit-filter: ' + whiteFilter + ' !important;} ' +
                        'body.glass--style .settings-param.focus .settings-folder__icon .activity__loader_prv {' +
                        'filter: none !important; -webkit-filter: none !important;}';

        $('<style id="aniload-id-prv">' + styleText + '</style>').appendTo('head');
    }

    function create_ani_modal() {
        var style = document.createElement('style');
        style.id = 'aniload-modal-style';
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        var rgb = getFilterRgb(mainColor);
        var filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22c%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r/255) + ' 0 0 0 0 ' + (rgb.g/255) + ' 0 0 0 0 ' + (rgb.b/255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#c")';
        var focusBorder = mainColor.toLowerCase() === '#353535' ? '#ffffff' : 'var(--main-color)';

        style.textContent = '.ani_modal_root { padding: 1em; }' +
                            '.ani_picker_container { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }' +
                            '@media (max-width: 768px) { .ani_picker_container { grid-template-columns: 1fr; } }' +
                            '.ani_loader_row { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 25px; justify-content: center; }' +
                            '.ani_loader_square { width: 35px; height: 35px; border-radius: 4px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; color: #fff; font-size: 10px; text-align: center; }' +
                            '.ani_loader_square img { max-width: 30px; max-height: 30px; object-fit: contain; filter: ' + filterValue + '; }' +
                            '.ani_loader_square.focus { border: 0.3em solid ' + focusBorder + '; transform: scale(1.1); }' +
                            '.svg_input { width: 252px; height: 35px; border-radius: 8px; border: 2px solid #ddd; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: bold; background: #353535; }' +
                            '.svg_input.focus { border: 0.3em solid ' + focusBorder + '; transform: scale(1.1); }' +
                            '.svg_input .label { position: absolute; top: 1px; font-size: 10px; }' +
                            '.svg_input .value { position: absolute; bottom: 1px; font-size: 10px; }';
        document.head.appendChild(style);
    }

    function createSvgHtml(src, index) {
        return '<div class="ani_loader_square selector" tabindex="0" title="Loader ' + (index + 1) + '"><img src="' + src + '" alt=""></div>';
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

    function loader() {
        if (Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            var url = Lampa.Storage.get('ani_load');
            window.aniLoaderInterface.apply(url);
            insert_activity_loader_prv(url);
        } else {
            window.aniLoaderInterface.remove();
            insert_activity_loader_prv('./img/loader.svg');
        }
    }

    function initInterface() {
        var icon = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><circle cx="12" cy="12" r="3"/><g><circle cx="4" cy="12" r="3"/><circle cx="20" cy="12" r="3"/><animateTransform attributeName="transform" type="rotate" dur="1s" values="0 12 12;360 12 12" repeatCount="indefinite"/></g></svg>';

        try {
            Lampa.SettingsApi.addComponent({
                component: 'ani_load_menu',
                name: Lampa.Lang.translate('params_ani_name'),
                icon: icon
            });
        } catch (e) {}

        // Перемикач увімкнення
        Lampa.SettingsApi.addParam({
            component: 'ani_load_menu',
            param: { name: 'ani_active', type: 'trigger', default: false },
            field: { name: Lampa.Lang.translate('params_ani_on') },
            onChange: function (value) {
                Lampa.Storage.set('ani_active', value === 'true');
                var selectItem = $('.settings-param[data-name="select_ani_mation"]');
                selectItem.css('display', value === 'true' ? 'block' : 'none');

                if (value === 'true') {
                    var url = Lampa.Storage.get('ani_load', './img/loader.svg');
                    window.aniLoaderInterface.apply(url);
                    insert_activity_loader_prv(url);
                } else {
                    window.aniLoaderInterface.remove();
                    insert_activity_loader_prv('./img/loader.svg');
                }
                if (Lampa.Settings.render) Lampa.Settings.render();
            }
        });

        // Кнопка вибору анімації
        Lampa.SettingsApi.addParam({
            component: 'ani_load_menu',
            param: { name: 'select_ani_mation', type: 'button' },
            field: {
                name: '<div class="settings-folder__icon" style="display:inline-block;vertical-align:middle;width:23px;height:24px;margin-right:10px"><div class="activity__loader_prv"></div></div>' + Lampa.Lang.translate('params_ani_select')
            },
            onRender: function (item) {
                item.css('display', Lampa.Storage.get('ani_active') ? 'block' : 'none');
                setTimeout(function () {
                    insert_activity_loader_prv(Lampa.Storage.get('ani_load', './img/loader.svg'));
                }, 50);
            },
            onChange: function () {
                if (!window.svg_loaders || window.svg_loaders.length === 0) return;

                create_ani_modal();

                var groups = chunkArray(window.svg_loaders, 6);
                var rows = groups.map(function (g, gi) {
                    return '<div class="ani_loader_row">' + g.map(function (src, i) {
                        return createSvgHtml(src, gi * 6 + i);
                    }).join('') + '</div>';
                });

                var mid = Math.ceil(rows.length / 2);
                var leftColumn = rows.slice(0, mid).join('');
                var rightColumn = rows.slice(mid).join('');

                var def = applyDefaultLoaderColor();
                var defaultBtn = '<div class="ani_loader_square selector default" tabindex="0" title="' + Lampa.Lang.translate('default_loader') + '"><img src="' + def.src + '" style="filter:' + def.filter + '"></div>';

                var savedCustom = Lampa.Storage.get('ani_load_custom_svg', '');
                var inputText = savedCustom || 'https://example.com/loader.svg';
                var inputBtn = '<div class="ani_loader_square selector svg_input" tabindex="0" style="width:252px">' +
                               '<div class="label">' + Lampa.Lang.translate('custom_svg_input') + '</div>' +
                               '<div class="value">' + inputText + '</div></div>';

                var topRow = '<div style="display:flex;gap:20px;justify-content:center;margin-bottom:25px">' + defaultBtn + inputBtn + '</div>';

                var content = $('<div>' + topRow + '<div class="ani_picker_container"><div>' + leftColumn + '</div><div>' + rightColumn + '</div></div></div>');

                Lampa.Modal.open({
                    title: Lampa.Lang.translate('params_ani_select'),
                    size: 'medium',
                    html: content,
                    onSelect: function (elem) {
                        if (!elem || !elem[0]) return;
                        var el = elem[0];

                        if (el.classList.contains('svg_input')) {
                            Lampa.Input.edit({
                                name: 'ani_load_custom_svg',
                                value: Lampa.Storage.get('ani_load_custom_svg', ''),
                                placeholder: 'https://example.com/loader.svg'
                            }, function (newUrl) {
                                if (!newUrl) return Lampa.Noty.show('URL не введено');
                                if (!isValidSvgUrl(newUrl)) return Lampa.Noty.show('Невірний формат URL SVG');

                                Lampa.Storage.set('ani_load_custom_svg', newUrl);
                                Lampa.Storage.set('ani_load', newUrl);
                                window.aniLoaderInterface.apply(newUrl);
                                insert_activity_loader_prv(newUrl);
                                Lampa.Controller.toggle('settings_component');
                            });
                            return;
                        }

                        var url;
                        if (el.classList.contains('default')) {
                            url = './img/loader.svg';
                            Lampa.Storage.set('ani_load', '');
                            window.aniLoaderInterface.remove();
                        } else {
                            url = el.querySelector('img').src;
                            Lampa.Storage.set('ani_load', url);
                            window.aniLoaderInterface.apply(url);
                        }

                        insert_activity_loader_prv(url === './img/loader.svg' ? url : url);
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

        // Початкове застосування
        if (Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            window.aniLoaderInterface.apply(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        } else {
            insert_activity_loader_prv('./img/loader.svg');
        }
    }

    // Запуск
    if (window.appready) {
        initInterface();
        loader();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                initInterface();
                loader();
            }
        });
    }

    // Реакція на зміну кольору теми
    Lampa.Storage.listener.follow('change', function (e) {
        if (e.name === 'accent_color_selected') {
            loader();
        }
    });

    // Експорт функцій для player-частини
    window.aniLoaderInterface.apply = function (url) {
        if (window.aniLoaderPlayer && window.aniLoaderPlayer.apply) {
            window.aniLoaderPlayer.apply(url);
        }
    };
    window.aniLoaderInterface.remove = function () {
        if (window.aniLoaderPlayer && window.aniLoaderPlayer.remove) {
            window.aniLoaderPlayer.remove();
        }
    };
    window.aniLoaderInterface.preview = insert_activity_loader_prv;

    // Глобальна функція для виклику з консолі
    window.loader = loader;

})();
