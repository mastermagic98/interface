(function () {
    'use strict';

    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;
    if (window.keyboard_settings_v4) return;
    window.keyboard_settings_v4 = true;

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

    function getDefaultTitle() {
        const code = getDefaultCode();
        const lang = LANGUAGES.find(l => l.code === code);
        return lang ? lang.title : 'Українська';
    }

    // Головна функція приховування (твій оригінальний стиль)
    function applySettings() {
        try {
            const defaultCode = getDefaultCode();
            console.log('[Keyboard v4] Default:', getDefaultTitle(), '(' + defaultCode + ')');

            LANGUAGES.forEach(function(lang) {
                const hide = Lampa.Storage.get(lang.hideKey, 'false') === 'true';
                const shouldHide = hide && lang.code !== defaultCode;

                const element = $('.selectbox-item.selector > div:contains("' + lang.title + '")');
                if (element.length > 0) {
                    const parent = element.parent('div');
                    if (shouldHide) {
                        parent.hide();
                        console.log('[Keyboard v4] СХОВАНО:', lang.title);
                    } else {
                        parent.show();
                        console.log('[Keyboard v4] ПОКАЗАНО:', lang.title);
                    }
                }
            });
        } catch(e) {
            console.log('[Keyboard v4] помилка:', e.message);
        }
    }

    // Меню вибору розкладки за замовчуванням
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
                }
            },
            onBack: function() {
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    // Меню вимкнення розкладок (виправлена логіка!)
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
                if (item.disabled) {
                    console.log('[Keyboard v4] Заборонено вимкнути default');
                    return;
                }
                // ТОГЛ через Storage — як у твоєму робочому коді
                const current = Lampa.Storage.get(item.key, 'false') === 'true';
                Lampa.Storage.set(item.key, current ? 'false' : 'true');

                applySettings();
                setTimeout(openHideMenu, 80); // оновлюємо меню
            },
            onBack: function() {
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    // Налаштування в меню Лампи
    Lampa.SettingsApi.addComponent({
        component: 'keyboard_settings_v4',
        name: 'Налаштування клавіатури',
        icon: '<svg fill="#fff" width="38px" height="38px" viewBox="0 0 24 24"><path d="M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Z"/></svg>'
    });

    Lampa.SettingsApi.addParam({
        component: 'keyboard_settings_v4',
        param: { name: 'keyboard_default', type: 'trigger' },
        field: { name: 'Розкладка за замовчуванням', description: 'Поточна: ' + getDefaultTitle() },
        onRender: function(el) {
            el.on('hover:enter', openDefaultMenu);
        }
    });

    Lampa.SettingsApi.addParam({
        component: 'keyboard_settings_v4',
        param: { name: 'keyboard_hide', type: 'trigger' },
        field: { name: 'Вимкнути розкладки', description: 'Приховати непотрібні (крім default)' },
        onRender: function(el) {
            el.on('hover:enter', openHideMenu);
        }
    });

    // Твій улюблений інтервал
    setInterval(function() {
        if ($('div.hg-button.hg-functionBtn.hg-button-LANG.selector.binded').length > 0) {
            applySettings();
        }
    }, 0);

    // Запуск
    function start() {
        applySettings();
        setTimeout(applySettings, 500);
        setTimeout(applySettings, 1200);
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
