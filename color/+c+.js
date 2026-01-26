(function () {
    'use strict';

    // Переклад назви (резервний, якщо translations.js ще не завантажився)
    Lampa.Lang.add({
        color_plugin: {
            ru: 'Настройка цветов',
            en: 'Color settings',
            uk: 'Налаштування кольорів'
        }
    });

    // Список модулів — порядок важливий!
    var modules = [
        'https://mastermagic98.github.io/interface/color/color_plugin_translations.js',
        'https://mastermagic98.github.io/interface/color/color_plugin_settings.js',
        'https://mastermagic98.github.io/interface/color/color_plugin_utils.js',
        'https://mastermagic98.github.io/interface/color/color_plugin_styles.js',
        'https://mastermagic98.github.io/interface/color/color_plugin_ui.js',
        'https://mastermagic98.github.io/interface/color/color_plugin_visibility.js',
        'https://mastermagic98.github.io/interface/color/color_plugin_init.js',
        // color_plugin_main.js не додаємо сюди — це і є цей файл
    ];

    // Функція послідовного завантаження
    function loadNext(index) {
        if (index >= modules.length) {
            // Всі модулі завантажено — запускаємо ініціалізацію
            setTimeout(initializePlugin, 300); // затримка 300 мс — часто вирішує проблему
            return;
        }

        Lampa.Utils.putScriptAsync([modules[index]], function () {
            loadNext(index + 1);
        }, function (err) {
            console.warn('Помилка завантаження модуля:', modules[index], err);
            loadNext(index + 1); // продовжуємо навіть при помилці одного файлу
        });
    }

    // Основна функція ініціалізації (викликається один раз)
    function initializePlugin() {
        if (!Lampa.SettingsApi) {
            console.warn('Lampa.SettingsApi ще недоступний');
            setTimeout(initializePlugin, 500); // повторна спроба через 0.5 с
            return;
        }

        // Перевіряємо, чи компонент вже додано (захист від дублювання)
        var componentExists = Lampa.SettingsApi.components.some(function(c) {
            return c.component === 'color_plugin';
        });

        if (!componentExists) {
            Lampa.SettingsApi.addComponent({
                component: 'color_plugin',
                name: Lampa.Lang.translate('color_plugin'),
                icon: '<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.003a7 7 0 0 0-7 7v.43c.09 1.51 1.91 1.79 3 .7a1.87 1.87 0 0 1 2.64 2.64c-1.1 1.16-.79 3.07.8 3.2h.6a7 7 0 1 0 0-14l-.04.03zm0 13h-.52a.58.58 0 0 1-.36-.14.56.56 0 0 1-.15-.3 1.24 1.24 0 0 1 .35-1.08 2.87 2.87 0 0 0 0-4 2.87 2.87 0 0 0-4.06 0 1 1 0 0 1-.9.34.41.41 0 0 1-.22-.12.42.42 0 0 1-.1-.29v-.37a6 6 0 1 1 6 6l-.04-.04zM9 3.997a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 7.007a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-7-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM13 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>'
            });
            console.log('Компонент color_plugin додано');
        } else {
            console.log('Компонент color_plugin вже існує');
        }

        // Викликаємо initPlugin з color_plugin_init.js
        if (typeof initPlugin === 'function') {
            initPlugin();
            console.log('initPlugin викликано');
        } else {
            console.warn('Функція initPlugin не знайдена — перевір завантаження color_plugin_init.js');
        }

        // Примусове оновлення меню налаштувань
        if (Lampa.Settings && Lampa.Settings.main && typeof Lampa.Settings.main().render === 'function') {
            Lampa.Settings.main().render();
            console.log('Lampa.Settings.main().render() викликано');
        }

        // Додаткове оновлення (іноді допомагає в нових версіях)
        if (Lampa.Settings && Lampa.Settings.update) {
            Lampa.Settings.update();
        }
    }

    // Запускаємо завантаження модулів
    if (window.appready) {
        loadNext(0);
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                loadNext(0);
            }
        });
    }

    // Маніфест (не обов'язково, але корисно)
    Lampa.Manifest.plugins = Lampa.Manifest.plugins || {};
    Lampa.Manifest.plugins.color_plugin = {
        name: 'color_plugin',
        version: '1.0.0',
        description: 'Налаштування кольорів'
    };

})();
