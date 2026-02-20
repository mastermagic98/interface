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
 
    function applyHiding() {
        log('applyHiding: start');
        LANGUAGES.forEach(lang => {
            const hide = Lampa.Storage.get(lang.key, 'false') === 'true';
            log('applyHiding: ' + lang.title + ' hide=' + hide);
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
            log('=== STORAGE CHECK ===');
            LANGUAGES.forEach(l => {
                log('  ' + l.title + ': ' + Lampa.Storage.get(l.key, 'false'));
            });
 
            const hidden = LANGUAGES.filter(l => Lampa.Storage.get(l.key, 'false') === 'true').map(l => l.title);
            const text = hidden.length ? hidden.join(', ') : 'жодна';
            $('.settings-param[data-name="keyboard_hide_trigger"] .settings-param__value').text(text);
            log('FINAL DISPLAY: "' + text + '"');
        }, 800);
    }
 
    function openHideMenu() {
        log('openHideMenu: opened');
        const items = LANGUAGES.map(lang => ({
            title: lang.title,
            checkbox: true,
            selected: Lampa.Storage.get(lang.key, 'false') === 'true',
            key: lang.key
        }));
 
        Lampa.Select.show({
            title: 'Приховати розкладки',
            items: items,
            onSelect: function(item) {
                if (!item || !item.key) return;
                const current = Lampa.Storage.get(item.key, 'false') === 'true';
                const newVal = current ? 'false' : 'true';
                Lampa.Storage.set(item.key, newVal);
                log('SAVED: ' + item.key + ' = ' + newVal);
                applyHiding();
                setTimeout(updateDisplays, 600);
                setTimeout(updateDisplays, 1200);
            },
            onBack: function() {
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
        param: { name: 'keyboard_hide_trigger', type: 'trigger', default: false },
        field: { name: 'Приховати розкладки', description: 'Вибір розкладок для приховування' },
        onRender(el) {
            setTimeout(() => {
                const hidden = LANGUAGES.filter(l => Lampa.Storage.get(l.key, 'false') === 'true').map(l => l.title);
                el.find('.settings-param__value').text(hidden.length ? hidden.join(', ') : 'жодна');
            }, 200);
            el.on('hover:enter', openHideMenu);
        }
    });
 
    setInterval(function() {
        if ($('div.hg-button.hg-functionBtn.hg-button-LANG.selector.binded').length > 0) {
            applyHiding();
        }
    }, 0);
 
    setTimeout(updateDisplays, 1000);
 
})(); 
