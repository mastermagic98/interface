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

    // Додаємо шаблон модалки
    Lampa.Template.add('ani_modal', '<div class="ani_modal_root"><div class="ani_picker_container">{ani_svg_content}</div></div>');

    // Конвертація HEX → RGB
    function hexToRgb(hex) {
        var cleanHex = hex.replace('#', '');
        var r = parseInt(cleanHex.substring(0, 2), 16);
        var g = parseInt(cleanHex.substring(2, 4), 16);
        var b = parseInt(cleanHex.substring(4, 6), 16);
        return { r: r, g: g, b: b };
    }

    // Визначаємо колір для фільтра (якщо темна тема — білий)
    function getFilterRgb(mainColor) {
        if (mainColor.toLowerCase() === '#353535') {
            return { r: 255, g: 255, b: 255 };
        }
        return hexToRgb(mainColor);
    }

    // Дефолтний білий круглий лоадер (якщо нічого не вибрано)
    function getDefaultLoader() {
        var defaultSvg = '<?xml version="1.0" encoding="utf-8"?>' +
            '<svg xmlns="http://www.w3.org/2000/svg" width="94px" height="94px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">' +
            '<circle cx="50" cy="50" fill="none" stroke="#ffffff" stroke-width="5" r="35" stroke-dasharray="164.93361431346415 56.97787143782138">' +
            '<animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>' +
            '</circle></svg>';
        return 'data:image/svg+xml,' + encodeURIComponent(defaultSvg);
    }

    // Основна функція — застосовує кастомний лоадер
    function setCustomLoader(url) {
        var escapedUrl = url.replace(/'/g, "\\'");
        var mainColor = Lampa.Storage.get('color_plugin_main_color', '#ffffff');
        var rgb = getFilterRgb(mainColor);
        var filterValue = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22color%22%3E%3CfeColorMatrix type=%22matrix%22 values=%220 0 0 0 ' + (rgb.r / 255) + ' 0 0 0 0 ' + (rgb.g / 255) + ' 0 0 0 0 ' + (rgb.b / 255) + ' 0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#color")';

        // Видаляємо старі стилі
        $('#aniload-id').remove();

        var glassStyle = '' +
            'body .player-video__loader.custom {' +
            '   position: absolute !important;' +
            '   left: 0 !important;' +
            '   top: 0 !important;' +
            '   width: 100% !important;' +
            '   height: 100% !important;' +
            '   background: rgba(0, 0, 0, 0.4) !important;' +
            '   backdrop-filter: blur(12px) !important;' +
            '   -webkit-backdrop-filter: blur(12px) !important;' +
            '   display: flex !important;' +
            '   align-items: center !important;' +
            '   justify-content: center !important;' +
            '   z-index: 9998 !important;' +
            '}' +
            'body .player-video__loader.custom::before {' +
            '   content: "" !important;' +
            '   position: absolute !important;' +
            '   width: 100px !important;' +
            '   height: 100px !important;' +
            '   background: url(\'' + escapedUrl + '\') no-repeat center/contain !important;' +
            '   filter: ' + filterValue + ' !important;' +
            '   z-index: 9999 !important;' +
            '}' +
            'body .player-video__loader:not(.custom) {' +
            '   display: none !important;' +
            '}';

        $('<style id="aniload-id">' + glassStyle + '</style>').appendTo('head');

        // Застосовуємо до всіх .player-video__loader
        $('.player-video__loader').each(function () {
            $(this).addClass('custom');
        });
    }

    // Скидаємо все до дефолту
    function removeCustomLoader() {
        $('#aniload-id').remove();
        $('.player-video__loader').removeClass('custom');
    }

    // Прев’ю в налаштуваннях
    function updatePreview(url) {
        $('#aniload-id-prv').remove();
        if (!url || url === './img/loader.svg') url = getDefaultLoader();

        var whiteFilter = 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22white%22%3E%3CfeColorMatrix values=%220 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0%22/%3E%3C/filter%3E%3C/svg%3E#white")';

        var prvStyle = '.settings-param[data-name="select_ani_mation"] .activity__loader_prv {' +
            'background: url(\'' + url + '\') no-repeat 50% 50%/contain !important;' +
            'filter: ' + whiteFilter + ' !important;' +
            '-webkit-filter: ' + whiteFilter + ' !important;' +
            '}';
        $('<style id="aniload-id-prv">' + prvStyle + '</style>').appendTo('head');
    }

    // Модалка вибору анімації
    function openLoaderModal() {
        if (!window.svg_loaders || window.svg_loaders.length === 0) return;

        createModalStyles();

        var defaultSvg = getDefaultLoader();
        var current = Lampa.Storage.get('ani_load', './img/loader.svg');

        var rows = '';
        for (var i = 0; i < window.svg_loaders.length; i += 6) {
            var row = '<div class="ani_loader_row">';
            for (var j = i; j < i + 6 && j < window.svg_loaders.length; j++) {
                var active = window.svg_loaders[j] === current ? 'focus' : '';
                row += '<div class="ani_loader_square selector ' + active + '" data-url="' + window.svg_loaders[j] + '">' +
                       '<img src="' + window.svg_loaders[j] + '">' +
                       '</div>';
            }
            row += '</div>';
            rows += row;
        }

        var defaultBtn = '<div class="ani_loader_square selector default ' + (current === './img/loader.svg' ? 'focus' : '') + '" data-url="./img/loader.svg">' +
                         '<img src="' + defaultSvg + '">' +
                         '</div>';

        var customInput = '<div class="svg_input selector">' +
                          '<div class="label">' + Lampa.Lang.translate('custom_svg_input') + '</div>' +
                          '<div class="value">' + (Lampa.Storage.get('ani_load_custom_svg', 'https://example.com/loader.svg').substring(0, 30) + '...') + '</div>' +
                          '</div>';

        var html = $('<div>' +
            '<div style="display:flex; gap:20px; justify-content:center; margin-bottom:25px;">' + defaultBtn + customInput + '</div>' +
            rows +
            '</div>');

        Lampa.Modal.open({
            title: Lampa.Lang.translate('params_ani_select'),
            html: html,
            size: 'medium',
            onSelect: function (el) {
                if ($(el).hasClass('svg_input')) {
                    Lampa.Input.edit({
                        name: 'ani_load_custom_svg',
                        value: Lampa.Storage.get('ani_load_custom_svg', ''),
                        placeholder: 'https://example.com/loader.svg'
                    }, function (value) {
                        if (value && /^https?:\/\/.*\.svg$/i.test(value)) {
                            Lampa.Storage.set('ani_load_custom_svg', value);
                            Lampa.Storage.set('ani_load', value);
                            aLoader();
                        } else if (value) {
                            Lampa.Noty.show('Невірний URL SVG');
                        }
                    });
                    return;
                }

                var url = $(el).data('url') || './img/loader.svg';
                Lampa.Storage.set('ani_load', url);
                aLoader();
                Lampa.Modal.close();
            },
            onBack: function () {
                Lampa.Modal.close();
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    function createModalStyles() {
        if ($('#ani-modal-style').length) return;
        var style = document.createElement('style');
        style.id = 'ani-modal-style';
        style.textContent = '' +
            '.ani_loader_row { display: flex; justify-content: center; gap: 20px; margin: 15px 0; }' +
            '.ani_loader_square { width: 60px; height: 60px; background: #333; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; }' +
            '.ani_loader_square.focus { border: 3px solid var(--main-color); transform: scale(1.1); }' +
            '.ani_loader_square img { max-width: 50px; max-height: 50px; }' +
            '.svg_input { width: 280px; height: 60px; background: #353535; color: #fff; border-radius: 8px; padding: 8px; font-size: 13px; }';
        document.head.appendChild(style);
    }

    // Головна функція запуску (замість byTheme)
    function aLoader() {
        var active = Lampa.Storage.get('ani_active', false);
        var url = Lampa.Storage.get('ani_load', './img/loader.svg');

        if (active && url && url !== './img/loader.svg') {
            setCustomLoader(url);
            updatePreview(url);
        } else {
            removeCustomLoader();
            updatePreview('./img/loader.svg');
        }
    }

    // === Ініціалізація плагіна ===
    function initPlugin() {
        // Пункт у налаштуваннях
        Lampa.SettingsApi.addComponent({
            component: 'ani_load_menu',
            name: Lampa.Lang.translate('params_ani_name'),
            icon: '<svg viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="12" r="3"/><g><circle cx="4" cy="12" r="3"/><circle cx="20" cy="12" r="3"/><animateTransform attributeName="transform" type="rotate" dur="1s" values="0 12 12;360 12 12" repeatCount="indefinite"/></g></svg>'
        });

        // Перемикач увімкнення
        Lampa.SettingsApi.addParam({
            component: 'ani_load_menu',
            param: { name: 'ani_active', type: 'trigger', default: false },
            field: { name: Lampa.Lang.translate('params_ani_on') },
            onChange: function (val) {
                Lampa.Storage.set('ani_active', val);
                aLoader();
                $('.settings-param[data-name="select_ani_mation"]').css('display', val ? 'block' : 'none');
            }
        });

        // Вибір анімації
        Lampa.SettingsApi.addParam({
            component: 'ani_load_menu',
            param: { name: 'select_ani_mation', type: 'button' },
            field: {
                name: '<div style="display:inline-block;width:23px;height:24px;vertical-align:middle;margin-right:10px;" class="activity__loader_prv"></div>' + Lampa.Lang.translate('params_ani_select')
            },
            onRender: function (el) {
                el.css('display', Lampa.Storage.get('ani_active') ? 'block' : 'none');
            },
            onChange: openLoaderModal
        });

        // Запускаємо при старті
        aLoader();
    }

    // Запуск після готовності додатка
    if (window.appready) {
        initPlugin();
        aLoader();
    } else {
        Lampa.Listener.follow('app', { type: 'ready' }, initPlugin);
    }

    // Оновлення при зміні теми/кольору
    Lampa.Storage.listener.follow('change', function (e) {
        if (e.name === 'accent_color_selected' || e.name === 'color_plugin_main_color') {
            aLoader();
        }
    });

    // Експортуємо функцію для виклику вручну
    window.aLoader = aLoader;

})();
