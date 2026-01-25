(function () {
    'use strict';

    // ────────────────────────────────────────────────────────────────
    // Переклади
    // ────────────────────────────────────────────────────────────────
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
        }
    });

    // Додаємо переклади назв кольорів (щоб не було помилок при виборі)
    ['red','orange','amber','yellow','lime','green','emerald','teal','cyan','sky','blue','indigo','violet','purple','fuchsia','pink','rose','slate','gray','zinc','neutral','stone'].forEach(function(key){
        Lampa.Lang.add({
            [key]: {
                ru: key.charAt(0).toUpperCase() + key.slice(1),
                en: key.charAt(0).toUpperCase() + key.slice(1),
                uk: key.charAt(0).toUpperCase() + key.slice(1)
            }
        });
    });

    // ────────────────────────────────────────────────────────────────
    // Основний об'єкт плагіна
    // ────────────────────────────────────────────────────────────────
    var ColorPlugin = {
        version: '3.0-2025',

        settings: {
            enabled:           false,
            main_color:        '#353535',
            highlight_enabled: true,
            dimming_enabled:   true
        },

        colors: {
            main: {
                'default': Lampa.Lang.translate('default_color'),
                '#fb2c36': 'Red 1',    '#e7000b': 'Red 2',    '#c10007': 'Red 3',    '#9f0712': 'Red 4',    '#82181a': 'Red 5',    '#460809': 'Red 6',
                '#ff6900': 'Orange 1', '#f54900': 'Orange 2', '#ca3500': 'Orange 3', '#9f2d00': 'Orange 4', '#7e2a0c': 'Orange 5', '#441306': 'Orange 6',
                '#fe9a00': 'Amber 1',  '#e17100': 'Amber 2',  '#bb4d00': 'Amber 3',  '#973c00': 'Amber 4',  '#7b3306': 'Amber 5',  '#461901': 'Amber 6',
                '#f0b100': 'Yellow 1', '#d08700': 'Yellow 2', '#a65f00': 'Yellow 3', '#894b00': 'Yellow 4', '#733e0a': 'Yellow 5', '#432004': 'Yellow 6',
                '#7ccf00': 'Lime 1',   '#5ea500': 'Lime 2',   '#497d00': 'Lime 3',   '#3c6300': 'Lime 4',   '#35530e': 'Lime 5',   '#192e03': 'Lime 6',
                '#00c950': 'Green 1',  '#00a63e': 'Green 2',  '#008236': 'Green 3',  '#016630': 'Green 4',  '#0d542b': 'Green 5',  '#032e15': 'Green 6',
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

    // ────────────────────────────────────────────────────────────────
    // Допоміжні функції
    // ────────────────────────────────────────────────────────────────

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
        return '#' + [m[1],m[2],m[3]].map(n => ('0' + parseInt(n).toString(16)).slice(-2)).join('');
    }

    function isValidHex(hex) {
        return /^#[0-9A-Fa-f]{6}$/.test(hex);
    }

    function saveSettings() {
        Lampa.Storage.set('color_plugin_enabled',           ColorPlugin.settings.enabled + '');
        Lampa.Storage.set('color_plugin_main_color',        ColorPlugin.settings.main_color);
        Lampa.Storage.set('color_plugin_highlight_enabled', ColorPlugin.settings.highlight_enabled + '');
        Lampa.Storage.set('color_plugin_dimming_enabled',   ColorPlugin.settings.dimming_enabled + '');
    }

    // ────────────────────────────────────────────────────────────────
    // Скидання змін при вимкненні
    // ────────────────────────────────────────────────────────────────
    function resetAllChanges() {
        var style = document.getElementById('color-plugin-styles');
        if (style) style.remove();

        document.documentElement.style.removeProperty('--main-color');
        document.documentElement.style.removeProperty('--main-color-rgb');
        document.documentElement.style.removeProperty('--accent-color');
    }

    // ────────────────────────────────────────────────────────────────
    // Застосування всіх стилів
    // ────────────────────────────────────────────────────────────────
    function applyStyles() {
        if (!ColorPlugin.settings.enabled) {
            resetAllChanges();
            return;
        }

        var color = ColorPlugin.settings.main_color;
        if (!isValidHex(color)) color = '#353535';

        var rgb = hexToRgb(color);
        var focusBorder = (color === '#353535') ? '#ffffff' : color;

        var highlight = ColorPlugin.settings.highlight_enabled ?
            'inset 0 0 0 0.15em #ffffff' : '';

        var dimming = ColorPlugin.settings.dimming_enabled ? `
            .full-start__rate, .full-start__rate > div:first-child { background: rgba(${rgb}, 0.15) !important; }
            .reaction, .full-start__button, .items-line__more { background-color: rgba(${rgb}, 0.3) !important; }
            .card__vote, .card__icons-inner { background: rgba(${rgb}, 0.5) !important; }
            .simple-button--filter > div { background-color: rgba(${rgb}, 0.3) !important; }
        ` : '';

        var css = `
            :root {
                --main-color: ${color} !important;
                --main-color-rgb: ${rgb} !important;
                --accent-color: ${color} !important;
            }

            .menu__item.focus, .menu__item.traverse, .menu__item:hover,
            .full-start__button.focus, .settings-param.focus, .settings-folder.focus,
            .simple-button.focus, .head__action.focus, .navigation-tabs__button.focus {
                background: var(--main-color) !important;
                color: #ffffff !important;
            }

            .full-start__button.focus, .settings-param.focus, .items-line__more.focus,
            .menu__item.focus, .settings-folder.focus, .selectbox-item.focus,
            .console__tab.focus, .player-panel .button.focus {
                box-shadow: ${highlight} !important;
                -webkit-box-shadow: ${highlight} !important;
            }

            .console__tab.focus { background: var(--main-color) !important; color:#fff !important; }
            .player-panel .button.focus { background-color: var(--main-color) !important; color:#fff !important; }
            .online.focus { box-shadow: 0 0 0 0.2em var(--main-color) !important; }
            .card.focus .card__view, .card:hover .card__view { border-color: var(--main-color) !important; }
            .color_square.focus { border: 0.3em solid ${focusBorder} !important; transform: scale(1.1) !important; }
            .hex-input.focus { border: 0.2em solid ${focusBorder} !important; transform: scale(1.1) !important; }

            ${dimming}

            .color_square {
                width: 35px !important;
                height: 35px !important;
                border-radius: 4px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                font-size: 10px !important;
                color: #ffffff !important;
            }

            .color_square.default {
                background: #ffffff !important;
                position: relative !important;
            }

            .color_square.default::before,
            .color_square.default::after {
                content: "";
                position: absolute;
                top: 50%;
                left: 10%;
                right: 10%;
                height: 3px;
                background: #353535 !important;
            }

            .color_square.default::before  { transform: rotate(45deg); }
            .color_square.default::after   { transform: rotate(-45deg); }

            .color-family-name {
                width: 80px !important;
                height: 35px !important;
                border: 2px solid;
                border-radius: 4px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                font-weight: bold !important;
                font-size: 10px !important;
                color: #ffffff !important;
                text-transform: capitalize !important;
            }

            .hex-input {
                width: 266px !important;
                height: 35px !important;
                border-radius: 8px !important;
                border: 2px solid #dddddd !important;
                background: #353535 !important;
                color: #ffffff !important;
                font-weight: bold !important;
                font-size: 12px !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                position: relative !important;
            }

            .color-picker-container {
                display: grid !important;
                grid-template-columns: 1fr 1fr !important;
                gap: 10px !important;
                padding: 0 !important;
            }

            @media (max-width: 768px) {
                .color-picker-container {
                    grid-template-columns: 1fr !important;
                }
            }
        `;

        var styleEl = document.getElementById('color-plugin-styles');
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = 'color-plugin-styles';
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = css;
    }

    // ────────────────────────────────────────────────────────────────
    // Оновлення видимості залежних параметрів
    // ────────────────────────────────────────────────────────────────
    function updateDependentParamsVisibility() {
        var isEnabled = ColorPlugin.settings.enabled;

        var paramsToToggle = [
            'color_plugin_main_color',
            'color_plugin_highlight_enabled',
            'color_plugin_dimming_enabled'
        ];

        paramsToToggle.forEach(function(name) {
            var selector = '.settings-param[data-name="' + name + '"]';
            $(selector).css('display', isEnabled ? 'block' : 'none');
        });

        // Примусове оновлення інтерфейсу налаштувань
        setTimeout(function() {
            if (Lampa.Settings && Lampa.Settings.render) {
                Lampa.Settings.render();
            }
        }, 60);
    }

    // ────────────────────────────────────────────────────────────────
    // Модальне вікно вибору кольору (спрощена версія)
    // ────────────────────────────────────────────────────────────────
    function openColorPicker() {
        var families = [
            'Red','Orange','Amber','Yellow','Lime','Green','Emerald','Teal','Cyan',
            'Sky','Blue','Indigo','Violet','Purple','Fuchsia','Pink','Rose',
            'Slate','Gray','Zinc','Neutral','Stone'
        ];

        var htmlParts = families.map(function(family) {
            var familyColors = Object.keys(ColorPlugin.colors.main).filter(function(key){
                return ColorPlugin.colors.main[key].indexOf(family + ' ') === 0;
            });

            if (!familyColors.length) return '';

            var firstColor = familyColors[0];
            var nameHtml = '<div class="color-family-name" style="border-color:' + firstColor + '">' +
                           Lampa.Lang.translate(family.toLowerCase()) + '</div>';

            var squares = familyColors.map(function(c) {
                var hex = c.replace('#','');
                return '<div class="color_square selector" tabindex="0" style="background-color:' + c + ';" title="' + ColorPlugin.colors.main[c] + '">' +
                       '<div class="hex">' + hex + '</div></div>';
            }).join('');

            return '<div class="color-family-outline">' + nameHtml + squares + '</div>';
        }).join('');

        var defaultBtn = '<div class="color_square selector default" tabindex="0" title="' + Lampa.Lang.translate('default_color') + '"></div>';

        var customHex = Lampa.Storage.get('color_plugin_custom_hex', '#353535');
        var inputHtml = '<div class="hex-input selector" tabindex="0" style="background-color:' + customHex + ';">' +
                        '<div class="label">' + Lampa.Lang.translate('custom_hex_input') + '</div>' +
                        '<div class="value">' + customHex.replace('#','') + '</div></div>';

        var topRow = '<div style="display:flex; gap:20px; justify-content:center; margin-bottom:15px;">' +
                     defaultBtn + inputHtml + '</div>';

        var columns = '<div class="color-picker-container">' +
                      '<div>' + htmlParts.substring(0, htmlParts.length / 2 | 0) + '</div>' +
                      '<div>' + htmlParts.substring(htmlParts.length / 2 | 0) + '</div>' +
                      '</div>';

        var content = $('<div>' + topRow + columns + '</div>');

        Lampa.Modal.open({
            title: Lampa.Lang.translate('main_color'),
            html: content,
            size: 'medium',
            align: 'center',

            onSelect: function(selected) {
                if (!selected.length) return;

                var el = selected[0];
                var newColor;

                if ($(el).hasClass('hex-input')) {
                    Lampa.Modal.close();
                    Lampa.Input.edit({
                        name: 'color_plugin_custom_hex',
                        value: Lampa.Storage.get('color_plugin_custom_hex', ''),
                        placeholder: '#FFFFFF'
                    }, function(val) {
                        if (!val || !isValidHex(val)) {
                            Lampa.Noty.show('Невірний HEX-код');
                            return;
                        }
                        ColorPlugin.settings.main_color = val;
                        Lampa.Storage.set('color_plugin_custom_hex', val);
                        applyStyles();
                        saveSettings();
                        Lampa.Modal.close();
                    });
                    return;
                }

                if ($(el).hasClass('default')) {
                    newColor = '#353535';
                } else {
                    newColor = el.style.backgroundColor;
                    if (newColor.includes('rgb')) newColor = rgbToHex(newColor);
                }

                ColorPlugin.settings.main_color = newColor;
                Lampa.Storage.set('color_plugin_main_color', newColor);
                applyStyles();
                saveSettings();
                Lampa.Modal.close();
            },

            onBack: function() {
                Lampa.Modal.close();
            }
        });
    }

    // ────────────────────────────────────────────────────────────────
    // Ініціалізація плагіна
    // ────────────────────────────────────────────────────────────────
    function initColorPlugin() {
        // Завантаження збережених значень
        ColorPlugin.settings.enabled           = Lampa.Storage.get('color_plugin_enabled', 'false') === 'true';
        ColorPlugin.settings.main_color        = Lampa.Storage.get('color_plugin_main_color', '#353535') || '#353535';
        ColorPlugin.settings.highlight_enabled = Lampa.Storage.get('color_plugin_highlight_enabled', 'true') === 'true';
        ColorPlugin.settings.dimming_enabled   = Lampa.Storage.get('color_plugin_dimming_enabled', 'true') === 'true';

        // Додаємо компонент у налаштування
        Lampa.SettingsApi.addComponent({
            component: 'color_plugin',
            name: Lampa.Lang.translate('color_plugin'),
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff"><circle cx="12" cy="12" r="10"/></svg>'
        });

        // ─── Перемикач увімкнення ─────────────────────────────────────
        Lampa.SettingsApi.addParam({
            component: 'color_plugin',
            param: {
                name: 'color_plugin_enabled',
                type: 'trigger',
                default: 'false'
            },
            field: {
                name: Lampa.Lang.translate('color_plugin_enabled'),
                description: Lampa.Lang.translate('color_plugin_enabled_description')
            },
            onChange: function(value) {
                ColorPlugin.settings.enabled = value === 'true';
                saveSettings();

                if (ColorPlugin.settings.enabled) {
                    applyStyles();
                } else {
                    resetAllChanges();
                }

                var mainColorItem = $('.settings-param[data-name="color_plugin_main_color"]');
                if (mainColorItem.length) {
                    mainColorItem.css('display', value === 'true' ? 'block' : 'none');
                }

                updateDependentParamsVisibility();

                // Як у прикладі з анімацією
                if (Lampa.Settings && Lampa.Settings.render) {
                    Lampa.Settings.render();
                    setTimeout(updateDependentParamsVisibility, 80);
                }
            }
        });

        // ─── Вибір кольору ─────────────────────────────────────────────
        Lampa.SettingsApi.addParam({
            component: 'color_plugin',
            param: {
                name: 'color_plugin_main_color',
                type: 'button'
            },
            field: {
                name: Lampa.Lang.translate('main_color'),
                description: Lampa.Lang.translate('main_color_description')
            },
            onRender: function(item) {
                if (Lampa.Storage.get('color_plugin_enabled', 'false') !== 'true') {
                    item.css('display', 'none');
                }
            },
            onChange: openColorPicker
        });

        // ─── Показати рамку ────────────────────────────────────────────
        Lampa.SettingsApi.addParam({
            component: 'color_plugin',
            param: {
                name: 'color_plugin_highlight_enabled',
                type: 'trigger',
                default: 'true'
            },
            field: {
                name: Lampa.Lang.translate('enable_highlight'),
                description: Lampa.Lang.translate('enable_highlight_description')
            },
            onRender: function(item) {
                if (Lampa.Storage.get('color_plugin_enabled', 'false') !== 'true') {
                    item.css('display', 'none');
                }
            },
            onChange: function(value) {
                ColorPlugin.settings.highlight_enabled = value === 'true';
                saveSettings();
                applyStyles();
            }
        });

        // ─── Застосувати затемнення ────────────────────────────────────
        Lampa.SettingsApi.addParam({
            component: 'color_plugin',
            param: {
                name: 'color_plugin_dimming_enabled',
                type: 'trigger',
                default: 'true'
            },
            field: {
                name: Lampa.Lang.translate('enable_dimming'),
                description: Lampa.Lang.translate('enable_dimming_description')
            },
            onRender: function(item) {
                if (Lampa.Storage.get('color_plugin_enabled', 'false') !== 'true') {
                    item.css('display', 'none');
                }
            },
            onChange: function(value) {
                ColorPlugin.settings.dimming_enabled = value === 'true';
                saveSettings();
                applyStyles();
            }
        });

        // Початкове застосування
        applyStyles();
        updateDependentParamsVisibility();

        // Оновлення видимості при кожному відкритті налаштувань
        Lampa.Listener.follow('settings_component', function(e) {
            if (e.type === 'open') {
                setTimeout(updateDependentParamsVisibility, 100);
            }
        });
    }

    // ────────────────────────────────────────────────────────────────
    // Запуск плагіна
    // ────────────────────────────────────────────────────────────────
    if (window.appready) {
        initColorPlugin();
    } else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') {
                initColorPlugin();
            }
        });
    }

    // Реакція на будь-які зміни параметрів плагіна
    Lampa.Storage.listener.follow('change', function(e) {
        if (e.name.startsWith('color_plugin_')) {
            ColorPlugin.settings.enabled = Lampa.Storage.get('color_plugin_enabled', 'false') === 'true';
            applyStyles();
            updateDependentParamsVisibility();
        }
    });

})();
