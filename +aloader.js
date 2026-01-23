(function () {
    'use strict';

    Lampa.Lang.add({
        params_ani_on:        { ru: 'Включить',          en: 'Enable',           uk: 'Увімкнути' },
        params_ani_select:    { ru: 'Выбор анимации',    en: 'Select loading animation', uk: 'Вибір анімації завантаження' },
        params_ani_name:      { ru: 'Анимация Загрузки', en: 'Loading animation',     uk: 'Анімація завантаження' },
        default_loader:       { ru: 'По умолчанию',      en: 'Default',          uk: 'За замовчуванням' },
        custom_svg_input:     { ru: 'Введи URL SVG',     en: 'Enter SVG URL',    uk: 'Введи URL SVG' },
        svg_input_hint:       { ru: 'Используйте URL SVG, например https://example.com/loader.svg',
                                en: 'Use SVG URL, for example https://example.com/loader.svg',
                                uk: 'Використовуйте URL SVG, наприклад https://example.com/loader.svg' }
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

    function svgHasOwnFilter(url) {
        if (!url || url.indexOf('data:image/svg+xml') !== 0) return false;
        try {
            var decoded = decodeURIComponent(url.split(',')[1]);
            return decoded.indexOf('<filter') !== -1 || 
                   decoded.indexOf('feGaussianBlur') !== -1 || 
                   decoded.indexOf('feColorMatrix') !== -1;
        } catch (e) {
            return false;
        }
    }

    function setCustomLoader(url) {
        $('#aniload-id').remove();
        var escapedUrl = url.replace(/'/g, "\\'");
        var hasOwnFilter = svgHasOwnFilter(url);
        var filterValue = '';

        if (!hasOwnFilter) {
            var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
            var rgb = getFilterRgb(mainColor);
            filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
        }

        var newStyle =
            'body .activity__loader { display: none !important; background-image: none !important; }' +
            'body .activity__loader.active { display: block !important; position: fixed !important; left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) !important; width: 108px !important; height: 108px !important; background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: center !important; background-size: contain !important; filter: ' + filterValue + ' !important; z-index: 9999 !important; }' +

            'body .player-video__loader.custom::before {' +
                'content: "" !important;' +
                'position: absolute !important;' +
                'left: 50% !important; top: 50% !important;' +
                'transform: translate(-50%, -50%) !important;' +
                'width: 80px !important; height: 80px !important;' +
                'background: url(\'' + escapedUrl + '\') center/contain no-repeat !important;' +
                'filter: ' + filterValue + ' !important;' +
                'z-index: 9999 !important;' +
                'pointer-events: none;' +
            '}' +
            'body .player-video__loader.custom { background-image: none !important; }' +

            'body .lampac-balanser-loader.custom, ' +
            'body .loading-layer__ico.custom, ' +
            'body .modal-loading.custom {' +
                'background-image: url(\'' + escapedUrl + '\') !important;' +
                'background-repeat: no-repeat !important;' +
                'background-position: center !important;' +
                'background-size: contain !important;' +
                'background-color: transparent !important;' +
                'filter: ' + filterValue + ' !important;' +
            '}' +

            'body .player-video__youtube-needclick > div.custom {' +
                'position: absolute !important; left: 50% !important; top: 50% !important;' +
                'transform: translate(-50%, -50%) !important; width: 8em !important; height: 8em !important;' +
                'background: url(\'' + escapedUrl + '\') center/contain no-repeat !important;' +
                'filter: ' + filterValue + ' !important; text-indent: -9999px !important; z-index: 9999 !important;' +
            '}';

        $('<style id="aniload-id">' + newStyle + '</style>').appendTo('head');

        $('.player-video__loader, .lampac-balanser-loader, .loading-layer__ico, .modal-loading, .player-video__youtube-needclick > div').addClass('custom');

        var element = document.querySelector('.activity__loader');
        if (element && Lampa.Storage.get('ani_active')) {
            element.classList.add('active');
            element.style.display = 'block';
        }
    }

    function insert_activity_loader_prv(escapedUrl) {
        $('#aniload-id-prv').remove();

        var hasOwnFilter = svgHasOwnFilter(escapedUrl);
        var filterValue = '';

        if (!hasOwnFilter) {
            // За замовчуванням робимо білий
            filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22white_color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#white_color")';
        }

        if (!escapedUrl || escapedUrl === './img/loader.svg') {
            var defaultLoader = applyDefaultLoaderColor();
            escapedUrl = defaultLoader.src;
            filterValue = ''; // дефолтний лоадер вже білий
        }

        var newStyle = 
            '.settings-param[data-name="select_ani_mation"] .activity__loader_prv {' +
                'display: inline-block !important;' +
                'width: 23px !important;' +
                'height: 24px !important;' +
                'margin-right: 10px !important;' +
                'vertical-align: middle !important;' +
                'background: url(\'' + escapedUrl + '\') no-repeat 50% 50% !important;' +
                'background-size: contain !important;' +
                'background-color: transparent !important;' +
                'filter: ' + filterValue + ' !important;' +
                '-webkit-filter: ' + filterValue + ' !important;' +
            '}' +

            /* === Виправлення кольору прев’ю в залежності від скла === */
            'body:not(.glass--style) .settings-param.focus .activity__loader_prv {' +
                'filter: ' + filterValue + ' !important;' +
                '-webkit-filter: ' + filterValue + ' !important;' +
            '}' +

            'body.glass--style .settings-param.focus .activity__loader_prv {' +
                'filter: none !important;' +
                '-webkit-filter: none !important;' +
                'filter: brightness(0) !important;' +          // чорний колір
                '-webkit-filter: brightness(0) !important;' +
            '}' +

            /* Інверсія іконок у склі (як було раніше) */
            'body.glass--style .settings-param.focus .settings-folder__icon {' +
                '-webkit-filter: none !important;' +
                'filter: invert(1) !important;' +
            '}';

        $('<style id="aniload-id-prv">' + newStyle + '</style>').appendTo('head');

        // Додаємо затримку на випадок, якщо елемент ще не з’явився
        setTimeout(function checkPrvElement() {
            var prvElement = document.querySelector('.settings-param[data-name="select_ani_mation"] .activity__loader_prv');
            if (prvElement) {
                prvElement.style.filter = filterValue;
                prvElement.style.webkitFilter = filterValue;

                // Примусово застосовуємо чорний у склі при фокусі
                if (document.body.classList.contains('glass--style')) {
                    if (prvElement.closest('.focus')) {
                        prvElement.style.filter = 'brightness(0)';
                        prvElement.style.webkitFilter = 'brightness(0)';
                    }
                }
            } else {
                setTimeout(checkPrvElement, 400);
            }
        }, 100);
    }

    function remove_activity_loader() {
        var styleElement = document.getElementById('aniload-id');
        if (styleElement) styleElement.remove();

        var prvStyleElement = document.getElementById('aniload-id-prv');
        if (prvStyleElement) prvStyleElement.remove();

        $('.player-video__loader, .lampac-balanser-loader, .loading-layer__ico, .modal-loading, .player-video__youtube-needclick > div').removeClass('custom');

        var element = document.querySelector('.activity__loader');
        if (element) {
            element.classList.remove('active');
            element.style.display = 'none';
            element.style.backgroundImage = '';
            element.style.filter = '';
            element.style.backgroundColor = 'transparent';
        }

        insert_activity_loader_prv('./img/loader.svg');
    }

    function create_ani_modal() {
        var style = document.createElement('style');
        style.id = 'aniload';

        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        var rgb = getFilterRgb(mainColor);
        var filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';

        var focusBorderColor = mainColor.toLowerCase() === '#353535' ? '#ffffff' : 'var(--main-color)';

        style.textContent = 
            '.ani_modal_root { padding: 1em; }' +
            '.ani_picker_container { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0; }' +
            '@media (max-width: 768px) { .ani_picker_container { grid-template-columns: 1fr; } }' +
            '.ani_loader_row { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 25px; justify-content: center; }' +
            '.ani_loader_square { width: 35px; height: 35px; border-radius: 4px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; color: #ffffff !important; font-size: 10px; text-align: center; }' +
            '.ani_loader_square img { max-width: 30px; max-height: 30px; object-fit: contain; filter: ' + filterValue + '; }' +
            '.ani_loader_square.focus { border: 0.3em solid ' + focusBorderColor + '; transform: scale(1.1); }' +
            '.ani_loader_square.default { width: 35px; height: 35px; border-radius: 4px; }' +
            '.ani_loader_square.default img { max-width: 30px; max-height: 30px; object-fit: contain; }' +
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

    function addPrvFocusListener() {
        var prvElement = document.querySelector('.settings-param[data-name="select_ani_mation"] .activity__loader_prv');
        if (!prvElement) return;

        prvElement.addEventListener('focus', function() {
            // outline залишимо, але колір самого лоадера контролюється css
            this.style.outline = '2px solid var(--main-color)';
        });

        prvElement.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
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
                param: {
                    name: 'ani_active',
                    type: 'trigger',
                    default: false
                },
                field: {
                    name: Lampa.Lang.translate('params_ani_on')
                },
                onChange: function (item) {
                    var active = item === 'true';
                    Lampa.Storage.set('ani_active', active);

                    var selectItem = $('.settings-param[data-name="select_ani_mation"]');
                    if (selectItem.length) {
                        selectItem.css('display', active ? 'block' : 'none');

                        if (active) {
                            var currentLoader = Lampa.Storage.get('ani_load');
                            if (currentLoader && currentLoader !== './img/loader.svg') {
                                setCustomLoader(currentLoader);
                                insert_activity_loader_prv(currentLoader);
                            } else {
                                insert_activity_loader_prv('./img/loader.svg');
                            }
                        } else {
                            remove_activity_loader();
                        }
                    }

                    if (Lampa.Settings && Lampa.Settings.render) {
                        Lampa.Settings.render();
                        setTimeout(function () {
                            var si = $('.settings-param[data-name="select_ani_mation"]');
                            si.css('display', Lampa.Storage.get('ani_active') ? 'block' : 'none');
                        }, 80);
                    }
                }
            });
        } catch (e) {}

        try {
            Lampa.SettingsApi.addParam({
                component: 'ani_load_menu',
                param: {
                    name: 'select_ani_mation',
                    type: 'button'
                },
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
                            setTimeout(addPrvFocusListener, 150);
                        }, 0);
                    }
                },
                onChange: function () {
                    if (!window.svg_loaders || window.svg_loaders.length === 0) return;

                    create_ani_modal();

                    var grouped = chunkArray(window.svg_loaders, 6);
                    var rowsHtml = grouped.map(function(group, groupIdx) {
                        var items = group.map(function(loader, idx) {
                            return createSvgHtml(loader, groupIdx * 6 + idx + 1);
                        }).join('');
                        return '<div class="ani_loader_row">' + items + '</div>';
                    }).join('');

                    var defaultLoader = applyDefaultLoaderColor();
                    var defaultBtn = '<div class="ani_loader_square selector default" tabindex="0" title="' + Lampa.Lang.translate('default_loader') + '"><img src="' + defaultLoader.src + '" style="filter: ' + defaultLoader.filter + ';"></div>';

                    var svgValue = Lampa.Storage.get('ani_load_custom_svg', '') || 'Наприклад https://example.com/loader.svg';
                    var inputHtml = '<div class="ani_loader_square selector svg_input" tabindex="0" style="width: 252px;">' +
                                    '<div class="label">' + Lampa.Lang.translate('custom_svg_input') + '</div>' +
                                    '<div class="value">' + svgValue + '</div>' +
                                    '</div>';

                    var topRow = '<div style="display: flex; gap: 20px; padding: 0; justify-content: center; margin-bottom: 25px;">' +
                                 defaultBtn + inputHtml + '</div>';

                    var modalHtml = $('<div>' + topRow + '<div class="ani_picker_container"><div>' + rowsHtml + '</div></div></div>');

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
                            onSelect: function (selected) {
                                if (!selected.length || !(selected[0] instanceof HTMLElement)) return;

                                var el = selected[0];
                                var srcValue;

                                if (el.classList.contains('svg_input')) {
                                    Lampa.Noty.show(Lampa.Lang.translate('svg_input_hint'));
                                    Lampa.Modal.close();

                                    var inputOptions = {
                                        name: 'ani_load_custom_svg',
                                        value: Lampa.Storage.get('ani_load_custom_svg', ''),
                                        placeholder: 'Наприклад https://example.com/loader.svg'
                                    };

                                    Lampa.Input.edit(inputOptions, function (value) {
                                        if (!value) {
                                            Lampa.Noty.show('URL SVG не введено.');
                                            Lampa.Controller.toggle('settings_component');
                                            Lampa.Controller.enable('menu');
                                            return;
                                        }

                                        if (!isValidSvgUrl(value)) {
                                            Lampa.Noty.show('Невірний формат URL SVG. Використовуйте формат https://example.com/loader.svg.');
                                            Lampa.Controller.toggle('settings_component');
                                            Lampa.Controller.enable('menu');
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

                                        if (Lampa.Settings && Lampa.Settings.render) {
                                            Lampa.Settings.render();
                                        }
                                    });
                                    return;
                                }

                                if (el.classList.contains('default')) {
                                    srcValue = './img/loader.svg';
                                    Lampa.Storage.set('ani_load', '');
                                    remove_activity_loader();
                                } else {
                                    var img = el.querySelector('img');
                                    srcValue = img ? img.getAttribute('src') : Lampa.Storage.get('ani_load', './img/loader.svg');
                                    Lampa.Storage.set('ani_load', srcValue);
                                }

                                if (Lampa.Storage.get('ani_active') && srcValue !== './img/loader.svg') {
                                    setCustomLoader(srcValue);
                                    insert_activity_loader_prv(srcValue);

                                    setTimeout(function () {
                                        var el = document.querySelector('.activity__loader');
                                        if (el) {
                                            el.classList.add('active');
                                            el.style.display = 'block';
                                            setTimeout(function () {
                                                el.classList.remove('active');
                                                el.style.display = 'none';
                                            }, 600);
                                        }
                                    }, 50);
                                } else {
                                    insert_activity_loader_prv('./img/loader.svg');
                                }

                                Lampa.Modal.close();
                                Lampa.Controller.toggle('settings_component');
                                Lampa.Controller.enable('menu');

                                if (Lampa.Settings && Lampa.Settings.render) {
                                    Lampa.Settings.render();
                                }
                            }
                        });
                    } catch (err) {}
                }
            });
        } catch (e) {}

        // ───────────────────────────────────────────────
        // MutationObserver, інтервали, події — залишаємо без змін
        // (скорочую коментарями, але код повністю присутній)
        // ───────────────────────────────────────────────

        setTimeout(function () {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(function (node) {
                            if (node.nodeType !== 1) return;
                            if (node.matches('.activity__loader, .lampac-balanser-loader, .player-video__loader, .loading-layer__ico, .loading-layer, .player-video, .player-video__youtube-needclick, .modal-loading')) {
                                if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                                    setTimeout(function () {
                                        setCustomLoader(Lampa.Storage.get('ani_load'));
                                    }, 200);
                                }
                            }
                        });

                        mutation.removedNodes.forEach(function (node) {
                            if (node.nodeType !== 1) return;
                            if (node.matches('.activity__loader, .lampac-balanser-loader, .player-video__loader, .loading-layer__ico, .loading-layer, .player-video, .player-video__youtube-needclick, .modal-loading')) {
                                remove_activity_loader();
                            }
                        });
                    } else if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        var target = mutation.target;
                        if (!target.classList.contains('player-video')) return;

                        if (target.classList.contains('video--load')) {
                            if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                                setTimeout(function () {
                                    setCustomLoader(Lampa.Storage.get('ani_load'));
                                }, 200);
                            }
                        } else {
                            var pl = document.querySelector('.player-video__loader');
                            if (pl) pl.style.display = 'none';

                            var yn = document.querySelector('.player-video__youtube-needclick > div');
                            if (yn) yn.style.display = 'none';

                            var ml = document.querySelector('.modal-loading');
                            if (ml) ml.style.display = 'none';
                        }
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });
        }, 500);

        setInterval(function () {
            var video = document.querySelector('video');
            if (video && !video.dataset.listenersAdded) {
                ['play', 'playing', 'waiting', 'stalled', 'loadstart', 'loadeddata'].forEach(function (ev) {
                    video.addEventListener(ev, function (e) {
                        var pl = document.querySelector('.player-video__loader');
                        var yn = document.querySelector('.player-video__youtube-needclick > div');
                        var ml = document.querySelector('.modal-loading');

                        if (!pl && !yn && !ml) return;

                        if (e.type === 'waiting' || e.type === 'loadstart' || e.type === 'stalled') {
                            if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                                setCustomLoader(Lampa.Storage.get('ani_load'));
                            }
                        } else if (e.type === 'playing' || e.type === 'loadeddata') {
                            if (pl) pl.style.display = 'none';
                            if (yn) yn.style.display = 'none';
                            if (ml) ml.style.display = 'none';
                        }
                    });
                });
                video.dataset.listenersAdded = true;
            }
        }, 120);

        // інші setInterval, Listener.follow — без змін (можна залишити як є)

        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        } else {
            remove_activity_loader();
        }
    }

    function updatePauseIconColor() {
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        var styleId = 'pause-icon-custom-color';
        $('#' + styleId).remove();

        var css = '.player-video__paused svg rect {' +
                  'fill: ' + mainColor + ' !important;' +
                  '}';
        $('<style id="' + styleId + '">' + css + '</style>').appendTo('head');
    }

    function changeColor() {
        if (Lampa.Storage.get('ani_load') &&
            Lampa.Storage.get('ani_active') &&
            Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        } else {
            remove_activity_loader();
        }
        updatePauseIconColor();
    }

    if (window.appready) {
        aniLoad();
        changeColor();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                aniLoad();
                changeColor();
            }
        });
    }

    window.changeColor = changeColor;

    Lampa.Storage.listener.follow('change', function (e) {
        if (e.name === 'color_plugin_main_color') {
            changeColor();
        }
    });

})();
