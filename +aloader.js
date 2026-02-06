(function () {
    'use strict';

    // --- Додавання перекладів ---
    Lampa.Lang.add({
        params_ani_on: { ru: 'Включить', en: 'Enable', uk: 'Увімкнути' },
        params_ani_select: { ru: 'Выбор анимации', en: 'Select loading animation', uk: 'Вибір анімації завантаження' },
        params_ani_name: { ru: 'Анимация Загрузки', en: 'Loading animation', uk: 'Анімація завантаження' },
        default_loader: { ru: 'По умолчанию', en: 'Default', uk: 'За замовчуванням' },
        custom_svg_input: { ru: 'Введи URL SVG', en: 'Enter SVG URL', uk: 'Введи URL SVG' },
        svg_input_hint: { ru: 'Используйте URL SVG, например https://example.com/loader.svg', en: 'Use SVG URL, for example https://example.com/loader.svg', uk: 'Використовуйте URL SVG, наприклад https://example.com/loader.svg' }
    });

    // --- Шаблон модалки ---
    if (!Lampa.Template.get('ani_modal')) {
        Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_picker_container">{ani_svg_content}</div></div>');
    }

    // --- Функції кольору ---
    function hexToRgb(hex) {
        var cleanHex = hex.replace('#', '');
        return {
            r: parseInt(cleanHex.substring(0, 2), 16),
            g: parseInt(cleanHex.substring(2, 4), 16),
            b: parseInt(cleanHex.substring(4, 6), 16)
        };
    }

    function getFilterRgb(mainColor) {
        return mainColor.toLowerCase() === '#353535' ? { r: 255, g: 255, b: 255 } : hexToRgb(mainColor);
    }

    // --- Стандартний лоадер ---
    function applyDefaultLoaderColor() {
        var defaultSvg = '<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" style="margin:auto;background:none;display:block;shape-rendering:auto;" width="94px" height="94px" viewBox="0 0 100 100"><circle cx="50" cy="50" fill="none" stroke="#ffffff" stroke-width="5" r="35" stroke-dasharray="164.93361431346415 56.97787143782138"><animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform></circle></svg>';
        return { src: 'data:image/svg+xml,' + encodeURIComponent(defaultSvg), filter: '' };
    }

    // --- Встановлення кастомного лоадера ---
    function setCustomLoader(url) {
        if (!url) url = './img/loader.svg';
        $('#aniload-id').remove();

        var colorEnabled = Lampa.Storage.get('color_plugin_enabled', 'false') === 'true';
        var mainColor = colorEnabled ? Lampa.Storage.get('color_plugin_main_color', '#353535') : '#ffffff';
        var rgb = getFilterRgb(mainColor);

        var filterValue = '';
        if (colorEnabled) {
            filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';
        }

        var escapedUrl = url.replace(/'/g, "\\'");
        var styleContent = `
            body .activity__loader,
            body .lampac-balanser-loader,
            body .player-video .player-video__loader,
            body .loading-layer__ico,
            body .player-video__youtube-needclick > div,
            body .modal-loading {
                background-image: url('${escapedUrl}') !important;
                background-repeat: no-repeat !important;
                background-position: 50% 50% !important;
                background-size: contain !important;
                background-color: transparent !important;
                filter: ${filterValue} !important;
                display: block !important;
                z-index: 9999 !important;
            }
            body .player-video__loader:not(.custom),
            body .loading-layer__ico:not(.custom) {
                background-image: none !important;
                display: none !important;
            }
        `;
        $('<style id="aniload-id">' + styleContent + '</style>').appendTo('head');

        // Додаткові класи та стилі для всіх лоадерів
        document.querySelectorAll('.activity__loader, .lampac-balanser-loader, .player-video__loader, .loading-layer__ico, .player-video__youtube-needclick > div, .modal-loading').forEach(function(el) {
            el.classList.add('custom');
            el.style.backgroundImage = 'url("' + escapedUrl + '")';
            el.style.filter = filterValue;
            el.style.backgroundColor = 'transparent';
            if (el.classList.contains('activity__loader') && Lampa.Storage.get('ani_active')) el.classList.add('active');
        });
    }

    // --- Вставка превʼю лоадера ---
    function insert_activity_loader_prv(url) {
        $('#aniload-id-prv').remove();
        var colorEnabled = Lampa.Storage.get('color_plugin_enabled', 'false') === 'true';
        var mainColor = colorEnabled ? Lampa.Storage.get('color_plugin_main_color', '#353535') : '#ffffff';
        var rgb = getFilterRgb(mainColor);

        var filterValue = colorEnabled
            ? 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r/255) + ' 0 0 0 0 ' + (rgb.g/255) + ' 0 0 0 0 ' + (rgb.b/255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")'
            : '';

        var newStyle = `
            .settings-param[data-name="select_ani_mation"] .activity__loader_prv {
                display: inline-block;
                width: 23px; height: 24px;
                margin-right: 10px;
                vertical-align: middle;
                background: url('${url}') no-repeat 50% 50%;
                background-size: contain;
                background-color: transparent !important;
                filter: ${filterValue} !important;
                -webkit-filter: ${filterValue} !important;
            }
        `;
        $('<style id="aniload-id-prv">' + newStyle + '</style>').appendTo('head');
    }

    // --- Видалення кастомного лоадера ---
    function remove_activity_loader() {
        $('#aniload-id, #aniload-id-prv').remove();

        document.querySelectorAll('.activity__loader, .lampac-balanser-loader, .player-video__loader, .loading-layer__ico, .player-video__youtube-needclick > div, .modal-loading').forEach(function(el) {
            el.classList.remove('custom', 'active');
            el.style.backgroundImage = '';
            el.style.filter = '';
            el.style.backgroundColor = 'transparent';
            el.style.display = 'none';
        });

        insert_activity_loader_prv('./img/loader.svg');
    }

    // --- Основне завантаження ---
    function aniLoad() {
        if (Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
        } else remove_activity_loader();
    }

    // --- Оновлення теми/кольору ---
    function byTheme() { aniLoad(); }

    // --- Старт ---
    if (window.appready) {
        aniLoad(); byTheme();
    } else {
        Lampa.Listener.follow('app', function(event) {
            if (event.type === 'ready') { aniLoad(); byTheme(); }
        });
    }

    // --- Слухачі змін Storage ---
    Lampa.Storage.listener.follow('change', function (e) {
        if (e.name === 'color_plugin_main_color' || e.name === 'color_plugin_enabled' || e.name.startsWith('ani_')) {
            byTheme();
        }
    });

    window.byTheme = byTheme;
})();
