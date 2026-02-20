(function(){  
    'use strict';  
  
    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;  
    if (window.keyboard_settings_select) return;  
    window.keyboard_settings_select = true;  
  
    const LANGUAGES = [  
        { title: 'Українська', code: 'uk', key: 'keyboard_hide_uk' },  
        { title: 'Русский',    code: 'ru', key: 'keyboard_hide_ru' },  
        { title: 'English',    code: 'en', key: 'keyboard_hide_en' },  
        { title: 'עִברִית',   code: 'he', key: 'keyboard_hide_he' }  
    ];  
  
    function getDefaultCode() {  
        return Lampa.Storage.get('keyboard_default_lang', 'uk');  
    }  
  
    function getDefaultTitle() {  
        const code = getDefaultCode();  
        const lang = LANGUAGES.find(l => l.code === code);  
        return lang ? lang.title : 'Українська';  
    }  
  
    function filterLayouts(layouts) {  
        const defaultCode = getDefaultCode();  
        return layouts.filter(l => {  
            const langObj = LANGUAGES.find(lang => lang.code === l.code);  
            if (!langObj) return true;  
            const hide = Lampa.Storage.get(langObj.key, 'false') === 'true';  
            return !hide || l.code === defaultCode;  
        });  
    }  
  
    function hookKeyboard() {  
        if (window.Keyboard && window.Keyboard.prototype) {  
            const origInit = window.Keyboard.prototype.init;  
            window.Keyboard.prototype.init = function () {  
                if (this.layouts) this.layouts = filterLayouts(this.layouts);  
                return origInit.apply(this, arguments);  
            };  
        }  
    }  
  
    function ensureKeyboardHooked() {  
        if (!window.Keyboard) {  
            setTimeout(ensureKeyboardHooked, 500);  
            return;  
        }  
        hookKeyboard();  
    }  
  
    // Приховування елементів списку мов у клавіатурі  
    function applyHiding() {  
        LANGUAGES.forEach(lang => {  
            const hide = Lampa.Storage.get(lang.key, 'false') === 'true';  
            const element = $('.selectbox-item.selector').filter(function () {  
                return $(this).text().trim() === lang.title;  
            });  
            if (element.length) {  
                element.toggle(!hide);  
                console.log('Keyboard Hide: ' + lang.title + (hide ? ' hidden' : ' shown'));  
            } else {  
                console.log('Keyboard Hide: Element not found for ' + lang.title);  
            }  
        });  
    }  
  
    // Оновлення відображення значень у налаштуваннях  
    function updateDisplays() {  
        const defaultEl = $('.settings-param[data-name="keyboard_default_lang"] .settings-param__value');  
        if (defaultEl.length) defaultEl.text(getDefaultTitle());  
  
        const hiddenTitles = LANGUAGES  
            .filter(lang => Lampa.Storage.get(lang.key, 'false') === 'true')  
            .map(lang => lang.title);  
        const hideText = hiddenTitles.length ? hiddenTitles.join(', ') : 'жодна';  
        const hideEl = $('.settings-param[data-name="keyboard_hide_trigger"] .settings-param__value');  
        if (hideEl.length) hideEl.text(hideText);  
    }  
  
    // ----------------------  
    // Select для розкладки за замовчуванням  
    // ----------------------  
    function openDefaultMenu() {  
        const current = getDefaultCode();  
        const items = LANGUAGES.map(lang => ({  
            title: lang.title,  
            value: lang.code,  
            selected: lang.code === current  
        }));  
  
        Lampa.Select.show({  
            title: 'Розкладка за замовчуванням',  
            items: items,  
            onSelect(item) {  
                if (!item.value) return;  
                Lampa.Storage.set('keyboard_default_lang', item.value);  
                if (window.keyboard) window.keyboard.init();  
                updateDisplays();  
            },  
            onBack() {  
                Lampa.Controller.toggle('settings_component');  
            }  
        });  
    }  
  
    // ----------------------  
    // Select для прихованих розкладок (checkbox)  
    // ----------------------  
    function openHideMenu() {  
        const defaultCode = getDefaultCode();  
  
        function buildItems() {  
            return LANGUAGES  
                .filter(lang => lang.code !== defaultCode)  
                .map(lang => ({  
                    title: lang.title,  
                    checkbox: true,  
                    selected: Lampa.Storage.get(lang.key, 'false') === 'true',  
                    key: lang.key  
                }));  
        }  
  
        let items = buildItems();  
  
        Lampa.Select.show({  
            title: 'Приховати розкладки',  
            items: items,  
            onSelect(item) {  
                const current = Lampa.Storage.get(item.key, 'false') === 'true';  
                Lampa.Storage.set(item.key, current ? 'false' : 'true');  
                if (window.keyboard) window.keyboard.init();  
                applyHiding();  
                items = buildItems();  
                if (typeof Lampa.Select.update === 'function') {  
                    Lampa.Select.update(items);  
                } else {  
                    Lampa.Select.destroy();  
                    setTimeout(openHideMenu, 0);  
                }  
                updateDisplays();  
            },  
            onBack() {  
                Lampa.Controller.toggle('settings_component');  
            }  
        });  
    }  
  
    // ----------------------  
    // Додаємо компонент у налаштування  
    // ----------------------  
    Lampa.SettingsApi.addComponent({  
        component: 'keyboard_settings_select',  
        name: 'Налаштування клавіатури',  
        icon: '<svg fill="#fff" width="38" height="38" viewBox="0 0 24 24"><path d="M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Z"/></svg>'  
    });  
  
    // Default як select  
    Lampa.SettingsApi.addParam({  
        component: 'keyboard_settings_select',  
        param: { name: 'keyboard_default_lang', type: 'select', default: 'uk' },  
        field: {  
            name: 'Розкладка за замовчуванням',  
            description: 'Вибір розкладки за замовчуванням'  
        },  
        onRender(el) {  
            el.find('.settings-param__value').text(getDefaultTitle());  
            el.off('hover:enter').on('hover:enter', openDefaultMenu);  
        }  
    });  
  
    // Приховані розкладки як trigger  
    Lampa.SettingsApi.addParam({  
        component: 'keyboard_settings_select',  
        param: { name: 'keyboard_hide_trigger', type: 'trigger', default: false },  
        field: {  
            name: 'Приховати розкладки',  
            description: 'Вибір розкладок для приховування'  
        },  
        onRender(el) {  
            const hiddenTitles = LANGUAGES  
                .filter(lang => Lampa.Storage.get(lang.key, 'false') === 'true')  
                .map(lang => lang.title);  
            const hideText = hiddenTitles.length ? hiddenTitles.join(', ') : 'жодна';  
            el.find('.settings-param__value').text(hideText);  
            el.off('hover:enter').on('hover:enter', openHideMenu);  
        }  
    });  
  
    // ----------------------  
    // Старт та слухачі  
    // ----------------------  
    function start() {  
        ensureKeyboardHooked();  
        updateDisplays();  
        // Приховувати при кожному відкритті списку мов у клавіатурі  
        Lampa.Listener.follow('select', e => {  
            if (e.type === 'open') {  
                setTimeout(applyHiding, 100);  
            }  
        });  
    }  
  
    if (window.appready) start();  
    else Lampa.Listener.follow('app', function (e) {  
        if (e.type === 'ready') start();  
    });  
  
})();
