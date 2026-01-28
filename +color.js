(function () {
    'use strict';

    // Переклади
    Lampa.Lang.add({
        color_plugin: { ru: 'Настройка цветов', en: 'Color settings', uk: 'Налаштування кольорів' },
        color_plugin_enabled: { ru: 'Включить плагин', en: 'Enable plugin', uk: 'Увімкнути плагін' },
        color_plugin_enabled_description: { ru: 'Изменяет вид некоторых элементов интерфейса Lampa', en: 'Changes the appearance of some Lampa interface elements', uk: 'Змінює вигляд деяких елементів інтерфейсу Lampa' },
        main_color: { ru: 'Цвет выделения', en: 'Highlight color', uk: 'Колір виділення' },
        main_color_description: { ru: 'Выберите или укажите цвет выделения', en: 'Select or specify a highlight color', uk: 'Виберіть чи вкажіть колір виділення' },
        enable_highlight: { ru: 'Показать рамку', en: 'Show border', uk: 'Показати рамку' },
        enable_highlight_description: { ru: 'Включает белую рамку вокруг некоторых выделенных элементов интерфейса', en: 'Enables a white border around some highlighted interface elements', uk: 'Вмикає білу рамку навколо деяких виділених елементів інтерфейсу' },
        enable_dimming: { ru: 'Колір затемнения', en: 'Dimming color', uk: 'Колір затемнення' },
        enable_dimming_description: { ru: 'Изменяет цвет затемненных элементов интерфейса на темный оттенок выбранного цвета выделения', en: 'Changes the color of dimmed interface elements to a dark shade of the selected highlight color', uk: 'Змінює колір затемнених елементів інтерфейсу на темний відтінок вибраного кольору виділення' },
        default_color: { ru: 'По умолчанию', en: 'Default', uk: 'За замовчуванням' },
        custom_hex_input: { ru: 'Введи HEX-код цвета', en: 'Enter HEX color code', uk: 'Введи HEX-код кольору' },
        hex_input_hint: { ru: 'Используйте формат #FFFFFF, например #123524', en: 'Use the format #FFFFFF, for example #123524', uk: 'Використовуйте формат #FFFFFF, наприклад #123524' },
        border_radius: { ru: 'Заокругление рамки', en: 'Border radius', uk: 'Заокруглення рамки' },
        border_radius_description: { ru: 'Выберите степень заокругления рамки', en: 'Select the degree of border rounding', uk: 'Виберіть ступінь заокруглення рамки' },
        border_radius_rect: { ru: 'Прямокутний', en: 'Rectangular', uk: 'Прямокутний' },
        border_radius_card: { ru: 'Картковий', en: 'Card', uk: 'Картковий' },
        border_radius_capsule: { ru: 'Капсульний', en: 'Capsule', uk: 'Капсульний' },
        change_head_border: { ru: 'Змінювати форму рамки шапки', en: 'Change header border shape', uk: 'Змінювати форму рамки шапки' },
        change_head_border_description: { ru: 'Вмикає модифікацію форми рамки для іконок у заголовку', en: 'Enables modification of the border shape for icons in the header', uk: 'Вмикає модифікацію форми рамки для іконок у заголовку' },
        change_player_border: { ru: 'Змінювати форму рамки іконок плеєра', en: 'Change player buttons border shape', uk: 'Змінювати форму рамки іконок плеєра' },
        change_player_border_description: { ru: 'Вмикає модифікацію форми рамок кнопок в плеєрі', en: 'Enables modification of the border shape for buttons in the player', uk: 'Вмикає модифікацію форми рамок кнопок в плеєрі' },
        red: { ru: 'Червоний', en: 'Red', uk: 'Червоний' },
        orange: { ru: 'Помаранчевий', en: 'Orange', uk: 'Помаранчевий' },
        amber: { ru: 'Бурштиновий', en: 'Amber', uk: 'Бурштиновий' },
        yellow: { ru: 'Жовтий', en: 'Yellow', uk: 'Жовтий' },
        lime: { ru: 'Лаймовий', en: 'Lime', uk: 'Лаймовий' },
        green: { ru: 'Зелений', en: 'Green', uk: 'Зелений' },
        emerald: { ru: 'Смарагдовий', en: 'Emerald', uk: 'Смарагдовий' },
        teal: { ru: 'Бірюзовий', en: 'Teal', uk: 'Бірюзовий' },
        cyan: { ru: 'Блакитний', en: 'Cyan', uk: 'Блакитний' },
        sky: { ru: 'Небесний', en: 'Sky', uk: 'Небесний' },
        blue: { ru: 'Синій', en: 'Blue', uk: 'Синій' },
        indigo: { ru: 'Індиго', en: 'Indigo', uk: 'Індиго' },
        violet: { ru: 'Фіолетовий', en: 'Violet', uk: 'Фіолетовий' },
        purple: { ru: 'Пурпуровий', en: 'Purple', uk: 'Пурпуровий' },
        fuchsia: { ru: 'Фуксія', en: 'Fuchsia', uk: 'Фуксія' },
        pink: { ru: 'Рожевий', en: 'Pink', uk: 'Рожевий' },
        rose: { ru: 'Трояндовий', en: 'Rose', uk: 'Трояндовий' },
        slate: { ru: 'Сланцевий', en: 'Slate', uk: 'Сланцевий' },
        gray: { ru: 'Сірий', en: 'Gray', uk: 'Сірий' },
        zinc: { ru: 'Цинковий', en: 'Zinc', uk: 'Цинковий' },
        neutral: { ru: 'Нейтральний', en: 'Neutral', uk: 'Нейтральний' },
        stone: { ru: 'Кам’яний', en: 'Stone', uk: 'Кам’яний' }
    });

    // Налаштування та палітра
    const ColorPlugin = {
        settings: {
            main_color: '#353535',
            enabled: false,
            highlight_enabled: true,
            dimming_enabled: true,
            border_radius: 'card',
            change_head_border: false,
            change_player_border: false
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

    let isSaving = false;

    const hexToRgb = (hex) => {
        const clean = hex.replace('#', '');
        const r = parseInt(clean.substring(0, 2), 16);
        const g = parseInt(clean.substring(2, 4), 16);
        const b = parseInt(clean.substring(4, 6), 16);
        return `${r}, ${g}, ${b}`;
    };

    const rgbToHex = (rgb) => {
        const matches = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!matches) return rgb;
        const hex = n => ('0' + parseInt(n).toString(16)).slice(-2).toUpperCase();
        return '#' + hex(matches[1]) + hex(matches[2]) + hex(matches[3]);
    };

    const isValidHex = (color) => /^#[0-9A-Fa-f]{6}$/.test(color);

    const loadSettings = () => {
        ColorPlugin.settings.main_color = Lampa.Storage.get('color_plugin_main_color', '#353535') || localStorage.getItem('color_plugin_main_color') || '#353535';
        ColorPlugin.settings.enabled = (Lampa.Storage.get('color_plugin_enabled', 'false') === 'true' || localStorage.getItem('color_plugin_enabled') === 'true');
        ColorPlugin.settings.highlight_enabled = (Lampa.Storage.get('color_plugin_highlight_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_highlight_enabled') === 'true');
        ColorPlugin.settings.dimming_enabled = (Lampa.Storage.get('color_plugin_dimming_enabled', 'true') === 'true' || localStorage.getItem('color_plugin_dimming_enabled') === 'true');
        ColorPlugin.settings.border_radius = Lampa.Storage.get('color_plugin_border_radius', 'card') || localStorage.getItem('color_plugin_border_radius') || 'card';
        ColorPlugin.settings.change_head_border = (Lampa.Storage.get('color_plugin_change_head_border', 'false') === 'true' || localStorage.getItem('color_plugin_change_head_border') === 'true');
        ColorPlugin.settings.change_player_border = (Lampa.Storage.get('color_plugin_change_player_border', 'false') === 'true' || localStorage.getItem('color_plugin_change_player_border') === 'true');
    };

    const saveSettings = () => {
        if (isSaving) return;
        isSaving = true;
        const keys = ['main_color', 'enabled', 'highlight_enabled', 'dimming_enabled', 'border_radius', 'change_head_border', 'change_player_border'];
        keys.forEach(key => {
            const storageKey = 'color_plugin_' + key;
            const value = ColorPlugin.settings[key];
            Lampa.Storage.set(storageKey, typeof value === 'boolean' ? value.toString() : value);
            localStorage.setItem(storageKey, typeof value === 'boolean' ? value.toString() : value);
        });
        isSaving = false;
    };

    const updateDateElementStyles = () => {
        document.querySelectorAll('div[style*="position: absolute; left: 1em; top: 1em;"]').forEach(el => {
            if (el.querySelector('div[style*="font-size: 2.6em"]')) {
                el.style.background = 'none';
                el.style.padding = '0.7em';
                el.style.borderRadius = '0.7em';
            }
        });
    };

    const forceBlackFilterBackground = () => {
        document.querySelectorAll('.simple-button--filter > div').forEach(el => {
            const bg = window.getComputedStyle(el).backgroundColor;
            if (bg === 'rgba(255, 255, 255, 0.3)' || bg === 'rgb(255, 255, 255)') {
                el.style.setProperty('background-color', 'rgba(0, 0, 0, 0.3)', 'important');
            }
        });
    };

    const updateSvgIcons = () => {
        document.querySelectorAll('path[d^="M2 1.5H19C"], path[d^="M3.81972 14.5957V"], path[d^="M8.39409 0.192139L"]').forEach(path => {
            if (path.getAttribute('d').includes('M8.39409 0.192139')) {
                if (path.getAttribute('fill') !== 'none') path.setAttribute('fill', 'var(--main-color)');
            } else {
                path.setAttribute('fill', 'none');
            }
        });
    };

    const updateCanvasFillStyle = (context) => {
        if (context && context.fillStyle) {
            context.fillStyle = 'rgba(' + hexToRgb(ColorPlugin.settings.main_color) + ', 1)';
        }
    };

    const applyStyles = () => {
        const oldStyle = document.getElementById('color-plugin-styles');
        if (oldStyle) oldStyle.remove();

        if (!ColorPlugin.settings.enabled) return;

        if (!isValidHex(ColorPlugin.settings.main_color)) {
            ColorPlugin.settings.main_color = '#353535';
        }

        const style = document.createElement('style');
        style.id = 'color-plugin-styles';
        document.head.appendChild(style);

        const rgb = hexToRgb(ColorPlugin.settings.main_color);
        const focusBorderColor = ColorPlugin.settings.main_color === '#353535' ? '#ffffff' : 'var(--main-color)';

        const highlight = ColorPlugin.settings.highlight_enabled
            ? '-webkit-box-shadow: inset 0 0 0 0.15em #fff !important; box-shadow: inset 0 0 0 0.15em #fff !important;'
            : '';

        const radiusMap = { rect: '0', card: '0.5em', capsule: '1em' };
        const radiusValue = radiusMap[ColorPlugin.settings.border_radius] || '0.5em';
        const radius = `border-radius: ${radiusValue} !important;`;

        // Шапка: фокус
        const headFocus = '.head__action.focus, .head__action:hover { background: var(--main-color) !important; color: #ffffff !important; fill: #ffffff !important; }';
        const headFocusRadius = ColorPlugin.settings.change_head_border ? `.head__action.focus { ${radius} }` : '';

        // Шапка: нефокус
        const headNonFocusDimming = ColorPlugin.settings.dimming_enabled ? '.head__action { background-color: rgba(var(--main-color-rgb), 0.3) !important; }' : '';
        const headNonFocusRadius = ColorPlugin.settings.change_head_border ? `.head__action { ${radius} }` : '';

        // Плеєр
        const playerFocus = '.player-panel .button.focus { background-color: var(--main-color) !important; color: #fff !important; ' + highlight + ' }';
        const playerRadius = ColorPlugin.settings.change_player_border ? `.player-panel .button.focus { ${radius} }` : '';

        const dimming = ColorPlugin.settings.dimming_enabled ? [
            '.full-start__rate, .full-start__rate > div:first-child { background: rgba(var(--main-color-rgb), 0.15) !important; }',
            '.reaction, .full-start__button, .items-line__more { background-color: rgba(var(--main-color-rgb), 0.3) !important; }',
            '.card__vote, .card__icons-inner { background: rgba(var(--main-color-rgb), 0.5) !important; }',
            '.simple-button--filter > div { background-color: rgba(var(--main-color-rgb), 0.3) !important; }'
        ].join('') : '';

        style.innerHTML = [
            `:root { --main-color: ${ColorPlugin.settings.main_color} !important; --main-color-rgb: ${rgb} !important; --accent-color: ${ColorPlugin.settings.main_color} !important; }`,
            '.modal__title { font-size: 1.7em !important; }',
            '.modal__head { margin-bottom: 0 !important; }',
            '.modal .scroll__content { padding: 1.0em 0 !important; }',
            '.menu__ico, .menu__ico:hover, .menu__ico.traverse, .head__action, .settings-param__ico, ' +
            '.menu__item, .menu__item.focus, .menu__item.traverse, .menu__item:hover, .console__tab, .console__tab.focus, .settings-param, .settings-param.focus, ' +
            '.selectbox-item, .selectbox-item.focus, .selectbox-item:hover, .full-person, .full-person.focus, .full-start__button, .full-start__button.focus, ' +
            '.full-descr__tag, .full-descr__tag.focus, .simple-button, .simple-button.focus, .search-source, .search-source.active, ' +
            '.radio-item, .radio-item.focus, .lang__selector-item, .lang__selector-item.focus, ' +
            '.modal__button, .modal__button.focus, .search-history-key, .search-history-key.focus, .simple-keyboard-mic, .simple-keyboard-mic.focus, ' +
            '.full-review-add, .full-review-add.focus, .full-review, .full-review.focus, .tag-count, .tag-count.focus, .settings-folder, .settings-folder.focus, ' +
            '.noty, .radio-player, .radio-player.focus { color: #ffffff !important; }',
            '.menu__ico, .menu__ico:hover, .menu__ico.traverse, .head__action, .settings-param__ico { fill: #ffffff !important; }',
            '.menu__ico.focus { stroke: none !important; }',
            '.menu__item.focus .menu__ico path[fill], .menu__item.focus .menu__ico rect[fill], .menu__item.focus .menu__ico circle[fill], ' +
            '.menu__item.traverse .menu__ico path[fill], .menu__item.traverse .menu__ico rect[fill], .menu__item.traverse .menu__ico circle[fill], ' +
            '.menu__item:hover .menu__ico path[fill], .menu__item:hover .menu__ico rect[fill], .menu__item:hover .menu__ico circle[fill] { fill: #ffffff !important; }',
            '.menu__item.focus .menu__ico [stroke], .menu__item.traverse .menu__ico [stroke], .menu__item:hover .menu__ico [stroke] { stroke: #fff !important; }',
            '.console__tab { background-color: var(--main-color) !important; }',
            '.console__tab.focus { background: var(--main-color) !important; color: #fff !important; ' + highlight + ' }',
            // Фокус без шапки і плеєра
            '.menu__item.focus, .menu__item.traverse, .menu__item:hover, .full-person.focus, .full-start__button.focus, .full-descr__tag.focus, ' +
            '.simple-button.focus, .search-source.active, ' +
            '.settings-param.focus, .items-line__more.focus, .settings-folder.focus, .selectbox-item.focus, .navigation-tabs__button.focus, ' +
            '.timetable__item.focus::before, .broadcast__device.focus, .iptv-menu__list-item.focus, .iptv-program__timeline>div, ' +
            '.radio-item.focus, .lang__selector-item.focus, .simple-keyboard .hg-button.focus, .modal__button.focus, .search-history-key.focus, ' +
            '.simple-keyboard-mic.focus, .full-review-add.focus, .full-review.focus, .tag-count.focus { background: var(--main-color) !important; ' + highlight + radius + ' }',
            '.navigation-tabs__button.focus { background-color: var(--main-color) !important; color: #fff !important; ' + highlight + radius + ' }',
            '.items-line__more.focus { color: #fff !important; background-color: var(--main-color) !important; ' + radius + ' }',
            '.timetable__item.focus { color: #fff !important; }',
            // Шапка фокус
            headFocus,
            headFocusRadius,
            // Шапка нефокус
            headNonFocusDimming,
            headNonFocusRadius,
            // Плеєр
            playerFocus,
            playerRadius,
            // Кнопки карточки
            '.full-start__button, .full-start__button.focus { ' + radius + ' }',
            '.online.focus { box-shadow: 0 0 0 0.2em var(--main-color) !important; }',
            dimming,
            '.timetable__item--any::before { background-color: rgba(var(--main-color-rgb), 0.3) !important; }',
            '.element { background: none !important; width: 253px !important; }',
            '.player-panel__position, .time-line > div, .head__action.active::after, .card--tv .card__type, .torrent-serial__progress, ' +
            '.bookmarks-folder__layer, .torrent-item__size, .torrent-serial__size, .navigation-tabs__badge, .broadcast__scan > div, ' +
            '.card:hover .card__view, .card.focus .card__view, .noty, .radio-player.focus { background-color: var(--main-color) !important; }',
            '.player-panel__position > div::after { background-color: #fff !important; }',
            '.notice__descr b, .torrent-item__viewed, .extensions__item-proto.protocol-https, .extensions__item-code.success, ' +
            '.explorer-card__head-rate > span, .explorer-card__head-rate > svg { color: var(--main-color) !important; }',
            '.online-prestige__viewed { background: rgb(255,255,255) !important; color: rgba(var(--main-color-rgb), 1) !important; }',
            '.player-info__values .value--size span, .torrent-item__ffprobe > div { background: rgba(var(--main-color-rgb), 1) !important; }',
            '.console__tab > span { background-color: #0009 !important; }',
            'circle[cx="24.1445"][cy="24.2546"][r="23.8115"] { fill-opacity: 0 !important; }',
            '.star-rating path[d="M8.39409 0.192139L10.99 5.30994L16.7882 6.20387L12.5475 10.4277L13.5819 15.9311L8.39409 13.2425L3.20626 15.9311L4.24065 10.4277L0 6.20387L5.79819 5.30994L8.39409 0.192139Z"] { fill: var(--main-color) !important; }',
            '.color_square.focus { border: 0.3em solid ' + focusBorderColor + ' !important; transform: scale(1.1) !important; }',
            '.hex-input.focus { border: 0.2em solid ' + focusBorderColor + ' !important; transform: scale(1.1) !important; }',
            '.color_square.default { background-color: #fff !important; width: 35px !important; height: 35px !important; border-radius: 4px !important; position: relative !important; }',
            '.color_square.default::after, .color_square.default::before { content: "" !important; position: absolute !important; top: 50% !important; left: 10% !important; right: 10% !important; height: 3px !important; background-color: #353535 !important; }',
            '.color_square.default::after { transform: rotate(45deg) !important; }',
            '.color_square.default::before { transform: rotate(-45deg) !important; }',
            '.color_square { width: 35px !important; height: 35px !important; border-radius: 4px !important; display: flex !important; flex-direction: column !important; justify-content: center !important; align-items: center !important; cursor: pointer !important; color: #ffffff !important; font-size: 10px !important; text-align: center !important; }',
            '.color_square .hex { font-size: 9px !important; opacity: 0.9 !important; text-transform: uppercase !important; z-index: 1 !important; }',
            '.color-family-outline { display: flex !important; flex-direction: row !important; flex-wrap: nowrap !important; overflow-x: auto !important; gap: 10px !important; border-radius: 8px !important; margin-bottom: 1px !important; padding: 5px !important; }',
            '.color-family-name { width: 80px !important; height: 35px !important; border-width: 2px !important; border-style: solid !important; border-radius: 4px !important; display: flex !important; flex-direction: column !important; justify-content: center !important; align-items: center !important; cursor: default !important; color: #ffffff !important; font-size: 10px !important; font-weight: bold !important; text-align: center !important; text-transform: capitalize !important; }',
            '.hex-input { width: 266px !important; height: 35px !important; border-radius: 8px !important; border: 2px solid #ddd !important; position: relative !important; cursor: pointer !important; display: flex !important; flex-direction: column !important; align-items: center !important; justify-content: center !important; color: #fff !important; font-size: 12px !important; font-weight: bold !important; text-shadow: 0 0 2px #000 !important; background-color: #353535 !important; }',
            '.color-picker-container { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 10px !important; padding: 0 !important; }',
            '.color-picker-container > div { display: flex !important; flex-direction: column !important; gap: 1px !important; }',
            '@media (max-width: 768px) { .color-picker-container { grid-template-columns: 1fr !important; } }',
            'body.glass--style .selectbox-item.focus, body.glass--style .settings-folder.focus, body.glass--style .settings-param.focus { background-color: var(--main-color) !important; }',
            'body.glass--style .settings-folder.focus .settings-folder__icon { -webkit-filter: none !important; filter: none !important; }',
            'body.glass--style .selectbox-item.focus::after { border-color: #fff !important; }',
            'body.glass--style .selectbox-item.focus, body.glass--style .selectbox-item.focus .selectbox-item__checkbox { filter: none !important; }'
        ].join('');

        updateDateElementStyles();
        forceBlackFilterBackground();
        updateSvgIcons();
    };

    const createColorHtml = (color, name) => {
        const className = color === 'default' ? 'color_square selector default' : 'color_square selector';
        const style = color === 'default' ? '' : `background-color: ${color};`;
        const hex = color === 'default' ? '' : color.replace('#', '');
        const content = color === 'default' ? '' : `<div class="hex">${hex}</div>`;
        return `<div class="${className}" tabindex="0" style="${style}" title="${name}">${content}</div>`;
    };

    const createFamilyNameHtml = (name, color) => `<div class="color-family-name" style="border-color: ${color || '#353535'};">${Lampa.Lang.translate(name.toLowerCase())}</div>`;

    const openColorPicker = () => {
        const colorKeys = Object.keys(ColorPlugin.colors.main);
        const families = ['Red', 'Orange', 'Amber', 'Yellow', 'Lime', 'Green', 'Emerald', 'Teal', 'Cyan', 'Sky', 'Blue', 'Indigo', 'Violet', 'Purple', 'Fuchsia', 'Pink', 'Rose', 'Slate', 'Gray', 'Zinc', 'Neutral', 'Stone'];
        const colorsByFamily = families.map(family => {
            const familyColors = colorKeys.filter(key => ColorPlugin.colors.main[key].startsWith(family) && key !== 'default');
            return familyColors.length ? { name: family, colors: familyColors } : null;
        }).filter(Boolean);

        const colorContent = colorsByFamily.map(family => {
            const firstColor = family.colors[0];
            const familyNameHtml = createFamilyNameHtml(family.name, firstColor);
            const groupContent = family.colors.map(color => createColorHtml(color, ColorPlugin.colors.main[color])).join('');
            return `<div class="color-family-outline">${familyNameHtml}${groupContent}</div>`;
        });

        const midPoint = Math.ceil(colorContent.length / 2);
        const leftColumn = colorContent.slice(0, midPoint).join('');
        const rightColumn = colorContent.slice(midPoint).join('');

        const defaultButton = createColorHtml('default', Lampa.Lang.translate('default_color'));
        const hexValue = Lampa.Storage.get('color_plugin_custom_hex', '') || '#353535';
        const hexDisplay = hexValue.replace('#', '');
        const inputHtml = `<div class="color_square selector hex-input" tabindex="0" style="background-color: ${hexValue};">` +
                          `<div class="label">${Lampa.Lang.translate('custom_hex_input')}</div>` +
                          `<div class="value">${hexDisplay}</div>` +
                          `</div>`;

        const topRowHtml = `<div style="display: flex; gap: 19px; justify-content: center; margin-bottom: 10px;">${defaultButton}${inputHtml}</div>`;
        const modalContent = `<div class="color-picker-container"><div>${leftColumn}</div><div>${rightColumn}</div></div>`;
        const modalHtml = $(`<div>${topRowHtml}${modalContent}</div>`);

        try {
            Lampa.Modal.open({
                title: Lampa.Lang.translate('main_color'),
                size: 'medium',
                align: 'center',
                html: modalHtml,
                className: 'color-picker-modal',
                onBack: () => {
                    saveSettings();
                    Lampa.Modal.close();
                    Lampa.Controller.toggle('settings_component');
                    Lampa.Controller.enable('menu');
                },
                onSelect: (a) => {
                    if (a.length > 0 && a[0] instanceof HTMLElement) {
                        const selectedElement = a[0];
                        let color;
                        if (selectedElement.classList.contains('hex-input')) {
                            Lampa.Noty.show(Lampa.Lang.translate('hex_input_hint'));
                            Lampa.Modal.close();
                            const inputOptions = {
                                name: 'color_plugin_custom_hex',
                                value: Lampa.Storage.get('color_plugin_custom_hex', ''),
                                placeholder: Lampa.Lang.translate('settings_cub_not_specified')
                            };
                            Lampa.Input.edit(inputOptions, (value) => {
                                if (!value) {
                                    Lampa.Noty.show('HEX-код не введено.');
                                    return;
                                }
                                if (!isValidHex(value)) {
                                    Lampa.Noty.show('Невірний формат HEX-коду. Використовуйте формат #FFFFFF.');
                                    return;
                                }
                                Lampa.Storage.set('color_plugin_custom_hex', value);
                                ColorPlugin.settings.main_color = value;
                                Lampa.Storage.set('color_plugin_main_color', value);
                                localStorage.setItem('color_plugin_main_color', value);
                                applyStyles();
                                forceBlackFilterBackground();
                                updateCanvasFillStyle(window.draw_context);
                                saveSettings();
                                if (Lampa.Settings && Lampa.Settings.render) Lampa.Settings.render();
                            });
                            return;
                        } else if (selectedElement.classList.contains('default')) {
                            color = '#353535';
                        } else {
                            color = selectedElement.style.backgroundColor || ColorPlugin.settings.main_color;
                            if (color.includes('rgb')) {
                                color = rgbToHex(color);
                            }
                        }
                        ColorPlugin.settings.main_color = color;
                        Lampa.Storage.set('color_plugin_main_color', color);
                        localStorage.setItem('color_plugin_main_color', color);
                        applyStyles();
                        forceBlackFilterBackground();
                        updateCanvasFillStyle(window.draw_context);
                        saveSettings();
                        Lampa.Modal.close();
                        if (Lampa.Settings && Lampa.Settings.render) Lampa.Settings.render();
                    }
                }
            });
        } catch (e) {
            console.error('ColorPlugin openColorPicker error:', e);
        }
    };

    const updateParamsVisibility = (body = document) => {
        const params = ['color_plugin_main_color', 'color_plugin_dimming_enabled', 'border_title', 'color_plugin_highlight_enabled', 'color_plugin_border_radius', 'color_plugin_change_head_border', 'color_plugin_change_player_border'];
        params.forEach(name => {
            document.querySelectorAll(`.settings-param[data-name="${name}"]`).forEach(el => {
                el.style.display = ColorPlugin.settings.enabled ? 'block' : 'none';
            });
        });
    };

    const initPlugin = () => {
        setTimeout(() => {
            loadSettings();

            if (Lampa.SettingsApi) {
                Lampa.SettingsApi.addComponent({
                    component: 'color_plugin',
                    name: Lampa.Lang.translate('color_plugin'),
                    icon: '<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.003a7 7 0 0 0-7 7v.43c.09 1.51 1.91 1.79 3 .7a1.87 1.87 0 0 1 2.64 2.64c-1.1 1.16-.79 3.07.8 3.2h.6a7 7 0 1 0 0-14l-.04.03zm0 13h-.52a.58.58 0 0 1-.36-.14.56.56 0 0 1-.15-.3 1.24 1.24 0 0 1 .35-1.08 2.87 2.87 0 0 0 0-4 2.87 2.87 0 0 0-4.06 0 1 1 0 0 1-.90.34.41.41 0 0 1-.22-.12.42.42 0 0 1-.1-.29v-.37a6 6 0 1 1 6 6l-.04-.04zM9 3.997a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 7.007a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-7-5a1 1 0 1 1 0-2 1 1 0 0 0 0 2zm7-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM13 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>'
                });

                Lampa.SettingsApi.addParam({
                    component: 'color_plugin',
                    param: { name: 'color_plugin_enabled', type: 'trigger', default: ColorPlugin.settings.enabled.toString() },
                    field: { name: Lampa.Lang.translate('color_plugin_enabled'), description: Lampa.Lang.translate('color_plugin_enabled_description') },
                    onChange: value => {
                        ColorPlugin.settings.enabled = value === 'true';
                        Lampa.Storage.set('color_plugin_enabled', ColorPlugin.settings.enabled.toString());
                        localStorage.setItem('color_plugin_enabled', ColorPlugin.settings.enabled.toString());
                        applyStyles();
                        forceBlackFilterBackground();
                        updateCanvasFillStyle(window.draw_context);
                        updateParamsVisibility();
                        saveSettings();
                        if (Lampa.Settings && Lampa.Settings.render) Lampa.Settings.render();
                    },
                    onRender: item => item.css?.('display', 'block')
                });

                Lampa.SettingsApi.addParam({
                    component: 'color_plugin',
                    param: { name: 'color_plugin_main_color', type: 'button' },
                    field: { name: Lampa.Lang.translate('main_color'), description: Lampa.Lang.translate('main_color_description') },
                    onRender: item => item.css?.('display', ColorPlugin.settings.enabled ? 'block' : 'none'),
                    onChange: openColorPicker
                });

                Lampa.SettingsApi.addParam({
                    component: 'color_plugin',
                    param: { name: 'color_plugin_dimming_enabled', type: 'trigger', default: ColorPlugin.settings.dimming_enabled.toString() },
                    field: { name: Lampa.Lang.translate('enable_dimming'), description: Lampa.Lang.translate('enable_dimming_description') },
                    onRender: item => item.css?.('display', ColorPlugin.settings.enabled ? 'block' : 'none'),
                    onChange: value => {
                        ColorPlugin.settings.dimming_enabled = value === 'true';
                        Lampa.Storage.set('color_plugin_dimming_enabled', ColorPlugin.settings.dimming_enabled.toString());
                        localStorage.setItem('color_plugin_dimming_enabled', ColorPlugin.settings.dimming_enabled.toString());
                        applyStyles();
                        saveSettings();
                        if (Lampa.Settings && Lampa.Settings.render) Lampa.Settings.render();
                    }
                });

                Lampa.SettingsApi.addParam({
                    component: 'color_plugin',
                    param: { name: 'border_title', type: 'title' },
                    field: { name: 'РАМКА' },
                    onRender: item => item.css?.('display', ColorPlugin.settings.enabled ? 'block' : 'none')
                });

                Lampa.SettingsApi.addParam({
                    component: 'color_plugin',
                    param: { name: 'color_plugin_highlight_enabled', type: 'trigger', default: ColorPlugin.settings.highlight_enabled.toString() },
                    field: { name: Lampa.Lang.translate('enable_highlight'), description: Lampa.Lang.translate('enable_highlight_description') },
                    onRender: item => item.css?.('display', ColorPlugin.settings.enabled ? 'block' : 'none'),
                    onChange: value => {
                        ColorPlugin.settings.highlight_enabled = value === 'true';
                        Lampa.Storage.set('color_plugin_highlight_enabled', ColorPlugin.settings.highlight_enabled.toString());
                        localStorage.setItem('color_plugin_highlight_enabled', ColorPlugin.settings.highlight_enabled.toString());
                        applyStyles();
                        saveSettings();
                        if (Lampa.Settings && Lampa.Settings.render) Lampa.Settings.render();
                    }
                });

                Lampa.SettingsApi.addParam({
                    component: 'color_plugin',
                    param: {
                        name: 'color_plugin_border_radius',
                        type: 'select',
                        values: {
                            'rect': Lampa.Lang.translate('border_radius_rect'),
                            'card': Lampa.Lang.translate('border_radius_card'),
                            'capsule': Lampa.Lang.translate('border_radius_capsule')
                        },
                        default: ColorPlugin.settings.border_radius
                    },
                    field: { name: Lampa.Lang.translate('border_radius'), description: Lampa.Lang.translate('border_radius_description') },
                    onRender: item => item.css?.('display', ColorPlugin.settings.enabled ? 'block' : 'none'),
                    onChange: value => {
                        ColorPlugin.settings.border_radius = value;
                        Lampa.Storage.set('color_plugin_border_radius', value);
                        localStorage.setItem('color_plugin_border_radius', value);
                        applyStyles();
                        saveSettings();
                        if (Lampa.Settings && Lampa.Settings.render) Lampa.Settings.render();
                    }
                });

                Lampa.SettingsApi.addParam({
                    component: 'color_plugin',
                    param: { name: 'color_plugin_change_head_border', type: 'trigger', default: ColorPlugin.settings.change_head_border.toString() },
                    field: { name: Lampa.Lang.translate('change_head_border'), description: Lampa.Lang.translate('change_head_border_description') },
                    onRender: item => item.css?.('display', ColorPlugin.settings.enabled ? 'block' : 'none'),
                    onChange: value => {
                        ColorPlugin.settings.change_head_border = value === 'true';
                        Lampa.Storage.set('color_plugin_change_head_border', ColorPlugin.settings.change_head_border.toString());
                        localStorage.setItem('color_plugin_change_head_border', ColorPlugin.settings.change_head_border.toString());
                        applyStyles();
                        saveSettings();
                        if (Lampa.Settings && Lampa.Settings.render) Lampa.Settings.render();
                    }
                });

                Lampa.SettingsApi.addParam({
                    component: 'color_plugin',
                    param: { name: 'color_plugin_change_player_border', type: 'trigger', default: ColorPlugin.settings.change_player_border.toString() },
                    field: { name: Lampa.Lang.translate('change_player_border'), description: Lampa.Lang.translate('change_player_border_description') },
                    onRender: item => item.css?.('display', ColorPlugin.settings.enabled ? 'block' : 'none'),
                    onChange: value => {
                        ColorPlugin.settings.change_player_border = value === 'true';
                        Lampa.Storage.set('color_plugin_change_player_border', ColorPlugin.settings.change_player_border.toString());
                        localStorage.setItem('color_plugin_change_player_border', ColorPlugin.settings.change_player_border.toString());
                        applyStyles();
                        saveSettings();
                        if (Lampa.Settings && Lampa.Settings.render) Lampa.Settings.render();
                    }
                });

                applyStyles();
                forceBlackFilterBackground();
                updateCanvasFillStyle(window.draw_context);
                updateParamsVisibility();
                updateSvgIcons();
            }
        }, 100);
    };

    if (window.appready && Lampa.SettingsApi && Lampa.Storage) {
        initPlugin();
    } else {
        Lampa.Listener.follow('app', e => e.type === 'ready' && initPlugin());
    }

    Lampa.Storage.listener.follow('change', e => {
        if (e.name.startsWith('color_plugin_')) {
            loadSettings();
            applyStyles();
            forceBlackFilterBackground();
            updateCanvasFillStyle(window.draw_context);
            updateParamsVisibility();
            updateSvgIcons();
        }
    });

    Lampa.Listener.follow('settings_component', e => {
        if (e.type === 'open') {
            loadSettings();
            applyStyles();
            forceBlackFilterBackground();
            updateCanvasFillStyle(window.draw_context);
            updateParamsVisibility(e.body);
            updateSvgIcons();
        } else if (e.type === 'close') {
            saveSettings();
            applyStyles();
            forceBlackFilterBackground();
            updateCanvasFillStyle(window.draw_context);
            updateSvgIcons();
        }
    });

    setTimeout(() => {
        if (typeof MutationObserver !== 'undefined') {
            const observer = new MutationObserver(mutations => {
                if (mutations.some(m => Array.from(m.addedNodes || []).some(n => n.nodeType === 1 && n.querySelector?.('.simple-button--filter')))) {
                    setTimeout(forceBlackFilterBackground, 100);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }, 500);
})();
