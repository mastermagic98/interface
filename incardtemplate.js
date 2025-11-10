(function () {
    'use strict';

    // --- Локалізація ---
    Lampa.Lang.add({
        show_all_buttons_name: {
            uk: 'Показувати всі кнопки',
            ru: 'Показывать все кнопки',
            en: 'Show all buttons'
        },
        text_mode_name: {
            uk: 'Режим тексту на кнопках',
            ru: 'Режим текста на кнопках',
            en: 'Button text mode'
        },
        text_mode_default: {
            uk: 'За замовчуванням (текст при наведенні)',
            ru: 'По умолчанию (текст при наведении)',
            en: 'Default (text on hover)'
        },
        text_mode_show: {
            uk: 'Показати текст (великі кнопки)',
            ru: 'Показать текст (большие кнопки)',
            en: 'Show text (large buttons)'
        },
        text_mode_hide: {
            uk: 'Приховати текст (тільки іконки)',
            ru: 'Скрыть текст (только иконки)',
            en: 'Hide text (icons only)'
        }
    });

    // --- Стилі ---
    function addStyles() {
        var style = document.createElement('style');
        style.textContent = `
            .bigbuttons--show .full-start__text {
                display: block !important;
                opacity: 1 !important;
                width: auto !important;
            }
            .bigbuttons--hide .full-start__text {
                display: none !important;
                opacity: 0 !important;
                width: 0 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // --- Логіка застосування змін ---
    function applyButtonSettings() {
        var showAll = Lampa.Storage.get('show_all_buttons', false);
        var textMode = Lampa.Storage.get('text_mode', 'default');

        var full = $('.full-start-new, .full-start');
        if (!full.length) return;

        // --- Кнопки, які зазвичай ховаються під "Дивитись" ---
        var hiddenButtons = full.find('.full-start__button--more, .full-start__button--subscribe');
        hiddenButtons.css('display', showAll ? 'flex' : '');

        // --- Режим тексту ---
        var buttons = full.find('.full-start__button');
        buttons.removeClass('bigbuttons--show bigbuttons--hide');

        if (textMode === 'show') {
            buttons.addClass('bigbuttons--show');
        } else if (textMode === 'hide') {
            buttons.addClass('bigbuttons--hide');
        }
    }

    // --- Додаємо опції в Налаштування кольору акценту ---
    function addSettings() {
        // 1️⃣ Показувати всі кнопки
        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: {
                name: 'show_all_buttons',
                type: 'toggle',
                default: false
            },
            field: Lampa.Lang.translate('show_all_buttons_name'),
            onChange: function () {
                applyButtonSettings();
            }
        });

        // 2️⃣ Режим тексту
        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: {
                name: 'text_mode',
                type: 'select',
                values: ['default', 'show', 'hide'],
                default: 'default'
            },
            field: Lampa.Lang.translate('text_mode_name'),
            values: {
                'default': Lampa.Lang.translate('text_mode_default'),
                'show': Lampa.Lang.translate('text_mode_show'),
                'hide': Lampa.Lang.translate('text_mode_hide')
            },
            onChange: function () {
                applyButtonSettings();
            }
        });
    }

    // --- Основна функція ---
    function main() {
        addStyles();
        addSettings();

        // застосовує зміни при відкритті картки
        Lampa.Listener.follow('full', function (event) {
            if (event.type === 'activity' || event.type === 'complite') {
                setTimeout(applyButtonSettings, 100);
            }
        });
    }

    main();
})();
