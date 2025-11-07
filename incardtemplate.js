(function(){
    'use strict';

    // Плагін: InCard Buttons Mode (ES5, single setting)
    // Режими: 'all' (за замовчуванням) або 'icons'
    // Застосування: миттєве, без перезавантаження, перекриває динамічні рендери Lampa

    // Переклади (в форматі, який ти просив)
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

    // Повертає режим (all/icons)
    function getMode(){
        try{
            var v = Lampa.Storage.get(STORAGE_KEY, 'all');
            return v || 'all';
        }catch(e){
            return 'all';
        }
    }

    function setMode(v){
        try{ Lampa.Storage.set(STORAGE_KEY, v); }catch(e){}
    }

    // Створюємо або оновлюємо стилі для режиму
    function updateStyleForMode(mode){
        var style = document.getElementById(STYLE_ID);
        if(!style){
            style = document.createElement('style');
            style.id = STYLE_ID;
            document.head.appendChild(style);
        }

        // Селектори — покривають різні варіанти шаблону
        var spanSelectors = [
            '.full-start__button span',
            '.full-start-new__buttons .full-start__button span',
            '.full-start-new__buttons .full-start-new__button span',
            '.full-start__button .incard-label',
            '.full-start-new__button span'
        ].join(', ');

        if(mode === 'icons'){
            // ховаємо підписи
            style.innerHTML = spanSelectors + ' { display: none !important; }\n' +
                              '.full-start-new__buttons, .full-start__buttons { flex-wrap: nowrap !important; overflow: visible !important; white-space: nowrap !important; }';
        } else {
            // повертаємо стандартне відображення — очищаємо стиль
            style.innerHTML = spanSelectors + ' { display: inline-block !important; }\n' +
                              '.full-start-new__buttons, .full-start__buttons { overflow: visible !important; white-space: nowrap !important; }';
        }
    }

    // Колектор кнопок: видаляємо inline-стилі, класи hide/hidden, щоб Lampa не залишила прихованими
    function restoreButtons(container){
        if(!container) return;
        var btns = container.querySelectorAll('.full-start__button, .full-start-new__button, .full-start-button');
        for(var i=0;i<btns.length;i++){
            var b = btns[i];
            if(!b) continue;
            try{
                b.classList.remove('hide');
                b.classList.remove('hidden');
            }catch(e){}
            // далі очистимо inline style display/visibility якщо встановлені
            try{ b.style.display = ''; b.style.visibility = ''; b.style.opacity = ''; }catch(e){}
            // якщо є span-підписи, гарантовано повернемо їх у потрібний стан при режимі 'all' — але стилі керують цим
            var spans = b.querySelectorAll('span');
            for(var j=0;j<spans.length;j++){
                try{ spans[j].style.display = ''; }catch(e){}
            }
        }
    }

    // Застосувати режим до поточної відкритої картки
    function applyToOpenCard(){
        var container = document.querySelector('.full-start-new') || document.querySelector('.full-start') || document.querySelector('[data-component="full_start"]');
        if(!container) return;
        // видаляємо можливі приховування
        restoreButtons(container);
        // оновлюємо CSS
        updateStyleForMode(getMode());
    }

    // Додаємо один список параметрів в розділ accent_color_plugin
    function addSetting(){
        try{
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
                    // Значення v може бути рядком або булевим в залежності від реалізації API
                    var mode = (v === 'icons' || v === "icons" ) ? 'icons' : 'all';
                    setMode(mode);
                    // Застосувати одразу
                    applyToOpenCard();
                }
            });
        }catch(e){}
    }

    // Хук на рендер картки — застосовуємо після кожного рендеру, бо Lampa може додати hide/inline styles
    function hookFullRender(){
        try{
            Lampa.Listener.follow('full', function(e){
                if(e.type === 'render'){
                    // кілька разів із таймаутами щоб перекрити динамічні зміни
                    setTimeout(applyToOpenCard, 40);
                    setTimeout(applyToOpenCard, 220);
                    setTimeout(applyToOpenCard, 600);
                }
            });
        }catch(e){}
    }

    function init(){
        addSetting();
        // застосувати одразу
        updateStyleForMode(getMode());
        applyToOpenCard();
        hookFullRender();
    }

    if(window.appready){ init(); }
    else {
        try{
            Lampa.Listener.follow('app', function(e){ if(e.type === 'ready') init(); });
        }catch(e){ init(); }
    }

})();
