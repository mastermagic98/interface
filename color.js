(function () {
    'use strict';

    // Додаємо переклади
    Lampa.Lang.add({
        accent_color: {
            ru: 'Цвет акцента',
            en: 'Accent color',
            uk: 'Колір акценту'
        }
    });

    function applyAccentColor(hue) {
        var color = 'hsl(' + hue + ', 60%, 50%)';
        document.documentElement.style.setProperty('--main-color', color);
        Lampa.Storage.set('accent_color_selected', color);
        // Викликаємо подію для оновлення анімації
        var event = new Event('style-change');
        document.documentElement.dispatchEvent(event);
        console.log('Колір змінено на: ' + color); // Діагностика
    }

    function initColorPicker() {
        console.log('Ініціалізація color.js'); // Діагностика
        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: {
                name: 'accent_color_hue',
                type: 'range',
                min: 0,
                max: 360,
                step: 1,
                default: 136 // Відповідає #5daa68
            },
            field: {
                name: Lampa.Lang.translate('accent_color'),
                description: '<div style="width: 2em; height: 2em; background-color: ' + Lampa.Storage.get('accent_color_selected', '#5daa68') + '; display: inline-block;"></div>'
            },
            onChange: function (value) {
                console.log('Обрано відтінок: ' + value); // Діагностика
                applyAccentColor(value);
                Lampa.Settings.update();
            },
            onRender: function (item) {
                var color = Lampa.Storage.get('accent_color_selected', '#5daa68');
                item.find('.settings-param__descr div').css('background-color', color);
                console.log('Рендеринг повзунка кольору, поточний колір: ' + color); // Діагностика
            }
        });

        // Застосовуємо збережений колір
        var savedColor = Lampa.Storage.get('accent_color_selected', '#5daa68');
        document.documentElement.style.setProperty('--main-color', savedColor);
        console.log('Застосовано збережений колір: ' + savedColor); // Діагностика
    }

    if (window.appready) {
        initColorPicker();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                console.log('Lampa готова, ініціалізація color.js'); // Діагностика
                initColorPicker();
            }
        });
    }
})();
