(function () {
    'use strict';

    var DEFAULT_LAYOUT_KEY = 'keyboard_default_layout';
    var HIDDEN_LAYOUTS_KEY = 'keyboard_hidden_layouts';

    // Доступні системні розкладки
    var AVAILABLE_LAYOUTS = [
        { value: 'uk', name: 'Українська' },
        { value: 'ru', name: 'Русский' },
        { value: 'en', name: 'English' },
        { value: 'hu', name: 'עִברִית' }
    ];

    function initPlugin() {

        if (!Lampa || !Lampa.Settings) return;

        Lampa.Lang.add({
            keyboard_layout_plugin: {
                ru: 'Клавиатура',
                en: 'Keyboard',
                uk: 'Клавіатура'
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

        var savedDefault = Lampa.Storage.get(DEFAULT_LAYOUT_KEY, 'uk');
        var savedHidden = Lampa.Storage.get(HIDDEN_LAYOUTS_KEY, []);

        if (savedHidden.indexOf(savedDefault) === -1) {
            savedHidden.push(savedDefault);
            Lampa.Storage.set(HIDDEN_LAYOUTS_KEY, savedHidden);
        }

        Lampa.SettingsApi.addParam({
            component: 'interface',
            param: {
                name: 'keyboard_layout_plugin',
                type: 'title'
            }
        });

        // Розкладка за замовчуванням
        Lampa.SettingsApi.addParam({
            component: 'interface',
            param: {
                name: 'keyboard_default_layout',
                type: 'select',
                values: AVAILABLE_LAYOUTS.map(function (l) {
                    return { value: l.value, name: l.name };
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

        // Приховані розкладки
        Lampa.SettingsApi.addParam({
            component: 'interface',
            param: {
                name: 'keyboard_hidden_layouts',
                type: 'multiselect',
                values: AVAILABLE_LAYOUTS.map(function (l) {
                    return { value: l.value, name: l.name };
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

        // Перехоплення клавіатури
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
