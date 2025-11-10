(function () {
    'use strict';

    // --- Локалізація ---
    function Lang() {
        try {
            Lampa.Lang.add({
                showall_name: { ru: "Все кнопки", en: "All buttons", uk: "Усі кнопки" },
                showall_desc: { ru: "Показує всі кнопки дій на картці", en: "Show all action buttons in card", uk: "Показує всі кнопки дій на картці" },
                textmode_name: { ru: "Режим тексту", en: "Text mode", uk: "Режим відображення тексту" },
                reloading: { ru: "Перезавантаження...", en: "Reloading...", uk: "Перезавантаження..." }
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
                // показуємо текст на всіх кнопках
                var style = '<style id="accent_color_textmode">' +
                    '.full-start-new__buttons .full-start__button span { display:inline !important; }' +
                    '</style>';
                $('body').append(style);
            } else if (mode === 'hide') {
                // приховуємо текст на всіх кнопках
                var style = '<style id="accent_color_textmode">' +
                    '.full-start-new__buttons .full-start__button span { display:none !important; }' +
                    '.full-start-new__buttons .full-start__button { min-width: auto !important; }' +
                    '</style>';
                $('body').append(style);
            }
            // default – нічого не додаємо, залишаємо стилі Лампи
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
                        var allButtons = fullContainer.find('.buttons--container .full-start__button').add(targetContainer.find('.full-start__button'));
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
                            categories[c].forEach(function ($b) {
                                targetContainer.append($b);
                            });
                        });
                        targetContainer.css({ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-start' });

                        // застосовуємо текстовий режим після зміни кнопок
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

    // --- Налаштування ---
    function Settings() {
        try {
            // Показати всі кнопки
            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
                param: { name: 'showall', type: 'trigger', default: false },
                field: { name: Lampa.Lang.translate('showall_name'), description: Lampa.Lang.translate('showall_desc') },
                onChange: function (value) {
                    Lampa.Storage.set('showall', value);
                    setTimeout(function () {
                        Lampa.Noty.show(Lampa.Lang.translate('reloading'));
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
                field: { name: Lampa.Lang.translate('textmode_name'), description: '' },
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

            if (Lampa.Storage.get('showall') === undefined) Lampa.Storage.set('showall', false);
            if (Lampa.Storage.get('text_mode') === undefined) Lampa.Storage.set('text_mode', 'default');

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
