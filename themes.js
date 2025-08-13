(function () {
    'use strict';

    // Додаємо переклади для трьох мов
    Lampa.Lang.add({
        accent_color_plugin: {
            ru: 'Налаштування акцентного кольору',
            en: 'Accent color settings',
            uk: 'Налаштування кольору акценту'
        }
    });

    // Список модулів
    var modules = [
        'https://your-host.com/color.js', // Зміна кольору акценту
        'https://your-host.com/aloader.js', // Анімація завантажувача
        'https://your-host.com/animations.js', // Анімації
        'https://your-host.com/translate_tv.js', // Переклад TV
        'https://your-host.com/bigbuttons.js', // Великі кнопки
        'https://your-host.com/incardtemplate.js', // Шаблон картки
        'https://your-host.com/forall.js', // Загальні стилі
        'https://your-host.com/fix_lang.js' // Виправлення перекладів
    ];

    // Підключаємо модулі
    modules.forEach(function (url) {
        Lampa.Utils.putScriptAsync([url], function () {});
    });

    // Ініціалізація плагіну
    function startPlugin() {
        // Додаємо компонент у меню налаштувань
        Lampa.SettingsApi.addComponent({
            component: 'accent_color_plugin',
            name: Lampa.Lang.translate('accent_color_plugin'),
            icon: '<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="..." fill="#fff"></path></svg>' // Іконка з maxsm_themes
        });

        // Застосовуємо збережений колір
        var savedColor = Lampa.Storage.get('accent_color_selected', '#5daa68');
        document.documentElement.style.setProperty('--main-color', savedColor);
    }

    // Запускаємо плагін
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                startPlugin();
            }
        });
    }

    // Реєструємо плагін у маніфесті
    Lampa.Manifest.plugins = {
        name: 'accent_color_plugin',
        version: '1.0.0',
        description: 'Accent color and loader customization'
    };
})();
