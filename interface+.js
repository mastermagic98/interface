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
            // Додаємо новий розділ у Налаштуваннях згідно зі зразком
            Lampa.SettingsApi.addComponent({
                component: 'interface_customization',
                icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" x2="21" y1="9" y2="9"></line><line x1="3" x2="21" y1="15" y2="15"></line><line x1="9" x2="9" y1="9" y2="21"></line><line x1="15" x2="15" y1="9" y2="21"></line></svg>',
                name: Lampa.Lang.translate('custom_interface_plugin')
            });

            console.log('Компонент interface_customization додано до налаштувань');
        } catch (e) {
            console.error('Помилка додавання компонента interface_customization: ' + e.message);
        }

        // Оновлюємо відображення налаштувань (не завжди обов’язково, але корисно)
        if (Lampa.Settings && Lampa.Settings.main) {
            Lampa.Settings.main().render();
        }
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
