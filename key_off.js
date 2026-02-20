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
 
    function applyHiding() {
        log('applyHiding: start');
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
        setTimeout(() => {
            // Розкладка за замовчуванням
            const defaultEl = $('.settings-param[data-name="keyboard_default_trigger"] .settings-param__value');
            if (defaultEl.length) {
                const title = getDefaultTitle();
                defaultEl.text(title);
                log('updateDisplays: default set to ' + title);
            }
 
            // Приховати розкладки
            const hiddenTitles = LANGUAGES
                .filter(lang => Lampa.Storage.get(lang.key, 'false') === 'true')
                .map(lang => lang.title);
            const hideText = hiddenTitles.length ? hiddenTitles.join(', ') : 'жодна';
            
            const hideEl = $('.settings-param[data-name="keyboard_hide_trigger"] .settings-param__value');
            if (hideEl.length) {
                hideEl.text(hideText);
                log('updateDisplays: hide set to "' + hideText + '" ← це має бути видно в меню');
            }
        }, 150);
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
                Lampa.Storage.set('keyboard_default_lang', item.value);
                log('openDefaultMenu onSelect: saved ' + item.value);
                if (window.keyboard) window.keyboard.init();
                updateDisplays();
            },
            onBack() {
                log('openDefaultMenu onBack');
                Lampa.Controller.toggle('settings_component');
                setTimeout(updateDisplays, 300);
            }
        });
    }
 
    function openHideMenu() {
        log('openHideMenu: opened');
        const defaultCode = getDefaultCode();
 
        function buildItems() {
            return LANGUAGES
                .filter(lang => lang.code !== defaultCode)
                .map(lang => {
                    const stored = Lampa.Storage.get(lang.key, 'false');
                    return {
                        title: lang.title,
                        checkbox: true,
                        selected: stored === 'true',
                        key: lang.key
                    };
                });
        }
 
        let items = buildItems();
 
        Lampa.Select.show({
            title: 'Приховати розкладки',
            items: items,
            onSelect(item) {
                if (!item || !item.key) return;
                const current = Lampa.Storage.get(item.key, 'false') === 'true';
                const newVal = current ? 'false' : 'true';
                Lampa.Storage.set(item.key, newVal);
                log('openHideMenu onSelect: ' + item.key + ' = ' + newVal);
                if (window.keyboard) window.keyboard.init();
                applyHiding();
                updateDisplays();               // після кожної галочки
                items = buildItems();
                if (typeof Lampa.Select.update === 'function') Lampa.Select.update(items);
                else setTimeout(openHideMenu, 50);
            },
            onBack() {
                log('openHideMenu onBack ← головне місце виправлення');
                Lampa.Controller.toggle('settings_component');
                setTimeout(updateDisplays, 400);   // велика затримка після повернення в меню
                setTimeout(updateDisplays, 800);   // ще один виклик для надійності
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
        field: { name: 'Розкладка за замовчуванням', description: 'Вибір розкладки за замовчуванням' },
        onRender(el) {
            setTimeout(() => {
                el.find('.settings-param__value').text(getDefaultTitle());
            }, 50);
            el.off('hover:enter').on('hover:enter', openDefaultMenu);
        }
    });
 
    Lampa.SettingsApi.addParam({
        component: 'keyboard_settings_select',
        param: { name: 'keyboard_hide_trigger', type: 'trigger', default: false },
        field: { name: 'Приховати розкладки', description: 'Вибір розкладок для приховування' },
        onRender(el) {
            setTimeout(() => {
                const hidden = LANGUAGES.filter(l => Lampa.Storage.get(l.key, 'false') === 'true')
                                      .map(l => l.title);
                el.find('.settings-param__value').text(hidden.length ? hidden.join(', ') : 'жодна');
            }, 50);
            el.off('hover:enter').on('hover:enter', openHideMenu);
        }
    });
 
    // Твій робочий інтервал
    setInterval(function() {
        if ($('div.hg-button.hg-functionBtn.hg-button-LANG.selector.binded').length > 0) {
            applyHiding();
        }
    }, 0);
 
    function start() {
        setTimeout(updateDisplays, 500);
        Lampa.Listener.follow('select', e => {
            if (e.type === 'open') setTimeout(applyHiding, 100);
        });
        // Додатковий listener на повернення в налаштування
        Lampa.Listener.follow('settings', function(e) {
            if (e.type === 'open') {
                log('settings opened - force updateDisplays');
                setTimeout(updateDisplays, 300);
            }
        });
    }
 
    if (window.appready) start();
    else Lampa.Listener.follow('app', function (e) {
        if (e.type === 'ready') start();
    });
 
})();
