(function () {
    'use strict';

    // ===================== Локалізація =====================
    Lampa.Lang.add({
        color_plugin: { ru: 'Настройка цветов', en: 'Color settings', uk: 'Налаштування кольорів' },
        color_plugin_enabled: { ru: 'Включить плагин', en: 'Enable plugin', uk: 'Увімкнути плагін' },
        color_plugin_enabled_description: {
            ru: 'Изменяет вид некоторых элементов интерфейса Lampa',
            en: 'Changes the appearance of some Lampa interface elements',
            uk: 'Змінює вигляд деяких елементів інтерфейсу Lampa'
        },
        main_color: { ru: 'Цвет выделения', en: 'Highlight color', uk: 'Колір виділення' },
        main_color_description: { ru: 'Выберите или укажите цвет', en: 'Select or specify a color', uk: 'Виберіть чи вкажіть колір' },
        enable_highlight: { ru: 'Показать рамку', en: 'Show border', uk: 'Показати рамку' },
        enable_highlight_description: {
            ru: 'Включает белую рамку вокруг некоторых выделенных элементов интерфейса',
            en: 'Enables a white border around some highlighted interface elements',
            uk: 'Вмикає білу рамку навколо деяких виділених елементів інтерфейсу'
        },
        enable_dimming: { ru: 'Применить цвет затемнения', en: 'Apply dimming color', uk: 'Застосувати колір затемнення' },
        enable_dimming_description: {
            ru: 'Изменяет цвет затемненных элементов интерфейса на темный оттенок выбранного цвета выделения',
            en: 'Changes the color of dimmed interface elements to a dark shade of the selected highlight color',
            uk: 'Змінює колір затемнених елементів інтерфейсу на темний відтінок вибраного кольору виділення'
        },
        default_color: { ru: 'По умолчанию', en: 'Default', uk: 'За замовчуванням' },
        custom_hex_input: { ru: 'Введи HEX-код цвета', en: 'Enter HEX color code', uk: 'Введи HEX-код кольору' },
        hex_input_hint: { ru: 'Используйте формат #FFFFFF, например #123524', en: 'Use the format #FFFFFF, for example #123524', uk: 'Використовуйте формат #FFFFFF, наприклад #123524' },
        red: { ru: 'Красный', en: 'Red', uk: 'Червоний' },
        orange: { ru: 'Оранжевый', en: 'Orange', uk: 'Помаранчевий' },
        amber: { ru: 'Янтарный', en: 'Amber', uk: 'Бурштиновий' },
        yellow: { ru: 'Желтый', en: 'Yellow', uk: 'Жовтий' },
        lime: { ru: 'Лаймовый', en: 'Lime', uk: 'Лаймовий' },
        green: { ru: 'Зеленый', en: 'Green', uk: 'Зелений' },
        emerald: { ru: 'Изумрудный', en: 'Emerald', uk: 'Смарагдовий' },
        teal: { ru: 'Бирюзовый', en: 'Teal', uk: 'Бірюзовий' },
        cyan: { ru: 'Голубой', en: 'Cyan', uk: 'Блакитний' },
        sky: { ru: 'Небесный', en: 'Sky', uk: 'Небесний' },
        blue: { ru: 'Синий', en: 'Blue', uk: 'Синій' },
        indigo: { ru: 'Индиго', en: 'Indigo', uk: 'Індиго' },
        violet: { ru: 'Фиолетовый', en: 'Violet', uk: 'Фіолетовий' },
        purple: { ru: 'Пурпурный', en: 'Purple', uk: 'Пурпуровий' },
        fuchsia: { ru: 'Фуксия', en: 'Fuchsia', uk: 'Фуксія' },
        pink: { ru: 'Розовый', en: 'Pink', uk: 'Рожевий' },
        rose: { ru: 'Розовый', en: 'Rose', uk: 'Трояндовий' },
        slate: { ru: 'Сланцевый', en: 'Slate', uk: 'Сланцевий' },
        gray: { ru: 'Серый', en: 'Gray', uk: 'Сірий' },
        zinc: { ru: 'Цинковый', en: 'Zinc', uk: 'Цинковий' },
        neutral: { ru: 'Нейтральный', en: 'Neutral', uk: 'Нейтральний' },
        stone: { ru: 'Каменный', en: 'Stone', uk: 'Кам’яний' }
    });

    // ===================== Об'єкт плагіна =====================
    var ColorPlugin = {
        settings: {
            main_color: Lampa.Storage.get('color_plugin_main_color', '#353535'),
            enabled: Lampa.Storage.get('color_plugin_enabled', 'true') === 'true',
            highlight_enabled: Lampa.Storage.get('color_plugin_highlight_enabled', 'true') === 'true',
            dimming_enabled: Lampa.Storage.get('color_plugin_dimming_enabled', 'true') === 'true'
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

    // ===================== Внутрішні змінні =====================
    var isSaving = false;

    // ===================== Функції конвертації =====================
    function hexToRgb(hex) {
        var cleanHex = hex.replace('#', '');
        var r = parseInt(cleanHex.substring(0, 2), 16);
        var g = parseInt(cleanHex.substring(2, 4), 16);
        var b = parseInt(cleanHex.substring(4, 6), 16);
        return r + ', ' + g + ', ' + b;
    }

    function rgbToHex(rgb) {
        var matches = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!matches) return rgb;
        function hex(n) { return ('0' + parseInt(n).toString(16)).slice(-2); }
        return '#' + hex(matches[1]) + hex(matches[2]) + hex(matches[3]);
    }

    function isValidHex(color) {
        return /^#[0-9A-Fa-f]{6}$/.test(color);
    }

    // ===================== Збереження налаштувань =====================
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

    // ===================== Оновлення стилів =====================
    function applyStyles() {
        if (!ColorPlugin.settings.enabled) return;

        if (!isValidHex(ColorPlugin.settings.main_color)) ColorPlugin.settings.main_color = '#353535';

        var style = document.getElementById('color-plugin-styles');
        if (!style) {
            style = document.createElement('style');
            style.id = 'color-plugin-styles';
            document.head.appendChild(style);
        }

        var rgbColor = hexToRgb(ColorPlugin.settings.main_color);
        var focusBorderColor = ColorPlugin.settings.main_color === '#353535' ? '#ffffff' : 'var(--main-color)';

        var highlightStyles = ColorPlugin.settings.highlight_enabled ? (
            '-webkit-box-shadow: inset 0 0 0 0.15em #fff !important;' +
            'box-shadow: inset 0 0 0 0.15em #fff !important;'
        ) : '';

        var dimmingStyles = ColorPlugin.settings.dimming_enabled ? (
            '.full-start__rate {' +
                'background: rgba(var(--main-color-rgb), 0.15) !important;' +
            '}' +
            '.full-start__rate > div:first-child {' +
                'background: rgba(var(--main-color-rgb), 0.15) !important;' +
            '}' +
            '.reaction {' +
                'background-color: rgba(var(--main-color-rgb), 0.3) !important;' +
            '}' +
            '.full-start__button {' +
                'background-color: rgba(var(--main-color-rgb), 0.3) !important;' +
            '}' +
            '.card__vote {' +
                'background: rgba(var(--main-color-rgb), 0.5) !important;' +
            '}' +
            '.items-line__more {' +
                'background: rgba(var(--main-color-rgb), 0.3) !important;' +
            '}' +
            '.card__icons-inner {' +
                'background: rgba(var(--main-color-rgb), 0.5) !important;' +
            '}' +
            '.simple-button--filter > div {' +
                'background-color: rgba(var(--main-color-rgb), 0.3) !important;' +
            '}'
        ) : '';

        style.innerHTML = `
:root {
    --main-color: ${ColorPlugin.settings.main_color} !important;
    --main-color-rgb: ${rgbColor} !important;
    --accent-color: ${ColorPlugin.settings.main_color} !important;
}
.menu__ico, .menu__ico:hover, .menu__ico.traverse, .head__action, .head__action.focus, .head__action:hover, .settings-param__ico {
    color: #ffffff !important;
    fill: #ffffff !important;
}
/* ... повний список стилів понад 400 рядків ... */
.color_square.focus {
    border: 0.3em solid ${focusBorderColor} !important;
    transform: scale(1.1) !important;
}
/* Тут йде весь масив .color-square, .hex-input, .color-picker-container, .torrent-item, .card, .modal і інші стилі */
${dimmingStyles}
        `;

    }

    // ===================== Оновлення іконки плагіна =====================
    function updatePluginIcon() {
        if (!Lampa.SettingsApi || !Lampa.SettingsApi.components) return;

        var component = Lampa.SettingsApi.components.find(c => c.component === 'color_plugin');
        if (component) {
            component.icon = '<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.003a7 7 0 0 0-7 7v.43c.09 1.51 1.91 1.79 3 .7a1.87 1.87 0 0 1 2.64 2.64c1.09 1.09.81 2.91-.7 3H8a7 7 0 0 0 0-14z"/></svg>';
        }
    }

    // ===================== Ініціалізація =====================
    function initPlugin() {
        Lampa.SettingsApi.add({
            component: 'color_plugin',
            title: Lampa.Lang.translate('color_plugin'),
            icon: '<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.003a7 7 0 0 0-7 7v.43c.09 1.51 1.91 1.79 3 .7a1.87 1.87 0 0 1 2.64 2.64c1.09 1.09.81 2.91-.7 3H8a7 7 0 0 0 0-14z"/></svg>',
            params: [
                {
                    type: 'toggle',
                    key: 'enabled',
                    title: Lampa.Lang.translate('color_plugin_enabled'),
                    description: Lampa.Lang.translate('color_plugin_enabled_description'),
                    value: ColorPlugin.settings.enabled,
                    onChange: function (val) {
                        ColorPlugin.settings.enabled = val;
                        saveSettings();
                        applyStyles();
                    }
                },
                {
                    type: 'color',
                    key: 'main_color',
                    title: Lampa.Lang.translate('main_color'),
                    description: Lampa.Lang.translate('main_color_description'),
                    value: ColorPlugin.settings.main_color,
                    onChange: function (val) {
                        ColorPlugin.settings.main_color = val;
                        saveSettings();
                        applyStyles();
                    }
                },
                {
                    type: 'toggle',
                    key: 'highlight_enabled',
                    title: Lampa.Lang.translate('enable_highlight'),
                    description: Lampa.Lang.translate('enable_highlight_description'),
                    value: ColorPlugin.settings.highlight_enabled,
                    onChange: function (val) {
                        ColorPlugin.settings.highlight_enabled = val;
                        saveSettings();
                        applyStyles();
                    }
                },
                {
                    type: 'toggle',
                    key: 'dimming_enabled',
                    title: Lampa.Lang.translate('enable_dimming'),
                    description: Lampa.Lang.translate('enable_dimming_description'),
                    value: ColorPlugin.settings.dimming_enabled,
                    onChange: function (val) {
                        ColorPlugin.settings.dimming_enabled = val;
                        saveSettings();
                        applyStyles();
                    }
                }
            ]
        });

        applyStyles();
        updatePluginIcon();
    }

    document.addEventListener('DOMContentLoaded', initPlugin);
})();
