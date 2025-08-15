(function () {
    'use strict';

    Lampa.Lang.add({
        accent_color: {
            ru: 'Выбор цвета акцента',
            en: 'Select accent color',
            uk: 'Вибір кольору акценту'
        }
    });

    var colors = [
        '#ff4d4d', '#ff8c00', '#ffd700', '#00cc00', '#00cccc',
        '#4169e1', '#9933ff', '#ff66cc', '#cc0066', '#ff4040',
        '#99ff33', '#3399ff'
    ];

    function rgbToHex(rgb) {
        var matches = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (!matches) return rgb;
        function hex(n) {
            return ('0' + parseInt(n).toString(16)).slice(-2);
        }
        return '#' + hex(matches[1]) + hex(matches[2]) + hex(matches[3]);
    }

    function applyAccentColor(color) {
        var hexColor = color.includes('rgb') ? rgbToHex(color) : color;
        document.documentElement.style.setProperty('--main-color', hexColor);
        Lampa.Storage.set('accent_color_selected', hexColor);
        var descr = $('.settings-param__descr div');
        if (descr.length) {
            descr.css('background-color', hexColor);
        }
        setTimeout(function () {
            Lampa.Settings.render();
        }, 0);
    }

    function createColorModal() {
        var style = document.createElement('style');
        style.id = 'colormodal';
        style.textContent = '.color_row { display: grid; grid-template-columns: repeat(6, 1fr); grid-auto-rows: 80px; gap: 15px; justify-items: center; width: 100%; padding: 10px; }' +
                            '.color_square { display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; border-radius: 8px; cursor: pointer; }' +
                            '.color_square.focus { border: 2px solid #fff; transform: scale(1.1); }' +
                            '.selector.focus, .button--category { background-color: var(--main-color) !important; }' +
                            '.settings-param__name, .settings-folder__name { color: var(--main-color) !important; }';
        document.head.appendChild(style);
    }

    function createColorHtml(color) {
        return '<div class="color_square selector" tabindex="0" style="background-color: ' + color + ';"></div>';
    }

    function chunkArray(arr, size) {
        var result = [];
        for (var i = 0; i < arr.length; i += size) {
            result.push(arr.slice(i, i + size));
        }
        return result;
    }

    function initColorPicker() {
        Lampa.Template.add('settings', '<div class="settings"></div>');
        Lampa.Template.add('settings_', '<div class="settings"></div>');
        try {
            Lampa.SettingsApi.addComponent({
                component: 'accent_color_plugin',
                name: Lampa.Lang.translate('accent_color')
            });
            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
                param: {
                    name: 'select_accent_color',
                    type: 'button'
                },
                field: {
                    name: Lampa.Lang.translate('accent_color'),
                    description: '<div style="width: 2em; height: 2em; background-color: ' + Lampa.Storage.get('accent_color_selected', '#5daa68') + '; display: inline-block; border: 1px solid #fff;"></div>'
                },
                onRender: function (item) {
                    var color = Lampa.Storage.get('accent_color_selected', '#5daa68');
                    document.documentElement.style.setProperty('--main-color', color);
                    var descr = item.find('.settings-param__descr div');
                    if (descr.length) {
                        descr.css('background-color', color);
                    }
                },
                onChange: function () {
                    createColorModal();
                    var groupedColors = chunkArray(colors, 6);
                    var color_content = groupedColors.map(function (group) {
                        var groupContent = group.map(createColorHtml).join('');
                        return '<div class="color_row">' + groupContent + '</div>';
                    }).join('');
                    var modalHtml = $('<div class="color_modal_root">' + color_content + '</div>');
                    try {
                        Lampa.Modal.open({
                            title: Lampa.Lang.translate('accent_color'),
                            size: 'medium',
                            align: 'center',
                            html: modalHtml,
                            onBack: function () {
                                Lampa.Modal.close();
                                Lampa.Controller.toggle('settings_component');
                                Lampa.Controller.enable('menu');
                            },
                            onSelect: function (a) {
                                Lampa.Modal.close();
                                Lampa.Controller.toggle('settings_component');
                                Lampa.Controller.enable('menu');
                                if (a.length > 0 && a[0] instanceof HTMLElement) {
                                    var color = a[0].style.backgroundColor || Lampa.Storage.get('accent_color_selected', '#5daa68');
                                    applyAccentColor(color);
                                }
                            }
                        });
                    } catch (e) {}
                }
            });
        } catch (e) {}

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

    Lampa.Listener.follow('settings_component', function (event) {
        if (event.type === 'open') {
            var color = Lampa.Storage.get('accent_color_selected', '#5daa68');
            document.documentElement.style.setProperty('--main-color', color);
            Lampa.Settings.render();
        }
    });

    window.applyAccentColor = applyAccentColor;
})();
