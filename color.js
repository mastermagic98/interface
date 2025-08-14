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
        '#ff4d4d', // Червоний
        '#ff8c00', // Помаранчевий
        '#ffd700', // Жовтий
        '#00cc00', // Зелений
        '#00cccc', // Бірюзовий
        '#4169e1', // Синій
        '#9933ff', // Фіолетовий
        '#ff66cc', // Рожевий
        '#cc0066', // Малиновий
        '#ff4040', // Кораловий
        '#99ff33', // Лаймовий
        '#3399ff'  // Блакитний
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
        var event = new Event('style-change');
        document.documentElement.dispatchEvent(event);
        console.log('Колір змінено на: ' + hexColor);
        Lampa.Settings.update();
        var descr = $('.settings-param__descr div');
        if (descr.length) {
            descr.css('background-color', hexColor);
        }
    }

    function createColorModal() {
        var style = document.createElement('style');
        style.id = 'colormodal';
        style.textContent = '.color_row { display: grid; grid-template-columns: repeat(6, 1fr); grid-auto-rows: 80px; gap: 15px; justify-items: center; width: 100%; padding: 10px; }' +
                            '.color_square { display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; border-radius: 8px; cursor: pointer; }' +
                            '.color_square.focus { border: 2px solid #fff; transform: scale(1.1); }';
        document.head.appendChild(style);
        console.log('Стилі для модального вікна кольорів створено');
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
        console.log('Ініціалізація color.js');
        Lampa.Template.add('settings', '<div class="settings"></div>');
        Lampa.Template.add('settings_', '<div class="settings"></div>');
        try {
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
                    item.find('.settings-param__descr div').css('background-color', color);
                    console.log('Рендеринг кнопки вибору кольору, поточний колір: ' + color);
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
                                Lampa.Controller.enable('menu'); // Повернення фокусу до меню
                            },
                            onSelect: function (a) {
                                Lampa.Modal.close();
                                Lampa.Controller.toggle('settings_component');
                                Lampa.Controller.enable('menu'); // Повернення фокусу до меню
                                if (a.length > 0 && a[0] instanceof HTMLElement) {
                                    var color = a[0].style.backgroundColor;
                                    if (color) {
                                        applyAccentColor(color);
                                        console.log('Вибрано колір: ' + color);
                                    } else {
                                        console.error('Колір не визначено для елемента');
                                    }
                                } else {
                                    console.error('Некоректний вибір елемента');
                                }
                            }
                        });
                        console.log('Модальне вікно кольорів відкрито, відображено ' + colors.length + ' кольорів');
                    } catch (e) {
                        console.error('Помилка відкриття модального вікна кольорів: ' + e.message);
                    }
                }
            });
            console.log('Кнопка вибору кольору додана до accent_color_plugin');
        } catch (e) {
            console.error('Помилка додавання кнопки вибору кольору: ' + e.message);
        }

        var savedColor = Lampa.Storage.get('accent_color_selected', '#5daa68');
        document.documentElement.style.setProperty('--main-color', savedColor);
        console.log('Застосовано збережений колір: ' + savedColor);
        Lampa.Settings.update();
    }

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
