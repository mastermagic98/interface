(function () {
    'use strict';

    Lampa.Lang.add({
        ani_load_name: { 
            ru: 'Анімація завантаження', 
            en: 'Loading animation', 
            uk: 'Анімація завантаження' 
        },
        ani_load_desc: { 
            ru: 'Змінює вигляд іконки завантаження', 
            en: 'Changes the loading icon appearance', 
            uk: 'Змінює вигляд іконки завантаження' 
        },
        ani_load_enable: { 
            ru: 'Увімкнути', 
            en: 'Enable', 
            uk: 'Увімкнути' 
        },
        ani_load_select: { 
            ru: 'Вибір анімації', 
            en: 'Select loading animation', 
            uk: 'Вибір анімації завантаження' 
        },
        default_loader: { 
            ru: 'За замовчуванням', 
            en: 'Default', 
            uk: 'За замовчуванням' 
        },
        custom_svg_input: { 
            ru: 'Введіть URL SVG', 
            en: 'Enter SVG URL', 
            uk: 'Введіть URL SVG' 
        },
        svg_input_hint: { 
            ru: 'Використовуйте URL SVG, наприклад https://example.com/loader.svg', 
            en: 'Use SVG URL, for example https://example.com/loader.svg', 
            uk: 'Використовуйте URL SVG, наприклад https://example.com/loader.svg' 
        }
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
            return decoded.indexOf('<filter') !== -1 || decoded.indexOf('feGaussianBlur') !== -1 || decoded.indexOf('feColorMatrix') !== -1;
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
            'body .lampac-balanser-loader.custom, body .loading-layer__ico.custom, body .modal-loading.custom {' +
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
        var whiteFilterValue = hasOwnFilter ? '' : 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22white_color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#white_color")';
        if (!escapedUrl || escapedUrl === './img/loader.svg') {
            var defaultLoader = applyDefaultLoaderColor();
            escapedUrl = defaultLoader.src;
            whiteFilterValue = '';
        }
        var newStyle = '.settings-param[data-name="select_ani_mation"] .activity__loader_prv { display: inline-block; width: 23px; height: 24px; margin-right: 10px; vertical-align: middle; background: url(\'' + escapedUrl + '\') no-repeat 50% 50%; background-size: contain; background-color: transparent !important; filter: ' + whiteFilterValue + ' !important; -webkit-filter: ' + whiteFilterValue + ' !important; }' +
                       'body.glass--style .settings-param.focus .settings-folder__icon .activity__loader_prv { -webkit-filter: none !important; filter: none !important; }';
        $('<style id="aniload-id-prv">' + newStyle + '</style>').appendTo('head');
        setTimeout(function checkPrvElement() {
            var prvElement = document.querySelector('.settings-param[data-name="select_ani_mation"] .activity__loader_prv');
            if (prvElement) {
                prvElement.style.filter = whiteFilterValue;
                prvElement.style.webkitFilter = whiteFilterValue;
            } else {
                setTimeout(checkPrvElement, 500);
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
        style.textContent = '.ani_modal_root { padding: 1em; }' +
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
        return /^https?:\/\/.*\.svg$/.test(url);
    }

    function aniLoad() {
        var icon_plugin = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32" fill="currentColor" style="margin-right:10px;flex-shrink:0;min-width:24px;min-height:24px;max-width:24px;max-height:24px"><circle cx="16" cy="16" r="3"/><g><circle cx="8" cy="16" r="3"/><circle cx="24" cy="16" r="3"/><animateTransform attributeName="transform" type="rotate" calcMode="spline" dur="1s" keySplines=".36,.6,.31,1;.36,.6,.31,1" values="0 16 16;180 16 16;360 16 16" repeatCount="indefinite"/></g></svg>';

        if (Lampa.SettingsApi) {
            try {
                // Перемикач увімкнення анімації
                Lampa.SettingsApi.addParam({
                    component: 'interface_customization',
                    param: {
                        name: 'ani_active',
                        type: 'trigger',
                        default: false
                    },
                    field: {
                        name: '<div style="display: flex; align-items: center;">' + icon_plugin + Lampa.Lang.translate('ani_load_name') + '</div>',
                        description: Lampa.Lang.translate('ani_load_desc')
                    },
                    onChange: function (value) {
                        Lampa.Storage.set('ani_active', value);
                        var selectItem = $('.settings-param[data-name="select_ani_mation"]');
                        if (selectItem.length) {
                            selectItem.toggle(value);
                        }
                        if (value) {
                            var savedUrl = Lampa.Storage.get('ani_load', './img/loader.svg');
                            if (savedUrl && savedUrl !== './img/loader.svg') {
                                setCustomLoader(savedUrl);
                                insert_activity_loader_prv(savedUrl);
                            } else {
                                insert_activity_loader_prv('./img/loader.svg');
                            }
                        } else {
                            remove_activity_loader();
                        }
                    }
                });

                // Кнопка вибору анімації
                Lampa.SettingsApi.addParam({
                    component: 'interface_customization',
                    param: {
                        name: 'select_ani_mation',
                        type: 'button'
                    },
                    field: {
                        name: '<div class="settings-folder__icon" style="display: inline-block; vertical-align: middle; width: 32px; height: 32px; margin-right: 10px;"><div class="activity__loader_prv"></div></div>' + Lampa.Lang.translate('ani_load_select')
                    },
                    onRender: function (item) {
                        item.toggle(Lampa.Storage.get('ani_active', false));
                        if (Lampa.Storage.get('ani_active', false)) {
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
                        var svgContent = groupedLoaders.map(function(group, groupIndex) {
                            var groupContent = group.map(function(loader, index) {
                                return createSvgHtml(loader, groupIndex * 6 + index + 1);
                            }).join('');
                            return '<div class="ani_loader_row">' + groupContent + '</div>';
                        });

                        var midPoint = Math.ceil(svgContent.length / 2);
                        var leftColumn = svgContent.slice(0, midPoint).join('');
                        var rightColumn = svgContent.slice(midPoint).join('');

                        var defaultLoader = applyDefaultLoaderColor();
                        var defaultButton = '<div class="ani_loader_square selector default" tabindex="0" title="' + Lampa.Lang.translate('default_loader') + '"><img src="' + defaultLoader.src + '" style="filter: ' + defaultLoader.filter + ';"></div>';

                        var svgValue = Lampa.Storage.get('ani_load_custom_svg', '') || Lampa.Lang.translate('custom_svg_input');
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

                        Lampa.Modal.open({
                            title: Lampa.Lang.translate('ani_load_select'),
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

                                        var inputOptions = {
                                            name: 'ani_load_custom_svg',
                                            value: Lampa.Storage.get('ani_load_custom_svg', ''),
                                            placeholder: 'https://example.com/loader.svg'
                                        };

                                        Lampa.Input.edit(inputOptions, function (value) {
                                            if (!value) {
                                                Lampa.Noty.show('URL SVG не введено.');
                                                return;
                                            }
                                            if (!isValidSvgUrl(value)) {
                                                Lampa.Noty.show('Невірний формат URL SVG.');
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
                                        setCustomLoader(srcValue);
                                        insert_activity_loader_prv(srcValue);
                                    } else {
                                        insert_activity_loader_prv('./img/loader.svg');
                                    }

                                    Lampa.Modal.close();
                                    Lampa.Controller.toggle('settings_component');
                                    Lampa.Controller.enable('menu');
                                }
                            }
                        });
                    }
                });
            } catch (e) {
                console.error('SettingsApi error:', e);
            }
        }

        // Решта логіки плагіну (спостереження, інтервали тощо) залишається без змін
        setTimeout(function () {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(function (node) {
                            if (node.nodeType === 1 && (node.matches('.activity__loader') || node.matches('.lampac-balanser-loader') || node.matches('.player-video__loader') || node.matches('.loading-layer__ico') || node.matches('.loading-layer') || node.matches('.player-video') || node.matches('.player-video__youtube-needclick') || node.matches('.modal-loading'))) {
                                if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                                    setTimeout(function () {
                                        setCustomLoader(Lampa.Storage.get('ani_load'));
                                    }, 200);
                                }
                            }
                        });
                        mutation.removedNodes.forEach(function (node) {
                            if (node.nodeType === 1 && (node.matches('.activity__loader') || node.matches('.lampac-balanser-loader') || node.matches('.player-video__loader') || node.matches('.loading-layer__ico') || node.matches('.loading-layer') || node.matches('.player-video') || node.matches('.player-video__youtube-needclick') || node.matches('.modal-loading'))) {
                                remove_activity_loader();
                            }
                        });
                    } else if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (mutation.target.classList.contains('player-video') && mutation.target.classList.contains('video--load')) {
                            if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                                setTimeout(function () {
                                    setCustomLoader(Lampa.Storage.get('ani_load'));
                                }, 200);
                            }
                        }
                    }
                });
            });
            observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
        }, 500);

        // Інші інтервали та слухачі без змін...
        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        } else {
            remove_activity_loader();
        }

        function changeColor() {
            if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                setCustomLoader(Lampa.Storage.get('ani_load'));
                insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
            } else {
                remove_activity_loader();
            }
            updatePauseIconColor();
        }

        function updatePauseIconColor() {
            var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
            var styleId = 'pause-icon-custom-color';
            $('#' + styleId).remove();
            var css = '.player-video__paused svg rect { fill: ' + mainColor + ' !important; }';
            $('<style id="' + styleId + '">' + css + '</style>').appendTo('head');
        }

        updatePauseIconColor();

        Lampa.Storage.listener.follow('change', function (e) {
            if (e.name === 'color_plugin_main_color') {
                changeColor();
            }
        });

        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'start' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                setTimeout(function () { setCustomLoader(Lampa.Storage.get('ani_load')); }, 200);
            }
        });
    }

    if (window.appready) {
        aniLoad();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                aniLoad();
            }
        });
    }
})();
