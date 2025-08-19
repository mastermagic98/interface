(function() {
    'use strict';

    // Додаємо переклади
    Lampa.Lang.add({
        accent_color: {
            ru: 'Цвет акцента',
            en: 'Accent color',
            uk: 'Колір акценту'
        },
        accent_color_on: {
            ru: 'Включить',
            en: 'Enable',
            uk: 'Увімкнути'
        },
        background_color: {
            ru: 'Цвет фона',
            en: 'Background color',
            uk: 'Колір фону'
        },
        background_color_on: {
            ru: 'Включить',
            en: 'Enable',
            uk: 'Увімкнути'
        },
        icon_color: {
            ru: 'Цвет иконок',
            en: 'Icons color',
            uk: 'Колір іконок'
        },
        icon_color_white: {
            ru: 'Белый',
            en: 'White',
            uk: 'Білий'
        },
        icon_color_black: {
            ru: 'Черный',
            en: 'Black',
            uk: 'Чорний'
        }
    });

    // Палітра кольорів
    var accentColors = {
        '#6a11cb': 'Фіолетово-синій',
        '#3da18d': 'Мятний',
        '#7e7ed9': 'Глибока аврора',
        '#7ed0f9': 'Кришталево-блакитний',
        '#f4a261': 'Янтарний',
        '#f6a5b0': 'Оксамитова сакура',
        '#d32f2f': 'Яскраво-червоний',
        '#388e3c': 'Смарагдовий',
        '#7b1fa2': 'Темно-пурпурний',
        '#fbc02d': 'Сонячний',
        '#0288d1': 'Лазурний',
        '#ec407a': 'Малиновий'
    };

    var backgroundColors = {
        '#000000': 'Чорний',
        '#1d1f20': 'Темно-сірий',
        '#0a1b2a': 'Темно-синій',
        '#081822': 'Глибокий синій',
        '#1a102b': 'Темно-фіолетовий',
        '#1f0e04': 'Темно-коричневий',
        '#4b0e2b': 'Темно-рожевий',
        '#121212': 'Майже чорний',
        '#1c2526': 'Темно-зелений',
        '#2a1c3a': 'Темно-пурпурний',
        '#0d1a2f': 'Темно-блакитний',
        '#2f1c1c': 'Темно-червоний'
    };

    var iconColors = {
        'white': '#ffffff',
        'black': '#000000'
    };

    // Функція для застосування кольору акценту
    function applyAccentColor(color) {
        document.documentElement.style.setProperty('--main-color', color);
        Lampa.Storage.set('accent_color_selected', color);
        updateColorPreviews();
        applyIconStyles();
    }

    // Функція для застосування кольору фону
    function applyBackgroundColor(color) {
        document.documentElement.style.setProperty('--background-color', color);
        Lampa.Storage.set('background_color_selected', color);
        updateColorPreviews();
        applyIconStyles();
    }

    // Функція для застосування кольору іконок
    function applyIconColor(color) {
        var hexColor = iconColors[color] || '#ffffff';
        document.documentElement.style.setProperty('--icon-color', hexColor);
        Lampa.Storage.set('icon_color_selected', color);
        applyIconStyles();
    }

    // Оновлюємо перегляди кольорів в налаштуваннях
    function updateColorPreviews() {
        var accentPreview = $('.settings-param[data-name="select_accent_color"] .settings-param__descr div');
        if (accentPreview.length) {
            accentPreview.css('background-color', Lampa.Storage.get('accent_color_selected', '#5daa68'));
        }
        
        var bgPreview = $('.settings-param[data-name="select_background_color"] .settings-param__descr div');
        if (bgPreview.length) {
            bgPreview.css('background-color', Lampa.Storage.get('background_color_selected', '#1d1f20'));
        }
    }

    // Застосовуємо стилі для іконок
    function applyIconStyles() {
        var iconColor = Lampa.Storage.get('icon_color_selected', 'white');
        var hexColor = iconColors[iconColor] || '#ffffff';
        
        // Оновлюємо CSS змінну
        document.documentElement.style.setProperty('--icon-color', hexColor);
        
        // Створюємо або оновлюємо стилі для іконок
        var styleId = 'icon-color-styles';
        var styleElement = document.getElementById(styleId) || document.createElement('style');
        styleElement.id = styleId;
        
        styleElement.textContent = `
            /* Загальні стилі для всіх іконок */
            .menu__ico,
            .menu__ico svg,
            .menu__ico path,
            .menu__ico g {
                color: var(--icon-color) !important;
                fill: var(--icon-color) !important;
                stroke: var(--icon-color) !important;
            }
            
            /* Специфічні стилі для іконки налаштувань */
            li[data-action="settings"] .menu__ico,
            li[data-action="settings"] .menu__ico svg,
            li[data-action="settings"] .menu__ico path,
            li[data-action="settings"] .menu__ico circle {
                fill: none !important;
                stroke: var(--icon-color) !important;
            }
            
            /* Стилі для іконки користувача */
            .menu__ico--person::before,
            .menu__ico--person::after {
                display: none !important;
            }
            
            .menu__ico--person,
            .menu__ico--person svg,
            .menu__ico--person path {
                fill: var(--icon-color) !important;
                stroke: none !important;
            }
        `;
        
        if (!document.getElementById(styleId)) {
            document.head.appendChild(styleElement);
        }
    }

    // Створюємо HTML для кольорового квадратика
    function createColorSquare(color, name) {
        return '<div class="color-square selector" tabindex="0" style="background-color: ' + color + ';" title="' + name + '"></div>';
    }

    // Ініціалізація плагіна
    function initColorPlugin() {
        // Додаємо компонент в налаштування
        Lampa.SettingsApi.addComponent({
            component: 'color_theme',
            name: Lampa.Lang.translate('accent_color'),
            icon: '<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3Z"/></svg>'
        });

        // Налаштування кольору акценту
        Lampa.SettingsApi.addParam({
            component: 'color_theme',
            param: {
                name: 'accent_color_enabled',
                type: 'trigger',
                default: false
            },
            field: {
                name: Lampa.Lang.translate('accent_color_on')
            },
            onChange: function(value) {
                $('.settings-param[data-name="select_accent_color"]').toggle(value === 'true');
                applyIconStyles();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'color_theme',
            param: {
                name: 'select_accent_color',
                type: 'button'
            },
            field: {
                name: Lampa.Lang.translate('accent_color'),
                description: '<div style="width:20px;height:20px;background:' + (Lampa.Storage.get('accent_color_selected') || '#5daa68') + ';display:inline-block;border:1px solid #ddd;"></div>'
            },
            onRender: function(element) {
                element.toggle(Lampa.Storage.get('accent_color_enabled') === 'true');
            },
            onChange: function() {
                showColorPicker('accent_color', accentColors, applyAccentColor);
            }
        });

        // Налаштування кольору фону
        Lampa.SettingsApi.addParam({
            component: 'color_theme',
            param: {
                name: 'background_color_enabled',
                type: 'trigger',
                default: false
            },
            field: {
                name: Lampa.Lang.translate('background_color_on')
            },
            onChange: function(value) {
                $('.settings-param[data-name="select_background_color"]').toggle(value === 'true');
                applyIconStyles();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'color_theme',
            param: {
                name: 'select_background_color',
                type: 'button'
            },
            field: {
                name: Lampa.Lang.translate('background_color'),
                description: '<div style="width:20px;height:20px;background:' + (Lampa.Storage.get('background_color_selected') || '#1d1f20') + ';display:inline-block;border:1px solid #ddd;"></div>'
            },
            onRender: function(element) {
                element.toggle(Lampa.Storage.get('background_color_enabled') === 'true');
            },
            onChange: function() {
                showColorPicker('background_color', backgroundColors, applyBackgroundColor);
            }
        });

        // Налаштування кольору іконок
        Lampa.SettingsApi.addParam({
            component: 'color_theme',
            param: {
                name: 'icon_color',
                type: 'select',
                values: {
                    'white': Lampa.Lang.translate('icon_color_white'),
                    'black': Lampa.Lang.translate('icon_color_black')
                },
                default: 'white'
            },
            field: {
                name: Lampa.Lang.translate('icon_color')
            },
            onChange: function(value) {
                applyIconColor(value);
            }
        });

        // Відновлюємо збережені налаштування
        var savedAccent = Lampa.Storage.get('accent_color_selected');
        var savedBg = Lampa.Storage.get('background_color_selected');
        var savedIcon = Lampa.Storage.get('icon_color_selected', 'white');

        if (savedAccent) applyAccentColor(savedAccent);
        if (savedBg) applyBackgroundColor(savedBg);
        applyIconColor(savedIcon);
    }

    // Показуємо вибір кольору
    function showColorPicker(type, colors, callback) {
        var colorGrid = Object.keys(colors).map(function(color) {
            return createColorSquare(color, colors[color]);
        }).join('');

        var modal = $('<div class="color-picker-modal"><div class="color-grid">' + colorGrid + '</div></div>');

        Lampa.Modal.open({
            title: Lampa.Lang.translate(type),
            html: modal,
            size: 'medium',
            onBack: function() {
                Lampa.Modal.close();
            },
            onSelect: function(elements) {
                if (elements.length && elements[0].style.backgroundColor) {
                    callback(elements[0].style.backgroundColor);
                    Lampa.Modal.close();
                }
            }
        });
    }

    // Запускаємо плагін після готовності додатка
    if (window.appready) {
        initColorPlugin();
    } else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') initColorPlugin();
        });
    }

    // Слідкуємо за змінами в налаштуваннях
    Lampa.Listener.follow('change', function(e) {
        if (e.name === 'accent_color_enabled') {
            $('.settings-param[data-name="select_accent_color"]').toggle(e.value === 'true');
        }
        else if (e.name === 'background_color_enabled') {
            $('.settings-param[data-name="select_background_color"]').toggle(e.value === 'true');
        }
    });

})();
