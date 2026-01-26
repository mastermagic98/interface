(function () {
    'use strict';

    // Резервний переклад
    Lampa.Lang.add({
        color_plugin: {
            ru: 'Настройка цветов',
            en: 'Color settings',
            uk: 'Налаштування кольорів'
        }
    });

    var modules = [
        'https://mastermagic98.github.io/interface/color/color_plugin_translations.js',
        'https://mastermagic98.github.io/interface/color/color_plugin_settings.js',
        'https://mastermagic98.github.io/interface/color/color_plugin_utils.js',
        'https://mastermagic98.github.io/interface/color/color_plugin_styles.js',
        'https://mastermagic98.github.io/interface/color/color_plugin_ui.js',
        'https://mastermagic98.github.io/interface/color/color_plugin_visibility.js',
        'https://mastermagic98.github.io/interface/color/color_plugin_init.js'
        // Головний файл НЕ додаємо в масив — він уже виконується
    ];

    var loaded = 0;

    function loadScript(url) {
        Lampa.Utils.putScriptAsync([url], function () {
            loaded++;
            if (loaded === modules.length) {
                setTimeout(startColorPlugin, 500);
            }
        }, function (e) {
            console.warn('Помилка завантаження: ' + url, e);
            loaded++;
            if (loaded === modules.length) {
                setTimeout(startColorPlugin, 500);
            }
        });
    }

    function startColorPlugin() {
        if (typeof initPlugin !== 'function') {
            console.error('initPlugin не знайдено — перевірте завантаження color_plugin_init.js');
            return;
        }

        if (!Lampa.SettingsApi) {
            console.warn('SettingsApi ще не готовий, повтор через 800мс...');
            setTimeout(startColorPlugin, 800);
            return;
        }

        var exists = Lampa.SettingsApi.components.some(c => c.component === 'color_plugin');
        if (!exists) {
            Lampa.SettingsApi.addComponent({
                component: 'color_plugin',
                name: Lampa.Lang.translate('color_plugin'),
                icon: '<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.003a7 7 0 0 0-7 7v.43c.09 1.51 1.91 1.79 3 .7a1.87 1.87 0 0 1 2.64 2.64c-1.1 1.16-.79 3.07.8 3.2h.6a7 7 0 1 0 0-14l-.04.03zm0 13h-.52a.58.58 0 0 1-.36-.14.56.56 0 0 1-.15-.3 1.24 1.24 0 0 1 .35-1.08 2.87 2.87 0 0 0 0-4 2.87 2.87 0 0 0-4.06 0 1 1 0 0 1-.9.34.41.41 0 0 1-.22-.12.42.42 0 0 1-.1-.29v-.37a6 6 0 1 1 6 6l-.04-.04zM9 3.997a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 7.007a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-7-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM13 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>'
            });
        }

        initPlugin();

        if (Lampa.Settings && Lampa.Settings.main && Lampa.Settings.main().render) {
            Lampa.Settings.main().render();
        }
    }

    // Запуск
    if (window.appready) {
        modules.forEach(loadScript);
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                modules.forEach(loadScript);
            }
        });
    }

})();
