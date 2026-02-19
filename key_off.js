(function () {  
    'use strict';  
    console.log('Keyboard Plugin: Loaded');  
    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) {  
        console.warn('Keyboard Plugin: Manifest version too old or missing');  
        return;  
    }  
    if (window.keyboard_multi_hide_plugin) {  
        console.warn('Keyboard Plugin: Already loaded');  
        return;  
    }  
    if (!Lampa.KeyboardLayouts) {  
        console.warn('Keyboard Plugin: Lampa.KeyboardLayouts not found');  
        return;  
    }  
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
  
    const layouts = Lampa.KeyboardLayouts;  
    let original_layers = {};  
    Object.keys(layouts.get()).forEach(mode => {  
        original_layers[mode] = JSON.parse(JSON.stringify(layouts.get(mode)));  
    });  
  
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
  
        if (fallbackNeeded) {  
            Lampa.Storage.set('keyboard_default_lang', 'default');  
            console.log('Keyboard Hide: Fallback to default lang as current was hidden');  
        }  
    }  
  
    function getAvailableLanguages() {  
        return LANGUAGES.filter(lang => Lampa.Storage.get(STORAGE_KEYS[lang], 'false') !== 'true');  
    }  
  
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
                        openHideMenu();  
                        return;  
                    }  
  
                    Lampa.Storage.set(key, newVal);  
                    applyHiding();  
                    openHideMenu();  
                }  
            },  
            onBack() {  
                Lampa.Controller.toggle('settings_component');  
            }  
        });  
    }  
  
    function addSettingsFallback() {  
        console.warn('Keyboard Plugin: SettingsApi missing, trying DOM fallback (unstable)');  
        const mainSettings = $('.settings__body .scroll__body > div');  
        if (!mainSettings.length) {  
            console.warn('Keyboard Plugin: DOM fallback: settings container not found');  
            return;  
        }  
        const folder = $(`  
            <div class="settings-folder selector" data-component="keyboard_multi_hide_plugin">  
                <div class="settings-folder__icon">  
                    <svg fill="#fff" width="38" height="38" viewBox="0 0 24 24"><path d="M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Zm1 11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v8Zm-6-3H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2Zm3.5-4h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2Z"/></svg>  
                </div>  
                <div class="settings-folder__name">Клавіатура</div>  
            </div>`);  
        mainSettings.append(folder);  
        folder.on('hover:enter', () => {  
            Lampa.Select.show({  
                title: 'Клавіатура',  
                items: [  
                    { title: 'Мова за замовчуванням' },  
                    { title: 'Вимкнути мови' }  
                ],  
                onSelect(item) {  
                    if (item.title === 'Мова за замовчуванням') openDefaultLangMenu();  
                    if (item.title === 'Вимкнути мови') openHideMenu();  
                },  
                onBack() {  
                    Lampa.Controller.toggle('settings_component');  
                }  
            });  
        });  
        console.log('Keyboard Plugin: DOM fallback added');  
    }  
  
    function addSettings() {  
        console.log('Keyboard Plugin: Trying to add settings');  
        if (!Lampa.SettingsApi) {  
            console.log('Keyboard Plugin: SettingsApi not available, using fallback');  
            addSettingsFallback();  
            return;  
        }  
        console.log('Keyboard Plugin: SettingsApi available');  
  
        Lampa.SettingsApi.addComponent({  
            component: 'keyboard_multi_hide_plugin',  
            name: 'Клавіатура',  
            icon: '<svg fill="#fff" width="38" height="38" viewBox="0 0 24 24"><path d="M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Zm1 11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v8Zm-6-3H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2Zm3.5-4h-1a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2Z"/></svg>'  
        });  
        console.log('Keyboard Plugin: Added component keyboard_multi_hide_plugin');  
  
        Lampa.SettingsApi.addParam({  
            component: 'keyboard_multi_hide_plugin',  
            param: { name: 'default_keyboard_lang', type: 'trigger', default: false },  
            field: { name: 'Мова за замовчуванням', description: 'Виберіть мову клавіатури за замовчуванням' },  
            onRender(el) {  
                el.off('hover:enter').on('hover:enter', openDefaultLangMenu);  
            }  
        });  
        console.log('Keyboard Plugin: Added param default_keyboard_lang');  
  
        Lampa.SettingsApi.addParam({  
            component: 'keyboard_multi_hide_plugin',  
            param: { name: 'select_keyboard_hide', type: 'trigger', default: false },  
            field: { name: 'Вимкнути мови', description: 'Вимкніть непотрібні мови клавіатури' },  
            onRender(el) {  
                el.off('hover:enter').on('hover:enter', () => {  
                    Lampa.Select.show({  
                        title: 'Вимкнути мови?',  
                        items: [{ title: 'Так', selected: true }, { title: 'Ні' }],  
                        onSelect(item) {  
                            if (item.title === 'Так') openHideMenu();  
                        },  
                        onBack() {  
                            Lampa.Controller.toggle('settings_component');  
                        }  
                    });  
                });  
            }  
        });  
        console.log('Keyboard Plugin: Added param select_keyboard_hide');  
  
        if (Lampa.Settings.update) {  
            Lampa.Settings.update();  
            console.log('Keyboard Plugin: Settings.update called');  
        } else {  
            console.warn('Keyboard Plugin: Lampa.Settings.update missing');  
        }  
    }  
  
    function start() {  
        console.log('Keyboard Plugin: App ready - start');  
        setTimeout(() => {  
            addSettings();  
            applyHiding();  
        }, 2000);  
    }  
  
    if (window.appready) {  
        console.log('Keyboard Plugin: App ready - immediate');  
        start();  
    } else {  
        Lampa.Listener.follow('app', e => {  
            if (e.type === 'ready') {  
                console.log('Keyboard Plugin: App ready - listener');  
                start();  
            }  
        });  
    }  
})();
