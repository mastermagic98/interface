(function(){
    'use strict';

    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;
    if (window.keyboard_settings_fixed) return;
    window.keyboard_settings_fixed = true;

    const LANGUAGES = [
        { title: 'Українська', code: 'uk' },
        { title: 'Русский',    code: 'ru' },
        { title: 'English',    code: 'en' },
        { title: 'עִברִית',   code: 'he' }
    ];

    /* ------------------- STORAGE ------------------- */

    function getDefault(){
        return Lampa.Storage.get('keyboard_default_lang','uk');
    }

    function setDefault(code){
        Lampa.Storage.set('keyboard_default_lang',code);
    }

    function getHidden(){
        return Lampa.Storage.get('keyboard_hidden_layouts',[]);
    }

    function setHidden(arr){
        Lampa.Storage.set('keyboard_hidden_layouts',arr);
    }

    /* ------------------- UI DISPLAY ------------------- */

    function updateDisplay(){
        const def = getDefault();
        const hidden = getHidden();

        const defTitle = LANGUAGES.find(l=>l.code===def)?.title || 'Українська';
        const hiddenTitles = LANGUAGES
            .filter(l=>hidden.includes(l.code))
            .map(l=>l.title);

        $('.settings-param[data-name="keyboard_default_trigger"] .settings-param__value')
            .text(defTitle);

        $('.settings-param[data-name="keyboard_hide_trigger"] .settings-param__value')
            .text(hiddenTitles.length ? hiddenTitles.join(', ') : 'жодна');
    }

    /* ------------------- DEFAULT SELECT ------------------- */

    function openDefaultMenu(){

        const current = getDefault();

        Lampa.Select.show({
            title:'Розкладка за замовчуванням',
            items: LANGUAGES.map(l=>({
                title:l.title,
                value:l.code,
                selected:l.code===current
            })),
            onSelect(item){
                setDefault(item.value);
                updateDisplay();
            },
            onBack(){
                Lampa.Controller.toggle('settings_component');
                setTimeout(updateDisplay,200);
            }
        });
    }

    /* ------------------- HIDE SELECT (checkbox style) ------------------- */

    function openHideMenu(){

        const defaultLang = getDefault();
        const hidden = getHidden();

        Lampa.Select.show({
            title:'Приховати розкладки',
            items: LANGUAGES
                .filter(l=>l.code!==defaultLang)
                .map(l=>({
                    title:l.title,
                    checkbox:true,
                    selected:hidden.includes(l.code),
                    value:l.code
                })),
            onSelect(item){

                let list = getHidden();

                if(list.includes(item.value)){
                    list = list.filter(i=>i!==item.value);
                } else {
                    list.push(item.value);
                }

                setHidden(list);
                updateDisplay();
            },
            onBack(){
                Lampa.Controller.toggle('settings_component');
                setTimeout(updateDisplay,200);
            }
        });
    }

    /* ------------------- SETTINGS COMPONENT ------------------- */

    Lampa.SettingsApi.addComponent({
        component:'keyboard_settings_fixed',
        name:'Налаштування клавіатури',
        icon:'<svg fill="#fff" width="38" height="38" viewBox="0 0 24 24"><path d="M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Z"/></svg>'
    });

    Lampa.SettingsApi.addParam({
        component:'keyboard_settings_fixed',
        param:{ name:'keyboard_default_trigger', type:'trigger' },
        field:{ name:'Розкладка за замовчуванням' },
        onRender(el){
            updateDisplay();
            el.on('hover:enter',openDefaultMenu);
        }
    });

    Lampa.SettingsApi.addParam({
        component:'keyboard_settings_fixed',
        param:{ name:'keyboard_hide_trigger', type:'trigger' },
        field:{ name:'Приховати розкладки' },
        onRender(el){
            updateDisplay();
            el.on('hover:enter',openHideMenu);
        }
    });

})();
