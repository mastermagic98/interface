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
  
    function applyHiding() {  
        log('applyHiding: start');  
        if (!window.Lampa || !Lampa.Storage) {  
            log('applyHiding: Lampa.Storage not available');  
            return;  
        }  
        LANGUAGES.forEach(lang => {  
            const stored = Lampa.Storage.get(lang.key, 'false');  
            const hide = stored === 'true';  
            log('applyHiding: lang=' + lang.title + ' stored=' + stored + ' hide=' + hide);  
            const element = $('.selectbox-item.selector').filter(function () {  
                return $(this).text().trim() === lang.title;  
            });  
            if (element.length) {  
                element.toggle(!hide);  
                log('applyHiding: toggled ' + lang.title + ' -> ' + (!hide ? 'shown' : 'hidden'));  
            } else {  
                log('applyHiding: element not found for ' + lang.title);  
            }  
        });  
    }  
  
    function updateDisplays() {  
        log('updateDisplays: start');  
        const defaultEl = $('.settings-param[data-name="keyboard_default_trigger"] .settings-param__value');  
        if (defaultEl.length) {  
            const title = getDefaultTitle();  
            defaultEl.text(title);  
            log('updateDisplays: default title set to ' + title);  
        } else {  
            log('updateDisplays: default display element not found');  
        }  
  
        const hiddenTitles = LANGUAGES  
            .filter(lang => {  
                const stored = Lampa.Storage.get(lang.key, 'false');  
                const hide = stored === 'true';  
                log('updateDisplays: hidden check lang=' + lang.title + ' stored=' + stored + ' hide=' + hide);  
                return hide;  
            })  
            .map(lang => lang.title);  
        const hideText = hiddenTitles.length ? hiddenTitles.join(', ') : 'жодна';  
        const hideEl = $('.settings-param[data-name="keyboard_hide_trigger"] .settings-param__value');  
        if (hideEl.length) {  
            hideEl.text(hideText);  
            log('updateDisplays: hide text set to ' + hideText);  
        } else {  
            log('updateDisplays: hide display element not found');  
        }  
    }  
  
    function openDefaultMenu() {  
        log('openDefaultMenu: opened');  
        const current = getDefaultCode();  
        const items = LANGUAGES.map(lang => ({  
            title: lang.title,  
            value: lang.code,  
            selected: lang.code === current  
        }));  
  
        Lampa.Select.show({  
            title: 'Розкладка за замовчуванням',  
            items: items,  
            onSelect(item) {  
                if (!item.value) return;  
                log('openDefaultMenu onSelect: set keyboard_default_lang=' + item.value);  
                Lampa.Storage.set('keyboard_default_lang', item.value);  
                if (window.keyboard) window.keyboard.init();  
                updateDisplays();  
            },  
            onBack() {  
                Lampa.Controller.toggle('settings_component');  
            }  
        });  
    }  
  
    function openHideMenu() {  
        log('openHideMenu: opened');  
        if (!window.Lampa || !Lampa.Storage) {  
            log('openHideMenu: Lampa.Storage not available');  
            return;  
        }  
        const defaultCode = getDefaultCode();  
  
        function buildItems() {  
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
                        key: lang.key  
                    };  
                });  
        }  
  
        let items = buildItems();  
  
        Lampa.Select.show({  
            title: 'Приховати розкладки',  
            items: items,  
            onSelect(item) {  
                log('openHideMenu onSelect: triggered for item=' + JSON.stringify(item));  
                if (!item || !item.key) {  
                    log('openHideMenu onSelect: no item.key, abort');  
                    return;  
                }  
                const current = Lampa.Storage.get(item.key, 'false') === 'true';  
                const newVal = current ? 'false' : 'true';  
                log('openHideMenu onSelect: key=' + item.key + ' current=' + current + ' set=' + newVal);  
                Lampa.Storage.set(item.key, newVal);  
                if (window.keyboard) window.keyboard.init();  
                applyHiding();  
                items = buildItems();  
                if (typeof Lampa.Select.update === 'function') {  
                    Lampa.Select.update(items);  
                } else {  
                    Lampa.Select.destroy();  
                    setTimeout(openHideMenu, 0);  
                }  
                updateDisplays();  
            },  
            onBack() {  
                log('openHideMenu onBack');  
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
        param: { name: 'keyboard_default_trigger', type: 'trigger', default: false },  
        field: {  
            name: 'Розкладка за замовчуванням',  
            description: 'Вибір розкладки за замовчуванням'  
        },  
        onRender(el) {  
            try {  
                el.find('.settings-param__value').text(getDefaultTitle());  
                el.off('hover:enter').on('hover:enter', function () {  
                    log('hover:enter triggered for default trigger');  
                    openDefaultMenu();  
                });  
                log('onRender default: rendered and hover:enter bound');  
            } catch (e) {  
                console.error('keyboard_settings_select onRender error (default):', e);  
            }  
        }  
    });  
  
    Lampa.SettingsApi.addParam({  
        component: 'keyboard_settings_select',  
        param: { name: 'keyboard_hide_trigger', type: 'trigger', default: false },  
        field: {  
            name: 'Приховати розкладки',  
            description: 'Вибір розкладок для приховування'  
        },  
        onRender(el) {  
            try {  
                const hiddenTitles = LANGUAGES  
                    .filter(lang => Lampa.Storage.get(lang.key, 'false') === 'true')  
                    .map(lang => lang.title);  
                const hideText = hiddenTitles.length ? hiddenTitles.join(', ') : 'жодна';  
                el.find('.settings-param__value').text(hideText);  
                el.off('hover:enter').on('hover:enter', function () {  
                    log('hover:enter triggered for hide trigger');  
                    openHideMenu();  
                });  
                log('onRender hide: rendered with "' + hideText + '" and hover:enter bound');  
            } catch (e) {  
                console.error('keyboard_settings_select onRender error (hide):', e);  
            }  
        }  
    });  
  
    function start() {  
        log('start: begin');  
        ensureKeyboardHooked();  
        setTimeout(updateDisplays, 0);  
        Lampa.Listener.follow('select', e => {  
            if (e.type === 'open') {  
                log('listener select open: will applyHiding in 100ms');  
                setTimeout(applyHiding, 100);  
            }  
        });  
        log('start: done');  
    }  
  
    if (window.appready) start();  
    else Lampa.Listener.follow('app', function (e) {  
        if (e.type === 'ready') start();  
    });  
  
})();
