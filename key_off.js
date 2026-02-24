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
        log('saveHiddenLanguages: ' + JSON.stringify(hiddenCodes));  
        Lampa.Storage.set('keyboard_hidden_layouts', JSON.stringify(hiddenCodes));  
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
            // Шукаємо всі кнопки селектора мов  
            const buttons = document.querySelectorAll('.hg-button.hg-functionBtn.selector');  
            log('applyHidingToSelector: found ' + buttons.length + ' selector buttons');  
            
            buttons.forEach(function(button) {  
                const buttonText = button.textContent.trim();  
                log('applyHidingToSelector: checking button "' + buttonText + '"');  
                
                // Знаходимо відповідну мову  
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
  
        function buildItems() {  
            const hiddenCodes = getHiddenLanguages();  
            log('buildItems: hiddenCodes=' + JSON.stringify(hiddenCodes));  
            
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
                log('onSelect: item.code=' + item.code);  
                
                if (!item || !item.code) return;  
                
                let currentHiddenCodes = getHiddenLanguages();  
                log('onSelect: BEFORE=' + JSON.stringify(currentHiddenCodes));  
                
                const index = currentHiddenCodes.indexOf(item.code);  
                
                if (index > -1) {  
                    currentHiddenCodes.splice(index, 1);  
                } else {  
                    currentHiddenCodes.push(item.code);  
                }  
                
                log('onSelect: AFTER=' + JSON.stringify(currentHiddenCodes));  
                
                saveHiddenLanguages(currentHiddenCodes);  
                
                // Перевірка збереження  
                const verify = getHiddenLanguages();  
                log('onSelect: VERIFY=' + JSON.stringify(verify));  
                
                items = buildItems();  
                
                if (typeof Lampa.Select.update === 'function') {  
                    Lampa.Select.update(items);  
                } else {  
                    Lampa.Select.destroy();  
                    setTimeout(showHideLayoutsDialog, 0);  
                }  
                
                updateHideDisplay();  
                applyHidingToSelector();  
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
        if (!storedValue || storedValue === '') {  
            Lampa.Storage.set('keyboard_hidden_layouts', '[]');  
        }  
        
        log('init: keyboard_hidden_layouts=' + Lampa.Storage.get('keyboard_hidden_layouts'));  
        
        // Застосовуємо приховування при кожному відкритті клавіатури  
        $(document).on('click', '.hg-button.hg-functionBtn.selector', function() {  
            log('Selector button clicked');  
            applyHidingToSelector();  
        });  
        
        // Також застосовуємо при відкритті Select діалогу  
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
