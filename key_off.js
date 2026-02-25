(function () {
    'use strict';

    if (!window.Lampa) return;
    if (!Lampa.Manifest || Lampa.Manifest.app_digital < 300) return;
    if (window.keyboard_settings_select_v4) return;
    window.keyboard_settings_select_v4 = true;

    var LANGUAGES = [
        { title: 'Українська', code: 'uk' },
        { title: 'Русский',    code: 'ru' },
        { title: 'English',    code: 'en' },
        { title: 'עִברִית',   code: 'he' }
    ];

    function log(msg){
        console.log('[keyboard_settings_select_v4] ' + msg);
    }

    function isLampaKeyboard(){
        return Lampa.Storage.get('keyboard_type', 'lampa') === 'lampa';
    }

    function getDefaultLang(){
        return Lampa.Storage.get('keyboard_default_lang', 'uk');
    }

    function setDefaultLang(code){
        Lampa.Storage.set('keyboard_default_lang', code);
    }

    function getHiddenLangs(){
        var stored = Lampa.Storage.get('keyboard_hidden_layouts', '');
        if (!stored || stored === 'undefined' || stored === 'null') return [];
        return stored.split(',');
    }

    function setHiddenLangs(list){
        var defaultLang = getDefaultLang();
        var clean = [];
        for (var i = 0; i < list.length; i++){
            if (list[i] && list[i] !== defaultLang){
                clean.push(list[i]);
            }
        }
        if (clean.length){
            Lampa.Storage.set('keyboard_hidden_layouts', clean.join(','));
        } else {
            Lampa.Storage.set('keyboard_hidden_layouts', '');
        }
    }

    function getLangTitle(code){
        for (var i = 0; i < LANGUAGES.length; i++){
            if (LANGUAGES[i].code === code){
                return LANGUAGES[i].title;
            }
        }
        return '';
    }

    function getLangByTitle(title){
        for (var i = 0; i < LANGUAGES.length; i++){
            if (LANGUAGES[i].title === title){
                return LANGUAGES[i];
            }
        }
        return null;
    }

    function getHiddenText(){
        var hidden = getHiddenLangs();
        if (!hidden.length) return 'жодна';

        var result = [];
        for (var i = 0; i < hidden.length; i++){
            var t = getLangTitle(hidden[i]);
            if (t) result.push(t);
        }

        return result.length ? result.join(', ') : 'жодна';
    }

    function updateHiddenLabel(){
        setTimeout(function(){
            var el = document.querySelector('[data-name="keyboard_hide_layouts"] .settings-param__value');
            if (el) el.textContent = getHiddenText();
        }, 100);
    }

    function openHiddenDialog(){

        var defaultLang = getDefaultLang();
        var hidden = getHiddenLangs();

        var items = [];

        for (var i = 0; i < LANGUAGES.length; i++){
            var lang = LANGUAGES[i];
            if (lang.code === defaultLang) continue;

            var isHidden = false;
            for (var j = 0; j < hidden.length; j++){
                if (hidden[j] === lang.code){
                    isHidden = true;
                    break;
                }
            }

            items.push({
                title: lang.title + (isHidden ? ' (приховано)' : ''),
                subtitle: isHidden ? 'Показати' : 'Приховати',
                code: lang.code
            });
        }

        Lampa.Select.show({
            title: 'Приховати розкладки',
            items: items,
            onSelect: function(item){

                if (!item || !item.code) return;

                var index = -1;
                for (var i = 0; i < hidden.length; i++){
                    if (hidden[i] === item.code){
                        index = i;
                        break;
                    }
                }

                if (index === -1){
                    hidden.push(item.code);
                } else {
                    hidden.splice(index, 1);
                }

                setHiddenLangs(hidden);
                updateHiddenLabel();

                Lampa.Select.hide();
                setTimeout(openHiddenDialog, 200);
            },
            onBack: function(){
                updateHiddenLabel();
            }
        });
    }

    function applyHide(selectbox){

        if (!isLampaKeyboard()) return;
        if (!selectbox) return;

        var buttons = selectbox.querySelectorAll('.selectbox-item.selector');
        if (!buttons || buttons.length !== LANGUAGES.length) return;

        var defaultLang = getDefaultLang();
        var hidden = getHiddenLangs();

        for (var i = 0; i < buttons.length; i++){

            var btn = buttons[i];
            var text = btn.textContent.replace(/^\s+|\s+$/g, '');
            var lang = getLangByTitle(text);

            if (!lang) continue;

            var shouldHide = false;

            if (lang.code !== defaultLang){
                for (var j = 0; j < hidden.length; j++){
                    if (hidden[j] === lang.code){
                        shouldHide = true;
                        break;
                    }
                }
            }

            btn.style.display = shouldHide ? 'none' : '';
        }
    }

    Lampa.SettingsApi.addComponent({
        component: 'keyboard_settings_select',
        name: 'Налаштування клавіатури',
        icon: '<svg fill="#fff" width="38" height="38" viewBox="0 0 24 24"><path d="M20 5H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h16a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3Z"/></svg>'
    });

    Lampa.SettingsApi.addParam({
        component: 'keyboard_settings_select',
        param: {
            name: 'keyboard_default_lang',
            type: 'select',
            values: {
                uk: 'Українська',
                ru: 'Русский',
                en: 'English',
                he: 'עִברִית'
            },
            default: 'uk'
        },
        field: {
            name: 'Розкладка за замовчуванням'
        },
        onChange: function(value){
            setDefaultLang(value);
            setHiddenLangs(getHiddenLangs());
            updateHiddenLabel();
        }
    });

    Lampa.SettingsApi.addParam({
        component: 'keyboard_settings_select',
        param: {
            name: 'keyboard_hide_layouts',
            type: 'trigger'
        },
        field: {
            name: 'Приховати розкладки'
        },
        onRender: function(el){
            var valueEl = el.querySelector('.settings-param__value');
            if (valueEl) valueEl.textContent = getHiddenText();
            el.off('hover:enter').on('hover:enter', openHiddenDialog);
        }
    });

    function init(){

        if (!isLampaKeyboard()) return;

        var observer = new MutationObserver(function(mutations){

            for (var i = 0; i < mutations.length; i++){

                var nodes = mutations[i].addedNodes;

                for (var j = 0; j < nodes.length; j++){

                    var node = nodes[j];

                    if (node.nodeType === 1 &&
                        node.classList &&
                        node.classList.contains('selectbox')){

                        (function(n){
                            setTimeout(function(){
                                applyHide(n);
                            }, 150);
                        })(node);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (window.appready){
        init();
    } else {
        Lampa.Listener.follow('app', function(e){
            if (e.type === 'ready') init();
        });
    }

})();
