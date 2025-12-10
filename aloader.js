(function () {
    'use strict';

    // Додаємо переклади
    Lampa.Lang.add({
        params_ani_on:          { ru: 'Включить',            en: 'Enable',                  uk: 'Увімкнути' },
        params_ani_select:     { ru: 'Выбор анимации',       en: 'Select loading animation',uk: 'Вибір анімації завантаження' },
        params_ani_name:        { ru: 'Анимация Загрузки',   en: 'Loading animation',       uk: 'Анімація завантаження' },
        default_loader:         { ru: 'По умолчанию',        en: 'Default',                 uk: 'За замовчуванням' },
        custom_svg_input:       { ru: 'Введи URL SVG',       en: 'Enter SVG URL',           uk: 'Введи URL SVG' },
        svg_input_hint:         { ru: 'Используйте URL SVG, например https://example.com/loader.svg',
                                  en: 'Use SVG URL, for example https://example.com/loader.svg',
                                  uk: 'Використовуйте URL SVG, наприклад https://example.com/loader.svg' }
    });

    // ========== ДОПОМІЖНІ ФУНКЦІЇ ==========

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

    // Стандартний білий кружечок (якщо нічого не вибрано)
    function getDefaultLoaderSvg() {
        var defaultSvg = '<?xml version="1.0" encoding="utf-8"?>' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="94px" height="94px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">' +
            '<circle cx="50" cy="50" fill="none" stroke="#ffffff" stroke-width="5" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">' +
            '<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"/>' +
            '</circle></svg>';

        return 'data:image/svg+xml,' + encodeURIComponent(defaultSvg);
    }

    // ========== ЗАСТОСУВАННЯ КАСТОМНОГО ЛОАДЕРА ==========

    function setCustomLoader(svgUrl) {
        if (!svgUrl || svgUrl === './img/loader.svg') {
            svgUrl = getDefaultLoaderSvg();
        }

        var escapedUrl = svgUrl.replace(/'/g, "\\'");

        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        var rgb = getFilterRgb(mainColor);

        var filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';

        // Видаляємо попередні стилі
        $('#aniload-custom-style').remove();

        var cssRules = ''

            // Прибираємо старий червоний лоадер повністю
            + 'body .player-video__loader { display: none !important; }'

            // Новий фон — розмите скло + кастомний SVG по центру
            + 'body .player-video.video--load::before {'
            + '    content: "" !important;'
            + '    position: absolute !important;'
            + '    left: 0 !important; top: 0 !important;'
            + '    width: 100% !important; height: 100% !important;'
            + '    background: rgba(0,0,0,0.65) !important;'
            + '    backdrop-filter: blur(12px) !important;'
            + '    -webkit-backdrop-filter: blur(12px) !important;'
            + '    z-index: 9998 !important;'
            + '    display: block !important;'
            + '}'

            // Кастомний SVG-лоадер поверх скла
            + 'body .player-video.video--load::after {'
            + '    content: "" !important;'
            + '    position: absolute !important;'
            + '    left: 50% !important; top: 50% !important;'
            + '    width: 100px !important; height: 100px !important;'
            + '    background: url(\'' + escapedUrl + '\') no-repeat center center !important;'
            + '    background-size: 80% 80% !important;'
            + '    transform: translate(-50%, -50%) !important;'
            + '    -webkit-transform: translate(-50%, -50%) !important;'
            + '    filter: ' + filterValue + ' !important;'
            + '    z-index: 9999 !important;'
            + '    pointer-events: none !important;'
            + '}'

            // Приховуємо всі інші стандартні лоадери
            + 'body .activity__loader,' 
            + 'body .lampac-balanser-loader,'
            + 'body .loading-layer__ico,'
            + 'body .modal-loading { display: none !important; }'

            // Для YouTube-плеєра (коли потрібен клік)
            + 'body .player-video__youtube-needclick > div {'
            + '    background: url(\'' + escapedUrl + '\') no-repeat center center !important;'
            + '    background-size: 80% 80% !important;'
            + '    filter: ' + filterValue + ' !important;'
            + '    width: 8em !important; height: 8em !important;'
            + '}';

        $('<style id="aniload-custom-style">' + cssRules + '</style>').appendTo('head');

        // Додатково примусово прибираємо старий червоний лоадер, якщо він ще є
        $('.player-video__loader').remove();
    }

    // ========== ВИДАЛЕННЯ КАСТОМНОГО ЛОАДЕРА ==========

    function removeCustomLoader() {
        $('#aniload-custom-style').remove();

        // Повертаємо стандартний вигляд (якщо вимкнули плагін)
        $('body .player-video.video--load::before, body .player-video.video--load::after').remove();
        $('.player-video__loader').show();
    }

    // ========== ПЕРЕДОГЛЯД У НАЛАШТУВАННЯХ ==========

    function updatePreview(svgUrl) {
        if (!svgUrl || svgUrl === './img/loader.svg') {
            svgUrl = getDefaultLoaderSvg();
        }
        $('.activity__loader_prv').css({
            'background-image': 'url(' + svgUrl + ')',
            'background-size': 'contain',
            'background-repeat': 'no-repeat',
            'background-position': 'center',
            'filter': 'invert(1)' // білий для темний фон налаштувань
        });
    }

    // ========== ОСНОВНА ЛОГІКА ПЛАГІНУ ==========

    function startPlugin() {

        // Додаємо пункт у налаштування
        try {
            Lampa.SettingsApi.addComponent({
                component: 'ani_load_menu',
                name: Lampa.Lang.translate('params_ani_name'),
                icon: '<svg viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="12" r="3"/><circle cx="4" cy="12" r="3"/><circle cx="20" cy="12" r="3"/><animateTransform attributeName="transform" type="rotate" dur="1s" values="0 12 12;360 12 12" repeatCount="indefinite"/></svg>'
            });
        } catch(e) {}

        // Перемикач увімк/вимк
        Lampa.SettingsApi.addParam({
            component: 'ani_load_menu',
            param: { name: 'ani_active', type: 'trigger', default: false },
            field: { name: Lampa.Lang.translate('params_ani_on') },
            onChange: function(value) {
                Lampa.Storage.set('ani_active', value);
                if (value) {
                    var url = Lampa.Storage.get('ani_load', getDefaultLoaderSvg());
                    setCustomLoader(url);
                    updatePreview(url);
                } else {
                    removeCustomLoader();
                    updatePreview('./img/loader.svg');
                }
            }
        });

        // Кнопка вибору анімації
        Lampa.SettingsApi.addParam({
            component: 'ani_load_menu',
            param: { name: 'select_ani_mation', type: 'button' },
            field: {
                name: '<div style="display:inline-block;width:23px;height:24px;vertical-align:middle;margin-right:10px;">' +
                '<div class="activity__loader_prv" style="width:100%;height:100%;background:url(./img/loader.svg) center/contain no-repeat;"></div></div>' +
                Lampa.Lang.translate('params_ani_select')
            },
            onRender: function(element) {
                if (!Lampa.Storage.get('ani_active')) {
                    element.hide();
                } else {
                    element.show();
                    updatePreview(Lampa.Storage.get('ani_load', getDefaultLoaderSvg()));
                }
            },
            onChange: function() {
                // Тут можна додати вибір з галереї, але для простоти — просто вводимо URL
                Lampa.Input.edit({
                    name: 'ani_load',
                    value: Lampa.Storage.get('ani_load', ''),
                    placeholder: 'https://example.com/loader.svg'
                }, function(newUrl) {
                    if (!newUrl) {
                        Lampa.Storage.set('ani_load', '');
                        setCustomLoader(getDefaultLoaderSvg());
                        updatePreview(getDefaultLoaderSvg());
                        return;
                    }
                    if (!newUrl.endsWith('.svg')) {
                        Lampa.Noty.show('Потрібен прямий URL на .svg файл');
                        return;
                    }
                    Lampa.Storage.set('ani_load', newUrl);
                    setCustomLoader(newUrl);
                    updatePreview(newUrl);
                });
            }
        });

        // При старті застосунку
        if (Lampa.Storage.get('ani_active')) {
            var savedUrl = Lampa.Storage.get('ani_load', '');
            setCustomLoader(savedUrl || getDefaultLoaderSvg());
            updatePreview(savedUrl || getDefaultLoaderSvg());
        }
    }

    // Запуск після готовності Lampa
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') startPlugin();
        });
    }

    // Реагуємо на зміну кольору теми
    Lampa.Storage.listener.follow('change', function(e) {
        if (e.name === 'accent_color_selected' || e.name === 'color_plugin_main_color') {
            if (Lampa.Storage.get('ani_active')) {
                setCustomLoader(Lampa.Storage.get('ani_load', getDefaultLoaderSvg()));
            }
        }
    });

})();
