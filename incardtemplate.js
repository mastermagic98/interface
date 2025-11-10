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
            text_mode_name: {
                uk: 'Режими відображення тексту',
                ru: 'Режимы отображения текста',
                en: 'Text display modes'
            },
            text_mode_desc: {
                uk: 'За замовчуванням: стандартна поведінка; Приховувати текст: тільки іконки; Показувати текст: текст завжди видно.',
                ru: 'По умолчанию: стандартное поведение; Скрыть текст: только иконки; Показывать текст: текст всегда виден.',
                en: 'Default: standard behavior; Hide text: icons only; Show text: text always visible.'
            },
            text_mode_default: {
                uk: 'За замовчуванням',
                ru: 'По умолчанию',
                en: 'Default'
            },
            text_mode_hide: {
                uk: 'Приховувати текст',
                ru: 'Скрыть текст',
                en: 'Hide text'
            },
            text_mode_show: {
                uk: 'Показувати текст',
                ru: 'Показывать текст',
                en: 'Show text'
            },
            reloading: {
                uk: 'Перезавантаження...',
                ru: 'Перезагрузка...',
                en: 'Reloading...'
            }
        });
    }

    // --- CSS для режимів тексту ---
    function applyTextMode() {
        $('#plugin_text_mode_style').remove();
        var mode = Lampa.Storage.get('text_mode', 'default');

        var css = '';

        if (mode === 'hide') {
            css += '.full-start__button span { display: none !important; }';
        } else if (mode === 'show') {
            css += '.full-start__button span { display: inline !important; }';
            css += '.full-start__button { min-width: auto !important; width: auto !important; }';
        } else {
            css += '.full-start__button span { display: inline !important; opacity: 0; transition: opacity 0.2s ease; }';
            css += '.full-start__button.focus span { opacity: 1 !important; }';
            css += '.full-start__button { min-width: auto !important; width: auto !important; }';
        }

        css += '@media screen and (max-width:580px) {';
        css += '.full-start-new__buttons { overflow-x:auto; overflow-y:hidden; white-space:nowrap; padding-bottom:10px; }';
        css += '.full-start__button { flex: 0 0 auto; margin-right: 5px; }';
        css += '}';

        $('body').append('<style id="plugin_text_mode_style">' + css + '</style>');
    }

    // --- Показати всі кнопки ---
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

                    applyTextMode();
                    Lampa.Controller.toggle('full_start');
                } catch (err) {
                    console.error('[ShowAllButtons] Error:', err);
                }
            }, 150);
        });
    }

    // --- Налаштування ---
    function addSettings() {
        // Показувати всі кнопки
        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: { name: 'show_all_buttons', type: 'trigger', default: true },
            field: {
                name: Lampa.Lang.translate('show_all_buttons_name'),
                description: Lampa.Lang.translate('show_all_buttons_desc')
            },
            onChange: function (value) {
                Lampa.Storage.set('show_all_buttons', value);
                setTimeout(function () {
                    Lampa.Noty.show(Lampa.Lang.translate('reloading'));
                    location.reload();
                }, 200);
            }
        });

        // Режими відображення тексту
        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: { name: 'text_mode', type: 'select', default: 'default', values: ['default','hide','show'] },
            field: {
                name: Lampa.Lang.translate('text_mode_name'),
                description: Lampa.Lang.translate('text_mode_desc'),
                options: [
                    { value: 'default', name: Lampa.Lang.translate('text_mode_default') },
                    { value: 'hide', name: Lampa.Lang.translate('text_mode_hide') },
                    { value: 'show', name: Lampa.Lang.translate('text_mode_show') }
                ]
            },
            onChange: function (value) {
                Lampa.Storage.set('text_mode', value);
                applyTextMode();
            }
        });
    }

    // --- Ініціалізація плагіну ---
    function startPlugin() {
        initLang();
        addSettings();
        showAllButtons();
        applyTextMode();

        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'complite') applyTextMode();
        });
    }

    if (window.appready) startPlugin();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') startPlugin();
    });

})();
