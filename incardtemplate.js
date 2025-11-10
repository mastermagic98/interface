(function () {
    'use strict';

    // --- Локалізація ---
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
                uk: 'Завжди показує текст на всіх кнопках, ширина адаптується під текст.',
                ru: 'Всегда показывает текст на всех кнопках, ширина адаптируется под текст.',
                en: 'Always show text on all buttons, width adapts to text.'
            },
            hide_text_buttons_name: {
                uk: 'Приховати текст на кнопках',
                ru: 'Скрыть текст на кнопках',
                en: 'Hide text on buttons'
            },
            hide_text_buttons_desc: {
                uk: 'Показує тільки іконки на кнопках (без тексту навіть при наведенні).',
                ru: 'Показывает только иконки на кнопках (без текста даже на наведении).',
                en: 'Shows only icons on buttons (no text even on hover).'
            }
        });
    }

    // --- CSS стилі ---
    function applyStyles() {
        $('#plugin_button_styles').remove();
        var hideText = Lampa.Storage.get('hide_text_buttons', false);
        var showText = Lampa.Storage.get('show_text_buttons', false);

        var css = '';

        if (hideText) {
            // Тільки іконки
            css += '.full-start__button span { display: none !important; }';
        } else if (showText) {
            // Текст завжди видно
            css += '.full-start__button span { display: inline !important; }';
            css += '.full-start__button { min-width: auto !important; width: auto !important; }';
        } else {
            // Стандартна поведінка
            css += '.full-start__button span { display: inline !important; opacity: 0; transition: opacity 0.2s ease; }';
            css += '.full-start__button.focus span { opacity: 1 !important; }';
            css += '.full-start__button { min-width: auto !important; width: auto !important; }';
        }

        // Мобільні: прокрутка при великій кількості кнопок
        css += '@media screen and (max-width:580px) {';
        css += '.full-start-new__buttons { overflow-x:auto; overflow-y:hidden; white-space:nowrap; padding-bottom:10px; }';
        css += '.full-start__button { flex: 0 0 auto; margin-right: 5px; }';
        css += '}';

        $('body').append('<style id="plugin_button_styles">' + css + '</style>');
    }

    // --- Показувати всі кнопки ---
    function showAllButtons() {
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

                    var categories = { online: [], torrent: [], trailer: [], other: [] };
                    allButtons.each(function () {
                        var $b = $(this);
                        var cls = $b.attr('class') || '';
                        if (cls.indexOf('online') !== -1) categories.online.push($b);
                        else if (cls.indexOf('torrent') !== -1) categories.torrent.push($b);
                        else if (cls.indexOf('trailer') !== -1) categories.trailer.push($b);
                        else categories.other.push($b.clone(true));
                    });

                    var order = ['torrent', 'online', 'trailer', 'other'];
                    targetContainer.empty();
                    order.forEach(function (c) {
                        categories[c].forEach(function ($b) { targetContainer.append($b); });
                    });

                    targetContainer.css({ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-start' });

                    applyStyles();
                    Lampa.Controller.toggle('full_start');
                } catch (err) {
                    console.error('[ShowAllButtons] Error:', err);
                }
            }, 150);
        });
    }

    // --- Додавання налаштувань ---
    function addSettings() {
        // Показувати всі кнопки (завжди)
        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: { name: 'show_all_buttons', type: 'trigger', default: true },
            field: {
                name: Lampa.Lang.translate('show_all_buttons_name'),
                description: Lampa.Lang.translate('show_all_buttons_desc')
            },
            onChange: function () {}
        });

        // Показувати текст на кнопках
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
                applyStyles();
                Lampa.Settings.update();
            }
        });

        // Приховати текст на кнопках
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
                applyStyles();
                Lampa.Settings.update();
            }
        });
    }

    function startPlugin() {
        initLang();
        addSettings();
        showAllButtons();
        applyStyles();

        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') applyStyles();
        });
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') startPlugin();
    });

})();
