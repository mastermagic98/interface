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
        },
        background_color: {
            ru: 'Выбор цвета фона',
            en: 'Select background color',
            uk: 'Вибір кольору фону'
        },
        background_color_on: {
            ru: 'Включить',
            en: 'Enable',
            uk: 'Увімкнути'
        },
        icon_color: {
            ru: 'Цвет иконок',
            en: 'Icon color',
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

    var accentColors = {
        '#6a11cb': 'Фіолетово-синій',
        '#3da18d': 'М’ятний',
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
        'white': '#fff',
        'black': '#000'
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
        var descr = $('.settings-param[data-name="select_accent_color"] .settings-param__descr div');
        if (descr.length) {
            descr.css('background-color', hexColor);
        }
        setTimeout(function () {
            Lampa.Settings.render();
        }, 0);
    }

    function applyBackgroundColor(color) {
        var hexColor = color.includes('rgb') ? rgbToHex(color) : color;
        document.documentElement.style.setProperty('--background-color', hexColor);
        Lampa.Storage.set('background_color_selected', hexColor);
        var descr = $('.settings-param[data-name="select_background_color"] .settings-param__descr div');
        if (descr.length) {
            descr.css('background-color', hexColor);
        }
        setTimeout(function () {
            Lampa.Settings.render();
        }, 0);
    }

    function applyIconColor(color) {
        var hexColor = iconColors[color] || '#fff';
        document.documentElement.style.setProperty('--icon-color', hexColor);
        Lampa.Storage.set('icon_color_selected', color);
        setTimeout(function () {
            Lampa.Settings.render();
        }, 0);
    }

    function createColorModal() {
        var iconColor = Lampa.Storage.get('icon_color_selected', 'white');
        var style = document.createElement('style');
        style.id = 'colormodal';
        style.textContent = ':root { --main-color: #5daa68; --background-color: #1d1f20; --text-color: #ddd; --transparent-white: rgba(255,255,255,0.2); --icon-color: ' + (iconColors[iconColor] || '#fff') + '; }' +
                            'html, body, .extensions { background: var(--background-color); color: var(--text-color); }' +
                            '.menu__item { color: #ddd !important; }' +
                            // Стиль для всіх іконок, крім "Налаштування": задаємо колір із --icon-color, прибираємо обведення
                            '.menu__ico:not([data-action="settings"] .menu__ico), .menu__ico:not([data-action="settings"] .menu__ico) svg, .menu__ico:not([data-action="settings"] .menu__ico) path, .menu__ico:not([data-action="settings"] .menu__ico) g { background: transparent !important; color: var(--icon-color) !important; stroke: none !important; stroke-width: 0 !important; }' +
                            '.menu__ico.focus:not([data-action="settings"] .menu__ico), .menu__ico.focus:not([data-action="settings"] .menu__ico) svg, .menu__ico.focus:not([data-action="settings"] .menu__ico) path, .menu__ico.focus:not([data-action="settings"] .menu__ico) g { background: transparent !important; color: var(--icon-color) !important; stroke: none !important; stroke-width: 0 !important; }' +
                            // Стиль для іконки "Налаштування": лише колір із --icon-color
                            'li[data-action="settings"] .menu__ico, li[data-action="settings"] .menu__ico svg, li[data-action="settings"] .menu__ico path, li[data-action="settings"] .menu__ico circle { color: var(--icon-color) !important; }' +
                            'li[data-action
