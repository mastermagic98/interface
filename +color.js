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

        // Кольори (назви сімейств)
        red:    { ru: 'Красный',    en: 'Red',    uk: 'Червоний'    },
        orange: { ru: 'Оранжевый',  en: 'Orange',  uk: 'Помаранчевий' },
        amber:  { ru: 'Янтарный',   en: 'Amber',   uk: 'Бурштиновий'  },
        yellow: { ru: 'Желтый',     en: 'Yellow',  uk: 'Жовтий'      },
        lime:   { ru: 'Лаймовый',   en: 'Lime',    uk: 'Лаймовий'     },
        green:  { ru: 'Зеленый',    en: 'Green',   uk: 'Зелений'      },
        emerald:{ ru: 'Изумрудный', en: 'Emerald', uk: 'Смарагдовий'  },
        teal:   { ru: 'Бирюзовый',  en: 'Teal',    uk: 'Бірюзовий'    },
        cyan:   { ru: 'Голубой',    en: 'Cyan',    uk: 'Блакитний'    },
        sky:    { ru: 'Небесный',   en: 'Sky',     uk: 'Небесний'     },
        blue:   { ru: 'Синий',      en: 'Blue',    uk: 'Синій'        },
        indigo: { ru: 'Индиго',     en: 'Indigo',  uk: 'Індиго'       },
        violet: { ru: 'Фиолетовый', en: 'Violet',  uk: 'Фіолетовий'   },
        purple: { ru: 'Пурпурный',  en: 'Purple',  uk: 'Пурпуровий'   },
        fuchsia:{ ru: 'Фуксия',     en: 'Fuchsia', uk: 'Фуксія'       },
        pink:   { ru: 'Розовый',    en: 'Pink',    uk: 'Рожевий'      },
        rose:   { ru: 'Розовый',    en: 'Rose',    uk: 'Трояндовий'   },
        slate:  { ru: 'Сланцевый',  en: 'Slate',   uk: 'Сланцевий'    },
        gray:   { ru: 'Серый',      en: 'Gray',    uk: 'Сірий'        },
        zinc:   { ru: 'Цинковый',   en: 'Zinc',    uk: 'Цинковий'     },
        neutral:{ ru: 'Нейтральный',en: 'Neutral', uk: 'Нейтральний'  },
        stone:  { ru: 'Каменный',   en: 'Stone',   uk: 'Кам’яний'     }
    });

    // ────────────────────────────────────────────────────────────────
    // Основний об'єкт плагіна
    // ────────────────────────────────────────────────────────────────
    var ColorPlugin = {
        settings: {
            enabled:           Lampa.Storage.get('color_plugin_enabled',           'false') === 'true',
            main_color:        Lampa.Storage.get('color_plugin_main_color',        '#353535'),
            highlight_enabled: Lampa.Storage.get('color_plugin_highlight_enabled', 'true')  === 'true',
            dimming_enabled:   Lampa.Storage.get('color_plugin_dimming_enabled',   'true')  === 'true'
        },

        colors: {
            main: {
                'default': Lampa.Lang.translate('default_color'),

                '#fb2c36': 'Red 1',     '#e7000b': 'Red 2',     '#c10007': 'Red 3',     '#9f0712': 'Red 4',     '#82181a': 'Red 5',     '#460809': 'Red 6',
                '#ff6900': 'Orange 1',  '#f54900': 'Orange 2',  '#ca3500': 'Orange 3',  '#9f2d00': 'Orange 4',  '#7e2a0c': 'Orange 5',  '#441306': 'Orange 6',
                '#fe9a00': 'Amber 1',   '#e17100': 'Amber 2',   '#bb4d00': 'Amber 3',   '#973c00': 'Amber 4',   '#7b3306': 'Amber 5',   '#461901': 'Amber 6',
                '#f0b100': 'Yellow 1',  '#d08700': 'Yellow 2',  '#a65f00': 'Yellow 3',  '#894b00': 'Yellow 4',  '#733e0a': 'Yellow 5',  '#432004': 'Yellow 6',
                '#7ccf00': 'Lime 1',    '#5ea500': 'Lime 2',    '#497d00': 'Lime 3',    '#3c6300': 'Lime 4',    '#35530e': 'Lime 5',    '#192e03': 'Lime 6',
                '#00c950': 'Green 1',   '#00a63e': 'Green 2',   '#008236': 'Green 3',   '#016630': 'Green 4',   '#0d542b': 'Green 5',   '#032e15': 'Green 6',
                '#00bc7d': 'Emerald 1', '#009966': 'Emerald 2', '#007a55': 'Emerald 3', '#006045': 'Emerald 4', '#004f3b': 'Emerald 5', '#002c22': 'Emerald 6',
                '#00bba7': 'Teal 1',    '#009689': 'Teal 2',    '#00786f': 'Teal 3',    '#005f5a': 'Teal 4',    '#0b4f4a': 'Teal 5',    '#022f2e': 'Teal 6',
                '#00b8db': 'Cyan 1',    '#0092b8': 'Cyan 2',    '#007595': 'Cyan 3',    '#005f78': 'Cyan 4',    '#104e64': 'Cyan 5',    '#053345': 'Cyan 6',
                '#00a6f4': 'Sky 1',     '#0084d1': 'Sky 2',     '#0069a8': 'Sky 3',     '#00598a': 'Sky 4',     '#024a70': 'Sky 5',     '#052f4a': 'Sky 6',
                '#2b7fff': 'Blue 1',    '#155dfc': 'Blue 2',    '#1447e6': 'Blue 3',    '#193cb8': 'Blue 4',    '#1c398e': 'Blue 5',    '#162456': 'Blue 6',
                '#615fff': 'Indigo 1',  '#4f39f6': 'Indigo 2',  '#432dd7': 'Indigo 3',  '#372aac': 'Indigo 4',  '#312c85': 'Indigo 5',  '#1e1a4d': 'Indigo 6',
                '#8e51ff': 'Violet 1',  '#7f22fe': 'Violet 2',  '#7008e7': 'Violet 3',  '#5d0ec0': 'Violet 4',  '#4d179a': 'Violet 5',  '#2f0d68': 'Violet 6',
                '#ad46ff': 'Purple 1',  '#9810fa': 'Purple 2',  '#8200db': 'Purple 3',  '#6e11b0': 'Purple 4',  '#59168b': 'Purple 5',  '#3c0366': 'Purple 6',
                '#e12afb': 'Fuchsia 1', '#c800de': 'Fuchsia 2', '#a800b7': 'Fuchsia 3', '#8a0194': 'Fuchsia 4', '#721378': 'Fuchsia 5', '#4b004f': 'Fuchsia 6',
                '#f6339a': 'Pink 1',    '#e60076': 'Pink 2',    '#c6005c': 'Pink 3',    '#a3004c': 'Pink 4',    '#861043': 'Pink 5',    '#510424': 'Pink 6',
                '#ff2056': 'Rose 1',    '#ec003f': 'Rose 2',    '#c70036': 'Rose 3',    '#a50036': 'Rose 4',    '#8b0836': 'Rose 5',    '#4d0218': 'Rose 6',
                '#62748e': 'Slate 1',   '#45556c': 'Slate 2',   '#314158': 'Slate 3',   '#1d293d': 'Slate 4',   '#0f172b': 'Slate 5',   '#020618': 'Slate 6',
                '#6a7282': 'Gray 1',    '#4a5565': 'Gray 2',    '#364153': 'Gray 3',    '#1e2939': 'Gray 4',    '#101828': 'Gray 5',    '#030712': 'Gray 6',
                '#71717b': 'Zinc 1',    '#52525c': 'Zinc 2',    '#3f3f46': 'Zinc 3',    '#27272a': 'Zinc 4',    '#18181b': 'Zinc 5',    '#09090b': 'Zinc 6',
                '#737373': 'Neutral 1', '#525252': 'Neutral 2', '#404040': 'Neutral 3', '#262626': 'Neutral 4', '#171717': 'Neutral 5', '#0a0a0a': 'Neutral 6',
                '#79716b': 'Stone 1',   '#57534d': 'Stone 2',   '#44403b': 'Stone 3',   '#292524': 'Stone 4',   '#1c1917': 'Stone 5',   '#0c0a09': 'Stone 6'
            }
        }
    };

    var isSaving = false;

    // ────────────────────────────────────────────────────────────────
    // Допоміжні функції
    // ────────────────────────────────────────────────────────────────

    function hexToRgb(hex) {
        var c = hex.replace('#', '');
        var r = parseInt(c.substr(0,2), 16);
        var g = parseInt(c.substr(2,2), 16);
        var b = parseInt(c.substr(4,2), 16);
        return r + ', ' + g + ', ' + b;
    }

    function rgbToHex(rgb) {
        var m = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!m) return rgb;
        return '#' + 
            ('0' + parseInt(m[1],10).toString(16)).slice(-2) +
            ('0' + parseInt(m[2],10).toString(16)).slice(-2) +
            ('0' + parseInt(m[3],10).toString(16)).slice(-2);
    }

    function isValidHex(color) {
        return /^#[0-9A-Fa-f]{6}$/.test(color);
    }

    function saveSettings() {
        if (isSaving) return;
        isSaving = true;

        Lampa.Storage.set('color_plugin_enabled',           ColorPlugin.settings.enabled.toString());
        Lampa.Storage.set('color_plugin_main_color',        ColorPlugin.settings.main_color);
        Lampa.Storage.set('color_plugin_highlight_enabled', ColorPlugin.settings.highlight_enabled.toString());
        Lampa.Storage.set('color_plugin_dimming_enabled',   ColorPlugin.settings.dimming_enabled.toString());

        localStorage.setItem('color_plugin_enabled',           ColorPlugin.settings.enabled.toString());
        localStorage.setItem('color_plugin_main_color',        ColorPlugin.settings.main_color);
        localStorage.setItem('color_plugin_highlight_enabled', ColorPlugin.settings.highlight_enabled.toString());
        localStorage.setItem('color_plugin_dimming_enabled',   ColorPlugin.settings.dimming_enabled.toString());

        isSaving = false;
    }

    // ────────────────────────────────────────────────────────────────
    // Стилі — основна логіка
    // ────────────────────────────────────────────────────────────────

    function applyStyles() {
        var oldStyle = document.getElementById('color-plugin-styles');
        if (oldStyle) oldStyle.remove();

        if (!ColorPlugin.settings.enabled) {
            // При вимкненні — просто прибираємо всі стилі → повернення до оригіналу
            return;
        }

        // Захист від некоректного кольору
        if (!isValidHex(ColorPlugin.settings.main_color)) {
            ColorPlugin.settings.main_color = '#353535';
        }

        var style = document.createElement('style');
        style.id = 'color-plugin-styles';
        document.head.appendChild(style);

        var rgb = hexToRgb(ColorPlugin.settings.main_color);

        var focusBorder = (ColorPlugin.settings.main_color === '#353535')
            ? '#ffffff'
            : 'var(--main-color)';

        var highlightCSS = ColorPlugin.settings.highlight_enabled
            ? 'inset 0 0 0 0.15em #fff !important'
            : '';

        var dimmingCSS = ColorPlugin.settings.dimming_enabled ? [
            '.full-start__rate, .full-start__rate > div:first-child { background: rgba(var(--main-color-rgb), 0.15) !important; }',
            '.reaction, .full-start__button, .items-line__more { background-color: rgba(var(--main-color-rgb), 0.3) !important; }',
            '.card__vote, .card__icons-inner { background: rgba(var(--main-color-rgb), 0.5) !important; }',
            '.simple-button--filter > div { background-color: rgba(var(--main-color-rgb), 0.3) !important; }'
        ].join('\n') : '';

        style.textContent = [
            ':root {',
            '  --main-color: ' + ColorPlugin.settings.main_color + ' !important;',
            '  --main-color-rgb: ' + rgb + ' !important;',
            '  --accent-color: ' + ColorPlugin.settings.main_color + ' !important;',
            '}',

            '.modal__title { font-size: 1.7em !important; }',
            '.modal__head { margin-bottom: 0 !important; }',
            '.modal .scroll__content { padding: 1.0em 0 !important; }',

            '.menu__ico, .menu__ico:hover, .menu__ico.traverse,',
            '.head__action, .head__action.focus, .head__action:hover, .settings-param__ico {',
            '  color: #ffffff !important; fill: #ffffff !important;',
            '}',
            '.menu__ico.focus { color: #ffffff !important; fill: #ffffff !important; stroke: none !important; }',

            '.menu__item.focus .menu__ico path[fill], .menu__item.focus .menu__ico rect[fill],',
            '.menu__item.focus .menu__ico circle[fill],',
            '.menu__item.traverse .menu__ico path[fill],',
            '.menu__item:hover .menu__ico path[fill] { fill: #ffffff !important; }',

            '.menu__item.focus .menu__ico [stroke],',
            '.menu__item.traverse .menu__ico [stroke],',
            '.menu__item:hover .menu__ico [stroke] { stroke: #fff !important; }',

            // Фон + текст при фокусі / наведенні
            '.menu__item.focus, .menu__item.traverse, .menu__item:hover,',
            '.console__tab.focus, .settings-param.focus, .selectbox-item.focus,',
            '.full-person.focus, .full-start__button.focus, .full-descr__tag.focus,',
            '.simple-button.focus, .player-panel .button.focus, .search-source.active,',
            '.radio-item.focus, .lang__selector-item.focus, .modal__button.focus,',
            '.search-history-key.focus, .simple-keyboard-mic.focus,',
            '.full-review-add.focus, .full-review.focus, .tag-count.focus,',
            '.settings-folder.focus, .noty, .radio-player.focus {',
            '  background: var(--main-color) !important;',
            '  color: #ffffff !important;',
            '}',

            '.console__tab { background-color: var(--main-color) !important; }',
            '.console__tab.focus { background: var(--main-color) !important; ' + highlightCSS + ' }',

            '.full-start__button.focus, .settings-param.focus, .items-line__more.focus,',
            '.menu__item.focus, .settings-folder.focus, .head__action.focus,',
            '.selectbox-item.focus, .simple-button.focus, .navigation-tabs__button.focus {',
            highlightCSS ? 'box-shadow: ' + highlightCSS + ';' : '',
            '}',

            '.timetable__item.focus::before { background-color: var(--main-color) !important; ' + highlightCSS + ' }',
            '.navigation-tabs__button.focus { background-color: var(--main-color) !important; color: #fff !important; ' + highlightCSS + ' }',
            '.items-line__more.focus { color: #fff !important; background-color: var(--main-color) !important; }',

            '.online.focus { box-shadow: 0 0 0 0.2em var(--main-color) !important; }',

            '.card.focus .card__view, .card:hover .card__view { border-color: var(--main-color) !important; }',

            '.noty { background: var(--main-color) !important; }',
            '.player-panel__position { background-color: var(--main-color) !important; }',
            '.time-line > div { background-color: var(--main-color) !important; }',

            '.color_square.focus {',
            '  border: 0.3em solid ' + focusBorder + ' !important;',
            '  transform: scale(1.1) !important;',
            '}',
            '.hex-input.focus {',
            '  border: 0.2em solid ' + focusBorder + ' !important;',
            '  transform: scale(1.1) !important;',
            '}',

            // Стилі вибору кольору
            '.color_square {',
            '  width: 35px !important; height: 35px !important;',
            '  border-radius: 4px !important; cursor: pointer !important;',
            '  display: flex !important; flex-direction: column !important;',
            '  justify-content: center !important; align-items: center !important;',
            '  color: #ffffff !important; font-size: 10px !important;',
            '}',
            '.color_square.default {',
            '  background-color: #fff !important;',
            '  position: relative !important;',
            '}',
            '.color_square.default::before, .color_square.default::after {',
            '  content: ""; position: absolute; top: 50%; left: 10%; right: 10%;',
            '  height: 3px; background-color: #353535 !important;',
            '}',
            '.color_square.default::before  { transform: rotate(-45deg); }',
            '.color_square.default::after   { transform: rotate( 45deg); }',

            '.color-family-name {',
            '  width: 80px !important; height: 35px !important;',
            '  border: 2px solid; border-radius: 4px !important;',
            '  display: flex !important; align-items: center !important; justify-content: center !important;',
            '  font-size: 10px !important; font-weight: bold !important; color: #fff !important;',
            '  text-transform: capitalize !important;',
            '}',
            '.color-family-outline {',
            '  display: flex !important; flex-wrap: nowrap !important; overflow-x: auto !important;',
            '  gap: 10px !important; padding: 5px !important; border-radius: 8px !important;',
            '}',
            '.hex-input {',
            '  width: 266px !important; height: 35px !important; border-radius: 8px !important;',
            '  border: 2px solid #ddd !important; background-color: #353535 !important;',
            '  color: #fff !important; font-size: 12px !important; font-weight: bold !important;',
            '  display: flex !important; flex-direction: column !important;',
            '  align-items: center !important; justify-content: center !important;',
            '  cursor: pointer !important;',
            '}',

            '.color-picker-container {',
            '  display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 10px !important;',
            '}',
            '@media (max-width: 768px) {',
            '  .color-picker-container { grid-template-columns: 1fr !important; }',
            '}',

            dimmingCSS,

            // Додаткові стилі (збережено майже всі з оригіналу)
            '.torrent-item__viewed          { color: var(--main-color) !important; }',
            '.online-prestige__viewed       { background: rgb(255,255,255) !important; color: rgba(var(--main-color-rgb),1) !important; }',
            '.extensions__item-proto.protocol-https { color: var(--main-color) !important; }',
            '.extensions__item-code.success { color: var(--main-color) !important; }',
            '.navigation-tabs__badge        { background: var(--main-color) !important; }',
            '.torrent-item__size            { background-color: var(--main-color) !important; color: #fff !important; }',
            '.torrent-serial__progress      { background: var(--main-color) !important; }',
            '.notice__descr b               { color: var(--main-color) !important; }',

            'circle[cx="24.1445"][cy="24.2546"][r="23.8115"] { fill-opacity: 0 !important; }',

            '.star-rating path[d^="M8.39409 0.192139"] { fill: var(--main-color) !important; }'

        ].join('\n');
    }

    // ────────────────────────────────────────────────────────────────
    // Модальне вікно вибору кольору (збережено повністю)
    // ────────────────────────────────────────────────────────────────

    function createColorHtml(color, name) {
        var cls = color === 'default' ? 'color_square selector default' : 'color_square selector';
        var stl = color === 'default' ? '' : 'background-color: ' + color + ';';
        var hex = color === 'default' ? '' : color.replace('#','');
        var cnt = color === 'default' ? '' : '<div class="hex">' + hex + '</div>';
        return '<div class="' + cls + '" tabindex="0" style="' + stl + '" title="' + name + '">' + cnt + '</div>';
    }

    function createFamilyNameHtml(name, firstColor) {
        return '<div class="color-family-name" style="border-color:' + (firstColor || '#353535') + ';">' +
               Lampa.Lang.translate(name.toLowerCase()) + '</div>';
    }

    function openColorPicker() {
        var families = [
            'Red','Orange','Amber','Yellow','Lime','Green','Emerald','Teal','Cyan',
            'Sky','Blue','Indigo','Violet','Purple','Fuchsia','Pink','Rose',
            'Slate','Gray','Zinc','Neutral','Stone'
        ];

        var colorKeys = Object.keys(ColorPlugin.colors.main);
        var groups = [];

        families.forEach(function(family){
            var famColors = colorKeys.filter(function(k){
                return ColorPlugin.colors.main[k].indexOf(family + ' ') === 0;
            });
            if (famColors.length > 0) {
                groups.push({ name: family, colors: famColors });
            }
        });

        var htmlBlocks = groups.map(function(g){
            var first = g.colors[0];
            var title = createFamilyNameHtml(g.name, first);
            var squares = g.colors.map(function(c){
                return createColorHtml(c, ColorPlugin.colors.main[c]);
            }).join('');
            return '<div class="color-family-outline">' + title + squares + '</div>';
        });

        var mid = Math.ceil(htmlBlocks.length / 2);
        var left  = htmlBlocks.slice(0, mid).join('');
        var right = htmlBlocks.slice(mid).join('');

        var defBtn = createColorHtml('default', Lampa.Lang.translate('default_color'));

        var customHex = Lampa.Storage.get('color_plugin_custom_hex', '#353535');
        var hexShow  = customHex.replace('#','');
        var hexBlock = '<div class="color_square selector hex-input" tabindex="0" style="background-color:'+customHex+';">' +
                       '<div class="label">' + Lampa.Lang.translate('custom_hex_input') + '</div>' +
                       '<div class="value">' + hexShow + '</div></div>';

        var top = '<div style="display:flex; gap:19px; justify-content:center; margin-bottom:10px;">' +
                  defBtn + hexBlock + '</div>';

        var container = '<div class="color-picker-container"><div>' + left + '</div><div>' + right + '</div></div>';

        Lampa.Modal.open({
            title: Lampa.Lang.translate('main_color'),
            size: 'medium',
            align: 'center',
            html: $('<div>' + top + container + '</div>'),
            className: 'color-picker-modal',

            onBack: function(){
                saveSettings();
                Lampa.Modal.close();
                Lampa.Controller.toggle('settings_component');
                Lampa.Controller.enable('menu');
            },

            onSelect: function(selected){
                if (!selected.length || !(selected[0] instanceof HTMLElement)) return;

                var el = selected[0];

                if (el.classList.contains('hex-input')) {
                    Lampa.Noty.show(Lampa.Lang.translate('hex_input_hint'));
                    Lampa.Modal.close();

                    Lampa.Input.edit({
                        name: 'color_plugin_custom_hex',
                        value: Lampa.Storage.get('color_plugin_custom_hex', ''),
                        placeholder: Lampa.Lang.translate('settings_cub_not_specified')
                    }, function(val){
                        if (!val) {
                            Lampa.Noty.show('HEX-код не введено.');
                            return;
                        }
                        val = val.trim();
                        if (!isValidHex(val)) {
                            Lampa.Noty.show('Невірний формат HEX-коду. Використовуйте #RRGGBB');
                            return;
                        }

                        ColorPlugin.settings.main_color = val;
                        Lampa.Storage.set('color_plugin_custom_hex', val);
                        Lampa.Storage.set('color_plugin_main_color', val);
                        applyStyles();
                        saveSettings();
                        Lampa.Controller.toggle('settings_component');
                        Lampa.Controller.enable('menu');
                    });
                    return;
                }

                var newColor;
                if (el.classList.contains('default')) {
                    newColor = '#353535';
                } else {
                    newColor = el.style.backgroundColor;
                    if (newColor && newColor.includes('rgb')) newColor = rgbToHex(newColor);
                }

                ColorPlugin.settings.main_color = newColor;
                Lampa.Storage.set('color_plugin_main_color', newColor);
                applyStyles();
                saveSettings();
                Lampa.Modal.close();
                Lampa.Controller.toggle('settings_component');
                Lampa.Controller.enable('menu');
            }
        });
    }

    // ────────────────────────────────────────────────────────────────
    // Реєстрація в налаштуваннях
    // ────────────────────────────────────────────────────────────────

    function initPlugin() {
        setTimeout(function(){

            // Завантаження з запасним варіантом
            ColorPlugin.settings.enabled           = Lampa.Storage.get('color_plugin_enabled',           'false') === 'true';
            ColorPlugin.settings.main_color        = Lampa.Storage.get('color_plugin_main_color',        '#353535') || localStorage.getItem('color_plugin_main_color') || '#353535';
            ColorPlugin.settings.highlight_enabled = Lampa.Storage.get('color_plugin_highlight_enabled', 'true')  === 'true';
            ColorPlugin.settings.dimming_enabled   = Lampa.Storage.get('color_plugin_dimming_enabled',   'true')  === 'true';

            if (!Lampa.SettingsApi) return;

            Lampa.SettingsApi.addComponent({
                component: 'color_plugin',
                name: Lampa.Lang.translate('color_plugin'),
                icon: '<svg width="24" height="24" viewBox="0 0 16 16" fill="#ffffff"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.003a7 7 0 0 0-7 7v.43c.09 1.51 1.91 1.79 3 .7a1.87 1.87 0 0 1 2.64 2.64c-1.1 1.16-.79 3.07.8 3.2h.6a7 7 0 1 0 0-14l-.04.03zm0 13h-.52a.58.58 0 0 1-.36-.14.56.56 0 0 1-.15-.3 1.24 1.24 0 0 1 .35-1.08 2.87 2.87 0 0 0 0-4 2.87 2.87 0 0 0-4.06 0 1 1 0 0 1-.9.34.41.41 0 0 1-.22-.12.42.42 0 0 1-.1-.29v-.37a6 6 0 1 1 6 6l-.04-.04zM9 3.997a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 7.007a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-7-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM13 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>'
            });

            // Увімкнення / вимкнення
            Lampa.SettingsApi.addParam({
    component: 'color_plugin',
    param: { name: 'color_plugin_enabled', type: 'trigger', default: 'false' },
    field: {
        name: Lampa.Lang.translate('color_plugin_enabled'),
        description: Lampa.Lang.translate('color_plugin_enabled_description')
    },
    onChange: function (val) {
    ColorPlugin.settings.enabled = val === 'true';
    saveSettings();
    applyStyles();

    // 🔴 ВАЖЛИВО: примусовий ререндер Settings
    Lampa.Controller.toggle('settings_component');
    Lampa.Controller.toggle('settings_component');
},
    onRender: function (el) {
        el.css('display', 'block');
    }
});



            // Вибір кольору
            Lampa.SettingsApi.addParam({
                component: 'color_plugin',
                param: { name: 'color_plugin_main_color', type: 'button' },
                field: {
                    name: Lampa.Lang.translate('main_color'),
                    description: Lampa.Lang.translate('main_color_description')
                },
                onChange: openColorPicker,
                onRender: function(el){
                    el.css('display', ColorPlugin.settings.enabled ? 'block' : 'none');
                }
            });

            // Рамка при фокусі
            Lampa.SettingsApi.addParam({
                component: 'color_plugin',
                param: { name: 'color_plugin_highlight_enabled', type: 'trigger', default: 'true' },
                field: {
                    name: Lampa.Lang.translate('enable_highlight'),
                    description: Lampa.Lang.translate('enable_highlight_description')
                },
                onChange: function(val){
                    ColorPlugin.settings.highlight_enabled = val === 'true';
                    saveSettings();
                    applyStyles();
                },
                onRender: function(el){
                    el.css('display', ColorPlugin.settings.enabled ? 'block' : 'none');
                }
            });

            // Затемнення
            Lampa.SettingsApi.addParam({
                component: 'color_plugin',
                param: { name: 'color_plugin_dimming_enabled', type: 'trigger', default: 'true' },
                field: {
                    name: Lampa.Lang.translate('enable_dimming'),
                    description: Lampa.Lang.translate('enable_dimming_description')
                },
                onChange: function(val){
                    ColorPlugin.settings.dimming_enabled = val === 'true';
                    saveSettings();
                    applyStyles();
                },
                onRender: function(el){
                    el.css('display', ColorPlugin.settings.enabled ? 'block' : 'none');
                }
            });

            applyStyles();
        }, 300);
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

    Lampa.Storage.listener.follow('change', function(e){
        var n = e.name;
        if (n === 'color_plugin_enabled' ||
            n === 'color_plugin_main_color' ||
            n === 'color_plugin_highlight_enabled' ||
            n === 'color_plugin_dimming_enabled') {
            applyStyles();
        }
    });

    Lampa.Listener.follow('settings_component', function(e){
        if (e.type === 'open') {
            applyStyles();
        }
    });

})();
