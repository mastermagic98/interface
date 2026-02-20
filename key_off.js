(function () {
    'use strict';

    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;
    if (window.keyboard_settings_v13) return;
    window.keyboard_settings_v13 = true;

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

    function getHiddenTitles() {
        const hidden = LANGUAGES.filter(lang => Lampa.Storage.get(lang.hideKey, 'false') === 'true').map(lang => lang.title);
        return hidden.length > 0 ? hidden.join(', ') : 'Жодна';
    }

    function applySettings() {
        try {
            const defaultCode = getDefaultCode();
            console.log('[Keyboard v13] Застосовую hiding. Default:', getDefaultTitle());

            const defaultLang = LANGUAGES.find(l => l.code === defaultCode);
            if (defaultLang && Lampa.Storage.get(defaultLang.hideKey, 'false') === 'true') {
                Lampa.Storage.set(defaultLang.hideKey, 'false');
                console.log('[Keyboard v13] Автоматично включили default:', defaultLang.title, 'hide = false; перевірка:', Lampa.Storage.get(defaultLang.hideKey));
            }

            LANGUAGES.forEach(function(lang) {
                const hide = Lampa.Storage.get(lang.hideKey, 'false') === 'true';
                console.log('[Keyboard v13] Hide status з Storage for ' + lang.title + ': ' + hide);
                const shouldHide = hide && lang.code !== defaultCode;

                const element = $('.selectbox-item.selector > div:contains("' + lang.title + '")');
                if (element.length > 0) {
                    const parent = element.parent('div');
                    if (shouldHide) {
                        parent.hide();
                        console.log('[Keyboard v13] СХОВАНО:', lang.title);
                    } else {
                        parent.show();
                        console.log('[Keyboard v13] ПОКАЗАНО:', lang.title);
                    }
                } else {
                    console.log('[Keyboard v13] Не знайдено елемент:', lang.title);
                }
            });
        } catch(e) {
            console.log('[Keyboard v13] Помилка applySettings:', e.message);
        }
    }

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
                    if (langObj) {
                        Lampa.Storage.set(langObj.hideKey, 'false');
                        console.log('[Keyboard v13] Включили default:', langObj.title, 'hide = false; перевірка:', Lampa.Storage.get(langObj.hideKey));
                    }
                    Lampa.Storage.set('keyboard_default_lang', item.value);
                    console.log('[Keyboard v13] Default збережено:', item.value, 'перевірка:', Lampa.Storage.get('keyboard_default_lang'));
                    setTimeout(applySettings, 200);
                }
            },
            onBack: function() {
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

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
                const newVal = current ? 'false' : 'true';
                Lampa.Storage.set(item.key, newVal);
                console.log('[Keyboard v13] Змінено hide:', item.key, 'на', newVal, 'перевірка:', Lampa.Storage.get(item.key));
                setTimeout(applySettings, 200);
                setTimeout(openHideMenu, 100);
            },
            onBack: function() {
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    Lampa.SettingsApi.addComponent({
        component: 'keyboard_settings_v13',
        name: 'Налаштування клавіатури',
        icon: '<svg fill="#fff" width="38px" height="38px" viewBox="0 0 24 24"><path d="M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Z"/></svg>'
    });

    Lampa.SettingsApi.addParam({
        component: 'keyboard_settings_v13',
        param: {
            name: 'keyboard_default_lang',
            type: 'select',
            default: getDefaultCode(),
            values: LANGUAGES.reduce(function(acc, lang) {
                acc[lang.title] = lang.code;
                return acc;
            }, {})
        },
        field: {
            name: 'Розкладка за замовчуванням',
            description: 'Вибір мови за замовчуванням'
        },
        onChange: function(value) {
            const langObj = LANGUAGES.find(l => l.code === value);
            if (langObj) {
                Lampa.Storage.set(langObj.hideKey, 'false');
                console.log('[Keyboard v13] Включили default в onChange:', langObj.title, 'hide = false; перевірка:', Lampa.Storage.get(langObj.hideKey));
            }
            Lampa.Storage.set('keyboard_default_lang', value);
            console.log('[Keyboard v13] Default змінено в onChange:', value, 'перевірка:', Lampa.Storage.get('keyboard_default_lang'));
            setTimeout(applySettings, 200);
        },
        onRender: function(el) {
            try {
                el.off('hover:enter').on('hover:enter', openDefaultMenu);
            } catch(e) {
                console.log('[Keyboard v13] Помилка onRender default:', e.message);
            }
        }
    });

    Lampa.SettingsApi.addParam({
        component: 'keyboard_settings_v13',
        param: {
            name: 'keyboard_hide_select',
            type: 'select',
            default: '',
            values: {'Жодна': ''}
        },
        field: {
            name: 'Вимкнути розкладки',
            description: 'Вибір розкладок для вимкнення'
        },
        onChange: function() {
            // Ігнор, бо через menu
        },
        onRender: function(el) {
            try {
                const hiddenString = getHiddenTitles();
                el.find('.settings-param__value').text(hiddenString);
                el.off('hover:enter').on('hover:enter', openHideMenu);
            } catch(e) {
                console.log('[Keyboard v13] Помилка onRender hide:', e.message);
            }
        }
    });

    setInterval(function() {
        var elementCHlang = $('div.hg-button.hg-functionBtn.hg-button-LANG.selector.binded');
        if (elementCHlang.length > 0) {
            applySettings();
        }
    }, 0);

    if (window.appready) applySettings();
    else {
        Lampa.Listener.follow('app', function(e) {
            if (e.type == 'ready') {
                applySettings();
            }
        });
    }

    Lampa.Listener.follow('select', function(e) {
        if (e.type === 'open') {
            setTimeout(applySettings, 100);
            setTimeout(applySettings, 300);
        }
    });

})();
