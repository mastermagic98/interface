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
            ru: 'Показать белую рамку',
            en: 'Show white border',
            uk: 'Показати білу рамку'
        },
        enable_highlight_description: {
            ru: 'Включает белую рамку вокруг выделенных элементов',
            en: 'Enables white border around focused elements',
            uk: 'Вмикає білу рамку навколо виділених елементів'
        },
        highlight_border_radius: {
            ru: 'Скругление рамки',
            en: 'Border radius',
            uk: 'Заокруглення рамки'
        },
        highlight_border_radius_description: {
            ru: 'Радиус скругления белой рамки выделения',
            en: 'Radius of the white highlight border',
            uk: 'Радіус заокруглення білої рамки виділення'
        },
        enable_dimming: {
            ru: 'Применить цвет затемнения',
            en: 'Apply dimming color',
            uk: 'Застосувати колір затемнення'
        },
        enable_dimming_description: {
            ru: 'Затемняет элементы оттенком выбранного цвета',
            en: 'Dims elements with shade of selected color',
            uk: 'Затемнює елементи відтінком вибраного кольору'
        },
        default_color: {
            ru: 'По умолчанию',
            en: 'Default',
            uk: 'За замовчуванням'
        },
        custom_hex_input: {
            ru: 'Свой HEX-код',
            en: 'Custom HEX code',
            uk: 'Власний HEX-код'
        },
        hex_input_hint: {
            ru: 'Формат: #RRGGBB  (например #1E90FF)',
            en: 'Format: #RRGGBB  (example #1E90FF)',
            uk: 'Формат: #RRGGBB  (наприклад #1E90FF)'
        },

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
    // Основні дані плагіна
    // ────────────────────────────────────────────────────────────────
    const plugin = {
        name: 'color_plugin',
        storage_keys: {
            enabled:  'color_plugin_enabled',
            color:    'color_plugin_main_color',
            border:   'color_plugin_highlight_enabled',
            radius:   'color_plugin_highlight_radius',
            dimming:  'color_plugin_dimming_enabled',
            custom:   'color_plugin_custom_hex'
        },

        default: {
            enabled: false,
            color: '#353535',
            border: true,
            radius: '8',
            dimming: true
        },

        settings: {},

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
    // Завантаження налаштувань
    // ────────────────────────────────────────────────────────────────
    function loadSettings() {
        plugin.settings = {
            enabled:  Lampa.Storage.get(plugin.storage_keys.enabled,  plugin.default.enabled.toString()) === 'true',
            color:    Lampa.Storage.get(plugin.storage_keys.color,    plugin.default.color),
            border:   Lampa.Storage.get(plugin.storage_keys.border,   plugin.default.border.toString()) === 'true',
            radius:   Lampa.Storage.get(plugin.storage_keys.radius,   plugin.default.radius),
            dimming:  Lampa.Storage.get(plugin.storage_keys.dimming,  plugin.default.dimming.toString()) === 'true'
        };

        // захист від некоректного кольору
        if (!/^#[0-9A-Fa-f]{6}$/.test(plugin.settings.color)) {
            plugin.settings.color = plugin.default.color;
        }
    }

    // ────────────────────────────────────────────────────────────────
    // Збереження налаштувань
    // ────────────────────────────────────────────────────────────────
    function saveSettings() {
        Lampa.Storage.set(plugin.storage_keys.enabled,  plugin.settings.enabled.toString());
        Lampa.Storage.set(plugin.storage_keys.color,    plugin.settings.color);
        Lampa.Storage.set(plugin.storage_keys.border,   plugin.settings.border.toString());
        Lampa.Storage.set(plugin.storage_keys.radius,   plugin.settings.radius);
        Lampa.Storage.set(plugin.storage_keys.dimming,  plugin.settings.dimming.toString());
    }

    // ────────────────────────────────────────────────────────────────
    // HEX → RGB рядок
    // ────────────────────────────────────────────────────────────────
    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substr(0,2), 16);
        const g = parseInt(hex.substr(2,2), 16);
        const b = parseInt(hex.substr(4,2), 16);
        return `${r}, ${g}, ${b}`;
    }

    // ────────────────────────────────────────────────────────────────
    // Застосування всіх стилів
    // ────────────────────────────────────────────────────────────────
    function applyStyles() {
        // видаляємо попередній стиль, якщо був
        const oldStyle = document.getElementById('plugin-color-styles');
        if (oldStyle) oldStyle.remove();

        if (!plugin.settings.enabled) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'plugin-color-styles';
        document.head.appendChild(style);

        const rgb    = hexToRgb(plugin.settings.color);
        const border = plugin.settings.border;
        const radius = plugin.settings.radius + 'px';

        const focusBorderColor = (plugin.settings.color === '#353535') ? '#ffffff' : 'var(--main-color)';

        const highlightShadow = border
            ? 'inset 0 0 0 0.15em #ffffff !important'
            : 'none !important';

        const dimming = plugin.settings.dimming ? `
            .full-start__rate,
            .full-start__rate > div:first-child {
                background: rgba(var(--main-color-rgb), 0.15) !important;
            }
            .reaction,
            .full-start__button,
            .items-line__more,
            .simple-button--filter > div {
                background-color: rgba(var(--main-color-rgb), 0.3) !important;
            }
            .card__vote,
            .card__icons-inner {
                background: rgba(var(--main-color-rgb), 0.5) !important;
            }
        ` : '';

        style.textContent = `
            :root {
                --main-color: ${plugin.settings.color} !important;
                --main-color-rgb: ${rgb} !important;
                --accent-color: ${plugin.settings.color} !important;
            }

            .menu__item.focus,
            .menu__item.traverse,
            .menu__item:hover,
            .console__tab.focus,
            .settings-param.focus,
            .settings-folder.focus,
            .selectbox-item.focus,
            .full-start__button.focus,
            .full-person.focus,
            .full-descr__tag.focus,
            .simple-button.focus,
            .player-panel .button.focus,
            .search-source.active,
            .navigation-tabs__button.focus,
            .items-line__more.focus {
                background: var(--main-color) !important;
                color: #ffffff !important;
                box-shadow: ${highlightShadow};
                border-radius: ${border ? radius : '0'} !important;
            }

            .timetable__item.focus::before {
                box-shadow: ${highlightShadow};
                border-radius: ${border ? radius : '0'} !important;
            }

            .color_square.focus {
                border: 0.3em solid ${focusBorderColor} !important;
                border-radius: 8px !important;
                transform: scale(1.08) !important;
            }

            .hex-input.focus {
                border: 0.2em solid ${focusBorderColor} !important;
                border-radius: 12px !important;
                transform: scale(1.05) !important;
            }

            ${dimming}

            .torrent-item__viewed          { color: var(--main-color) !important; }
            .torrent-item__size            { background: var(--main-color) !important; color: #fff !important; }
            .navigation-tabs__badge        { background: var(--main-color) !important; }
            .star-rating path[d^="M8.39409"] { fill: var(--main-color) !important; }
        `;
    }

    // ────────────────────────────────────────────────────────────────
    // Оновлення видимості додаткових параметрів
    // ────────────────────────────────────────────────────────────────
    function updateParamsVisibility() {
        const isEnabled   = plugin.settings.enabled;
        const showRadius  = isEnabled && plugin.settings.border;

        const params = [
            { name: plugin.storage_keys.color,   show: isEnabled },
            { name: plugin.storage_keys.border,  show: isEnabled },
            { name: plugin.storage_keys.radius,  show: showRadius },
            { name: plugin.storage_keys.dimming, show: isEnabled }
        ];

        params.forEach(p => {
            document.querySelectorAll(`.settings-param[data-name="${p.name}"]`)
                .forEach(el => el.style.display = p.show ? '' : 'none');
        });
    }

    // ────────────────────────────────────────────────────────────────
    // Модальне вікно вибору кольору
    // ────────────────────────────────────────────────────────────────
    function openColorModal() {
        const families = [
            'Red','Orange','Amber','Yellow','Lime','Green','Emerald','Teal','Cyan',
            'Sky','Blue','Indigo','Violet','Purple','Fuchsia','Pink','Rose',
            'Slate','Gray','Zinc','Neutral','Stone'
        ];

        let html = '';

        families.forEach(family => {
            const items = Object.keys(plugin.colors.main)
                .filter(key => key !== 'default' && plugin.colors.main[key].startsWith(family + ' '));

            if (items.length === 0) return;

            const first = items[0];
            const name = Lampa.Lang.translate(family.toLowerCase());

            html += `<div class="color-family-outline">`;
            html += `<div class="color-family-name" style="border-color:${first}">${name}</div>`;

            items.forEach(color => {
                const hex = color.replace('#','');
                html += `<div class="color_square selector" tabindex="0" style="background:${color}" data-color="${color}">
                            <div class="hex">${hex}</div>
                         </div>`;
            });

            html += `</div>`;
        });

        // Дефолт + кастомний HEX
        const custom = Lampa.Storage.get(plugin.storage_keys.custom, plugin.settings.color);
        const defBtn = `<div class="color_square selector default" tabindex="0" data-color="default"></div>`;
        const hexBtn = `<div class="color_square selector hex-input" tabindex="0" style="background:${custom}">
                            <div class="label">${Lampa.Lang.translate('custom_hex_input')}</div>
                            <div class="value">${custom.replace('#','')}</div>
                        </div>`;

        const top = `<div style="display:flex;gap:20px;justify-content:center;margin-bottom:16px;">
                        ${defBtn}${hexBtn}
                     </div>`;

        const columns = `<div class="color-picker-container">
                            <div>${html}</div>
                         </div>`;

        Lampa.Modal.open({
            title: Lampa.Lang.translate('main_color'),
            html: $(top + columns),
            size: 'large',
            onSelect: function (items) {
                if (!items.length) return;

                const el = items[0];
                let color;

                if (el.classList.contains('default')) {
                    color = plugin.default.color;
                }
                else if (el.classList.contains('hex-input')) {
                    Lampa.Modal.close();
                    Lampa.Input.edit({
                        name: plugin.storage_keys.custom,
                        value: custom,
                        placeholder: '#RRGGBB'
                    }, value => {
                        if (!value || !/^#[0-9A-Fa-f]{6}$/i.test(value)) {
                            Lampa.Noty.show('Неправильний HEX-код');
                            return;
                        }
                        plugin.settings.color = value;
                        Lampa.Storage.set(plugin.storage_keys.custom, value);
                        Lampa.Storage.set(plugin.storage_keys.color, value);
                        applyStyles();
                        saveSettings();
                    });
                    return;
                }
                else {
                    color = el.dataset.color;
                }

                plugin.settings.color = color;
                Lampa.Storage.set(plugin.storage_keys.color, color);
                applyStyles();
                saveSettings();
                Lampa.Modal.close();
            },
            onBack: function () {
                Lampa.Modal.close();
            }
        });
    }

    // ────────────────────────────────────────────────────────────────
    // Реєстрація в меню налаштувань
    // ────────────────────────────────────────────────────────────────
    function registerComponent() {
        if (!Lampa.SettingsApi) return;

        Lampa.SettingsApi.addComponent({
            component: plugin.name,
            name: Lampa.Lang.translate('color_plugin'),
            icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>'
        });

        // Увімкнення / вимкнення
        Lampa.SettingsApi.addParam({
            component: plugin.name,
            param: { name: plugin.storage_keys.enabled, type: 'trigger' },
            field: {
                name: Lampa.Lang.translate('color_plugin_enabled'),
                description: Lampa.Lang.translate('color_plugin_enabled_description')
            },
            onChange: val => {
                plugin.settings.enabled = val === 'true';
                saveSettings();
                applyStyles();
                updateParamsVisibility();
            }
        });

        // Колір
        Lampa.SettingsApi.addParam({
            component: plugin.name,
            param: { name: plugin.storage_keys.color, type: 'button' },
            field: {
                name: Lampa.Lang.translate('main_color'),
                description: Lampa.Lang.translate('main_color_description')
            },
            onChange: openColorModal,
            onRender: el => el.css('display', plugin.settings.enabled ? '' : 'none')
        });

        // Біла рамка
        Lampa.SettingsApi.addParam({
            component: plugin.name,
            param: { name: plugin.storage_keys.border, type: 'trigger' },
            field: {
                name: Lampa.Lang.translate('enable_highlight'),
                description: Lampa.Lang.translate('enable_highlight_description')
            },
            onChange: val => {
                plugin.settings.border = val === 'true';
                saveSettings();
                applyStyles();
                updateParamsVisibility();
            },
            onRender: el => el.css('display', plugin.settings.enabled ? '' : 'none')
        });

        // Радіус рамки
        Lampa.SettingsApi.addParam({
            component: plugin.name,
            param: {
                name: plugin.storage_keys.radius,
                type: 'select',
                values: [
                    {value:'0',  title:'0 px (квадрат)'},
                    {value:'4',  title:'4 px'},
                    {value:'8',  title:'8 px'},
                    {value:'12', title:'12 px'},
                    {value:'16', title:'16 px'},
                    {value:'24', title:'24 px (максимум)'}
                ]
            },
            field: {
                name: Lampa.Lang.translate('highlight_border_radius'),
                description: Lampa.Lang.translate('highlight_border_radius_description')
            },
            onChange: val => {
                plugin.settings.radius = val;
                saveSettings();
                applyStyles();
            },
            onRender: el => {
                el.css('display', plugin.settings.enabled && plugin.settings.border ? '' : 'none');
            }
        });

        // Затемнення
        Lampa.SettingsApi.addParam({
            component: plugin.name,
            param: { name: plugin.storage_keys.dimming, type: 'trigger' },
            field: {
                name: Lampa.Lang.translate('enable_dimming'),
                description: Lampa.Lang.translate('enable_dimming_description')
            },
            onChange: val => {
                plugin.settings.dimming = val === 'true';
                saveSettings();
                applyStyles();
            },
            onRender: el => el.css('display', plugin.settings.enabled ? '' : 'none')
        });
    }

    // ────────────────────────────────────────────────────────────────
    // Ініціалізація
    // ────────────────────────────────────────────────────────────────
    function init() {
        loadSettings();
        registerComponent();
        applyStyles();
        updateParamsVisibility();

        // слідкуємо за змінами в сховищі
        Lampa.Storage.listener.follow('change', e => {
            if (Object.values(plugin.storage_keys).includes(e.name)) {
                loadSettings();
                applyStyles();
                updateParamsVisibility();
            }
        });

        // оновлюємо видимість при відкритті налаштувань
        Lampa.Listener.follow('settings_component', e => {
            if (e.type === 'open') {
                updateParamsVisibility();
            }
        });
    }

    if (window.appready) {
        init();
    } else {
        Lampa.Listener.follow('app', e => {
            if (e.type === 'ready') init();
        });
    }

})();
