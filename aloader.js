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
                         '<circle cx="50" cy="50" fill="none" stroke="currentColor" stroke-width="5" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">' +
                         ' <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>' +
                         '</circle>' +
                         '</svg>';
        var encodedSvg = 'data:image/svg+xml,' + encodeURIComponent(defaultSvg);
        return { src: encodedSvg, filter: '' };
    }

    // КРИТИЧНО ВИПРАВЛЕНА ФУНКЦІЯ — без feColorMatrix, тільки currentColor
    function setCustomLoader(url) {
        console.log('setCustomLoader called with URL:', url);
        $('#aniload-id').remove();

        var escapedUrl = url.replace(/'/g, "\\'");
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');

        var newStyle = 
            'body .activity__loader { display: none !important; background-image: none !important; }' +
            'body .activity__loader.active {' +
            '  background: url(\'' + escapedUrl + '\') no-repeat 50% 50% / contain transparent !important;' +
            '  color: ' + mainColor + ' !important;' +
            '  display: block !important;' +
            '  position: fixed !important;' +
            '  left: 50% !important; top: 50% !important;' +
            '  transform: translate(-50%, -50%) scale(1) !important;' +
            '  -webkit-transform: translate(-50%, -50%) scale(1) !important;' +
            '  width: 108px !important; height: 108px !important;' +
            '  filter: none !important;' +
            '  z-index: 9999 !important;' +
            '}' +
            'body .lampac-balanser-loader.custom {' +
            '  background: url(\'' + escapedUrl + '\') no-repeat 50% 50% / contain transparent !important;' +
            '  color: ' + mainColor + ' !important;' +
            '  filter: none !important;' +
            '}' +
            'body .player-video__loader.custom,' +
            'body .player-video.video--load .player-video__loader.custom {' +
            '  background: url(\'' + escapedUrl + '\') no-repeat 50% 50% / 80% 80% transparent !important;' +
            '  color: ' + mainColor + ' !important;' +
            '  filter: none !important;' +
            '  backdrop-filter: none !important;' +
            '}' +
            'body .player-video__loader:not(.custom) { display: none !important; }' +
            'body .loading-layer__ico.custom {' +
            '  background: url(\'' + escapedUrl + '\') no-repeat center / contain transparent !important;' +
            '  color: ' + mainColor + ' !important;' +
            '  filter: none !important;' +
            '  width: 1.9em !important; height: 1.9em !important;' +
            '}' +
            'body .loading-layer__ico:not(.custom) { display: none !important; }' +
            'body .player-video__youtube-needclick > div.custom {' +
            '  background: url(\'' + escapedUrl + '\') no-repeat 50% 50% / 80% 80% transparent !important;' +
            '  color: ' + mainColor + ' !important;' +
            '  filter: none !important;' +
            '  width: 8em !important; height: 8em !important;' +
            '  text-indent: -9999px !important;' +
            '}' +
            'body .modal-loading.custom {' +
            '  background: url(\'' + escapedUrl + '\') no-repeat 50% 50% / contain transparent !important;' +
            '  color: ' + mainColor + ' !important;' +
            '  filter: none !important;' +
            '  display: block !important;' +
            '  z-index: 9999 !important;' +
            '}';

        $('<style id="aniload-id">' + newStyle + '</style>').appendTo('head');

        // Додаємо клас .custom і колір усім елементам
        var elements = document.querySelectorAll('.activity__loader, .lampac-balanser-loader, .player-video__loader, .loading-layer__ico, .player-video__youtube-needclick > div, .modal-loading');
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.add('custom');
            elements[i].style.color = mainColor;
            elements[i].style.backgroundColor = 'transparent';
        }

        var activityLoader = document.querySelector('.activity__loader');
        if (activityLoader && Lampa.Storage.get('ani_active')) {
            activityLoader.classList.add('active');
            activityLoader.style.display = 'block';
        }
    }

    function insert_activity_loader_prv(escapedUrl) {
        $('#aniload-id-prv').remove();

        if (!escapedUrl || escapedUrl === './img/loader.svg') {
            var defaultLoader = applyDefaultLoaderColor();
            escapedUrl = defaultLoader.src;
        }

        var newStyle = 
            '.settings-param[data-name="select_ani_mation"] .activity__loader_prv {' +
            '  display: inline-block; width: 23px; height: 24px; margin-right: 10px; vertical-align: middle;' +
            '  background: url(\'' + escapedUrl.replace(/'/g, "\\'") + '\') no-repeat 50% 50% / contain transparent;' +
            '  color: #ffffff !important;' +
            '  filter: none !important;' +
            '}';

        $('<style id="aniload-id-prv">' + newStyle + '</style>').appendTo('head');
    }

    function remove_activity_loader() {
        console.log('remove_activity_loader called');
        $('#aniload-id').remove();
        $('#aniload-id-prv').remove();

        var elements = document.querySelectorAll('.activity__loader, .lampac-balanser-loader, .player-video__loader, .loading-layer__ico, .player-video__youtube-needclick > div, .modal-loading');
        for (var i = 0; i < elements.length; i++) {
            elements[i].classList.remove('custom');
            elements[i].style.cssText = '';
        }

        var activity = document.querySelector('.activity__loader');
        if (activity) {
            activity.classList.remove('active');
            activity.style.display = 'none';
        }

        insert_activity_loader_prv('./img/loader.svg');
    }

    function create_ani_modal() {
        var style = document.createElement('style');
        style.id = 'aniload';
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        var focusBorderColor = mainColor.toLowerCase() === '#353535' ? '#ffffff' : 'var(--main-color)';

        style.textContent = '.ani_modal_root { padding: 1em; }' +
                            '.ani_picker_container { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0; }' +
                            '@media (max-width: 768px) { .ani_picker_container { grid-template-columns: 1fr; } }' +
                            '.ani_loader_row { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 25px; justify-content: center; }' +
                            '.ani_loader_square { width: 35px; height: 35px; border-radius: 4px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; color: #ffffff !important; font-size: 10px; text-align: center; }' +
                            '.ani_loader_square img { max-width: 30px; max-height: 30px; object-fit: contain; color: ' + mainColor + '; }' +
                            '.ani_loader_square.focus { border: 0.3em solid ' + focusBorderColor + '; transform: scale(1.1); }' +
                            '.ani_loader_square.default { width: 35px; height: 35px; border-radius: 4px; }' +
                            '.svg_input { width: 252px; height: 35px; border-radius: 8px; border: 2px solid #ddd; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff !important; font-size: 12px; font-weight: bold; text-shadow: 0 0 2px #000; background-color: #353535; }' +
                            '.svg_input.focus { border: 0.3em solid ' + focusBorderColor + '; transform: scale(1.1); }' +
                            '.svg_input .label { position: absolute; top: 1px; font-size: 10px; }' +
                            '.svg_input .value { position: absolute; bottom: 1px; font-size: 10px; }';
        document.head.appendChild(style);
    }

    function createSvgHtml(src, index) {
        var className = 'ani_loader_square selector';
        var content = '<img src="' + src + '" alt="Loader ' + index + '">';
        return '<div class="' + className + '" tabindex="0" title="Loader ' + index + '">' + content + '</div>';
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

    function aniLoad() {
        var icon_plugin = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><circle cx="12" cy="12" r="3"/><g><circle cx="4" cy="12" r="3"/><circle cx="20" cy="12" r="3"/><animateTransform attributeName="transform" type="rotate" calcMode="spline" dur="1s" keySplines=".36,.6,.31,1;.36,.6,.31,1" values="0 12 12;180 12 12;360 12 12" repeatCount="indefinite"/></g></svg>';

        try {
            Lampa.SettingsApi.addComponent({
                component: 'ani_load_menu',
                name: Lampa.Lang.translate('params_ani_name'),
                icon: icon_plugin
            });
        } catch (e) {}

        try {
            Lampa.SettingsApi.addParam({
                component: 'ani_load_menu',
                param: { name: 'ani_active', type: 'trigger', default: false },
                field: { name: Lampa.Lang.translate('params_ani_on') },
                onChange: function (item) {
                    Lampa.Storage.set('ani_active', item === 'true');
                    var selectItem = $('.settings-param[data-name="select_ani_mation"]');
                    if (selectItem.length) {
                        selectItem.css('display', item === 'true' ? 'block' : 'none');
                        if (item === 'true') {
                            if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                                setCustomLoader(Lampa.Storage.get('ani_load'));
                                insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                            } else {
                                insert_activity_loader_prv('./img/loader.svg');
                            }
                        } else {
                            remove_activity_loader();
                        }
                    }
                    if (Lampa.Settings && Lampa.Settings.render) {
                        Lampa.Settings.render();
                    }
                }
            });
        } catch (e) {}

        try {
            Lampa.SettingsApi.addParam({
                component: 'ani_load_menu',
                param: { name: 'select_ani_mation', type: 'button' },
                field: {
                    name: '<div class="settings-folder__icon" style="display: inline-block; vertical-align: middle; width: 23px; height: 24px; margin-right: 10px;"><div class="activity__loader_prv"></div></div>' + Lampa.Lang.translate('params_ani_select')
                },
                onRender: function (item) {
                    if (!Lampa.Storage.get('ani_active')) {
                        item.css('display', 'none');
                    } else {
                        item.css('display', 'block');
                        setTimeout(function () {
                            insert_activity_loader_prv(Lampa.Storage.get('ani_load', './img/loader.svg'));
                        }, 0);
                    }
                },
                onChange: function () {
                    if (!window.svg_loaders || window.svg_loaders.length === 0) return;

                    if (!Lampa.Template.get('ani_modal')) {
                        Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_picker_container">{ani_svg_content}</div></div>');
                    }

                    create_ani_modal();

                    var groupedLoaders = chunkArray(window.svg_loaders, 6);
                    var svgContent = groupedLoaders.map(function(group) {
                        var groupContent = group.map(function(loader, index) {
                            return createSvgHtml(loader, groupedLoaders.indexOf(group) * 6 + index + 1);
                        }).join('');
                        return '<div class="ani_loader_row">' + groupContent + '</div>';
                    });

                    var midPoint = Math.ceil(svgContent.length / 2);
                    var leftColumn = svgContent.slice(0, midPoint).join('');
                    var rightColumn = svgContent.slice(midPoint).join('');
                    var defaultLoader = applyDefaultLoaderColor();
                    var defaultButton = '<div class="ani_loader_square selector default" tabindex="0" title="' + Lampa.Lang.translate('default_loader') + '"><img src="' + defaultLoader.src + '"></div>';
                    var svgValue = Lampa.Storage.get('ani_load_custom_svg', '') || 'Наприклад https://example.com/loader.svg';
                    var inputHtml = '<div class="ani_loader_square selector svg_input" tabindex="0" style="width: 252px;">' +
                                    '<div class="label">' + Lampa.Lang.translate('custom_svg_input') + '</div>' +
                                    '<div class="value">' + svgValue + '</div>' +
                                    '</div>';

                    var topRowHtml = '<div style="display: flex; gap: 20px; padding: 0; justify-content: center; margin-bottom: 25px;">' +
                                     defaultButton + inputHtml + '</div>';

                    var modalContent = '<div class="ani_picker_container">' +
                                       '<div>' + leftColumn + '</div>' +
                                       '<div>' + rightColumn + '</div>' +
                                       '</div>';

                    var modalHtml = $('<div>' + topRowHtml + modalContent + '</div>');

                    try {
                        Lampa.Modal.open({
                            title: Lampa.Lang.translate('params_ani_select'),
                            size: 'medium',
                            align: 'center',
                            html: modalHtml,
                            className: 'ani_picker_modal',
                            onBack: function () {
                                Lampa.Modal.close();
                                Lampa.Controller.toggle('settings_component');
                                Lampa.Controller.enable('menu');
                            },
                            onSelect: function (a) {
                                if (a.length > 0 && a[0] instanceof HTMLElement) {
                                    var selectedElement = a[0];
                                    var srcValue;

                                    if (selectedElement.classList.contains('svg_input')) {
                                        Lampa.Noty.show(Lampa.Lang.translate('svg_input_hint'));
                                        Lampa.Modal.close();
                                        Lampa.Input.edit({
                                            name: 'ani_load_custom_svg',
                                            value: Lampa.Storage.get('ani_load_custom_svg', ''),
                                            placeholder: 'Наприклад https://example.com/loader.svg'
                                        }, function (value) {
                                            if (!value || !isValidSvgUrl(value)) {
                                                Lampa.Noty.show('Невірний формат URL SVG');
                                                return;
                                            }
                                            Lampa.Storage.set('ani_load_custom_svg', value);
                                            Lampa.Storage.set('ani_load', value);
                                            if (Lampa.Storage.get('ani_active')) {
                                                setCustomLoader(value);
                                                insert_activity_loader_prv(value);
                                            }
                                            Lampa.Controller.toggle('settings_component');
                                            Lampa.Controller.enable('menu');
                                        });
                                        return;
                                    } else if (selectedElement.classList.contains('default')) {
                                        srcValue = './img/loader.svg';
                                        Lampa.Storage.set('ani_load', '');
                                        remove_activity_loader();
                                    } else {
                                        var imgElement = selectedElement.querySelector('img');
                                        srcValue = imgElement ? imgElement.getAttribute('src') : Lampa.Storage.get('ani_load', './img/loader.svg');
                                        Lampa.Storage.set('ani_load', srcValue);
                                    }

                                    if (Lampa.Storage.get('ani_active') && srcValue !== './img/loader.svg') {
                                        setCustomLoader(Lampa.Storage.get('ani_load'));
                                        insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                                    } else {
                                        insert_activity_loader_prv('./img/loader.svg');
                                    }

                                    Lampa.Modal.close();
                                    Lampa.Controller.toggle('settings_component');
                                    Lampa.Controller.enable('menu');
                                }
                            }
                        });
                    } catch (e) {}
                }
            });
        } catch (e) {}

        // Усі оригінальні MutationObserver, setInterval, Listener — без змін
        setTimeout(function () {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(function (node) {
                            if (node.nodeType === 1 && (node.matches('.activity__loader') || node.matches('.lampac-balanser-loader') || node.matches('.player-video__loader') || node.matches('.loading-layer__ico') || node.matches('.modal-loading'))) {
                                if (Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                                    setTimeout(function () { setCustomLoader(Lampa.Storage.get('ani_load')); }, 200);
                                }
                            }
                        });
                    }
                });
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }, 500);

        if (Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        } else {
            remove_activity_loader();
        }
    }

    function byTheme() {
        if (Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        }
    }

    if (window.appready) {
        aniLoad();
        byTheme();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
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
