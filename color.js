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
        var event = new Event('style-change');
        document.documentElement.dispatchEvent(event);
        console.log('Колір змінено на: ' + color);
        Lampa.Settings.update();
    }

    function initColorPicker() {
        console.log('Ініціалізація color.js');
        try {
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
                    description: '<div style="width: 2em; height: 2em; background-color: ' + Lampa.Storage.get('accent_color_selected', '#5daa68') + '; display: inline-block; border: 1px solid #fff;"></div>'
                },
                onChange: function (value) {
                    console.log('Обрано відтінок: ' + value);
                    applyAccentColor(value);
                },
                onRender: function (item) {
                    var color = Lampa.Storage.get('accent_color_selected', '#5daa68');
                    item.find('.settings-param__descr div').css('background-color', color);
                    console.log('Рендеринг повзунка кольору, поточний колір: ' + color);
                }
            });
            console.log('Повзунок кольору додано до accent_color_plugin');
        } catch (e) {
            console.error('Помилка додавання повзунка кольору: ' + e.message);
        }

        var savedColor = Lampa.Storage.get('accent_color_selected', '#5daa68');
        document.documentElement.style.setProperty('--main-color', savedColor);
        console.log('Застосовано збережений колір: ' + savedColor);
        Lampa.Settings.update();
    }

    // Затримка ініціалізації для забезпечення готовності Lampa
    function delayedInit() {
        if (window.appready) {
            console.log('Lampa готова, ініціалізація color.js');
            initColorPicker();
        } else {
            var attempts = 0;
            var maxAttempts = 10;
            var interval = setInterval(function () {
                attempts++;
                if (window.appready || attempts >= maxAttempts) {
                    clearInterval(interval);
                    if (window.appready) {
                        console.log('Lampa готова після затримки, ініціалізація color.js');
                        initColorPicker();
                    } else {
                        console.error('Lampa не готова після ' + maxAttempts + ' спроб');
                    }
                }
            }, 500);
        }
    }

    if (window.appready) {
        console.log('Lampa готова, виклик delayedInit');
        delayedInit();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                console.log('Lampa готова, виклик delayedInit');
                delayedInit();
            }
        });
    }

    Lampa.Listener.follow('settings_component', function (event) {
        if (event.type === 'open') {
            console.log('Меню налаштувань відкрито, оновлення UI');
            Lampa.Settings.update();
        }
    });
})();
