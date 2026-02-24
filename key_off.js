(function () {
    'use strict';

    var DEFAULT_LAYOUT_KEY = 'keyboard_default_layout';
    var HIDDEN_LAYOUTS_KEY = 'keyboard_hidden_layouts';

    var AVAILABLE_LAYOUTS = [
        { value: 'uk', name: 'Українська' },
        { value: 'ru', name: 'Русский' },
        { value: 'en', name: 'English' },
        { value: 'hu', name: 'עִברִית' }
    ];

    function initPlugin() {

        if (!window.Lampa || !Lampa.SettingsApi) return;

        // --- Переклади ---
        Lampa.Lang.add({
            keyboard_settings_title: {
                ru: 'Настройки клавиатуры',
                en: 'Keyboard settings',
                uk: 'Налаштування клавіатури'
            },
            keyboard_default_layout: {
                ru: 'Раскладка по умолчанию',
                en: 'Default layout',
                uk: 'Розкладка за замовчуванням'
            },
            keyboard_hidden_layouts: {
                ru: 'Скрытые раскладки',
                en: 'Hidden layouts',
                uk: 'Приховані розкладки'
            }
        });

        var title = Lampa.Lang.translate('keyboard_settings_title');

        // --- Реєстрація компонента ---
        Lampa.SettingsApi.addComponent({
            name: 'keyboard_settings',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 5h18v14H3zM5 7h2v2H5zm4 0h2v2H9zm4 0h2v2h-2zM5 11h2v2H5zm4 0h2v2H9zm4 0h2v2h-2z"/></svg>',
            title: title
        });

        var savedDefault = Lampa.Storage.get(DEFAULT_LAYOUT_KEY, 'uk');
        var savedHidden = Lampa.Storage.get(HIDDEN_LAYOUTS_KEY, []);

        if (!Array.isArray(savedHidden)) savedHidden = [];

        if (!savedHidden.includes(savedDefault)) {
            savedHidden.push(savedDefault);
            Lampa.Storage.set(HIDDEN_LAYOUTS_KEY, savedHidden);
        }

        // --- Параметр 1 ---
        Lampa.SettingsApi.addParam({
            component: 'keyboard_settings',
            param: {
                name: Lampa.Lang.translate('keyboard_default_layout'),
                type: 'select',
                values: AVAILABLE_LAYOUTS,
                default: savedDefault
            },
            onChange: function (value) {

                Lampa.Storage.set(DEFAULT_LAYOUT_KEY, value);

                var hidden = Lampa.Storage.get(HIDDEN_LAYOUTS_KEY, []);

                if (!hidden.includes(value)) {
                    hidden.push(value);
                }

                Lampa.Storage.set(HIDDEN_LAYOUTS_KEY, hidden);
            }
        });

        // --- Параметр 2 ---
        Lampa.SettingsApi.addParam({
            component: 'keyboard_settings',
            param: {
                name: Lampa.Lang.translate('keyboard_hidden_layouts'),
                type: 'multiselect',
                values: AVAILABLE_LAYOUTS,
                default: savedHidden
            },
            onChange: function (values) {

                var currentDefault = Lampa.Storage.get(DEFAULT_LAYOUT_KEY, 'uk');

                if (!values.includes(currentDefault)) {
                    values.push(currentDefault);
                }

                Lampa.Storage.set(HIDDEN_LAYOUTS_KEY, values);
            }
        });

        // --- Перехоплення клавіатури ---
        Lampa.Listener.follow('keyboard', function (event) {

            if (!event || !event.layouts) return;

            var hidden = Lampa.Storage.get(HIDDEN_LAYOUTS_KEY, []);
            var defaultLayout = Lampa.Storage.get(DEFAULT_LAYOUT_KEY, 'uk');

            event.layouts = event.layouts.filter(function (layout) {
                return !hidden.includes(layout.code);
            });

            event.default = defaultLayout;
        });
    }

    // Чекаємо повної ініціалізації
    if (window.appready) initPlugin();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') initPlugin();
    });

})();
