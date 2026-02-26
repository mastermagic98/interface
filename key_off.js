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
  
    // Переклади  
    const TRANSLATIONS = {  
        uk: {  
            component_name: 'Налаштування клавіатури',  
            default_layout: 'Розкладка за замовчуванням',  
            default_layout_desc: 'Вибір розкладки за замовчуванням',  
            hide_layouts: 'Приховати розкладки',  
            hide_layouts_desc: 'Вибір розкладок для приховування',  
            none: 'жодна'  
        },  
        ru: {  
            component_name: 'Настройки клавиатуры',  
            default_layout: 'Раскладка по умолчанию',  
            default_layout_desc: 'Выбор раскладки по умолчанию',  
            hide_layouts: 'Скрыть раскладки',  
            hide_layouts_desc: 'Выбор раскладок для скрытия',  
            none: 'нет'  
        },  
        en: {  
            component_name: 'Keyboard Settings',  
            default_layout: 'Default Layout',  
            default_layout_desc: 'Choose default keyboard layout',  
            hide_layouts: 'Hide Layouts',  
            hide_layouts_desc: 'Choose layouts to hide',  
            none: 'none'  
        }  
    };  
  
    let isInSettingsDialog = false;  
  
    function log(msg) {  
        console.log('[keyboard_settings_select]', msg);  
    }  
  
    function getLang() {  
        const lang = Lampa.Storage.get('language', 'uk');  
        return TRANSLATIONS[lang] || TRANSLATIONS.uk;  
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
        return hiddenTitles.length ? hiddenTitles.join(', ') : getLang().none;  
    }  
  
    function isKeyboardLanguageSelector() {  
        const selectbox = document.querySelector('.selectbox');  
        if (!selectbox) return false;  
        
        // Перевіряємо що це НЕ наш діалог налаштувань  
        const title = selectbox.querySelector('.selectbox__title');  
        if (title) {  
            const titleText = title.textContent.trim();  
            const lang = getLang();  
            // Якщо це наші діалоги - не застосовуємо приховування  
            if (titleText === lang.default_layout || titleText === lang.hide_layouts) {  
                return false;  
            }  
        }  
        
        const hasLanguageButtons = selectbox.querySelectorAll('.selectbox-item.selector').length > 0;  
        const hasCheckboxes = selectbox.querySelectorAll('.selectbox-item--checkbox').length > 0;  
        
        return hasLanguageButtons && !hasCheckboxes;  
    }  
  
    function applyHidingToSelector() {  
        if (!isLampaKeyboard()) {  
            return;  
        }  
        
        if (isInSettingsDialog) {  
            log('applyHiding: skipped - in settings dialog');  
            return;  
        }  
        
        if (!isKeyboardLanguageSelector()) {  
            return;  
        }  
        
        const defaultCode = getDefaultCode();  
        const hiddenCodes = getHiddenLanguages();  
        
        const buttons = document.querySelectorAll('.selectbox-item.selector:not(.selectbox-item--checkbox)');  
        
        if (buttons.length === 0) {  
            return;  
        }  
        
        log('applyHiding: hiding codes=' + JSON.stringify(hiddenCodes));  
        
        let hiddenCount = 0;  
        buttons.forEach(function(button) {  
            const buttonText = button.textContent.trim();  
            const lang = LANGUAGES.find(function(l) { return l.title === buttonText; });  
            
            if (lang) {  
                const isHidden = hiddenCodes.indexOf(lang.code) > -1;  
                const isDefault = lang.code === defaultCode;  
                
                if (isHidden && !isDefault) {  
                    button.style.display = 'none';  
                    hiddenCount++;  
                    log('applyHiding: HIDE ' + buttonText);  
                } else {  
                    button.style.display = '';  
                }  
            }  
        });  
        
        log('applyHiding: hidden ' + hiddenCount + ' buttons');  
    }  
  
    function updateDisplays() {  
        setTimeout(function() {  
            // Оновлюємо значення дефолтної мови  
            const defaultEl = $('.settings-param[data-name="keyboard_default_lang_button"] .settings-param__value');  
            if (defaultEl.length) {  
                defaultEl.text(getDefaultTitle());  
            }  
            
            // Оновлюємо значення прихованих мов  
            const hideEl = $('.settings-param[data-name="keyboard_hide_button"] .settings-param__value');  
            if (hideEl.length) {  
                hideEl.text(getHiddenLanguagesText());  
            }  
        }, 100);  
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
        log('showDefaultLangDialog: opened');  
        
        const currentDefault = getDefaultCode();  
        
        const items = LANGUAGES.map(function(lang) {  
            return {  
                title: lang.title,  
                code: lang.code,  
                selected: lang.code === currentDefault  
            };  
        });  
        
        Lampa.Select.show({  
            title: getLang().default_layout,  
            items: items,  
            onSelect: function(item) {  
                if (!item || !item.code) return;  
                
                log('showDefaultLangDialog: selected ' + item.code);  
                
                Lampa.Storage.set('keyboard_default_lang', item.code);  
                
                const hiddenCodes = getHiddenLanguages();  
                const index = hiddenCodes.indexOf(item.code);  
                if (index > -1) {  
                    hiddenCodes.splice(index, 1);  
                    saveHiddenLanguages(hiddenCodes);  
                }  
                
                isInSettingsDialog = false;  
                log('showDefaultLangDialog: closed');  
                
                updateDisplays();  
                Lampa.Controller.toggle('settings_component');  
            },  
            onBack: function() {  
                isInSettingsDialog = false;  
                log('showDefaultLangDialog: closed');  
                Lampa.Controller.toggle('settings_component');  
            }  
        });  
    }  
  
    function showHideLayoutsDialog() {  
        isInSettingsDialog = true;  
        log('showHideLayoutsDialog: opened');  
        
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
            }, 30);  
        }  
  
        try {  
            Lampa.Select.show({  
                title: getLang().hide_layouts,  
                items: items,  
                onSelect: function(item) {},  
                onBack: function() {  
                    saveHiddenLanguages(workingHidden);  
                    isInSettingsDialog = false;  
                    log('showHideLayoutsDialog: closed');  
                    updateDisplays();  
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
        name: getLang().component_name,  
        icon: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="38" height="38" fill="#ffffff"><path d="M459.576,99.307H52.423C23.524,99.307,0,122.837,0,151.736v192.879c0,37.536,30.537,68.078,68.068,68.078h375.862c37.532,0,68.069-30.542,68.069-68.078V151.736C512,122.837,488.475,99.307,459.576,99.307z M485.515,344.615c0,22.934-18.655,41.589-41.584,41.589H68.068c-22.929,0-41.584-18.655-41.584-41.589V151.736c0-14.306,11.638-25.938,25.938-25.938h407.154c14.301,0,25.938,11.633,25.938,25.938V344.615z"/><rect x="189.792" y="233.929" width="44.138" height="44.142"/><rect x="256.002" y="233.929" width="44.134" height="44.142"/><rect x="322.207" y="233.929" width="44.138" height="44.142"/><rect x="410.484" y="300.139" width="44.134" height="44.134"/><rect x="189.792" y="167.729" width="44.138" height="44.134"/><rect x="123.587" y="233.929" width="44.138" height="44.142"/><rect x="123.587" y="167.729" width="44.138" height="44.134"/><rect x="57.382" y="300.139" width="44.134" height="44.134"/><rect x="57.382" y="233.929" width="44.134" height="44.142"/><rect x="57.382" y="167.729" width="44.134" height="44.134"/><rect x="256.002" y="167.729" width="44.134" height="44.134"/><rect x="322.207" y="167.729" width="44.138" height="44.134"/><rect x="123.587" y="300.139" width="264.825" height="44.134"/><rect x="388.412" y="167.729" width="66.205" height="110.343"/></svg>'  
    });  
  
    Lampa.SettingsApi.addParam({  
        component: 'keyboard_settings_select',  
        param: {  
            name: 'keyboard_default_lang_button',  
            type: 'button'  
        },  
        field: {  
            name: getLang().default_layout,  
            description: getLang().default_layout_desc  
        },  
        onChange: function() {  
            showDefaultLangDialog();  
        },  
        onRender: function(el) {  
            try {  
                // Видаляємо клас button і додаємо структуру як у select  
                el.removeClass('settings-param--button');  
                
                // Перевіряємо чи вже є settings-param__value  
                if (el.find('.settings-param__value').length === 0) {  
                    // Додаємо settings-param__value після settings-param__name  
                    el.find('.settings-param__name').after('<div class="settings-param__value">' + getDefaultTitle() + '</div>');  
                } else {  
                    el.find('.settings-param__value').text(getDefaultTitle());  
                }  
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
            name: getLang().hide_layouts,  
            description: getLang().hide_layouts_desc  
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
                el.removeClass('settings-param--button');  
                
                if (el.find('.settings-param__value').length === 0) {  
                    el.find('.settings-param__name').after('<div class="settings-param__value">' + getHiddenLanguagesText() + '</div>');  
                } else {  
                    el.find('.settings-param__value').text(getHiddenLanguagesText());  
                }  
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
        
        // Швидкий інтервал  
        setInterval(function() {  
            if (isLampaKeyboard() && !isInSettingsDialog) {  
                applyHidingToSelector();  
            }  
        }, 50);  
        
        // Швидкий MutationObserver  
        const observer = new MutationObserver(function(mutations) {  
            if (!isLampaKeyboard() || isInSettingsDialog) return;  
            
            for (var i = 0; i < mutations.length; i++) {  
                var mutation = mutations[i];  
                if (mutation.addedNodes.length) {  
                    for (var j = 0; j < mutation.addedNodes.length; j++) {  
                        var node = mutation.addedNodes[j];  
                        if (node.nodeType === 1 && node.classList && node.classList.contains('selectbox')) {  
                            log('MutationObserver: selectbox detected');  
                            applyHidingToSelector();  
                            setTimeout(applyHidingToSelector, 5);  
                            setTimeout(applyHidingToSelector, 20);  
                            return;  
                        }  
                    }  
                }  
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
