(function () {
    'use strict';

    // Резервний переклад на випадок затримки translations.js
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
        'https://mastermagic98.github.io/interface/color/color_plugin_init.js'
    ];

    var loadedCount = 0;

    function loadNextModule(index) {
        if (index >= modules.length) {
            // Усі модулі завантажено — запускаємо ініціалізацію з затримкою
            console.log('[Color Plugin] Усі модулі завантажено, запускаємо ініціалізацію через 600мс');
            setTimeout(initializePlugin, 600);
            return;
        }

        var url = modules[index];
        console.log('[Color Plugin] Завантаження модуля:', url);

        Lampa.Utils.putScriptAsync([url], function () {
            console.log('[Color Plugin] Модуль завантажено:', url);
            loadedCount++;
            loadNextModule(index + 1);
        }, function (err) {
            console.warn('[Color Plugin] Помилка завантаження:', url, err);
            loadedCount++;
            loadNextModule(index + 1); // продовжуємо навіть при помилці
        });
    }

    function initializePlugin() {
        if (typeof initPlugin !== 'function') {
            console.error('[Color Plugin] Функція initPlugin НЕ визначена! Перевірте файл color_plugin_init.js');
            return;
        }

        if (!Lampa.SettingsApi) {
            console.warn('[Color Plugin] Lampa.SettingsApi ще не готовий, повтор через 800мс...');
            setTimeout(initializePlugin, 800);
            return;
        }

        console.log('[Color Plugin] Lampa.SettingsApi готовий, додаємо компонент');

        // Перевірка на дублювання компонента
        var componentExists = Lampa.SettingsApi.components.some(function(c) {
            return c.component === 'color_plugin';
        });

        if (!componentExists) {
            Lampa.SettingsApi.addComponent({
                component: 'color_plugin',
                name: Lampa.Lang.translate('color_plugin'),
                icon: '<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.003a7 7 0 0 0-7 7v.43c.09 1.51 1.91 1.79 3 .7a1.87 1.87 0 0 1 2.64 2.64c-1.1 1.16-.79 3.07.8 3.2h.6a7 7 0 1 0 0-14l-.04.03zm0 13h-.52a.58.58 0 0 1-.36-.14.56.56 0 0 1-.15-.3 1.24 1.24 0 0 1 .35-1.08 2.87 2.87 0 0 0 0-4 2.87 2.87 0 0 0-4.06 0 1 1 0 0 1-.9.34.41.41 0 0 1-.22-.12.42.42 0 0 1-.1-.29v-.37a6 6 0 1 1 6 6l-.04-.04zM9 3.997a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 7.007a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-7-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM13 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>'
            });
            console.log('[Color Plugin] Компонент "color_plugin" успішно додано');
        } else {
            console.log('[Color Plugin] Компонент "color_plugin" вже існує');
        }

        // Запускаємо основну ініціалізацію з color_plugin_init.js
        initPlugin();
        console.log('[Color Plugin] Викликано initPlugin()');

        // Примусове оновлення меню налаштувань
        if (Lampa.Settings && Lampa.Settings.main && typeof Lampa.Settings.main().render === 'function') {
            Lampa.Settings.main().render();
            console.log('[Color Plugin] Викликано Lampa.Settings.main().render()');
        }
    }

    // Запускаємо завантаження модулів
    if (window.appready) {
        console.log('[Color Plugin] window.appready вже true — починаємо завантаження');
        loadNextModule(0);
    } else {
        console.log('[Color Plugin] Чекаємо події app ready');
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                console.log('[Color Plugin] Отримано подію app ready — починаємо завантаження');
                loadNextModule(0);
            }
        });
    }

})();
