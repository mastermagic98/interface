(function () {
    'use strict';

    // Додаємо переклади для плагіна
    Lampa.Lang.add({
        color_plugin_name: {
            ru: 'Цветовая схема',
            en: 'Color scheme',
            uk: 'Кольорова схема'
        },
        color_plugin_enabled: {
            ru: 'Включить плагин',
            en: 'Enable plugin',
            uk: 'Увімкнути плагін'
        },
        color_plugin_select: {
            ru: 'Выбрать цвет',
            en: 'Select color',
            uk: 'Вибрати колір'
        },
        color_plugin_reset: {
            ru: 'Сбросить цвет',
            en: 'Reset color',
            uk: 'Скинути колір'
        }
    });

    // Функція для перевірки коректності HEX-кольору
    function isValidHex(hex) {
        return /^#[0-9A-F]{6}$/i.test(hex);
    }

    // Функція для отримання основного кольору
    function getMainColor() {
        var isColorPluginEnabled = Lampa.Storage.get('color_plugin_enabled', 'true') === 'true';
        var mainColor = isColorPluginEnabled ? Lampa.Storage.get('color_plugin_main_color', '#353535') : '#353535';
        return isValidHex(mainColor) ? mainColor : '#353535';
    }

    // Функція для створення стилів
    function createColorStyles() {
        var style = document.createElement('style');
        style.id = 'color-plugin';
        var mainColor = getMainColor();
        var focusBorderColor = mainColor === '#353535' ? '#ffffff' : 'var(--main-color)';
        var rootStyle = ':root { --main-color: ' + mainColor + ' !important; --accent-color: ' + mainColor + ' !important; }';
        style.textContent = rootStyle +
                           '.selector.focus { border-color: var(--accent-color) !important; background-color: var(--accent-color) !important; }' +
                           '.menu__ico { fill: ' + mainColor + ' !important; }' +
                           '.menu__ico.focus { fill: ' + mainColor + ' !important; }' +
                           '.color_square { width: 35px; height: 35px; border-radius: 4px; cursor: pointer; }' +
                           '.color_square.focus { border: 0.3em solid ' + focusBorderColor + ' !important; transform: scale(1.1); }' +
                           '.hex-input { width: 410px; height: 35px; border-radius: 8px; border: 2px solid #ddd; position: relative; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff !important; font-size: 12px; font-weight: bold; text-shadow: 0 0 2px #000; background-color: #353535; }' +
                           '.hex-input.focus { border: 0.3em solid ' + focusBorderColor + ' !important; transform: scale(1.1); }' +
                           '.hex-input .label { position: absolute; top: 1px; font-size: 10px; }' +
                           '.hex-input .value { position: absolute; bottom: 1px; font-size: 10px; }';
        document.head.appendChild(style);
    }

    // Основна функція ініціалізації плагіна
    function initColorPlugin() {
        try {
            // Додаємо компонент до меню налаштувань
            Lampa.SettingsApi.addComponent({
                component: 'color_plugin_menu',
                name: Lampa.Lang.translate('color_plugin_name'),
                icon: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><circle cx="12" cy="12" r="10"/></svg>'
            });
        } catch (e) {}

        try {
            // Додаємо параметр увімкнення/вимкнення плагіна
            Lampa.SettingsApi.addParam({
                component: 'color_plugin_menu',
                param: {
                    name: 'color_plugin_enabled',
                    type: 'trigger',
                    default: true
                },
                field: {
                    name: Lampa.Lang.translate('color_plugin_enabled')
                },
                onChange: function (value) {
                    createColorStyles();
                    Lampa.Settings.render();
                }
            });
        } catch (e) {}

        try {
            // Додаємо параметр вибору кольору
            Lampa.SettingsApi.addParam({
                component: 'color_plugin_menu',
                param: {
                    name: 'color_plugin_select',
                    type: 'button'
                },
                field: {
                    name: Lampa.Lang.translate('color_plugin_select')
                },
                onRender: function (item) {
                    if (!Lampa.Storage.get('color_plugin_enabled')) {
                        item.css('display', 'none');
                    } else {
                        item.css('display', 'block');
                    }
                },
                onChange: function () {
                    var colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#353535'];
                    var modalContent = '<div style="display: flex; flex-wrap: wrap; gap: 30px; justify-content: center;">';
                    colors.forEach(function(color) {
                        modalContent += '<div class="color_square selector" style="background-color: ' + color + ';" tabindex="0"></div>';
                    });
                    modalContent += '<div class="hex-input selector" tabindex="0" style="width: 410px;"><div class="label">Введіть HEX-код</div><div class="value">' + Lampa.Storage.get('color_plugin_main_color', '#353535') + '</div></div>';
                    modalContent += '</div>';

                    Lampa.Modal.open({
                        title: Lampa.Lang.translate('color_plugin_select'),
                        size: 'medium',
                        align: 'center',
                        html: $('<div>' + modalContent + '</div>'),
                        onBack: function () {
                            Lampa.Modal.close();
                            Lampa.Controller.toggle('settings_component');
                            Lampa.Controller.enable('menu');
                        },
                        onSelect: function (a) {
                            if (a.length > 0 && a[0] instanceof HTMLElement) {
                                var selectedElement = a[0];
                                if (selectedElement.classList.contains('hex-input')) {
                                    Lampa.Modal.close();
                                    var inputOptions = {
                                        name: 'color_plugin_main_color',
                                        value: Lampa.Storage.get('color_plugin_main_color', '#353535'),
                                        placeholder: '#FFFFFF'
                                    };
                                    Lampa.Input.edit(inputOptions, function (value) {
                                        if (!isValidHex(value)) {
                                            Lampa.Noty.show('Невірний формат HEX-коду. Використовуйте формат #FFFFFF.');
                                            Lampa.Controller.toggle('settings_component');
                                            Lampa.Controller.enable('menu');
                                            return;
                                        }
                                        Lampa.Storage.set('color_plugin_main_color', value);
                                        localStorage.setItem('color_plugin_main_color', value);
                                        createColorStyles();
                                        Lampa.Controller.toggle('settings_component');
                                        Lampa.Controller.enable('menu');
                                        Lampa.Settings.render();
                                    });
                                } else {
                                    var color = selectedElement.style.backgroundColor;
                                    var hexColor = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
                                    if (hexColor) {
                                        hexColor = '#' + ('0' + parseInt(hexColor[1]).toString(16)).slice(-2) +
                                                  ('0' + parseInt(hexColor[2]).toString(16)).slice(-2) +
                                                  ('0' + parseInt(hexColor[3]).toString(16)).slice(-2);
                                        Lampa.Storage.set('color_plugin_main_color', hexColor);
                                        localStorage.setItem('color_plugin_main_color', hexColor);
                                        createColorStyles();
                                    }
                                    Lampa.Modal.close();
                                    Lampa.Controller.toggle('settings_component');
                                    Lampa.Controller.enable('menu');
                                    Lampa.Settings.render();
                                }
                            }
                        }
                    });
                }
            });
        } catch (e) {}

        try {
            // Додаємо параметр скидання кольору
            Lampa.SettingsApi.addParam({
                component: 'color_plugin_menu',
                param: {
                    name: 'color_plugin_reset',
                    type: 'button'
                },
                field: {
                    name: Lampa.Lang.translate('color_plugin_reset')
                },
                onChange: function () {
                    Lampa.Storage.set('color_plugin_main_color', '#353535');
                    localStorage.setItem('color_plugin_main_color', '#353535');
                    createColorStyles();
                    Lampa.Settings.render();
                }
            });
        } catch (e) {}

        // Слухач зміни кольору або стану плагіна
        Lampa.Storage.listener.follow('change', function (e) {
            if (e.name === 'color_plugin_main_color' || e.name === 'color_plugin_enabled') {
                createColorStyles();
            }
        });

        // Ініціалізація стилів при завантаженні
        createColorStyles();
    }

    // Запускаємо плагін після готовності програми
    if (window.appready) {
        initColorPlugin();
    } else {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') {
                initColorPlugin();
            }
        });
    }
})();
