(function () {
    'use strict';

    // --- Локалізація ---
    function Lang() {
        Lampa.Lang.add({
            show_all_buttons: {
                ru: "Показать все кнопки",
                en: "Show all buttons",
                uk: "Показати всі кнопки"
            },
            text_mode: {
                ru: "Режим текста на кнопках",
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

    // --- Показ всіх кнопок ---
    function ShowAllButtons() {
        Lampa.Listener.follow('full', function (e) {
            if (e.type !== 'complite') return;
            setTimeout(function () {
                var fullContainer = e.object.activity.render();
                var targetContainer = fullContainer.find('.full-start-new__buttons');
                if (!targetContainer.length) return;

                // Всі кнопки з панелі та сховані під "Дивитись"
                var allButtons = fullContainer.find('.buttons--container .full-start__button')
                    .add(targetContainer.find('.full-start__button'));

                // Категорії
                var categories = { online: [], torrent: [], trailer: [], other: [] };
                allButtons.each(function () {
                    var $b = $(this);
                    var cls = $b.attr('class') || '';
                    if (cls.indexOf('online') !== -1) categories.online.push($b);
                    else if (cls.indexOf('torrent') !== -1) categories.torrent.push($b);
                    else if (cls.indexOf('trailer') !== -1) categories.trailer.push($b);
                    else categories.other.push($b.clone(true));
                });

                // Порядок
                var order = ['torrent','online','trailer','other'];
                targetContainer.empty();
                order.forEach(function(c){
                    categories[c].forEach(function($b){
                        targetContainer.append($b);
                    });
                });

                targetContainer.css({ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-start' });

                // Перевірка режиму тексту
                applyTextMode();
                Lampa.Controller.toggle('full_start');
            }, 100);
        });
    }

    // --- Режим тексту ---
    function applyTextMode() {
        var mode = Lampa.Storage.get('text_mode') || 'default';
        var $buttons = $('.full-start-new__buttons .full-start__button');

        // Видаляємо кастомні стилі
        $('#text-mode-style').remove();

        if (mode === 'default') {
            // нічого не змінюємо, стандартна Lampa логіка
        } else if (mode === 'show') {
            // Текст видно на всіх кнопках
            $buttons.each(function () {
                $(this).find('span').show();
            });
        } else if (mode === 'hide') {
            // Текст прихований
            $buttons.each(function () {
                $(this).find('span').hide();
            });
        }
    }

    // --- Налаштування ---
    function Settings() {
        // Показати всі кнопки
        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: { name: 'show_all_buttons', type: 'trigger', default: false },
            field: { name: Lampa.Lang.translate('show_all_buttons'), description: '' },
            onChange: function(value){
                Lampa.Storage.set('show_all_buttons', value);
                setTimeout(function(){
                    Lampa.Noty.show(Lampa.Lang.translate('reloading'));
                    location.reload();
                }, 200);
            }
        });

        // Режим тексту
        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: { name: 'text_mode', type: 'select', default: 'default', values: [
                { name: Lampa.Lang.translate('text_mode_default'), value: 'default' },
                { name: Lampa.Lang.translate('text_mode_show'), value: 'show' },
                { name: Lampa.Lang.translate('text_mode_hide'), value: 'hide' }
            ]},
            field: { name: Lampa.Lang.translate('text_mode'), description: '' },
            onChange: function(value){
                Lampa.Storage.set('text_mode', value);
                applyTextMode();
            }
        });
    }

    // --- Ініціалізація ---
    function init() {
        Lang();

        // Значення за замовчуванням
        if (Lampa.Storage.get('show_all_buttons') === undefined) Lampa.Storage.set('show_all_buttons', false);
        if (Lampa.Storage.get('text_mode') === undefined) Lampa.Storage.set('text_mode', 'default');

        Settings();
        if (Lampa.Storage.get('show_all_buttons') === true) ShowAllButtons();
        applyTextMode();
    }

    if (window.appready) init();
    else Lampa.Listener.follow('app', function(e){
        if (e.type==='ready') init();
    });
})();
