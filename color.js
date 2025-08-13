(function () {
    'use strict';

    Lampa.Lang.add({
        accent_color: {
            ru: 'Колір акценту',
            en: 'Accent color',
            uk: 'Колір акценту'
        }
    });

    function applyAccentColor(hue) {
        var color = 'hsl(' + hue + ', 60%, 50%)'; // Фіксовані Saturation і Lightness
        document.documentElement.style.setProperty('--main-color', color);
        Lampa.Storage.set('accent_color_selected', color);
    }

    function initColorPicker() {
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
                applyAccentColor(value);
                Lampa.Settings.update();
            },
            onRender: function (item) {
                var color = Lampa.Storage.get('accent_color_selected', '#5daa68');
                item.find('.settings-param__descr div').css('background-color', color);
            }
        });

        // Застосовуємо збережений колір
        var savedColor = Lampa.Storage.get('accent_color_selected', '#5daa68');
        document.documentElement.style.setProperty('--main-color', savedColor);
    }

    if (window.appready) {
        initColorPicker();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                initColorPicker();
            }
        });
    }
})();
