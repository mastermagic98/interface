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
        const hasCheckboxes = selectbox.querySelectorAll('.selectbox-item--checkbox').length > 0;  
        
        return hasLanguageButtons && !hasCheckboxes;  
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
        
        const buttons = document.querySelectorAll('.selectbox-item.selector:not(.selectbox-item--checkbox)');  
        
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
  
    function updateCheckboxVisually(item, isChecked) {  
        // Оновлюємо візуально чекбокс  
        const checkbox = item.querySelector('.selectbox-item__checkbox');  
        if (checkbox) {  
            if (isChecked) {  
                checkbox.classList.add('selectbox-item__checkbox--checked');  
            } else {  
                checkbox.classList.remove('selectbox-item__checkbox--checked');  
            }  
        }  
        
        // Також оновлюємо клас на самому item  
        if (isChecked) {  
            item.classList.add('selectbox-item--checked');  
        } else {  
            item.classList.remove('selectbox-item--checked');  
        }  
    }  
  
    function showHideLayoutsDialog() {  
        const defaultCode = getDefaultCode();  
        let workingHidden = getHiddenLanguages().slice();  
        
        log('showDialog: defaultCode=' + defaultCode + ', initial=' + JSON.stringify(workingHidden));  
  
        function buildItems() {  
            return LANGUAGES  
                .filter(function(lang) { return lang.code !== defaultCode; })  
                .map(function(lang) {  
                    const isChecked = workingHidden.indexOf(lang.code) > -1;  
                    
                    return {  
                        title: lang.title,  
                        checkbox: true,
                        checked: isChecked,
                        code: lang.code  
                    };  
                });  
        }  
  
        let items = buildItems();  
  
        function attachHandlers() {  
            setTimeout(function() {  
                const checkboxItems = document.querySelectorAll('.selectbox-item--checkbox');  
                log('attachHandlers: found ' + checkboxItems.length + ' items');  
                
                checkboxItems.forEach(function(item) {  
                    const titleEl = item.querySelector('.selectbox-item__title');  
                    if (!titleEl) return;  
                    
                    const titleText = titleEl.textContent.trim();  
                    const lang = LANGUAGES.find(function(l) { return l.title === titleText; });  
                    
                    if (!lang) return;  
                    
                    // Встановлюємо правильний стан чекбокса візуально  
                    const isCurrentlyChecked = workingHidden.indexOf(lang.code) > -1;  
                    updateCheckboxVisually(item, isCurrentlyChecked);  
                    
                    // Видаляємо старі обробники  
                    const newItem = item.cloneNode(true);  
                    item.parentNode.replaceChild(newItem, item);  
                    
                    // Перевстановлюємо візуальний стан після клонування  
                    updateCheckboxVisually(newItem, isCurrentlyChecked);  
                    
                    // Додаємо новий обробник  
                    newItem.addEventListener('click', function(e) {  
                        e.preventDefault();  
                        e.stopPropagation();  
                        
                        log('CLICK: ' + lang.title + ' (code=' + lang.code + ')');  
                        
                        const index = workingHidden.indexOf(lang.code);  
                        let newCheckedState;  
                        
                        if (index > -1) {  
                            workingHidden.splice(index, 1);  
                            newCheckedState = false;  
                            log('CLICK: REMOVED ' + lang.code);  
                        } else {  
                            workingHidden.push(lang.code);  
                            newCheckedState = true;  
                            log('CLICK: ADDED ' + lang.code);  
                        }  
                        
                        log('CLICK: new state=' + JSON.stringify(workingHidden));  
                        
                        // Оновлюємо візуально ОДРАЗУ  
                        updateCheckboxVisually(newItem, newCheckedState);  
                        
                        // Зберігаємо  
                        saveHiddenLanguages(workingHidden);  
                        
                        // Перебудовуємо items для Lampa.Select  
                        items = buildItems();  
                        
                        // Оновлюємо через Lampa API (це оновить внутрішній стан)  
                        if (typeof Lampa.Select.update === 'function') {  
                            Lampa.Select.update(items);  
                            // Після оновлення Lampa перепідключаємо обробники  
                            attachHandlers();  
                        }  
                    });  
                });  
            }, 50);  
        }  
  
        try {  
            Lampa.Select.show({  
                title: 'Приховати розкладки',  
                items: items,  
                onSelect: function(item) {  
                    // Ігноруємо  
                },  
                onBack: function() {  
                    log('onBack: final=' + JSON.stringify(workingHidden));  
                    saveHiddenLanguages(workingHidden);  
                    updateHideDisplay();  
                    Lampa.Controller.toggle('settings_component');  
                }  
            });  
            
            log('showDialog: dialog shown');  
            
            attachHandlers();  
            
        } catch (e) {  
            log('showDialog: ERROR=' + e.message);  
            console.error('showHideLayoutsDialog error:', e);  
        }  
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
            log('onChange: opening dialog');  
            try {  
                showHideLayoutsDialog();  
            } catch (e) {  
                log('onChange: ERROR=' + e.message);  
                console.error('onChange error:', e);  
            }  
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
        
        if (!isLampaKeyboard()) {  
            log('init: system keyboard');  
            return;  
        }  
        
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
