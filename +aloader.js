(function () {
    'use strict';

    // Переклади
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

        var colorEnabled = Lampa.Storage.get('color_plugin_enabled', 'false') === 'true';
        var mainColor = colorEnabled ? Lampa.Storage.get('color_plugin_main_color', '#353535') : '#ffffff';
        var rgb = getFilterRgb(mainColor);

        var escapedUrl = url.replace(/'/g, "\\'");
        var hasOwnFilter = svgHasOwnFilter(url);

        var filterValue = '';
        if (!hasOwnFilter && colorEnabled) {
            filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
        }

        var newStyle =
            // Приховуємо стандартні завантажувачі та текст
            'body .activity__loader { display: none !important; background-image: none !important; color: transparent !important; }' +
            'body .activity__loader.active { display: block !important; position: fixed !important; left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) !important; width: 108px !important; height: 108px !important; background-image: url(\'' + escapedUrl + '\') !important; background-repeat: no-repeat !important; background-position: center !important; background-size: contain !important; filter: ' + filterValue + ' !important; z-index: 9999 !important; color: transparent !important; }' +

            // Плеєр
            'body .player-video__loader.custom { background-image: none !important; color: transparent !important; }' +
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

            // Модальне завантаження (приховуємо текст "Завантаження...")
            'body .modal-loading.custom { background-image: none !important; color: transparent !important; }' +
            'body .modal-loading.custom::before {' +
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

            // Інші завантажувачі
            'body .lampac-balanser-loader.custom, ' +
            'body .loading-layer__ico.custom, ' +
            'body .player-video__youtube-needclick > div.custom {' +
                'background-image: url(\'' + escapedUrl + '\') !important;' +
                'background-repeat: no-repeat !important;' +
                'background-position: center !important;' +
                'background-size: contain !important;' +
                'background-color: transparent !important;' +
                'filter: ' + filterValue + ' !important;' +
                'color: transparent !important;' +
            '}';

        $('<style id="aniload-id">' + newStyle + '</style>').appendTo('head');

        // Додаємо клас custom усім можливим завантажувачам
        $('.player-video__loader, .lampac-balanser-loader, .loading-layer__ico, .modal-loading, .player-video__youtube-needclick > div, .activity__loader').addClass('custom');

        var element = document.querySelector('.activity__loader');
        if (element && Lampa.Storage.get('ani_active')) {
            element.classList.add('active');
            element.style.display = 'block';
        }
    }

    function insert_activity_loader_prv(escapedUrl) {
        $('#aniload-id-prv').remove();

        var colorEnabled = Lampa.Storage.get('color_plugin_enabled', 'false') === 'true';
        var mainColor = colorEnabled ? Lampa.Storage.get('color_plugin_main_color', '#353535') : '#ffffff';
        var rgb = getFilterRgb(mainColor);

        var filterValue = '';
        if (colorEnabled) {
            var hasOwnFilter = svgHasOwnFilter(escapedUrl);
            if (!hasOwnFilter) {
                filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
            }
        }

        if (!escapedUrl || escapedUrl === './img/loader.svg') {
            var defaultLoader = applyDefaultLoaderColor();
            escapedUrl = defaultLoader.src;
            filterValue = '';
        }

        var newStyle = '.settings-param[data-name="select_ani_mation"] .activity__loader_prv {' +
                       'display: inline-block; width: 23px; height: 24px; margin-right: 10px; vertical-align: middle;' +
                       'background: url(\'' + escapedUrl + '\') no-repeat 50% 50%; background-size: contain;' +
                       'background-color: transparent !important; filter: ' + filterValue + ' !important; -webkit-filter: ' + filterValue + ' !important; }' +
                       'body.glass--style .settings-param.focus .settings-folder__icon .activity__loader_prv {' +
                       '-webkit-filter: none !important; filter: none !important; }';

        $('<style id="aniload-id-prv">' + newStyle + '</style>').appendTo('head');

        setTimeout(function checkPrvElement() {
            var prvElement = document.querySelector('.settings-param[data-name="select_ani_mation"] .activity__loader_prv');
            if (prvElement) {
                prvElement.style.filter = filterValue;
                prvElement.style.webkitFilter = filterValue;
            } else {
                setTimeout(checkPrvElement, 500);
            }
        }, 100);
    }

    function remove_activity_loader() {
        $('#aniload-id').remove();
        $('#aniload-id-prv').remove();

        $('.player-video__loader, .lampac-balanser-loader, .loading-layer__ico, .modal-loading, .player-video__youtube-needclick > div, .activity__loader').removeClass('custom');

        var element = document.querySelector('.activity__loader');
        if (element) {
            element.classList.remove('active');
            element.style.display = 'none';
            element.style.backgroundImage = '';
            element.style.filter = '';
        }

        insert_activity_loader_prv('./img/loader.svg');
    }

    function create_ani_modal() {
        var style = document.createElement('style');
        style.id = 'aniload-modal';

        var colorEnabled = Lampa.Storage.get('color_plugin_enabled', 'false') === 'true';
        var mainColor = colorEnabled ? Lampa.Storage.get('color_plugin_main_color', '#353535') : '#ffffff';
        var rgb = getFilterRgb(mainColor);

        var filterValue = colorEnabled ? 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")' : '';

        var focusBorderColor = mainColor.toLowerCase() === '#353535' ? '#ffffff' : mainColor;

        style.textContent = '.ani_modal_root { padding: 1em; }' +
                            '.ani_picker_container { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0; }' +
                            '@media (max-width: 768px) { .ani_picker_container { grid-template-columns: 1fr; } }' +
                            '.ani_loader_row { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 25px; justify-content: center; }' +
                            '.ani_loader_square { width: 35px; height: 35px; border-radius: 4px; display: flex; flex-direction: column; justify-content: center; align-items: center; cursor: pointer; color: #ffffff !important; font-size: 10px; text-align: center; }' +
                            '.ani_loader_square img { max-width: 30px; max-height: 30px; object-fit: contain; filter: ' + filterValue + '; }' +
                            '.ani_loader_square.focus { border: 0.3em solid ' + focusBorderColor + '; transform: scale(1.1); }' +
                            '.ani_loader_square.default img { max-width: 30px; max-height: 30px; object-fit: contain; }' +
                            '.svg_input { width: 252px; height: 35px; border-radius: 8px; border: 2px solid #ddd; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff !important; font-size: 12px; font-weight: bold; text-shadow: 0 0 2px #000; background-color: #353535; }' +
                            '.svg_input.focus { border: 0.3em solid ' + focusBorderColor + '; transform: scale(1.1); }' +
                            '.svg_input .label { position: absolute; top: 1px; font-size: 10px; }' +
                            '.svg_input .value { position: absolute; bottom: 1px; font-size: 10px; }';

        document.head.appendChild(style);
    }

    // Решта функцій (createSvgHtml, chunkArray, isValidSvgUrl, aniLoad тощо) залишаються без змін, окрім викликів changeColor()

    function changeColor() {
        if (Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        } else {
            remove_activity_loader();
        }
    }

    if (window.appready) {
        aniLoad();
        changeColor();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                aniLoad();
                changeColor();
            }
        });
    }

    Lampa.Storage.listener.follow('change', function (e) {
        if (e.name.startsWith('color_plugin_') || e.name.startsWith('ani_')) {
            changeColor();
        }
    });

    window.changeColor = changeColor;
})();
