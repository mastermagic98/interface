(function () {
    'use strict';

    // --- Локалізація ---
    function Lang() {
        try {
            Lampa.Lang.add({
                showall_name: {
                    ru: "Показывать все кнопки",
                    en: "Show all buttons",
                    uk: "Показувати всі кнопки"
                },
                showall_desc: {
                    ru: "Показывает все кнопки действий в карточке",
                    en: "Displays all action buttons in the card",
                    uk: "Відображає всі кнопки дій у картці"
                },
                textmode_name: {
                    ru: "Режим отображения текста",
                    en: "Text display mode",
                    uk: "Режим відображення тексту"
                },
                textmode_desc: {
                    ru: "Выберите способ отображения текста на кнопках",
                    en: "Choose how text on buttons is displayed",
                    uk: "Виберіть спосіб відображення тексту на кнопках"
                },
                reloading: {
                    ru: "Перезагрузка...",
                    en: "Reloading...",
                    uk: "Перезавантаження..."
                }
            });
        } catch (e) {
            console.error('[Lang] Error:', e);
        }
    }

    // --- Застосування режиму тексту ---
    function applyTextMode() {
        try {
            var mode = Lampa.Storage.get('text_mode', 'default');
            $('#accent_color_textmode').remove();

            if (mode === 'show') {
                var style = '<style id="accent_color_textmode">' +
                    '.full-start-new__buttons .full-start__button span { display:inline !important; }' +
                    '</style>';
                $('body').append(style);
            } else if (mode === 'hide') {
                var style = '<style id="accent_color_textmode">' +
                    '.full-start-new__buttons .full-start__button span { display:none !important; }' +
                    '.full-start-new__buttons .full-start__button { min-width:auto !important; }' +
                    '</style>';
                $('body').append(style);
            }
        } catch (e) {
            console.error('[TextMode] Apply error:', e);
        }
    }

    // --- Показ всіх кнопок ---
    function ShowAllButtons() {
        try {
            Lampa.Listener.follow('full', function (e) {
                if (e.type !== 'complite') return;
                setTimeout(function () {
                    try {
                        if (Lampa.Storage.get('showall') !== true) return;

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

                        targetContainer.css({
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '10px',
                            justifyContent: 'flex-start'
                        });

                        applyTextMode();
                        Lampa.Controller.toggle('full_start');

                    } catch (err) {
                        console.error('[ShowAllButtons] Inner error:', err);
                    }
                }, 150);
            });
        } catch (e) {
            console.error('[ShowAllButtons] Setup error:', e);
        }
    }

    // --- Отримання тексту перекладу ---
    function t(key) {
        var obj = Lampa.Lang.translate(key);
        if (typeof obj === 'object') {
            var lang = Lampa.Storage.get('language', 'uk');
            return obj[lang] || obj.uk || obj.en;
        }
        return obj || key;
    }

    // --- Налаштування ---
    function Settings() {
        try {
            // Показати всі кнопки
            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
                param: { name: 'showall', type: 'trigger', default: false },
                field: {
                    name: t('showall_name'),
                    description: t('showall_desc')
                },
                onChange: function (value) {
                    Lampa.Storage.set('showall', value);
                    setTimeout(function () {
                        Lampa.Noty.show(t('reloading'));
                        location.reload();
                    }, 300);
                }
            });

            // Режими відображення тексту
            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
                param: {
                    name: 'text_mode',
                    type: 'select',
                    default: 'default',
                    values: [
                        { name: 'За замовчуванням', value: 'default' },
                        { name: 'Показати текст', value: 'show' },
                        { name: 'Приховати текст', value: 'hide' }
                    ]
                },
                field: {
                    name: t('textmode_name'),
                    description: t('textmode_desc')
                },
                onChange: function (value) {
                    Lampa.Storage.set('text_mode', value);
                    applyTextMode();
                }
            });

        } catch (e) {
            console.error('[Settings] Build error:', e);
        }
    }

    // --- Ініціалізація ---
    function add() {
        try {
            Lang();

            if (Lampa.Storage.get('showall') === undefined)
                Lampa.Storage.set('showall', false);
            if (Lampa.Storage.get('text_mode') === undefined)
                Lampa.Storage.set('text_mode', 'default');

            Settings();
            ShowAllButtons();
            applyTextMode();

        } catch (e) {
            console.error('[Plugin Init] Error:', e);
        }
    }

    function startPlugin() {
        if (!window.plugin_showbutton_ready) {
            window.plugin_showbutton_ready = true;
            if (window.appready) add();
            else Lampa.Listener.follow('app', function (e) {
                if (e.type === 'ready') add();
            });
        }
    }

    startPlugin();

})();
