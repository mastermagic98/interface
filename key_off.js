(function () {
    'use strict';

    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;
    if (window.keyboard_settings_v7) return;
    window.keyboard_settings_v7 = true;

    const LANGUAGES = [
        { title: 'Українська', code: 'uk', hideKey: 'keyboard_hide_uk' },
        { title: 'Русский',    code: 'ru', hideKey: 'keyboard_hide_ru' },
        { title: 'English',    code: 'en', hideKey: 'keyboard_hide_en' },
        { title: 'עִברִית',   code: 'he', hideKey: 'keyboard_hide_he' }
    ];

    /* ============================= */
    /*        ДОПОМІЖНІ              */
    /* ============================= */

    function getDefaultCode() {
        let code = Lampa.Storage.get('keyboard_default_lang', 'uk');

        if (code === 'Українська') code = 'uk';
        if (code === 'Русский') code = 'ru';
        if (code === 'English') code = 'en';
        if (code === 'עִברִית') code = 'he';

        return code;
    }

    function getDefaultTitle() {
        const code = getDefaultCode();
        const lang = LANGUAGES.find(l => l.code === code);
        return lang ? lang.title : 'Українська';
    }

    /* ============================= */
    /*      ПРИХОВУВАННЯ             */
    /* ============================= */

    function applySettings() {

        const defaultCode = getDefaultCode();

        LANGUAGES.forEach(function(lang){

            const hide = Lampa.Storage.get(lang.hideKey, 'false') === 'true';
            const shouldHide = hide && lang.code !== defaultCode;

            const element = $('.selectbox-item.selector > div:contains("' + lang.title + '")');

            if(!element.length) return;

            const parent = element.parent('div');

            if(shouldHide){
                parent.hide();
            } else {
                parent.show();
            }

        });
    }

    /* ============================= */
    /*        WATCHER SELECT         */
    /* ============================= */

    function watchSelect(){

        let timer = null;

        Lampa.Listener.follow('select', function(e){

            if(e.type === 'open'){

                let attempts = 0;

                timer = setInterval(function(){

                    applySettings();
                    attempts++;

                    if(attempts > 25){
                        clearInterval(timer);
                    }

                }, 40);
            }

            if(e.type === 'close'){
                if(timer) clearInterval(timer);
            }

        });
    }

    /* ============================= */
    /*        МЕНЮ DEFAULT           */
    /* ============================= */

    function openDefaultMenu(){

        const currentCode = getDefaultCode();

        const items = LANGUAGES.map(function(lang){
            return {
                title: lang.title,
                value: lang.code,
                selected: lang.code === currentCode
            };
        });

        Lampa.Select.show({
            title: 'Розкладка за замовчуванням',
            items: items,
            onSelect: function(item){

                if(!item.value) return;

                Lampa.Storage.set('keyboard_default_lang', item.value);

                const langObj = LANGUAGES.find(l => l.code === item.value);
                if(langObj){
                    Lampa.Storage.set(langObj.hideKey, 'false');
                }

                setTimeout(applySettings, 200);
            },
            onBack: function(){
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    /* ============================= */
    /*        МЕНЮ ПРИХОВАННЯ        */
    /* ============================= */

    function openHideMenu(){

        const defaultCode = getDefaultCode();

        const items = LANGUAGES.map(function(lang){

            const isHidden = Lampa.Storage.get(lang.hideKey, 'false') === 'true';

            return {
                title: lang.title,
                checkbox: true,
                selected: isHidden,
                disabled: lang.code === defaultCode,
                key: lang.hideKey
            };
        });

        Lampa.Select.show({
            title: 'Вимкнути розкладки',
            items: items,
            onSelect: function(item){

                if(item.disabled) return;

                const current = Lampa.Storage.get(item.key, 'false') === 'true';
                Lampa.Storage.set(item.key, current ? 'false' : 'true');

                setTimeout(function(){
                    applySettings();
                    openHideMenu();
                }, 150);
            },
            onBack: function(){
                Lampa.Controller.toggle('settings_component');
            }
        });
    }

    /* ============================= */
    /*      ДОДАЄМО КОМПОНЕНТ        */
    /* ============================= */

    Lampa.SettingsApi.addComponent({
        component: 'keyboard_settings_v7',
        name: 'Налаштування клавіатури',
        icon: '<svg fill="#fff" width="38" height="38" viewBox="0 0 24 24"><path d="M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Z"/></svg>'
    });

    /* ============================= */
    /*       PARAM DEFAULT           */
    /* ============================= */

    Lampa.SettingsApi.addParam({
        component: 'keyboard_settings_v7',
        param: {
            name: 'keyboard_default_trigger',
            type: 'trigger',
            default: false
        },
        field: {
            name: 'Розкладка за замовчуванням',
            description: 'Вибір мови за замовчуванням'
        },
        onRender: function(el){
            el.find('.settings-param__value').text(getDefaultTitle());
            el.off('hover:enter').on('hover:enter', openDefaultMenu);
        }
    });

    /* ============================= */
    /*       PARAM HIDE              */
    /* ============================= */

    Lampa.SettingsApi.addParam({
        component: 'keyboard_settings_v7',
        param: {
            name: 'keyboard_hide_trigger',
            type: 'trigger',
            default: false
        },
        field: {
            name: 'Вимкнути розкладки',
            description: 'Вибір розкладок для вимкнення'
        },
        onRender: function(el){
            el.off('hover:enter').on('hover:enter', openHideMenu);
        }
    });

    /* ============================= */
    /*           START               */
    /* ============================= */

    function start(){

        watchSelect();

        $('body').on('click',
            '.hg-button.hg-functionBtn.hg-button-LANG.selector.binded',
            function(){
                setTimeout(applySettings, 120);
                setTimeout(applySettings, 300);
            }
        );
    }

    if(window.appready) start();
    else Lampa.Listener.follow('app', function(e){
        if(e.type === 'ready') start();
    });

})();
