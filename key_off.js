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
  
    function log(msg) {  
        console.log('[keyboard_settings_select]', msg);  
    }  
  
    function getDefaultCode() {  
        const val = Lampa.Storage.get('keyboard_default_lang', 'uk');  
        log('getDefaultCode: ' + val);  
        return val;  
    }  
  
    function getDefaultTitle() {  
        const code = getDefaultCode();  
        const lang = LANGUAGES.find(function(l) { return l.code === code; });  
        return lang ? lang.title : 'Українська';  
    }  
  
    function getHiddenLanguages() {  
        let stored = Lampa.Storage.get('keyboard_hidden_layouts', '[]');  
        log('getHiddenLanguages: raw stored="' + stored + '"');  
        
        if (!stored || stored === '' || stored === 'undefined' || stored === 'null') {  
            stored = '[]';  
            log('getHiddenLanguages: empty value, using []');  
        }  
        
        try {  
            const parsed = JSON.parse(stored);  
            log('getHiddenLanguages: parsed=' + JSON.stringify(parsed));  
            return Array.isArray(parsed) ? parsed : [];  
        } catch (e) {  
            log('getHiddenLanguages: parse error, initializing to []');  
            Lampa.Storage.set('keyboard_hidden_layouts', '[]');  
            return [];  
        }  
    }  
  
    function saveHiddenLanguages(hiddenCodes) {  
        log('saveHiddenLanguages: START, hiddenCodes=' + JSON.stringify(hiddenCodes));  
        const jsonString = JSON.stringify(hiddenCodes);  
        log('saveHiddenLanguages: jsonString="' + jsonString + '"');  
        
        Lampa.Storage.set('keyboard_hidden_layouts', jsonString);  
        log('saveHiddenLanguages: Storage.set called');  
        
        // Перевірка
        const verify = Lampa.Storage.get('keyboard_hidden_layouts');  
        log('saveHiddenLanguages: VERIFY read back="' + verify + '"');  
        
        LANGUAGES.forEach(function(lang) {  
            const isHidden = hiddenCodes.indexOf(lang.code) > -1;  
            Lampa.Storage.set(lang.key, isHidden ? 'true' : 'false');  
            log('saveHiddenLanguages: set ' + lang.key + '=' + (isHidden ? 'true' : 'false'));  
        });  
        
        log('saveHiddenLanguages: END');  
    }  
  
    function getHiddenLanguagesText() {  
        const hiddenCodes = getHiddenLanguages();  
        const hiddenTitles = LANGUAGES  
            .filter(function(lang) { return hiddenCodes.indexOf(lang.code) > -1; })  
            .map(function(lang) { return lang.title; });  
        return hiddenTitles.length ? hiddenTitles.join(', ') : 'жодна';  
    }  
  
    function filterLayouts(layouts) {  
        const defaultCode = getDefaultCode();  
        const hiddenCodes = getHiddenLanguages();  
        
        return layouts.filter(function(l) {  
            const langObj = LANGUAGES.find(function(lang) { return lang.code === l.code; });  
            if (!langObj) return true;  
            
            const hide = hiddenCodes.indexOf(l.code) > -1;  
            const keep = !hide || l.code === defaultCode;  
            
            return keep;  
        });  
    }  
  
    function hookKeyboard() {  
        if (window.Keyboard && window.Keyboard.prototype) {  
            const origInit = window.Keyboard.prototype.init;  
            window.Keyboard.prototype.init = function () {  
                if (this.layouts) {  
                    this.layouts = filterLayouts(this.layouts);  
                }  
                return origInit.apply(this, arguments);  
            };  
            log('hookKeyboard: hooked');  
        }  
    }  
  
    function ensureKeyboardHooked() {  
        if (!window.Keyboard) {  
            setTimeout(ensureKeyboardHooked, 500);  
            return;  
        }  
        hookKeyboard();  
    }  
  
    function applyHidingToSelector() {  
        const defaultCode = getDefaultCode();  
        const hiddenCodes = getHiddenLanguages();  
        
        setTimeout(function() {  
            LANGUAGES.forEach(function(lang) {  
                const hide = hiddenCodes.indexOf(lang.code) > -1;  
                const element = $('.selectbox-item.selector').filter(function () {  
                    return $(this).text().trim() === lang.title;  
                });  
                
                if (element.length) {  
                    const shouldHide = hide && lang.code !== defaultCode;  
                    element.toggle(!shouldHide);  
                }  
            });  
        }, 150);  
    }  
  
    function updateHideDisplay() {  
        log('updateHideDisplay: called');  
        const hideEl = $('.settings-param[data-name="keyboard_hide_button"] .settings-param__value');  
        if (hideEl.length) {  
            const hideText = getHiddenLanguagesText();  
            hideEl.text(hideText);  
            log('updateHideDisplay: set text to "' + hideText + '"');  
        } else {  
            log('updateHideDisplay: element not found');  
        }  
    }  
  
    function showHideLayoutsDialog() {  
        log('showHideLayoutsDialog: OPENED');  
        const defaultCode = getDefaultCode();  
  
        function buildItems() {  
            const hiddenCodes = getHiddenLanguages();  
            log('buildItems: hiddenCodes=' + JSON.stringify(hiddenCodes));  
            
            return LANGUAGES  
                .filter(function(lang) { return lang.code !== defaultCode; })  
                .map(function(lang) {  
                    const selected = hiddenCodes.indexOf(lang.code) > -1;  
                    log('buildItems: ' + lang.title + ' (code=' + lang.code + ') selected=' + selected);  
                    return {  
                        title: lang.title,  
                        checkbox: true,  
                        selected: selected,  
                        code: lang.code  
                    };  
                });  
        }  
  
        let items = buildItems();  
  
        Lampa.Select.show({  
            title: 'Приховати розкладки',  
            items: items,  
            onSelect: function(item) {  
                log('onSelect: TRIGGERED for item=' + JSON.stringify(item));  
                
                if (!item || !item.code) {  
                    log('onSelect: no item.code, ABORT');  
                    return;  
                }  
                
                let currentHiddenCodes = getHiddenLanguages();  
                log('onSelect: BEFORE change, currentHiddenCodes=' + JSON.stringify(currentHiddenCodes));  
                
                const index = currentHiddenCodes.indexOf(item.code);  
                log('onSelect: index of ' + item.code + ' = ' + index);  
                
                if (index > -1) {  
                    currentHiddenCodes.splice(index, 1);  
                    log('onSelect: REMOVED ' + item.code);  
                } else {  
                    currentHiddenCodes.push(item.code);  
                    log('onSelect: ADDED ' + item.code);  
                }  
                
                log('onSelect: AFTER change, currentHiddenCodes=' + JSON.stringify(currentHiddenCodes));  
                
                saveHiddenLanguages(currentHiddenCodes);  
                
                // Додаткова перевірка після збереження
                const afterSave = getHiddenLanguages();
                log('onSelect: AFTER saveHiddenLanguages, read back=' + JSON.stringify(afterSave));  
                
                if (window.keyboard) {  
                    window.keyboard.init();  
                }  
                
                items = buildItems();  
                log('onSelect: items rebuilt, count=' + items.length);  
                
                if (typeof Lampa.Select.update === 'function') {  
                    log('onSelect: calling Lampa.Select.update');  
                    Lampa.Select.update(items);  
                } else {  
                    log('onSelect: Lampa.Select.update not available, reopening dialog');  
                    Lampa.Select.destroy();  
                    setTimeout(showHideLayoutsDialog, 0);  
                }  
                
                updateHideDisplay();  
            },  
            onBack: function() {  
                log('onBack: dialog closed');  
                updateHideDisplay();  
                Lampa.Controller.toggle('settings_component');  
            }  
        });  
    }  
  
    Lampa.SettingsApi.addComponent({  
        component: 'keyboard_settings_select',  
        name: 'Налаштування клавіатури',  
        icon: '<svg fill="#fff" width="38" height="38" viewBox="0 0 24 24"><path d="M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Z"/></svg>'  
    });  
  
    Lampa.SettingsApi.addParam({  
        component: 'keyboard_settings_select',  
        param: {  
            name: 'keyboard_default_lang',  
            type: 'select',  
            values: {  
                'uk': 'Українська',  
                'ru': 'Русский',  
                'en': 'English',  
                'he': 'עִברִית'  
            },  
            'default': 'uk'  
        },  
        field: {  
            name: 'Розкладка за замовчуванням',  
            description: 'Вибір розкладки за замовчуванням'  
        },  
        onChange: function(value) {  
            log('onChange keyboard_default_lang: value=' + value);  
            Lampa.Storage.set('keyboard_default_lang', value);  
            
            const hiddenCodes = getHiddenLanguages();  
            const index = hiddenCodes.indexOf(value);  
            if (index > -1) {  
                hiddenCodes.splice(index, 1);  
                saveHiddenLanguages(hiddenCodes);  
            }  
            
            if (window.keyboard) {  
                window.keyboard.init();  
            }  
            
            updateHideDisplay();  
        }  
    });  
  
    Lampa.SettingsApi.addParam({  
        component: 'keyboard_settings_select',  
        param: {  
            name: 'keyboard_hide_button',  
            type: 'button'  
        },  
        field: {  
            name: 'Приховати розкладки',  
            description: 'Вибір розкладок для приховування'  
        },  
        onChange: function() {  
            log('onChange keyboard_hide_button: opening dialog');  
            showHideLayoutsDialog();  
        },  
        onRender: function(el) {  
            try {  
                const hideText = getHiddenLanguagesText();  
                el.find('.settings-param__value').text(hideText);  
                log('onRender: set value to "' + hideText + '"');  
            } catch (e) {  
                console.error('keyboard_settings_select onRender error:', e);  
            }  
        }  
    });  
  
    function start() {  
        log('start: BEGIN');  
        
        const storedValue = Lampa.Storage.get('keyboard_hidden_layouts');  
        log('start: initial keyboard_hidden_layouts="' + storedValue + '"');  
        
        if (!storedValue || storedValue === '' || storedValue === 'undefined' || storedValue === 'null') {  
            log('start: initializing keyboard_hidden_layouts to []');  
            Lampa.Storage.set('keyboard_hidden_layouts', '[]');  
            const verify = Lampa.Storage.get('keyboard_hidden_layouts');  
            log('start: after init, keyboard_hidden_layouts="' + verify + '"');  
        }  
        
        ensureKeyboardHooked();  
        
        Lampa.Listener.follow('select', function(e) {  
            if (e.type === 'open') {  
                applyHidingToSelector();  
            }  
        });  
        
        $(document).on('click', '.hg-button.hg-functionBtn.selector', function() {  
            applyHidingToSelector();  
        });  
        
        log('start: END');  
    }  
  
    if (window.appready) {
        start();
    } else {
        Lampa.Listener.follow('app', function (e) {  
            if (e.type === 'ready') start();  
        });
    }
  
})();
