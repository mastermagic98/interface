(function(){  
    'use strict';  
  
    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;  
    if (window.keyboard_settings_select) return;  
    window.keyboard_settings_select = true;  
  
    const LANGUAGES = [  
        { title: 'Українська', code: 'uk' },  
        { title: 'Русский',    code: 'ru' },  
        { title: 'English',    code: 'en' },  
        { title: 'עִברִית',   code: 'he' }  
    ];  
  
    function log(msg) {  
        console.log('[keyboard_settings_select]', msg);  
    }  
  
    function getDefaultCode() {  
        return Lampa.Storage.get('keyboard_default_lang', 'uk');  
    }  
  
    function getHiddenLanguages() {  
        let stored = Lampa.Storage.get('keyboard_hidden_layouts', '');  
        log('getHiddenLanguages: RAW stored="' + stored + '" type=' + typeof stored);  
        
        // Якщо це просто рядок з комами (не JSON), розбиваємо  
        if (stored && typeof stored === 'string' && stored.indexOf(',') > -1 && stored.indexOf('[') === -1) {  
            const arr = stored.split(',').filter(function(s) { return s.length > 0; });  
            log('getHiddenLanguages: parsed from comma string=' + JSON.stringify(arr));  
            return arr;  
        }  
        
        // Якщо це JSON  
        if (stored && stored.indexOf('[') === 0) {  
            try {  
                const parsed = JSON.parse(stored);  
                log('getHiddenLanguages: parsed from JSON=' + JSON.stringify(parsed));  
                return Array.isArray(parsed) ? parsed : [];  
            } catch (e) {  
                log('getHiddenLanguages: JSON parse error');  
            }  
        }  
        
        // Якщо порожній або невалідний  
        log('getHiddenLanguages: returning empty array');  
        return [];  
    }  
  
    function saveHiddenLanguages(hiddenCodes) {  
        log('saveHiddenLanguages: input=' + JSON.stringify(hiddenCodes));  
        
        // Зберігаємо як рядок з комами (так як Lampa.Storage все одно перетворює на рядок)  
        const stringValue = hiddenCodes.join(',');  
        log('saveHiddenLanguages: saving as string="' + stringValue + '"');  
        
        Lampa.Storage.set('keyboard_hidden_layouts', stringValue);  
        
        // Перевірка  
        const verify = Lampa.Storage.get('keyboard_hidden_layouts');  
        log('saveHiddenLanguages: VERIFIED="' + verify + '"');  
    }  
  
    function getHiddenLanguagesText() {  
        const hiddenCodes = getHiddenLanguages();  
        const hiddenTitles = LANGUAGES  
            .filter(function(lang) { return hiddenCodes.indexOf(lang.code) > -1; })  
            .map(function(lang) { return lang.title; });  
        return hiddenTitles.length ? hiddenTitles.join(', ') : 'жодна';  
    }  
  
    function applyHidingToSelector() {  
        const defaultCode = getDefaultCode();  
        const hiddenCodes = getHiddenLanguages();  
        
        log('applyHidingToSelector: defaultCode=' + defaultCode + ', hiddenCodes=' + JSON.stringify(hiddenCodes));  
        
        setTimeout(function() {  
            const buttons = document.querySelectorAll('.hg-button.hg-functionBtn.selector');  
            log('applyHidingToSelector: found ' + buttons.length + ' selector buttons');  
            
            buttons.forEach(function(button) {  
                const buttonText = button.textContent.trim();  
                const lang = LANGUAGES.find(function(l) { return l.title === buttonText; });  
                
                if (lang) {  
                    const isHidden = hiddenCodes.indexOf(lang.code) > -1;  
                    const isDefault = lang.code === defaultCode;  
                    const shouldHide = isHidden && !isDefault;  
                    
                    if (shouldHide) {  
                        button.style.display = 'none';  
                        log('applyHidingToSelector: hiding ' + buttonText);  
                    } else {  
                        button.style.display = '';  
                        log('applyHidingToSelector: showing ' + buttonText);  
                    }  
                }  
            });  
        }, 200);  
    }  
  
    function updateHideDisplay() {  
        const hideEl = $('.settings-param[data-name="keyboard_hide_button"] .settings-param__value');  
        if (hideEl.length) {  
            hideEl.text(getHiddenLanguagesText());  
        }  
    }  
  
    function showHideLayoutsDialog() {  
        log('showHideLayoutsDialog: OPENED');  
        const defaultCode = getDefaultCode();  
        let currentHidden = getHiddenLanguages();  
        
        log('showHideLayoutsDialog: initial currentHidden=' + JSON.stringify(currentHidden));  
  
        function buildItems() {  
            log('buildItems: currentHidden=' + JSON.stringify(currentHidden));  
            
            return LANGUAGES  
                .filter(function(lang) { return lang.code !== defaultCode; })  
                .map(function(lang) {  
                    const selected = currentHidden.indexOf(lang.code) > -1;  
                    log('buildItems: ' + lang.title + ' selected=' + selected);  
                    return {  
                        title: lang.title,  
                        checkbox: true,  
                        checked: selected,  
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
                log('onSelect: CALLED! item=' + JSON.stringify(item));  
                
                if (!item || !item.code) {  
                    log('onSelect: no code, ABORT');  
                    return;  
                }  
                
                log('onSelect: BEFORE currentHidden=' + JSON.stringify(currentHidden));  
                
                const index = currentHidden.indexOf(item.code);  
                log('onSelect: index=' + index);  
                
                if (index > -1) {  
                    currentHidden.splice(index, 1);  
                    log('onSelect: REMOVED ' + item.code);  
                } else {  
                    currentHidden.push(item.code);  
                    log('onSelect: ADDED ' + item.code);  
                }  
                
                log('onSelect: AFTER currentHidden=' + JSON.stringify(currentHidden));  
                
                saveHiddenLanguages(currentHidden);  
                
                items = buildItems();  
                
                if (typeof Lampa.Select.update === 'function') {  
                    log('onSelect: calling Lampa.Select.update');  
                    Lampa.Select.update(items);  
                } else {  
                    log('onSelect: reopening dialog');  
                    Lampa.Select.destroy();  
                    setTimeout(showHideLayoutsDialog, 0);  
                }  
                
                updateHideDisplay();  
                applyHidingToSelector();  
            },  
            onCheck: function(item) {  
                log('onCheck: CALLED! item=' + JSON.stringify(item));  
                
                if (!item || !item.code) return;  
                
                const index = currentHidden.indexOf(item.code);  
                
                if (index > -1) {  
                    currentHidden.splice(index, 1);  
                } else {  
                    currentHidden.push(item.code);  
                }  
                
                saveHiddenLanguages(currentHidden);  
                items = buildItems();  
                
                if (typeof Lampa.Select.update === 'function') {  
                    Lampa.Select.update(items);  
                }  
                
                updateHideDisplay();  
                applyHidingToSelector();  
            },  
            onBack: function() {  
                log('onBack: saving final state=' + JSON.stringify(currentHidden));  
                saveHiddenLanguages(currentHidden);  
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
            log('onChange keyboard_default_lang: ' + value);  
            Lampa.Storage.set('keyboard_default_lang', value);  
            
            const hiddenCodes = getHiddenLanguages();  
            const index = hiddenCodes.indexOf(value);  
            if (index > -1) {  
                hiddenCodes.splice(index, 1);  
                saveHiddenLanguages(hiddenCodes);  
            }  
            
            updateHideDisplay();  
            applyHidingToSelector();  
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
            log('onChange: opening dialog');  
            showHideLayoutsDialog();  
        },  
        onRender: function(el) {  
            try {  
                el.find('.settings-param__value').text(getHiddenLanguagesText());  
            } catch (e) {  
                console.error('keyboard_settings_select onRender error:', e);  
            }  
        }  
    });  
  
    function init() {  
        log('init: START');  
        
        const storedValue = Lampa.Storage.get('keyboard_hidden_layouts');  
        log('init: current keyboard_hidden_layouts="' + storedValue + '"');  
        
        $(document).on('click', '.hg-button.hg-functionBtn.selector', function() {  
            log('Selector button clicked');  
            applyHidingToSelector();  
        });  
        
        Lampa.Listener.follow('select', function(e) {  
            if (e.type === 'open') {  
                log('Select opened');  
                applyHidingToSelector();  
            }  
        });  
        
        log('init: END');  
    }  
  
    if (window.appready) {
        init();
    } else {
        Lampa.Listener.follow('app', function(e) {  
            if (e.type === 'ready') init();  
        });
    }
  
})();
