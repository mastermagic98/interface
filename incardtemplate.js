(function () {
    'use strict';

    // ---------- HELPERS ----------
    function t(key) {
        // Повертає рядок перекладу (з урахуванням поточної мови)
        try {
            var tr = Lampa.Lang.translate(key);
            if (typeof tr === 'string') return tr;
            // інколи translate повертає об'єкт {ru,en,uk}
            var lang = Lampa.Storage.get('language') || (navigator.language ? navigator.language.substr(0, 2) : 'uk');
            if (tr && typeof tr === 'object') {
                return tr[lang] || tr.uk || tr.en || Object.keys(tr).map(function(k){ return tr[k]; })[0];
            }
            return key;
        } catch (e) {
            return key;
        }
    }

    function getBool(key, def) {
        try {
            var v = Lampa.Storage.get(key);
            if (v === undefined || v === null) return def === undefined ? false : def;
            if (v === true || v === 'true' || v === '1' || v === 1) return true;
            return false;
        } catch (e) {
            return def === undefined ? false : def;
        }
    }
    function setBool(key, val) {
        try {
            Lampa.Storage.set(key, !!val ? 'true' : 'false');
        } catch (e) {}
    }

    // ---------- LANG ----------
    function Lang() {
        try {
            Lampa.Lang.add({
                showall_name: {
                    ru: "Показывать все кнопки",
                    en: "Show all buttons",
                    uk: "Показувати всі кнопки"
                },
                showall_desc: {
                    ru: "Показывает все кнопки действий в карточке (включая скрытые под \"Смотреть\")",
                    en: "Displays all action buttons in the card (including those hidden under \"Watch\")",
                    uk: "Показує всі кнопки дій у картці (включно з прихованими під «Дивитись»)"
                },
                textmode_name: {
                    ru: "Режим відображення тексту",
                    en: "Text display mode",
                    uk: "Режим відображення тексту"
                },
                textmode_desc: {
                    ru: "Default: стандартна поведінка; Show: текст завжди; Hide: тільки іконки.",
                    en: "Default: standard behaviour; Show: text always; Hide: icons only.",
                    uk: "За замовчуванням: стандартна поведінка; Показати: текст завжди; Приховати: тільки іконки."
                },
                reloading: {
                    ru: "Перезагрузка...",
                    en: "Reloading...",
                    uk: "Перезавантаження..."
                }
            });
        } catch (e) {
            console.error('[Lang] Error', e);
        }
    }

    // ---------- APPLY TEXT MODE ----------
    function applyTextMode() {
        try {
            // Видаляємо попередній блок стилів
            var existing = document.getElementById('accent_color_textmode');
            if (existing) existing.parentNode.removeChild(existing);

            var mode = Lampa.Storage.get('text_mode') || 'default';

            if (mode === 'default') {
                // Нічого не додавати — стандартні стилі Lampa будуть працювати
                return;
            }

            var css = '';
            if (mode === 'show') {
                // текст завжди видно; не ставимо min-width, щоб ширина не була збільшена до підключення
                css += '.full-start-new__buttons .full-start__button span { display: inline !important; opacity: 1 !important; }';
            } else if (mode === 'hide') {
                // приховати текст повністю
                css += '.full-start-new__buttons .full-start__button span { display: none !important; }';
            }

            var style = document.createElement('style');
            style.id = 'accent_color_textmode';
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);
        } catch (e) {
            console.error('[applyTextMode] Error', e);
        }
    }

    // ---------- SHOW ALL BUTTONS (listener) ----------
    function ShowAllButtons() {
        try {
            Lampa.Listener.follow('full', function (e) {
                if (e.type !== 'complite') return;

                setTimeout(function () {
                    try {
                        if (!getBool('showall', false)) return;

                        var fullContainer = e.object.activity.render();
                        var targetContainer = fullContainer.find('.full-start-new__buttons');
                        if (!targetContainer || !targetContainer.length) return;

                        // прибираємо стандартну кнопку Play (як в оригіналі)
                        fullContainer.find('.button--play').remove();

                        // беремо всі кнопки з панелі та з контейнера
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

                        var order = Lampa.Storage.get('buttonsort') || ['torrent', 'online', 'trailer', 'other'];

                        targetContainer.empty();
                        order.forEach(function (c) {
                            var arr = categories[c] || [];
                            for (var i = 0; i < arr.length; i++) {
                                targetContainer.append(arr[i]);
                            }
                        });

                        // трохи стилю для контейнера, без примусу ширини кнопок
                        targetContainer.css({ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-start' });

                        // після перестановки застосувати режим тексту (якщо користувач вибрав show/hide)
                        applyTextMode();

                        // оновити контролер
                        Lampa.Controller.toggle('full_start');
                    } catch (err) {
                        console.error('[ShowAllButtons] Inner error', err);
                    }
                }, 120);
            });
        } catch (e) {
            console.error('[ShowAllButtons] Setup error', e);
        }
    }

    // ---------- SETTINGS ----------
    function Settings() {
        try {
            // showall (тригер) — завжди додаємо
            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
                param: { name: 'showall', type: 'trigger', default: false },
                field: { name: t('showall_name'), description: t('showall_desc') },
                onChange: function (value) {
                    setBool('showall', value);
                    // щоб зміни застосувалися в усій апці, перезавантажуємо UI
                    setTimeout(function () {
                        Lampa.Noty.show(t('reloading'));
                        location.reload();
                    }, 250);
                }
            });

            // text_mode — використовуємо list/select. values мають name як рядок (локалізований)
            var vals = [
                { name: t('textmode_default') || 'За замовчуванням', value: 'default' },
                { name: t('textmode_show') || 'Показати текст', value: 'show' },
                { name: t('textmode_hide') || 'Приховати текст', value: 'hide' }
            ];

            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
                param: {
                    name: 'text_mode',
                    type: 'list',
                    default: 'default'
                },
                field: {
                    name: t('textmode_name'),
                    description: t('textmode_desc'),
                    values: vals
                },
                onChange: function (value) {
                    try {
                        Lampa.Storage.set('text_mode', value);
                        // застосувати одразу без перезавантаження
                        applyTextMode();
                    } catch (e) {
                        console.error('[Settings:text_mode] onChange error', e);
                    }
                }
            });

        } catch (e) {
            console.error('[Settings] Build error', e);
        }
    }

    // ---------- INIT ----------
    function init() {
        try {
            Lang();

            // дефолти
            if (Lampa.Storage.get('showall') === undefined) setBool('showall', false);
            if (!Lampa.Storage.get('text_mode')) Lampa.Storage.set('text_mode', 'default');

            Settings();
            ShowAllButtons();
            applyTextMode();

            // при кожному відкритті картки перевіряємо текстовий режим (щоб застосувати на динамічних рендерах)
            Lampa.Listener.follow('full', function (e) {
                if (e.type === 'render' || e.type === 'complite') {
                    setTimeout(applyTextMode, 80);
                }
            });

        } catch (e) {
            console.error('[Plugin Init] Error', e);
        }
    }

    // старт
    if (window.appready) init();
    else Lampa.Listener.follow('app', function (e) { if (e.type === 'ready') init(); });

})();
