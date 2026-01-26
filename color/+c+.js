(function () {
    'use strict';

    // Резервний переклад на випадок затримки
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
        // НЕ додаємо color_plugin_main.js сюди — це і є цей файл
    ];

    var loadedCount = 0;

    function loadModule(url) {
        Lampa.Utils.putScriptAsync([url], function () {
            loadedCount++;
            if (loadedCount === modules.length) {
                // Всі модулі завантажено — запускаємо ініціалізацію
                setTimeout(function () {
                    initializeColorPlugin();
                }, 400); // затримка для впевненості, що все зареєструвалося
            }
        }, function (err) {
            console.warn('Не вдалося завантажити:', url, err);
            loadedCount++; // продовжуємо навіть при помилці
            if (loadedCount === modules.length) {
                setTimeout(initializeColorPlugin, 400);
            }
        });
    }

    function initializeColorPlugin() {
        if (typeof initPlugin !== 'function') {
            console.error('Функція initPlugin не визначена! Перевірте завантаження color_plugin_init.js');
            return;
        }

        if (!Lampa.SettingsApi) {
            console.warn('SettingsApi ще не готова, повторна спроба через 500мс...');
            setTimeout(initializeColorPlugin, 500);
            return;
        }

        // Перевірка на дублювання компонента
        var alreadyAdded = Lampa.SettingsApi.components.some(function(c) {
            return c.component === 'color_plugin';
        });

        if (!alreadyAdded) {
            Lampa.SettingsApi.addComponent({
                component: 'color_plugin',
                name: Lampa.Lang.translate('color_plugin'),
                icon: '<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.003a7 7 0 0 0-7 7v.43c.09 1.51 1.91 1.79 3 .7a1.87 1.87 0 0 1 2.64 2.64c-1.1 1.16-.79 3.07.8 3.2h.6a7 7 0 1 0 0-14l-.04.03zm0 13h-.52a.58.58 0 0 1-.36-.14.56.56 0 0 1-.15-.3 1.24 1.24 0 0 1 .35-1.08 2.87 2.87 0 0 0 0-4 2.87 2.87 0 0 0-4.06 0 1 1 0 0 1-.9.34.41.41 0 0 1-.22-.12.42.42 0 0 1-.1-.29v-.37a6 6 0 1 1 6 6l-.04-.04zM9 3.997a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 7.007a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-7-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM13 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>'
            });
            console.log('[Color Plugin] Компонент додано в меню налаштувань');
        }

        // Запускаємо основну ініціалізацію
        initPlugin();

        // Примусове оновлення меню
        if (Lampa.Settings && Lampa.Settings.main && Lampa.Settings.main().render) {
            Lampa.Settings.main().render();
            console.log('[Color Plugin] Викликано render меню налаштувань');
        }
    }

    // Запуск завантаження модулів
    if (window.appready) {
        modules.forEach(loadModule);
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                modules.forEach(loadModule);
            }
        });
    }

})();
