(function () {
    'use strict';
    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;
    if (window.keyboard_multi_hide_plugin) return;
    if (!Lampa.KeyboardLayouts) return;
    window.keyboard_multi_hide_plugin = true;

    const LANGUAGES = ['English', 'Русский', 'Українська', 'עִברִית'];
    const LANG_CODES = {
        'English': 'en',
        'Русский': 'default',
        'Українська': 'uk',
        'עִברִית': 'he'
    };
    const CODE_TO_LANG = Object.fromEntries(Object.entries(LANG_CODES).map(([k, v]) => [v, k]));
    const STORAGE_KEYS = {
        'English': 'keyboard_hide_en',
        'Русский': 'keyboard_hide_ru',
        'Українська': 'keyboard_hide_uk',
        'עִברִית': 'keyboard_hide_he'
    };

    // Збереження оригінальних layers
    const layouts = Lampa.KeyboardLayouts;
    let original_layers = {};
    Object.keys(layouts.get()).forEach(mode => {
        original_layers[mode] = JSON.parse(JSON.stringify(layouts.get(mode)));
    });

    // Функція застосування приховування (видалення/відновлення ключів у layers)
    function applyHiding() {
        const defaultLangCode = Lampa.Storage.get('keyboard_default_lang', 'default');
        let fallbackNeeded = false;

        Object.keys(original_layers).forEach(mode => {
            let layer = layouts.get(mode) || {};
            LANGUAGES.forEach(lang => {
                const code = LANG_CODES[lang];
                const hide = Lampa.Storage.get(STORAGE_KEYS[lang], 'false') === 'true';
                if (hide) {
                    if (layer[code]) {
                        delete layer[code];
                        console.log('Keyboard Hide: Removed ' + code + ' from ' + mode);
                        if (code === defaultLangCode) fallbackNeeded = true;
                    }
                } else {
                    if (original_layers[mode][code] && !layer[code]) {
                        layer[code] = original_layers[mode][code];
                        console.log('Keyboard Hide: Restored ' + code + ' to ' + mode);
                    }
                }
            });
        });

        // Якщо вимкнута default мова, встановити fallback
        if (fallbackNeeded) {
            Lampa.Storage.set('keyboard_default_lang', 'default');
            console.log('Keyboard Hide: Fallback to default lang as current was hidden');
        }
    }

    // Отримання доступних мов (не вимкнених)
    function getAvailableLanguages() {
        return LANGUAGES.filter(lang => Lampa.Storage.get(STORAGE_KEYS[lang], 'false') !== 'true');
    }

    // Функція відкриття меню вибору default мови
    function openDefaultLangMenu() {
        const availableLangs = getAvailableLanguages();
        if (availableLangs.length === 0) {
            Lampa.Noty.show('Немає доступних мов для вибору.');
            return;
        }
        const currentDefault = Lampa.Storage.get('keyboard_default_lang', 'default');
        const items = availableLangs.map(lang => ({
            title: lang,
            selected: LANG_CODES[lang] === currentDefault
        }));
        Lampa.Select.show({
            title: 'Мова за замовчуванням',
            items: items,
            onSelect(item) {
                const newCode = LANG_CODES[item.title];
                Lampa.Storage.set('keyboard_default_lang', newCode);
                console.log('Keyboard Default: Set to ' + newCode);
                Lampa.Noty.show('Мова за замовчуванням змінена на ' + item.title);
            },
            onBack() {
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    // Функція відкриття меню вимкнення мов
    function openHideMenu() {
        const currentDefaultCode = Lampa.Storage.get('keyboard_default_lang', 'default');
        const currentDefaultLang = CODE_TO_LANG[currentDefaultCode] || 'Русский';
        const items = LANGUAGES.map(lang => ({
            title: lang,
            checkbox: true,
            selected: Lampa.Storage.get(STORAGE_KEYS[lang], 'false') === 'true',
            lang: lang
        }));
        Lampa.Select.show({
            title: 'Вимкнути мови',
            items: items,
            onSelect(item) {
                if (item.checkbox && item.lang) {
                    const key = STORAGE_KEYS[item.lang];
                    const isHidden = Lampa.Storage.get(key, 'false') === 'true';
                    const newVal = isHidden ? 'false' : 'true';

                    if (!isHidden && item.lang === currentDefaultLang) {
                        Lampa.Noty.show('Не можна вимкнути мову за замовчуванням. Спочатку змініть мову за замовчуванням.');
                        openHideMenu(); // Оновити меню без змін
                        return;
                    }

                    Lampa.Storage.set(key, newVal);
                    applyHiding();
                    openHideMenu(); // Оновити меню
                }
            },
            onBack() {
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    // Функція додавання налаштувань з логуванням та оновленням
    function addSettings() {
        if (!Lampa.SettingsApi) {
            console.log('Keyboard Plugin: SettingsApi not available');
            return;
        }

        // Додаємо компонент у Налаштування
        Lampa.SettingsApi.addComponent({
            component: 'keyboard_multi_hide_plugin',
            name: 'Клавіатура',
            icon: '<svg fill="#fff" width="38px" height="38px" viewBox="0 0 24 24"><path d="M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Zm1 11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v8Zm-6-3H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2Zm3.5-4h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2Z"/></svg>'
        });
        console.log('Keyboard Plugin: Added component keyboard_multi_hide_plugin');

        // Додаємо параметр для вибору default мови
        Lampa.SettingsApi.addParam({
            component: 'keyboard_multi_hide_plugin',
            param: {
                name: 'default_keyboard_lang',
                type: 'trigger',
                default: false
            },
            field: {
                name: 'Мова за замовчуванням',
                description: 'Виберіть мову клавіатури за замовчуванням'
            },
            onRender(el) {
                el.off('hover:enter').on('hover:enter', function () {
                    openDefaultLangMenu();
                });
            }
        });
        console.log('Keyboard Plugin: Added param default_keyboard_lang');

        // Додаємо параметр для вимкнення мов
        Lampa.SettingsApi.addParam({
            component: 'keyboard_multi_hide_plugin',
            param: {
                name: 'select_keyboard_hide',
                type: 'trigger',
                default: false
            },
            field: {
                name: 'Вимкнути мови',
                description: 'Вимкніть непотрібні мови клавіатури'
            },
            onRender(el) {
                el.off('hover:enter').on('hover:enter', function () {
                    Lampa.Select.show({
                        title: 'Вимкнути мови?',
                        items: [
                            { title: 'Так', selected: true },
                            { title: 'Ні' }
                        ],
                        onSelect: function (item) {
                            if (item.title === 'Так') {
                                openHideMenu();
                            }
                        },
                        onBack: function () {
                            Lampa.Controller.toggle('settings_component');
                        }
                    });
                });
            }
        });
        console.log('Keyboard Plugin: Added param select_keyboard_hide');

        // Оновлюємо налаштування для відображення змін
        if (Lampa.Settings.update) {
            Lampa.Settings.update();
            console.log('Keyboard Plugin: Settings updated');
        }
    }

    // Застосування приховування та додавання налаштувань при старті
    if (window.appready) {
        setTimeout(() => {
            addSettings();
            applyHiding();
        }, 1000);
    } else {
        Lampa.Listener.follow('app', e => {
            if (e.type === 'ready') {
                setTimeout(() => {
                    addSettings();
                    applyHiding();
                }, 1000);
            }
        });
    }
})();
