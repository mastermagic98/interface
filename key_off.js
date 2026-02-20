(function () {
    'use strict';

    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;
    if (window.keyboard_settings_v5) return;
    window.keyboard_settings_v5 = true;

    const LANGUAGES = [
        { title: 'Українська', code: 'uk', hideKey: 'keyboard_hide_uk' },
        { title: 'Русский',    code: 'ru', hideKey: 'keyboard_hide_ru' },
        { title: 'English',    code: 'en', hideKey: 'keyboard_hide_en' },
        { title: 'עִברִית',   code: 'he', hideKey: 'keyboard_hide_he' }
    ];

    function getDefaultCode() {
        let code = Lampa.Storage.get('keyboard_default_lang', 'uk');
        if (code === 'Українська') code = 'uk';
        if (code === 'Русский') code = 'ru';
        if (code === 'English') code = 'en';
        if (code === 'עִברִית') code = 'he';
        return code;
    }

    function getDefaultTitle() {
        const code = getDefaultCode();
        const lang = LANGUAGES.find(l => l.code === code);
        return lang ? lang.title : 'Українська';
    }

    // Головна функція — твій оригінальний стиль
    function applySettings() {
        try {
            const defaultCode = getDefaultCode();
            console.log('[Keyboard v5] Default:', getDefaultTitle(), '(' + defaultCode + ')');

            LANGUAGES.forEach(function(lang) {
                const hide = Lampa.Storage.get(lang.hideKey, 'false') === 'true';
                const shouldHide = hide && lang.code !== defaultCode;

                const element = $('.selectbox-item.selector > div:contains("' + lang.title + '")');
                if (element.length > 0) {
                    const parent = element.parent('div');
                    if (shouldHide) {
                        parent.hide();
                        console.log('[Keyboard v5] СХОВАНО:', lang.title, '(hideKey = true)');
                    } else {
                        parent.show();
                        console.log('[Keyboard v5] ПОКАЗАНО:', lang.title, '(hideKey = false)');
                    }
                } else {
                    console.log('[Keyboard v5] Не знайдено елемент:', lang.title);
                }
            });
        } catch(e) {
            console.log('[Keyboard v5] Помилка applySettings:', e.message);
        }
    }

    // Меню вибору розкладки за замовчуванням (тепер select)
    function openDefaultMenu() {
        const currentCode = getDefaultCode();
        const items = LANGUAGES.map(function(lang) {
            return {
                title: lang.title,
                value: lang.code,
                selected: lang.code === currentCode
            };
        });

        Lampa.Select.show({
            title: 'Розкладка за замовчуванням',
            items: items,
            onSelect: function(item) {
                if (item.value) {
                    const langObj = LANGUAGES.find(l => l.code === item.value);
                    if (langObj) Lampa.Storage.set(langObj.hideKey, 'false'); // вмикаємо її
                    Lampa.Storage.set('keyboard_default_lang', item.value);
                    applySettings();
                    setTimeout(applySettings, 200);
                }
            },
            onBack: function() {
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    // Меню вимкнення розкладок
    function openHideMenu() {
        const defaultCode = getDefaultCode();
        const items = LANGUAGES.map(function(lang) {
            const isHidden = Lampa.Storage.get(lang.hideKey, 'false') === 'true';
            return {
                title: lang.title,
                checkbox: true,
                selected: isHidden,
                disabled: lang.code === defaultCode,
                key: lang.hideKey
            };
        });

        Lampa.Select.show({
            title: 'Вимкнути розкладки',
            items: items,
            onSelect: function(item) {
                if (item.disabled) return;

                const current = Lampa.Storage.get(item.key, 'false') === 'true';
                Lampa.Storage.set(item.key, current ? 'false' : 'true');

                applySettings();
                setTimeout(applySettings, 200);
                setTimeout(openHideMenu, 100); // оновлюємо меню
            },
            onBack: function() {
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    // === Налаштування в меню Лампи ===
    Lampa.SettingsApi.addComponent({
        component: 'keyboard_settings_v5',
        name: 'Налаштування клавіатури',
        icon: '<svg fill="#fff" width="38px" height="38px" viewBox="0 0 24 24"><path d="M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Z"/></svg>'
    });

    // Параметр 1 — Розкладка за замовчуванням (type: select)
    Lampa.SettingsApi.addParam({
        component: 'keyboard_settings_v5',
        param: {
            name: 'keyboard_default_lang',
            type: 'select',
            default: 'uk'
        },
        field: {
            name: 'Розкладка за замовчуванням',
            description: 'Поточна: ' + getDefaultTitle()
        },
        onRender: function(el) {
            const currentTitle = getDefaultTitle();
            el.find('.settings-param-title').text('Розкладка за замовчуванням: ' + currentTitle);

            el.off('hover:enter').on('hover:enter', openDefaultMenu);
        }
    });

    // Параметр 2 — Вимкнути розкладки (trigger)
    Lampa.SettingsApi.addParam({
        component: 'keyboard_settings_v5',
        param: { name: 'keyboard_hide_trigger', type: 'trigger', default: false },
        field: { name: 'Вимкнути розкладки', description: 'Вибрати які приховати' },
        onRender: function(el) {
            el.off('hover:enter').on('hover:enter', openHideMenu);
        }
    });

    // Твій перевірений інтервал
    setInterval(function() {
        if ($('div.hg-button.hg-functionBtn.hg-button-LANG.selector.binded').length > 0) {
            applySettings();
        }
    }, 0);

    // Запуск плагіна
    function start() {
        applySettings();
        setTimeout(applySettings, 600);
        setTimeout(applySettings, 1400);
    }

    if (window.appready) start();
    else Lampa.Listener.follow('app', function(e) {
        if (e.type === 'ready') start();
    });

    Lampa.Listener.follow('full', function(e) {
        if (e.type === 'start') setTimeout(start, 1500);
    });

    Lampa.Listener.follow('select', function(e) {
        if (e.type === 'open') {
            setTimeout(applySettings, 150);
            setTimeout(applySettings, 500);
        }
    });

})();
