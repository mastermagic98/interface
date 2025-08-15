(function () {
    'use strict';

    Lampa.Lang.add({
        accent_color: {
            ru: 'Выбор цвета акцента',
            en: 'Select accent color',
            uk: 'Вибір кольору акценту'
        },
        accent_color_on: {
            ru: 'Включить',
            en: 'Enable',
            uk: 'Увімкнути'
        }
    });

    var colors = {
        '#c22222': 'Червоний',
        '#4caf50': 'Зелений',
        '#6a1b9a': 'Фіолетовий',
        '#ffeb3b': 'Жовтий',
        '#4d7cff': 'Синій',
        '#a64dff': 'Пурпурний',
        '#ff9f4d': 'Помаранчевий',
        '#3da18d': 'М’ятний',
        '#ff69b4': 'Рожевий',
        '#26a69a': 'Бірюзовий'
    };

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
        style.textContent = '.color_row { display: grid; grid-template-columns: repeat(5, 1fr); grid-auto-rows: 80px; gap: 15px; justify-items: center; width: 100%; padding: 10px; }' +
                            '.color_square { display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; border-radius: 8px; cursor: pointer; }' +
                            '.color_square.focus { border: 2px solid #fff; transform: scale(1.1); }' +
                            '.selector.focus, .button--category { background-color: var(--main-color) !important; }' +
                            '.settings-param__name, .settings-folder__name { color: var(--main-color) !important; }';
        document.head.appendChild(style);
    }

    function createColorHtml(color, name) {
        return '<div class="color_square selector" tabindex="0" style="background-color: ' + color + ';" title="' + name + '"></div>';
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
                name: Lampa.Lang.translate('accent_color'),
                icon: '<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.003a7 7 0 0 0-7 7v.43c.09 1.51 1.91 1.79 3 .7a1.87 1.87 0 0 1 2.64 2.64c-1.1 1.16-.79 3.07.8 3.2h.6a7 7 0 1 0 0-14l-.04.03zm0 13h-.52a.58.58 0 0 1-.36-.14.56.56 0 0 1-.15-.3 1.24 1.24 0 0 1 .35-1.08 2.87 2.87 0 0 0 0-4 2.87 2.87 0 0 0-4.06 0 1 1 0 0 1-.9.34.41.41 0 0 1-.22-.12.42.42 0 0 1-.1-.29v-.37a6 6 0 1 1 6 6l-.04-.04zM9 3.997a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 7.007a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-7-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM13 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg>'
            });

            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
                param: {
                    name: 'accent_color_active',
                    type: 'trigger',
                    default: false
                },
                field: {
                    name: Lampa.Lang.translate('accent_color_on')
                },
                onChange: function (item) {
                    var selectItem = $('.settings-param[data-name="select_accent_color"]');
                    if (selectItem.length) {
                        selectItem.css('display', item === 'true' ? 'block' : 'none');
                    }
                    Lampa.Settings.render();
                }
            });

            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
                param: {
                    name: 'select_accent_color',
                    type: 'button'
                },
                field: {
                    name: '<div class="settings-folder__icon" style="display: inline-block; vertical-align: middle; width: 23px; height: 24px; margin-right: 10px;"><svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.003a7 7 0 0 0-7 7v.43c.09 1.51 1.91 1.79 3 .7a1.87 1.87 0 0 1 2.64 2.64c-1.1 1.16-.79 3.07.8 3.2h.6a7 7 0 1 0 0-14l-.04.03zm0 13h-.52a.58.58 0 0 1-.36-.14.56.56 0 0 1-.15-.3 1.24 1.24 0 0 1 .35-1.08 2.87 2.87 0 0 0 0-4 2.87 2.87 0 0 0-4.06 0 1 1 0 0 1-.9.34.41.41 0 0 1-.22-.12.42.42 0 0 1-.1-.29v-.37a6 6 0 1 1 6 6l-.04-.04zM9 3.997a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 7.007a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-7-5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm7-1a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM13 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/></svg></div>' + Lampa.Lang.translate('accent_color'),
                    description: '<div style="width: 2em; height: 2em; background-color: ' + Lampa.Storage.get('accent_color_selected', '#5daa68') + '; display: inline-block; border: 1px solid #fff;"></div>'
                },
                onRender: function (item) {
                    if (!Lampa.Storage.get('accent_color_active')) {
                        item.css('display', 'none');
                    } else {
                        item.css('display', 'block');
                    }
                    var color = Lampa.Storage.get('accent_color_selected', '#5daa68');
                    document.documentElement.style.setProperty('--main-color', color);
                    var descr = item.find('.settings-param__descr div');
                    if (descr.length) {
                        descr.css('background-color', color);
                    }
                },
                onChange: function () {
                    createColorModal();
                    var colorKeys = Object.keys(colors);
                    var groupedColors = chunkArray(colorKeys, 5);
                    var color_content = groupedColors.map(function (group) {
                        var groupContent = group.map(function (color) {
                            return createColorHtml(color, colors[color]);
                        }).join('');
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

        Lampa.Storage.listener.follow('change', function (e) {
            if (e.name === 'accent_color_active') {
                var selectItem = $('.settings-param[data-name="select_accent_color"]');
                if (selectItem.length) {
                    selectItem.css('display', Lampa.Storage.get('accent_color_active') ? 'block' : 'none');
                }
                Lampa.Settings.render();
            }
        });
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
