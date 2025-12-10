(function () {
    'use strict';

    var plugin_name = 'Приховувати клавіатури + Українська за замовчуванням';

    // Налаштування за замовчуванням
    var default_settings = {
        hide_ua: false,   // Українську тепер НЕ ховаємо (вона головна)
        hide_ru: true,    // Російську ховаємо
        hide_en: true,    // Англійську ховаємо (можна змінити)
        hide_he: true     // Іврит ховаємо
    };

    function initSettings() {
        var settings = Lampa.Storage.get('keyboard_hider_ua_settings', {});
        if (Object.keys(settings).length === 0) {
            Lampa.Storage.set('keyboard_hider_ua_settings', default_settings);
            settings = default_settings;
        }
        return settings;
    }

    // Приховуємо вибрані мови
    function hideKeyboards() {
        var settings = initSettings();

        if (settings.hide_ua) {
            $('.selectbox-item.selector > div:contains("Українська")').parent('div').hide();
        }
        if (settings.hide_ru) {
            $('.selectbox-item.selector > div:contains("Русский")').parent('div').hide();
        }
        if (settings.hide_en) {
            $('.selectbox-item.selector > div:contains("English")').parent('div').hide();
        }
        if (settings.hide_he) {
            $('.selectbox-item.selector > div:contains("עִברִית")').parent('div').hide();
        }
    }

    // Примусово встановлюємо українську мову клавіатури (аналог CultureInfo.CurrentCulture = new CultureInfo("uk-UA"))
    function forceUkrainianKeyboard() {
        // В Lampa віртуальна клавіатура використовує власний механізм, тому ми:
        // 1. Встановлюємо потрібну мову в налаштуваннях Lampa
        Lampa.Storage.set('keyboard_default_lang', 'uk');

        // 2. Якщо відкрита клавіатура — примусово перемикаємо на українську
        setTimeout(function () {
            var langButton = $('.hg-button.hg-functionBtn.hg-button-LANG');
            if (langButton.length > 0) {
                // Імітуємо натискання кнопки зміни мови кілька разів, доки не стане українська
                var maxAttempts = 10;
                var attempt = 0;
                var switchInterval = setInterval(function () {
                    if (attempt >= maxAttempts) {
                        clearInterval(switchInterval);
                        return;
                    }
                    langButton.trigger('hover:enter');
                    attempt++;

                    // Перевіряємо, чи вже українська розкладка активна
                    if ($('.hg-button.hg-activeButton:contains("Й")').length > 0 ||
                        $('.hg-button.hg-activeButton:contains("Ц")').length > 0) {
                        clearInterval(switchInterval);
                    }
                }, 100);
            }
        }, 400);
    }

    function startPlugin() {
        // Додаємо пункт у меню налаштувань
        Lampa.Settings.main().render().find('[data-component="more"]').after(
            '<div class="settings-folder selector" data-action="keyboard_hider_ua">' +
                '<div class="settings-folder__icon"><div class="icon-flag-ua" style="background-image:ur[](https://flagcdn.com/28x21/ua.png)"></div></div>' +
                '<div class="settings-folder__name">' + plugin_name + '</div>' +
                '<div class="settings-folder__descr">Українська клавіатура завжди, інші — за бажанням</div>' +
            '</div>'
        );

        // Підменю з налаштуваннями
        Lampa.Settings.main().update = function () {
            var settings = initSettings();

            $('.settings-folder[data-action="keyboard_hider_ua"]').off('hover:enter').on('hover:enter', function () {
                var items = [];

                items.push({
                    title: 'Українська клавіатура',
                    subtitle: 'Завжди активна та видима',
                    selected: true,
                    disabled: true
                });

                items.push({
                    title: 'Приховати російську',
                    subtitle: settings.hide_ru ? 'Прихована' : 'Видима',
                    selected: settings.hide_ru
                });

                items.push({
                    title: 'Приховати англійську',
                    subtitle: settings.hide_en ? 'Прихована' : 'Видима',
                    selected: settings.hide_en
                });

                items.push({
                    title: 'Приховати іврит (עִברִית)',
                    subtitle: settings.hide_he ? 'Прихована' : 'Видима',
                    selected: settings.hide_he
                });

                Lampa.Select.show({
                    title: plugin_name,
                    items: items,
                    onSelect: function (a) {
                        var key = '';
                        if (a.title === 'Приховати російську') key = 'hide_ru';
                        if (a.title === 'Приховати англійську') key = 'hide_en';
                        if (a.title === 'Приховати іврит (עִברִית)') key = 'hide_he';

                        if (key) {
                            settings[key] = !settings[key];
                            Lampa.Storage.set('keyboard_hider_ua_settings', settings);
                            hideKeyboards();
                            Lampa.Settings.main().refresh();
                        }
                    },
                    onBack: function () {
                        Lampa.Controller.toggle('settings_component');
                    }
                });
            });
        };

        // При кожному відкритті пошуку/клавіатури
        Lampa.Listener.follow('full', function (e) {
            if (e.type == 'start') {
                setTimeout(function () {
                    forceUkrainianKeyboard(); // завжди українська
                    hideKeyboards();          // ховаємо непотрібні
                }, 300);
            }
        });

        // Якщо додаток вже запущений
        if (window.appready) {
            setTimeout(function () {
                forceUkrainianKeyboard();
                hideKeyboards();
            }, 600);
        }
    }

    // Запуск
    if (window.appready) {
        startPlugin();
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') {
                startPlugin();
            }
        });
    }

})();
