(function () {
    'use strict';
    Lampa.Lang.add({
        params_ani_on: { ru: 'Заменить иконку загрузчика', en: 'Replace loading icon', uk: 'Замінити іконку завантажувача' },
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
        var colorEnabled = Lampa.Storage.cache.hasOwnProperty('color_plugin_main_color');
        var mainColor = colorEnabled ? Lampa.Storage.get('color_plugin_main_color', '#ffffff') : '#ffffff';
        var defaultSvg = '<?xml version="1.0" encoding="utf-8"?>' +
                         '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="94px" height="94px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">' +
                         '<circle cx="50" cy="50" fill="none" stroke="' + mainColor + '" stroke-width="5" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">' +
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
    function getCurrentLoaderUrl() {
        var stored = Lampa.Storage.get('ani_load', '');
        if (stored && stored !== './img/loader.svg') {
            return stored;
        }
        return applyDefaultLoaderColor().src;
    }
    function setCustomLoader(url) {
        $('#aniload-id').remove();
        var escapedUrl = url.replace(/'/g, "\\'");
        var hasOwnFilter = svgHasOwnFilter(url);
        var colorEnabled = Lampa.Storage.cache.hasOwnProperty('color_plugin_main_color');
        var mainColor = colorEnabled ? Lampa.Storage.get('color_plugin_main_color', '#ffffff') : '#ffffff';
        var rgb = getFilterRgb(mainColor);
        var filterValue = '';
        if (!hasOwnFilter && colorEnabled) {
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
    }
    function insert_activity_loader_prv(url) {
        $('#aniload-id-prv').remove();
        var escapedUrl = url.replace(/'/g, "\\'");
        var hasOwnFilter = svgHasOwnFilter(url);
        var colorEnabled = Lampa.Storage.cache.hasOwnProperty('color_plugin_main_color');
        var mainColor = colorEnabled ? Lampa.Storage.get('color_plugin_main_color', '#ffffff') : '#ffffff';
        var rgb = getFilterRgb(mainColor);
        var colorFilter = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22prv_color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#prv_color")';
        var whiteFilter = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22white_color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#white_color")';
        var baseFilter = hasOwnFilter ? '' : (colorEnabled ? colorFilter : whiteFilter);
        if (!url || url === './img/loader.svg') {
            var defaultLoader = applyDefaultLoaderColor();
            escapedUrl = defaultLoader.src;
            baseFilter = '';
        }
        var focusWhiteStyle = '';
        if (colorEnabled) {
            focusWhiteStyle = 'body .settings-param.focus .settings-folder__icon .activity__loader_prv {' +
                              'filter: ' + whiteFilter + ' !important;' +
                              '-webkit-filter: ' + whiteFilter + ' !important;' +
                              '}';
        }
        var glassFocusStyle = '';
        if (document.body.classList.contains('glass--style') && !colorEnabled) {
            var tempElement = $('<div class="settings-param focus"></div>').appendTo('body');
            var computedStyle = window.getComputedStyle(tempElement[0]);
            var bgColor = computedStyle.backgroundColor;
            tempElement.remove();
            var isFocusBgWhite = bgColor === 'rgb(255, 255, 255)';
            if (isFocusBgWhite) {
                glassFocusStyle = 'body.glass--style .settings-param.focus .settings-folder__icon .activity__loader_prv {' +
                                  'filter: invert(1) !important;' +
                                  '-webkit-filter: invert(1) !important;' +
                                  '}';
            }
        }
        var newStyle = '.settings-param[data-name="select_ani_mation"] .activity__loader_prv { display: inline-block; width: 23px; height: 24px; margin-right: 10px; vertical-align: middle; background: url(\'' + escapedUrl + '\') no-repeat 50% 50%; background-size: contain; background-color: transparent !important; filter: ' + baseFilter + ' !important; -webkit-filter: ' + baseFilter + ' !important; }' +
                       focusWhiteStyle + glassFocusStyle;
        $('<style id="aniload-id-prv">' + newStyle + '</style>').appendTo('head');
        setTimeout(function checkPrvElement() {
            var prvElement = document.querySelector('.settings-param[data-name="select_ani_mation"] .activity__loader_prv');
            if (prvElement) {
                prvElement.style.filter = baseFilter;
                prvElement.style.webkitFilter = baseFilter;
            } else {
                setTimeout(checkPrvElement, 500);
            }
        }, 100);
    }
    function remove_activity_loader() {
        $('#aniload-id').remove();
        $('#aniload-id-prv').remove();
        $('.player-video__loader, .lampac-balanser-loader, .loading-layer__ico, .modal-loading, .player-video__youtube-needclick > div').removeClass('custom');
    }
    function applyCurrentLoader() {
        remove_activity_loader();
        if (Lampa.Storage.get('ani_active')) {
            var url = getCurrentLoaderUrl();
            setCustomLoader(url);
            insert_activity_loader_prv(url);
        }
    }
    function create_ani_modal() {
        $('#aniload').remove();
        var style = document.createElement('style');
        style.id = 'aniload';
        var colorEnabled = Lampa.Storage.cache.hasOwnProperty('color_plugin_main_color');
        var mainColor = colorEnabled ? Lampa.Storage.get('color_plugin_main_color', '#ffffff') : '#ffffff';
        var rgb = getFilterRgb(mainColor);
        var colorFilter = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
        var whiteFilter = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22white_color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#white_color")';
        var filterValue = colorEnabled ? colorFilter : whiteFilter;
        var focusBorderColor = mainColor;
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
                    Lampa.Storage.set('ani_active', item === 'true');
                    applyCurrentLoader();
                    var selectItem = $('.settings-param[data-name="select_ani_mation"]');
                    if (selectItem.length) {
                        selectItem.css('display', Lampa.Storage.get('ani_active') ? 'block' : 'none');
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
                            insert_activity_loader_prv(getCurrentLoaderUrl());
                        }, 0);
                    }
                },
                onChange: function () {
                    if (!window.svg_loaders || window.svg_loaders.length === 0) {
                        return;
                    }
                    if (!Lampa.Template.get('ani_modal')) {
                        Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_picker_container">{ani_svg_content}</div></div>');
                    }
                    create_ani_modal();
                    var groupedLoaders = chunkArray(window.svg_loaders, 6);
                    var svgContent = groupedLoaders.map(function(group) {
                        var groupContent = group.map(function(loader, index) {
                            return createSvgHtml(loader, groupedLoaders.indexOf
