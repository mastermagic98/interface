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
        },

        // Назви сімейств кольорів
        red:    { ru: 'Красный',    en: 'Red',    uk: 'Червоний'    },
        orange: { ru: 'Оранжевый',  en: 'Orange', uk: 'Помаранчевий' },
        amber:  { ru: 'Янтарный',   en: 'Amber',  uk: 'Бурштиновий' },
        yellow: { ru: 'Желтый',     en: 'Yellow', uk: 'Жовтий'      },
        lime:   { ru: 'Лаймовый',   en: 'Lime',   uk: 'Лаймовий'    },
        green:  { ru: 'Зеленый',    en: 'Green',  uk: 'Зелений'     },
        emerald:{ ru: 'Изумрудный', en: 'Emerald',uk: 'Смарагдовий' },
        teal:   { ru: 'Бирюзовый',  en: 'Teal',   uk: 'Бірюзовий'   },
        cyan:   { ru: 'Голубой',    en: 'Cyan',   uk: 'Блакитний'   },
        sky:    { ru: 'Небесный',   en: 'Sky',    uk: 'Небесний'    },
        blue:   { ru: 'Синий',      en: 'Blue',   uk: 'Синій'       },
        indigo: { ru: 'Индиго',     en: 'Indigo', uk: 'Індиго'      },
        violet: { ru: 'Фиолетовый', en: 'Violet', uk: 'Фіолетовий'  },
        purple: { ru: 'Пурпурный',  en: 'Purple', uk: 'Пурпуровий'  },
        fuchsia:{ ru: 'Фуксия',     en: 'Fuchsia',uk: 'Фуксія'      },
        pink:   { ru: 'Розовый',    en: 'Pink',   uk: 'Рожевий'     },
        rose:   { ru: 'Розовый',    en: 'Rose',   uk: 'Трояндовий'  },
        slate:  { ru: 'Сланцевый',  en: 'Slate',  uk: 'Сланцевий'   },
        gray:   { ru: 'Серый',      en: 'Gray',   uk: 'Сірий'       },
        zinc:   { ru: 'Цинковый',   en: 'Zinc',   uk: 'Цинковий'    },
        neutral:{ ru: 'Нейтральный',en: 'Neutral',uk: 'Нейтральний' },
        stone:  { ru: 'Каменный',   en: 'Stone',  uk: 'Кам’яний'    }
    });


    // ────────────────────────────────────────────────────────────────
    // Основний об’єкт плагіна
    // ────────────────────────────────────────────────────────────────
    var ColorPlugin = {
        version: '3.0.2025',

        settings: {
            enabled:          false,   // !!! ЗА ЗАМОВЧУВАННЯМ ВИМКНЕНО !!!
            main_color:       '#353535',
            highlight_enabled: true,
            dimming_enabled:  true
        },

        // Палітра кольорів
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

    var isSaving = false;

    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        var r = parseInt(hex.substr(0,2), 16);
        var g = parseInt(hex.substr(2,2), 16);
        var b = parseInt(hex.substr(4,2), 16);
        return r + ',' + g + ',' + b;
    }

    function rgbToHex(rgb) {
        var m = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!m) return rgb;
        return '#' + [m[1],m[2],m[3]].map(function(x){
            return ('0' + parseInt(x).toString(16)).slice(-2);
        }).join('');
    }

    function isValidHex(str) {
        return /^#[0-9A-Fa-f]{6}$/.test(str);
    }

    function saveSettings() {
        if (isSaving) return;
        isSaving = true;

        Lampa.Storage.set('color_plugin_enabled',          ColorPlugin.settings.enabled.toString());
        Lampa.Storage.set('color_plugin_main_color',       ColorPlugin.settings.main_color);
        Lampa.Storage.set('color_plugin_highlight_enabled',ColorPlugin.settings.highlight_enabled.toString());
        Lampa.Storage.set('color_plugin_dimming_enabled',  ColorPlugin.settings.dimming_enabled.toString());

        localStorage.setItem('color_plugin_enabled',          ColorPlugin.settings.enabled.toString());
        localStorage.setItem('color_plugin_main_color',       ColorPlugin.settings.main_color);
        localStorage.setItem('color_plugin_highlight_enabled',ColorPlugin.settings.highlight_enabled.toString());
        localStorage.setItem('color_plugin_dimming_enabled',  ColorPlugin.settings.dimming_enabled.toString());

        isSaving = false;
    }

    // ────────────────────────────────────────────────────────────────
    // Скидання всіх змін при вимкненні плагіна
    // ────────────────────────────────────────────────────────────────
    function resetAllChanges() {
        var style = document.getElementById('color-plugin-styles');
        if (style) {
            style.remove();
        }

        // Повертаємо оригінальні кольори, де можливо
        document.documentElement.style.removeProperty('--main-color');
        document.documentElement.style.removeProperty('--main-color-rgb');
        document.documentElement.style.removeProperty('--accent-color');

        // Примусово чистимо деякі елементи
        var els = document.querySelectorAll([
            '.full-start__rate', '.reaction', '.full-start__button',
            '.card__vote', '.items-line__more', '.card__icons-inner',
            '.simple-button--filter > div', '.timetable__item--any::before'
        ].join(','));

        els.forEach(function(el){
            el.style.removeProperty('background');
            el.style.removeProperty('background-color');
            el.style.removeProperty('border-color');
            el.style.removeProperty('box-shadow');
        });

        // Очищення іконок, дати тощо
        updateSvgIcons(true);  // true = режим скидання
    }


    function applyStyles() {
        if (!ColorPlugin.settings.enabled) {
            resetAllChanges();
            return;
        }

        var mc = ColorPlugin.settings.main_color;
        if (!isValidHex(mc)) mc = '#353535';

        var rgb = hexToRgb(mc);
        var focusBorder = (mc === '#353535') ? '#ffffff' : mc;

        var highlight = ColorPlugin.settings.highlight_enabled ? 
            'inset 0 0 0 0.15em #fff' : '';

        var dimming = ColorPlugin.settings.dimming_enabled ? 
            [
                '.full-start__rate, .full-start__rate > div:first-child { background: rgba(' + rgb + ', 0.15) !important; }',
                '.reaction, .full-start__button, .items-line__more { background-color: rgba(' + rgb + ', 0.3) !important; }',
                '.card__vote, .card__icons-inner { background: rgba(' + rgb + ', 0.5) !important; }',
                '.simple-button--filter > div { background-color: rgba(' + rgb + ', 0.3) !important; }'
            ].join('\n') : '';

        var css = [
            ':root {',
            '  --main-color: ' + mc + ' !important;',
            '  --main-color-rgb: ' + rgb + ' !important;',
            '  --accent-color: ' + mc + ' !important;',
            '}',

            // ──────────────────────────────
            // Основні стилі фокусу / виділення
            // ──────────────────────────────
            '.menu__item.focus, .menu__item.traverse, .menu__item:hover,',
            '.full-start__button.focus, .settings-param.focus, .settings-folder.focus,',
            '.simple-button.focus, .head__action.focus, .navigation-tabs__button.focus {',
            '  background: var(--main-color) !important;',
            '  color: #ffffff !important;',
            '}',

            '.full-start__button.focus, .settings-param.focus, .items-line__more.focus,',
            '.menu__item.focus, .settings-folder.focus, .selectbox-item.focus {',
            '  -webkit-box-shadow: ' + highlight + ' !important;',
            '  box-shadow: ' + highlight + ' !important;',
            '}',

            // ──────────────────────────────
            // Інші специфічні елементи
            // ──────────────────────────────
            '.console__tab.focus { background: var(--main-color) !important; color:#fff !important; ' + highlight + ' }',
            '.player-panel .button.focus { background-color: var(--main-color) !important; color:#fff !important; }',
            '.online.focus { box-shadow: 0 0 0 0.2em var(--main-color) !important; }',
            '.card.focus .card__view, .card:hover .card__view { border-color: var(--main-color) !important; }',
            '.color_square.focus { border: 0.3em solid ' + focusBorder + ' !important; transform: scale(1.1) !important; }',
            '.hex-input.focus { border: 0.2em solid ' + focusBorder + ' !important; transform: scale(1.1) !important; }',

            // ──────────────────────────────
            // Затемнення
            // ──────────────────────────────
            dimming,

            // ──────────────────────────────
            // Стилі модального вікна вибору кольору
            // ──────────────────────────────
            '.color_square {',
            '  width: 35px !important; height: 35px !important;',
            '  border-radius: 4px !important; cursor: pointer !important;',
            '  display: flex !important; align-items: center !important; justify-content: center !important;',
            '}',
            '.color_square.default { background:#fff !important; position:relative !important; }',
            '.color_square.default::before, .color_square.default::after {',
            '  content:""; position:absolute; top:50%; left:10%; right:10%; height:3px;',
            '  background:#353535 !important;',
            '}',
            '.color_square.default::before  { transform:rotate(45deg); }',
            '.color_square.default::after   { transform:rotate(-45deg); }',

            '.color-family-name {',
            '  width:80px; height:35px; border:2px solid; border-radius:4px;',
            '  display:flex; align-items:center; justify-content:center;',
            '  font-weight:bold; font-size:10px; color:#fff; text-transform:capitalize;',
            '}',
            '.hex-input {',
            '  width:266px; height:35px; border-radius:8px; border:2px solid #ddd;',
            '  background:#353535; color:#fff; font-weight:bold; font-size:12px;',
            '  display:flex; flex-direction:column; align-items:center; justify-content:center;',
            '  cursor:pointer;',
            '}',
            '.color-picker-container {',
            '  display:grid; grid-template-columns:1fr 1fr; gap:10px; padding:0;',
            '}',
            '@media (max-width:768px) {',
            '  .color-picker-container { grid-template-columns:1fr; }',
            '}'
        ].join('\n');

        var el = document.getElementById('color-plugin-styles');
        if (!el) {
            el = document.createElement('style');
            el.id = 'color-plugin-styles';
            document.head.appendChild(el);
        }
        el.textContent = css;

        // Додаткові разові правки
        forceBlackFilterBackground();
        updateDateElementStyles();
        updateSvgIcons();
    }


    function forceBlackFilterBackground() {
        document.querySelectorAll('.simple-button--filter > div').forEach(function(div){
            var bg = window.getComputedStyle(div).backgroundColor;
            if (bg === 'rgba(255, 255, 255, 0.3)' || bg === 'rgb(255, 255, 255)') {
                div.style.backgroundColor = 'rgba(0,0,0,0.3)';
            }
        });
    }


    function updateDateElementStyles() {
        document.querySelectorAll('div[style*="position: absolute; left: 1em; top: 1em;"]').forEach(function(el){
            if (el.querySelector('div[style*="font-size: 2.6em"]')) {
                el.style.background = 'none';
                el.style.padding = '0.7em';
                el.style.borderRadius = '0.7em';
            }
        });
    }


    function updateSvgIcons(reset) {
        var paths = document.querySelectorAll('path[d^="M2 1.5H19C"], path[d^="M3.81972 14.5957V"], path[d^="M8.39409 0.192139L"]');
        paths.forEach(function(p){
            if (reset) {
                p.removeAttribute('fill');
                p.removeAttribute('style');
            } else if (p.getAttribute('d').indexOf('M8.39409') !== -1) {
                if (p.getAttribute('fill') !== 'none') {
                    p.setAttribute('fill', 'var(--main-color)');
                }
            } else {
                p.setAttribute('fill', 'none');
            }
        });
    }


    function updatePluginIcon() {
        var ico = document.querySelector('.menu__item[data-component="color_plugin"] .menu__ico');
        if (ico) {
            ico.innerHTML = '<svg width="24" height="24" viewBox="0 0 16 16" fill="#ffffff"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.003a7 7 0 0 0-7 7v.43c.09 1.51 1.91 1.79 3 .7a1.87 1.87 0 0 1 2.64 2.64c-1.1 1.16-.79 3.07.8 3.2h.6a7 7 0 1 0 0-14l-.04.03zm0 13h-.52a.58.58 0 0 1-.36-.14.56.56 0 0 1-.15-.3 1.24 1.24 0 0 1 .35-1.08 2.87 2.87 0 0 0 0-4 2.87 2.87 0 0 0-4.06 0 1 1 0 0 1-.9.34.41.41 0 0 1-.22-.12.42.42 0 0 1-.1-.29v-.37a6 6 0 1 1 6 6l-.04-.04zM9 3.997a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 7.007a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-7-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM13 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>';
        }
    }


    // ────────────────────────────────────────────────────────────────
    // Оновлення видимості додаткових параметрів
    // ────────────────────────────────────────────────────────────────
    function updateParamsVisibility() {
        var show = ColorPlugin.settings.enabled;

        var names = [
            'color_plugin_main_color',
            'color_plugin_highlight_enabled',
            'color_plugin_dimming_enabled'
        ];

        names.forEach(function(name){
            var sel = '.settings-param[data-name="' + name + '"]';
            document.querySelectorAll(sel).forEach(function(el){
                el.style.display = show ? '' : 'none';
            });
        });
    }


    // ────────────────────────────────────────────────────────────────
    // Модальне вікно вибору кольору
    // ────────────────────────────────────────────────────────────────
    function createColorHtml(color, name) {
        if (color === 'default') {
            return '<div class="color_square selector default" tabindex="0" title="' + name + '"></div>';
        }
        return '<div class="color_square selector" tabindex="0" style="background-color:' + color + ';" title="' + name + '">' +
               '<div class="hex">' + color.replace('#','') + '</div></div>';
    }

    function createFamilyNameHtml(name, firstColor) {
        return '<div class="color-family-name" style="border-color:' + (firstColor||'#353535') + '">' +
               Lampa.Lang.translate(name.toLowerCase()) + '</div>';
    }

    function openColorPicker() {
        var families = [
            'Red','Orange','Amber','Yellow','Lime','Green','Emerald','Teal','Cyan',
            'Sky','Blue','Indigo','Violet','Purple','Fuchsia','Pink','Rose',
            'Slate','Gray','Zinc','Neutral','Stone'
        ];

        var colorContent = families.map(function(family){
            var famColors = Object.keys(ColorPlugin.colors.main).filter(function(k){
                return ColorPlugin.colors.main[k].indexOf(family + ' ') === 0;
            });
            if (!famColors.length) return '';

            var first = famColors[0];
            var nameHtml = createFamilyNameHtml(family, first);
            var squares = famColors.map(function(c){
                return createColorHtml(c, ColorPlugin.colors.main[c]);
            }).join('');

            return '<div class="color-family-outline">' + nameHtml + squares + '</div>';
        }).join('');

        var defBtn = createColorHtml('default', Lampa.Lang.translate('default_color'));

        var customHex = Lampa.Storage.get('color_plugin_custom_hex', '#353535');
        var hexInput = '<div class="color_square selector hex-input" tabindex="0" style="background-color:' + customHex + ';">' +
                       '<div class="label">' + Lampa.Lang.translate('custom_hex_input') + '</div>' +
                       '<div class="value">' + customHex.replace('#','') + '</div></div>';

        var top = '<div style="display:flex; gap:19px; justify-content:center; margin-bottom:10px;">' +
                  defBtn + hexInput + '</div>';

        var columns = '<div class="color-picker-container">' +
                      '<div>' + colorContent.substring(0, colorContent.length/2|0) + '</div>' +
                      '<div>' + colorContent.substring(colorContent.length/2|0) + '</div>' +
                      '</div>';

        var content = $('<div>' + top + columns + '</div>');

        Lampa.Modal.open({
            title: Lampa.Lang.translate('main_color'),
            html: content,
            size: 'medium',
            align: 'center',
            className: 'color-picker-modal',

            onSelect: function(selected){
                if (!selected.length) return;

                var el = selected[0];
                var color;

                if (el.classList.contains('hex-input')) {
                    Lampa.Modal.close();
                    Lampa.Input.edit({
                        name: 'color_plugin_custom_hex',
                        value: Lampa.Storage.get('color_plugin_custom_hex', ''),
                        placeholder: '#FFFFFF'
                    }, function(val){
                        if (!val || !isValidHex(val)) {
                            Lampa.Noty.show('Невірний HEX-код');
                            return;
                        }
                        ColorPlugin.settings.main_color = val;
                        Lampa.Storage.set('color_plugin_custom_hex', val);
                        applyStyles();
                        saveSettings();
                        updateParamsVisibility();
                    });
                    return;
                }

                if (el.classList.contains('default')) {
                    color = '#353535';
                } else {
                    color = el.style.backgroundColor;
                    if (color.includes('rgb')) color = rgbToHex(color);
                }

                ColorPlugin.settings.main_color = color;
                Lampa.Storage.set('color_plugin_main_color', color);
                applyStyles();
                saveSettings();
                updateParamsVisibility();
                Lampa.Modal.close();
            },

            onBack: function(){
                saveSettings();
                Lampa.Modal.close();
            }
        });
    }


    // ────────────────────────────────────────────────────────────────
    // Ініціалізація плагіна
    // ────────────────────────────────────────────────────────────────
    function initPlugin() {
        // Завантаження збережених значень
        ColorPlugin.settings.enabled           = Lampa.Storage.get('color_plugin_enabled', 'false') === 'true';
        ColorPlugin.settings.main_color        = Lampa.Storage.get('color_plugin_main_color', '#353535');
        ColorPlugin.settings.highlight_enabled = Lampa.Storage.get('color_plugin_highlight_enabled', 'true') === 'true';
        ColorPlugin.settings.dimming_enabled   = Lampa.Storage.get('color_plugin_dimming_enabled', 'true') === 'true';

        if (!Lampa.SettingsApi) return;

        // Додаємо компонент
        Lampa.SettingsApi.addComponent({
            component: 'color_plugin',
            name: Lampa.Lang.translate('color_plugin'),
            icon: '<svg width="24" height="24" viewBox="0 0 16 16" fill="#ffffff"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.003a7 7 0 0 0-7 7v.43c.09 1.51 1.91 1.79 3 .7a1.87 1.87 0 0 1 2.64 2.64c-1.1 1.16-.79 3.07.8 3.2h.6a7 7 0 1 0 0-14l-.04.03zm0 13h-.52a.58.58 0 0 1-.36-.14.56.56 0 0 1-.15-.3 1.24 1.24 0 0 1 .35-1.08 2.87 2.87 0 0 0 0-4 2.87 2.87 0 0 0-4.06 0 1 1 0 0 1-.9.34.41.41 0 0 1-.22-.12.42.42 0 0 1-.1-.29v-.37a6 6 0 1 1 6 6l-.04-.04zM9 3.997a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 7.007a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-7-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM13 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>'
        });

        // ─── Увімкнення / вимкнення ────────────────────────
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
            onChange: function(val){
                ColorPlugin.settings.enabled = val === 'true';
                saveSettings();

                if (ColorPlugin.settings.enabled) {
                    applyStyles();
                } else {
                    resetAllChanges();
                }

                updateParamsVisibility();
                if (Lampa.Settings && Lampa.Settings.render) Lampa.Settings.render();
            }
        });

        // ─── Колір виділення ───────────────────────────────
        Lampa.SettingsApi.addParam({
            component: 'color_plugin',
            param: { name: 'color_plugin_main_color', type: 'button' },
            field: {
                name: Lampa.Lang.translate('main_color'),
                description: Lampa.Lang.translate('main_color_description')
            },
            onChange: openColorPicker,
            onRender: function(item){
                item.css('display', ColorPlugin.settings.enabled ? 'block' : 'none');
            }
        });

        // ─── Показати рамку ────────────────────────────────
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
            onChange: function(val){
                ColorPlugin.settings.highlight_enabled = val === 'true';
                saveSettings();
                applyStyles();
            },
            onRender: function(item){
                item.css('display', ColorPlugin.settings.enabled ? 'block' : 'none');
            }
        });

        // ─── Застосувати затемнення ────────────────────────
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
            onChange: function(val){
                ColorPlugin.settings.dimming_enabled = val === 'true';
                saveSettings();
                applyStyles();
            },
            onRender: function(item){
                item.css('display', ColorPlugin.settings.enabled ? 'block' : 'none');
            }
        });

        // Початкове застосування
        applyStyles();
        updateParamsVisibility();
        updatePluginIcon();
    }


    // ────────────────────────────────────────────────────────────────
    // Запуск
    // ────────────────────────────────────────────────────────────────
    if (window.appready) {
        initPlugin();
    } else {
        Lampa.Listener.follow('app', function(e){
            if (e.type === 'ready') initPlugin();
        });
    }

    // Слухаємо зміни в сховищі
    Lampa.Storage.listener.follow('change', function(e){
        var n = e.name;
        if (n.indexOf('color_plugin_') === 0) {
            ColorPlugin.settings.enabled           = Lampa.Storage.get('color_plugin_enabled', 'false') === 'true';
            ColorPlugin.settings.main_color        = Lampa.Storage.get('color_plugin_main_color', '#353535');
            ColorPlugin.settings.highlight_enabled = Lampa.Storage.get('color_plugin_highlight_enabled', 'true') === 'true';
            ColorPlugin.settings.dimming_enabled   = Lampa.Storage.get('color_plugin_dimming_enabled', 'true') === 'true';

            applyStyles();
            updateParamsVisibility();
        }
    });

    // Оновлення при відкритті/закритті налаштувань
    Lampa.Listener.follow('settings_component', function(e){
        if (e.type === 'open') {
            updateParamsVisibility(e.body);
            applyStyles();
        }
        if (e.type === 'close') {
            saveSettings();
        }
    });

    // Спостереження за появою фільтрів
    setTimeout(function(){
        if (typeof MutationObserver === 'undefined') return;
        new MutationObserver(function(muts){
            var need = false;
            muts.forEach(function(m){
                if (m.addedNodes) {
                    for (var i=0;i<m.addedNodes.length;i++) {
                        if (m.addedNodes[i].querySelector && m.addedNodes[i].querySelector('.simple-button--filter')) {
                            need = true; break;
                        }
                    }
                }
            });
            if (need) setTimeout(forceBlackFilterBackground, 80);
        }).observe(document.body, {childList:true, subtree:true});
    }, 800);

})();
