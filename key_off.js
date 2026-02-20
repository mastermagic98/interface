(function(){
    'use strict';

    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;
    if (window.keyboard_settings_v12) return;
    window.keyboard_settings_v12 = true;

    const LANGUAGES = [
        { title: 'Українська', code: 'uk', key: 'keyboard_hide_uk' },
        { title: 'Русский',    code: 'ru', key: 'keyboard_hide_ru' },
        { title: 'English',    code: 'en', key: 'keyboard_hide_en' },
        { title: 'עִברִית',   code: 'he', key: 'keyboard_hide_he' }
    ];

    function getDefaultCode() {
        return Lampa.Storage.get('keyboard_default_lang', 'uk');
    }

    function getDefaultTitle() {
        const code = getDefaultCode();
        const lang = LANGUAGES.find(l => l.code === code);
        return lang ? lang.title : 'Українська';
    }

    function filterLayouts(layouts) {
        const defaultCode = getDefaultCode();
        return layouts.filter(l=>{
            const langObj = LANGUAGES.find(lang=>lang.code===l.code);
            if (!langObj) return true;
            const hide = Lampa.Storage.get(langObj.key,'false')==='true';
            return !hide || l.code===defaultCode;
        });
    }

    function hookKeyboard(){
        if (window.Keyboard && window.Keyboard.prototype){
            const origInit = window.Keyboard.prototype.init;
            window.Keyboard.prototype.init = function(){
                if (this.layouts) this.layouts = filterLayouts(this.layouts);
                return origInit.apply(this, arguments);
            };
        }
    }

    // ----------------------
    // Меню вибору default
    // ----------------------
    function openDefaultMenu(){
        const current = getDefaultCode();
        const items = LANGUAGES.map(lang=>({
            title: lang.title,
            value: lang.code,
            selected: lang.code===current
        }));

        Lampa.Select.show({
            title:'Розкладка за замовчуванням',
            items:items,
            onSelect:function(item){
                if(!item.value) return;
                Lampa.Storage.set('keyboard_default_lang', item.value);
                if(window.keyboard) window.keyboard.init();
            },
            onBack:function(){
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    // ----------------------
    // Меню мультивибору прихованих розкладок
    // ----------------------
    function openHideMenu(){
        const defaultCode = getDefaultCode();

        const items = LANGUAGES.map(lang=>({
            title: lang.title,
            checkbox: true,
            selected: Lampa.Storage.get(lang.key,'false')==='true',
            disabled: lang.code===defaultCode,
            key: lang.key
        }));

        Lampa.Select.show({
            title:'Приховати розкладки (можна декілька)',
            items:items,
            onSelect:function(item){
                if(item.disabled) return;

                // змінюємо стан вибраного
                const current = Lampa.Storage.get(item.key,'false')==='true';
                Lampa.Storage.set(item.key, current ? 'false' : 'true');

                // не закриваємо меню, даємо вибрати ще
                setTimeout(openHideMenu, 50);

                // оновлюємо клавіатуру
                if(window.keyboard) window.keyboard.init();
            },
            onBack:function(){
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    // ----------------------
    // Налаштування Lampa
    // ----------------------
    Lampa.SettingsApi.addComponent({
        component:'keyboard_settings_v12',
        name:'Налаштування клавіатури',
        icon:'<svg fill="#fff" width="38" height="38" viewBox="0 0 24 24"><path d="M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Z"/></svg>'
    });

    Lampa.SettingsApi.addParam({
        component:'keyboard_settings_v12',
        param:{name:'keyboard_default_trigger', type:'trigger', default:false},
        field:{
            name:'Розкладка за замовчуванням',
            description:'Вибір розкладки за замовчуванням'
        },
        onRender:function(el){
            el.find('.settings-param__value').text(getDefaultTitle());
            el.off('hover:enter').on('hover:enter', openDefaultMenu);
        }
    });

    Lampa.SettingsApi.addParam({
        component:'keyboard_settings_v12',
        param:{name:'keyboard_hide_trigger', type:'trigger', default:false},
        field:{
            name:'Приховати розкладки',
            description:'Вибір розкладок для приховування'
        },
        onRender:function(el){
            el.off('hover:enter').on('hover:enter', openHideMenu);
        }
    });

    // ----------------------
    // Старт
    // ----------------------
    function start(){ hookKeyboard(); }

    if(window.appready) start();
    else Lampa.Listener.follow('app', function(e){
        if(e.type==='ready') start();
    });

})();
