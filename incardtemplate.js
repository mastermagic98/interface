(function(){
    'use strict';

    // === Переклади ===
    Lampa.Lang.add({
        incard_show_all: {
            uk: 'Показувати всі кнопки',
            ru: 'Показывать все кнопки',
            en: 'Show all buttons'
        },
        incard_icons_only: {
            uk: 'Показувати тільки іконки',
            ru: 'Показывать только иконки',
            en: 'Show icons only'
        }
    });

    var styleId = 'incard-style-control';

    function applyButtonStyles(){
        var iconsOnly = Lampa.Storage.get('incard_icons_only', false);
        var showAll = Lampa.Storage.get('incard_show_all', true);

        var style = document.getElementById(styleId);
        if(!style){
            style = document.createElement('style');
            style.id = styleId;
            document.head.appendChild(style);
        }

        // логіка: якщо тільки іконки — ховаємо span
        // якщо show_all — все видимо
        if(iconsOnly){
            style.innerHTML = '.full-start__button span { display: none !important; }';
        } else if(showAll){
            style.innerHTML = '.full-start__button span { display: inline-block !important; }';
        } else {
            style.innerHTML = '';
        }
    }

    function addSettings(){
        try {
            // Показувати всі кнопки
            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
                param: { name: 'incard_show_all', type: 'trigger', default: true },
                field: {
                    name: Lampa.Lang.translate('incard_show_all'),
                    description: 'Всі кнопки відображаються без приховування'
                },
                onChange: function(v){
                    Lampa.Storage.set('incard_show_all', !!v);
                    if(v) Lampa.Storage.set('incard_icons_only', false); // скидаємо другий параметр
                    applyButtonStyles();
                }
            });

            // Показувати тільки іконки
            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
                param: { name: 'incard_icons_only', type: 'trigger', default: false },
                field: {
                    name: Lampa.Lang.translate('incard_icons_only'),
                    description: 'Приховати підписи, залишити лише іконки'
                },
                onChange: function(v){
                    Lampa.Storage.set('incard_icons_only', !!v);
                    if(v) Lampa.Storage.set('incard_show_all', false); // вимикаємо show_all
                    applyButtonStyles();
                }
            });
        } catch(e) {}
    }

    function init(){
        addSettings();
        applyButtonStyles();
    }

    if(window.appready){
        init();
    } else {
        Lampa.Listener.follow('app', function(e){
            if(e.type === 'ready') init();
        });
    }
})();
