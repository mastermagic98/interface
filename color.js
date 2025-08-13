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
        'hsl(0, 60%, 50%)',   // Червоний
        'hsl(30, 60%, 50%)',  // Помаранчевий
        'hsl(60, 60%, 50%)',  // Жовтий
        'hsl(120, 60%, 50%)', // Зелений
        'hsl(180, 60%, 50%)', // Бірюзовий
        'hsl(240, 60%, 50%)', // Синій
        'hsl(270, 60%, 50%)', // Фіолетовий
        'hsl(300, 60%, 50%)', // Рожевий
        'hsl(330, 60%, 50%)', // Малиновий
        'hsl(15, 60%, 50%)',  // Кораловий
        'hsl(90, 60%, 50%)',  // Лаймовий
        'hsl(210, 60%, 50%)'  // Блакитний
    ];

    function applyAccentColor(color) {
        document.documentElement.style.setProperty('--main-color', color);
        Lampa.Storage.set('accent_color_selected', color);
        var event = new Event('style-change');
        document.documentElement.dispatchEvent(event);
        console.log('Колір змінено на: ' + color);
        // Видалено Lampa.Settings.update()
    }

    Lampa.Template.add('color_modal', '<div class="color_modal_root"><div class="color_grid">{color_content}</div></div>');

    function createColorModal() {
        var style = document.createElement('style');
        style.id = 'colormodal';
        style.textContent = '.color_row { display: grid; grid-template-columns: repeat(6, 1fr); grid-auto-rows: 80px; gap: 15px; justify-items: center; width: 100%; padding: 10px; }' +
                            '.color_square { display: flex; align-items: center; justify-content: center; width: 60px; height: 60px; border-radius: 8px; cursor: pointer; }' +
                            '.color_square.focus { border: 2px solid #fff; transform: scale(1.1); }';
        document.head.appendChild(style);
        console.log('Модальне вікно кольорів створено, кількість кольорів: ' + colors.length);
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
                    var color_templates = Lampa.Template.get('color_modal', {
                        color_content: color_content
                    });
                    try {
                        Lampa.Modal.open({
                            title: '',
                            size: 'medium',
                            align: 'center',
                            html: color_templates,
                            onBack: function () {
                                Lampa.Modal.close();
                                Lampa.Controller.toggle('settings_component');
                            },
                            onSelect: function (a) {
                                Lampa.Modal.close();
                                Lampa.Controller.toggle('settings_component');
                                if (a.length > 0 && a[0] instanceof HTMLElement) {
                                    var color = a[0].style.backgroundColor;
                                    if (color) {
                                        applyAccentColor(color);
                                        console.log('Вибрано колір: ' + color);
                                        // Оновлення опису в налаштуваннях
                                        var settingsItem = Lampa.Settings.content().find('.settings-param[data-name="select_accent_color"] .settings-param__descr div');
                                        if (settingsItem.length) {
                                            settingsItem.css('background-color', color);
                                        }
                                    } else {
                                        console.error('Колір не визначено для елемента:', a[0]);
                                    }
                                } else {
                                    console.error('Невірний елемент вибору:', a);
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
            console.log('Меню налаштувань відкрито');
            var savedColor = Lampa.Storage.get('accent_color_selected', '#5daa68');
            var settingsItem = Lampa.Settings.content().find('.settings-param[data-name="select_accent_color"] .settings-param__descr div');
            if (settingsItem.length) {
                settingsItem.css('background-color', savedColor);
            }
        }
    });
})();
