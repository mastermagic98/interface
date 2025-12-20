(function () {  
    'use strict';  
  
    // Реєструємо параметри перед використанням  
    if (typeof Lampa.Params !== 'undefined') {  
        Lampa.Params.trigger('show_all_buttons', false);  
        Lampa.Params.trigger('button_text_mode', 'default');  
    }  
  
    // --- Локалізація ---  
    function Lang() {  
    Lampa.Lang.add({  
        show_all_buttons_name: {  
            ru: 'Показать все кнопки',  
            en: 'Show all buttons',  
            uk: 'Показувати всі кнопки'  
        },  
        show_all_buttons_desc: {  
            ru: 'Отображает все кнопки действий, включая скрытые под «Смотреть»',  
            en: 'Displays all action buttons, including those hidden under "Watch"',  
            uk: 'Відображає всі кнопки дій, включно з тими, що сховані під «Дивитись»'  
        },  
        button_text_mode_name: {  
            ru: 'Текст на кнопках',  
            en: 'Button text mode',  
            uk: 'Текст на кнопках'  
        },  
        button_text_mode_desc: {  
            ru: 'Изменение текста на кнопках',  
            en: 'Controls how text is shown on buttons',  
            uk: 'Змінює вигляд тексту на кнопках'  
        },  
        button_text_mode_default: {  
            ru: 'по умолчанию',  
            en: 'default',  
            uk: 'за замовчуванням'  
        },  
        button_text_mode_show: {  
            ru: 'всегда отображается',  
            en: 'show text',  
            uk: 'завжди відображається'  
        },  
        button_text_mode_hide: {  
            ru: 'всегда скрыт',  
            en: 'hide text',  
            uk: 'завжди прихований'  
        }  
    });  
}  
  
    // --- Показ усіх кнопок ---  
    function applyShowAllButtons() {  
        Lampa.Listener.follow('full', function (e) {  
            if (e.type !== 'complite') return;  
            setTimeout(function () {  
                try {  
                    if (Lampa.Storage.get('show_all_buttons', false) !== true) return;  
  
                    var fullContainer = e.object.activity.render();  
                    var targetContainer = fullContainer.find('.full-start-new__buttons');  
                    if (!targetContainer.length) return;  
  
                    fullContainer.find('.button--play').remove();  
                    var allButtons = fullContainer.find('.buttons--container .full-start__button')  
                        .add(targetContainer.find('.full-start__button'));  
  
                    var categories = { online: [], torrent: [], trailer: [], other: [] };  
                    allButtons.each(function () {  
                        var $b = $(this);  
                        var cls = $b.attr('class') || '';  
                        if (cls.indexOf('online') !== -1) categories.online.push($b);  
                        else if (cls.indexOf('torrent') !== -1) categories.torrent.push($b);  
                        else if (cls.indexOf('trailer') !== -1) categories.trailer.push($b);  
                        else categories.other.push($b.clone(true));  
                    });  
  
                    var order = ['torrent', 'online', 'trailer', 'other'];  
                    targetContainer.empty();  
                    order.forEach(function (c) {  
                        categories[c].forEach(function ($b) { targetContainer.append($b); });  
                    });  
  
                    targetContainer.css({  
                        display: 'flex',  
                        flexWrap: 'wrap',  
                        gap: '10px',  
                        justifyContent: 'flex-start'  
                    });  
  
                    applyButtonTextMode();  
                    Lampa.Controller.toggle('full_start');  
                } catch (err) {  
                    console.error('[ShowAllButtons] Error:', err);  
                }  
            }, 200);  
        });  
    }  
  
    // --- Застосування стилю для тексту на кнопках ---  
    function applyButtonTextMode() {  
        var mode = Lampa.Storage.get('button_text_mode', 'default');  
        $('#button_text_mode_style').remove();  
  
        var css = '';  
        if (mode === 'show') {  
            css = '.full-start-new__buttons .full-start__button span { display:inline !important; }';  
        } else if (mode === 'hide') {  
            css = '.full-start-new__buttons .full-start__button span { display:none !important; }';  
        }  
  
        if (css) {  
            $('body').append('<style id="button_text_mode_style">' + css + '</style>');  
        }  
    }  
  
    // --- Налаштування ---  
    function Settings() {  
    // Реєструємо параметри перед використанням  
    if (typeof Lampa.Params !== 'undefined') {  
        Lampa.Params.trigger('show_all_buttons', false);  
        Lampa.Params.trigger('button_text_mode', 'default');  
    }  
  
    // 1. Опція: показувати всі кнопки  
    Lampa.SettingsApi.addParam({  
        component: 'interface_customization',  
        param: {   
            name: 'show_all_buttons',   
            type: 'trigger',   
            default: false   
        },  
        field: {  
            name: '<div style="display: flex; align-items: center;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" xml:space="preserve" width="32" height="32"><path d="M12.387 14.713H3.813c-1.413 0 -2.563 -1.15 -2.563 -2.563V3.575C1.25 2.15 2.4 1 3.813 1h8.575c1.413 0 2.563 1.15 2.563 2.563v8.575c0 1.413 -1.15 2.575 -2.563 2.575M3.813 2.475c-0.613 0 -1.1 0.487 -1.1 1.1v8.575c0 0.613 0.487 1.1 1.1 1.1h8.575c0.613 0 1.1 -0.487 1.1 -1.1V3.575c0 -0.613 -0.487 -1.1 -1.1 -1.1zM12.387 31H3.813c-1.413 0 -2.563 -1.15 -2.563 -2.563v-8.575c0 -1.413 1.15 -2.563 2.563 -2.563h8.575c1.413 0 2.563 1.15 2.563 2.563v8.575c0 1.413 -1.15 2.563 -2.563 2.563m-8.575 -12.25c-0.613 0 -1.1 0.5 -1.1 1.1v8.575c0 0.613 0.487 1.1 1.1 1.1h8.575c0.613 0 1.1 -0.487 1.1 -1.1v-8.575c0 -0.613 -0.487 -1.1 -1.1 -1.1zm24.375 0.938h-8.575c-1.438 0 -2.563 -1.45 -2.563 -3.313V4.313c0 -1.863 1.125 -3.313 2.563 -3.313h8.575C29.625 1 30.75 2.462 30.75 4.313V16.375c0 1.85 -1.125 3.313 -2.563 3.313M19.613 2.475c-0.525 0 -1.1 0.762 -1.1 1.85V16.375c0 1.087 0.575 1.85 1.1 1.85h8.575c0.525 0 1.1 -0.762 1.1 -1.85V4.313c0 -1.087 -0.575 -1.85 -1.1 -1.85h-8.575zM28.188 31h-8.575c-1.438 0 -2.563 -0.887 -2.563 -2.013v-5.963c0 -1.125 1.125 -2.013 2.563 -2.013h8.575c1.438 0 2.563 0.887 2.563 2.013v5.963c0 1.125 -1.125 2.013 -2.563 2.013m-8.575 -8.525c-0.662 0 -1.1 0.325 -1.1 0.55v5.963c0 0.212 0.438 0.55 1.1 0.55h8.575c0.662 0 1.1 -0.325 1.1 -0.55v-5.963c0 -0.212 -0.438 -0.55 -1.1 -0.55z"/></svg>' + Lampa.Lang.translate('show_all_buttons_name') + '</div>',  
            description: Lampa.Lang.translate('show_all_buttons_desc')  
        },  
        onChange: function (value) {  
            Lampa.Storage.set('show_all_buttons', value);  
            setTimeout(function () {  
                Lampa.Noty.show(Lampa.Lang.translate('reloading') || 'Перезавантаження...');  
                location.reload();  
            }, 300);  
        }  
    });  
  
    // 2. Опція: режим тексту на кнопках  
    Lampa.SettingsApi.addParam({  
        component: 'interface_customization',  
        param: {  
            name: 'button_text_mode',  
            type: 'select',  
            values: {  
                'default': Lampa.Lang.translate('button_text_mode_default'),  
                'show': Lampa.Lang.translate('button_text_mode_show'),  
                'hide': Lampa.Lang.translate('button_text_mode_hide')  
            },  
            default: 'default'  
        },  
        field: {  
            name: '<div style="display: flex; align-items: center;"><svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="32" height="32"><path d="M11.85 14.775H3.688c-1.35 0-2.438-1.1-2.438-2.438V4.175c0-1.35 1.1-2.438 2.438-2.438h8.162c1.35 0 2.438 1.1 2.438 2.438v8.162c.013 1.35-1.087 2.438-2.438 2.438M3.688 3.125c-.575 0-1.05.475-1.05 1.05v8.162c0 .575.475 1.05 1.05 1.05h8.162c.575 0 1.05-.475 1.05-1.05V4.175c0-.575-.475-1.05-1.05-1.05zm8.162 27.137H3.688c-1.35 0-2.438-1.1-2.438-2.438v-8.162c0-1.35 1.1-2.438 2.438-2.438h8.162c1.35 0 2.438 1.1 2.438 2.438v8.162c.013 1.337-1.087 2.438-2.438 2.438m-8.162-11.65c-.575 0-1.05.475-1.05 1.05v8.162c0 .575.475 1.05 1.05 1.05h8.162c.575 0 1.05-.475 1.05-1.05v-8.162c0-.575-.475-1.05-1.05-1.05zm14.713-13H30.75v1.863H18.4zm0 5.1H30.75v1.863H18.4zm0 9.55H30.75v1.863H18.4zm0 5.1H30.75v1.863H18.4z"/></svg>' + Lampa.Lang.translate('button_text_mode_name') + '</div>',  
            description: Lampa.Lang.translate('button_text_mode_desc')  
        },  
        onChange: function (value) {  
            Lampa.Storage.set('button_text_mode', value);  
            applyButtonTextMode();  
        }  
    });  
} 
  
    // --- Ініціалізація ---  
    function init() {  
        Lang();  
        Settings();  
        applyButtonTextMode();  
        applyShowAllButtons();  
  
        Lampa.Listener.follow('full', function (e) {  
            if (e.type === 'complite') {  
                applyButtonTextMode();  
                if (Lampa.Storage.get('show_all_buttons', false)) applyShowAllButtons();  
            }  
        });  
    }  
  
    // --- Запуск ---  
    if (window.appready) init();  
    else {  
        Lampa.Listener.follow('app', function (e) {  
            if (e.type === 'ready') init();  
        });  
    }  
})();
