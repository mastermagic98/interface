(function(){
    'use strict';

    // --- Переклади ---
    Lampa.Lang.add({
        incard_buttons_mode: {
            uk: 'Кнопки в картці',
            ru: 'Кнопки в карточке',
            en: 'Card buttons'
        },
        incard_mode_all: {
            uk: 'Показувати всі кнопки',
            ru: 'Показывать все кнопки',
            en: 'Show all buttons'
        },
        incard_mode_icons: {
            uk: 'Показувати тільки іконки',
            ru: 'Показывать только иконки',
            en: 'Show icons only'
        }
    });

    var STORAGE_KEY = 'incard_buttons_mode';
    var STYLE_ID = 'incard-buttons-mode-style';

    function getMode(){
        var val = 'all';
        try { val = Lampa.Storage.get(STORAGE_KEY, 'all'); } catch(e){}
        return val;
    }

    function setMode(v){
        try { Lampa.Storage.set(STORAGE_KEY, v); } catch(e){}
    }

    function updateStyleForMode(mode){
        var style = document.getElementById(STYLE_ID);
        if(!style){
            style = document.createElement('style');
            style.id = STYLE_ID;
            document.head.appendChild(style);
        }

        var selectors = [
            '.full-start__button span',
            '.full-start-new__button span',
            '.full-start-new__buttons .full-start__button span',
            '.full-start-new__buttons .full-start-new__button span'
        ].join(', ');

        if(mode === 'icons'){
            style.innerHTML = selectors + ' { display: none !important; }';
        } else {
            style.innerHTML = selectors + ' { display: inline-block !important; }';
        }
    }

    function restoreButtons(){
        var btns = document.querySelectorAll('.full-start__button, .full-start-new__button');
        for(var i=0;i<btns.length;i++){
            var b = btns[i];
            if(!b) continue;
            b.classList.remove('hide', 'hidden');
            b.style.display = '';
            b.style.visibility = '';
            var spans = b.querySelectorAll('span');
            for(var j=0;j<spans.length;j++){
                spans[j].style.display = '';
            }
        }
    }

    function applyToOpenCard(){
        restoreButtons();
        updateStyleForMode(getMode());
    }

    function addSetting(){
        // Якщо accent_color_plugin ще не створений — повторюємо спробу
        if(!Lampa.SettingsApi.components || !Lampa.SettingsApi.components.accent_color_plugin){
            setTimeout(addSetting, 500);
            return;
        }

        Lampa.SettingsApi.addParam({
            component: 'accent_color_plugin',
            param: { name: STORAGE_KEY, type: 'list', default: 'all' },
            field: {
                name: Lampa.Lang.translate('incard_buttons_mode'),
                description: Lampa.Lang.translate('incard_mode_all') + ' / ' + Lampa.Lang.translate('incard_mode_icons'),
                values: [
                    { id: 'all', name: Lampa.Lang.translate('incard_mode_all') },
                    { id: 'icons', name: Lampa.Lang.translate('incard_mode_icons') }
                ]
            },
            onChange: function(v){
                setMode(v);
                applyToOpenCard();
            }
        });
    }

    function hookFullRender(){
        Lampa.Listener.follow('full', function(e){
            if(e.type === 'render'){
                setTimeout(applyToOpenCard, 100);
                setTimeout(applyToOpenCard, 500);
                setTimeout(applyToOpenCard, 1000);
            }
        });
    }

    function init(){
        addSetting();
        applyToOpenCard();
        hookFullRender();
    }

    if(window.appready) init();
    else Lampa.Listener.follow('app', function(e){ if(e.type === 'ready') init(); });

})();
