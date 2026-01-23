(function () {
    'use strict';

    Lampa.Lang.add({
        params_ani_on:        { ru: 'Включить',        en: 'Enable',           uk: 'Увімкнути' },
        params_ani_select:    { ru: 'Выбор анимации',  en: 'Select loading animation', uk: 'Вибір анімації завантаження' },
        params_ani_name:      { ru: 'Анимация Загрузки', en: 'Loading animation', uk: 'Анімація завантаження' },
        default_loader:       { ru: 'По умолчанию',    en: 'Default',          uk: 'За замовчуванням' },
        custom_svg_input:     { ru: 'Введи URL SVG',   en: 'Enter SVG URL',    uk: 'Введи URL SVG' },
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
            return decoded.indexOf('<filter') !== -1 || decoded.indexOf('feGaussianBlur') !== -1 || decoded.indexOf('feColorMatrix') !== -1;
        } catch (e) {
            return false;
        }
    }

    // ────────────────────────────────────────────────
    // Нова допоміжна функція — визначає, чи потрібен чорний колір для прев’ю
    // ────────────────────────────────────────────────
    function shouldUseBlackPreview() {
        var isGlass = document.body.classList.contains('glass--style');
        var mainColor = (Lampa.Storage.get('color_plugin_main_color') || '#ffffff').toLowerCase().trim();

        // Якщо скло + основний колір НЕ білий → робимо чорне прев’ю
        if (isGlass && mainColor !== '#ffffff' && mainColor !== '#fff') {
            return true;
        }
        return false;
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
        var filterValue = '';

        if (shouldUseBlackPreview()) {
            // Чорний колір
            filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22black_color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#black_color")';
        } else {
            // Білий колір (якщо SVG не має власного фільтра)
            if (!hasOwnFilter) {
                filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22white_color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#white_color")';
            }
        }

        if (!escapedUrl || escapedUrl === './img/loader.svg') {
            var defaultLoader = applyDefaultLoaderColor();
            escapedUrl = defaultLoader.src;
            filterValue = '';   // дефолтний лоадер уже білий
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
            'body.glass--style .settings-param.focus .settings-folder__icon {' +
                '-webkit-filter: none !important;' +
                'filter: invert(1) !important;' +
            '}';

        $('<style id="aniload-id-prv">' + newStyle + '</style>').appendTo('head');

        // Примусово застосовуємо фільтр, якщо елемент уже є в DOM
        setTimeout(function applyFilterToPrv() {
            var prv = document.querySelector('.settings-param[data-name="select_ani_mation"] .activity__loader_prv');
            if (prv) {
                prv.style.filter = filterValue;
                prv.style.webkitFilter = filterValue;
            } else {
                setTimeout(applyFilterToPrv, 300);
            }
        }, 100);
    }

    // ────────────────────────────────────────────────
    // Решта коду без змін (лише функція insert_activity_loader_prv була переписана)
    // ────────────────────────────────────────────────

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

    // ... (весь інший код — create_ani_modal, createSvgHtml, chunkArray, isValidSvgUrl, addPrvFocusListener, aniLoad, тощо) залишається без змін ...

    // При зміні кольору теми або скла — оновлюємо прев’ю
    Lampa.Storage.listener.follow('change', function (e) {
        if (e.name === 'color_plugin_main_color') {
            changeColor();
        }
    });

    // Також бажано реагувати на зміну класу body (glass--style)
    const bodyObserver = new MutationObserver(() => {
        if (Lampa.Storage.get('ani_active')) {
            insert_activity_loader_prv(Lampa.Storage.get('ani_load', './img/loader.svg'));
        }
    });
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Початкове застосування
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

})();
