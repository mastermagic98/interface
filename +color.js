(function () {
    'use strict';

    // ────────────────────────────────────────────────
    // Переклади
    // ────────────────────────────────────────────────
    Lampa.Lang.add({
        color_plugin:                         { ru: 'Настройка цветов',      en: 'Color settings',         uk: 'Налаштування кольорів' },
        color_plugin_enabled:                 { ru: 'Включить плагин',       en: 'Enable plugin',          uk: 'Увімкнути плагін' },
        color_plugin_enabled_description:     { ru: 'Изменяет вид интерфейса',en: 'Changes interface look', uk: 'Змінює вигляд інтерфейсу' },
        main_color:                           { ru: 'Цвет выделения',       en: 'Highlight color',        uk: 'Колір виділення' },
        main_color_description:               { ru: 'Выберите или укажите',  en: 'Select or enter color',  uk: 'Виберіть або вкажіть колір' },
        enable_highlight:                     { ru: 'Показать рамку',       en: 'Show border',            uk: 'Показати рамку' },
        enable_highlight_description:         { ru: 'Белая рамка вокруг выделения', en: 'White border on focus', uk: 'Біла рамка при фокусі' },
        enable_dimming:                       { ru: 'Применить затемнение',  en: 'Apply dimming',         uk: 'Застосувати затемнення' },
        enable_dimming_description:           { ru: 'Темный оттенок основного цвета', en: 'Dark shade of main color', uk: 'Темний відтінок основного кольору' },
        default_color:                        { ru: 'По умолчанию',         en: 'Default',                uk: 'За замовчуванням' },
        custom_hex_input:                     { ru: 'Введи HEX-код цвета',  en: 'Enter HEX code',        uk: 'Введіть HEX-код кольору' },
        hex_input_hint:                       { ru: 'Формат #RRGGBB, например #1E90FF', en: 'Format #RRGGBB, e.g. #1E90FF', uk: 'Формат #RRGGBB, напр. #1E90FF' }
    });

    // ────────────────────────────────────────────────
    // Основні об’єкти плагіна
    // ────────────────────────────────────────────────
    const plugin = {
        name: 'color_plugin',
        version: '3.1.0',
        enabled: Lampa.Storage.get('color_plugin_enabled', true),
        main_color: Lampa.Storage.get('color_plugin_main_color', '#353535'),
        highlight: Lampa.Storage.get('color_plugin_highlight', true),
        dimming:   Lampa.Storage.get('color_plugin_dimming', true)
    };

    const runtime = {
        applied: false,
        styleElement: null,
        observer: null
    };

    // ────────────────────────────────────────────────
    // Допоміжні функції
    // ────────────────────────────────────────────────
    function isValidHex(hex) {
        return /^#[0-9A-Fa-f]{6}$/.test(hex);
    }

    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.substr(0,2), 16);
        const g = parseInt(hex.substr(2,2), 16);
        const b = parseInt(hex.substr(4,2), 16);
        return `${r},${g},${b}`;
    }

    function saveAll() {
        Lampa.Storage.set('color_plugin_enabled',       plugin.enabled);
        Lampa.Storage.set('color_plugin_main_color',    plugin.main_color);
        Lampa.Storage.set('color_plugin_highlight',     plugin.highlight);
        Lampa.Storage.set('color_plugin_dimming',       plugin.dimming);
    }

    function resetChanges() {
        if (runtime.styleElement) {
            runtime.styleElement.remove();
            runtime.styleElement = null;
        }
        runtime.applied = false;
    }

    // ────────────────────────────────────────────────
    // Головна функція застосування стилів
    // ────────────────────────────────────────────────
    function applyStyles() {
        resetChanges();

        if (!plugin.enabled) return;

        const rgb = hexToRgb(plugin.main_color);
        const borderColor = (plugin.main_color === '#353535') ? '#ffffff' : 'var(--main-color)';

        const highlightCSS = plugin.highlight ? `
            box-shadow: inset 0 0 0 0.15em #ffffff !important;
            -webkit-box-shadow: inset 0 0 0 0.15em #ffffff !important;
        ` : '';

        const css = `
            :root {
                --main-color: ${plugin.main_color} !important;
                --main-color-rgb: ${rgb} !important;
                --accent-color: ${plugin.main_color} !important;
            }

            /* Фокус + виділення */
            .menu__item.focus,
            .settings-param.focus,
            .selectbox-item.focus,
            .simple-button.focus,
            .full-start__button.focus,
            .navigation-tabs__button.focus,
            .items-line__more.focus {
                background: var(--main-color) !important;
                color: #ffffff !important;
                ${highlightCSS}
            }

            /* Затемнення */
            ${plugin.dimming ? `
                .full-start__rate,
                .reaction,
                .full-start__button,
                .card__vote,
                .items-line__more,
                .card__icons-inner,
                .simple-button--filter > div {
                    background: rgba(var(--main-color-rgb), 0.30) !important;
                }
            ` : ''}

            /* Інші часті елементи */
            .console__tab.focus          { background: var(--main-color) !important; color:#fff !important; ${highlightCSS} }
            .player-panel .button.focus  { background: var(--main-color) !important; color:#fff !important; }
            .noty                        { background: var(--main-color) !important; }
            .torrent-item__size          { background: var(--main-color) !important; color:#fff !important; }
            .online.focus                { box-shadow: 0 0 0 0.25em var(--main-color) !important; }
            .color_square.focus          { border: 0.3em solid ${borderColor} !important; transform: scale(1.12) !important; }

            /* Іконки меню */
            .menu__ico, .menu__ico.focus, .menu__ico:hover {
                fill: #ffffff !important;
                color: #ffffff !important;
            }
        `;

        const style = document.createElement('style');
        style.id = 'color-plugin-dynamic';
        style.textContent = css;
        document.head.appendChild(style);

        runtime.styleElement = style;
        runtime.applied = true;
    }

    // ────────────────────────────────────────────────
    // Вибір кольору (модальне вікно)
    // ────────────────────────────────────────────────
    function openColorSelector() {
        const defaultBtn = `<div class="color_square selector default" tabindex="0" title="${Lampa.Lang.translate('default_color')}"></div>`;

        const colors = [
            '#fb2c36','#e7000b','#c10007',
            '#ff6900','#f54900','#ca3500',
            '#fe9a00','#e17100','#bb4d00',
            '#f0b100','#d08700','#a65f00',
            '#7ccf00','#5ea500','#497d00',
            '#00c950','#00a63e','#008236',
            '#00bc7d','#009966','#007a55',
            '#00bba7','#009689','#00786f',
            '#00b8db','#0092b8','#007595',
            '#00a6f4','#0084d1','#0069a8',
            '#2b7fff','#155dfc','#1447e6',
            '#615fff','#4f39f6','#432dd7',
            '#8e51ff','#7f22fe','#7008e7',
            '#ad46ff','#9810fa','#8200db',
            '#e12afb','#c800de','#a800b7',
            '#f6339a','#e60076','#c6005c',
            '#ff2056','#ec003f','#c70036',
            '#62748e','#45556c','#314158',
            '#6a7282','#4a5565','#364153',
            '#71717b','#52525c','#3f3f46',
            '#737373','#525252','#404040',
            '#79716b','#57534d','#44403b'
        ];

        let html = '<div style="display:flex; flex-wrap:wrap; gap:12px; justify-content:center; padding:12px;">';
        html += defaultBtn;

        colors.forEach(c => {
            html += `<div class="color_square selector" tabindex="0" style="background:${c}" data-color="${c}"></div>`;
        });

        html += '</div>';

        Lampa.Modal.open({
            title: Lampa.Lang.translate('main_color'),
            html: $(html),
            size: 'large',
            onSelect: (items) => {
                if (!items.length) return;

                const el = items[0];
                let color = plugin.main_color;

                if (el.classList.contains('default')) {
                    color = '#353535';
                } else if (el.dataset.color) {
                    color = el.dataset.color;
                }

                plugin.main_color = color;
                saveAll();
                applyStyles();
                Lampa.Modal.close();
            },
            onBack: () => {
                Lampa.Modal.close();
            }
        });
    }

    // ────────────────────────────────────────────────
    // Реєстрація в налаштуваннях
    // ────────────────────────────────────────────────
    function registerSettings() {
        if (!Lampa.SettingsApi) return;

        Lampa.SettingsApi.addComponent({
            component: plugin.name,
            name: Lampa.Lang.translate('color_plugin'),
            description: 'Персоналізація кольору акценту',
            icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>'
        });

        // Увімкнення плагіна
        Lampa.SettingsApi.addParam({
            component: plugin.name,
            param: { name: 'color_plugin_enabled', type: 'trigger' },
            field: {
                name: Lampa.Lang.translate('color_plugin_enabled'),
                description: Lampa.Lang.translate('color_plugin_enabled_description')
            },
            onChange: val => {
                plugin.enabled = val === true || val === 'true';
                saveAll();
                if (plugin.enabled) {
                    applyStyles();
                } else {
                    resetChanges();
                }
            }
        });

        // Вибір кольору
        Lampa.SettingsApi.addParam({
            component: plugin.name,
            param: { name: 'color_plugin_main_color', type: 'button' },
            field: {
                name: Lampa.Lang.translate('main_color'),
                description: Lampa.Lang.translate('main_color_description')
            },
            onChange: () => openColorSelector()
        });

        // Рамка при фокусі
        Lampa.SettingsApi.addParam({
            component: plugin.name,
            param: { name: 'color_plugin_highlight', type: 'trigger' },
            field: {
                name: Lampa.Lang.translate('enable_highlight'),
                description: Lampa.Lang.translate('enable_highlight_description')
            },
            onChange: val => {
                plugin.highlight = val === true || val === 'true';
                saveAll();
                applyStyles();
            }
        });

        // Затемнення
        Lampa.SettingsApi.addParam({
            component: plugin.name,
            param: { name: 'color_plugin_dimming', type: 'trigger' },
            field: {
                name: Lampa.Lang.translate('enable_dimming'),
                description: Lampa.Lang.translate('enable_dimming_description')
            },
            onChange: val => {
                plugin.dimming = val === true || val === 'true';
                saveAll();
                applyStyles();
            }
        });
    }

    // ────────────────────────────────────────────────
    // Запуск
    // ────────────────────────────────────────────────
    function startPlugin() {
        registerSettings();
        applyStyles();

        // Слухаємо зміни налаштувань
        Lampa.Storage.listener.follow('change', e => {
            if ([
                'color_plugin_enabled',
                'color_plugin_main_color',
                'color_plugin_highlight',
                'color_plugin_dimming'
            ].includes(e.name)) {
                applyStyles();
            }
        });
    }

    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', e => {
            if (e.type === 'ready') startPlugin();
        });
    }

})();
