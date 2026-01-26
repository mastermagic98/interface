// highlight_border_plugin.js
// Окремий плагін: Увімкнення/вимкнення білої рамки навколо виділених елементів

(function () {
    'use strict';

    // Переклади
    Lampa.Lang.add({
        highlight_border_plugin: {
            ru: 'Белая рамка при фокусе',
            en: 'White border on focus',
            uk: 'Біла рамка при фокусі'
        },
        highlight_border_enabled: {
            ru: 'Показывать белую рамку',
            en: 'Show white border',
            uk: 'Показувати білу рамку'
        },
        highlight_border_description: {
            ru: 'Добавляет белую внутреннюю рамку вокруг выделенных элементов интерфейса',
            en: 'Adds a white inner border around focused interface elements',
            uk: 'Додає білу внутрішню рамку навколо виділених елементів інтерфейсу'
        }
    });

    // Об'єкт налаштувань
    var HighlightPlugin = {
        enabled: Lampa.Storage.get('highlight_border_enabled', 'true') === 'true'
    };

    // Функція застосування/видалення стилів рамки
    function applyHighlightStyles() {
        var styleElement = document.getElementById('highlight-border-styles');

        if (!HighlightPlugin.enabled) {
            if (styleElement) styleElement.remove();
            return;
        }

        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'highlight-border-styles';
            document.head.appendChild(styleElement);
        }

        // Список елементів, до яких застосовується рамка
        styleElement.innerHTML = `
            .menu__item.focus,
            .menu__item.traverse,
            .menu__item:hover,
            .settings-param.focus,
            .settings-folder.focus,
            .selectbox-item.focus,
            .selectbox-item:hover,
            .simple-button.focus,
            .full-start__button.focus,
            .full-person.focus,
            .head__action.focus,
            .head__action:hover,
            .player-panel .button.focus,
            .search-source.active,
            .navigation-tabs__button.focus,
            .items-line__more.focus,
            .console__tab.focus,
            .timetable__item.focus,
            .broadcast__device.focus,
            .radio-item.focus,
            .lang__selector-item.focus,
            .modal__button.focus,
            .search-history-key.focus,
            .simple-keyboard-mic.focus,
            .full-review.focus,
            .full-review-add.focus,
            .tag-count.focus,
            .color_square.focus,
            .hex-input.focus {
                -webkit-box-shadow: inset 0 0 0 0.15em #ffffff !important;
                   -moz-box-shadow: inset 0 0 0 0.15em #ffffff !important;
                        box-shadow: inset 0 0 0 0.15em #ffffff !important;
            }

            /* Додаткові елементи, якщо потрібно */
            .online.focus,
            .iptv-channel.focus::before,
            .card.focus .card__view::after,
            .card:hover .card__view::after {
                box-shadow: 0 0 0 0.2em #ffffff !important;
            }
        `;
    }

    // Збереження налаштування
    function saveSetting() {
        Lampa.Storage.set('highlight_border_enabled', HighlightPlugin.enabled.toString());
        localStorage.setItem('highlight_border_enabled', HighlightPlugin.enabled.toString());
    }

    // Ініціалізація плагіну
    function initHighlightPlugin() {
        // Додаємо компонент у налаштування (окремий розділ)
        if (Lampa.SettingsApi) {
            Lampa.SettingsApi.addComponent({
                component: 'highlight_border',
                name: Lampa.Lang.translate('highlight_border_plugin'),
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="4" y1="4" x2="20" y2="20"></line></svg>'
            });

            // Додаємо параметр увімкнення/вимкнення
            Lampa.SettingsApi.addParam({
                component: 'highlight_border',
                param: {
                    name: 'highlight_border_enabled',
                    type: 'trigger',
                    default: HighlightPlugin.enabled.toString()
                },
                field: {
                    name: Lampa.Lang.translate('highlight_border_enabled'),
                    description: Lampa.Lang.translate('highlight_border_description')
                },
                onChange: function (value) {
                    HighlightPlugin.enabled = value === 'true';
                    saveSetting();
                    applyHighlightStyles();
                    // Оновлюємо інтерфейс налаштувань
                    if (Lampa.Settings && Lampa.Settings.render) {
                        Lampa.Settings.render();
                    }
                }
            });

            // Застосовуємо поточний стан при запуску
            applyHighlightStyles();
        }
    }

    // Запуск після готовності програми
    if (window.appready) {
        initHighlightPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                initHighlightPlugin();
            }
        });
    }

    // Слухач зміни налаштування (на випадок зміни з іншого місця)
    Lampa.Storage.listener.follow('change', function (e) {
        if (e.name === 'highlight_border_enabled') {
            HighlightPlugin.enabled = Lampa.Storage.get('highlight_border_enabled', 'true') === 'true';
            applyHighlightStyles();
        }
    });

    // Маніфест плагіну
    Lampa.Manifest.plugins = Lampa.Manifest.plugins || {};
    Lampa.Manifest.plugins.highlight_border = {
        name: 'highlight_border_plugin',
        version: '1.0.0',
        description: 'White focus border'
    };

})();
