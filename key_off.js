(function () {
    'use strict';

    if (!window.Lampa) return;
    if (window.keyboard_settings_safe_v1) return;
    window.keyboard_settings_safe_v1 = true;

    var LANGUAGES = {
        uk: 'Українська',
        ru: 'Русский',
        en: 'English',
        he: 'עִברִית'
    };

    function getDefaultLang(){
        return Lampa.Storage.get('keyboard_default_lang', 'uk');
    }

    function setDefaultLang(code){
        Lampa.Storage.set('keyboard_default_lang', code);
    }

    function getHidden(){
        var val = Lampa.Storage.get('keyboard_hidden_layouts', '');
        if (!val) return [];
        return val.split(',');
    }

    function setHidden(arr){
        Lampa.Storage.set('keyboard_hidden_layouts', arr.join(','));
    }

    function getHiddenText(){
        var hidden = getHidden();
        if (!hidden.length) return 'жодна';

        var list = [];
        for (var i = 0; i < hidden.length; i++){
            if (LANGUAGES[hidden[i]]) {
                list.push(LANGUAGES[hidden[i]]);
            }
        }

        return list.length ? list.join(', ') : 'жодна';
    }

    function openHideDialog(){

        var hidden = getHidden();
        var def = getDefaultLang();
        var items = [];

        for (var code in LANGUAGES){

            if (code === def) continue;

            var isHidden = hidden.indexOf(code) !== -1;

            items.push({
                title: LANGUAGES[code] + (isHidden ? ' (приховано)' : ''),
                code: code
            });
        }

        Lampa.Select.show({
            title: 'Приховати розкладки',
            items: items,
            onSelect: function(item){

                var index = hidden.indexOf(item.code);

                if (index === -1){
                    hidden.push(item.code);
                } else {
                    hidden.splice(index, 1);
                }

                setHidden(hidden);
                Lampa.Select.hide();
                setTimeout(openHideDialog, 200);
            }
        });
    }

    function applyHide(selectbox){

        var buttons = selectbox.querySelectorAll('.selectbox-item.selector');
        if (!buttons) return;

        var hidden = getHidden();
        var def = getDefaultLang();

        for (var i = 0; i < buttons.length; i++){

            var btn = buttons[i];
            var text = btn.textContent.trim();

            var code = null;

            for (var key in LANGUAGES){
                if (LANGUAGES[key] === text){
                    code = key;
                    break;
                }
            }

            if (!code) continue;

            if (code !== def && hidden.indexOf(code) !== -1){
                btn.style.display = 'none';
            } else {
                btn.style.display = '';
            }
        }
    }

    function observeKeyboard(){

        var observer = new MutationObserver(function(mutations){

            for (var i = 0; i < mutations.length; i++){

                var nodes = mutations[i].addedNodes;

                for (var j = 0; j < nodes.length; j++){

                    var node = nodes[j];

                    if (node.nodeType === 1 &&
                        node.classList &&
                        node.classList.contains('selectbox')){

                        setTimeout(function(){
                            applyHide(node);
                        }, 100);
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function init(){

        // Додаємо параметри у стандартний розділ
        Lampa.SettingsApi.addParam({
            component: 'interface',
            param: {
                name: 'keyboard_default_lang',
                type: 'select',
                values: LANGUAGES,
                default: 'uk'
            },
            field: {
                name: 'Розкладка клавіатури'
            },
            onChange: function(value){
                setDefaultLang(value);
            }
        });

        Lampa.SettingsApi.addParam({
            component: 'interface',
            param: {
                name: 'keyboard_hide_layouts',
                type: 'trigger'
            },
            field: {
                name: 'Приховати розкладки',
                description: getHiddenText()
            },
            onChange: function(){
                openHideDialog();
            }
        });

        observeKeyboard();
    }

    if (window.appready){
        init();
    } else {
        Lampa.Listener.follow('app', function(e){
            if (e.type === 'ready') init();
        });
    }

})();
