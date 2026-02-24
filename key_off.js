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
        log('getDefaultCode -> ' + val);  
        return val;  
    }  
  
    function getDefaultTitle() {  
        const code = getDefaultCode();  
        const lang = LANGUAGES.find(l => l.code === code);  
        const title = lang ? lang.title : 'Українська';  
        log('getDefaultTitle -> ' + title);  
        return title;  
    }  
  
    function getHiddenLanguages() {  
        // Отримуємо збережений масив прихованих мов  
        const stored = Lampa.Storage.get('keyboard_hidden_layouts', '[]');  
        log('getHiddenLanguages: stored string=' + stored);  
        try {  
            const parsed = JSON.parse(stored);  
            log('getHiddenLanguages: parsed=' + JSON.stringify(parsed));  
            return Array.isArray(parsed) ? parsed : [];  
        } catch (e) {  
            log('getHiddenLanguages: parse error=' + e.message + ', returning []');  
            return [];  
        }  
    }  
  
    function saveHiddenLanguages(hiddenCodes) {  
        log('saveHiddenLanguages: saving ' + JSON.stringify(hiddenCodes));  
        const jsonString = JSON.stringify(hiddenCodes);  
        Lampa.Storage.set('keyboard_hidden_layouts', jsonString);  
        
        // Перевіряємо, що збереглося  
        const verified = Lampa.Storage.get('keyboard_hidden_layouts', '[]');  
        log('saveHiddenLanguages: verified stored value=' + verified);  
        
        // Також зберігаємо в окремі ключі для зворотної сумісності  
        LANGUAGES.forEach(lang => {  
            const isHidden = hiddenCodes.includes(lang.code);  
            Lampa.Storage.set(lang.key, isHidden ? 'true' : 'false');  
            log('saveHiddenLanguages: set ' + lang.key + '=' + (isHidden ? 'true' : 'false'));  
        });  
    }  
  
    function getHiddenLanguagesText() {  
        const hiddenCodes = getHiddenLanguages();  
        const hiddenTitles = LANGUAGES  
            .filter(lang => hiddenCodes.includes(lang.code))  
            .map(lang => lang.title);  
        return hiddenTitles.length ? hiddenTitles.join(', ') : 'жодна';  
    }  
  
    function filterLayouts(layouts) {  
        const defaultCode = getDefaultCode();  
        const hiddenCodes = getHiddenLanguages();  
        
        const filtered = layouts.filter(l => {  
            const langObj = LANGUAGES.find(lang => lang.code === l.code);  
            if (!langObj) return true;  
            
            const hide = hiddenCodes.includes(l.code);  
            const keep = !hide || l.code === defaultCode;  
            
            log('filterLayouts: code=' + l.code + ' hide=' + hide + ' keep=' + keep);  
            return keep;  
        });  
        
        log('filterLayouts: before=' + layouts.length + ' after=' + filtered.length);  
        return filtered;  
    }  
  
    function hookKeyboard() {  
        if (window.Keyboard && window.Keyboard.prototype) {  
            const origInit = window.Keyboard.prototype.init;  
            window.Keyboard.prototype.init = function () {  
                if (this.layouts) {  
                    log('hookKeyboard: before layouts=' + this.layouts.length);  
                    this.layouts = filterLayouts(this.layouts);  
                    log('hookKeyboard: after layouts=' + this.layouts.length);  
                }  
                return origInit.apply(this, arguments);  
            };  
            log('hookKeyboard: hooked');  
        } else {  
            log('hookKeyboard: window.Keyboard not available yet');  
        }  
    }  
  
    function ensureKeyboardHooked() {  
        if (!window.Keyboard) {  
            log('ensureKeyboardHooked: Keyboard not ready, retry in 500ms');  
            setTimeout(ensureKeyboardHooked, 500);  
            return;  
        }  
        hookKeyboard();  
    }  
  
    function applyHidingToSelector() {  
        log('applyHidingToSelector: start');  
        const defaultCode = getDefaultCode();  
        const hiddenCodes = getHiddenLanguages();  
        
        setTimeout(function() {  
            LANGUAGES.forEach(lang => {  
                const hide = hiddenCodes.includes(lang.code);  
                const element = $('.selectbox-item.selector').filter(function () {  
                    return $(this).text().trim() === lang.title;  
                });  
                
                if (element.length) {  
                    // Приховуємо лише якщо це не розкладка за замовчуванням  
                    const shouldHide = hide && lang.code !== defaultCode;  
                    element.toggle(!shouldHide);  
                    log('applyHidingToSelector: ' + lang.title + ' -> ' + (!shouldHide ? 'shown' : 'hidden'));  
                }  
            });  
        }, 150);  
    }  
  
    function updateHideDisplay() {  
        log('updateHideDisplay: start');  
        const hideEl = $('.settings-param[data-name="keyboard_hide_button"] .settings-param__value');  
        if (hideEl.length) {  
            const hideText = getHiddenLanguagesText();  
            hideEl.text(hideText);  
            log('updateHideDisplay: hide text set to ' + hideText);  
        }  
    }  
  
    function showHideLayoutsDialog() {  
        log('showHideLayoutsDialog: opened');  
        const defaultCode = getDefaultCode();  
        
        // ВАЖЛИВО: отримуємо поточний стан з Storage кожного разу  
        let hiddenCodes = getHiddenLanguages();  
        log('showHideLayoutsDialog: initial hiddenCodes=' + JSON.stringify(hiddenCodes));  
  
        function buildItems() {  
            // Перечитуємо поточний стан перед побудовою  
            hiddenCodes = getHiddenLanguages();  
            log('buildItems: current hiddenCodes=' + JSON.stringify(hiddenCodes));  
            
            // Виключаємо розкладку за замовчуванням зі списку  
            return LANGUAGES  
                .filter(lang => lang.code !== defaultCode)  
                .map(lang => {  
                    const selected = hiddenCodes.includes(lang.code);  
                    log('buildItems: lang=' + lang.title + ' code=' + lang.code + ' selected=' + selected);  
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
            onSelect(item) {  
                log('showHideLayoutsDialog onSelect: START - item.title=' + item.title + ' item.code=' + item.code);  
                
                if (!item || !item.code) {  
                    log('showHideLayoutsDialog onSelect: no item.code, abort');  
                    return;  
                }  
                
                // Отримуємо ПОТОЧНИЙ стан з Storage  
                let currentHiddenCodes = getHiddenLanguages();  
                log('showHideLayoutsDialog onSelect: BEFORE toggle, currentHiddenCodes=' + JSON.stringify(currentHiddenCodes));  
                
                // Перемикаємо стан  
                const index = currentHiddenCodes.indexOf(item.code);  
                if (index > -1) {  
                    // Видаляємо з прихованих  
                    currentHiddenCodes.splice(index, 1);  
                    log('showHideLayoutsDialog onSelect: REMOVED ' + item.code);  
                } else {  
                    // Додаємо до прихованих  
                    currentHiddenCodes.push(item.code);  
                    log('showHideLayoutsDialog onSelect: ADDED ' + item.code);  
                }  
                
                log('showHideLayoutsDialog onSelect: AFTER toggle, currentHiddenCodes=' + JSON.stringify(currentHiddenCodes));  
                
                // ЗБЕРІГАЄМО НЕГАЙНО  
                saveHiddenLanguages(currentHiddenCodes);  
                
                // Перевіряємо, що збереглося  
                const verifyHidden = getHiddenLanguages();  
                log('showHideLayoutsDialog onSelect: VERIFIED after save=' + JSON.stringify(verifyHidden));  
                
                // Оновлюємо клавіатуру  
                if (window.keyboard) {  
                    window.keyboard.init();  
                    log('showHideLayoutsDialog onSelect: keyboard reinitialized');  
                }  
                
                // Перебудовуємо список елементів (це заново прочитає з Storage)  
                items = buildItems();  
                log('showHideLayoutsDialog onSelect: items rebuilt, count=' + items.length);  
                
                // Оновлюємо Select dialog  
                if (typeof Lampa.Select.update === 'function') {  
                    log('showHideLayoutsDialog onSelect: calling Lampa.Select.update');  
                    Lampa.Select.update(items);  
                } else {  
                    log('showHideLayoutsDialog onSelect: Lampa.Select.update not available, reopening');  
                    Lampa.Select.destroy();  
                    setTimeout(showHideLayoutsDialog, 0);  
                }  
                
                // Оновлюємо відображення в налаштуваннях  
                updateHideDisplay();  
                
                log('showHideLayoutsDialog onSelect: END');  
            },  
            onBack() {  
                log('showHideLayoutsDialog onBack');  
                // При закритті оновлюємо відображення  
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
  
    // Параметр для вибору розкладки за замовчуванням (select)  
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
            log('onChange keyboard_default_lang: new value=' + value);  
            
            // Зберігаємо нову розкладку за замовчуванням  
            Lampa.Storage.set('keyboard_default_lang', value);  
            
            // Автоматично видаляємо нову розкладку за замовчуванням з прихованих  
            const hiddenCodes = getHiddenLanguages();  
            const index = hiddenCodes.indexOf(value);  
            if (index > -1) {  
                hiddenCodes.splice(index, 1);  
                saveHiddenLanguages(hiddenCodes);  
                log('onChange keyboard_default_lang: removed ' + value + ' from hidden, new array=' + JSON.stringify(hiddenCodes));  
            }  
            
            // Оновлюємо клавіатуру  
            if (window.keyboard) {  
                window.keyboard.init();  
                log('onChange keyboard_default_lang: keyboard reinitialized');  
            }  
            
            // Оновлюємо відображення прихованих розкладок  
            updateHideDisplay();  
        }  
    });  
  
    // Параметр для вибору розкладок для приховування (button)  
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
        onRender(el) {  
            try {  
                // Встановлюємо поточне значення  
                const hideText = getHiddenLanguagesText();  
                el.find('.settings-param__value').text(hideText);  
                log('onRender hide button: rendered with value "' + hideText + '"');  
            } catch (e) {  
                console.error('keyboard_settings_select onRender error (hide):', e);  
            }  
        }  
    });  
  
    function start() {  
        log('start: begin');  
        
        // Виводимо поточні значення з Storage для діагностики  
        log('start: keyboard_default_lang=' + Lampa.Storage.get('keyboard_default_lang', 'uk'));  
        log('start: keyboard_hidden_layouts=' + Lampa.Storage.get('keyboard_hidden_layouts', '[]'));  
        
        ensureKeyboardHooked();  
        
        // Відслідковуємо відкриття селектора розкладок  
        Lampa.Listener.follow('select', e => {  
            if (e.type === 'open') {  
                log('listener select open: will applyHidingToSelector');  
                applyHidingToSelector();  
            }  
        });  
        
        // Відслідковуємо натискання кнопки перемикання мови  
        $(document).on('click', '.hg-button.hg-functionBtn.selector', function() {  
            log('Language selector button clicked');  
            applyHidingToSelector();  
        });  
        
        log('start: done');  
    }  
  
    if (window.appready) start();  
    else Lampa.Listener.follow('app', function (e) {  
        if (e.type === 'ready') start();  
    });  
  
})();
