(function () {
    'use strict';

    Lampa.Lang.add({
        uk: {
            bigbuttons_settings_title: 'Керування кнопками у картці',
            bigbuttons_show_all: 'Показувати всі кнопки',
            bigbuttons_text_mode: 'Режим тексту на кнопках',
            bigbuttons_text_mode_default: 'За замовчуванням (текст при наведенні)',
            bigbuttons_text_mode_show: 'Показати текст',
            bigbuttons_text_mode_hide: 'Приховати текст'
        },
        ru: {
            bigbuttons_settings_title: 'Управление кнопками в карточке',
            bigbuttons_show_all: 'Показывать все кнопки',
            bigbuttons_text_mode: 'Режим текста на кнопках',
            bigbuttons_text_mode_default: 'По умолчанию (текст при наведении)',
            bigbuttons_text_mode_show: 'Показать текст',
            bigbuttons_text_mode_hide: 'Скрыть текст'
        },
        en: {
            bigbuttons_settings_title: 'Card button control',
            bigbuttons_show_all: 'Show all buttons',
            bigbuttons_text_mode: 'Button text mode',
            bigbuttons_text_mode_default: 'Default (text on hover)',
            bigbuttons_text_mode_show: 'Show text',
            bigbuttons_text_mode_hide: 'Hide text'
        }
    });

    function applyButtonSettings() {
        const showAll = Lampa.Storage.get('bigbuttons_show_all', false);
        const textMode = Lampa.Storage.get('bigbuttons_text_mode', 'default');

        const buttons = document.querySelectorAll('.full-start__button, .full-start__buttons .selector');
        const hiddenButtons = document.querySelectorAll('.full-start__button--more, .full-start__button--subscribe');

        // --- показ усіх кнопок ---
        hiddenButtons.forEach(btn => {
            btn.style.display = showAll ? 'flex' : '';
        });

        // --- керування текстом ---
        buttons.forEach(btn => {
            const textEl = btn.querySelector('.full-start__text');

            if (textEl) {
                btn.classList.remove('bigbuttons--show', 'bigbuttons--hide');

                if (textMode === 'show') {
                    btn.classList.add('bigbuttons--show');
                } else if (textMode === 'hide') {
                    btn.classList.add('bigbuttons--hide');
                }
            }
        });
    }

    function addStyles() {
        const style = document.createElement('style');
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
        Lampa.SettingsApi.addParam({
            component: 'bigbuttons',
            param: {
                name: 'bigbuttons_show_all',
                type: 'toggle',
                default: false
            },
            field: Lampa.Lang.translate('bigbuttons_show_all')
        });

        Lampa.SettingsApi.addParam({
            component: 'bigbuttons',
            param: {
                name: 'bigbuttons_text_mode',
                type: 'select',
                values: ['default', 'show', 'hide'],
                default: 'default'
            },
            field: Lampa.Lang.translate('bigbuttons_text_mode'),
            values: {
                default: Lampa.Lang.translate('bigbuttons_text_mode_default'),
                show: Lampa.Lang.translate('bigbuttons_text_mode_show'),
                hide: Lampa.Lang.translate('bigbuttons_text_mode_hide')
            }
        });

        Lampa.SettingsApi.addComponent({
            component: 'bigbuttons',
            name: Lampa.Lang.translate('bigbuttons_settings_title'),
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
