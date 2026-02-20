(function () {
    'use strict';

    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;
    if (window.keyboard_settings_v7) return;
    window.keyboard_settings_v7 = true;

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

    // Головна функція приховування
    function applySettings() {
        try {
            const defaultCode = getDefaultCode();
            console.log('[Keyboard v7] Default:', getDefaultTitle(), '(' + defaultCode + ')');
            console.log('[Keyboard v7] Hide values:', LANGUAGES.map(l => l.title + ': ' + Lampa.Storage.get(l.hideKey, 'false')));

            LANGUAGES.forEach(function(lang) {
                const hide = Lampa.Storage.get(lang.hideKey, 'false') === 'true';
                const shouldHide = hide && lang.code !== defaultCode;

                const element = $('.selectbox-item.selector > div:contains("' + lang.title + '")');
                if (element.length > 0) {
                    const parent = element.parent('div');
                    if (shouldHide) {
                        parent.hide();
                        console.log('[Keyboard v7] СХОВАНО:', lang.title);
                    } else {
                        parent.show();
                        console.log('[Keyboard v7] ПОКАЗАНО:', lang.title);
                    }
                } else {
                    console.log('[Keyboard v7] Не знайдено елемент для:', lang.title);
                }
            });
        } catch(e) {
            console.log('[Keyboard v7] Помилка applySettings:', e.message);
        }
    }

    // Меню вибору default
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
                    if (langObj) Lampa.Storage.set(langObj.hideKey, 'false');
                    Lampa.Storage.set('keyboard_default_lang', item.value);
                    setTimeout(applySettings, 200);
                    console.log('[Keyboard v7] Default змінено на:', item.title);
                }
            },
            onBack: function() {
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    // Меню вимкнення
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
                console.log('[Keyboard v7] Змінено ' + item.key + ' на ' + newVal);

                setTimeout(applySettings, 200);
                setTimeout(openHideMenu, 100);
            },
            onBack: function() {
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    // Додаємо компонент
    Lampa.SettingsApi.addComponent({
        component: 'keyboard_settings_v7',
        name: 'Налаштування клавіатури',
        icon: '<svg fill="#fff" width="38px" height="38px" viewBox="0 0 24 24"><path d="M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Z"/></svg>'
    });

    // Параметр default - trigger з заміною 'Так'
    Lampa.SettingsApi.addParam({
        component: 'keyboard_settings_v7',
        param: {
            name: 'keyboard_default_trigger',
            type: 'trigger',
            default: false
        },
        field: {
            name: 'Розкладка за замовчуванням',
            description: 'Вибір мови за замовчуванням'
        },
        onRender: function(el) {
            try {
                const currentTitle = getDefaultTitle();
                el.find('.settings-param__value').text(currentTitle);
            } catch(e) {
                console.log('[Keyboard v7] Помилка onRender default:', e.message);
            }
            el.off('hover:enter').on('hover:enter', openDefaultMenu);
        }
    });

    // Параметр hide - trigger
    Lampa.SettingsApi.addParam({
        component: 'keyboard_settings_v7',
        param: {
            name: 'keyboard_hide_trigger',
            type: 'trigger',
            default: false
        },
        field: {
            name: 'Вимкнути розкладки',
            description: 'Вибір розкладок для вимкнення'
        },
        onRender: function(el) {
            el.off('hover:enter').on('hover:enter', openHideMenu);
        }
    });

    // Інтервал тільки для перевірки кнопки LANG
    setInterval(function() {
        if ($('div.hg-button.hg-functionBtn.hg-button-LANG.selector.binded').length > 0) {
            setTimeout(applySettings, 100);
        }
    }, 50);

    // Додаємо listener на клік по кнопці LANG
    function setupListeners() {
        $('body').on('click', '.hg-button.hg-functionBtn.hg-button-LANG.selector.binded', function() {
            setTimeout(applySettings, 50);
            setTimeout(applySettings, 200);
            console.log('[Keyboard v7] Натиснуто LANG - застосовую hiding');
        });
    }

    // Запуск
    function start() {
        setupListeners();
    }

    if (window.appready) start();
    else Lampa.Listener.follow('app', function(e) {
        if (e.type === 'ready') start();
    });

    Lampa.Listener.follow('full', function(e) {
        if (e.type === 'start') setTimeout(setupListeners, 1500);
    });

    Lampa.Listener.follow('select', function(e) {
        if (e.type === 'open') {
            setTimeout(applySettings, 100);
            setTimeout(applySettings, 300);
        }
    });

})();
