(function () {
    'use strict';

    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;
    if (window.keyboard_full_settings_plugin) return;
    window.keyboard_full_settings_plugin = true;

    const LANGUAGES = [
        { title: 'Українська', code: 'uk', hideKey: 'keyboard_hide_uk' },
        { title: 'Русский',    code: 'ru', hideKey: 'keyboard_hide_ru' },
        { title: 'English',    code: 'en', hideKey: 'keyboard_hide_en' },
        { title: 'עִברִית',   code: 'he', hideKey: 'keyboard_hide_he' }
    ];

    // Отримати поточну розкладку за замовчуванням
    function getDefaultCode() {
        let code = Lampa.Storage.get('keyboard_default_lang', 'en');
        // Якщо збережено назву мовою (старий формат) — переводимо в код
        if (code === 'Українська') code = 'uk';
        if (code === 'Русский') code = 'ru';
        if (code === 'English') code = 'en';
        if (code === 'עִברִית') code = 'he';
        return code;
    }

    // Отримати об'єкт мови за кодом
    function getLangByCode(code) {
        return LANGUAGES.find(lang => lang.code === code);
    }

    // Застосувати приховування + default
    function applySettings() {
        const defaultCode = getDefaultCode();
        const defaultLang = getLangByCode(defaultCode);

        LANGUAGES.forEach(lang => {
            const hide = Lampa.Storage.get(lang.hideKey, 'false') === 'true';
            const element = $('.selectbox-item.selector > div:contains("' + lang.title + '")');

            if (element.length > 0) {
                const parent = element.parent('.selectbox-item.selector');
                if (hide && lang.code !== defaultCode) {
                    parent.hide();
                } else {
                    parent.show();
                }
            }
        });

        // Примусово ставимо default
        Lampa.Storage.set('keyboard_default_lang', defaultCode);
    }

    // Меню вибору розкладок для вимкнення
    function openHideMenu() {
        const defaultCode = getDefaultCode();

        const items = LANGUAGES.map(lang => {
            const isHidden = Lampa.Storage.get(lang.hideKey, 'false') === 'true';
            const isDefault = lang.code === defaultCode;

            return {
                title: lang.title,
                checkbox: true,
                selected: isHidden,
                disabled: isDefault,
                langCode: lang.code,
                hideKey: lang.hideKey
            };
        });

        Lampa.Select.show({
            title: 'Вимкнути розкладки',
            items: items,
            onSelect: function (item) {
                if (item.disabled) {
                    Lampa.Noty.show('Неможливо вимкнути розкладку, яка стоїть за замовчуванням!', { timeout: 2500 });
                    return;
                }

                const current = Lampa.Storage.get(item.hideKey, 'false') === 'true';
                Lampa.Storage.set(item.hideKey, current ? 'false' : 'true');

                applySettings();
                setTimeout(openHideMenu, 100); // оновлюємо меню
            },
            onBack: function () {
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    // Додаємо компонент у Налаштування
    Lampa.SettingsApi.addComponent({
        component: 'keyboard_full_settings_plugin',
        name: 'Клавіатура (розкладки)',
        icon: '<svg fill="#fff" width="38px" height="38px" viewBox="0 0 24 24"><path d="M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Zm1 11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v8Zm-6-3H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2Zm3.5-4h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2Z"/></svg>'
    });

    // Параметр 1 — Розкладка за замовчуванням
    Lampa.SettingsApi.addParam({
        component: 'keyboard_full_settings_plugin',
        param: {
            name: 'keyboard_default_lang_select',
            type: 'select',
            default: 'uk'
        },
        field: {
            name: 'Розкладка за замовчуванням',
            description: 'Яка розкладка буде активна при відкритті клавіатури'
        },
        onRender: function (el) {
            const currentCode = getDefaultCode();

            const items = LANGUAGES.map(lang => {
                const active = Lampa.Storage.get(lang.hideKey, 'false') !== 'true';
                return {
                    title: lang.title,
                    value: lang.code,
                    selected: lang.code === currentCode && active
                };
            }).filter(item => Lampa.Storage.get(getLangByCode(item.value).hideKey, 'false') !== 'true');

            el.find('.settings-param-title').text('Розкладка за замовчуванням');

            el.off('hover:enter').on('hover:enter', function () {
                Lampa.Select.show({
                    title: 'Розкладка за замовчуванням',
                    items: items.length ? items : [{ title: 'Немає активних розкладок', value: 'en' }],
                    onSelect: function (selected) {
                        if (selected.value) {
                            Lampa.Storage.set('keyboard_default_lang', selected.value);
                            applySettings();
                            Lampa.Noty.show('Розкладка за замовчуванням змінена на ' + selected.title, { timeout: 1500 });
                        }
                    }
                });
            });
        }
    });

    // Параметр 2 — Вимкнути розкладки
    Lampa.SettingsApi.addParam({
        component: 'keyboard_full_settings_plugin',
        param: {
            name: 'keyboard_hide_trigger',
            type: 'trigger',
            default: false
        },
        field: {
            name: 'Вимкнути розкладки',
            description: 'Оберіть які розкладки приховати (крім поточної default)'
        },
        onRender: function (el) {
            el.off('hover:enter').on('hover:enter', function () {
                openHideMenu();
            });
        }
    });

    // Головний інтервал (твій робочий код)
    setInterval(function () {
        const langBtn = $('div.hg-button.hg-functionBtn.hg-button-LANG.selector.binded');
        if (langBtn.length > 0) {
            applySettings();
        }
    }, 0);

    // Запуск при старті
    function startPlugin() {
        applySettings();
        setTimeout(applySettings, 800);
        setTimeout(applySettings, 1500);
    }

    if (window.appready) {
        setTimeout(startPlugin, 600);
    } else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') {
                setTimeout(startPlugin, 600);
            }
        });
    }

    Lampa.Listener.follow('full', function (e) {
        if (e.type === 'start') {
            setTimeout(startPlugin, 1200);
        }
    });

    Lampa.Listener.follow('select', function (e) {
        if (e.type === 'open') {
            setTimeout(applySettings, 150);
            setTimeout(applySettings, 400);
        }
    });

})();
