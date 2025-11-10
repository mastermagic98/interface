(function(){
    'use strict';

    // --- Локалізація ---
    function Lang(){
        try{
            Lampa.Lang.add({
                showbutton_name: {
                    ru: "Все кнопки в карточке",
                    en: "All buttons in card",
                    uk: "Усі кнопки в картці"
                },
                showbutton_desc: {
                    ru: "Показывает все кнопки действий на картке",
                    en: "Show all action buttons in card",
                    uk: "Показує усі кнопки дій на картці"
                },
                text_mode: {
                    ru: "Режим отображения текста",
                    en: "Text display mode",
                    uk: "Режим відображення тексту"
                },
                text_mode_default: {
                    ru: "По умолчанию",
                    en: "Default",
                    uk: "За замовчуванням"
                },
                text_mode_show: {
                    ru: "Показывать текст",
                    en: "Show text",
                    uk: "Показувати текст"
                },
                text_mode_hide: {
                    ru: "Скрывать текст",
                    en: "Hide text",
                    uk: "Приховати текст"
                },
                reloading: {
                    ru: "Перезагрузка...",
                    en: "Reloading...",
                    uk: "Перезавантаження..."
                }
            });
        }catch(e){console.error('[Lang]', e);}
    }

    // --- Застосування режиму тексту ---
    function applyTextMode(){
        try{
            var mode = Lampa.Storage.get('text_mode','default');
            $('#plugin_text_mode_style').remove();
            if(mode === 'show'){
                // Текст на всіх кнопках, ширина динамічна
                var style = '<style id="plugin_text_mode_style">' +
                            '.full-start-new__buttons .full-start__button span{display:inline !important;}' +
                            '</style>';
                $('body').append(style);
            }else if(mode === 'hide'){
                // Тільки іконки, кнопки не збільшуються
                var style = '<style id="plugin_text_mode_style">' +
                            '.full-start-new__buttons .full-start__button span{display:none !important;}' +
                            '.full-start-new__buttons .full-start__button{min-width:40px !important; width:auto !important;}' +
                            '</style>';
                $('body').append(style);
            }
            // default — нічого не підключаємо, стандартна поведінка Lampa
        }catch(e){console.error('[TextMode]', e);}
    }

    // --- Показ всіх кнопок ---
    function showAllButtons(){
        try{
            if(Lampa.Storage.get('showbutton', false) !== true) return;
            Lampa.Listener.follow('full', function(e){
                if(e.type!=='complite') return;
                setTimeout(function(){
                    try{
                        var fullContainer = e.object.activity.render();
                        if(!fullContainer) return;
                        var target = fullContainer.find('.full-start-new__buttons');
                        if(!target.length) return;
                        fullContainer.find('.button--play').remove();
                        var allButtons = fullContainer.find('.buttons--container .full-start__button').add(target.find('.full-start__button'));
                        var cats = { online: [], torrent: [], trailer: [], other: [] };
                        allButtons.each(function(){
                            var $b = $(this);
                            var cls = $b.attr('class')||'';
                            if(cls.indexOf('online')!==-1) cats.online.push($b);
                            else if(cls.indexOf('torrent')!==-1) cats.torrent.push($b);
                            else if(cls.indexOf('trailer')!==-1) cats.trailer.push($b);
                            else cats.other.push($b.clone(true));
                        });
                        var order = ['torrent','online','trailer','other'];
                        target.empty();
                        order.forEach(function(c){ cats[c].forEach(function($b){ target.append($b); }); });
                        target.css({ display:'flex', flexWrap:'wrap', gap:'10px', justifyContent:'flex-start' });
                        applyTextMode();
                    }catch(err){console.error('[ShowAllButtons]', err);}
                },150);
            });
        }catch(e){console.error('[ShowAllButtons]', e);}
    }

    // --- Налаштування плагіну ---
    function Settings(){
        try{
            // Показати всі кнопки
            Lampa.SettingsApi.addParam({
                component: 'accent_color_plugin',
                param:{ name:'showbutton', type:'trigger', default:false },
                field:{ name: Lampa.Lang.translate('showbutton_name'), description: Lampa.Lang.translate('showbutton_desc') },
                onChange: function(value){
                    Lampa.Storage.set('showbutton', value);
                    setTimeout(function(){
                        Lampa.Noty.show(Lampa.Lang.translate('reloading'));
                        location.reload();
                    },300);
                }
            });

            // Режим тексту
            Lampa.SettingsApi.addParam({
                component:'accent_color_plugin',
                param:{ 
                    name:'text_mode',
                    type:'select',
                    default:'default',
                    values:[
                        { title:Lampa.Lang.translate('text_mode_default'), value:'default'},
                        { title:Lampa.Lang.translate('text_mode_show'), value:'show'},
                        { title:Lampa.Lang.translate('text_mode_hide'), value:'hide'}
                    ]
                },
                field:{ name:Lampa.Lang.translate('text_mode'), description:'' },
                onChange:function(value){
                    Lampa.Storage.set('text_mode', value);
                    applyTextMode();
                }
            });

        }catch(e){console.error('[Settings]', e);}
    }

    // --- Ініціалізація ---
    function init(){
        try{
            Lang();
            // Значення за замовчуванням
            if(Lampa.Storage.get('showbutton')===undefined) Lampa.Storage.set('showbutton',false);
            if(Lampa.Storage.get('text_mode')===undefined) Lampa.Storage.set('text_mode','default');

            Settings();
            applyTextMode();
            showAllButtons();

        }catch(e){console.error('[PluginInit]', e);}
    }

    // --- Старт плагіну ---
    if(!window.plugin_showbutton_ready){
        window.plugin_showbutton_ready = true;
        if(window.appready) init();
        else Lampa.Listener.follow('app', function(e){ if(e.type==='ready') init(); });
    }

})();
