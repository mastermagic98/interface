(function () {
    'use strict';

    var plugin_name = 'Приховати клавіатуру';

    var defaults = {
        default_lang: 'uk',  // uk | en | he | ru
        hide_uk: false,
        hide_en: false,
        hide_he: false,
        hide_ru: true
    };

    function getSettings() {
        var s = Lampa.Storage.get('keyboard_controller_v2', {});
        if (Object.keys(s).length === 0) {
            Lampa.Storage.set('keyboard_controller_v2', defaults);
            return defaults;
        }
        return s;
    }

    function applyHiding() {
        var s = getSettings();
        if (s.hide_uk) $('.selectbox-item.selector > div:contains("Українська")').parent().hide();
        if (s.hide_en) $('.selectbox-item.selector > div:contains("English")').parent().hide();
        if (s.hide_he) $('.selectbox-item.selector > div:contains("עִברִית")').parent().hide();
        if (s.hide_ru) $('.selectbox-item.selector > div:contains("Русский"), .selectbox-item.selector > div:contains("Russian")').parent().hide();
    }

    function setDefaultLanguage() {
        var s = getSettings();
        Lampa.Storage.set('keyboard_default_lang', s.default_lang);

        setTimeout(function () {
            var btn = $('.hg-button.hg-functionBtn.hg-button-LANG');
            if (btn.length === 0) return;

            var target = '';
            if (s.default_lang === 'uk') target = 'Й';
            if (s.default_lang === 'en') target = 'Q';
            if (s.default_lang === 'he') target = 'ש';
            if (s.default_lang === 'ru') target = 'Й';

            var attempts = 0;
            var checker = setInterval(function () {
                attempts++;
                if ($('.hg-button.hg-activeButton:contains("' + target + '")').length > 0 || attempts > 15) {
                    clearInterval(checker);
                    return;
                }
                btn.trigger('hover:enter');
            }, 100);
        }, 350);
    }

    function start() {
        // Додаємо пункт в меню
        Lampa.Settings.main().render().find('[data-component="more"]').after(
            '<div class="settings-folder selector" data-action="kb_ctrl">' +
                '<div class="settings-folder__icon"><div class="icon-keyboard"></div></div>' +
                '<div class="settings-folder__name">' + plugin_name + '</div>' +
            '</div>'
        );

        // Обробник натискання
        $(document).off('hover:enter', '[data-action="kb_ctrl"]').on('hover:enter', '[data-action="kb_ctrl"]', function () {
            var s = getSettings();

            var items = [];

            // === Мова за замовчуванням ===
            items.push({ title: 'Мова за замовчуванням', separator: true });

            items.push({ title: 'Українська',   selected: s.default_lang === 'uk',   lang_code: 'uk' });
            items.push({ title: 'English',      selected: s.default_lang === 'en',   lang_code: 'en' });
            items.push({ title: 'עִברִית',      selected: s.default_lang === 'he',   lang_code: 'he' });
            items.push({ title: 'Русский',      selected: s.default_lang === 'ru',   lang_code: 'ru' });

            // === Приховати зі списку ===
            items.push({ title: 'Приховати зі списку', separator: true });

            });
            items.push({ title: 'Приховати українську',  selected: s.hide_uk,  hide_key: 'uk' });
            items.push({ title: 'Приховати англійську',  selected: s.hide_en,  hide_key: 'en' });
            items.push({ title: 'Приховати іврит',      selected: s.hide_he,  hide_key: 'he' });
            items.push({ title: 'Приховати російську',   selected: s.hide_ru,  hide_key: 'ru' });

            Lampa.Select.show({
                title: plugin_name,
                items: items,
                onSelect: function (item) {
                    // Зміна мови за замовчуванням
                    if (item.lang_code) {
                        s.default_lang = item.lang_code;
                        Lampa.Storage.set('keyboard_default_lang', item.lang_code);
                    }

                    // Перемикач приховування
                    if (item.hide_key === 'uk') s.hide_uk = !s.hide_uk;
                    if (item.hide_key === 'en') s.hide_en = !s.hide_en;
                    if (item.hide_key === 'he') s.hide_he = !s.hide_he;
                    if (item.hide_key === 'ru') s.hide_ru = !s.hide_ru;

                    Lampa.Storage.set('keyboard_controller_v2', s);

                    applyHiding();
                    setDefaultLanguage();

                    // Оновлюємо список, щоб галочки змінилися
                    Lampa.Settings.main().refresh();
                },
                onBack: function () {
                    Lampa.Controller.toggle('settings_component');
                }
            });
        });

        // При відкритті пошуку
        Lampa.Listener.follow('full', function (e) {
            if (e.type === 'start') {
                setTimeout(function () {
                    applyHiding();
                    setDefaultLanguage();
                }, 300);
            }
        });

        // Якщо додаток вже запущений
        if (window.appready) {
            setTimeout(function () {
                applyHiding();
                setDefaultLanguage();
            }, 600);
        }
    }

    // Запуск
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
