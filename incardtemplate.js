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
            uk: 'Показати текст',
            ru: 'Показать текст',
            en: 'Show text'
        },
        text_mode_hide: {
            uk: 'Приховати текст',
            ru: 'Скрыть текст',
            en: 'Hide text'
        },
        buttons_control_title: {
            uk: 'Керування кнопками у картці',
            ru: 'Управление кнопками в карточке',
            en: 'Card button control'
        }
    });

    function applyButtonSettings() {
        var showAll = Lampa.Storage.get('show_all_buttons', false);
        var textMode = Lampa.Storage.get('text_mode', 'default');

        var buttons = document.querySelectorAll('.full-start__button, .full-start__buttons .selector');
        var hiddenButtons = document.querySelectorAll('.full-start__button--more, .full-start__button--subscribe');

        // показати/сховати всі кнопки
        for (var i = 0; i < hiddenButtons.length; i++) {
            hiddenButtons[i].style.display = showAll ? 'flex' : '';
        }

        // керування текстом
        for (var j = 0; j < buttons.length; j++) {
            var btn = buttons[j];
            var textEl = btn.querySelector('.full-start__text');
            if (textEl) {
                btn.classList.remove('bigbuttons--show', 'bigbuttons--hide');
                if (textMode === 'show') btn.classList.add('bigbuttons--show');
                else if (textMode === 'hide') btn.classList.add('bigbuttons--hide');
            }
        }
    }

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

    function addSettings() {
        // Додаємо параметри до розділу accent_color_plugin
        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: {
                name: 'show_all_buttons',
                type: 'toggle',
                default: false
            },
            field: Lampa.Lang.translate('show_all_buttons_name'),
            onChange: applyButtonSettings
        });

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
            onChange: applyButtonSettings
        });
    }

    function main() {
        addStyles();
        addSettings();

        Lampa.Listener.follow('full', function (event) {
            if (event.type === 'activity') {
                setTimeout(applyButtonSettings, 100);
            }
        });
    }

    main();
})();
