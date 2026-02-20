(function () {
    'use strict';

    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;
    if (window.keyboard_settings_v8) return;
    window.keyboard_settings_v8 = true;

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
            LANGUAGES.forEach(function(lang) {
                const hide = Lampa.Storage.get(lang.hideKey, 'false') === 'true';
                const shouldHide = hide && lang.code !== defaultCode;

                const element = $('.selectbox-item.selector > div:contains("' + lang.title + '")');
                if (element.length > 0) {
                    const parent = element.parent('div');
                    if (shouldHide) {
                        parent.hide();
                    } else {
                        parent.show();
                    }
                }
            });
        } catch(e) {}
    }

    // Меню вибору default для select
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
                }
            },
            onBack: function() {
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    // Меню вимкнення (як закладки в Лампі - чекбокси)
    function openHideMenu() {
        const defaultCode = getDefaultCode();
        const items = [];

        // Додаємо заголовок як в прикладі (settings-param-title)
        // Але оскільки Lampa.Select.show не підтримує заголовки, робимо перший пункт як заголовок (неклікабельний)
        items.push({
            title: 'Статус розкладок',
            subtitle: true // Для імітації заголовка
        });

        // Додаємо чекбокси для кожної мови (як "Дивлюся - Українська")
        LANGUAGES.forEach(function(lang) {
            const isHidden = Lampa.Storage.get(lang.hideKey, 'false') === 'true';
            items.push({
                title: lang.title, // Наприклад "Українська" як "Дивлюся - Українська", але адаптовано
                checkbox: true,
                selected: isHidden,
                disabled: lang.code === defaultCode,
                key: lang.hideKey
            });
        });

        Lampa.Select.show({
            title: 'Вимкнути розкладки',
            items: items,
            onSelect: function(item) {
                if (item.disabled || item.subtitle) return;

                const current = Lampa.Storage.get(item.key, 'false') === 'true';
                const newVal = current ? 'false' : 'true';
                Lampa.Storage.set(item.key, newVal);

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
        component: 'keyboard_settings_v8',
        name: 'Налаштування клавіатури',
        icon: '<svg fill="#fff" width="38px" height="38px" viewBox="0 0 24 24"><path d="M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Z"/></svg>'
    });

    // Параметр default - type: 'select' (заміна toggle)
    Lampa.SettingsApi.addParam({
        component: 'keyboard_settings_v8',
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
            if (langObj) Lampa.Storage.set(langObj.hideKey, 'false');
            Lampa.Storage.set('keyboard_default_lang', value);
            setTimeout(applySettings, 200);
        },
        onRender: function(el) {
            // Не потрібно, бо type: 'select' показує вибране значення автоматично
        }
    });

    // Параметр hide - trigger
    Lampa.SettingsApi.addParam({
        component: 'keyboard_settings_v8',
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

    // Інтервал для перевірки
    setInterval(function() {
        if ($('div.hg-button.hg-functionBtn.hg-button-LANG.selector.binded').length > 0) {
            setTimeout(applySettings, 100);
            setTimeout(applySettings, 300);
        }
    }, 50);

    // Listener на клік LANG
    function setupListeners() {
        $('body').on('click', '.hg-button.hg-functionBtn.hg-button-LANG.selector.binded', function() {
            setTimeout(applySettings, 50);
            setTimeout(applySettings, 200);
            setTimeout(applySettings, 500);
        });
    }

    // Mutation observer для selectbox-item
    function setupObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    if ($(mutation.addedNodes).find('.selectbox-item.selector').length > 0) {
                        setTimeout(applySettings, 100);
                    }
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Запуск
    function start() {
        setupListeners();
        setupObserver();
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
            setTimeout(applySettings, 100);
            setTimeout(applySettings, 300);
            setTimeout(applySettings, 600);
        }
    });

})();
