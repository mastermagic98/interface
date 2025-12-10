(function () {
    'use strict';

    var plugin_name = 'Приховати клавіатуру';

    // Дефолтні налаштування
    var defaults = {
        default_lang: 'uk',    // uk, en, he, ru
        hide_uk: false,
        hide_en: false,
        hide_he: false,
        hide_ru: true
    };

    function getSettings() {
        var s = Lampa.Storage.get('keyboard_controller_settings', {});
        if (Object.keys(s).length === 0) {
            Lampa.Storage.set('keyboard_controller_settings', defaults);
            return defaults;
        }
        return s;
    }

    // Приховує вибрані мови зі списку вибору клавіатур
    function applyHiding() {
        var s = getSettings();

        if (s.hide_uk) $('.selectbox-item.selector > div:contains("Українська")').parent('div').hide();
        if (s.hide_en) $('.selectbox-item.selector > div:contains("English")').parent('div').hide();
        if (s.hide_he) $('.selectbox-item.selector > div:contains("עִברִית")').parent('div').hide();
        if (s.hide_ru) $('.selectbox-item.selector > div:contains("Русский"), div:contains("Russian")').parent('div').hide();
    }

    // Встановлює мову за замовчуванням при кожному відкритті клавіатури
    function setDefaultLanguage() {
        var s = getSettings();
        var code = s.default_lang || 'uk';

        // Встановлюємо в налаштування Lampa
        Lampa.Storage.set('keyboard_default_lang', code);

        // Додатково примусово перемикаємо, якщо клавіатура вже відкрита
        setTimeout(function () {
            var btn = $('.hg-button.hg-functionBtn.hg-button-LANG');
            if (btn.length === 0) return;

            var needKey = '';
            if (code === 'uk') needKey = 'ЙЦУКЕН'.split('');
            if (code === 'en') needKey = 'QWERTY'.split('');
            if (code === 'he') needKey = 'קראטון'.split('');
            if (code === 'ru') needKey = 'ЙЦУКЕН'.split(''); // однакові перші літери з укр

            var check = setInterval(function () {
                var activeKeys = $('.hg-button.hg-activeButton');
                if (activeKeys.length < 5) return;

                var found = false;
                needKey.forEach(function (k) {
                    if (activeKeys.filter(':contains("' + k + '")').length > 0) found = true;
                });

                if (found || code === 'en') {
                    clearInterval(check);
                    return;
                }

                btn.trigger('hover:enter');
            }, 80);

            setTimeout(function () { clearInterval(check); }, 2000);
        }, 300);
    }

    function start() {
        var settings = getSettings();

        // Додаємо пункт у головне меню налаштувань
        Lampa.Settings.main().render().find('[data-component="more"]').after(
            '<div class="settings-folder selector" data-action="keyboard_controller">' +
                '<div class="settings-folder__icon"><div class="icon-keyboard"></div></div>' +
                '<div class="settings-folder__name">' + plugin_name + '</div>' +
            '</div>'
        );

        // Налаштування при натисканні
        $(document).off('hover:enter', '[data-action="keyboard_controller"]').on('hover:enter', '[data-action="keyboard_controller"]', function () {
            var items = [];

            // Вибір мови за замовчуванням
            items.push({ title: 'Мова за замовчуванням', separator: true });

            items.push({
                title: 'Українська',
                selected: settings.default_lang === 'uk',
                lang: 'uk'
            });
            items.push({
                title: 'English',
                selected: settings.default_lang === 'en',
                lang: 'en'
            });
            items.push({
                title: 'עִברִית',
                selected: settings.default_lang === 'he',
                lang: 'he'
            });
            items.push({
                title: 'Русский',
                selected: settings.default_lang === 'ru',
                lang: 'ru'
            });

            items.push({ title: 'Приховати зі списку', separator: true });

            items.push({
                title: 'Приховати українську',
                selected: settings.hide_uk
            });
            items.push({
                title: 'Приховати англійську',
                selected: settings.hide_en
            });
            items.push({
                title: 'Приховати іврит',
                selected: settings.hide_he
            });
            items.push({
                title: 'Приховати російську',
                selected: settings.hide_ru
            });

            Lampa.Select.show({
                title: plugin_name,
                items: items,
                onSelect: function (a) {
                    if (a.lang) {
                        settings.default_lang = a.lang;
                        Lampa.Storage.set('keyboard_default_lang', a.lang);
                    }
                    if (a.title === 'Приховати українську') settings.hide_uk = !settings.hide_uk;
                    if (a.title === 'Приховати англійську') settings.hide_en = !settings.hide_en;
                    if (a.title === 'Приховати іврит') settings.hide_he = !settings.hide_he;
                    if (a.title === 'Приховати російську') settings.hide_ru = !settings.hide_ru;

                    Lampa.Storage.set('keyboard_controller_settings', settings);
                    applyHiding();
                    setDefaultLanguage();

                    Lampa.Controller.toggle('settings_component');
                },
                onBack: function () {
                    Lampa.Controller.toggle('settings_component');
                }
            });
        });

        // Застосовуємо при кожному відкритті пошуку/клавіатури
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'start') {
                setTimeout(function () {
                    applyHiding();
                    setDefaultLanguage();
                }, 300);
            }
        });

        // Якщо додаток вже готовий
        if (window.appready) {
            setTimeout(function () {
                applyHiding();
                setDefaultLanguage();
            }, 600);
        }
    }

    // Запуск плагіну
    if (window.appready) {
        start();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                start();
            }
        });
    }

})();
