(function () {
    'use strict';

    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;
    if (window.keyboard_settings_v2) return;
    window.keyboard_settings_v2 = true;

    const LANGUAGES = [
        { title: 'Українська', code: 'uk', hideKey: 'keyboard_hide_uk' },
        { title: 'Русский',    code: 'ru', hideKey: 'keyboard_hide_ru' },
        { title: 'English',    code: 'en', hideKey: 'keyboard_hide_en' },
        { title: 'עִברִית',   code: 'he', hideKey: 'keyboard_hide_he' }
    ];

    function getDefaultCode() {
        let code = Lampa.Storage.get('keyboard_default_lang', 'en');
        if (code === 'Українська') code = 'uk';
        if (code === 'Русский') code = 'ru';
        if (code === 'English') code = 'en';
        if (code === 'עִברִית') code = 'he';
        return code;
    }

    function applySettings() {
        try {
            const defaultCode = getDefaultCode();

            LANGUAGES.forEach(function(lang) {
                const shouldHide = Lampa.Storage.get(lang.hideKey, 'false') === 'true';
                const element = $('.selectbox-item.selector > div:contains("' + lang.title + '")').parent('.selectbox-item.selector');

                if (element.length > 0) {
                    if (shouldHide && lang.code !== defaultCode) {
                        element.hide();
                    } else {
                        element.show();
                    }
                }
            });

            Lampa.Storage.set('keyboard_default_lang', defaultCode);
        } catch(e) {
            console.log('[Keyboard plugin] applySettings error:', e.message);
        }
    }

    // Меню вибору розкладки за замовчуванням
    function openDefaultMenu() {
        const current = getDefaultCode();

        const items = LANGUAGES.map(function(lang) {
            return {
                title: lang.title,
                value: lang.code,
                selected: lang.code === current
            };
        });

        Lampa.Select.show({
            title: 'Розкладка за замовчуванням',
            items: items,
            onSelect: function(item) {
                if (item.value) {
                    // Автоматично вмикаємо цю розкладку
                    const langObj = LANGUAGES.find(function(l) { return l.code === item.value; });
                    if (langObj) Lampa.Storage.set(langObj.hideKey, 'false');

                    Lampa.Storage.set('keyboard_default_lang', item.value);
                    applySettings();
                    console.log('Default keyboard set to:', item.title);
                }
            },
            onBack: function() {
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    // Меню вимкнення розкладок (з захистом default)
    function openHideMenu() {
        const defaultCode = getDefaultCode();

        const items = LANGUAGES.map(function(lang) {
            const isHidden = Lampa.Storage.get(lang.hideKey, 'false') === 'true';
            return {
                title: lang.title + (lang.code === defaultCode ? ' ← за замовчуванням' : ''),
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

                const newVal = item.selected ? 'false' : 'true';
                Lampa.Storage.set(item.key, newVal);

                applySettings();
                setTimeout(openHideMenu, 100); // оновлюємо меню
            },
            onBack: function() {
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    // === Додаємо в налаштування Лампи ===
    Lampa.SettingsApi.addComponent({
        component: 'keyboard_settings_v2',
        name: 'Налаштування клавіатури',
        icon: '<svg fill="#fff" width="38px" height="38px" viewBox="0 0 24 24"><path d="M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Z"/></svg>'
    });

    Lampa.SettingsApi.addParam({
        component: 'keyboard_settings_v2',
        param: { name: 'keyboard_default_trigger', type: 'trigger', default: false },
        field: { name: 'Розкладка за замовчуванням', description: 'Яка мова буде активна при відкритті' },
        onRender: function(el) {
            el.off('hover:enter').on('hover:enter', openDefaultMenu);
        }
    });

    Lampa.SettingsApi.addParam({
        component: 'keyboard_settings_v2',
        param: { name: 'keyboard_hide_trigger', type: 'trigger', default: false },
        field: { name: 'Вимкнути розкладки', description: 'Приховати непотрібні (крім default)' },
        onRender: function(el) {
            el.off('hover:enter').on('hover:enter', openHideMenu);
        }
    });

    // === Твій перевірений інтервал ===
    setInterval(function() {
        if ($('div.hg-button.hg-functionBtn.hg-button-LANG.selector.binded').length > 0) {
            applySettings();
        }
    }, 80);

    // Запуск плагіна
    function start() {
        applySettings();
        setTimeout(applySettings, 800);
        setTimeout(applySettings, 1600);
    }

    if (window.appready) {
        start();
    } else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type === 'ready') start();
        });
    }

    Lampa.Listener.follow('full', function(e) {
        if (e.type === 'start') setTimeout(start, 1200);
    });

    Lampa.Listener.follow('select', function(e) {
        if (e.type === 'open') setTimeout(applySettings, 250);
    });

})();
