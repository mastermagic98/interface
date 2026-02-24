(function () {
    'use strict';

    /**
     * Окремий компонент налаштувань клавіатури
     */

    var DEFAULT_LAYOUT_KEY = 'keyboard_default_layout';
    var HIDDEN_LAYOUTS_KEY = 'keyboard_hidden_layouts';

    var AVAILABLE_LAYOUTS = [
        { value: 'uk', name: 'Українська' },
        { value: 'ru', name: 'Русский' },
        { value: 'en', name: 'English' },
        { value: 'hu', name: 'עִברִית' }
    ];

    function initPlugin() {

        if (!window.Lampa) return;

        // --- Переклади ---
        Lampa.Lang.add({
            keyboard_settings_component: {
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

        // --- Реєстрація окремого компонента ---
        Lampa.SettingsApi.addComponent({
            name: 'keyboard_settings',
            icon: '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3 5h18v14H3zM5 7v2h2V7H5zm0 4v2h2v-2H5zm4-4v2h2V7H9zm0 4v2h2v-2H9zm4-4v2h2V7h-2zm0 4v2h2v-2h-2z"/></svg>',
            title: 'keyboard_settings_component'
        });

        var savedDefault = Lampa.Storage.get(DEFAULT_LAYOUT_KEY, 'uk');
        var savedHidden = Lampa.Storage.get(HIDDEN_LAYOUTS_KEY, []);

        if (savedHidden.indexOf(savedDefault) === -1) {
            savedHidden.push(savedDefault);
            Lampa.Storage.set(HIDDEN_LAYOUTS_KEY, savedHidden);
        }

        // --- Розкладка за замовчуванням ---
        Lampa.SettingsApi.addParam({
            component: 'keyboard_settings',
            param: {
                name: 'keyboard_default_layout',
                type: 'select',
                values: AVAILABLE_LAYOUTS.map(function (l) {
                    return {
                        value: l.value,
                        name: l.name
                    };
                }),
                default: savedDefault
            },
            onChange: function (value) {

                Lampa.Storage.set(DEFAULT_LAYOUT_KEY, value);

                var hidden = Lampa.Storage.get(HIDDEN_LAYOUTS_KEY, []);

                if (hidden.indexOf(value) === -1) {
                    hidden.push(value);
                }

                Lampa.Storage.set(HIDDEN_LAYOUTS_KEY, hidden);
            }
        });

        // --- Приховані розкладки ---
        Lampa.SettingsApi.addParam({
            component: 'keyboard_settings',
            param: {
                name: 'keyboard_hidden_layouts',
                type: 'multiselect',
                values: AVAILABLE_LAYOUTS.map(function (l) {
                    return {
                        value: l.value,
                        name: l.name
                    };
                }),
                default: savedHidden
            },
            onChange: function (values) {

                var currentDefault = Lampa.Storage.get(DEFAULT_LAYOUT_KEY, 'uk');

                if (values.indexOf(currentDefault) === -1) {
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
                return hidden.indexOf(layout.code) === -1;
            });

            event.default = defaultLayout;
        });

    }

    if (window.appready) initPlugin();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') initPlugin();
    });

})();
