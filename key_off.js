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
  
    let isProcessing = false;  
  
    function log(msg) {  
        console.log('[keyboard_settings_select]', msg);  
    }  
  
    function isLampaKeyboard() {  
        const keyboardType = Lampa.Storage.get('keyboard_type', 'lampa');  
        return keyboardType === 'lampa';  
    }  
  
    function getDefaultCode() {  
        return Lampa.Storage.get('keyboard_default_lang', 'uk');  
    }  
  
    function getHiddenLanguages() {  
        let stored = Lampa.Storage.get('keyboard_hidden_layouts', '');  
        
        if (!stored || stored === 'undefined' || stored === 'null') {  
            return [];  
        }  
        
        if (typeof stored === 'string' && stored.length > 0) {  
            if (stored.indexOf(',') > -1) {  
                return stored.split(',').filter(function(s) { return s.trim().length > 0; });  
            } else {  
                return [stored];  
            }  
        }  
        
        return [];  
    }  
  
    function saveHiddenLanguages(hiddenCodes) {  
        const stringValue = hiddenCodes.length > 0 ? hiddenCodes.join(',') : '';  
        Lampa.Storage.set('keyboard_hidden_layouts', stringValue);  
        log('saveHiddenLanguages: saved="' + stringValue + '"');  
    }  
  
    function getHiddenLanguagesText() {  
        const hiddenCodes = getHiddenLanguages();  
        const hiddenTitles = LANGUAGES  
            .filter(function(lang) { return hiddenCodes.indexOf(lang.code) > -1; })  
            .map(function(lang) { return lang.title; });  
        return hiddenTitles.length ? hiddenTitles.join(', ') : 'жодна';  
    }  
  
    function isKeyboardLanguageSelector() {  
        const selectbox = document.querySelector('.selectbox');  
        if (!selectbox) return false;  
        
        const hasLanguageButtons = selectbox.querySelectorAll('.selectbox-item.selector').length > 0;  
        const isNotSettingsDialog = selectbox.querySelectorAll('.selectbox-item__checkbox').length === 0;  
        
        return hasLanguageButtons && isNotSettingsDialog;  
    }  
  
    function applyHidingToSelector() {  
        if (!isLampaKeyboard()) {  
            return;  
        }  
        
        if (!isKeyboardLanguageSelector()) {  
            return;  
        }  
        
        if (isProcessing) return;  
        
        const defaultCode = getDefaultCode();  
        const hiddenCodes = getHiddenLanguages();  
        
        isProcessing = true;  
        
        const buttons = document.querySelectorAll('.selectbox-item.selector');  
        
        if (buttons.length === 0) {  
            isProcessing = false;  
            return;  
        }  
        
        log('applyHiding: codes=' + JSON.stringify(hiddenCodes));  
        
        buttons.forEach(function(button) {  
            const buttonText = button.textContent.trim();  
            const lang = LANGUAGES.find(function(l) { return l.title === buttonText; });  
            
            if (lang) {  
                const isHidden = hiddenCodes.indexOf(lang.code) > -1;  
                const isDefault = lang.code === defaultCode;  
                const shouldHide = isHidden && !isDefault;  
                
                if (shouldHide) {  
                    button.style.display = 'none';  
                    log('applyHiding: HIDE ' + buttonText);  
                } else {  
                    button.style.display = '';  
                }  
            }  
        });  
        
        isProcessing = false;  
    }  
  
    function updateHideDisplay() {  
        setTimeout(function() {  
            const hideEl = $('.settings-param[data-name="keyboard_hide_button"] .settings-param__value');  
            if (hideEl.length) {  
                hideEl.text(getHiddenLanguagesText());  
            }  
        }, 50);  
    }  
  
    function showHideLayoutsDialog() {  
        const defaultCode = getDefaultCode();  
        let currentHidden = getHiddenLanguages().slice();  
        
        log('showDialog: initial=' + JSON.stringify(currentHidden));  
  
        function buildItems() {  
            return LANGUAGES  
                .filter(function(lang) { return lang.code !== defaultCode; })  
                .map(function(lang) {  
                    const isSelected = currentHidden.indexOf(lang.code) > -1;  
                    return {  
                        title: lang.title,  
                        checkbox: true,  
                        checked: isSelected,  
                        selected: isSelected,  
                        code: lang.code  
                    };  
                });  
        }  
  
        let items = buildItems();  
  
        Lampa.Select.show({  
            title: 'Приховати розкладки',  
            items: items,  
            onSelect: function(item) {  
                log('onSelect: code=' + item.code + ', selected=' + item.selected);  
                
                if (!item || !item.code) return;  
                
                const index = currentHidden.indexOf(item.code);  
                
                // Перемикаємо стан  
                if (index > -1) {  
                    currentHidden.splice(index, 1);  
                    log('onSelect: REMOVED ' + item.code);  
                } else {  
                    currentHidden.push(item.code);  
                    log('onSelect: ADDED ' + item.code);  
                }  
                
                log('onSelect: new state=' + JSON.stringify(currentHidden));  
                
                // Зберігаємо  
                saveHiddenLanguages(currentHidden);  
                
                // Перебудовуємо items з новими станами  
                items = buildItems();  
                
                // Оновлюємо діалог  
                if (typeof Lampa.Select.update === 'function') {  
                    log('onSelect: calling update');  
                    Lampa.Select.update(items);  
                } else {  
                    log('onSelect: reopening');  
                    Lampa.Select.destroy();  
                    setTimeout(showHideLayoutsDialog, 0);  
                }  
            },  
            onBack: function() {  
                log('onBack: final=' + JSON.stringify(currentHidden));  
                saveHiddenLanguages(currentHidden);  
                updateHideDisplay();  
                Lampa.Controller.toggle('settings_component');  
            }  
        });  
        
        log('showDialog: shown with ' + items.length + ' items');  
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
            log('onChange default: ' + value);  
            Lampa.Storage.set('keyboard_default_lang', value);  
            
            const hiddenCodes = getHiddenLanguages();  
            const index = hiddenCodes.indexOf(value);  
            if (index > -1) {  
                hiddenCodes.splice(index, 1);  
                saveHiddenLanguages(hiddenCodes);  
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
                el.find('.settings-param__value').text(getHiddenLanguagesText());  
            } catch (e) {  
                console.error('onRender error:', e);  
            }  
        }  
    });  
  
    function init() {  
        log('init: START');  
        
        const keyboardType = Lampa.Storage.get('keyboard_type', 'lampa');  
        log('init: keyboard_type=' + keyboardType);  
        
        if (!isLampaKeyboard()) {  
            log('init: system keyboard, disabled');  
            return;  
        }  
        
        const stored = Lampa.Storage.get('keyboard_hidden_layouts', '');  
        log('init: stored="' + stored + '"');  
        
        setInterval(function() {  
            if (!isLampaKeyboard()) return;  
            
            if (isKeyboardLanguageSelector()) {  
                applyHidingToSelector();  
            }  
        }, 1000);  
        
        const observer = new MutationObserver(function(mutations) {  
            if (!isLampaKeyboard()) return;  
            
            let foundSelectbox = false;  
            
            mutations.forEach(function(mutation) {  
                if (mutation.addedNodes.length && !foundSelectbox) {  
                    mutation.addedNodes.forEach(function(node) {  
                        if (node.nodeType === 1 && node.classList) {  
                            if (node.classList.contains('selectbox')) {  
                                foundSelectbox = true;  
                            }  
                        }  
                    });  
                }  
            });  
            
            if (foundSelectbox) {  
                log('MutationObserver: selectbox detected');  
                setTimeout(applyHidingToSelector, 100);  
                setTimeout(applyHidingToSelector, 300);  
                setTimeout(applyHidingToSelector, 600);  
            }  
        });  
        
        observer.observe(document.body, {  
            childList: true,  
            subtree: true  
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
