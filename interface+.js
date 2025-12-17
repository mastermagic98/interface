(function () {
    'use strict';

    // Додаємо переклад для назви плагіна
    Lampa.Lang.add({
        custom_interface_plugin: {
            ru: 'Кастомізація інтерфейсу',
            en: 'Customization interface',
            uk: 'Кастомізація інтерфейсу'
        }
    });

    // Список модулів для підключення
    var modules = [
        'https://mastermagic98.github.io/interface/attention.js', // попереджає про відсутність на балансера чи на торентах
        'https://mastermagic98.github.io/interface/cardify.js', // додати кнопку увімкнути
        'https://mastermagic98.github.io/interface/color.js',
        'https://mastermagic98.github.io/interface/aloader.js',
        'https://mastermagic98.github.io/interface/loaders.js',
        'https://mastermagic98.github.io/interface/animations.js',
        'https://mastermagic98.github.io/interface/incardtemplate.js',
        'https://mastermagic98.github.io/interface/fix_lang.js'
    ];

    // Асинхронне підключення модулів
    modules.forEach(function (url) {
        Lampa.Utils.putScriptAsync([url], function () {
            console.log('Модуль завантажено: ' + url);
        }, function () {
            console.error('Помилка завантаження модуля: ' + url);
        });
    });

    // Функція ініціалізації плагіна
    function startPlugin() {
        console.log('Ініціалізація плагіну custom_interface_plugin');

        // Додаємо шаблони для налаштувань (якщо потрібні в майбутньому)
        Lampa.Template.add('settings', '<div class="settings"></div>');
        Lampa.Template.add('settings_', '<div class="settings"></div>');

        try {
            // Додаємо компонент до меню налаштувань
            Lampa.SettingsApi.addComponent({
                component: 'custom_interface_plugin',
                name: Lampa.Lang.translate('custom_interface_plugin'),
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 14 14"><g fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H1a.5.5 0 0 0-.5.5v8a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5v-8A.5.5 0 0 0 13 2m-7 9l-1 2.5M8 11l1 2.5m-5 0h6M7.5 2v9M3 5h2M3 8h1"/><path d="m7.5 7l1.21-1a2 2 0 0 1 2.55 0l2.24 2"/></g></svg>'
            });
            console.log('Компонент custom_interface_plugin додано');
        } catch (e) {
            console.error('Помилка додавання custom_interface_plugin: ' + e.message);
        }

        // Оновлюємо налаштування
        Lampa.Settings.render();
    }

    // Запускаємо плагін після готовності програми
    if (window.appready) {
        console.log('Lampa готова, запуск плагіну');
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                console.log('Lampa готова, запуск плагіну');
                startPlugin();
            }
        });
    }

    // Опис маніфесту плагіна
    Lampa.Manifest.plugins = {
        name: 'custom_interface_plugin',
        version: '1.0.0',
        description: 'Customization interface'
    };
})();
