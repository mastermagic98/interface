(function(){
    'use strict';
 
    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;
    if (window.keyboard_settings_select) return;
    window.keyboard_settings_select = true;
 
    const LANGUAGES = [
        { title: 'Українська', code: 'uk', key: 'keyboard_hide_uk' },
        { title: 'Русский', code: 'default', key: 'keyboard_hide_ru' },
        { title: 'English', code: 'en', key: 'keyboard_hide_en' },
        { title: 'עִברִית', code: 'he', key: 'keyboard_hide_he' }
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
                log('Keyboard.init called');
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
 
    function ensureKeyboardHooked(retry = 0) {
        if (retry > 50) {
            log('ensureKeyboardHooked: max retries reached');
            return;
        }
        if (!window.Keyboard) {
            log('ensureKeyboardHooked: Keyboard not ready, retry in 500ms ' + retry);
            setTimeout(() => ensureKeyboardHooked(retry + 1), 500);
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
            const element = $('.selectbox-item.selector > div.selectbox-item__title:contains("' + lang.title + '")').closest('.selectbox-item.selector');
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
        setTimeout(function() {
            const defaultEl = $('.settings-param[data-name="keyboard_default_trigger"] .settings-param__value');
            if (defaultEl.length) {
                const title = getDefaultTitle();
                defaultEl.text(title);
                log('updateDisplays: default title set to ' + title + '; current text=' + defaultEl.text());
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
                log('updateDisplays: hide text set to ' + hideText + '; current text=' + hideEl.text());
            } else {
                log('updateDisplays: hide display element not found');
            }
        }, 100);
    }
 
    function openDefaultMenu() {
        log('openDefaultMenu: opened');
        const current = getDefaultCode();
        const items = LANGUAGES.map(lang => ({
            title: lang.title,
            value: lang.code,
            selected: lang.code === current
        }));
        log('openDefaultMenu: items.length ' + items.length);
 
        try {
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
        } catch (e) {
            log('openDefaultMenu error: ' + e.message);
        }
    }
 
    function openHideMenu() {
        log('openHideMenu: opened');
        if (!window.Lampa || !Lampa.Storage) {
            log('openHideMenu: Lampa.Storage not available');
            return;
        }
        const defaultCode = getDefaultCode();
 
        function buildItems() {
            const filtered = LANGUAGES.filter(lang => lang.code !== defaultCode);
            log('buildItems: filtered languages length ' + filtered.length);
            return filtered.map(lang => {
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
        log('openHideMenu: items.length ' + items.length);
 
        try {
            Lampa.Select.show({
                title: 'Приховати розкладки',
                items: items,
                onSelect(item) {
                    log('openHideMenu onSelect: triggered for item.title=' + item.title);
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
                        log('openHideMenu onSelect: Lampa.Select.update exists');
                        Lampa.Select.update(items);
                    } else {
                        log('openHideMenu onSelect: Lampa.Select.update not exists, re-open');
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
        } catch (e) {
            log('openHideMenu error: ' + e.message);
        }
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
                log('onRender default: el length ' + el.length);
                const title = getDefaultTitle();
                setTimeout(function() {
                    const defaultEl = el.find('.settings-param__value');
                    log('onRender default: defaultEl length ' + defaultEl.length);
                    defaultEl.text(title);
                    log('onRender default: set text to ' + title + '; current text=' + defaultEl.text());
                }, 0);
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
                log('onRender hide: el length ' + el.length);
                const hiddenTitles = LANGUAGES
                    .filter(lang => Lampa.Storage.get(lang.key, 'false') === 'true')
                    .map(lang => lang.title);
                const hideText = hiddenTitles.length ? hiddenTitles.join(', ') : 'жодна';
                setTimeout(function() {
                    const hideEl = el.find('.settings-param__value');
                    log('onRender hide: hideEl length ' + hideEl.length);
                    hideEl.text(hideText);
                    log('onRender hide: set text to ' + hideText + '; current text=' + hideEl.text());
                }, 0);
                el.off('hover:enter').on('hover:enter', function () {
                    log('hover:enter triggered for hide trigger');
                    openHideMenu();
                });
                log('onRender hide: rendered and hover:enter bound');
            } catch (e) {
                console.error('keyboard_settings_select onRender error (hide):', e);
            }
        }
    });
 
    // Твій робочий setInterval для перевірки LANG кнопки
    setInterval(function() {
        var elementCHlang = $('div.hg-button.hg-functionBtn.hg-button-LANG.selector.binded');
        if (elementCHlang.length > 0){
            log('setInterval: LANG button found, call applyHiding');
            applyHiding();
        }
    }, 0);

    function start() {
        log('start: begin');
        ensureKeyboardHooked();
        setTimeout(updateDisplays, 100);
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
