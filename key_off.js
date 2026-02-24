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
        return val;  
    }  
  
    function getDefaultTitle() {  
        const code = getDefaultCode();  
        const lang = LANGUAGES.find(function(l) { return l.code === code; });  
        return lang ? lang.title : 'Українська';  
    }  
  
    function getHiddenLanguages() {  
        let stored = Lampa.Storage.get('keyboard_hidden_layouts', '[]');  
        
        if (!stored || stored === '' || stored === 'undefined' || stored === 'null') {  
            stored = '[]';  
        }  
        
        try {  
            const parsed = JSON.parse(stored);  
            return Array.isArray(parsed) ? parsed : [];  
        } catch (e) {  
            Lampa.Storage.set('keyboard_hidden_layouts', '[]');  
            return [];  
        }  
    }  
  
    function saveHiddenLanguages(hiddenCodes) {  
        const jsonString = JSON.stringify(hiddenCodes);  
        Lampa.Storage.set('keyboard_hidden_layouts', jsonString);  
        
        LANGUAGES.forEach(function(lang) {  
            const isHidden = hiddenCodes.indexOf(lang.code) > -1;  
            Lampa.Storage.set(lang.key, isHidden ? 'true' : 'false');  
        });  
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
        const hideEl = $('.settings-param[data-name="keyboard_hide_button"] .settings-param__value');  
        if (hideEl.length) {  
            const hideText = getHiddenLanguagesText();  
            hideEl.text(hideText);  
        }  
    }  
  
    function showHideLayoutsDialog() {  
        const defaultCode = getDefaultCode();  
  
        function buildItems() {  
            const hiddenCodes = getHiddenLanguages();  
            
            return LANGUAGES  
                .filter(function(lang) { return lang.code !== defaultCode; })  
                .map(function(lang) {  
                    const selected = hiddenCodes.indexOf(lang.code) > -1;  
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
                if (!item || !item.code) {  
                    return;  
                }  
                
                let currentHiddenCodes = getHiddenLanguages();  
                const index = currentHiddenCodes.indexOf(item.code);  
                
                if (index > -1) {  
                    currentHiddenCodes.splice(index, 1);  
                } else {  
                    currentHiddenCodes.push(item.code);  
                }  
                
                saveHiddenLanguages(currentHiddenCodes);  
                
                if (window.keyboard) {  
                    window.keyboard.init();  
                }  
                
                items = buildItems();  
                
                if (typeof Lampa.Select.update === 'function') {  
                    Lampa.Select.update(items);  
                } else {  
                    Lampa.Select.destroy();  
                    setTimeout(showHideLayoutsDialog, 0);  
                }  
                
                updateHideDisplay();  
            },  
            onBack: function() {  
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
            showHideLayoutsDialog();  
        },  
        onRender: function(el) {  
            try {  
                const hideText = getHiddenLanguagesText();  
                el.find('.settings-param__value').text(hideText);  
            } catch (e) {  
                console.error('keyboard_settings_select onRender error:', e);  
            }  
        }  
    });  
  
    function start() {  
        const storedValue = Lampa.Storage.get('keyboard_hidden_layouts');  
        if (!storedValue || storedValue === '' || storedValue === 'undefined' || storedValue === 'null') {  
            Lampa.Storage.set('keyboard_hidden_layouts', '[]');  
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
    }  
  
    if (window.appready) {
        start();
    } else {
        Lampa.Listener.follow('app', function (e) {  
            if (e.type === 'ready') start();  
        });
    }
  
})();
