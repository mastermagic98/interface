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

    Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_picker_container">{ani_svg_content}</div></div>');

    // Перетворення hex → rgb
    function hexToRgb(hex) {
        var cleanHex = hex.replace('#', '');
        var red   = parseInt(cleanHex.substring(0, 2), 16);
        var green = parseInt(cleanHex.substring(2, 4), 16);
        var blue  = parseInt(cleanHex.substring(4, 6), 16);
        return { r: red, g: green, b: blue };
    }

    // Визначаємо правильний колір для фільтра (для темної теми #353535 → білий)
    function getFilterRgb(mainColor) {
        if (mainColor.toLowerCase() === '#353535') {
            return { r: 255, g: 255, b: 255 };
        }
        return hexToRgb(mainColor);
    }

    // Дефолтний білий крутиться круг (якщо користувач вибере "За замовчуванням")
    function applyDefaultLoaderColor() {
        var defaultSvg = '<?xml version="1.0" encoding="utf-8"?>' +
            '<svg xmlns="http://www.w3.org/2000/svg" style="margin:auto;background:none;display:block;shape-rendering:auto;" width="94px" height="94px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">' +
            '<circle cx="50" cy="50" fill="none" stroke="#ffffff" stroke-width="5" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">' +
            '<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>' +
            '</circle></svg>';

        var encodedSvg = 'data:image/svg+xml,' + encodeURIComponent(defaultSvg);
        return { src: encodedSvg, filter: '' };
    }

    // Основна функція — застосування кастомного SVG + розмитого скла
    function setCustomLoader(url) {
        console.log('setCustomLoader викликано з URL:', url);

        var styleId = document.getElementById('aloader-style');
        if (styleId) {
            styleId.parentNode.removeChild(styleId);
        }

        var escapedUrl = url.replace(/'/g, "\\'");
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        var rgb = getFilterRgb(mainColor);

        var filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22 color-interpolation-filters=%22sRGB%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';

        var newStyle = '' +
            /* Ховаємо стандартний loader */
            'body .activity__loader { display: none !important; }' +

            /* Новий loader — розмите скло + кастомний SVG */
            'body .player-video__loader.custom {' +
            '    position: fixed !important;' +
            '    left: 0 !important;' +
            '    top: 0 !important;' +
            '    width: 100% !important;' +
            '    height: 100% !important;' +
            '    background-color: rgba(0, 0, 0, 0.4) !important;' +
            '    backdrop-filter: blur(12px) !important;' +
            '    -webkit-backdrop-filter: blur(12px) !important;' +
            '    z-index: 9998 !important;' +
            '    display: flex !important;' +
            '    align-items: center !important;' +
            '    justify-content: center !important;' +
            '}' +

            /* Сама анімація по центру */
            'body .player-video__loader.custom::before {' +
            '    content: "" !important;' +
            '    width: 100px !important;' +
            '    height: 100px !important;' +
            '    background-image: url(\'' + escapedUrl + '\') !important;' +
            '    background-repeat: no-repeat !important;' +
            '    background-position: center !important;' +
            '    background-size: contain !important;' +
            '    filter: ' + filterValue + ' !important;' +
            '}' +

            /* Інші лоадери — теж використовують розмите скло + SVG */
            'body .activity__loader.active,' +
            'body .lampac-balanser-loader,' +
            'body .loading-layer__ico.custom,' +
            'body .player-video__youtube-needclick > div.custom,' +
            'body .modal-loading.custom {' +
            '    background-color: rgba(0, 0, 0, 0.4) !important;' +
            '    backdrop-filter: blur(12px) !important;' +
            '    -webkit-backdrop-filter: blur(12px) !important;' +
            '    background-image: url(\'' + escapedUrl + '\') !important;' +
            '    background-repeat: no-repeat !important;' +
            '    background-position: center !important;' +
            '    background-size: contain !important;' +
            '    filter: ' + filterValue + ' !important;' +
            '}' +

            /* Приховуємо старі лоадери без класу custom */
            'body .player-video__loader:not(.custom),' +
            'body .loading-layer__ico:not(.custom),' +
            'body .player-video__youtube-needclick > div:not(.custom),' +
            'body .modal-loading:not(.custom) {' +
            '    display: none !important;' +
            '}';

        var styleElement = document.createElement('style');
        styleElement.id = 'aloader-style';
        styleElement.textContent = newStyle;
        document.head.appendChild(styleElement);

        // Додаємо клас .custom усім потрібним елементам
        var selectors = [
            '.player-video__loader',
            '.lampac-balanser-loader',
            '.loading-layer__ico',
            '.player-video__youtube-needclick > div',
            '.modal-loading'
        ];

        selectors.forEach(function (selector) {
            var elements = document.querySelectorAll(selector);
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.add('custom');
            }
        });

        // Примусово показуємо loader в .player-video при завантаженні
        var playerVideo = document.querySelector('.player-video.video--load');
        if (playerVideo) {
            var loader = playerVideo.querySelector('.player-video__loader');
            if (loader) {
                loader.style.display = 'flex';
            }
        }
    }

    // Скидання до стандартного стану
    function removeCustomLoader() {
        var styleElement = document.getElementById('aloader-style');
        if (styleElement) {
            styleElement.parentNode.removeChild(styleElement);
        }

        var selectors = [
            '.player-video__loader',
            '.lampac-balanser-loader',
            '.loading-layer__ico',
            '.player-video__youtube-needclick > div',
            '.modal-loading'
        ];

        selectors.forEach(function (selector) {
            var elements = document.querySelectorAll(selector);
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove('custom');
                elements[i].style.cssText = '';
            }
        });
    }

    // Попередній перегляд в налаштуваннях
    function insertPreviewLoader(url) {
        var prvStyle = document.getElementById('aloader-preview');
        if (prvStyle) {
            prvStyle.parentNode.removeChild(prvStyle);
        }

        if (!url || url === './img/loader.svg') {
            url = applyDefaultLoaderColor().src;
        }

        var previewCss = '.settings-param[data-name="select_ani_mation"] .activity__loader_prv {' +
            '    display: inline-block;' +
            '    width: 23px;' +
            '    height: 24px;' +
            '    margin-right: 10px;' +
            '    vertical-align: middle;' +
            '    background: url("' + url + '") center/contain no-repeat;' +
            '    filter: brightness(0) invert(1);' +  // білий для темної теми
            '}';

        var style = document.createElement('style');
        style.id = 'aloader-preview';
        style.textContent = previewCss;
        document.head.appendChild(style);
    }

    // Функція, яку викликає Lampa при зміні теми (тепер називається aLoader)
    function aLoader() {
        if (Lampa.Storage.get('ani_active') && Lampa.Storage.get('ani_load') && Lampa.Storage.get('ani_load') !== './img/loader.svg') {
            setCustomLoader(Lampa.Storage.get('ani_load'));
            insertPreviewLoader(Lampa.Storage.get('ani_load'));
        } else {
            removeCustomLoader();
            insertPreviewLoader('./img/loader.svg');
        }
    }

    // Основна ініціалізація плагіну
    function initPlugin() {
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
                aLoader();
                var selectParam = document.querySelector('.settings-param[data-name="select_ani_mation"]');
                if (selectParam) {
                    selectParam.style.display = value === 'true' ? 'block' : 'none';
                }
            }
        });

        // Кнопка вибору анімації
        Lampa.SettingsApi.addParam({
            component: 'ani_load_menu',
            param: { name: 'select_ani_mation', type: 'button' },
            field: {
                name: '<div class="settings-folder__icon" style="display:inline-block;vertical-align:middle;width:23px;height:24px;margin-right:10px;"><div class="activity__loader_prv"></div></div>' + Lampa.Lang.translate('params_ani_select')
            },
            onRender: function (element) {
                if (!Lampa.Storage.get('ani_active')) {
                    element.style.display = 'none';
                }
            },
            onChange: function () {
                // Тут можна додати вибір анімації (як у вашому старому коді)
                // Поки що просто викликаємо aLoader() при зміні
                aLoader();
            }
        });

        // Початкове застосування
        aLoader();
    }

    // Запуск після готовності додатку
    if (window.appready) {
        initPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                initPlugin();
            }
        });
    }

    // При зміні кольору теми — оновлюємо
    Lampa.Storage.listener.follow('change', function (event) {
        if (event.name === 'accent_color_selected' || event.name === 'color_plugin_main_color') {
            aLoader();
        }
    });

    // Експортуємо функцію для виклику ззовні
    window.aLoader = aLoader;

})();
