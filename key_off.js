(function(){
    'use strict';
 
    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;
    if (window.keyboard_settings_select) return;
    window.keyboard_settings_select = true;
 
    const LANGUAGES = [
        { title: 'Українська', key: 'keyboard_hide_uk' },
        { title: 'Русский',    key: 'keyboard_hide_ru' },
        { title: 'English',    key: 'keyboard_hide_en' },
        { title: 'עִברִית',   key: 'keyboard_hide_he' }
    ];
 
    function log(msg) {
        console.log('[keyboard_settings_select]', msg);
    }
 
    function getHide(key) {
        return localStorage.getItem(key) === 'true';
    }
 
    function setHide(key, value) {
        localStorage.setItem(key, value ? 'true' : 'false');
        log('localStorage SET ' + key + ' = ' + (value ? 'true' : 'false'));
    }
 
    function applyHiding() {
        log('applyHiding: start');
        LANGUAGES.forEach(lang => {
            const hide = getHide(lang.key);
            const element = $('.selectbox-item.selector > div.selectbox-item__title:contains("' + lang.title + '")').closest('.selectbox-item.selector');
            if (element.length) {
                element.toggle(!hide);
                log('applyHiding: ' + lang.title + ' → ' + (!hide ? 'shown' : 'hidden'));
            } else {
                log('applyHiding: element not found for ' + lang.title);
            }
        });
    }
 
    function updateDisplays() {
        log('updateDisplays: start');
        setTimeout(() => {
            // Розкладка за замовчуванням
            const defaultCode = Lampa.Storage.get('keyboard_default_lang', 'uk');
            const defaultLang = LANGUAGES.find(l => l.key === 'keyboard_hide_' + (defaultCode === 'default' ? 'ru' : defaultCode)) || LANGUAGES[0];
            $('.settings-param[data-name="keyboard_default_trigger"] .settings-param__value').text(defaultLang.title);
 
            // Приховати розкладки
            const hidden = LANGUAGES.filter(lang => getHide(lang.key)).map(lang => lang.title);
            const hideText = hidden.length ? hidden.join(', ') : 'жодна';
            $('.settings-param[data-name="keyboard_hide_trigger"] .settings-param__value').text(hideText);
            log('FINAL DISPLAY hide: "' + hideText + '"');
        }, 400);
    }
 
    function openDefaultMenu() {
        log('openDefaultMenu: opened');
        const current = Lampa.Storage.get('keyboard_default_lang', 'uk');
        const items = LANGUAGES.map(lang => ({
            title: lang.title,
            value: lang.key === 'keyboard_hide_ru' ? 'default' : lang.key.replace('keyboard_hide_', ''),
            selected: (lang.key === 'keyboard_hide_ru' ? 'default' : lang.key.replace('keyboard_hide_', '')) === current
        }));
 
        Lampa.Select.show({
            title: 'Розкладка за замовчуванням',
            items: items,
            onSelect(item) {
                Lampa.Storage.set('keyboard_default_lang', item.value);
                log('Default saved: ' + item.value);
                updateDisplays();
            },
            onBack() {
                Lampa.Controller.toggle('settings_component');
                setTimeout(updateDisplays, 300);
            }
        });
    }
 
    function openHideMenu() {
        log('openHideMenu: opened');
        const items = LANGUAGES.map(lang => ({
            title: lang.title,
            checkbox: true,
            selected: getHide(lang.key),
            key: lang.key
        }));
 
        Lampa.Select.show({
            title: 'Приховати розкладки',
            items: items,
            onSelect(item) {
                if (!item || !item.key) return;
                const current = getHide(item.key);
                setHide(item.key, !current);
                applyHiding();
                updateDisplays();
            },
            onBack() {
                log('openHideMenu onBack');
                Lampa.Controller.toggle('settings_component');
                setTimeout(updateDisplays, 800);
                setTimeout(updateDisplays, 1600);
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
                const defaultCode = Lampa.Storage.get('keyboard_default_lang', 'uk');
                const title = LANGUAGES.find(l => l.key === 'keyboard_hide_' + (defaultCode === 'default' ? 'ru' : defaultCode))?.title || 'Українська';
                el.find('.settings-param__value').text(title);
            }, 100);
            el.on('hover:enter', openDefaultMenu);
        }
    });
 
    Lampa.SettingsApi.addParam({
        component: 'keyboard_settings_select',
        param: { name: 'keyboard_hide_trigger', type: 'trigger', default: false },
        field: { name: 'Приховати розкладки', description: 'Вибір розкладок для приховування' },
        onRender(el) {
            setTimeout(() => {
                const hidden = LANGUAGES.filter(lang => getHide(lang.key)).map(lang => lang.title);
                el.find('.settings-param__value').text(hidden.length ? hidden.join(', ') : 'жодна');
            }, 100);
            el.on('hover:enter', openHideMenu);
        }
    });
 
    // Твій робочий інтервал
    setInterval(function() {
        if ($('div.hg-button.hg-functionBtn.hg-button-LANG.selector.binded').length > 0) {
            applyHiding();
        }
    }, 0);
 
    setTimeout(updateDisplays, 1000);
 
    Lampa.Listener.follow('select', e => {
        if (e.type === 'open') setTimeout(applyHiding, 150);
    });
 
})();
