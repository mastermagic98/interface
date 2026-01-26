// Головний файл плагіну (наприклад, color_plugin.js або index.js)
(function () {
    'use strict';

    // Список модулів — важливий порядок завантаження!
    // Спочатку налаштування, утиліти, стилі, UI, видимість, ініціалізація логіки, потім main (слухачі)
    var modules = [
        'https://mastermagic98.github.io/interface/color/color_plugin_translations.js',
        'https://mastermagic98.github.io/interface/color/color_plugin_settings.js',
        'https://mastermagic98.github.io/interface/color/color_plugin_utils.js',
        'https://mastermagic98.github.io/interface/color/color_plugin_styles.js',
        'https://mastermagic98.github.io/interface/color/color_plugin_ui.js',
        'https://mastermagic98.github.io/interface/color/color_plugin_visibility.js',
        'https://mastermagic98.github.io/interface/color/color_plugin_init.js',    // тут addParam і базова ініціалізація
        'https://mastermagic98.github.io/interface/color/color_plugin_main.js'     // тут тільки слухачі (без власного initPlugin)
        'https://mastermagic98.github.io/interface/color/color_plugin_highlight.js'
    ];

    // Послідовне асинхронне завантаження модулів (щоб уникнути гонок і дублювання)
    function loadScripts(index) {
        if (index >= modules.length) {
            startPlugin();
            return;
        }
        Lampa.Utils.putScriptAsync([modules[index]], function () {
            loadScripts(index + 1);
        }, function () {
            // Якщо помилка завантаження — продовжуємо (не блокуємо плагін)
            loadScripts(index + 1);
        });
    }

    // Ініціалізація плагіну — викликається ТІЛЬКИ ОДИН РАЗ після завантаження всіх модулів
    function startPlugin() {
        // Додаємо розділ у меню налаштувань (тільки один раз)
        if (Lampa.SettingsApi && Lampa.SettingsApi.components) {
            var exists = Lampa.SettingsApi.components.find(function (c) {
                return c.component === 'color_plugin';
            });
            if (!exists) {
                Lampa.SettingsApi.addComponent({
                    component: 'color_plugin',
                    icon: '<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.003a7 7 0 0 0-7 7v.43c.09 1.51 1.91 1.79 3 .7a1.87 1.87 0 0 1 2.64 2.64c-1.1 1.16-.79 3.07.8 3.2h.6a7 7 0 1 0 0-14l-.04.03zm0 13h-.52a.58.58 0 0 1-.36-.14.56.56 0 0 1-.15-.3 1.24 1.24 0 0 1 .35-1.08 2.87 2.87 0 0 0 0-4 2.87 2.87 0 0 0-4.06 0 1 1 0 0 1-.9.34.41.41 0 0 1-.22-.12.42.42 0 0 1-.1-.29v-.37a6 6 0 1 1 6 6l-.04-.04zM9 3.997a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 7.007a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-7-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM13 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>',
                    name: Lampa.Lang.translate('color_plugin')
                });
            }
        }

        // Викликаємо функцію ініціалізації логіки та параметрів (визначена в color_plugin_init.js)
        if (typeof initPlugin === 'function') {
            initPlugin();
        }

        // Оновлюємо меню налаштувань
        if (Lampa.Settings && Lampa.Settings.main && Lampa.Settings.main().render) {
            Lampa.Settings.main().render();
        }
    }

    // Запускаємо завантаження після готовності приложения
    if (window.appready) {
        loadScripts(0);
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                loadScripts(0);
            }
        });
    }

    // Маніфест плагіну
    Lampa.Manifest.plugins = {
        name: 'color_plugin',
        version: '1.0.0',
        description: 'Customization colors'
    };
})();
