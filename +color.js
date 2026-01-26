(function () {
    'use strict';

    // ────────────────────────────────────────────────
    // Переклади
    // ────────────────────────────────────────────────
    Lampa.Lang.add({
        color_plugin: {
            ru: 'Настройка цветов',
            en: 'Color settings',
            uk: 'Налаштування кольорів'
        },
        color_plugin_enabled: {
            ru: 'Включить плагин',
            en: 'Enable plugin',
            uk: 'Увімкнути плагін'
        },
        color_plugin_enabled_description: {
            ru: 'Изменяет вид некоторых элементов интерфейса Lampa',
            en: 'Changes the appearance of some Lampa interface elements',
            uk: 'Змінює вигляд деяких елементів інтерфейсу Lampa'
        },
        main_color: {
            ru: 'Цвет выделения',
            en: 'Highlight color',
            uk: 'Колір виділення'
        },
        main_color_description: {
            ru: 'Выберите или укажите цвет',
            en: 'Select or specify a color',
            uk: 'Виберіть чи вкажіть колір'
        },
        enable_highlight: {
            ru: 'Показать рамку',
            en: 'Show border',
            uk: 'Показати рамку'
        },
        enable_highlight_description: {
            ru: 'Включает белую рамку вокруг некоторых выделенных элементов интерфейса',
            en: 'Enables a white border around some highlighted interface elements',
            uk: 'Вмикає білу рамку навколо деяких виділених елементів інтерфейсу'
        },
        enable_dimming: {
            ru: 'Применить цвет затемнения',
            en: 'Apply dimming color',
            uk: 'Застосувати колір затемнення'
        },
        enable_dimming_description: {
            ru: 'Изменяет цвет затемненных элементов интерфейса на темный оттенок выбранного цвета выделения',
            en: 'Changes the color of dimmed interface elements to a dark shade of the selected highlight color',
            uk: 'Змінює колір затемнених елементів інтерфейсу на темний відтінок вибраного кольору виділення'
        },
        default_color: {
            ru: 'По умолчанию',
            en: 'Default',
            uk: 'За замовчуванням'
        },
        custom_hex_input: {
            ru: 'Введи HEX-код цвета',
            en: 'Enter HEX color code',
            uk: 'Введи HEX-код кольору'
        },
        hex_input_hint: {
            ru: 'Используйте формат #FFFFFF, например #123524',
            en: 'Use the format #FFFFFF, for example #123524',
            uk: 'Використовуйте формат #FFFFFF, наприклад #123524'
        },
        red:    { ru: 'Красный',    en: 'Red',    uk: 'Червоний' },
        orange: { ru: 'Оранжевый',  en: 'Orange',  uk: 'Помаранчевий' },
        amber:  { ru: 'Янтарный',   en: 'Amber',   uk: 'Бурштиновий' },
        yellow: { ru: 'Желтый',     en: 'Yellow',  uk: 'Жовтий' },
        lime:   { ru: 'Лаймовый',   en: 'Lime',    uk: 'Лаймовий' },
        green:  { ru: 'Зеленый',    en: 'Green',   uk: 'Зелений' },
        emerald:{ ru: 'Изумрудный', en: 'Emerald', uk: 'Смарагдовий' },
        teal:   { ru: 'Бирюзовый',  en: 'Teal',    uk: 'Бірюзовий' },
        cyan:   { ru: 'Голубой',    en: 'Cyan',    uk: 'Блакитний' },
        sky:    { ru: 'Небесный',   en: 'Sky',     uk: 'Небесний' },
        blue:   { ru: 'Синий',      en: 'Blue',    uk: 'Синій' },
        indigo: { ru: 'Индиго',     en: 'Indigo',  uk: 'Індиго' },
        violet: { ru: 'Фиолетовый', en: 'Violet',  uk: 'Фіолетовий' },
        purple: { ru: 'Пурпурный',  en: 'Purple',  uk: 'Пурпуровий' },
        fuchsia:{ ru: 'Фуксия',     en: 'Fuchsia', uk: 'Фуксія' },
        pink:   { ru: 'Розовый',    en: 'Pink',    uk: 'Рожевий' },
        rose:   { ru: 'Розовый',    en: 'Rose',    uk: 'Трояндовий' },
        slate:  { ru: 'Сланцевый',  en: 'Slate',   uk: 'Сланцевий' },
        gray:   { ru: 'Серый',      en: 'Gray',    uk: 'Сірий' },
        zinc:   { ru: 'Цинковый',   en: 'Zinc',    uk: 'Цинковий' },
        neutral:{ ru: 'Нейтральный',en: 'Neutral', uk: 'Нейтральний' },
        stone:  { ru: 'Каменный',   en: 'Stone',   uk: 'Кам’яний' }
    });

    // ────────────────────────────────────────────────
    // Об’єкт налаштувань та палітра
    // ────────────────────────────────────────────────
    var ColorPlugin = {
        settings: {
            main_color:        '#353535',
            enabled:           false,
            highlight_enabled: true,
            dimming_enabled:   true
        },
        colors: {
            main: {
                'default': Lampa.Lang.translate('default_color'),
                '#fb2c36': 'Red 1', '#e7000b': 'Red 2', '#c10007': 'Red 3', '#9f0712': 'Red 4', '#82181a': 'Red 5', '#460809': 'Red 6',
                '#ff6900': 'Orange 1', '#f54900': 'Orange 2', '#ca3500': 'Orange 3', '#9f2d00': 'Orange 4', '#7e2a0c': 'Orange 5', '#441306': 'Orange 6',
                '#fe9a00': 'Amber 1', '#e17100': 'Amber 2', '#bb4d00': 'Amber 3', '#973c00': 'Amber 4', '#7b3306': 'Amber 5', '#461901': 'Amber 6',
                '#f0b100': 'Yellow 1', '#d08700': 'Yellow 2', '#a65f00': 'Yellow 3', '#894b00': 'Yellow 4', '#733e0a': 'Yellow 5', '#432004': 'Yellow 6',
                '#7ccf00': 'Lime 1', '#5ea500': 'Lime 2', '#497d00': 'Lime 3', '#3c6300': 'Lime 4', '#35530e': 'Lime 5', '#192e03': 'Lime 6',
                '#00c950': 'Green 1', '#00a63e': 'Green 2', '#008236': 'Green 3', '#016630': 'Green 4', '#0d542b': 'Green 5', '#032e15': 'Green 6',
                '#00bc7d': 'Emerald 1', '#009966': 'Emerald 2', '#007a55': 'Emerald 3', '#006045': 'Emerald 4', '#004f3b': 'Emerald 5', '#002c22': 'Emerald 6',
                '#00bba7': 'Teal 1', '#009689': 'Teal 2', '#00786f': 'Teal 3', '#005f5a': 'Teal 4', '#0b4f4a': 'Teal 5', '#022f2e': 'Teal 6',
                '#00b8db': 'Cyan 1', '#0092b8': 'Cyan 2', '#007595': 'Cyan 3', '#005f78': 'Cyan 4', '#104e64': 'Cyan 5', '#053345': 'Cyan 6',
                '#00a6f4': 'Sky 1', '#0084d1': 'Sky 2', '#0069a8': 'Sky 3', '#00598a': 'Sky 4', '#024a70': 'Sky 5', '#052f4a': 'Sky 6',
                '#2b7fff': 'Blue 1', '#155dfc': 'Blue 2', '#1447e6': 'Blue 3', '#193cb8': 'Blue 4', '#1c398e': 'Blue 5', '#162456': 'Blue 6',
                '#615fff': 'Indigo 1', '#4f39f6': 'Indigo 2', '#432dd7': 'Indigo 3', '#372aac': 'Indigo 4', '#312c85': 'Indigo 5', '#1e1a4d': 'Indigo 6',
                '#8e51ff': 'Violet 1', '#7f22fe': 'Violet 2', '#7008e7': 'Violet 3', '#5d0ec0': 'Violet 4', '#4d179a': 'Violet 5', '#2f0d68': 'Violet 6',
                '#ad46ff': 'Purple 1', '#9810fa': 'Purple 2', '#8200db': 'Purple 3', '#6e11b0': 'Purple 4', '#59168b': 'Purple 5', '#3c0366': 'Purple 6',
                '#e12afb': 'Fuchsia 1', '#c800de': 'Fuchsia 2', '#a800b7': 'Fuchsia 3', '#8a0194': 'Fuchsia 4', '#721378': 'Fuchsia 5', '#4b004f': 'Fuchsia 6',
                '#f6339a': 'Pink 1', '#e60076': 'Pink 2', '#c6005c': 'Pink 3', '#a3004c': 'Pink 4', '#861043': 'Pink 5', '#510424': 'Pink 6',
                '#ff2056': 'Rose 1', '#ec003f': 'Rose 2', '#c70036': 'Rose 3', '#a50036': 'Rose 4', '#8b0836': 'Rose 5', '#4d0218': 'Rose 6',
                '#62748e': 'Slate 1', '#45556c': 'Slate 2', '#314158': 'Slate 3', '#1d293d': 'Slate 4', '#0f172b': 'Slate 5', '#020618': 'Slate 6',
                '#6a7282': 'Gray 1', '#4a5565': 'Gray 2', '#364153': 'Gray 3', '#1e2939': 'Gray 4', '#101828': 'Gray 5', '#030712': 'Gray 6',
                '#71717b': 'Zinc 1', '#52525c': 'Zinc 2', '#3f3f46': 'Zinc 3', '#27272a': 'Zinc 4', '#18181b': 'Zinc 5', '#09090b': 'Zinc 6',
                '#737373': 'Neutral 1', '#525252': 'Neutral 2', '#404040': 'Neutral 3', '#262626': 'Neutral 4', '#171717': 'Neutral 5', '#0a0a0a': 'Neutral 6',
                '#79716b': 'Stone 1', '#57534d': 'Stone 2', '#44403b': 'Stone 3', '#292524': 'Stone 4', '#1c1917': 'Stone 5', '#0c0a09': 'Stone 6'
            }
        }
    };

    var isSaving = false;

    // ────────────────────────────────────────────────
    // Утиліти кольорів
    // ────────────────────────────────────────────────
    function hexToRgb(hex) {
        var c = hex.replace('#', '');
        var r = parseInt(c.substr(0, 2), 16);
        var g = parseInt(c.substr(2, 2), 16);
        var b = parseInt(c.substr(4, 2), 16);
        return r + ',' + g + ',' + b;
    }

    function rgbToHex(rgb) {
        var m = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!m) return rgb;
        return '#' + [m[1], m[2], m[3]].map(function (x) {
            return ('0' + parseInt(x).toString(16)).slice(-2);
        }).join('');
    }

    function isValidHex(color) {
        return /^#[0-9A-Fa-f]{6}$/.test(color);
    }

    // ────────────────────────────────────────────────
    // Допоміжні функції оновлення інтерфейсу
    // ────────────────────────────────────────────────
    function updateDateElementStyles() {
        document.querySelectorAll('div[style*="position: absolute; left: 1em; top: 1em;"]').forEach(function (el) {
            if (el.querySelector('div[style*="font-size: 2.6em"]')) {
                el.style.background = 'none';
                el.style.padding = '0.7em';
                el.style.borderRadius = '0.7em';
            }
        });
    }

    function forceBlackFilterBackground() {
        document.querySelectorAll('.simple-button--filter > div').forEach(function (el) {
            var bg = window.getComputedStyle(el).backgroundColor;
            if (bg === 'rgba(255, 255, 255, 0.3)' || bg === 'rgb(255, 255, 255)') {
                el.style.setProperty('background-color', 'rgba(0,0,0,0.3)', 'important');
            }
        });
    }

    function updateSvgIcons() {
        document.querySelectorAll('path[d^="M2 1.5H19C"], path[d^="M3.81972 14.5957V"], path[d^="M8.39409 0.192139L"]').forEach(function (path) {
            if (path.getAttribute('d').indexOf('M8.39409 0.192139') !== -1) {
                if (path.getAttribute('fill') !== 'none') {
                    path.setAttribute('fill', 'var(--main-color)');
                }
            } else {
                path.setAttribute('fill', 'none');
            }
        });
    }

    function saveSettings() {
        if (isSaving) return;
        isSaving = true;
        Lampa.Storage.set('color_plugin_main_color', ColorPlugin.settings.main_color);
        Lampa.Storage.set('color_plugin_enabled', ColorPlugin.settings.enabled.toString());
        Lampa.Storage.set('color_plugin_highlight_enabled', ColorPlugin.settings.highlight_enabled.toString());
        Lampa.Storage.set('color_plugin_dimming_enabled', ColorPlugin.settings.dimming_enabled.toString());
        localStorage.setItem('color_plugin_main_color', ColorPlugin.settings.main_color);
        localStorage.setItem('color_plugin_enabled', ColorPlugin.settings.enabled.toString());
        localStorage.setItem('color_plugin_highlight_enabled', ColorPlugin.settings.highlight_enabled.toString());
        localStorage.setItem('color_plugin_dimming_enabled', ColorPlugin.settings.dimming_enabled.toString());
        isSaving = false;
    }

    // ────────────────────────────────────────────────
    // Застосування всіх стилів
    // ────────────────────────────────────────────────
    function applyStyles() {
        var oldStyle = document.getElementById('color-plugin-styles');

        if (!ColorPlugin.settings.enabled) {
            if (oldStyle) oldStyle.remove();
            return;
        }

        if (!isValidHex(ColorPlugin.settings.main_color)) {
            ColorPlugin.settings.main_color = '#353535';
        }

        var style = oldStyle || document.createElement('style');
        if (!oldStyle) {
            style.id = 'color-plugin-styles';
            document.head.appendChild(style);
        }

        var rgbColor = hexToRgb(ColorPlugin.settings.main_color);
        var focusBorderColor = (ColorPlugin.settings.main_color === '#353535') ? '#ffffff' : 'var(--main-color)';

        var highlightBoxShadow = ColorPlugin.settings.highlight_enabled ?
            'inset 0 0 0 0.15em #fff !important' : '';

        var dimmingBlock = ColorPlugin.settings.dimming_enabled ? `
            .full-start__rate,
            .full-start__rate > div:first-child {
                background: rgba(var(--main-color-rgb), 0.15) !important;
            }
            .reaction,
            .full-start__button,
            .items-line__more {
                background-color: rgba(var(--main-color-rgb), 0.3) !important;
            }
            .card__vote,
            .card__icons-inner {
                background: rgba(var(--main-color-rgb), 0.5) !important;
            }
            .simple-button--filter > div {
                background-color: rgba(var(--main-color-rgb), 0.3) !important;
            }
        ` : '';

        style.innerHTML = `
            :root {
                --main-color: ${ColorPlugin.settings.main_color} !important;
                --main-color-rgb: ${rgbColor} !important;
                --accent-color: ${ColorPlugin.settings.main_color} !important;
            }

            .color-picker-modal .color-family-outline {
                display: flex;
                flex-wrap: nowrap;
                overflow-x: auto;
                gap: 8px;
                padding: 6px 4px;
                margin: 0 -4px;
                scroll-behavior: smooth;
            }

            .color-picker-modal .color-family-name {
                flex: 0 0 84px;
                height: 36px;
                border: 2px solid;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: 700;
                color: #fff;
                text-transform: capitalize;
                background: rgba(0,0,0,0.3);
            }

            .color-picker-modal .color_square {
                flex: 0 0 36px !important;
                height: 36px !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                position: relative !important;
                overflow: hidden;
            }

            .color-picker-modal .color_square.default {
                background: #ffffff !important;
            }

            .color-picker-modal .color_square.default::after,
            .color-picker-modal .color_square.default::before {
                content: "";
                position: absolute;
                top: 50%;
                left: 8px;
                right: 8px;
                height: 3px;
                background: #353535 !important;
                transform-origin: center;
            }

            .color-picker-modal .color_square.default::after  { transform: rotate(45deg);  }
            .color-picker-modal .color_square.default::before { transform: rotate(-45deg); }

            .color-picker-modal .color_square .hex {
                position: absolute;
                bottom: 2px;
                left: 0;
                right: 0;
                font-size: 9px;
                text-align: center;
                color: #fff;
                text-shadow: 0 0 3px #000;
                pointer-events: none;
            }

            .color-picker-modal .hex-input {
                flex: 0 0 270px;
                height: 38px;
                border: 2px solid #555;
                border-radius: 8px;
                background: #2a2a2a;
                color: #fff;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-size: 13px;
                font-weight: bold;
                cursor: pointer;
            }

            .color-picker-modal .color-picker-container {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 14px;
                padding: 8px 4px;
            }

            @media (max-width: 720px) {
                .color-picker-modal .color-picker-container {
                    grid-template-columns: 1fr;
                }
            }

            /* Основні стилі плагіна (скорочено для прикладу, додайте решту за потребою) */
            .menu__item.focus, .menu__item:hover, .console__tab.focus {
                background: var(--main-color) !important;
                color: #ffffff !important;
            }
            .full-start__button.focus, .settings-param.focus {
                box-shadow: ${highlightBoxShadow};
                -webkit-box-shadow: ${highlightBoxShadow};
            }
            ${dimmingBlock}
        `;

        updateDateElementStyles();
        forceBlackFilterBackground();
        updateSvgIcons();
    }

    // ────────────────────────────────────────────────
    // Надійне оновлення видимості дочірніх параметрів
    // ────────────────────────────────────────────────
    function refreshParamsVisibility() {
        var isEnabled = ColorPlugin.settings.enabled;
        var component = document.querySelector('.settings-component[data-component="color_plugin"]');

        if (!component) return;

        var allParams = component.querySelectorAll('.settings-param');

        allParams.forEach(function (param) {
            var paramName = param.getAttribute('data-name');
            if (paramName === 'color_plugin_enabled') {
                param.style.display = '';
            } else {
                param.style.display = isEnabled ? '' : 'none';
            }
        });

        // Додатковий клас для CSS-контролю (про всяк випадок)
        if (isEnabled) {
            component.classList.add('color-plugin--enabled');
        } else {
            component.classList.remove('color-plugin--enabled');
        }
    }

    // ────────────────────────────────────────────────
    // Модальне вікно вибору кольору
    // ────────────────────────────────────────────────
    function openColorPicker() {
        var families = [
            'Red', 'Orange', 'Amber', 'Yellow', 'Lime', 'Green', 'Emerald', 'Teal', 'Cyan',
            'Sky', 'Blue', 'Indigo', 'Violet', 'Purple', 'Fuchsia', 'Pink', 'Rose',
            'Slate', 'Gray', 'Zinc', 'Neutral', 'Stone'
        ];

        var htmlParts = families.map(function (family) {
            var familyColors = Object.keys(ColorPlugin.colors.main).filter(function (key) {
                return key !== 'default' && ColorPlugin.colors.main[key].indexOf(family) === 0;
            });

            if (!familyColors.length) return '';

            var firstColor = familyColors[0];
            var nameBlock = '<div class="color-family-name" style="border-color:' + firstColor + ';">' +
                            Lampa.Lang.translate(family.toLowerCase()) + '</div>';

            var squares = familyColors.map(function (hex) {
                var name = ColorPlugin.colors.main[hex];
                var hexText = hex.replace('#', '');
                return '<div class="color_square selector" style="background-color:' + hex + ';" data-color="' + hex + '" tabindex="0">' +
                       '<div class="hex">' + hexText + '</div></div>';
            }).join('');

            return '<div class="color-family-outline">' + nameBlock + squares + '</div>';
        }).filter(Boolean).join('');

        var half = Math.ceil(families.length / 2);
        var leftColumn = families.slice(0, half).map(function (f, i) {
            return htmlParts.split('<div class="color-family-outline">')[i + 1] || '';
        }).join('<div class="color-family-outline">');
        var rightColumn = families.slice(half).map(function (f, i) {
            return htmlParts.split('<div class="color-family-outline">')[half + i + 1] || '';
        }).join('<div class="color-family-outline">');

        var defaultSquare = '<div class="color_square selector default" data-color="default" tabindex="0"></div>';

        var customHex = Lampa.Storage.get('color_plugin_custom_hex', '#353535');
        var hexDisplay = customHex.replace('#', '');
        var customInput = '<div class="hex-input selector" data-color="custom" tabindex="0" style="background-color:' + customHex + ';">' +
                          '<div class="label">Введіть HEX</div>' +
                          '<div class="value">' + hexDisplay + '</div></div>';

        var topRow = '<div style="display:flex; gap:16px; justify-content:center; margin:0 0 12px;">' +
                     defaultSquare + customInput + '</div>';

        var modalContent = $('<div>' + topRow +
            '<div class="color-picker-container">' +
            '<div>' + leftColumn + '</div>' +
            '<div>' + rightColumn + '</div>' +
            '</div></div>');

        Lampa.Modal.open({
            title: Lampa.Lang.translate('main_color'),
            html: modalContent,
            size: 'large',
            className: 'color-picker-modal',
            onSelect: function (items) {
                if (!items.length) return;
                var target = items[0];

                if (target.classList.contains('hex-input')) {
                    Lampa.Noty.show(Lampa.Lang.translate('hex_input_hint'));
                    Lampa.Modal.close();

                    Lampa.Input.edit({
                        name: 'color_plugin_custom_hex',
                        value: customHex,
                        placeholder: '#RRGGBB'
                    }, function (newHex) {
                        if (!newHex || !isValidHex(newHex)) {
                            Lampa.Noty.show('Некоректний HEX-код');
                            return;
                        }
                        ColorPlugin.settings.main_color = newHex;
                        Lampa.Storage.set('color_plugin_main_color', newHex);
                        Lampa.Storage.set('color_plugin_custom_hex', newHex);
                        applyStyles();
                        saveSettings();
                        forceBlackFilterBackground();
                        Lampa.Modal.close();
                    });
                    return;
                }

                var selectedColor = target.dataset.color;
                if (selectedColor === 'default') {
                    selectedColor = '#353535';
                }

                ColorPlugin.settings.main_color = selectedColor;
                Lampa.Storage.set('color_plugin_main_color', selectedColor);
                applyStyles();
                saveSettings();
                forceBlackFilterBackground();
                Lampa.Modal.close();
            },
            onBack: function () {
                Lampa.Modal.close();
            }
        });
    }

    // ────────────────────────────────────────────────
    // Ініціалізація плагіна
    // ────────────────────────────────────────────────
    function initPlugin() {
        // Завантаження збережених даних
        ColorPlugin.settings.main_color        = Lampa.Storage.get('color_plugin_main_color',        '#353535') || localStorage.getItem('color_plugin_main_color')        || '#353535';
        ColorPlugin.settings.enabled           = Lampa.Storage.get('color_plugin_enabled',           'false') === 'true';
        ColorPlugin.settings.highlight_enabled = Lampa.Storage.get('color_plugin_highlight_enabled', 'true')  === 'true';
        ColorPlugin.settings.dimming_enabled   = Lampa.Storage.get('color_plugin_dimming_enabled',   'true')  === 'true';

        if (!Lampa.SettingsApi) return;

        Lampa.SettingsApi.addComponent({
            component: 'color_plugin',
            name: Lampa.Lang.translate('color_plugin'),
            icon: '<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.003a7 7 0 0 0-7 7v.43c.09 1.51 1.91 1.79 3 .7a1.87 1.87 0 0 1 2.64 2.64c-1.1 1.16-.79 3.07.8 3.2h.6a7 7 0 1 0 0-14l-.04.03zm0 13h-.52a.58.58 0 0 1-.36-.14.56.56 0 0 1-.15-.3 1.24 1.24 0 0 1 .35-1.08 2.87 2.87 0 0 0 0-4 2.87 2.87 0 0 0-4.06 0 1 1 0 0 1-.9.34.41.41 0 0 1-.22-.12.42.42 0 0 1-.1-.29v-.37a6 6 0 1 1 6 6l-.04-.04zM9 3.997a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 7.007a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-7-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM13 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>'
        });

        // Перемикач увімкнення плагіна
        Lampa.SettingsApi.addParam({
            component: 'color_plugin',
            param: { name: 'color_plugin_enabled', type: 'trigger' },
            field: {
                name: Lampa.Lang.translate('color_plugin_enabled'),
                description: Lampa.Lang.translate('color_plugin_enabled_description')
            },
            onChange: function (value) {
                ColorPlugin.settings.enabled = (value === 'true');
                Lampa.Storage.set('color_plugin_enabled', value);
                applyStyles();
                saveSettings();
                forceBlackFilterBackground();

                // Багаторазове оновлення видимості дочірніх пунктів
                setTimeout(refreshParamsVisibility, 30);
                setTimeout(refreshParamsVisibility, 150);
                setTimeout(refreshParamsVisibility, 400);
                setTimeout(refreshParamsVisibility, 800);
            }
        });

        // Вибір основного кольору
        Lampa.SettingsApi.addParam({
            component: 'color_plugin',
            param: { name: 'color_plugin_main_color', type: 'button' },
            field: {
                name: Lampa.Lang.translate('main_color'),
                description: Lampa.Lang.translate('main_color_description')
            },
            onChange: openColorPicker
        });

        // Рамка при фокусі
        Lampa.SettingsApi.addParam({
            component: 'color_plugin',
            param: { name: 'color_plugin_highlight_enabled', type: 'trigger' },
            field: {
                name: Lampa.Lang.translate('enable_highlight'),
                description: Lampa.Lang.translate('enable_highlight_description')
            },
            onChange: function (value) {
                ColorPlugin.settings.highlight_enabled = (value === 'true');
                Lampa.Storage.set('color_plugin_highlight_enabled', value);
                applyStyles();
                saveSettings();
            }
        });

        // Колір затемнення
        Lampa.SettingsApi.addParam({
            component: 'color_plugin',
            param: { name: 'color_plugin_dimming_enabled', type: 'trigger' },
            field: {
                name: Lampa.Lang.translate('enable_dimming'),
                description: Lampa.Lang.translate('enable_dimming_description')
            },
            onChange: function (value) {
                ColorPlugin.settings.dimming_enabled = (value === 'true');
                Lampa.Storage.set('color_plugin_dimming_enabled', value);
                applyStyles();
                saveSettings();
            }
        });

        // Початкове застосування стилів та видимості
        applyStyles();
        setTimeout(refreshParamsVisibility, 300);

        // Оновлення при кожному відкритті налаштувань
        Lampa.Listener.follow('settings_component', function (e) {
            if (e.type === 'open') {
                setTimeout(refreshParamsVisibility, 100);
                setTimeout(refreshParamsVisibility, 400);
                setTimeout(refreshParamsVisibility, 900);
            }
        });
    }

    // Запуск плагіна
    if (window.appready) {
        initPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                initPlugin();
            }
        });
    }

    // Реакція на зміну налаштувань у сховищі
    Lampa.Storage.listener.follow('change', function (e) {
        if (['color_plugin_enabled', 'color_plugin_main_color',
             'color_plugin_highlight_enabled', 'color_plugin_dimming_enabled']
             .indexOf(e.name) !== -1) {
            ColorPlugin.settings.enabled           = Lampa.Storage.get('color_plugin_enabled',           'false') === 'true';
            ColorPlugin.settings.main_color        = Lampa.Storage.get('color_plugin_main_color',        '#353535') || '#353535';
            ColorPlugin.settings.highlight_enabled = Lampa.Storage.get('color_plugin_highlight_enabled', 'true')  === 'true';
            ColorPlugin.settings.dimming_enabled   = Lampa.Storage.get('color_plugin_dimming_enabled',   'true')  === 'true';

            applyStyles();
            refreshParamsVisibility();
        }
    });

    // Спостереження за появою фільтрів (для forceBlackFilterBackground)
    setTimeout(function () {
        if (typeof MutationObserver === 'undefined') return;
        new MutationObserver(function (mutations) {
            var hasFilter = false;
            mutations.forEach(function (mutation) {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach(function (node) {
                        if (node.querySelector && node.querySelector('.simple-button--filter')) {
                            hasFilter = true;
                        }
                    });
                }
            });
            if (hasFilter) setTimeout(forceBlackFilterBackground, 120);
        }).observe(document.body, { childList: true, subtree: true });
    }, 800);

})();
