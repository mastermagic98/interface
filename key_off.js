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
        
        if (!stored || stored === 'undefined' || stored === 'null') {  
            return [];  
        }  
        
        if (typeof stored === 'string' && stored.length > 0) {  
            if (stored.indexOf(',') > -1) {  
                return stored.split(',').filter(function(s) { return s.trim().length > 0; });  
            } else if (stored.length > 0) {  
                return [stored];  
            }  
        }  
        
        return [];  
    }  
  
    function saveHiddenLanguages(hiddenCodes) {  
        const stringValue = hiddenCodes.join(',');  
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
  
    function applyHidingToSelector() {  
        const defaultCode = getDefaultCode();  
        const hiddenCodes = getHiddenLanguages();  
        
        log('applyHidingToSelector: START, hiddenCodes=' + JSON.stringify(hiddenCodes));  
        
        // Пробуємо різні селектори для знаходження кнопок мов  
        const selectors = [  
            '.hg-button.selector',  
            '.hg-button.hg-functionBtn.selector',  
            '.selectbox-item.selector',  
            '.selectbox .selector'  
        ];  
        
        let foundButtons = [];  
        
        selectors.forEach(function(selector) {  
            const buttons = document.querySelectorAll(selector);  
            if (buttons.length > 0) {  
                log('applyHidingToSelector: found ' + buttons.length + ' buttons with selector "' + selector + '"');  
                foundButtons = buttons;  
            }  
        });  
        
        if (foundButtons.length === 0) {  
            log('applyHidingToSelector: NO BUTTONS FOUND with any selector');  
            return;  
        }  
        
        foundButtons.forEach(function(button) {  
            const buttonText = button.textContent.trim();  
            log('applyHidingToSelector: checking button text="' + buttonText + '"');  
            
            const lang = LANGUAGES.find(function(l) { return l.title === buttonText; });  
            
            if (lang) {  
                const isHidden = hiddenCodes.indexOf(lang.code) > -1;  
                const isDefault = lang.code === defaultCode;  
                const shouldHide = isHidden && !isDefault;  
                
                button.style.display = shouldHide ? 'none' : '';  
                log('applyHidingToSelector: ' + buttonText + ' -> ' + (shouldHide ? 'HIDDEN' : 'VISIBLE'));  
            }  
        });  
    }  
  
    function updateHideDisplay() {  
        setTimeout(function() {  
            const hideEl = $('.settings-param[data-name="keyboard_hide_button"] .settings-param__value');  
            if (hideEl.length) {  
                const text = getHiddenLanguagesText();  
                hideEl.text(text);  
                log('updateHideDisplay: updated to "' + text + '"');  
            }  
        }, 100);  
    }  
  
    function showHideLayoutsDialog() {  
        const defaultCode = getDefaultCode();  
        let workingHidden = getHiddenLanguages().slice(); // Створюємо копію масиву  
        
        log('showHideLayoutsDialog: initial=' + JSON.stringify(workingHidden));  
  
        function buildItems() {  
            log('buildItems: workingHidden=' + JSON.stringify(workingHidden));  
            
            return LANGUAGES  
                .filter(function(lang) { return lang.code !== defaultCode; })  
                .map(function(lang) {  
                    const isSelected = workingHidden.indexOf(lang.code) > -1;  
                    log('buildItems: ' + lang.title + ' (code=' + lang.code + ') selected=' + isSelected);  
                    return {  
                        title: lang.title,  
                        checkbox: true,  
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
                log('onSelect: CALLED, code=' + item.code);  
                
                if (!item || !item.code) {  
                    log('onSelect: no code, ABORT');  
                    return;  
                }  
                
                log('onSelect: BEFORE workingHidden=' + JSON.stringify(workingHidden));  
                
                const index = workingHidden.indexOf(item.code);  
                
                if (index > -1) {  
                    workingHidden.splice(index, 1);  
                    log('onSelect: REMOVED ' + item.code);  
                } else {  
                    workingHidden.push(item.code);  
                    log('onSelect: ADDED ' + item.code);  
                }  
                
                log('onSelect: AFTER workingHidden=' + JSON.stringify(workingHidden));  
                
                // Оновлюємо items  
                items = buildItems();  
                
                // Оновлюємо діалог  
                if (typeof Lampa.Select.update === 'function') {  
                    log('onSelect: calling Lampa.Select.update');  
                    Lampa.Select.update(items);  
                } else {  
                    log('onSelect: reopening dialog');  
                    Lampa.Select.destroy();  
                    setTimeout(showHideLayoutsDialog, 0);  
                }  
            },  
            onBack: function() {  
                log('onBack: final=' + JSON.stringify(workingHidden));  
                saveHiddenLanguages(workingHidden);  
                updateHideDisplay();  
                
                // Застосовуємо приховування з затримкою  
                setTimeout(applyHidingToSelector, 500);  
                
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
            log('onChange default lang: ' + value);  
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
                const text = getHiddenLanguagesText();  
                el.find('.settings-param__value').text(text);  
            } catch (e) {  
                console.error('onRender error:', e);  
            }  
        }  
    });  
  
    function init() {  
        log('init: START');  
        
        const stored = Lampa.Storage.get('keyboard_hidden_layouts');  
        log('init: stored="' + stored + '"');  
        
        // Спостерігаємо за появою будь-яких діалогів  
        const observer = new MutationObserver(function(mutations) {  
            mutations.forEach(function(mutation) {  
                if (mutation.addedNodes.length) {  
                    mutation.addedNodes.forEach(function(node) {  
                        if (node.nodeType === 1) {  
                            // Перевіряємо чи це selectbox або контейнер з кнопками селектора  
                            if (node.classList && (node.classList.contains('selectbox') || node.querySelector('.selector'))) {  
                                log('MutationObserver: selector dialog detected');  
                                setTimeout(applyHidingToSelector, 100);  
                                setTimeout(applyHidingToSelector, 300);  
                                setTimeout(applyHidingToSelector, 500);  
                            }  
                        }  
                    });  
                }  
            });  
        });  
        
        observer.observe(document.body, {  
            childList: true,  
            subtree: true  
        });  
        
        // Також слухаємо клік на кнопку селектора  
        $(document).on('click', '.hg-button.selector, .hg-functionBtn.selector', function() {  
            log('Selector button clicked');  
            setTimeout(applyHidingToSelector, 100);  
            setTimeout(applyHidingToSelector, 300);  
            setTimeout(applyHidingToSelector, 500);  
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
