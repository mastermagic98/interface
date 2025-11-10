(function () {
    'use strict';

    // --- Локалізація ---
    function Lang() {
        Lampa.Lang.add({
            show_all_buttons: {
                ru: "Показать все кнопки",
                en: "Show all buttons",
                uk: "Показувати всі кнопки"
            },
            text_mode: {
                ru: "Режим отображения текста",
                en: "Text display mode",
                uk: "Режим відображення тексту"
            },
            text_mode_default: {
                ru: "По умолчанию",
                en: "Default",
                uk: "За замовчуванням"
            },
            text_mode_show: {
                ru: "Показать текст",
                en: "Show text",
                uk: "Показати текст"
            },
            text_mode_hide: {
                ru: "Скрыть текст",
                en: "Hide text",
                uk: "Приховати текст"
            },
            reloading: {
                ru: "Перезагрузка...",
                en: "Reloading...",
                uk: "Перезавантаження..."
            }
        });
    }

    // --- Перевірка мобільного екрану ---
    function isMobile() {
        return window.innerWidth <= 580;
    }

    // --- Застосування режиму тексту ---
    function applyTextMode() {
        var mode = Lampa.Storage.get('text_mode', 'default');
        var buttons = $('.full-start-new__buttons .full-start__button');

        buttons.each(function () {
            var $btn = $(this);
            $btn.css({ width: '', minWidth: '', transition: 'width 0.2s' });

            $btn.find('span').remove();

            if (mode === 'show') {
                var text = $btn.data('title') || $btn.find('span').text() || '';
                if (text) $btn.append('<span>' + text + '</span>');
            } else if (mode === 'hide') {
                // Тільки іконки, текст відсутній
            } else {
                // default - текст з'являється при фокусі
                $btn.off('hover:focus').on('hover:focus', function () {
                    var text = $btn.data('title') || $btn.find('span').text() || '';
                    if (!$btn.find('span').length && text) $btn.append('<span>' + text + '</span>');
                    $btn.css({ minWidth: $btn.outerWidth() + 'px' });
                });
                $btn.off('hover:leave').on('hover:leave', function () {
                    if (mode === 'default') $btn.find('span').remove();
                    $btn.css({ minWidth: '' });
                });
            }
        });
    }

    // --- Показ всіх кнопок ---
    function showAllButtons() {
        var show = Lampa.Storage.get('show_all_buttons', false);
        Lampa.Listener.follow('full', function (e) {
            if (e.type !== 'complite') return;
            setTimeout(function () {
                var fullContainer = e.object.activity.render();
                var target = fullContainer.find('.full-start-new__buttons');
                if (!target.length) return;
                fullContainer.find('.button--play').remove();

                var allButtons = fullContainer.find('.buttons--container .full-start__button')
                    .add(target.find('.full-start__button'));
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
                target.empty();
                order.forEach(function (c) {
                    categories[c].forEach(function ($b) { target.append($b); });
                });

                target.css({ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-start' });

                applyTextMode();
            }, 100);
        });
    }

    // --- Налаштування ---
    function Settings() {
        // Показувати всі кнопки
        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: { name: 'show_all_buttons', type: 'trigger', default: false },
            field: { name: Lampa.Lang.translate('show_all_buttons') },
            onChange: function (v) {
                Lampa.Storage.set('show_all_buttons', v);
                Lampa.Noty.show(Lampa.Lang.translate('reloading'));
                setTimeout(function () { location.reload(); }, 200);
            }
        });

        // Режим тексту
        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: { name: 'text_mode', type: 'select', default: 'default', options: [
                { value: 'default', name: Lampa.Lang.translate('text_mode_default') },
                { value: 'show', name: Lampa.Lang.translate('text_mode_show') },
                { value: 'hide', name: Lampa.Lang.translate('text_mode_hide') }
            ]},
            field: { name: Lampa.Lang.translate('text_mode') },
            onChange: function (v) {
                Lampa.Storage.set('text_mode', v);
                applyTextMode();
            }
        });
    }

    // --- Ініціалізація ---
    function init() {
        Lang();

        if (Lampa.Storage.get('show_all_buttons') === undefined) Lampa.Storage.set('show_all_buttons', false);
        if (Lampa.Storage.get('text_mode') === undefined) Lampa.Storage.set('text_mode', 'default');

        Settings();
        showAllButtons();
        applyTextMode();
    }

    if (window.appready) init();
    else Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') init(); });
})();
