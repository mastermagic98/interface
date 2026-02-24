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
  
    function getHiddenLanguagesText() {  
        const hiddenTitles = LANGUAGES  
            .filter(lang => Lampa.Storage.get(lang.key, 'false') === 'true')  
            .map(lang => lang.title);  
        return hiddenTitles.length ? hiddenTitles.join(', ') : 'жодна';  
    }  
  
    function filterLayouts(layouts) {  
        const defaultCode = getDefaultCode();  
        const filtered = layouts.filter(l => {  
            const langObj = LANGUAGES.find(lang => lang.code === l.code);  
            if (!langObj) return true;  
            const hide = Lampa.Storage.get(langObj.key, 'false') === 'true';  
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
        
        setTimeout(function() {  
            LANGUAGES.forEach(lang => {  
                const hide = Lampa.Storage.get(lang.key, 'false') === 'true';  
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
  
        function buildItems() {  
            // Виключаємо розкладку за замовчуванням зі списку  
            return LANGUAGES  
                .filter(lang => lang.code !== defaultCode)  
                .map(lang => {  
                    const stored = Lampa.Storage.get(lang.key, 'false');  
                    const selected = stored === 'true';  
                    log('buildItems: lang=' + lang.title + ' stored=' + stored + ' selected=' + selected);  
                    return {  
                        title: lang.title,  
                        checkbox: true,  
                        selected: selected,  
                        key: lang.key,  
                        code: lang.code  
                    };  
                });  
        }  
  
        let items = buildItems();  
  
        Lampa.Select.show({  
            title: 'Приховати розкладки',  
            items: items,  
            onSelect(item) {  
                log('showHideLayoutsDialog onSelect: triggered for item=' + JSON.stringify(item));  
                if (!item || !item.key) {  
                    log('showHideLayoutsDialog onSelect: no item.key, abort');  
                    return;  
                }  
                
                const current = Lampa.Storage.get(item.key, 'false') === 'true';  
                const newVal = current ? 'false' : 'true';  
                log('showHideLayoutsDialog onSelect: key=' + item.key + ' current=' + current + ' set=' + newVal);  
                
                Lampa.Storage.set(item.key, newVal);  
                
                // Оновлюємо клавіатуру  
                if (window.keyboard) window.keyboard.init();  
                
                // Перебудовуємо список елементів  
                items = buildItems();  
                
                if (typeof Lampa.Select.update === 'function') {  
                    Lampa.Select.update(items);  
                } else {  
                    Lampa.Select.destroy();  
                    setTimeout(showHideLayoutsDialog, 0);  
                }  
                
                updateHideDisplay();  
            },  
            onBack() {  
                log('showHideLayoutsDialog onBack');  
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
            
            // Автоматично показуємо нову розкладку за замовчуванням, якщо вона була прихована  
            const langObj = LANGUAGES.find(l => l.code === value);  
            if (langObj) {  
                Lampa.Storage.set(langObj.key, 'false');  
            }  
            
            // Оновлюємо клавіатуру  
            if (window.keyboard) window.keyboard.init();  
            
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
                el.find('.settings-param__value').text(getHiddenLanguagesText());  
                log('onRender hide button: rendered with value');  
            } catch (e) {  
                console.error('keyboard_settings_select onRender error (hide):', e);  
            }  
        }  
    });  
  
    function start() {  
        log('start: begin');  
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
