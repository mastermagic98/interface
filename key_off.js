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
    let isInSettingsDialog = false;  
  
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
  
    function getDefaultTitle() {  
        const code = getDefaultCode();  
        const lang = LANGUAGES.find(function(l) { return l.code === code; });  
        return lang ? lang.title : 'Українська';  
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
        
        if (isInSettingsDialog) {  
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
  
    function updateDisplays() {  
        // Оновлюємо відображення дефолтної мови  
        const defaultEl = $('.settings-param[data-name="keyboard_default_lang_button"] .settings-param__value');  
        if (defaultEl.length) {  
            defaultEl.text(getDefaultTitle());  
        }  
        
        // Оновлюємо відображення прихованих мов  
        const hideEl = $('.settings-param[data-name="keyboard_hide_button"] .settings-param__value');  
        if (hideEl.length) {  
            hideEl.text(getHiddenLanguagesText());  
        }  
    }  
  
    function updateCheckboxVisually(item, isChecked) {  
        const checkbox = item.querySelector('.selectbox-item__checkbox');  
        if (checkbox) {  
            if (isChecked) {  
                checkbox.classList.add('selectbox-item__checkbox--checked');  
            } else {  
                checkbox.classList.remove('selectbox-item__checkbox--checked');  
            }  
        }  
        
        if (isChecked) {  
            item.classList.add('selectbox-item--checked');  
        } else {  
            item.classList.remove('selectbox-item--checked');  
        }  
    }  
  
    function showDefaultLangDialog() {  
        isInSettingsDialog = true;  
        
        const currentDefault = getDefaultCode();  
        
        const items = LANGUAGES.map(function(lang) {  
            return {  
                title: lang.title,  
                code: lang.code,  
                selected: lang.code === currentDefault  
            };  
        });  
        
        Lampa.Select.show({  
            title: 'Розкладка за замовчуванням',  
            items: items,  
            onSelect: function(item) {  
                if (!item || !item.code) return;  
                
                Lampa.Storage.set('keyboard_default_lang', item.code);  
                
                const hiddenCodes = getHiddenLanguages();  
                const index = hiddenCodes.indexOf(item.code);  
                if (index > -1) {  
                    hiddenCodes.splice(index, 1);  
                    saveHiddenLanguages(hiddenCodes);  
                }  
                
                updateDisplays();  
                
                isInSettingsDialog = false;  
                Lampa.Controller.toggle('settings_component');  
            },  
            onBack: function() {  
                isInSettingsDialog = false;  
                Lampa.Controller.toggle('settings_component');  
            }  
        });  
    }  
  
    function showHideLayoutsDialog() {  
        isInSettingsDialog = true;  
        
        const defaultCode = getDefaultCode();  
        let workingHidden = getHiddenLanguages().slice();  
  
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
                
                checkboxItems.forEach(function(item) {  
                    const titleEl = item.querySelector('.selectbox-item__title');  
                    if (!titleEl) return;  
                    
                    const titleText = titleEl.textContent.trim();  
                    const lang = LANGUAGES.find(function(l) { return l.title === titleText; });  
                    
                    if (!lang) return;  
                    
                    const isCurrentlyChecked = workingHidden.indexOf(lang.code) > -1;  
                    updateCheckboxVisually(item, isCurrentlyChecked);  
                    
                    const newItem = item.cloneNode(true);  
                    item.parentNode.replaceChild(newItem, item);  
                    
                    updateCheckboxVisually(newItem, isCurrentlyChecked);  
                    
                    newItem.addEventListener('click', function(e) {  
                        e.preventDefault();  
                        e.stopPropagation();  
                        
                        const index = workingHidden.indexOf(lang.code);  
                        let newCheckedState;  
                        
                        if (index > -1) {  
                            workingHidden.splice(index, 1);  
                            newCheckedState = false;  
                        } else {  
                            workingHidden.push(lang.code);  
                            newCheckedState = true;  
                        }  
                        
                        updateCheckboxVisually(newItem, newCheckedState);  
                        saveHiddenLanguages(workingHidden);  
                        
                        items = buildItems();  
                        
                        if (typeof Lampa.Select.update === 'function') {  
                            Lampa.Select.update(items);  
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
                    saveHiddenLanguages(workingHidden);  
                    updateDisplays();  
                    isInSettingsDialog = false;  
                    Lampa.Controller.toggle('settings_component');  
                }  
            });  
            
            attachHandlers();  
            
        } catch (e) {  
            console.error('showHideLayoutsDialog error:', e);  
            isInSettingsDialog = false;  
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
            name: 'keyboard_default_lang_button',  
            type: 'button'  
        },  
        field: {  
            name: 'Розкладка за замовчуванням',  
            description: 'Вибір розкладки за замовчуванням'  
        },  
        onChange: function() {  
            showDefaultLangDialog();  
        },  
        onRender: function(el) {  
            try {  
                el.find('.settings-param__value').text(getDefaultTitle());  
            } catch (e) {  
                console.error('onRender error:', e);  
            }  
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
            try {  
                showHideLayoutsDialog();  
            } catch (e) {  
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
            if (isInSettingsDialog) return;  
            if (isKeyboardLanguageSelector()) {  
                applyHidingToSelector();  
            }  
        }, 100);  
        
        const observer = new MutationObserver(function(mutations) {  
            if (!isLampaKeyboard()) return;  
            if (isInSettingsDialog) return;  
            
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
                applyHidingToSelector();  
                setTimeout(applyHidingToSelector, 1);  
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
