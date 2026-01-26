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
    // Основні дані плагіна
    // ────────────────────────────────────────────────
    var ColorPlugin = {
        version: '2025-01-26-fix3',
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
                '#00bc7d': 'Emerald 1','#009966': 'Emerald 2','#007a55': 'Emerald 3','#006045': 'Emerald 4','#004f3b': 'Emerald 5','#002c22': 'Emerald 6',
                '#00bba7': 'Teal 1',   '#009689': 'Teal 2',   '#00786f': 'Teal 3',   '#005f5a': 'Teal 4',   '#0b4f4a': 'Teal 5',   '#022f2e': 'Teal 6',
                '#00b8db': 'Cyan 1',   '#0092b8': 'Cyan 2',   '#007595': 'Cyan 3',   '#005f78': 'Cyan 4',   '#104e64': 'Cyan 5',   '#053345': 'Cyan 6',
                '#00a6f4': 'Sky 1',    '#0084d1': 'Sky 2',    '#0069a8': 'Sky 3',    '#00598a': 'Sky 4',    '#024a70': 'Sky 5',    '#052f4a': 'Sky 6',
                '#2b7fff': 'Blue 1',   '#155dfc': 'Blue 2',   '#1447e6': 'Blue 3',   '#193cb8': 'Blue 4',   '#1c398e': 'Blue 5',   '#162456': 'Blue 6',
                '#615fff': 'Indigo 1', '#4f39f6': 'Indigo 2', '#432dd7': 'Indigo 3', '#372aac': 'Indigo 4', '#312c85': 'Indigo 5', '#1e1a4d': 'Indigo 6',
                '#8e51ff': 'Violet 1', '#7f22fe': 'Violet 2', '#7008e7': 'Violet 3', '#5d0ec0': 'Violet 4', '#4d179a': 'Violet 5', '#2f0d68': 'Violet 6',
                '#ad46ff': 'Purple 1', '#9810fa': 'Purple 2', '#8200db': 'Purple 3', '#6e11b0': 'Purple 4', '#59168b': 'Purple 5', '#3c0366': 'Purple 6',
                '#e12afb': 'Fuchsia 1','#c800de': 'Fuchsia 2','#a800b7': 'Fuchsia 3','#8a0194': 'Fuchsia 4','#721378': 'Fuchsia 5','#4b004f': 'Fuchsia 6',
                '#f6339a': 'Pink 1',   '#e60076': 'Pink 2',   '#c6005c': 'Pink 3',   '#a3004c': 'Pink 4',   '#861043': 'Pink 5',   '#510424': 'Pink 6',
                '#ff2056': 'Rose 1',   '#ec003f': 'Rose 2',   '#c70036': 'Rose 3',   '#a50036': 'Rose 4',   '#8b0836': 'Rose 5',   '#4d0218': 'Rose 6',
                '#62748e': 'Slate 1',  '#45556c': 'Slate 2',  '#314158': 'Slate 3',  '#1d293d': 'Slate 4',  '#0f172b': 'Slate 5',  '#020618': 'Slate 6',
                '#6a7282': 'Gray 1',   '#4a5565': 'Gray 2',   '#364153': 'Gray 3',   '#1e2939': 'Gray 4',   '#101828': 'Gray 5',   '#030712': 'Gray 6',
                '#71717b': 'Zinc 1',   '#52525c': 'Zinc 2',   '#3f3f46': 'Zinc 3',   '#27272a': 'Zinc 4',   '#18181b': 'Zinc 5',   '#09090b': 'Zinc 6',
                '#737373': 'Neutral 1','#525252': 'Neutral 2','#404040': 'Neutral 3','#262626': 'Neutral 4','#171717': 'Neutral 5','#0a0a0a': 'Neutral 6',
                '#79716b': 'Stone 1',  '#57534d': 'Stone 2',  '#44403b': 'Stone 3',  '#292524': 'Stone 4',  '#1c1917': 'Stone 5',  '#0c0a09': 'Stone 6'
            }
        }
    };

    var isSaving = false;

    // ────────────────────────────────────────────────
    // Утиліти
    // ────────────────────────────────────────────────
    function hexToRgb(hex) {
        hex = hex.replace('#','');
        var r = parseInt(hex.substring(0,2),16);
        var g = parseInt(hex.substring(2,4),16);
        var b = parseInt(hex.substring(4,6),16);
        return r + ',' + g + ',' + b;
    }

    function rgbToHex(rgb) {
        var m = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!m) return rgb;
        return '#' + [m[1],m[2],m[3]].map(n => ('0'+parseInt(n).toString(16)).slice(-2)).join('');
    }

    function isValidHex(c) {
        return /^#[0-9A-Fa-f]{6}$/.test(c);
    }

    function saveSettings() {
        if (isSaving) return;
        isSaving = true;
        Lampa.Storage.set('color_plugin_main_color',        ColorPlugin.settings.main_color);
        Lampa.Storage.set('color_plugin_enabled',           ColorPlugin.settings.enabled.toString());
        Lampa.Storage.set('color_plugin_highlight_enabled', ColorPlugin.settings.highlight_enabled.toString());
        Lampa.Storage.set('color_plugin_dimming_enabled',   ColorPlugin.settings.dimming_enabled.toString());
        localStorage.setItem('color_plugin_main_color',        ColorPlugin.settings.main_color);
        localStorage.setItem('color_plugin_enabled',           ColorPlugin.settings.enabled.toString());
        localStorage.setItem('color_plugin_highlight_enabled', ColorPlugin.settings.highlight_enabled.toString());
        localStorage.setItem('color_plugin_dimming_enabled',   ColorPlugin.settings.dimming_enabled.toString());
        isSaving = false;
    }

    // ────────────────────────────────────────────────
    // Застосування стилів (повний набір)
    // ────────────────────────────────────────────────
    function applyStyles() {
        var style = document.getElementById('color-plugin-styles');

        if (!ColorPlugin.settings.enabled) {
            if (style) style.remove();
            return;
        }

        if (!isValidHex(ColorPlugin.settings.main_color)) {
            ColorPlugin.settings.main_color = '#353535';
        }

        if (!style) {
            style = document.createElement('style');
            style.id = 'color-plugin-styles';
            document.head.appendChild(style);
        }

        var rgb = hexToRgb(ColorPlugin.settings.main_color);
        var focusBorder = ColorPlugin.settings.main_color === '#353535' ? '#ffffff' : 'var(--main-color)';

        var highlight = ColorPlugin.settings.highlight_enabled ?
            'inset 0 0 0 0.15em #fff !important' : '';

        var dimming = ColorPlugin.settings.dimming_enabled ? `
            .full-start__rate, .full-start__rate>div:first-child {background:rgba(var(--main-color-rgb),0.15)!important}
            .reaction, .full-start__button, .items-line__more {background:rgba(var(--main-color-rgb),0.3)!important}
            .card__vote, .card__icons-inner {background:rgba(var(--main-color-rgb),0.5)!important}
            .simple-button--filter>div {background:rgba(var(--main-color-rgb),0.3)!important}
        ` : '';

        style.innerHTML = `
            :root {
                --main-color: ${ColorPlugin.settings.main_color} !important;
                --main-color-rgb: ${rgb} !important;
                --accent-color: ${ColorPlugin.settings.main_color} !important;
            }

            /* Фіксовані стилі для палітри кольорів */
            .modal.color-picker-modal .color-picker-container {
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
                gap: 16px !important;
            }

            .modal.color-picker-modal .color-family-outline {
                display: flex !important;
                flex-direction: row !important;
                flex-wrap: nowrap !important;
                overflow-x: auto !important;
                gap: 10px !important;
                padding: 8px 4px !important;
                margin: 0 -4px !important;
                scroll-snap-type: x mandatory !important;
            }

            .modal.color-picker-modal .color-family-name {
                flex: 0 0 90px !important;
                height: 38px !important;
                min-width: 90px !important;
                border: 2px solid !important;
                border-radius: 6px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 11px !important;
                font-weight: bold !important;
                color: #fff !important;
                text-align: center !important;
                background: rgba(0,0,0,0.35) !important;
            }

            .modal.color-picker-modal .color_square {
                flex: 0 0 38px !important;
                height: 38px !important;
                min-width: 38px !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                position: relative !important;
            }

            .modal.color-picker-modal .color_square.default {
                background: #ffffff !important;
            }

            .modal.color-picker-modal .color_square.default::after,
            .modal.color-picker-modal .color_square.default::before {
                content: "" !important;
                position: absolute !important;
                top: 50% !important;
                left: 8px !important;
                right: 8px !important;
                height: 3px !important;
                background: #353535 !important;
            }

            .modal.color-picker-modal .color_square.default::after  { transform: rotate(45deg) !important; }
            .modal.color-picker-modal .color_square.default::before { transform: rotate(-45deg) !important; }

            .modal.color-picker-modal .color_square .hex {
                position: absolute !important;
                bottom: 3px !important;
                left: 0 !important;
                right: 0 !important;
                font-size: 9px !important;
                text-align: center !important;
                color: #fff !important;
                text-shadow: 0 1px 2px #000 !important;
                pointer-events: none !important;
            }

            .modal.color-picker-modal .hex-input {
                flex: 0 0 280px !important;
                height: 38px !important;
                border: 2px solid #666 !important;
                border-radius: 8px !important;
                background: #2c2c2c !important;
                color: #fff !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                font-size: 13px !important;
                cursor: pointer !important;
            }

            /* Основні стилі виділення / рамки / затемнення */
            .menu__item.focus, .menu__item:hover, .console__tab.focus,
            .full-start__button.focus, .settings-param.focus, .selectbox-item.focus {
                background: var(--main-color) !important;
                color: #ffffff !important;
            }

            .full-start__button.focus, .settings-param.focus, .items-line__more.focus,
            .menu__item.focus, .head__action.focus {
                box-shadow: ${highlight} !important;
                -webkit-box-shadow: ${highlight} !important;
            }

            ${dimming}

            .online.focus { box-shadow: 0 0 0 0.25em var(--main-color) !important; }
            .card.focus .card__view, .card:hover .card__view { border-color: var(--main-color) !important; }
        `;

        // Примусове оновлення деяких елементів
        setTimeout(forceBlackFilterBackground, 200);
    }

    // ────────────────────────────────────────────────
    // Оновлення видимості дочірніх пунктів
    // ────────────────────────────────────────────────
    function refreshParamsVisibility() {
        var enabled = ColorPlugin.settings.enabled;
        var container = document.querySelector('.settings-component[data-component="color_plugin"]');
        if (!container) return;

        var params = container.querySelectorAll('.settings-param');
        params.forEach(function (p) {
            var name = p.getAttribute('data-name');
            if (name === 'color_plugin_enabled') {
                p.style.display = '';
            } else {
                p.style.display = enabled ? '' : 'none';
            }
        });
    }

    // ────────────────────────────────────────────────
    // Модальне вікно вибору кольору
    // ────────────────────────────────────────────────
    function openColorPicker() {
        var families = [
            'Red','Orange','Amber','Yellow','Lime','Green','Emerald','Teal','Cyan',
            'Sky','Blue','Indigo','Violet','Purple','Fuchsia','Pink','Rose',
            'Slate','Gray','Zinc','Neutral','Stone'
        ];

        var contentBlocks = families.map(family => {
            var famColors = Object.keys(ColorPlugin.colors.main).filter(k => {
                return k !== 'default' && ColorPlugin.colors.main[k].indexOf(family) === 0;
            });

            if (!famColors.length) return '';

            var first = famColors[0];
            var nameHtml = '<div class="color-family-name" style="border-color:'+first+'">' +
                           Lampa.Lang.translate(family.toLowerCase()) + '</div>';

            var squares = famColors.map(c => {
                var hex = c.replace('#','');
                return '<div class="color_square selector" style="background:'+c+'" data-color="'+c+'" tabindex="0">' +
                       '<div class="hex">'+hex+'</div></div>';
            }).join('');

            return '<div class="color-family-outline">' + nameHtml + squares + '</div>';
        }).filter(Boolean).join('');

        var mid = Math.ceil(families.length / 2);
        var left = contentBlocks.split('</div>').slice(0, mid).join('</div>');
        var right = contentBlocks.split('</div>').slice(mid).join('</div>');

        var defaultBtn = '<div class="color_square selector default" data-color="default" tabindex="0"></div>';

        var customHex = Lampa.Storage.get('color_plugin_custom_hex', '#353535');
        var hexShow = customHex.replace('#','');
        var customBlock = '<div class="hex-input selector" data-color="custom" tabindex="0" style="background:'+customHex+'">' +
                          '<div class="label">'+Lampa.Lang.translate('custom_hex_input')+'</div>' +
                          '<div class="value">'+hexShow+'</div></div>';

        var top = '<div style="display:flex;gap:16px;justify-content:center;margin-bottom:12px;">' +
                  defaultBtn + customBlock + '</div>';

        var modalHtml = $('<div>' + top +
            '<div class="color-picker-container">' +
            '<div>' + left + '</div>' +
            '<div>' + right + '</div>' +
            '</div></div>');

        Lampa.Modal.open({
            title: Lampa.Lang.translate('main_color'),
            html: modalHtml,
            size: 'large',
            className: 'color-picker-modal',
            onSelect: function (a) {
                if (!a.length) return;
                var el = a[0];

                if (el.classList.contains('hex-input')) {
                    Lampa.Noty.show(Lampa.Lang.translate('hex_input_hint'));
                    Lampa.Modal.close();

                    Lampa.Input.edit({
                        name: 'color_plugin_custom_hex',
                        value: customHex,
                        placeholder: '#RRGGBB'
                    }, function (val) {
                        if (!val || !isValidHex(val)) {
                            Lampa.Noty.show('Некоректний HEX');
                            return;
                        }
                        ColorPlugin.settings.main_color = val;
                        Lampa.Storage.set('color_plugin_main_color', val);
                        Lampa.Storage.set('color_plugin_custom_hex', val);
                        applyStyles();
                        saveSettings();
                        Lampa.Modal.close();
                    });
                    return;
                }

                var color = el.dataset.color;
                if (color === 'default') color = '#353535';

                ColorPlugin.settings.main_color = color;
                Lampa.Storage.set('color_plugin_main_color', color);
                applyStyles();
                saveSettings();
                Lampa.Modal.close();
            }
        });
    }

    // ────────────────────────────────────────────────
    // Ініціалізація
    // ────────────────────────────────────────────────
    function initPlugin() {
        ColorPlugin.settings.main_color = Lampa.Storage.get('color_plugin_main_color', '#353535') || localStorage.getItem('color_plugin_main_color') || '#353535';
        ColorPlugin.settings.enabled = Lampa.Storage.get('color_plugin_enabled', 'false') === 'true';
        ColorPlugin.settings.highlight_enabled = Lampa.Storage.get('color_plugin_highlight_enabled', 'true') === 'true';
        ColorPlugin.settings.dimming_enabled = Lampa.Storage.get('color_plugin_dimming_enabled', 'true') === 'true';

        if (!Lampa.SettingsApi) return;

        Lampa.SettingsApi.addComponent({
            component: 'color_plugin',
            name: Lampa.Lang.translate('color_plugin'),
            icon: '<svg width="24px" height="24px" viewBox="0 0 16 16" fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.003a7 7 0 0 0-7 7v.43c.09 1.51 1.91 1.79 3 .7a1.87 1.87 0 0 1 2.64 2.64c-1.1 1.16-.79 3.07.8 3.2h.6a7 7 0 1 0 0-14l-.04.03zm0 13h-.52a.58.58 0 0 1-.36-.14.56.56 0 0 1-.15-.3 1.24 1.24 0 0 1 .35-1.08 2.87 2.87 0 0 0 0-4 2.87 2.87 0 0 0-4.06 0 1 1 0 0 1-.9.34.41.41 0 0 1-.22-.12.42.42 0 0 1-.1-.29v-.37a6 6 0 1 1 6 6l-.04-.04zM9 3.997a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 7.007a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-7-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM13 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>'
        });

        Lampa.SettingsApi.addParam({
            component: 'color_plugin',
            param: { name: 'color_plugin_enabled', type: 'trigger' },
            field: {
                name: Lampa.Lang.translate('color_plugin_enabled'),
                description: Lampa.Lang.translate('color_plugin_enabled_description')
            },
            onChange: function (val) {
                ColorPlugin.settings.enabled = val === 'true';
                Lampa.Storage.set('color_plugin_enabled', val);
                applyStyles();
                saveSettings();

                // Максимально агресивне оновлення видимості
                setTimeout(refreshParamsVisibility, 10);
                setTimeout(refreshParamsVisibility, 80);
                setTimeout(refreshParamsVisibility, 250);
                setTimeout(refreshParamsVisibility, 600);
                setTimeout(refreshParamsVisibility, 1200);
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'color_plugin',
            param: { name: 'color_plugin_main_color', type: 'button' },
            field: {
                name: Lampa.Lang.translate('main_color'),
                description: Lampa.Lang.translate('main_color_description')
            },
            onChange: openColorPicker
        });

        Lampa.SettingsApi.addParam({
            component: 'color_plugin',
            param: { name: 'color_plugin_highlight_enabled', type: 'trigger' },
            field: {
                name: Lampa.Lang.translate('enable_highlight'),
                description: Lampa.Lang.translate('enable_highlight_description')
            },
            onChange: function (val) {
                ColorPlugin.settings.highlight_enabled = val === 'true';
                Lampa.Storage.set('color_plugin_highlight_enabled', val);
                applyStyles();
                saveSettings();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'color_plugin',
            param: { name: 'color_plugin_dimming_enabled', type: 'trigger' },
            field: {
                name: Lampa.Lang.translate('enable_dimming'),
                description: Lampa.Lang.translate('enable_dimming_description')
            },
            onChange: function (val) {
                ColorPlugin.settings.dimming_enabled = val === 'true';
                Lampa.Storage.set('color_plugin_dimming_enabled', val);
                applyStyles();
                saveSettings();
            }
        });

        applyStyles();
        setTimeout(refreshParamsVisibility, 400);

        Lampa.Listener.follow('settings_component', e => {
            if (e.type === 'open') {
                setTimeout(refreshParamsVisibility, 150);
                setTimeout(refreshParamsVisibility, 500);
                setTimeout(refreshParamsVisibility, 1000);
            }
        });
    }

    if (window.appready) {
        initPlugin();
    } else {
        Lampa.Listener.follow('app', e => {
            if (e.type === 'ready') initPlugin();
        });
    }

    Lampa.Storage.listener.follow('change', e => {
        if (['color_plugin_enabled','color_plugin_main_color',
             'color_plugin_highlight_enabled','color_plugin_dimming_enabled']
             .includes(e.name)) {
            ColorPlugin.settings.enabled = Lampa.Storage.get('color_plugin_enabled', 'false') === 'true';
            ColorPlugin.settings.main_color = Lampa.Storage.get('color_plugin_main_color', '#353535') || '#353535';
            ColorPlugin.settings.highlight_enabled = Lampa.Storage.get('color_plugin_highlight_enabled', 'true') === 'true';
            ColorPlugin.settings.dimming_enabled = Lampa.Storage.get('color_plugin_dimming_enabled', 'true') === 'true';

            applyStyles();
            refreshParamsVisibility();
        }
    });

})();
