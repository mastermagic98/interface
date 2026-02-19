(function () {
    'use strict';

    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;
    if (window.keyboard_multi_hide_plugin) return;
    window.keyboard_multi_hide_plugin = true;

    const LANGUAGES = [
        { name: 'Українська', storage: 'keyboard_hide_uk', text: 'Українська' },
        { name: 'Русский',    storage: 'keyboard_hide_ru', text: 'Русский' },
        { name: 'English',    storage: 'keyboard_hide_en', text: 'English' },
        { name: 'עִברִית',   storage: 'keyboard_hide_he', text: 'עִברִית' }
    ];

    // Кількість активних розкладок
    function getActiveCount() {
        let count = 0;
        LANGUAGES.forEach(lang => {
            if (Lampa.Storage.get(lang.storage, 'false') !== 'true') count++;
        });
        return count;
    }

    // Приховування вибраних розкладок
    function applyHiding() {
        LANGUAGES.forEach(lang => {
            const hide = Lampa.Storage.get(lang.storage, 'false') === 'true';
            const element = $('.selectbox-item.selector > div:contains("' + lang.text + '")');

            if (element.length > 0) {
                const parent = element.parent('.selectbox-item.selector');
                if (hide) {
                    parent.hide();
                } else {
                    parent.show();
                }
            }
        });
    }

    // Меню вибору розкладок для вимкнення
    function openLanguageMenu() {
        const activeCount = getActiveCount();

        const items = LANGUAGES.map(lang => {
            const isHidden = Lampa.Storage.get(lang.storage, 'false') === 'true';
            const isLastActive = !isHidden && activeCount === 1;

            return {
                title: lang.name,
                checkbox: true,
                selected: isHidden,
                disabled: isLastActive,
                storageKey: lang.storage
            };
        });

        Lampa.Select.show({
            title: 'Вимкнути розкладку',
            items: items,
            onSelect: function (item) {
                if (item.disabled) {
                    Lampa.Noty.show('Неможливо вимкнути останню розкладку!', { timeout: 2000 });
                    return;
                }

                if (item.checkbox && item.storageKey) {
                    const current = Lampa.Storage.get(item.storageKey, 'false') === 'true';
                    Lampa.Storage.set(item.storageKey, current ? 'false' : 'true');

                    // Оновлюємо меню і застосовуємо приховування
                    setTimeout(openLanguageMenu, 80);
                    setTimeout(applyHiding, 120);
                }
            },
            onBack: function () {
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    // Додаємо компонент у Налаштування
    Lampa.SettingsApi.addComponent({
        component: 'keyboard_multi_hide_plugin',
        name: 'Вимкнути розкладку клавіатури',
        icon: '<svg fill="#fff" width="38px" height="38px" viewBox="0 0 24 24"><path d="M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Zm1 11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v8Zm-6-3H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2Zm3.5-4h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2Z"/></svg>'
    });

    // Додаємо пункт у меню налаштувань
    Lampa.SettingsApi.addParam({
        component: 'keyboard_multi_hide_plugin',
        param: {
            name: 'keyboard_hide_select',
            type: 'trigger',
            default: false
        },
        field: {
            name: 'Вибір розкладок',
            description: 'Вимкнути будь-які розкладки (завжди лишається хоча б одна)'
        },
        onRender: function (el) {
            el.off('hover:enter').on('hover:enter', function () {
                openLanguageMenu();
            });
        }
    });

    // Основна ініціалізація
    function startPlugin() {
        applyHiding();

        // Твій оригінальний підхід — перевірка на кнопку зміни мови
        setInterval(function () {
            var langBtn = $('div.hg-button.hg-functionBtn.hg-button-LANG.selector.binded');
            if (langBtn.length > 0) {
                applyHiding();
            }
        }, 150);

        // Додаткові надійні виклики
        Lampa.Listener.follow('select', function (e) {
            if (e.type === 'open') {
                setTimeout(applyHiding, 100);
                setTimeout(applyHiding, 300);
            }
        });
    }

    // Запуск плагіна
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
            setTimeout(startPlugin, 1000);
        }
    });

})();
