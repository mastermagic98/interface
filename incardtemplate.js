(function () {
    'use strict';

    function initLang() {
        Lampa.Lang.add({
            show_all_buttons_name: {
                uk: 'Показувати всі кнопки',
                ru: 'Показывать все кнопки',
                en: 'Show all buttons'
            },
            show_all_buttons_desc: {
                uk: 'Відображає всі кнопки дій у картці, включно з прихованими під «Дивитись».',
                ru: 'Отображает все кнопки действий в карточке, включая скрытые под «Смотреть».',
                en: 'Displays all action buttons in the card, including those hidden under "Watch".'
            },
            show_text_buttons_name: {
                uk: 'Показувати текст на кнопках',
                ru: 'Показывать текст на кнопках',
                en: 'Show text on buttons'
            },
            show_text_buttons_desc: {
                uk: 'Завжди показує текст на всіх кнопках.',
                ru: 'Всегда показывает текст на всех кнопках.',
                en: 'Always show text on all buttons.'
            },
            hide_text_buttons_name: {
                uk: 'Приховати текст на кнопках',
                ru: 'Скрыть текст на кнопках',
                en: 'Hide text on buttons'
            },
            hide_text_buttons_desc: {
                uk: 'Показує тільки іконки на кнопках (без тексту навіть при наведенні).',
                ru: 'Показывает только иконки на кнопках (без текста даже при наведении).',
                en: 'Shows only icons on buttons (no text even on hover).'
            }
        });
    }

    function applyButtonStyles() {
        var showText = Lampa.Storage.get('show_text_buttons', false);
        var hideText = Lampa.Storage.get('hide_text_buttons', false);
        $('#plugin_button_styles').remove();

        var css = '';

        // 1️⃣ Показувати тільки іконки
        if (hideText) {
            css += `
            .full-start__button span {
                display: none !important;
            }`;
        }
        // 2️⃣ Показувати текст на всіх кнопках
        else if (showText) {
            css += `
            .full-start__button span {
                display: inline !important;
                opacity: 1 !important;
            }`;
        }
        // 3️⃣ Стандартна поведінка (тільки при фокусі)
        else {
            css += `
            .full-start__button span {
                display: inline !important;
                opacity: 0 !important;
                transition: opacity 0.2s ease;
            }
            .full-start__button.focus span {
                opacity: 1 !important;
            }`;
        }

        $('body').append('<style id="plugin_button_styles">' + css + '</style>');
    }

    function showAllButtons() {
        if (Lampa.Storage.get('show_all_buttons', false) !== true) return;

        Lampa.Listener.follow('full', function (e) {
            if (e.type !== 'complite') return;
            setTimeout(function () {
                try {
                    var fullContainer = e.object.activity.render();
                    var targetContainer = fullContainer.find('.full-start-new__buttons');
                    if (!targetContainer.length) return;

                    fullContainer.find('.button--play').remove();

                    var allButtons = fullContainer.find('.buttons--container .full-start__button')
                        .add(targetContainer.find('.full-start__button'));

                    var uniqueButtons = [];
                    allButtons.each(function () {
                        var exists = uniqueButtons.some(function (el) {
                            return $(el).text().trim() === $(this).text().trim();
                        }.bind(this));
                        if (!exists) uniqueButtons.push(this);
                    });

                    targetContainer.empty().append(uniqueButtons);

                    targetContainer.css({
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '10px',
                        justifyContent: 'flex-start'
                    });

                    Lampa.Controller.toggle('full_start');
                } catch (err) {
                    console.error('[ShowAllButtons] Error:', err);
                }
            }, 150);
        });
    }

    function addSettings() {
        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: { name: 'show_all_buttons', type: 'trigger', default: false },
            field: {
                name: Lampa.Lang.translate('show_all_buttons_name'),
                description: Lampa.Lang.translate('show_all_buttons_desc')
            },
            onChange: function (value) {
                Lampa.Storage.set('show_all_buttons', value);
                if (value) showAllButtons();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: { name: 'show_text_buttons', type: 'trigger', default: false },
            field: {
                name: Lampa.Lang.translate('show_text_buttons_name'),
                description: Lampa.Lang.translate('show_text_buttons_desc')
            },
            onChange: function (value) {
                Lampa.Storage.set('show_text_buttons', value);
                if (value) Lampa.Storage.set('hide_text_buttons', false);
                applyButtonStyles();
                Lampa.Settings.update();
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: { name: 'hide_text_buttons', type: 'trigger', default: false },
            field: {
                name: Lampa.Lang.translate('hide_text_buttons_name'),
                description: Lampa.Lang.translate('hide_text_buttons_desc')
            },
            onChange: function (value) {
                Lampa.Storage.set('hide_text_buttons', value);
                if (value) Lampa.Storage.set('show_text_buttons', false);
                applyButtonStyles();
                Lampa.Settings.update();
            }
        });
    }

    function start() {
        initLang();
        addSettings();
        applyButtonStyles();
        showAllButtons();

        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') applyButtonStyles();
        });
    }

    if (window.appready) start();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') start();
    });
})();
