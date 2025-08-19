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
            ru: 'Цвет иконок и текста меню',
            en: 'Menu icons and text color',
            uk: 'Колір іконок і тексту меню'
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
        'white': '#ddd',
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
        var hexColor = iconColors[color] || '#ddd';
        document.documentElement.style.setProperty('--icon-color', hexColor);
        document.documentElement.style.setProperty('--menu-color', hexColor);
        // Оновлення стилів через CSS, без примусового JavaScript
        var style = document.getElementById('colormodal');
        if (style) {
            style.textContent = `
                :root {
                    --main-color: #5daa68;
                    --background-color: #1d1f20;
                    --text-color: #ddd;
                    --transparent-white: rgba(255,255,255,0.2);
                    --icon-color: ${hexColor};
                    --menu-color: ${hexColor};
                }
                html, body, .extensions {
                    background: var(--background-color);
                    color: var(--text-color);
                }
                .menu__item {
                    color: var(--menu-color) !important;
                }
                /* Стиль для всіх іконок, крім "Налаштування" і ".menu__ico--person": задаємо лише color */
                .menu__ico:not([data-action="settings"] .menu__ico):not(.menu__ico--person),
                .menu__ico:not([data-action="settings"] .menu__ico):not(.menu__ico--person) svg,
                .menu__ico:not([data-action="settings"] .menu__ico):not(.menu__ico--person) path,
                .menu__ico:not([data-action="settings"] .menu__ico):not(.menu__ico--person) g {
                    background: transparent !important;
                    color: var(--icon-color) !important;
                    stroke: none !important;
                    stroke-width: 0 !important;
                }
                .menu__ico.focus:not([data-action="settings"] .menu__ico):not(.menu__ico--person),
                .menu__ico.focus:not([data-action="settings"] .menu__ico):not(.menu__ico--person) svg,
                .menu__ico.focus:not([data-action="settings"] .menu__ico):not(.menu__ico--person) path,
                .menu__ico.focus:not([data-action="settings"] .menu__ico):not(.menu__ico--person) g {
                    background: transparent !important;
                    color: var(--icon-color) !important;
                    stroke: none !important;
                    stroke-width: 0 !important;
                }
                /* Стиль для іконки "Налаштування": використовуємо stroke */
                li[data-action="settings"] .menu__ico,
                li[data-action="settings"] .menu__ico svg,
                li[data-action="settings"] .menu__ico path,
                li[data-action="settings"] .menu__ico circle {
                    color: var(--icon-color) !important;
                    stroke: var(--icon-color) !important;
                }
                li[data-action="settings"] .menu__ico.focus,
                li[data-action="settings"] .menu__ico.focus svg,
                li[data-action="settings"] .menu__ico.focus path,
                li[data-action="settings"] .menu__ico.focus circle {
                    color: var(--icon-color) !important;
                    stroke: var(--icon-color) !important;
                }
                /* Стиль для іконки особи: прибираємо псевдоелементи, задаємо лише color */
                .menu__ico--person::before,
                .menu__ico--person::after {
                    content: none !important;
                }
                .menu__ico--person,
                .menu__ico--person svg,
                .menu__ico--person path,
                .menu__ico--person g,
                .menu__ico--person.focus,
                .menu__ico--person.focus svg,
                .menu__ico--person.focus path,
                .menu__ico--person.focus g {
                    stroke: none !important;
                    stroke-width: 0 !important;
                    color: var(--icon-color) !important;
                }
                .menu__item,
                .menu__item.traverse,
                .menu__item.hover {
                    background: transparent !important;
                    color: var(--menu-color) !important;
                    padding: 0.9em 1.5em !important;
                    border-radius: 0 1em 1em 0 !important;
                }
                .menu__item.focus {
                    background: var(--main-color) !important;
                    color: var(--menu-color) !important;
                    transform: translateX(-0.2em);
                }
                .card.selector.focus .card__title,
                .card.selector:hover .card__title,
                .card .card__title {
                    background: transparent !important;
                    color: var(--text-color) !important;
                }
                .color_row {
                    display: grid;
                    grid-template-columns: repeat(6, 1fr);
                    grid-auto-rows: 80px;
                    gap: 15px;
                    justify-items: center;
                    width: 100%;
                    padding: 10px;
                }
                .color_square {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 60px;
                    height: 60px;
                    border-radius: 8px;
                    cursor: pointer;
                }
                .color_square.focus {
                    border: 2px solid #ddd;
                    transform: scale(1.1);
                }
                .selector.focus:not(.card__title):not(.card):not(.color_square):not(.menu__ico),
                .button--category {
                    background-color: var(--main-color) !important;
                }
                .settings-param__name,
                .settings-folder__name {
                    color: var(--text-color);
                }
                .console__tab.focus,
                .full-person.focus,
                .full-start__button.focus,
                .full-descr__tag.focus,
                .simple-button.focus,
                .head__action.focus,
                .head__action.hover,
                .player-panel .button.focus,
                .search-source.active {
                    background: var(--main-color) !important;
                    color: var(--text-color) !important;
                }
                .navigation-tabs__button.focus,
                .time-line > div,
                .player-panel__position,
                .player-panel__position > div:after {
                    background-color: var(--main-color);
                    color: var(--menu-color);
                }
                .iptv-menu__list-item.focus,
                .iptv-program__timeline > div {
                    background-color: var(--main-color) !important;
                    color: var(--menu-color) !important;
                }
                .radio-item.focus,
                .lang__selector-item.focus,
                .simple-keyboard .hg-button.focus,
                .modal__button.focus,
                .search-history-key.focus,
                .simple-keyboard-mic.focus,
                .torrent-serial__progress,
                .full-review-add.focus,
                .full-review.focus,
                .tag-count.focus,
                .settings-folder.focus,
                .settings-param.focus,
                .selectbox-item.focus,
                .selectbox-item.hover {
                    background: var(--main-color);
                    color: var(--menu-color);
                }
                .online.focus {
                    box-shadow: 0 0 0 0.2em var(--main-color);
                }
                .online_modss.focus::after,
                .online-prestige.focus::after,
                .radio-item.focus .radio-item__imgbox:after,
                .iptv-channel.focus::before,
                .iptv-channel.last--focus::before {
                    border-color: var(--main-color) !important;
                }
                .card-more.focus .card-more__box::after,
                .explorer-card__head-img.focus::after {
                    border: 0.3em solid var(--main-color);
                }
                .iptv-playlist-item.focus::after,
                .iptv-playlist-item.hover::after,
                .ad-bot.focus .ad-bot__content::after,
                .ad-bot.hover .ad-bot__content::after,
                .card-episode.focus .full-episode::after,
                .register.focus::after,
                .season-episode.focus::after,
                .full-episode.focus::after,
                .full-review-add.focus::after,
                .card.focus .card__view::after,
                .card.hover .card__view::after,
                .extensions__item.focus:after,
                .torrent-item.focus::after,
                .extensions__block-add.focus:after {
                    border-color: var(--main-color);
                }
                .broadcast__scan > div,
                .broadcast__device.focus {
                    background-color: var(--main-color);
                    color: var(--menu-color);
                }
                .card:hover .card__img,
                .card.focus .card__img {
                    border-color: var(--main-color);
                }
                .noty,
                .radio-player.focus {
                    background: var(--main-color);
                    color: var(--menu-color);
                }
            `;
        }
        setTimeout(function () {
            Lampa.Settings.render();
        }, 0);
    }

    function createColorModal() {
        var iconColor = Lampa.Storage.get('icon_color_selected', 'white');
        var style = document.createElement('style');
        style.id = 'colormodal';
        style.textContent = `
            :root {
                --main-color: #5daa68;
                --background-color: #1d1f20;
                --text-color: #ddd;
                --transparent-white: rgba(255,255,255,0.2);
                --icon-color: ${iconColors[iconColor] || '#ddd'};
                --menu-color: ${iconColors[iconColor] || '#ddd'};
            }
            html, body, .extensions {
                background: var(--background-color);
                color: var(--text-color);
            }
            .menu__item {
                color: var(--menu-color) !important;
            }
            /* Стиль для всіх іконок, крім "Налаштування" і ".menu__ico--person": задаємо лише color */
            .menu__ico:not([data-action="settings"] .menu__ico):not(.menu__ico--person),
            .menu__ico:not([data-action="settings"] .menu__ico):not(.menu__ico--person) svg,
            .menu__ico:not([data-action="settings"] .menu__ico):not(.menu__ico--person) path,
            .menu__ico:not([data-action="settings"] .menu__ico):not(.menu__ico--person) g {
                background: transparent !important;
                color: var(--icon-color) !important;
                stroke: none !important;
                stroke-width: 0 !important;
            }
            .menu__ico.focus:not([data-action="settings"] .menu__ico):not(.menu__ico--person),
            .menu__ico.focus:not([data-action="settings"] .menu__ico):not(.menu__ico--person) svg,
            .menu__ico.focus:not([data-action="settings"] .menu__ico):not(.menu__ico--person) path,
            .menu__ico.focus:not([data-action="settings"] .menu__ico):not(.menu__ico--person) g {
                background: transparent !important;
                color: var(--icon-color) !important;
                stroke: none !important;
                stroke-width: 0 !important;
            }
            /* Стиль для іконки "Налаштування": використовуємо stroke */
            li[data-action="settings"] .menu__ico,
            li[data-action="settings"] .menu__ico svg,
            li[data-action="settings"] .menu__ico path,
            li[data-action="settings"] .menu__ico circle {
                color: var(--icon-color) !important;
                stroke: var(--icon-color) !important;
            }
            li[data-action="settings"] .menu__ico.focus,
            li[data-action="settings"] .menu__ico.focus svg,
            li[data-action="settings"] .menu__ico.focus path,
            li[data-action="settings"] .menu__ico.focus circle {
                color: var(--icon-color) !important;
                stroke: var(--icon-color) !important;
            }
            /* Стиль для іконки особи: прибираємо псевдоелементи, задаємо лише color */
            .menu__ico--person::before,
            .menu__ico--person::after {
                content: none !important;
            }
            .menu__ico--person,
            .menu__ico--person svg,
            .menu__ico--person path,
            .menu__ico--person g,
            .menu__ico--person.focus,
            .menu__ico--person.focus svg,
            .menu__ico--person.focus path,
            .menu__ico--person.focus g {
                stroke: none !important;
                stroke-width: 0 !important;
                color: var(--icon-color) !important;
            }
            .menu__item,
            .menu__item.traverse,
            .menu__item.hover {
                background: transparent !important;
                color: var(--menu-color) !important;
                padding: 0.9em 1.5em !important;
                border-radius: 0 1em 1em 0 !important;
            }
            .menu__item.focus {
                background: var(--main-color) !important;
                color: var(--menu-color) !important;
                transform: translateX(-0.2em);
            }
            .card.selector.focus .card__title,
            .card.selector:hover .card__title,
            .card .card__title {
                background: transparent !important;
                color: var(--text-color) !important;
            }
            .color_row {
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                grid-auto-rows: 80px;
                gap: 15px;
                justify-items: center;
                width: 100%;
                padding: 10px;
            }
            .color_square {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 60px;
                height: 60px;
                border-radius: 8px;
                cursor: pointer;
            }
            .color_square.focus {
                border: 2px solid #ddd;
                transform: scale(1.1);
            }
            .selector.focus:not(.card__title):not(.card):not(.color_square):not(.menu__ico),
            .button--category {
                background-color: var(--main-color) !important;
            }
            .settings-param__name,
            .settings-folder__name {
                color: var(--text-color);
            }
            .console__tab.focus,
            .full-person.focus,
            .full-start__button.focus,
            .full-descr__tag.focus,
            .simple-button.focus,
            .head__action.focus,
            .head__action.hover,
            .player-panel .button.focus,
            .search-source.active {
                background: var(--main-color) !important;
                color: var(--text-color) !important;
            }
            .navigation-tabs__button.focus,
            .time-line > div,
            .player-panel__position,
            .player-panel__position > div:after {
                background-color: var(--main-color);
                color: var(--menu-color);
            }
            .iptv-menu__list-item.focus,
            .iptv-program__timeline > div {
                background-color: var(--main-color) !important;
                color: var(--menu-color) !important;
            }
            .radio-item.focus,
            .lang__selector-item.focus,
            .simple-keyboard .hg-button.focus,
            .modal__button.focus,
            .search-history-key.focus,
            .simple-keyboard-mic.focus,
            .torrent-serial__progress,
            .full-review-add.focus,
            .full-review.focus,
            .tag-count.focus,
            .settings-folder.focus,
            .settings-param.focus,
            .selectbox-item.focus,
            .selectbox-item.hover {
                background: var(--main-color);
                color: var(--menu-color);
            }
            .online.focus {
                box-shadow: 0 0 0 0.2em var(--main-color);
            }
            .online_modss.focus::after,
            .online-prestige.focus::after,
            .radio-item.focus .radio-item__imgbox:after,
            .iptv-channel.focus::before,
            .iptv-channel.last--focus::before {
                border-color: var(--main-color) !important;
            }
            .card-more.focus .card-more__box::after,
            .explorer-card__head-img.focus::after {
                border: 0.3em solid var(--main-color);
            }
            .iptv-playlist-item.focus::after,
            .iptv-playlist-item.hover::after,
            .ad-bot.focus .ad-bot__content::after,
            .ad-bot.hover .ad-bot__content::after,
            .card-episode.focus .full-episode::after,
            .register.focus::after,
            .season-episode.focus::after,
            .full-episode.focus::after,
            .full-review-add.focus::after,
            .card.focus .card__view::after,
            .card.hover .card__view::after,
            .extensions__item.focus:after,
            .torrent-item.focus::after,
            .extensions__block-add.focus:after {
                border-color: var(--main-color);
            }
            .broadcast__scan > div,
            .broadcast__device.focus {
                background-color: var(--main-color);
                color: var(--menu-color);
            }
            .card:hover .card__img,
            .card.focus .card__img {
                border-color: var(--main-color);
            }
            .noty,
            .radio-player.focus {
                background: var(--main-color);
                color: var(--menu-color);
            }
        `;
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
                    name: Lampa.Lang.translate('accent_color'),
                    description: '<div style="width: 2em; height: 2em; background-color: ' + Lampa.Storage.get('accent_color_selected', '#5daa68') + '; display: inline-block; border: 1px solid #ddd;"></div>'
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
                    var colorKeys = Object.keys(accentColors);
                    var groupedColors = chunkArray(colorKeys, 6);
                    var color_content = groupedColors.map(function (group) {
                        var groupContent = group.map(function (color) {
                            return createColorHtml(color, accentColors[color]);
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

            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
                param: {
                    name: 'background_color_active',
                    type: 'trigger',
                    default: false
                },
                field: {
                    name: Lampa.Lang.translate('background_color_on')
                },
                onChange: function (item) {
                    var selectItem = $('.settings-param[data-name="select_background_color"]');
                    if (selectItem.length) {
                        selectItem.css('display', item === 'true' ? 'block' : 'none');
                    }
                    Lampa.Settings.render();
                }
            });

            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
                param: {
                    name: 'select_background_color',
                    type: 'button'
                },
                field: {
                    name: Lampa.Lang.translate('background_color'),
                    description: '<div style="width: 2em; height: 2em; background-color: ' + Lampa.Storage.get('background_color_selected', '#1d1f20') + '; display: inline-block; border: 1px solid #ddd;"></div>'
                },
                onRender: function (item) {
                    if (!Lampa.Storage.get('background_color_active')) {
                        item.css('display', 'none');
                    } else {
                        item.css('display', 'block');
                    }
                    var color = Lampa.Storage.get('background_color_selected', '#1d1f20');
                    document.documentElement.style.setProperty('--background-color', color);
                    var descr = item.find('.settings-param__descr div');
                    if (descr.length) {
                        descr.css('background-color', color);
                    }
                },
                onChange: function () {
                    createColorModal();
                    var colorKeys = Object.keys(backgroundColors);
                    var groupedColors = chunkArray(colorKeys, 6);
                    var color_content = groupedColors.map(function (group) {
                        var groupContent = group.map(function (color) {
                            return createColorHtml(color, backgroundColors[color]);
                        }).join('');
                        return '<div class="color_row">' + groupContent + '</div>';
                    }).join('');
                    var modalHtml = $('<div class="color_modal_root">' + color_content + '</div>');
                    try {
                        Lampa.Modal.open({
                            title: Lampa.Lang.translate('background_color'),
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
                                    var color = a[0].style.backgroundColor || Lampa.Storage.get('background_color_selected', '#1d1f20');
                                    applyBackgroundColor(color);
                                }
                            }
                        });
                    } catch (e) {}
                }
            });

            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
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
                onChange: function (value) {
                    applyIconColor(value);
                }
            });

        } catch (e) {}

        var savedAccentColor = Lampa.Storage.get('accent_color_selected', '#5daa68');
        var savedBackgroundColor = Lampa.Storage.get('background_color_selected', '#1d1f20');
        var savedIconColor = Lampa.Storage.get('icon_color_selected', 'white');
        document.documentElement.style.setProperty('--main-color', savedAccentColor);
        document.documentElement.style.setProperty('--background-color', savedBackgroundColor);
        document.documentElement.style.setProperty('--icon-color', iconColors[savedIconColor] || '#ddd');
        document.documentElement.style.setProperty('--menu-color', iconColors[savedIconColor] || '#ddd');

        // Оновлення стилів після зміни теми
        Lampa.Storage.listener.follow('change', function (e) {
            if (e.name === 'accent_color_active') {
                var selectItem = $('.settings-param[data-name="select_accent_color"]');
                if (selectItem.length) {
                    selectItem.css('display', Lampa.Storage.get('accent_color_active') ? 'block' : 'none');
                }
                Lampa.Settings.render();
            }
            if (e.name === 'background_color_active') {
                var selectItem = $('.settings-param[data-name="select_background_color"]');
                if (selectItem.length) {
                    selectItem.css('display', Lampa.Storage.get('background_color_active') ? 'block' : 'none');
                }
                Lampa.Settings.render();
            }
            if (e.name === 'icon_color') {
                applyIconColor(e.value);
            }
            if (e.name === 'selectedTheme' || e.name === 'theme_select') {
                setTimeout(function () {
                    var iconColor = Lampa.Storage.get('icon_color_selected', 'white');
                    var style = document.createElement('style');
                    style.id = 'colormodal-override';
                    style.textContent = `
                        .menu__item {
                            color: var(--menu-color) !important;
                        }
                        /* Стиль для всіх іконок, крім "Налаштування" і ".menu__ico--person": задаємо лише color */
                        .menu__ico:not([data-action="settings"] .menu__ico):not(.menu__ico--person),
                        .menu__ico:not([data-action="settings"] .menu__ico):not(.menu__ico--person) svg,
                        .menu__ico:not([data-action="settings"] .menu__ico):not(.menu__ico--person) path,
                        .menu__ico:not([data-action="settings"] .menu__ico):not(.menu__ico--person) g {
                            background: transparent !important;
                            color: var(--icon-color) !important;
                            stroke: none !important;
                            stroke-width: 0 !important;
                        }
                        .menu__ico.focus:not([data-action="settings"] .menu__ico):not(.menu__ico--person),
                        .menu__ico.focus:not([data-action="settings"] .menu__ico):not(.menu__ico--person) svg,
                        .menu__ico.focus:not([data-action="settings"] .menu__ico):not(.menu__ico--person) path,
                        .menu__ico.focus:not([data-action="settings"] .menu__ico):not(.menu__ico--person) g {
                            background: transparent !important;
                            color: var(--icon-color) !important;
                            stroke: none !important;
                            stroke-width: 0 !important;
                        }
                        /* Стиль для іконки "Налаштування": використовуємо stroke */
                        li[data-action="settings"] .menu__ico,
                        li[data-action="settings"] .menu__ico svg,
                        li[data-action="settings"] .menu__ico path,
                        li[data-action="settings"] .menu__ico circle {
                            color: var(--icon-color) !important;
                            stroke: var(--icon-color) !important;
                        }
                        li[data-action="settings"] .menu__ico.focus,
                        li[data-action="settings"] .menu__ico.focus svg,
                        li[data-action="settings"] .menu__ico.focus path,
                        li[data-action="settings"] .menu__ico.focus circle {
                            color: var(--icon-color) !important;
                            stroke: var(--icon-color) !important;
                        }
                        /* Стиль для іконки особи: прибираємо псевдоелементи, задаємо лише color */
                        .menu__ico--person::before,
                        .menu__ico--person::after {
                            content: none !important;
                        }
                        .menu__ico--person,
                        .menu__ico--person svg,
                        .menu__ico--person path,
                        .menu__ico--person g,
                        .menu__ico--person.focus,
                        .menu__ico--person.focus svg,
                        .menu__ico--person.focus path,
                        .menu__ico--person.focus g {
                            stroke: none !important;
                            stroke-width: 0 !important;
                            color: var(--icon-color) !important;
                        }
                        .menu__item,
                        .menu__item.traverse,
                        .menu__item.hover {
                            background: transparent !important;
                            color: var(--menu-color) !important;
                            padding: 0.9em 1.5em !important;
                            border-radius: 0 1em 1em 0 !important;
                        }
                        .menu__item.focus {
                            background: var(--main-color) !important;
                            color: var(--menu-color) !important;
                            transform: translateX(-0.2em);
                        }
                        .card.selector.focus .card__title,
                        .card.selector:hover .card__title,
                        .card .card__title {
                            background: transparent !important;
                            color: var(--text-color) !important;
                        }
                    `;
                    document.head.appendChild(style);
                }, 0);
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
            var accentColor = Lampa.Storage.get('accent_color_selected', '#5daa68');
            var backgroundColor = Lampa.Storage.get('background_color_selected', '#1d1f20');
            var iconColor = Lampa.Storage.get('icon_color_selected', 'white');
            document.documentElement.style.setProperty('--main-color', accentColor);
            document.documentElement.style.setProperty('--background-color', backgroundColor);
            document.documentElement.style.setProperty('--icon-color', iconColors[iconColor] || '#ddd');
            document.documentElement.style.setProperty('--menu-color', iconColors[iconColor] || '#ddd');
            Lampa.Settings.render();
        }
    });

    window.applyAccentColor = applyAccentColor;
    window.applyBackgroundColor = applyBackgroundColor;
    window.applyIconColor = applyIconColor;
})();
