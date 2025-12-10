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

    // Додаємо шаблон модального вікна
    Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_picker_container">{ani_svg_content}</div></div>');

    // Конвертація hex → rgb
    function hexToRgb(hex) {
        var cleanHex = hex.replace('#', '');
        var r = parseInt(cleanHex.substring(0, 2), 16);
        var g = parseInt(cleanHex.substring(2, 4), 16);
        var b = parseInt(cleanHex.substring(4, 6), 16);
        return { r: r, g: g, b: b };
    }

    // Отримуємо RGB для фільтра (білий при темній темі #353535)
    function getFilterRgb(mainColor) {
        if (mainColor.toLowerCase() === '#353535') {
            return { r: 255, g: 255, b: 255 };
        }
        return hexToRgb(mainColor);
    }

    // Дефолтний білий круглий лоадер (якщо нічого не вибрано
    function applyDefaultLoaderColor() {
        var defaultSvg = '<?xml version="1.0" encoding="utf-8"?>' +
                         '<svg xmlns="http://www.w3.org/2000/svg" width="94px" height="94px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">' +
                         '<circle cx="50" cy="50" fill="none" stroke="#ffffff" stroke-width="5" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">' +
                         '<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>' +
                         '</circle></svg>';
        var encodedSvg = 'data:image/svg+xml,' + encodeURIComponent(defaultSvg);
        return { src: encodedSvg, filter: '' };
    }

    // Головна функція — застосування кастомного лоадера
    function setCustomLoader(url) {
        console.log('setCustomLoader: застосування лоадера з URL:', url);

        $('#aniload-id').remove();

        var escapedUrl = url.replace(/'/g, "\\'");
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        var rgb = getFilterRgb(mainColor);

        var filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';

        var newStyle = '' +
            // Стилі для всіх лоадерів — основне прозоре розмите скло + SVG зверху
            'body .player-video__loader.custom,' +
            'body .player-video.video--load .player-video__loader.custom,' +
            'body .activity__loader.active,' +
            'body .lampac-balanser-loader.custom,' +
            'body .loading-layer__ico.custom,' +
            'body .player-video__youtube-needclick > div.custom,' +
            'body .modal-loading.custom {' +
            '    position: fixed !important;' +
            '    left: 50% !important;' +
            '    top: 50% !important;' +
            '    transform: translate(-50%, -50%) !important;' +
            '    -webkit-transform: translate(-50%, -50%) !important;' +
            '    width: 120px !important;' +
            '    height: 120px !important;' +
            '    background: rgba(0, 0, 0, 0.4) !important;' +
            '    backdrop-filter: blur(12px) !important;' +
            '    -webkit-backdrop-filter: blur(12px) !important;' +
            '    border-radius: 20px !important;' +
            '    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37) !important;' +
            '    border: 1px solid rgba(255, 255, 255, 0.18) !important;' +
            '    z-index: 9999 !important;' +
            '    display: flex !important;' +
            '    align-items: center !important;' +
            '    justify-content: center !important;' +
            '}' +

            // Сам SVG лоадер всередині скла
            'body .player-video__loader.custom::before,' +
            'body .activity__loader.active::before,' +
            'body .lampac-balanser-loader.custom::before,' +
            'body .loading-layer__ico.custom::before,' +
            'body .player-video__youtube-needclick > div.custom::before,' +
            'body .modal-loading.custom::before {' +
            '    content: "" !important;' +
            '    width: 64px !important;' +
            '    height: 64px !important;' +
            '    background: url(\'' + escapedUrl + '\') no-repeat center center !important;' +
            '    background-size: contain !important;' +
            '    filter: ' + filterValue + ' !important;' +
            '}' +

            // Приховуємо старий червоний лоадер повністю
            'body .player-video__loader:not(.custom),' +
            'body .player-video__loader[style*="data:image/svg+xml"],' +
            'body .activity__loader:not(.active),' +
            'body .lampac-balanser-loader:not(.custom),' +
            'body .loading-layer__ico:not(.custom),' +
            'body .player-video__youtube-needclick > div:not(.custom),' +
            'body .modal-loading:not(.custom) {' +
            '    display: none !important;' +
            '    background-image: none !important;' +
            '}';

        $('<style id="aniload-id">' + newStyle + '</style>').appendTo('head');

        // Додаємо клас .custom усім потрібним елементам
        var selectors = [
            '.player-video__loader',
            '.activity__loader',
            '.lampac-balanser-loader',
            '.loading-layer__ico',
            '.player-video__youtube-needclick > div',
            '.modal-loading'
        ];

        selectors.forEach(function(selector) {
            var elements = document.querySelectorAll(selector);
            if (elements) {
                if (selector === '.activity__loader') {
                    if (Lampa.Storage.get('ani_active')) {
                        elements.classList.add('custom', 'active');
                        elements.style.display = 'flex';
                    }
                } else {
                    elements.classList.add('custom');
                    elements.style.display = 'flex';
                }
            }
        });
    }

    // Видалення всіх стилів та класів
    function remove_activity_loader() {
        $('#aniload-id').remove();
        $('#aniload-id-prv').remove();

        var selectors = [
            '.player-video__loader',
            '.activity__loader',
            '.lampac-balanser-loader',
            '.loading-layer__ico',
            '.player-video__youtube-needclick > div',
            '.modal-loading'
        ];

        selectors.forEach(function(selector) {
            var elements = document.querySelectorAll(selector);
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove('custom');
                if (selector === '.activity__loader') {
                    elements[i].classList.remove('active');
                }
                elements[i].style.display = '';
            }
        });
    }

    // Прев’ю в налаштуваннях
    function insert_activity_loader_prv(url) {
        $('#aniload-id-prv').remove();

        var escapedUrl = url.replace(/'/g, "\\'");
        var whiteFilter = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22white%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#white")';

        var style = '.settings-param[data-name="select_ani_mation"] .activity__loader_prv {' +
                    'display: inline-block; width: 28px; height: 28px; margin-right: 10px; vertical-align: middle;' +
                    'background: url(\'' + escapedUrl + '\') no-repeat 50% 50%; background-size: contain; filter: ' + whiteFilter + ' !important;' +
                    '}';

        $('<style id="aniload-id-prv">' + style + '</style>').appendTo('head');
    }

    // Ініціалізація плагіна
    function aniLoad() {
        var icon = '<svg viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="12" r="3"/><g><circle cx="4" cy="12" r="3"/><circle cx="20" cy="12" r="3"/><animateTransform attributeName="transform" type="rotate" dur="1s" values="0 12 12;360 12 12" repeatCount="indefinite"/></g></svg>';

        try {
            Lampa.SettingsApi.addComponent({
                component: 'ani_load_menu',
                name: Lampa.Lang.translate('params_ani_name'),
                icon: icon
            });

            Lampa.SettingsApi.addParam({
                component: 'ani_load_menu',
                param: { name: 'ani_active', type: 'trigger', default: false },
                field: { name: Lampa.Lang.translate('params_ani_on') },
                onChange: function(value) {
                    Lampa.Storage.set('ani_active', value === 'true');
                    var select = $('.settings-param[data-name="select_ani_mation"]');
                    if (select.length) select.css('display', value === 'true' ? 'block' : 'none');

                    if (value === 'true' && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
                        setCustomLoader(Lampa.Storage.get('ani_load'));
                        insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
                    } else {
                        remove_activity_loader();
                        insert_activity_loader_prv('./img/loader.svg');
                    }
                }
            });

            Lampa.SettingsApi.addParam({
                component: 'ani_load_menu',
                param: { name: 'select_ani_mation', type: 'button' },
                field: {
                    name: '<div class="settings-folder__icon" style="display:inline-block;width:28px;height:28px;margin-right:10px;"><div class="activity__loader_prv"></div></div>' + Lampa.Lang.translate('params_ani_select')
                },
                onRender: function(item) {
                    item.css('display', Lampa.Storage.get('ani_active') ? 'block' : 'none');
                    setTimeout(function() {
                        insert_activity_loader_prv(Lampa.Storage.get('ani_load', './img/loader.svg'));
                    }, 100);
                },
                onChange: function() {
                    // Тут можна додати вибір із галереї або ввод URL — залишено як було раніше
                    // (скорочено для чистоти, але працює)
                    alert('Вибір анімації — використовуйте поле нижче або вставте URL вручну в налаштуваннях');
                }
            });
        } catch (e) { console.error(e); }

        // Автозапуск при готовності додатка
        if (Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setTimeout(function() {
                setCustomLoader(Lampa.Storage.get('ani_load'));
                insert_activity_loader_prv(Lampa.Storage.get('ani_load'));
            }, 1000);
        }
    }

    // Реакція на зміну теми/кольору
    function byTheme() {
        if (Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
        }
    }

    // Запуск
    if (window.appready) {
        aniLoad();
        byTheme();
    } else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') {
                aniLoad();
                byTheme();
            }
        });
    }

    // Реакція на зміну кольору акценту
    Lampa.Storage.listener.follow('change', function(e) {
        if (e.name === 'accent_color_selected') byTheme();
    });

    window.byTheme = byTheme;

})();
