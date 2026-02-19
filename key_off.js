Спочатку я опишу дії, які буду робити для виправлення проблеми: оскільки плагін завантажується (Noty показується), але SettingsApi не стає доступним для додавання компонента в меню налаштувань, я додаю більш агресивний retry-механізм з перевіркою існування Lampa.SettingsApi кожні 500 мс до 20 спроб. Додам додаткове логування для кожної спроби і успішного/невдалого додавання. Якщо після всіх спроб SettingsApi не доступний, покажу Noty з помилкою "Не вдалося додати налаштування клавіатури - перевірте версію Lampa". Також викличу Lampa.Settings.update() після кожного успішного додавання, щоб примусово оновити UI. Якщо пункт все одно не з'явиться, рекомендую: 1) Перевірити версію Lampa (повинна бути 3.0+ з підтримкою SettingsApi - можливо, використовуйте стандартну Lampa, а не UNCENSORED, якщо є конфлікти). 2) Видалити плагін і додати заново після повного перезапуску аплікації. 3) Перевірити консоль на помилки (на Android через ADB logcat | grep 'Keyboard Plugin'). 4) Спробуйте відкрити меню налаштувань після завантаження плагіна - можливо, компонент додається динамічно. Якщо проблема зберігається, надайте більше деталей: версія Lampa, пристрій (Android TV, LG, тощо), і точні логи з консолі.

(function () {
    'use strict';
    console.log('Keyboard Plugin: Starting load');
    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) {
        console.log('Keyboard Plugin: Manifest not compatible');
        return;
    }
    if (window.keyboard_multi_hide_plugin) {
        console.log('Keyboard Plugin: Already loaded');
        return;
    }
    if (!Lampa.KeyboardLayouts) {
        console.log('Keyboard Plugin: KeyboardLayouts not available');
        return;
    }
    window.keyboard_multi_hide_plugin = true;
    console.log('Keyboard Plugin: Loaded successfully');

    // Тестове сповіщення
    if (Lampa.Noty) Lampa.Noty.show('Клавіатура плагін завантажено');
    console.log('Keyboard Plugin: Noty shown');

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
    console.log('Keyboard Plugin: Original layers saved');

    // Функція застосування приховування (видалення/відновлення ключів у layers)
    function applyHiding() {
        console.log('Keyboard Plugin: Applying hiding');
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
        console.log('Keyboard Plugin: Opening default lang menu');
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
        console.log('Keyboard Plugin: Opening hide menu');
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
        console.log('Keyboard Plugin: Trying to add settings');
        if (!Lampa.SettingsApi) {
            console.log('Keyboard Plugin: SettingsApi not available yet');
            return false;
        }
        console.log('Keyboard Plugin: SettingsApi available');

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
        if (Lampa.Settings && Lampa.Settings.update) {
            Lampa.Settings.update();
            console.log('Keyboard Plugin: Settings updated');
        }

        return true;
    }

    // Retry-механізм для додавання налаштувань
    let retryCount = 0;
    const maxRetries = 20;
    const retryDelay = 500; // зменшено до 500 мс для швидкості
    const retryInterval = setInterval(() => {
        console.log('Keyboard Plugin: Retry attempt #' + (retryCount + 1));
        if (addSettings()) {
            clearInterval(retryInterval);
            applyHiding();
            console.log('Keyboard Plugin: Settings added successfully after ' + (retryCount + 1) + ' attempts');
        } else {
            retryCount++;
            if (retryCount >= maxRetries) {
                clearInterval(retryInterval);
                if (Lampa.Noty) Lampa.Noty.show('Помилка: Не вдалося додати налаштування клавіатури після ' + maxRetries + ' спроб');
                console.log('Keyboard Plugin: Failed to add settings after ' + maxRetries + ' attempts');
            }
        }
    }, retryDelay);

    // Початкова затримка перед першою спробою
    setTimeout(() => {
        console.log('Keyboard Plugin: Initial delay complete, starting retries');
    }, 3000);
})();
